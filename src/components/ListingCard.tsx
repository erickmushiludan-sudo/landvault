import React from 'react';
import { 
  MapPin, 
  Compass, 
  ArrowRight, 
  ShieldCheck, 
  Award, 
  Video, 
  Camera, 
  CheckCircle2, 
  Clock 
} from 'lucide-react';
import { LandListing } from '../types';

interface ListingCardProps {
  key?: string | number;
  listing: LandListing;
  lang: 'sw' | 'en';
  onClick: () => void;
}

export default function ListingCard({ listing, lang, onClick }: ListingCardProps) {
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

  const getDeedShort = (deed: string) => {
    if (!deed) return lang === 'sw' ? '⚠ Hati Haipo' : '⚠ No Title';
    if (deed.includes('Registered') || deed.includes('Iliyosajiliwa')) {
      return lang === 'sw' ? '✓ Hati Imethibitishwa' : '✓ Verified Title';
    }
    if (deed.includes('Surveyed') || deed.includes('Imepimwa')) {
      return lang === 'sw' ? '⏳ Imepimwa – Usajili' : '⏳ Surveyed – Pending';
    }
    if (deed.includes('Kijiji') || deed.includes('Village')) {
      return lang === 'sw' ? '📜 Ardhi ya Kijiji' : '📜 Village Land';
    }
    if (deed.includes('Ofa') || deed.includes('Offer')) {
      return lang === 'sw' ? '📋 Barua ya Ofa' : '📋 Letter of Offer';
    }
    return lang === 'sw' ? '⚠ Hati haijathibitishwa' : '⚠ Title Unverified';
  };

  const colors: Record<string, string> = {
    'from-green': 'bg-gradient-to-tr from-[#0D2B1A] via-[#1A4029] to-[#2D6845]',
    'from-blue': 'bg-gradient-to-tr from-[#0D1B2B] via-[#1A2E40] to-[#2D4568]',
    'from-amber': 'bg-gradient-to-tr from-[#2A1E0D] via-[#402C1A] to-[#684E2D]',
    'from-purple': 'bg-gradient-to-tr from-[#1E0D2A] via-[#2F1A40] to-[#512D68]',
    'from-cyan': 'bg-gradient-to-tr from-[#0D252A] via-[#1A3A40] to-[#2D5B68]'
  };

  const cardGradient = colors[listing.color] || colors['from-green'];
  const isSold = listing.status === 'sold';
  const isReserved = listing.status === 'reserved';

  // Geometric placeholder if no images exist
  const renderPlaceholder = () => (
    <div className={`w-full h-full relative overflow-hidden flex items-center justify-center ${cardGradient}`}>
      <div className="absolute inset-0 opacity-10 bg-[linear-gradient(rgba(245,237,216,0.8)_1.5px,transparent_1.5px),linear-gradient(90deg,rgba(245,237,216,0.8)_1.5px,transparent_1.5px)] bg-[size:24px_24px]" />
      <Compass className="w-12 h-12 text-[#C9A84C]/40 animate-pulse" />
      <span className="absolute bottom-3 right-3 text-[10px] font-mono tracking-widest text-[#F5EDD8]/20">LANDVAULT ART</span>
    </div>
  );

  return (
    <div 
      onClick={onClick}
      className={`bg-white border rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 cursor-pointer flex flex-col group ${
        isSold ? 'border-red-200/80 opacity-85 hover:opacity-100' : 'border-[#E8D9B8]/60 hover:border-[#C9A84C]/40'
      }`}
    >
      {/* Card Header Media */}
      <div className="h-56 relative overflow-hidden bg-[#0D2B1A]">
        {listing.images && listing.images.length > 0 ? (
          <img 
            src={listing.images[0]} 
            alt={listing.title} 
            className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ${
              isSold ? 'grayscale-[35%] brightness-90' : ''
            }`}
            referrerPolicy="no-referrer"
          />
        ) : (
          renderPlaceholder()
        )}
        
        {/* Category Badges */}
        <div className="absolute top-4 left-4 bg-[#0D2B1A]/85 backdrop-blur-md border border-[#2D6845]/20 text-[#E8C96B] font-bold text-[10px] tracking-wider uppercase px-3 py-1 rounded-full shadow-sm z-10">
          {lang === 'sw' ? (listing.type === 'Agricultural' ? 'Kilimo' : listing.type === 'Residential' ? 'Makazi' : listing.type === 'Commercial' ? 'Biashara' : listing.type === 'Industrial' ? 'Viwanda' : listing.type === 'Mixed Use' ? 'Mchanganyiko' : 'Hifadhi') : listing.type}
        </div>

        {/* STATUS BADGE: SOLD vs RESERVED vs FEATURED */}
        {isSold ? (
          <div className="absolute top-4 right-4 bg-red-600 text-white font-extrabold text-[9px] tracking-widest uppercase px-3 py-1 rounded-full flex items-center gap-1 shadow-lg z-10 border border-white/20 animate-pulse">
            <CheckCircle2 className="w-3 h-3 text-white" />
            {lang === 'sw' ? 'IMESHAUZWA' : 'SOLD OUT'}
          </div>
        ) : isReserved ? (
          <div className="absolute top-4 right-4 bg-amber-500 text-[#0D2B1A] font-extrabold text-[9px] tracking-widest uppercase px-2.5 py-1 rounded-full flex items-center gap-1 shadow-md z-10 border border-black/10">
            <Clock className="w-3 h-3" />
            {lang === 'sw' ? 'IMEWEKEWA NAFASI' : 'RESERVED'}
          </div>
        ) : listing.featured ? (
          <div className="absolute top-4 right-4 bg-[#C9A84C] text-[#0D2B1A] font-extrabold text-[9px] tracking-widest uppercase px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm z-10">
            <Award className="w-3 h-3" />
            FEATURED
          </div>
        ) : null}

        {/* Sold Watermark Banner */}
        {isSold && (
          <div className="absolute inset-0 bg-black/35 backdrop-blur-[0.5px] flex items-center justify-center pointer-events-none">
            <span className="bg-red-700/90 text-white font-serif font-bold text-xs uppercase tracking-widest px-5 py-1.5 rounded-lg border border-white/30 shadow-2xl rotate-[-8deg]">
              {lang === 'sw' ? '✓ IMESHAUZWA' : '✓ SOLD'}
            </span>
          </div>
        )}

        {/* Video Tour Badge */}
        {listing.videoUrl && (
          <div className="absolute bottom-3 left-4 bg-black/80 backdrop-blur-md text-[#E8C96B] font-bold text-[9px] tracking-wider uppercase px-2.5 py-1 rounded-full flex items-center gap-1 shadow-md border border-white/10 z-10">
            <Video className="w-3 h-3 text-[#C9A84C]" />
            Video Tour
          </div>
        )}

        {/* Photos Count Badge */}
        {listing.images && listing.images.length > 1 && (
          <div className="absolute bottom-3 right-4 bg-black/80 backdrop-blur-md text-white/90 font-medium text-[9px] px-2.5 py-1 rounded-full flex items-center gap-1 shadow-md border border-white/10 z-10">
            <Camera className="w-3 h-3 text-[#C9A84C]" />
            {listing.images.length}
          </div>
        )}
      </div>

      {/* Card Body */}
      <div className="p-6 flex-1 flex flex-col text-left">
        <div className="flex items-center justify-between mb-2">
          <div className="font-serif text-2xl font-bold text-[#0D2B1A] flex items-baseline gap-1.5 leading-none">
            {formatPrice(listing.price)}
            <span className="text-xs font-sans font-light text-[#7A9085]">
              / {listing.size} {listing.unit === 'Acres' || listing.unit === 'Ekari' ? (lang === 'sw' ? 'Ekari' : 'Acres') : (listing.unit === 'Hectares' || listing.unit === 'Hektari' ? (lang === 'sw' ? 'Hektari' : 'Hectares') : (lang === 'sw' ? 'Mita za Mraba' : 'Sqm'))}
            </span>
          </div>

          {/* Quick status pill */}
          {isSold ? (
            <span className="text-[10px] font-bold text-red-600 bg-red-50 border border-red-200 px-2 py-0.5 rounded-full">
              {lang === 'sw' ? 'Imeshauzwa' : 'Sold'}
            </span>
          ) : isReserved ? (
            <span className="text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
              {lang === 'sw' ? 'Nafasi Imewekwa' : 'Reserved'}
            </span>
          ) : (
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
              {lang === 'sw' ? 'Inauzwa' : 'Available'}
            </span>
          )}
        </div>

        <h3 className="font-sans font-semibold text-[#2C3E35] text-base leading-snug line-clamp-2 min-h-[3rem] group-hover:text-[#2D6845] transition-colors mb-2">
          {listing.title}
        </h3>

        <div className="flex items-center gap-1.5 text-xs text-[#7A9085] font-light mb-4">
          <MapPin className="w-3.5 h-3.5 text-[#C9A84C]" />
          <span className="truncate">{[listing.village, listing.ward, listing.district, listing.region].filter(Boolean).join(', ')}</span>
        </div>

        <div className="grid grid-cols-3 gap-2 border-t border-[#E8D9B8]/40 pt-4 mt-auto">
          <div>
            <div className="text-[9px] font-bold uppercase tracking-wider text-[#7A9085]/60">{lang === 'sw' ? 'UKUBWA' : 'SIZE'}</div>
            <div className="text-xs font-semibold text-[#2C3E35] mt-0.5 truncate">{listing.size} {listing.unit === 'Acres' || listing.unit === 'Ekari' ? (lang === 'sw' ? 'Ek' : 'Ac') : (listing.unit === 'Hectares' || listing.unit === 'Hektari' ? (lang === 'sw' ? 'Hek' : 'Ha') : 'M²')}</div>
          </div>
          <div>
            <div className="text-[9px] font-bold uppercase tracking-wider text-[#7A9085]/60">{lang === 'sw' ? 'UDONGO' : 'SOIL'}</div>
            <div className="text-xs font-semibold text-[#2C3E35] mt-0.5 truncate">{listing.soil ? listing.soil.replace('Udongo wa ', '') : '—'}</div>
          </div>
          <div>
            <div className="text-[9px] font-bold uppercase tracking-wider text-[#7A9085]/60">{lang === 'sw' ? 'NJIA' : 'ROAD'}</div>
            <div className="text-xs font-semibold text-[#2C3E35] mt-0.5 truncate">{listing.roadcond ? listing.roadcond.replace('Barabara ya ', '') : '—'}</div>
          </div>
        </div>
      </div>

      {/* Card Footer */}
      <div className="border-t border-[#E8D9B8]/40 px-6 py-4 bg-[#FBF8F1]/50 flex items-center justify-between mt-auto">
        <div className={`border text-[10px] font-bold tracking-wider rounded-full px-3 py-1 shadow-inner ${getDeedClass(listing.deed)}`}>
          {getDeedShort(listing.deed)}
        </div>
        <button className="flex items-center gap-1 text-[#0D2B1A] group-hover:text-[#2D6845] font-semibold text-xs transition-colors">
          {isSold ? (lang === 'sw' ? 'Tazama Kumbukumbu' : 'View Record') : (lang === 'sw' ? 'Angalia Maelezo' : 'View Details')}
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
}
