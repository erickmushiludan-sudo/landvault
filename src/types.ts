export type LandType = 'Agricultural' | 'Residential' | 'Commercial' | 'Mixed Use' | 'Industrial' | 'Forest / Conservation';

export type ListingStatus = 'available' | 'sold' | 'reserved';

export type ApprovalStatus = 'approved' | 'pending' | 'rejected';

export interface ContactInfo {
  name: string;
  phone: string;
  email: string | null;
  preferred: 'Simu' | 'WhatsApp' | 'Barua Pepe' | 'Njia Yoyote' | 'Phone' | 'Email' | 'Any';
  role: string;
  notes: string | null;
}

export interface LandListing {
  id: string;
  title: string;
  type: LandType;
  status?: ListingStatus; // 'available' (Inauzwa), 'sold' (Imeshauzwa), 'reserved' (Imewekewa Nafasi)
  approvalStatus?: ApprovalStatus; // 'approved' (inaonekana kwa umma), 'pending' (inasubiri malipo/idhini ya admin), 'rejected'
  paymentConfirmed?: boolean;
  approvedAt?: string | null;
  adminNotes?: string | null;
  price: number;
  size: number;
  unit: string;
  region: string;
  district: string;
  ward: string;
  village: string;
  lat: string | null;
  lon: string | null;
  road: string | null;
  roadcond: string;
  deed: string;
  topo: string;
  soil: string;
  utilities: string[];
  amenities: string | null;
  desc: string;
  contact: ContactInfo;
  images: string[];
  videoUrl?: string | null;
  videoTitle?: string | null;
  videoFileName?: string | null;
  videoSize?: number | null;
  plotNumber?: string | null;
  beaconsPlaced?: boolean;
  leasePeriod?: string | null;
  paymentTerms?: string | null;
  waterDetails?: string | null;
  electricityDetails?: string | null;
  featured: boolean;
  color: string;
  createdAt: string; // ISO string
}

export interface ListingFilters {
  searchQuery?: string;
  region?: string;
  type?: string;
  status?: ListingStatus | 'all';
  approvalStatus?: ApprovalStatus | 'all';
  maxPrice?: number;
  minSize?: number;
  hasVideo?: boolean;
  verifiedDeedOnly?: boolean;
}
