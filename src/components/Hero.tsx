import React, { useState, useEffect } from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';

interface HeroProps {
  lang: 'sw' | 'en';
  listingsCount: number;
}

export default function Hero({ lang, listingsCount }: HeroProps) {
  const [counts, setCounts] = useState({ listings: 0, regions: 0, buyers: 0 });

  useEffect(() => {
    // Animate stats numbers on mount
    const duration = 1800; // ms
    const steps = 60;
    const stepTime = duration / steps;
    
    const targets = {
      listings: listingsCount || 6,
      regions: 20,
      buyers: 1240
    };

    let step = 0;
    const timer = setInterval(() => {
      step++;
      setCounts({
        listings: Math.min(Math.floor((targets.listings / steps) * step), targets.listings),
        regions: Math.min(Math.floor((targets.regions / steps) * step), targets.regions),
        buyers: Math.min(Math.floor((targets.buyers / steps) * step), targets.buyers)
      });

      if (step >= steps) {
        setCounts(targets);
        clearInterval(timer);
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [listingsCount]);

  const t = {
    sw: {
      eyebrow: 'Soko la Ardhi Linaloaminika Tanzania',
      title1: 'Pata sehemu',
      title2: 'bora',
      title3: 'ya ardhi kwa malengo yako.',
      sub: 'Jukwaa linaloaminika zaidi nchini Tanzania kwa kununua na kuuza viwanja, mashamba na maeneo ya biashara. Pata ardhi inayofaa kwa makazi, kilimo, biashara au uwekezaji wa viwanda.',
      explore: 'Vinjari Orodha',
      sell: 'Uza Ardhi Yako',
      statListings: 'Orodha Zinazopatikana',
      statRegions: 'Mikoa Iliyofunikwa',
      statBuyers: 'Wateja Walioridhika',
      scroll: 'Tembeza chini'
    },
    en: {
      eyebrow: 'Tanzania’s Trusted Land Marketplace',
      title1: 'Find the',
      title2: 'perfect',
      title3: 'land for your future projects.',
      sub: 'The most reliable platform in Tanzania for buying and selling plots, farms, and commercial sites. Discover verified land suitable for housing, agriculture, businesses, or industrial ventures.',
      explore: 'Explore Listings',
      sell: 'List Your Land',
      statListings: 'Available Listings',
      statRegions: 'Regions Covered',
      statBuyers: 'Happy Buyers',
      scroll: 'Scroll down'
    }
  }[lang];

  return (
    <section 
      id="hero" 
      className="relative min-h-[92vh] flex flex-col justify-center px-6 md:px-12 py-24 overflow-hidden"
    >
      {/* Background Image and Overlays */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-1000 scale-105"
        style={{
          backgroundImage: `linear-gradient(rgba(13, 43, 26, 0.45), rgba(13, 43, 26, 0.75)), url("https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1600&q=80")`,
          filter: 'saturate(1.1) brightness(0.95)'
        }}
      />
      {/* Grid Pattern */}
      <div className="absolute inset-0 opacity-[0.04] bg-[linear-gradient(rgba(245,237,216,0.8)_1px,transparent_1px),linear-gradient(90deg,rgba(245,237,216,0.8)_1px,transparent_1px)] bg-[size:50px_50px] pointer-events-none" />

      {/* Hero Content */}
      <div className="relative z-10 max-w-4xl text-left">
        <div className="inline-flex items-center gap-2 bg-[#C9A84C]/15 border border-[#C9A84C]/30 text-[#E8C96B] rounded-full px-4 py-1.5 text-xs font-semibold tracking-wider uppercase mb-6 animate-pulse">
          <Sparkles className="w-3.5 h-3.5 text-[#C9A84C]" />
          {t.eyebrow}
        </div>

        <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl font-extralight text-[#F5EDD8] leading-[1.1] tracking-tight">
          {t.title1} <em className="font-serif font-normal italic text-[#E8C96B]">{t.title2}</em><br />
          {t.title3}
        </h1>

        <p className="mt-6 text-sm sm:text-base md:text-lg text-[#F5EDD8]/75 leading-relaxed max-w-2xl font-light">
          {t.sub}
        </p>

        <div className="flex flex-wrap gap-4 mt-8">
          <a 
            href="#listings" 
            className="inline-flex items-center gap-2 bg-[#C9A84C] hover:bg-[#E8C96B] active:scale-95 text-[#0D2B1A] font-bold text-sm md:text-base py-3.5 px-8 rounded-full transition-all shadow-lg hover:shadow-[#C9A84C]/25 hover:-translate-y-0.5"
          >
            {t.explore}
            <ArrowRight className="w-4 h-4" />
          </a>
          <a 
            href="#add-listing" 
            className="inline-flex items-center gap-2 bg-transparent border-1.5 border-[#F5EDD8]/30 hover:border-white hover:bg-white/5 text-[#F5EDD8] hover:text-white font-medium text-sm md:text-base py-3.5 px-8 rounded-full transition-all"
          >
            {t.sell}
          </a>
        </div>
      </div>

      {/* Floating Statistics on Desktop */}
      <div className="hidden lg:flex absolute right-12 bottom-12 flex-col gap-6 z-10 bg-[#0D2B1A]/85 backdrop-blur-md border border-[#2D6845]/30 p-6 rounded-2xl shadow-xl min-w-[220px]">
        <div>
          <div className="font-serif text-4xl font-semibold text-[#C9A84C]">{counts.listings}</div>
          <div className="text-[10px] tracking-wider uppercase text-white/50 font-semibold mt-1">{t.statListings}</div>
        </div>
        <div className="border-t border-[#2D6845]/20" />
        <div>
          <div className="font-serif text-4xl font-semibold text-[#C9A84C]">{counts.regions}+</div>
          <div className="text-[10px] tracking-wider uppercase text-white/50 font-semibold mt-1">{t.statRegions}</div>
        </div>
        <div className="border-t border-[#2D6845]/20" />
        <div>
          <div className="font-serif text-4xl font-semibold text-[#C9A84C]">{counts.buyers.toLocaleString()}+</div>
          <div className="text-[10px] tracking-wider uppercase text-white/50 font-semibold mt-1">{t.statBuyers}</div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none opacity-40">
        <span className="text-[9px] uppercase tracking-widest text-[#F5EDD8]">{t.scroll}</span>
        <div className="w-0.5 h-10 bg-gradient-to-b from-[#C9A84C] to-transparent animate-bounce" />
      </div>
    </section>
  );
}
