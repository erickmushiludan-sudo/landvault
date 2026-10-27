import React, { useState, useEffect } from 'react';
import { 
  X, 
  MapPin, 
  Compass, 
  Phone, 
  MessageSquare, 
  ShieldCheck, 
  Check, 
  AlertCircle, 
  Share2, 
  Video, 
  Camera, 
  Layers, 
  Calendar,
  DollarSign,
  Maximize2,
  CheckCircle2,
  Clock,
  Tag
} from 'lucide-react';
import { LandListing, ListingStatus } from '../types';
import { getLocalVideo } from '../lib/videoUpload';
import { updateListingStatus, updateListingApproval } from '../lib/listingsService';
import { COMPANY_CONFIG } from '../lib/companyConfig';

interface ListingDetailsModalProps {
  listing: LandListing | null;
  lang: 'sw' | 'en';
  onClose: () => void;
  onStatusUpdated?: (listingId: string, newStatus: ListingStatus) => void;
}

export default function ListingDetailsModal({ listing, lang, onClose, onStatusUpdated }: ListingDetailsModalProps) {
  if (!listing) return null;

  const [activeMediaTab, setActiveMediaTab] = useState<'photos' | 'video'>(
    listing.videoUrl ? 'video' : 'photos'
  );
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);
  const [resolvedVideoUrl, setResolvedVideoUrl] = useState<string | null>(listing.videoUrl || null);
  const [currentStatus, setCurrentStatus] = useState<ListingStatus>(listing.status || 'available');
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [statusError, setStatusError] = useState<string | null>(null);

  useEffect(() => {
    if (listing) {
      setCurrentStatus(listing.status || 'available');
      setStatusError(null);
    }
  }, [listing]);

  useEffect(() => {
    if (listing?.videoUrl) {
      if (listing.videoUrl.startsWith('indexeddb://')) {
        const id = listing.videoUrl.replace('indexeddb://', '');
        getLocalVideo(id).then((url) => {
          if (url) setResolvedVideoUrl(url);
        });
      } else {
        setResolvedVideoUrl(listing.videoUrl);
      }
    } else {
      setResolvedVideoUrl(null);
    }
  }, [listing]);

  const handleStatusChange = async (newStatus: ListingStatus) => {
    if (newStatus === currentStatus) return;
    setUpdatingStatus(true);
    setStatusError(null);
    setCurrentStatus(newStatus);
    try {
      await updateListingStatus(listing.id, newStatus);
      listing.status = newStatus;
      if (onStatusUpdated) {
        onStatusUpdated(listing.id, newStatus);
      }
    } catch (e: any) {
      console.error('Failed to update status:', e);
      setCurrentStatus(listing.status || 'available');
      setStatusError(e.message || (lang === 'sw' ? 'Imeshindwa kusasisha hali' : 'Failed to update status'));
    } finally {
      setUpdatingStatus(false);
    }
  };

  const formatPrice = (p: number) => {
    if (p >= 1000000) return 'TSh ' + (p / 1000000).toFixed(1) + 'M';
    if (p >= 1000) return 'TSh ' + (p / 1000).toFixed(0) + 'K';
    return 'TSh ' + p.toLocaleString();
  };

  const getDeedClass = (deed: string) => {
    if (!deed) return 'bg-red-50 text-red-700 border-red-200';
    if (deed.includes('Registered') || deed.includes('Iliyosajiliwa')) {
      return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    }
    if (deed.includes('Pending') || deed.includes('Surveyed') || deed.includes('Ofa') || deed.includes('Kijiji') || deed.includes('Kupimwa')) {
      return 'bg-amber-50 text-amber-700 border-amber-200';
    }
    return 'bg-red-50 text-red-700 border-red-200';
  };

  const getDeedLong = (deed: string) => {
    if (!deed) return lang === 'sw' ? 'Hati Miliki Haipo' : 'No Official Deed';
    return deed;
  };

  const utilitiesList = [
    { key: 'Water', sw: '💧 Chanzo cha Maji / DAWASA', en: '💧 Water Source / Utility' },
    { key: 'Electricity', sw: '⚡ Umeme wa Tanesco', en: '⚡ Tanesco Power' },
    { key: 'Borehole', sw: '🔩 Kisima cha Maji', en: '🔩 Borehole Well' },
    { key: 'River', sw: '🌊 Mto / Kijito cha Asili', en: '🌊 River / Natural Stream' },
    { key: 'Internet', sw: '📶 Mtandao & Mawasiliano', en: '📶 Mobile Network & Data' },
    { key: 'Fence', sw: '🔒 Uzio Imara', en: '🔒 Secure Fencing' }
  ];

  const rawPhone = listing.contact.phone;
  const cleanPhone = rawPhone.replace(/[\s+\-()]/g, '');
  const isWhatsapp = listing.contact.preferred === 'WhatsApp';
  const whatsappMsg = currentStatus === 'sold'
    ? (lang === 'sw'
        ? `Habari, nimeona ardhi ya "${listing.title}" imeshauzwa kwenye LandVault. Je, una ardhi nyingine inayofanana nayo?`
        : `Hello, I noticed the property "${listing.title}" is marked as sold on LandVault. Do you have similar available land?`)
    : (lang === 'sw' 
        ? `Habari, nina nia ya kununua ardhi yako kwenye LandVault: "${listing.title}"`
        : `Hello, I am interested in your land listing on LandVault: "${listing.title}"`);
  const contactHref = isWhatsapp 
    ? `https://wa.me/${cleanPhone}?text=${encodeURIComponent(whatsappMsg)}` 
    : `tel:${rawPhone}`;

  // Convert raw video URL to safe embed URL
  const getEmbedUrl = (rawUrl?: string | null): string | null => {
    if (!rawUrl) return null;
    const url = rawUrl.trim();
    const ytMatch = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
    if (ytMatch && ytMatch[1]) {
      return `https://www.youtube.com/embed/${ytMatch[1]}`;
    }
    const vimeoMatch = url.match(/vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/(?:[^\/]*)\/videos\/|album\/(?:\d+)\/video\/|)(\d+)(?:$|\/|\?)/);
    if (vimeoMatch && vimeoMatch[1]) {
      return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
    }
    return url;
  };

  const colors: Record<string, string> = {
    'from-green': 'bg-gradient-to-tr from-[#0D2B1A] via-[#1A4029] to-[#2D6845]',
    'from-blue': 'bg-gradient-to-tr from-[#0D1B2B] via-[#1A2E40] to-[#2D4568]',
    'from-amber': 'bg-gradient-to-tr from-[#2A1E0D] via-[#402C1A] to-[#684E2D]',
    'from-purple': 'bg-gradient-to-tr from-[#1E0D2A] via-[#2F1A40] to-[#512D68]',
    'from-cyan': 'bg-gradient-to-tr from-[#0D252A] via-[#1A3A40] to-[#2D5B68]'
  };

  const headerGradient = colors[listing.color] || colors['from-green'];
  const isSold = currentStatus === 'sold';
  const isReserved = currentStatus === 'reserved';

  const t = {
    sw: {
      about: 'Kuhusu Ardhi Hii & Fursa Zake',
      utilities: 'Huduma na Miundombinu',
      amenities: 'Huduma za Karibu / Mazingira',
      contactSeller: 'Wasiliana na Muuzaji',
      role: 'Nafasi ya muuzaji',
      preferred: 'Njia inayopendekezwa',
      location: 'Mahali ilipo',
      specs: 'Sifa za Kiufundi & Mipaka',
      deed: 'Hati ya Ardhi',
      gps: 'GPS Coordinates',
      roadDist: 'Umbali kutoka barabara kuu',
      topo: 'Topografia',
      soil: 'Aina ya Udongo',
      roadAccess: 'Hali ya barabara',
      notes: 'Maelezo ya muuzaji',
      contactBtn: 'Wasiliana Sasa ↗',
      contactBtnSold: 'Ulizia Ardhi Nyingine Kama Hii ↗',
      photosTab: 'Picha za Ardhi',
      videoTab: 'Video ya Ukaguzi / Tour',
      noVideo: 'Hakuna video iliyopakiwa kwa ardhi hii bado.',
      plotNo: 'Nambari ya Kiwanja / Block',
      beacons: 'Vigingi vya Mipaka',
      beaconsYes: '✓ Vigingi Vimesimikwa',
      beaconsNo: 'Bado Havijasimikwa',
      paymentTerms: 'Masharti ya Malipo',
      leasePeriod: 'Muda wa Hati / Umiliki',
      waterDetail: 'Chanzo cha Maji',
      elecDetail: 'Muunganisho wa Umeme',
      statusControlTitle: 'Hali ya Ardhi Hii (Miliki & Mauzo):',
      statusAvailable: 'Inauzwa (Available)',
      statusReserved: 'Nafasi Imewekwa (Reserved)',
      statusSold: 'Imeshauzwa (Sold)',
      soldBanner: 'ARDHI HII IMESHAUZWA (HAIPATIKANI TENA SOKONI)',
      reservedBanner: 'ARDHI HII IMEWEKEWA NAFASI (MAZUNGUMZO YANAENDELEA)'
    },
    en: {
      about: 'About This Land & Opportunities',
      utilities: 'Utilities & Infrastructure',
      amenities: 'Nearby Amenities / Surroundings',
      contactSeller: 'Contact the Seller',
      role: 'Seller Role',
      preferred: 'Preferred Contact Method',
      location: 'Exact Location',
      specs: 'Technical Specifications & Boundaries',
      deed: 'Title Deed Status',
      gps: 'GPS Coordinates',
      roadDist: 'Distance to Highway',
      topo: 'Topography',
      soil: 'Soil Type',
      roadAccess: 'Road Access',
      notes: 'Seller Instructions',
      contactBtn: 'Contact Now ↗',
      contactBtnSold: 'Inquire for Similar Properties ↗',
      photosTab: 'Land Photos',
      videoTab: 'Video Tour / Walkthrough',
      noVideo: 'No video tour uploaded for this listing yet.',
      plotNo: 'Survey Plot / Block',
      beacons: 'Boundary Survey Beacons',
      beaconsYes: '✓ Survey Beacons Placed',
      beaconsNo: 'Not Placed Yet',
      paymentTerms: 'Payment Terms',
      leasePeriod: 'Lease Duration / Tenure',
      waterDetail: 'Water Supply Notes',
      elecDetail: 'Electricity Notes',
      statusControlTitle: 'Property Availability Status:',
      statusAvailable: 'Available For Sale',
      statusReserved: 'Under Offer / Reserved',
      statusSold: 'Sold Out / Bought',
      soldBanner: 'THIS LAND HAS BEEN BOUGHT / SOLD (OFF MARKET)',
      reservedBanner: 'THIS LAND IS CURRENTLY RESERVED (UNDER OFFER)'
    }
  }[lang];

  return (
    <div 
      className="fixed inset-0 bg-[#0D2B1A]/85 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-6 transition-opacity"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-3xl w-full max-w-4xl max-h-[94vh] overflow-y-auto shadow-2xl flex flex-col scale-100 transition-transform text-left"
        onClick={(e) => e.stopPropagation()}
      >
        {/* SOLD / RESERVED ALERT BANNER */}
        {isSold && (
          <div className="bg-red-600 text-white px-6 py-2.5 flex items-center justify-between text-xs font-bold tracking-wider uppercase shadow-md flex-shrink-0">
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-white" />
              {t.soldBanner}
            </span>
            <span className="bg-white/20 px-2 py-0.5 rounded text-[10px]">
              {lang === 'sw' ? 'IMEHAMISHWA' : 'SOLD'}
            </span>
          </div>
        )}
        {!isSold && isReserved && (
          <div className="bg-amber-500 text-[#0D2B1A] px-6 py-2.5 flex items-center justify-between text-xs font-bold tracking-wider uppercase shadow-md flex-shrink-0">
            <span className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#0D2B1A]" />
              {t.reservedBanner}
            </span>
            <span className="bg-black/10 px-2 py-0.5 rounded text-[10px]">
              {lang === 'sw' ? 'MAZUNGUMZO' : 'PENDING'}
            </span>
          </div>
        )}

        {/* Media Player / Gallery Header Container */}
        <div className="relative bg-[#091D12]">
          {/* Media Switcher Tab Header */}
          <div className="absolute top-4 left-4 z-20 flex items-center gap-2 bg-[#0D2B1A]/80 backdrop-blur-md p-1 rounded-full border border-white/10">
            <button
              onClick={() => setActiveMediaTab('photos')}
              className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full transition-all cursor-pointer ${
                activeMediaTab === 'photos'
                  ? 'bg-[#C9A84C] text-[#0D2B1A] shadow-sm font-bold'
                  : 'text-white/70 hover:text-white'
              }`}
            >
              <Camera className="w-3.5 h-3.5" />
              <span>{t.photosTab} ({listing.images?.length || 0})</span>
            </button>
            {listing.videoUrl && (
              <button
                onClick={() => setActiveMediaTab('video')}
                className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full transition-all cursor-pointer ${
                  activeMediaTab === 'video'
                    ? 'bg-[#C9A84C] text-[#0D2B1A] shadow-sm font-bold'
                    : 'text-white/70 hover:text-white'
                }`}
              >
                <Video className="w-3.5 h-3.5" />
                <span>{t.videoTab}</span>
              </button>
            )}
          </div>

          {/* Close button */}
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 z-20 bg-[#0D2B1A]/80 hover:bg-[#0D2B1A] border border-white/20 text-white rounded-full p-2 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Main Media Screen */}
          <div className="h-72 sm:h-96 relative overflow-hidden flex items-center justify-center">
            {activeMediaTab === 'video' && resolvedVideoUrl ? (
              /* Video Embed / Player */
              <div className="w-full h-full bg-black">
                {getEmbedUrl(resolvedVideoUrl)?.includes('embed') || getEmbedUrl(resolvedVideoUrl)?.includes('player.vimeo') ? (
                  <iframe
                    src={getEmbedUrl(resolvedVideoUrl) || ''}
                    title={listing.videoTitle || 'Land Video Tour'}
                    className="w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <video
                    src={resolvedVideoUrl}
                    controls
                    autoPlay
                    className="w-full h-full object-contain"
                  />
                )}
              </div>
            ) : listing.images && listing.images.length > 0 ? (
              /* Selected Photo */
              <img 
                src={listing.images[selectedPhotoIndex] || listing.images[0]} 
                alt={listing.title} 
                className={`w-full h-full object-cover transition-opacity duration-300 ${isSold ? 'grayscale-[30%]' : ''}`}
                referrerPolicy="no-referrer"
              />
            ) : (
              /* Geometric banner */
              <div className={`w-full h-full flex flex-col items-center justify-center ${headerGradient}`}>
                <Compass className="w-16 h-16 text-[#C9A84C]/60 mb-2 animate-pulse" />
                <span className="text-white/60 text-xs font-mono tracking-widest uppercase">LandVault Tanzania</span>
              </div>
            )}

            {/* Category and Status Pill */}
            <div className="absolute bottom-4 left-4 z-10 flex flex-wrap gap-2">
              <span className="bg-[#0D2B1A]/90 backdrop-blur-md border border-[#2D6845]/20 text-[#E8C96B] font-bold text-[10px] tracking-wider uppercase px-3.5 py-1.5 rounded-full">
                {lang === 'sw' ? (listing.type === 'Agricultural' ? 'Kilimo' : listing.type === 'Residential' ? 'Makazi' : listing.type === 'Commercial' ? 'Biashara' : listing.type === 'Industrial' ? 'Viwanda' : listing.type === 'Mixed Use' ? 'Mchanganyiko' : 'Hifadhi') : listing.type}
              </span>
              {isSold ? (
                <span className="bg-red-600 text-white font-extrabold text-[9px] tracking-widest uppercase px-3 py-1.5 rounded-full shadow-lg">
                  ✓ IMESHAUZWA
                </span>
              ) : isReserved ? (
                <span className="bg-amber-500 text-[#0D2B1A] font-extrabold text-[9px] tracking-widest uppercase px-3 py-1.5 rounded-full shadow-md">
                  ⏳ IMEWEKEWA NAFASI
                </span>
              ) : listing.featured ? (
                <span className="bg-[#C9A84C] text-[#0D2B1A] font-extrabold text-[9px] tracking-widest uppercase px-3 py-1.5 rounded-full">
                  ★ FEATURED
                </span>
              ) : null}
              {listing.beaconsPlaced && (
                <span className="bg-emerald-800/90 text-white font-bold text-[9px] tracking-wider px-3 py-1.5 rounded-full flex items-center gap-1">
                  <Check className="w-3 h-3 text-[#E8C96B]" />
                  {t.beaconsYes}
                </span>
              )}
            </div>
          </div>

          {/* Photo Gallery Thumbnails Bar */}
          {activeMediaTab === 'photos' && listing.images && listing.images.length > 1 && (
            <div className="bg-[#08180E] px-4 py-2 flex items-center gap-2 overflow-x-auto border-t border-white/10">
              {listing.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedPhotoIndex(i)}
                  className={`w-16 h-12 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-all cursor-pointer ${
                    selectedPhotoIndex === i ? 'border-[#C9A84C] scale-105' : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt={`Thumb ${i + 1}`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Modal Body */}
        <div className="p-6 md:p-10 flex-1 overflow-y-auto">
          {/* INTERACTIVE STATUS CONTROLLER (MARK AS SOLD / AVAILABLE / RESERVED) */}
          <div className="bg-[#FBF8F1] border border-[#E8D9B8] p-4 sm:p-5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 shadow-sm">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#7A9085] flex items-center gap-1.5 mb-1">
                <Tag className="w-3.5 h-3.5 text-[#C9A84C]" />
                {t.statusControlTitle}
              </span>
              <div className="text-sm font-bold text-[#0D2B1A] flex items-center gap-2">
                {currentStatus === 'sold' ? (
                  <span className="text-red-600 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    {lang === 'sw' ? 'Imeshauzwa (Mteja Ameshanunua)' : 'Sold Out / Already Bought'}
                  </span>
                ) : currentStatus === 'reserved' ? (
                  <span className="text-amber-700 flex items-center gap-1.5">
                    <Clock className="w-4 h-4" />
                    {lang === 'sw' ? 'Nafasi Imewekwa (Mazungumzo Yanaendelea)' : 'Reserved / Under Offer'}
                  </span>
                ) : (
                  <span className="text-emerald-700 flex items-center gap-1.5">
                    <Check className="w-4 h-4" />
                    {lang === 'sw' ? 'Inauzwa Sasa (Bado Ipo Sokoni)' : 'Available For Sale (Active)'}
                  </span>
                )}
                {updatingStatus && <span className="text-xs text-[#7A9085] animate-pulse">Inasasisha...</span>}
              </div>
            </div>

            {/* Quick Status Buttons */}
            <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-[#E8D9B8]/70 shadow-sm self-start sm:self-auto">
              <button
                type="button"
                onClick={() => handleStatusChange('available')}
                disabled={updatingStatus}
                className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  currentStatus === 'available' 
                    ? 'bg-emerald-700 text-white font-bold shadow-sm' 
                    : 'text-[#7A9085] hover:text-[#0D2B1A]'
                }`}
              >
                {t.statusAvailable}
              </button>
              <button
                type="button"
                onClick={() => handleStatusChange('reserved')}
                disabled={updatingStatus}
                className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  currentStatus === 'reserved' 
                    ? 'bg-amber-600 text-white font-bold shadow-sm' 
                    : 'text-[#7A9085] hover:text-[#0D2B1A]'
                }`}
              >
                {t.statusReserved}
              </button>
              <button
                type="button"
                onClick={() => handleStatusChange('sold')}
                disabled={updatingStatus}
                className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  currentStatus === 'sold' 
                    ? 'bg-red-600 text-white font-bold shadow-sm' 
                    : 'text-[#7A9085] hover:text-red-700'
                }`}
              >
                {t.statusSold}
              </button>
            </div>
          </div>

          {statusError && (
            <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{statusError}</span>
            </div>
          )}

          {/* Quick Header info */}
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 border-b border-[#E8D9B8]/40 pb-6 mb-8">
            <div>
              <h2 className="font-serif text-2xl md:text-4xl font-semibold text-[#0D2B1A] tracking-tight leading-snug">
                {listing.title}
              </h2>
              <div className="flex items-center gap-1.5 text-sm text-[#7A9085] font-light mt-2">
                <MapPin className="w-4 h-4 text-[#C9A84C]" />
                <span>{[listing.village, listing.ward, listing.district, listing.region].filter(Boolean).join(', ')}</span>
              </div>
            </div>
            
            <div className="md:text-right flex-shrink-0 flex flex-col items-start md:items-end">
              <div className="font-serif text-3xl md:text-4xl font-bold text-[#0D2B1A]">
                {formatPrice(listing.price)}
              </div>
              <div className="text-xs text-[#7A9085] font-light mt-1">
                {lang === 'sw' ? 'Jumla ya Eneo:' : 'Total Size:'} <span className="font-semibold text-[#2C3E35]">{listing.size} {listing.unit}</span>
              </div>
              <div className={`mt-3 border text-[10px] font-bold tracking-wider rounded-full px-3 py-1.5 shadow-inner ${getDeedClass(listing.deed)}`}>
                {getDeedLong(listing.deed)}
              </div>
            </div>
          </div>

          {/* Technical Specs Bento Grid */}
          <div className="mb-8">
            <h3 className="text-xs font-bold uppercase tracking-widest text-[#7A9085] mb-4">{t.specs}</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {listing.plotNumber && (
                <div className="bg-[#FBF8F1] border border-[#E8D9B8]/40 p-4 rounded-2xl">
                  <div className="text-[10px] font-bold text-[#7A9085] uppercase tracking-wider">{t.plotNo}</div>
                  <div className="text-sm font-semibold text-[#2C3E35] mt-1">{listing.plotNumber}</div>
                </div>
              )}
              {listing.paymentTerms && (
                <div className="bg-[#FBF8F1] border border-[#E8D9B8]/40 p-4 rounded-2xl">
                  <div className="text-[10px] font-bold text-[#7A9085] uppercase tracking-wider">{t.paymentTerms}</div>
                  <div className="text-sm font-semibold text-[#2C3E35] mt-1">{listing.paymentTerms}</div>
                </div>
              )}
              {listing.leasePeriod && (
                <div className="bg-[#FBF8F1] border border-[#E8D9B8]/40 p-4 rounded-2xl">
                  <div className="text-[10px] font-bold text-[#7A9085] uppercase tracking-wider">{t.leasePeriod}</div>
                  <div className="text-sm font-semibold text-[#2C3E35] mt-1">{listing.leasePeriod}</div>
                </div>
              )}
              <div className="bg-[#FBF8F1] border border-[#E8D9B8]/40 p-4 rounded-2xl">
                <div className="text-[10px] font-bold text-[#7A9085] uppercase tracking-wider">{t.topo}</div>
                <div className="text-sm font-semibold text-[#2C3E35] mt-1">{listing.topo || '—'}</div>
              </div>
              <div className="bg-[#FBF8F1] border border-[#E8D9B8]/40 p-4 rounded-2xl">
                <div className="text-[10px] font-bold text-[#7A9085] uppercase tracking-wider">{t.soil}</div>
                <div className="text-sm font-semibold text-[#2C3E35] mt-1">{listing.soil || '—'}</div>
              </div>
              <div className="bg-[#FBF8F1] border border-[#E8D9B8]/40 p-4 rounded-2xl">
                <div className="text-[10px] font-bold text-[#7A9085] uppercase tracking-wider">{t.roadAccess}</div>
                <div className="text-sm font-semibold text-[#2C3E35] mt-1">{listing.roadcond || '—'}</div>
              </div>
              <div className="bg-[#FBF8F1] border border-[#E8D9B8]/40 p-4 rounded-2xl">
                <div className="text-[10px] font-bold text-[#7A9085] uppercase tracking-wider">{t.roadDist}</div>
                <div className="text-sm font-semibold text-[#2C3E35] mt-1 truncate" title={listing.road || ''}>{listing.road || '—'}</div>
              </div>
              <div className="bg-[#FBF8F1] border border-[#E8D9B8]/40 p-4 rounded-2xl">
                <div className="text-[10px] font-bold text-[#7A9085] uppercase tracking-wider">{t.gps}</div>
                <div className="text-xs font-mono font-semibold text-[#2C3E35] mt-1">
                  {listing.lat && listing.lon ? `${listing.lat}, ${listing.lon}` : '—'}
                </div>
              </div>
            </div>
          </div>

          {/* Description Section */}
          <div className="mb-8">
            <h4 className="font-serif text-lg font-bold text-[#0D2B1A] border-b border-[#E8D9B8]/30 pb-2 mb-3">
              {t.about}
            </h4>
            <p className="text-[#3D4F45] font-light leading-relaxed text-sm md:text-base whitespace-pre-line">
              {listing.desc}
            </p>
          </div>

          {/* Utilities section */}
          <div className="mb-8">
            <h4 className="font-serif text-lg font-bold text-[#0D2B1A] border-b border-[#E8D9B8]/30 pb-2 mb-4">
              {t.utilities}
            </h4>
            <div className="flex flex-wrap gap-3 mb-4">
              {utilitiesList.map((util) => {
                const isAvailable = listing.utilities?.includes(util.key);
                return (
                  <div 
                    key={util.key}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-full border text-xs font-medium transition-all ${
                      isAvailable 
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
                        : 'bg-gray-50 border-gray-100 text-gray-400 opacity-60'
                    }`}
                  >
                    <Check className={`w-3.5 h-3.5 ${isAvailable ? 'text-emerald-600' : 'text-gray-300'}`} />
                    {lang === 'sw' ? util.sw : util.en}
                  </div>
                );
              })}
            </div>

            {/* Custom Water & Electricity notes */}
            {(listing.waterDetails || listing.electricityDetails) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                {listing.waterDetails && (
                  <div className="bg-[#FBF8F1] border border-[#E8D9B8]/50 p-4 rounded-2xl text-xs">
                    <span className="font-bold text-[#0D2B1A] block mb-1">💧 {t.waterDetail}:</span>
                    <span className="text-[#3D4F45] font-light">{listing.waterDetails}</span>
                  </div>
                )}
                {listing.electricityDetails && (
                  <div className="bg-[#FBF8F1] border border-[#E8D9B8]/50 p-4 rounded-2xl text-xs">
                    <span className="font-bold text-[#0D2B1A] block mb-1">⚡ {t.elecDetail}:</span>
                    <span className="text-[#3D4F45] font-light">{listing.electricityDetails}</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Nearby Amenities */}
          {listing.amenities && (
            <div className="mb-8">
              <h4 className="font-serif text-lg font-bold text-[#0D2B1A] border-b border-[#E8D9B8]/30 pb-2 mb-3">
                {t.amenities}
              </h4>
              <p className="text-[#3D4F45] font-light text-sm leading-relaxed">
                {listing.amenities}
              </p>
            </div>
          )}

          {/* Contact Seller Box */}
          <div className="bg-[#0D2B1A] rounded-2xl p-6 md:p-8 border border-[#2D6845]/30 text-white flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 shadow-xl">
            <div className="text-left">
              <div className="text-[10px] font-bold text-[#C9A84C] tracking-widest uppercase mb-1">{t.contactSeller}</div>
              <div className="text-xl font-semibold text-[#F5EDD8]">{listing.contact.name}</div>
              
              <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 mt-4 text-xs font-light text-[#F5EDD8]/75">
                <div>
                  <span className="font-semibold text-[#C9A84C]">{t.role}:</span> {listing.contact.role}
                </div>
                <div>
                  <span className="font-semibold text-[#C9A84C]">{t.preferred}:</span> {listing.contact.preferred}
                </div>
                {listing.contact.email && (
                  <div className="col-span-2">
                    <span className="font-semibold text-[#C9A84C]">Email:</span> {listing.contact.email}
                  </div>
                )}
              </div>

              {listing.contact.notes && (
                <div className="mt-4 bg-white/5 border border-white/10 p-3 rounded-xl text-[11px] font-light text-[#F5EDD8]/80 max-w-lg">
                  <span className="font-bold text-[#C9A84C]">{t.notes}:</span> {listing.contact.notes}
                </div>
              )}
            </div>

            <a 
              href={contactHref}
              target={isWhatsapp ? '_blank' : undefined}
              rel="noopener noreferrer"
              className={`flex-shrink-0 flex items-center justify-center gap-2 font-bold text-sm py-4 px-8 rounded-full transition-all shadow-md self-start sm:self-center w-full sm:w-auto cursor-pointer ${
                isSold 
                  ? 'bg-white/15 hover:bg-white/25 text-white border border-white/30' 
                  : 'bg-[#C9A84C] hover:bg-[#E8C96B] active:scale-95 text-[#0D2B1A] hover:shadow-[#C9A84C]/20'
              }`}
            >
              {listing.contact.preferred === 'WhatsApp' ? (
                <MessageSquare className="w-4 h-4" />
              ) : (
                <Phone className="w-4 h-4" />
              )}
              {isSold ? t.contactBtnSold : t.contactBtn}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
