import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from './firebase';

const DB_NAME = 'LandVaultMediaDB';
const STORE_NAME = 'videos';

function openIndexedDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function saveVideoLocally(id: string, file: Blob): Promise<string> {
  try {
    const db = await openIndexedDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    store.put(file, id);
    await new Promise((res, rej) => {
      tx.oncomplete = res;
      tx.onerror = rej;
    });
    return `indexeddb://${id}`;
  } catch (e) {
    console.warn('IndexedDB video cache failed, using memory URL', e);
    return URL.createObjectURL(file);
  }
}

export async function getLocalVideo(id: string): Promise<string | null> {
  try {
    const db = await openIndexedDB();
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const req = store.get(id);
    return new Promise((resolve) => {
      req.onsuccess = () => {
        if (req.result instanceof Blob) {
          resolve(URL.createObjectURL(req.result));
        } else {
          resolve(null);
        }
      };
      req.onerror = () => resolve(null);
    });
  } catch {
    return null;
  }
}

/**
 * Upload video file. Attempts Firebase Storage first, falls back gracefully to IndexedDB or base64.
 */
export async function uploadLandVideo(
  file: File, 
  onProgress?: (pct: number) => void
): Promise<{ url: string; fileName: string; size: number }> {
  const cleanFileName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
  const storagePath = `land_videos/${Date.now()}_${cleanFileName}`;

  try {
    if (onProgress) onProgress(20);
    const storageRef = ref(storage, storagePath);
    const snapshot = await uploadBytes(storageRef, file);
    if (onProgress) onProgress(80);
    const downloadUrl = await getDownloadURL(snapshot.ref);
    if (onProgress) onProgress(100);
    return {
      url: downloadUrl,
      fileName: file.name,
      size: file.size
    };
  } catch (storageError) {
    console.warn('Firebase Storage direct upload not available, saving video in persistent browser storage:', storageError);
    // If file is under 600KB, read as base64 so it can be stored in document directly
    if (file.size <= 650000) {
      const dataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
      if (onProgress) onProgress(100);
      return {
        url: dataUrl,
        fileName: file.name,
        size: file.size
      };
    }

    // Otherwise, save in persistent IndexedDB
    const videoId = `video_${Date.now()}_${cleanFileName}`;
    await saveVideoLocally(videoId, file);
    const blobUrl = URL.createObjectURL(file);
    if (onProgress) onProgress(100);
    return {
      url: blobUrl,
      fileName: file.name,
      size: file.size
    };
  }
}
