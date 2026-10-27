import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyC6G4hwZlcxe_tHuldvtyIK1El2K6I_3E0",
  authDomain: "uplifted-citadel-s6d0h.firebaseapp.com",
  projectId: "uplifted-citadel-s6d0h",
  storageBucket: "uplifted-citadel-s6d0h.firebasestorage.app",
  messagingSenderId: "331821290644",
  appId: "1:331821290644:web:e0736c6701062a6aaf1081"
};

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// Initialize Firestore with custom database ID
const db = getFirestore(app, "ai-studio-73aec017-5f28-4e07-80f5-eff9669a6caf");
const auth = getAuth(app);
const storage = getStorage(app);

export { db, auth, storage };
