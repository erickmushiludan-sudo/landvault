import React from 'react';
import { Search, MapPin, Grid, DollarSign, Video, ShieldCheck, X } from 'lucide-react';
import { ListingFilters } from '../types';
import { TANZANIA_REGIONS } from '../lib/tanzaniaRegions';

interface SearchFiltersProps {
  lang: 'sw' | 'en';
  filters: ListingFilters;
  onFilterChange: (filters: ListingFilters) => void;
}

export default function SearchFilters({ lang, filters, onFilterChange }: SearchFiltersProps) {
  const regions = TANZANIA_REGIONS;

  const t = {
    sw: {
      searchKeyword: 'Tafuta kwa Jina, Eneo au Kijiji...',
      region: 'Mkoa',
      allRegions: 'Mikoa Yote ya Tanzania',
      type: 'Aina ya Ardhi',
      allTypes: 'Aina Zote za Ardhi',
      price: 'Bei ya Juu (TZS)',
      anyPrice: 'Bei Yoyote',
      btn: 'Tafuta Sasa',
      reset: 'Weka Upya',
      onlyVideo: 'Yenye Video ya Ukaguzi Pekee',
      onlyVerified: 'Hati Iliyothibitishwa Pekee',
      typeAgri: 'Kilimo & Mifugo',
      typeRes: 'Makazi',
      typeComm: 'Biashara & Hoteli',
      typeMixed: 'Matumizi Mchanganyiko',
      typeInd: 'Viwanda & Maghala',
      typeFor: 'Msitu / Hifadhi',
      status: 'Hali ya Ardhi',
      allStatuses: 'Hali Zote (Mauzo)',
      statusAvailable: 'Inauzwa Pekee',
      statusSold: 'Imeshauzwa (Tayari Imenunuliwa)',
      statusReserved: 'Imewekewa Nafasi'
    },
    en: {
      searchKeyword: 'Search by keyword, location, or village...',
      region: 'Region',
      allRegions: 'All Tanzania Regions',
      type: 'Land Category',
      allTypes: 'All Categories',
      price: 'Max Price (TZS)',
      anyPrice: 'Any Budget',
      btn: 'Search Now',
      reset: 'Reset Filters',
      onlyVideo: 'Only Listings with Video Tour',
      onlyVerified: 'Verified Title Only',
      typeAgri: 'Agricultural',
      typeRes: 'Residential',
      typeComm: 'Commercial',
      typeMixed: 'Mixed Use',
      typeInd: 'Industrial',
      typeFor: 'Forest / Conservation',
      status: 'Property Status',
      allStatuses: 'All Statuses',
      statusAvailable: 'Available Only',
      statusSold: 'Sold / Bought',
      statusReserved: 'Reserved / Under Offer'
    }
  }[lang];

  const handleSelectChange = (key: keyof ListingFilters, value: any) => {
    onFilterChange({
      ...filters,
      [key]: value === '' || value === 'all' ? undefined : value
    });
  };

  const handleReset = () => {
    onFilterChange({});
  };

  const hasActiveFilters = Boolean(
    filters.searchQuery || filters.region || filters.type || (filters.status && filters.status !== 'all') || filters.maxPrice || filters.hasVideo || filters.verifiedDeedOnly
  );

  return (
    <div className="bg-[#0D2B1A] py-10 px-6 md:px-12 border-b border-[#2D6845]/20">
      <div className="max-w-6xl mx-auto bg-white/5 border border-white/10 rounded-3xl p-6 md:p-8 shadow-2xl">
        {/* Search Input Bar */}
        <div className="relative mb-6">
          <Search className="w-5 h-5 text-[#C9A84C] absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={filters.searchQuery || ''}
            onChange={(e) => handleSelectChange('searchQuery', e.target.value)}
            placeholder={t.searchKeyword}
            className="w-full bg-[#08180E] border border-white/15 focus:border-[#C9A84C] rounded-2xl py-3.5 pl-12 pr-10 text-sm text-[#F5EDD8] placeholder-white/40 outline-none transition-colors"
          />
          {filters.searchQuery && (
            <button
              onClick={() => handleSelectChange('searchQuery', '')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/50 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Dropdown Filters Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Region Filter */}
          <div className="flex flex-col gap-2 text-left">
            <label className="text-[10px] font-bold tracking-widest uppercase text-[#F5EDD8]/50 flex items-center gap-1.5">
              <MapPin className="w-3 h-3 text-[#C9A84C]" />
              {t.region}
            </label>
            <select
              value={filters.region || ''}
              onChange={(e) => handleSelectChange('region', e.target.value)}
              className="bg-transparent border-b border-white/20 hover:border-[#C9A84C] text-[#F5EDD8] font-medium text-sm py-2.5 outline-none transition-colors cursor-pointer"
            >
              <option value="" className="bg-[#0D2B1A] text-[#F5EDD8]">{t.allRegions}</option>
              {regions.map((r) => (
                <option key={r} value={r} className="bg-[#0D2B1A] text-[#F5EDD8]">
                  {r}
                </option>
              ))}
            </select>
          </div>

          {/* Type Filter */}
          <div className="flex flex-col gap-2 text-left">
            <label className="text-[10px] font-bold tracking-widest uppercase text-[#F5EDD8]/50 flex items-center gap-1.5">
              <Grid className="w-3 h-3 text-[#C9A84C]" />
              {t.type}
            </label>
            <select
              value={filters.type || ''}
              onChange={(e) => handleSelectChange('type', e.target.value)}
              className="bg-transparent border-b border-white/20 hover:border-[#C9A84C] text-[#F5EDD8] font-medium text-sm py-2.5 outline-none transition-colors cursor-pointer"
            >
              <option value="" className="bg-[#0D2B1A] text-[#F5EDD8]">{t.allTypes}</option>
              <option value="Agricultural" className="bg-[#0D2B1A] text-[#F5EDD8]">{t.typeAgri}</option>
              <option value="Residential" className="bg-[#0D2B1A] text-[#F5EDD8]">{t.typeRes}</option>
              <option value="Commercial" className="bg-[#0D2B1A] text-[#F5EDD8]">{t.typeComm}</option>
              <option value="Mixed Use" className="bg-[#0D2B1A] text-[#F5EDD8]">{t.typeMixed}</option>
              <option value="Industrial" className="bg-[#0D2B1A] text-[#F5EDD8]">{t.typeInd}</option>
              <option value="Forest / Conservation" className="bg-[#0D2B1A] text-[#F5EDD8]">{t.typeFor}</option>
            </select>
          </div>

          {/* Status Filter (Available vs Sold vs Reserved) */}
          <div className="flex flex-col gap-2 text-left">
            <label className="text-[10px] font-bold tracking-widest uppercase text-[#F5EDD8]/50 flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${filters.status === 'sold' ? 'bg-red-500' : filters.status === 'reserved' ? 'bg-amber-500' : 'bg-emerald-400'}`} />
              {t.status}
            </label>
            <select
              value={filters.status || ''}
              onChange={(e) => handleSelectChange('status', e.target.value)}
              className="bg-transparent border-b border-white/20 hover:border-[#C9A84C] text-[#F5EDD8] font-medium text-sm py-2.5 outline-none transition-colors cursor-pointer"
            >
              <option value="" className="bg-[#0D2B1A] text-[#F5EDD8]">{t.allStatuses}</option>
              <option value="available" className="bg-[#0D2B1A] text-emerald-300 font-semibold">{t.statusAvailable}</option>
              <option value="sold" className="bg-[#0D2B1A] text-red-300 font-semibold">{t.statusSold}</option>
              <option value="reserved" className="bg-[#0D2B1A] text-amber-300 font-semibold">{t.statusReserved}</option>
            </select>
          </div>

          {/* Price Filter */}
          <div className="flex flex-col gap-2 text-left">
            <label className="text-[10px] font-bold tracking-widest uppercase text-[#F5EDD8]/50 flex items-center gap-1.5">
              <DollarSign className="w-3 h-3 text-[#C9A84C]" />
              {t.price}
            </label>
            <select
              value={filters.maxPrice || ''}
              onChange={(e) => handleSelectChange('maxPrice', e.target.value ? parseInt(e.target.value) : undefined)}
              className="bg-transparent border-b border-white/20 hover:border-[#C9A84C] text-[#F5EDD8] font-medium text-sm py-2.5 outline-none transition-colors cursor-pointer"
            >
              <option value="" className="bg-[#0D2B1A] text-[#F5EDD8]">{t.anyPrice}</option>
              <option value="15000000" className="bg-[#0D2B1A] text-[#F5EDD8]">Hadi Milioni 15 (15M)</option>
              <option value="30000000" className="bg-[#0D2B1A] text-[#F5EDD8]">Hadi Milioni 30 (30M)</option>
              <option value="50000000" className="bg-[#0D2B1A] text-[#F5EDD8]">Hadi Milioni 50 (50M)</option>
              <option value="100000000" className="bg-[#0D2B1A] text-[#F5EDD8]">Hadi Milioni 100 (100M)</option>
              <option value="500000000" className="bg-[#0D2B1A] text-[#F5EDD8]">Hadi Milioni 500 (500M)</option>
            </select>
          </div>
        </div>

        {/* Feature Checkboxes & Action Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-6 pt-4 border-t border-white/10">
          <div className="flex flex-wrap items-center gap-4">
            {/* Video tour filter */}
            <label className="flex items-center gap-2 cursor-pointer text-xs text-[#F5EDD8]/80 hover:text-white">
              <input
                type="checkbox"
                checked={!!filters.hasVideo}
                onChange={(e) => handleSelectChange('hasVideo', e.target.checked || undefined)}
                className="accent-[#C9A84C] rounded"
              />
              <Video className="w-3.5 h-3.5 text-[#C9A84C]" />
              <span>{t.onlyVideo}</span>
            </label>

            {/* Verified title filter */}
            <label className="flex items-center gap-2 cursor-pointer text-xs text-[#F5EDD8]/80 hover:text-white">
              <input
                type="checkbox"
                checked={!!filters.verifiedDeedOnly}
                onChange={(e) => handleSelectChange('verifiedDeedOnly', e.target.checked || undefined)}
                className="accent-[#C9A84C] rounded"
              />
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>{t.onlyVerified}</span>
            </label>
          </div>

          <div className="flex items-center gap-3 self-end sm:self-auto">
            {hasActiveFilters && (
              <button
                onClick={handleReset}
                className="text-xs text-white/50 hover:text-white underline cursor-pointer"
              >
                {t.reset}
              </button>
            )}
            <a
              href="#listings"
              className="flex items-center gap-2 bg-[#C9A84C] hover:bg-[#E8C96B] active:scale-95 text-[#0D2B1A] font-bold text-xs md:text-sm px-6 py-2.5 rounded-xl transition-all shadow-md"
            >
              <Search className="w-3.5 h-3.5" />
              {t.btn}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
