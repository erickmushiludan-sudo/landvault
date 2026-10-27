import { 
  collection, 
  onSnapshot, 
  addDoc, 
  getDocs, 
  limit, 
  query, 
  orderBy,
  QueryConstraint,
  doc,
  updateDoc,
  deleteDoc
} from 'firebase/firestore';
import { db, auth } from './firebase';
import { LandListing, LandType, ListingStatus, ApprovalStatus } from '../types';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): Error {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  return new Error(JSON.stringify(errInfo));
}

const COLLECTION_NAME = 'listings';

const sampleListings: Omit<LandListing, 'id' | 'createdAt'>[] = [
  {
    title: 'Hekari 15 Kigamboni – Karibu na Bahari (Beachfront)',
    type: 'Residential',
    price: 180000000,
    size: 15,
    unit: 'Ekari',
    region: 'Dar es Salaam',
    district: 'Kigamboni',
    ward: 'Kimbiji',
    village: 'Mbutu',
    lat: '-6.9124',
    lon: '39.3821',
    road: 'mita 200 kutoka barabara mpya ya lami',
    roadcond: 'Barabara ya Lami',
    deed: 'Hati Miliki Iliyosajiliwa (CCRO/Hati)',
    topo: 'Bapa / Tambarare',
    soil: 'Udongo wa Mchanga',
    utilities: ['Water', 'Electricity', 'Internet', 'Fence'],
    amenities: 'mita 500 kutoka shule ya msingi, mita 800 zahanati ya Kimbiji, karibu na miradi mipya ya makazi',
    desc: 'Eneo zuri sana la makazi au mradi wa nyumba za kupumzika (resorts/villas) liliopo Kigamboni, mita chache kutoka ufukwe wa bahari ya Hindi. Udongo mzuri usio na mafuriko, upepo mwanana, na huduma zote za kijamii zimeshafika.',
    contact: {
      name: 'Erick Mushi',
      phone: '+255 765 432 109',
      email: 'erick@landvault.co.tz',
      preferred: 'WhatsApp',
      role: 'Mmiliki / Muuzaji wa Moja kwa Moja',
      notes: 'Hati miliki ipo mikononi safi haina mgogoro wowote. Piga simu au tuma ujumbe kwa maelezo zaidi.'
    },
    images: [
      'https://images.unsplash.com/photo-1499028344343-cd173ffc68a9?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80'
    ],
    videoUrl: 'https://www.youtube.com/watch?v=0kGk8bMsw18',
    videoTitle: 'Tazama Mandhari ya Angani (Drone Footage) – Kigamboni Beachfront',
    plotNumber: 'Plot 412, Block C',
    beaconsPlaced: true,
    leasePeriod: 'Miaka 99 (Hati Kamili)',
    paymentTerms: 'Cash au Awamu 3 (Ndani ya miezi 6)',
    waterDetails: 'Maji safi ya kisima na mtandao wa DAWASA umefika mtaani',
    electricityDetails: 'Umeme wa TANESCO upo jirani mita 50 tu',
    featured: true,
    color: 'from-green'
  },
  {
    title: 'Shamba la Kilimo Bora Kibaigwa – Dodoma',
    type: 'Agricultural',
    price: 24000000,
    size: 25,
    unit: 'Ekari',
    region: 'Dodoma',
    district: 'Kongwa',
    ward: 'Kibaigwa',
    village: 'Mlanga',
    lat: '-6.1284',
    lon: '36.2104',
    road: 'km 2 kutoka Barabara Kuu ya Dodoma–Morogoro',
    roadcond: 'Barabara ya Changarawe',
    deed: 'Cheti cha Ardhi ya Kijiji',
    topo: 'Bapa / Tambarare',
    soil: 'Udongo wa Mbolea',
    utilities: ['Water', 'Borehole'],
    amenities: 'km 1.5 soko kuu la mazao Kibaigwa, kilomita 3 zahanati na shule',
    desc: 'Shamba kubwa na lenye rutuba ya asili, linafaa sana kwa kilimo cha mahindi, alizeti, mtama au karanga. Eneo lipo tambarare kabisa, linafikika kirahisi kwa matrekta na malori ya kusafirisha mazao wakati wa mavuno.',
    contact: {
      name: 'Salma Rashid',
      phone: '+255 655 112 233',
      email: 'salma@landvault.co.tz',
      preferred: 'Simu',
      role: 'Mwakilishi wa Familia',
      notes: 'Mashamba haya yamepimwa na Serikali ya Kijiji na yana vibali vyote halali vya mauzo.'
    },
    images: [
      'https://images.unsplash.com/photo-1500534314209-a9c8ff223c5d?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1200&q=80'
    ],
    videoUrl: 'https://www.youtube.com/watch?v=y9p9e90w81Y',
    videoTitle: 'Video ya Matembezi Shambani na Ukaguzi wa Mipaka',
    plotNumber: 'Shamba Na. 18B - Kibaigwa Mashariki',
    beaconsPlaced: true,
    leasePeriod: 'Hati ya Kijiji ya Kudumu',
    paymentTerms: 'Maelewano / Malipo ya Awamu baada ya mavuno',
    waterDetails: 'Kisima kirefu cha maji ya asili',
    electricityDetails: 'Solar inatumika kwa sasa, nguzo za REA ziko mita 300',
    featured: true,
    color: 'from-amber'
  },
  {
    title: 'Kiwanja cha Makazi Ngaramtoni – Arusha na Mtazamo wa Mount Meru',
    type: 'Residential',
    price: 48000000,
    size: 1.2,
    unit: 'Ekari',
    region: 'Arusha',
    district: 'Arumeru',
    ward: 'Ngaramtoni',
    village: 'Olmotonyi',
    lat: '-3.3412',
    lon: '36.6534',
    road: 'mita 50 kutoka barabara ya lami ya Arusha–Namanga',
    roadcond: 'Barabara ya Lami',
    deed: 'Hati Miliki Iliyosajiliwa (CCRO/Hati)',
    topo: 'Mteremko Mdogo',
    soil: 'Udongo wa Mbolea',
    utilities: ['Water', 'Electricity', 'Internet'],
    amenities: 'karibu sana na Chuo cha Misitu Olmotonyi, shule za kimataifa, na maduka',
    desc: 'Eneo la kipekee lenye mtazamo mzuri (panoramic view) wa Mlima Meru. Hali ya hewa ni nzuri sana na ya ubaridi wa kupendeza mwaka mzima. Kiwanja kimeshafanyiwa usafi wa kutosha na kipo tayari kwa ajili ya ujenzi wa nyumba ya ndoto yako.',
    contact: {
      name: 'Frank Temu',
      phone: '+255 784 990 011',
      email: 'frank.temu@landvault.co.tz',
      preferred: 'WhatsApp',
      role: 'Wakala wa Ardhi Aliye na Leseni',
      notes: 'Hati safi. Tunaweza kupanga siku ya kwenda kukagua eneo bure kabisa.'
    },
    images: [
      'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=1200&q=80'
    ],
    videoUrl: 'https://www.youtube.com/watch?v=0kGk8bMsw18',
    videoTitle: 'Mtazamo wa Mlima Meru & Mandhari ya Kiwanja',
    plotNumber: 'Plot 88, Block F',
    beaconsPlaced: true,
    leasePeriod: 'Miaka 99 (Hati Safi)',
    paymentTerms: 'Cash au Mkopo wa Benki (Bank Mortgage)',
    waterDetails: 'Maji ya AUWSA yapo kiwanjani',
    electricityDetails: 'TANESCO tayari ina mita ya luku',
    featured: false,
    color: 'from-cyan'
  },
  {
    title: 'Eneo la Biashara / Hoteli Nungwi Beach – Zanzibar',
    type: 'Commercial',
    price: 340000000,
    size: 0.8,
    unit: 'Ekari',
    region: 'Zanzibar',
    district: 'Kaskazini A',
    ward: 'Nungwi',
    village: 'Nungwi Mjini',
    lat: '-5.7258',
    lon: '39.2982',
    road: 'njia inayopitika kirahisi kwa gari hadi ufukweni',
    roadcond: 'Barabara ya Changarawe',
    deed: 'Hati Miliki Iliyosajiliwa (CCRO/Hati)',
    topo: 'Bapa / Tambarare',
    soil: 'Udongo wa Mchanga',
    utilities: ['Water', 'Electricity', 'Internet', 'Fence'],
    amenities: 'mita 150 kutoka ufukwe maarufu wa Nungwi, karibu na hoteli kubwa za kitalii na migahawa',
    desc: 'Fursa adhimu ya uwekezaji Zanzibar! Kiwanja hiki cha biashara kipo katika moja ya maeneo yanayotembelewa zaidi na watalii duniani huko Nungwi. Kinafaa sana kwa ujenzi wa boutique hotel, spa ya kifahari, au mgahawa wa kisasa wa ghorofa.',
    contact: {
      name: 'Khamis Ali',
      phone: '+255 777 445 566',
      email: 'khamis@landvault.co.tz',
      preferred: 'Njia Yoyote',
      role: 'Mmiliki / Muuzaji wa Moja kwa Moja',
      notes: 'Nyaraka zote za ZIPA (Zanzibar Investment Promotion Authority) na vibali vya ardhi vipo sawa na vimesajiliwa.'
    },
    images: [
      'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&w=1200&q=80'
    ],
    videoUrl: 'https://www.youtube.com/watch?v=0kGk8bMsw18',
    videoTitle: 'Ziara ya Nungwi Beachfront & Ukaribu na Bahari',
    plotNumber: 'Plot 12, ZIPA Tourism Zone',
    beaconsPlaced: true,
    leasePeriod: 'Miaka 66 (Mkataba wa Uwekezaji)',
    paymentTerms: 'Fedha za Kigeni (USD) au TZS, Awamu 2',
    waterDetails: 'ZAWA na kisima cha maji baridi',
    electricityDetails: 'ZECO umeme upo tayari',
    featured: true,
    status: 'reserved',
    color: 'from-purple'
  },
  {
    title: 'Viwanja vya Viwanda na Maghala Mlandizi – Pwani',
    type: 'Industrial',
    price: 95000000,
    size: 5,
    unit: 'Ekari',
    region: 'Pwani',
    district: 'Kibaha',
    ward: 'Mlandizi',
    village: 'Disunyara',
    lat: '-6.7214',
    lon: '38.7423',
    road: 'km 3 kutoka barabara kuu ya Morogoro–Dar (TANROAD)',
    roadcond: 'Barabara ya Changarawe',
    deed: 'Hati Miliki Iliyosajiliwa (CCRO/Hati)',
    topo: 'Bapa / Tambarare',
    soil: 'Udongo wa Udongo',
    utilities: ['Electricity', 'Water'],
    amenities: 'km 3 kituo cha Polisi cha Mlandizi, km 4 soko kuu na vituo vya usafiri',
    desc: 'Viwanja vipo katika eneo maalum lililotengwa kwa ajili ya viwanda vya kati, maghala makubwa (warehouses), au yadi za malori. Umeme wa msongo mkubwa (Tanesco Industrial Phase 3) upo jirani kabisa.',
    contact: {
      name: 'John Malima',
      phone: '+255 715 889 900',
      email: 'john@landvault.co.tz',
      preferred: 'Simu',
      role: 'Wakala wa Ardhi Aliye na Leseni',
      notes: 'Hati ina jina la kampuni na iko tayari kwa uhamisho wa haraka (transfer of ownership).'
    },
    images: [
      'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1200&q=80'
    ],
    videoUrl: null,
    plotNumber: 'Industrial Zone Block 5',
    beaconsPlaced: true,
    leasePeriod: 'Miaka 99',
    paymentTerms: 'Cash',
    waterDetails: 'Mamlaka ya Maji DAWASA',
    electricityDetails: 'High Voltage Phase 3 TANESCO',
    featured: false,
    status: 'sold',
    color: 'from-blue'
  },
  {
    title: 'Hekari 80 za Kilimo cha Umwagiliaji na Matunda – Kilosa, Morogoro',
    type: 'Agricultural',
    price: 64000000,
    size: 80,
    unit: 'Ekari',
    region: 'Morogoro',
    district: 'Kilosa',
    ward: 'Mikumi',
    village: 'Chanzige',
    lat: '-7.2145',
    lon: '36.9841',
    road: 'njia inayopitika kwa trekta na pick-up katika kipindi chote',
    roadcond: 'Njia ya Udongo',
    deed: 'Cheti cha Ardhi ya Kijiji',
    topo: 'Bapa / Tambarare',
    soil: 'Udongo wa Mbolea',
    utilities: ['Water', 'River'],
    amenities: 'Inapakana na mto wenye maji msimu mzima, km 15 hadi barabara ya lami ya Mikumi',
    desc: 'Shamba hili linapakana moja kwa moja na mto wa kudumu, na kufanya kilimo cha umwagiliaji kuwa cha uhakika sana wakati wote wa kiangazi. Udongo mweusi wenye rutuba ya asili unaofaa sana kwa kilimo cha miwa, mpunga, ndizi, na parachichi.',
    contact: {
      name: 'Amina Hassan',
      phone: '+255 754 556 677',
      email: 'amina.hassan@landvault.co.tz',
      preferred: 'WhatsApp',
      role: 'Mmiliki / Muuzaji wa Moja kwa Moja',
      notes: 'Nyaraka zote za serikali ya kijiji na dokezo la baraza la ardhi vipo.'
    },
    images: [
      'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80'
    ],
    videoUrl: null,
    plotNumber: 'Shamba Na. 4, Bonde la Chanzige',
    beaconsPlaced: false,
    leasePeriod: 'Hati ya Kijiji',
    paymentTerms: 'Awamu 2',
    waterDetails: 'Mto unaopita mpakani mwa shamba mwaka mzima',
    electricityDetails: 'Hakuna umeme, jua la kutosha kwa ajili ya solar',
    featured: false,
    color: 'from-green'
  }
];

