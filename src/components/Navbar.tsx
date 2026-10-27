import React, { useState, useEffect } from 'react';
import { Compass, Info, PlusCircle, Globe, ShieldCheck, Phone } from 'lucide-react';
import { COMPANY_CONFIG } from '../lib/companyConfig';

interface NavbarProps {
  lang: 'sw' | 'en';
  setLang: (lang: 'sw' | 'en') => void;
  onOpenAdmin?: () => void;
}

export default function Navbar({ lang, setLang, onOpenAdmin }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const t = {
    sw: {
      browse: 'Vinjari Ardhi',
      how: 'Inavyofanya Kazi',
      list: 'Orodhesha Ardhi Yako ↗',
      admin: 'Admin'
    },
    en: {
      browse: 'Browse Land',
      how: 'How It Works',
      list: 'List Your Land ↗',
      admin: 'Admin'
    }
  }[lang];

  return (
    <nav
      id="navbar"
      className={`fixed top-0 left-0 right-0 z-50 h-18 px-6 md:px-12 flex items-center justify-between transition-all duration-300 ${
        scrolled 
          ? 'bg-[#0D2B1A]/95 backdrop-blur-md shadow-lg border-b border-[#2D6845]/20' 
          : 'bg-transparent'
      }`}
    >
      <div className="flex items-center gap-6">
        <a href="#" className="font-serif text-2xl font-bold tracking-wide text-[#C9A84C] hover:opacity-90 transition-opacity">
          Land<span className="text-white">Vault</span>
        </a>
        <a
          href={`tel:${COMPANY_CONFIG.phone}`}
          className="hidden lg:flex items-center gap-1.5 text-xs text-white/70 hover:text-[#C9A84C] bg-white/5 border border-white/10 px-3 py-1 rounded-full transition-colors font-mono"
        >
          <Phone className="w-3 h-3 text-[#C9A84C]" />
          <span>{COMPANY_CONFIG.phone}</span>
        </a>
      </div>

      <div className="flex items-center gap-3 sm:gap-4 md:gap-6">
        <a 
          href="#listings" 
          className="hidden sm:flex items-center gap-1.5 text-sm font-medium text-white/80 hover:text-[#C9A84C] transition-colors"
        >
          <Compass className="w-4 h-4 text-[#C9A84C]" />
          {t.browse}
        </a>
        <a 
          href="#how" 
          className="hidden sm:flex items-center gap-1.5 text-sm font-medium text-white/80 hover:text-[#C9A84C] transition-colors"
        >
          <Info className="w-4 h-4 text-[#C9A84C]" />
          {t.how}
        </a>

        {/* Admin Portal quick trigger */}
        {onOpenAdmin && (
          <button
            type="button"
            onClick={onOpenAdmin}
            className="flex items-center gap-1.5 bg-[#143B25]/80 hover:bg-[#1A4029] border border-[#C9A84C]/40 hover:border-[#C9A84C] text-[#E8C96B] font-bold text-xs py-2 px-3 sm:px-3.5 rounded-full transition-all shadow-sm cursor-pointer"
            title="Fungua Jopo la Usimamizi wa Admin"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-[#C9A84C]" />
            <span>{t.admin}</span>
          </button>
        )}

        <a 
          href="#add-listing" 
          className="flex items-center gap-1.5 bg-[#C9A84C] hover:bg-[#E8C96B] active:scale-95 text-[#0D2B1A] font-semibold text-xs md:text-sm py-2 px-3.5 sm:px-4 rounded-full transition-all shadow-md hover:shadow-[#C9A84C]/20 hover:-translate-y-0.5"
        >
          <PlusCircle className="w-4 h-4" />
          <span className="hidden sm:inline">{t.list}</span>
          <span className="sm:hidden">{lang === 'sw' ? 'Sajili +' : 'List +'}</span>
        </a>

        {/* Language toggle */}
        <div className="flex items-center gap-1 bg-[#1A4029]/60 border border-white/10 p-0.5 rounded-full">
          <button 
            onClick={() => setLang('en')}
            className={`text-[10px] font-bold tracking-wider px-2.5 py-1 rounded-full transition-all ${
              lang === 'en' 
                ? 'bg-[#C9A84C] text-[#0D2B1A] shadow-sm' 
                : 'text-white/60 hover:text-white'
            }`}
          >
            EN
          </button>
          <button 
            onClick={() => setLang('sw')}
            className={`text-[10px] font-bold tracking-wider px-2.5 py-1 rounded-full transition-all ${
              lang === 'sw' 
                ? 'bg-[#C9A84C] text-[#0D2B1A] shadow-sm' 
                : 'text-white/60 hover:text-white'
            }`}
          >
            SW
          </button>
        </div>
      </div>
    </nav>
  );
}
