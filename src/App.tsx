import React, { useState, useEffect, useMemo } from 'react';
import { subscribeToListings } from './lib/listingsService';
import { LandListing, ListingFilters, LandType } from './types';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import SearchFilters from './components/SearchFilters';
import ListingCard from './components/ListingCard';
import ListingDetailsModal from './components/ListingDetailsModal';
import AddListingForm from './components/AddListingForm';
import HowItWorks from './components/HowItWorks';
import Footer from './components/Footer';
import { Grid, Sparkles, Filter, Compass, AlertCircle, RefreshCw, PlusCircle, Video } from 'lucide-react';

export default function App() {
  const [lang, setLang] = useState<'sw' | 'en'>('sw');
  const [listings, setListings] = useState<LandListing[]>([]);
  const [filters, setFilters] = useState<ListingFilters>({});
  const [activeTab, setActiveTab] = useState<string>('all');
  const [selectedListing, setSelectedListing] = useState<LandListing | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [pageLimit, setPageLimit] = useState<number>(18);
  const [hasMore, setHasMore] = useState<boolean>(false);

  // Mouse cursor followers
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [ringPos, setRingPos] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  // Subscribe to real-time Firestore changes on mount with scalable query limit
  useEffect(() => {
    setLoading(true);
    const unsubscribe = subscribeToListings(
      (data, more) => {
        setListings(data);
        setHasMore(more);
        setError(null);
        setLoading(false);
      },
      (err) => {
        setError(err);
        setLoading(false);
      },
      pageLimit
    );
    return () => unsubscribe();
  }, [pageLimit]);

  // Mouse coordinate tracking for custom cursor
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const clickable = target.closest('a, button, select, input, [role="button"], .land-card');
      setIsHovering(!!clickable);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseover', handleMouseOver);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, []);

  // Smooth lagging animation for the outer ring follower
  useEffect(() => {
    let animationFrameId: number;
    const updateRing = () => {
      setRingPos((prev) => {
        const dx = mousePos.x - prev.x - 18;
        const dy = mousePos.y - prev.y - 18;
        return {
          x: prev.x + dx * 0.15,
          y: prev.y + dy * 0.15
        };
      });
      animationFrameId = requestAnimationFrame(updateRing);
    };
    animationFrameId = requestAnimationFrame(updateRing);
    return () => cancelAnimationFrame(animationFrameId);
  }, [mousePos]);

  // Combined filters application (keyword search, bento parameters, tab categories, video filter)
  const filteredListings = useMemo(() => {
    return listings.filter((item) => {
      // 1. Text Search Query (Title, Description, Region, District, Ward, Village, Plot)
      if (filters.searchQuery) {
        const q = filters.searchQuery.toLowerCase().trim();
        const corpus = `${item.title} ${item.desc} ${item.region} ${item.district} ${item.ward} ${item.village} ${item.plotNumber || ''}`.toLowerCase();
        if (!corpus.includes(q)) {
          return false;
        }
      }
      // 2. Tab category filter (all vs specific)
      if (activeTab !== 'all' && item.type !== activeTab) {
        return false;
      }
      // 3. Bento Region Filter
      if (filters.region && item.region !== filters.region) {
        return false;
      }
      // 4. Bento Type Filter
      if (filters.type && item.type !== filters.type) {
        return false;
      }
      // 5. Property Status Filter (available vs sold vs reserved)
      if (filters.status && filters.status !== 'all') {
        const itemStatus = item.status || 'available';
        if (itemStatus !== filters.status) {
          return false;
        }
      }
      // 6. Bento Price Cap Filter
      if (filters.maxPrice && item.price > filters.maxPrice) {
        return false;
      }
      // 7. Has Video filter
      if (filters.hasVideo && !item.videoUrl) {
        return false;
      }
      // 8. Verified Deed only
      if (filters.verifiedDeedOnly && !item.deed.includes('Registered') && !item.deed.includes('Iliyosajiliwa')) {
        return false;
      }
      return true;
    });
  }, [listings, filters, activeTab]);

  const t = {
    sw: {
      availableLabel: 'Hifadhi Hai ya Ardhi Tanzania',
      titleHighlight: 'Orodha Bora za Ardhi',
      all: 'Orodha Zote',
      agri: 'Kilimo & Mifugo',
      res: 'Makazi',
      comm: 'Biashara',
      loadingText: 'Inapakia soko la ardhi Tanzania kutoka kwenye hifadhi ya database…',
      noResults: 'Hakuna orodha inayolingana na utafutaji wako.',
      noResultsSub: 'Jaribu kubadilisha vigezo vya utafutaji au sajili ardhi yako mpya hapa chini.',
      connectionError: 'Mwasiliano na seva ya ardhi',
      retry: 'Jaribu tena',
      listingsCount: 'orodha zimepatikana',
      loadMore: 'Onyesha Ardhi Zaidi (Hifadhi ya Maelfu) ↗',
      videoToursBadge: 'Video za Angani (Drone) Zinapatikana',
      floatingAdd: 'Sajili Ardhi +'
    },
    en: {
      availableLabel: 'Live Tanzanian Land Registry',
      titleHighlight: 'Premium Land Listings',
      all: 'All Properties',
      agri: 'Agricultural',
      res: 'Residential',
      comm: 'Commercial',
      loadingText: 'Synchronizing Tanzanian land marketplace from high-capacity database…',
      noResults: 'No properties match your active search.',
      noResultsSub: 'Try adjusting filters, clearing search keywords, or list your property below.',
      connectionError: 'Server database connection',
      retry: 'Retry connection',
      listingsCount: 'listings found',
      loadMore: 'Load More Properties (Thousands Capacity) ↗',
      videoToursBadge: 'Aerial Drone Video Tours Available',
      floatingAdd: 'List Land +'
    }
  }[lang];

  return (
    <div className="relative min-h-screen flex flex-col bg-[#FEFCF7]">
      {/* Custom Mouse Cursor Followers (Desktop) */}
      <div 
        className="pointer-events-none fixed z-50 w-2.5 h-2.5 bg-[#C9A84C] rounded-full -translate-x-1/2 -translate-y-1/2 transition-opacity hidden md:block"
        style={{ left: `${mousePos.x}px`, top: `${mousePos.y}px` }}
      />
      <div 
        className={`pointer-events-none fixed z-50 rounded-full border border-[#C9A84C] transition-all duration-75 hidden md:block ${
          isHovering 
            ? 'w-12 h-12 -translate-x-6 -translate-y-6 bg-[#C9A84C]/10 border-2' 
            : 'w-9 h-9 -translate-x-4.5 -translate-y-4.5 opacity-60'
        }`}
        style={{ left: `${ringPos.x + 18}px`, top: `${ringPos.y + 18}px` }}
      />

      {/* Navigation Header */}
      <Navbar lang={lang} setLang={setLang} />

      {/* Floating Action Quick Button to List Land */}
      <a
        href="#add-listing"
        className="fixed bottom-6 right-6 z-40 bg-[#C9A84C] hover:bg-[#E8C96B] text-[#0D2B1A] font-bold text-xs md:text-sm py-3 px-5 rounded-full shadow-2xl flex items-center gap-2 transition-all hover:scale-105 active:scale-95 border-2 border-[#0D2B1A]/20"
      >
        <PlusCircle className="w-4 h-4" />
        <span>{t.floatingAdd}</span>
      </a>

      {/* Hero Presentation */}
      <Hero lang={lang} listingsCount={listings.length} />

      {/* Bento Search and Category Filtering Module */}
      <SearchFilters 
        lang={lang} 
        filters={filters} 
        onFilterChange={setFilters} 
      />

      {/* Property Showcase Section */}
      <section id="listings" className="py-20 px-6 md:px-12 max-w-7xl mx-auto w-full flex-1">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <span className="text-[#C9A84C] font-mono text-xs uppercase tracking-widest font-bold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              {t.availableLabel}
            </span>
            <h2 className="font-serif text-3xl md:text-5xl font-semibold text-[#0D2B1A] mt-2">
              {t.titleHighlight}
            </h2>
          </div>

          <div className="flex flex-col items-start md:items-end gap-3 flex-shrink-0">
            {/* Direct results indicator & quick status pills */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="bg-[#F5EDD8] border border-[#E8D9B8] px-3.5 py-1.5 rounded-full text-xs font-medium text-[#2D6845] flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>{filteredListings.length} {t.listingsCount}</span>
              </div>

              {/* Status fast-filter tabs */}
              <div className="flex items-center gap-1 bg-[#F0ECE1] p-1 rounded-full text-[11px] border border-[#E8D9B8]/60">
                <button
                  type="button"
                  onClick={() => setFilters((prev) => ({ ...prev, status: undefined }))}
                  className={`px-2.5 py-1 rounded-full transition-all font-semibold cursor-pointer ${
                    !filters.status || filters.status === 'all'
                      ? 'bg-[#0D2B1A] text-[#C9A84C] shadow-sm'
                      : 'text-[#7A9085] hover:text-[#0D2B1A]'
                  }`}
                >
                  {lang === 'sw' ? 'Hali Zote' : 'All'}
                </button>
                <button
                  type="button"
                  onClick={() => setFilters((prev) => ({ ...prev, status: 'available' }))}
                  className={`px-2.5 py-1 rounded-full transition-all font-semibold cursor-pointer ${
                    filters.status === 'available'
                      ? 'bg-emerald-700 text-white shadow-sm'
                      : 'text-[#7A9085] hover:text-emerald-800'
                  }`}
                >
                  {lang === 'sw' ? 'Inauzwa' : 'Available'}
                </button>
                <button
                  type="button"
                  onClick={() => setFilters((prev) => ({ ...prev, status: 'sold' }))}
                  className={`px-2.5 py-1 rounded-full transition-all font-semibold cursor-pointer ${
                    filters.status === 'sold'
                      ? 'bg-red-700 text-white shadow-sm'
                      : 'text-[#7A9085] hover:text-red-800'
                  }`}
                >
                  {lang === 'sw' ? 'Imeshauzwa' : 'Sold'}
                </button>
                <button
                  type="button"
                  onClick={() => setFilters((prev) => ({ ...prev, status: 'reserved' }))}
                  className={`px-2.5 py-1 rounded-full transition-all font-semibold cursor-pointer ${
                    filters.status === 'reserved'
                      ? 'bg-amber-600 text-white shadow-sm'
                      : 'text-[#7A9085] hover:text-amber-800'
                  }`}
                >
                  {lang === 'sw' ? 'Nafasi' : 'Reserved'}
                </button>
              </div>
            </div>

            {/* Sub-tabs category filter */}
            <div className="flex flex-wrap gap-2">
              {[
                { id: 'all', label: t.all },
                { id: 'Agricultural', label: t.agri },
                { id: 'Residential', label: t.res },
                { id: 'Commercial', label: t.comm }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4.5 py-2 rounded-full text-xs font-medium border transition-all active:scale-95 cursor-pointer ${
                    activeTab === tab.id
                      ? 'bg-[#0D2B1A] border-[#0D2B1A] text-[#C9A84C]'
                      : 'bg-transparent border-[#E8D9B8] text-[#7A9085] hover:border-[#2D6845] hover:text-[#2D6845]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Live database states */}
        {loading ? (
          <div className="py-24 flex flex-col items-center justify-center text-[#7A9085]">
            <RefreshCw className="w-8 h-8 text-[#C9A84C] animate-spin mb-3" />
            <span className="text-sm font-light tracking-wide">{t.loadingText}</span>
          </div>
        ) : error ? (
          <div className="py-16 px-6 max-w-md mx-auto bg-red-50 rounded-3xl border border-red-200 text-center flex flex-col items-center">
            <AlertCircle className="w-12 h-12 text-red-600 mb-3" />
            <h4 className="font-sans font-bold text-red-800 text-base">{t.connectionError}</h4>
            <p className="text-red-600 text-xs font-light mt-1 mb-4">
              {(() => {
                try {
                  const parsed = JSON.parse(error.message);
                  return parsed.error || error.message;
                } catch {
                  return error.message;
                }
              })()}
            </p>
            <button 
              onClick={() => window.location.reload()}
              className="bg-red-700 text-white font-bold text-xs py-2.5 px-6 rounded-full hover:bg-red-800 transition-colors cursor-pointer"
            >
              {t.retry}
            </button>
          </div>
        ) : filteredListings.length === 0 ? (
          <div className="py-24 text-center max-w-lg mx-auto flex flex-col items-center">
            <Compass className="w-16 h-16 text-[#C9A84C] opacity-40 mb-4" />
            <h4 className="font-serif text-2xl font-semibold text-[#0D2B1A]">{t.noResults}</h4>
            <p className="text-[#7A9085] text-sm font-light mt-2 leading-relaxed">{t.noResultsSub}</p>
          </div>
        ) : (
          <div>
            {/* Property grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {filteredListings.map((listing) => (
                <ListingCard
                  key={listing.id}
                  listing={listing}
                  lang={lang}
                  onClick={() => setSelectedListing(listing)}
                />
              ))}
            </div>

            {/* Scalable pagination / Load More for thousands of listings */}
            {hasMore && (
              <div className="mt-14 text-center">
                <button
                  onClick={() => setPageLimit((prev) => prev + 18)}
                  className="inline-flex items-center gap-2 bg-[#0D2B1A] hover:bg-[#1A4029] text-[#C9A84C] hover:text-[#E8C96B] border border-[#C9A84C]/40 font-bold text-xs md:text-sm px-8 py-4 rounded-full shadow-xl transition-all cursor-pointer active:scale-95"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>{t.loadMore}</span>
                </button>
              </div>
            )}
          </div>
        )}
      </section>

      {/* Guide details panel */}
      <HowItWorks lang={lang} />

      {/* Multi-step list submission wizard */}
      <AddListingForm 
        lang={lang} 
        onSuccess={() => {
          // Automatic reactive refresh upon completion
        }} 
      />

      {/* Footer */}
      <Footer lang={lang} />

      {/* Overlay details modal */}
      <ListingDetailsModal
        listing={selectedListing}
        lang={lang}
        onClose={() => setSelectedListing(null)}
        onStatusUpdated={(id, newStatus) => {
          setListings((prev) =>
            prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
          );
          setSelectedListing((prev) => (prev && prev.id === id ? { ...prev, status: newStatus } : prev));
        }}
      />
    </div>
  );
}