/**
 * Seed database with sample listings if it's empty
 */
export async function seedDatabaseIfEmpty() {
  try {
    const q = query(collection(db, COLLECTION_NAME), limit(1));
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
      console.log('Seeding LandVault database with premium Tanzanian land listings...');
      for (const listing of sampleListings) {
        await addDoc(collection(db, COLLECTION_NAME), {
          ...listing,
          createdAt: new Date().toISOString()
        });
      }
      console.log('Seeding completed successfully!');
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, COLLECTION_NAME);
  }
}

/**
 * Subscribe to listings with scalable query limits and real-time updates.
 * Designed to seamlessly handle tens of thousands of listings without network bottleneck.
 * 
 * @param onUpdate Callback with loaded listings and whether more are available
 * @param onError Error handler
 * @param fetchLimit Maximum items to fetch in this batch (default 24)
 */
export function subscribeToListings(
  onUpdate: (listings: LandListing[], hasMore: boolean) => void, 
  onError?: (err: Error) => void,
  fetchLimit: number = 24
) {
  // Query with limit so it easily scales to thousands of records
  const listingsCol = collection(db, COLLECTION_NAME);
  const q = query(
    listingsCol, 
    limit(fetchLimit)
  );

  // Attempt seeding in background if brand new db
  seedDatabaseIfEmpty();

  // Establish live real-time subscription
  return onSnapshot(q, (snapshot) => {
    const listings: LandListing[] = [];
    snapshot.forEach((doc) => {
      const data = doc.data();
      listings.push({
        id: doc.id,
        title: data.title || '',
        type: (data.type || 'Residential') as LandType,
        status: (data.status as ListingStatus) || 'available',
        approvalStatus: (data.approvalStatus as ApprovalStatus) || 'approved',
        paymentConfirmed: data.paymentConfirmed === undefined ? true : !!data.paymentConfirmed,
        approvedAt: data.approvedAt || null,
        adminNotes: data.adminNotes || null,
        price: Number(data.price) || 0,
        size: Number(data.size) || 0,
        unit: data.unit || 'Ekari',
        region: data.region || 'Tanzania',
        district: data.district || '',
        ward: data.ward || '',
        village: data.village || '',
        lat: data.lat || null,
        lon: data.lon || null,
        road: data.road || null,
        roadcond: data.roadcond || 'Barabara ya Changarawe',
        deed: data.deed || 'Hati Miliki',
        topo: data.topo || 'Bapa / Tambarare',
        soil: data.soil || 'Udongo wa Mbolea',
        utilities: Array.isArray(data.utilities) ? data.utilities : [],
        amenities: data.amenities || null,
        desc: data.desc || '',
        contact: {
          name: data.contact?.name || 'Mawasiliano',
          phone: data.contact?.phone || '',
          email: data.contact?.email || null,
          preferred: data.contact?.preferred || 'Njia Yoyote',
          role: data.contact?.role || 'Mmiliki',
          notes: data.contact?.notes || null
        },
        images: Array.isArray(data.images) ? data.images : [],
        videoUrl: data.videoUrl || null,
        videoTitle: data.videoTitle || null,
        videoFileName: data.videoFileName || null,
        videoSize: data.videoSize ? Number(data.videoSize) : null,
        plotNumber: data.plotNumber || null,
        beaconsPlaced: !!data.beaconsPlaced,
        leasePeriod: data.leasePeriod || null,
        paymentTerms: data.paymentTerms || null,
        waterDetails: data.waterDetails || null,
        electricityDetails: data.electricityDetails || null,
        featured: !!data.featured,
        color: data.color || 'from-green',
        createdAt: data.createdAt || new Date().toISOString()
      });
    });

    // Sort listings: Featured first, then by creation date descending
    listings.sort((a, b) => {
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    const hasMore = snapshot.size >= fetchLimit;
    onUpdate(listings, hasMore);
  }, (err) => {
    const firestoreErr = handleFirestoreError(err, OperationType.LIST, COLLECTION_NAME);
    if (onError) onError(firestoreErr);
  });
}

/**
 * Add a new land listing to the database with all comprehensive metadata
 */
export async function addListing(listing: Omit<LandListing, 'id' | 'createdAt'>): Promise<string> {
  try {
    const listingsCol = collection(db, COLLECTION_NAME);
    const docRef = await addDoc(listingsCol, {
      ...listing,
      status: listing.status || 'available',
      approvalStatus: listing.approvalStatus || 'pending',
      paymentConfirmed: listing.paymentConfirmed !== undefined ? listing.paymentConfirmed : false,
      adminNotes: listing.adminNotes || null,
      createdAt: new Date().toISOString()
    });
    return docRef.id;
  } catch (error) {
    throw handleFirestoreError(error, OperationType.CREATE, COLLECTION_NAME);
  }
}

/**
 * Update the availability status of a listing (e.g. available, sold, reserved)
 */
export async function updateListingStatus(listingId: string, status: ListingStatus): Promise<void> {
  try {
    const docRef = doc(db, COLLECTION_NAME, listingId);
    await updateDoc(docRef, { status });
  } catch (error) {
    throw handleFirestoreError(error, OperationType.UPDATE, `${COLLECTION_NAME}/${listingId}`);
  }
}

/**
 * Approve, reject, or mark payment confirmed on a listing by admin
 */
export async function updateListingApproval(
  listingId: string, 
  approvalStatus: ApprovalStatus, 
  paymentConfirmed: boolean = true,
  adminNotes?: string
): Promise<void> {
  try {
    const docRef = doc(db, COLLECTION_NAME, listingId);
    const updatePayload: Record<string, any> = {
      approvalStatus,
      paymentConfirmed,
      approvedAt: approvalStatus === 'approved' ? new Date().toISOString() : null
    };
    if (adminNotes !== undefined) {
      updatePayload.adminNotes = adminNotes;
    }
    await updateDoc(docRef, updatePayload);
  } catch (error) {
    throw handleFirestoreError(error, OperationType.UPDATE, `${COLLECTION_NAME}/${listingId}`);
  }
}

/**
 * Delete a listing from Firestore (admin moderation)
 */
export async function deleteListingDoc(listingId: string): Promise<void> {
  try {
    const docRef = doc(db, COLLECTION_NAME, listingId);
    await deleteDoc(docRef);
  } catch (error) {
    throw handleFirestoreError(error, OperationType.DELETE, `${COLLECTION_NAME}/${listingId}`);
  }
}
