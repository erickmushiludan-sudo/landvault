import React from 'react';
import { Phone, Mail, ShieldCheck, MapPin } from 'lucide-react';
import { COMPANY_CONFIG } from '../lib/companyConfig';

interface FooterProps {
  lang: 'sw' | 'en';
  onOpenAdmin?: () => void;
}

export default function Footer({ lang, onOpenAdmin }: FooterProps) {
  const t = {
    sw: {
      desc: 'Jukwaa kuu nchini Tanzania la kununua na kuuza viwanja na mashamba kwa urahisi, usalama na uwazi. Wasiliana na wateja moja kwa moja na thibitisha umiliki wa ardhi.',
      browse: 'Vinjari Ardhi',
      allListings: 'Orodha Zote',
      agricultural: 'Kilimo',
      residential: 'Makazi',
      commercial: 'Biashara',
      sell: 'Uza Ardhi',
      listBtn: 'Sajili Kiwanja chako',
      howItWorks: 'Inavyofanya Kazi',
      priceGuide: 'Mwongozo wa Bei',
      deedHelp: 'Msaada wa Hati Miliki',
      support: 'Mawasiliano Rasmi',
      contactUs: 'Ofisi & Makao Makuu',
      legalGuide: 'Miongozo ya Sheria',
      privacy: 'Sera ya Faragha',
      terms: 'Masharti ya Matumizi',
      adminPortal: 'Jopo la Admin (Management)',
      copyright: '© 2026 LandVault Tanzania. Haki zote zimehifadhiwa.',
      tagline: 'Soko linaloaminika la ardhi kwa Tanzania 🇹🇿'
    },
    en: {
      desc: 'Tanzania’s premier platform to buy and sell land with speed, clarity, and safety. Direct verified listings with high-capacity cloud database architecture.',
      browse: 'Browse Properties',
      allListings: 'All Listings',
      agricultural: 'Agricultural Land',
      residential: 'Residential Plots',
      commercial: 'Commercial Sites',
      sell: 'List Properties',
      listBtn: 'Post Your Land',
      howItWorks: 'How It Works',
      priceGuide: 'Pricing Advice',
      deedHelp: 'Title Deed Support',
      support: 'Official Contacts',
      contactUs: 'Headquarters & Help',
      legalGuide: 'Legal Framework',
      privacy: 'Privacy Policy',
      terms: 'Terms of Use',
      adminPortal: 'Admin Portal (Management)',
      copyright: '© 2026 LandVault Tanzania. All rights reserved.',
      tagline: 'The trusted land marketplace for Tanzania 🇹🇿'
    }
  }[lang];

  return (
    <footer className="bg-[#0D2B1A] py-16 px-6 md:px-12 border-t border-[#2D6845]/20 text-white">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
        
        {/* Brand column */}
        <div className="lg:col-span-2 text-left space-y-4">
          <a href="#" className="font-serif text-3xl font-bold tracking-wide text-[#C9A84C]">
            Land<span className="text-white">Vault</span>
          </a>
          <p className="text-[#F5EDD8]/70 text-sm leading-relaxed max-w-sm font-light">
            {t.desc}
          </p>
          <div className="pt-2 space-y-2 text-xs text-[#F5EDD8]/80 font-light">
            <div className="flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-[#C9A84C]" />
              <span>Simu / WhatsApp: <a href={`tel:${COMPANY_CONFIG.phone}`} className="font-mono text-white hover:text-[#C9A84C] font-semibold">{COMPANY_CONFIG.phone}</a></span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-[#C9A84C]" />
              <span>Barua Pepe: <a href={`mailto:${COMPANY_CONFIG.email}`} className="text-white hover:text-[#C9A84C] font-mono">{COMPANY_CONFIG.email}</a></span>
            </div>
          </div>
        </div>

        {/* Links Column 1 */}
        <div className="text-left">
          <h5 className="text-[10px] font-bold tracking-widest text-[#C9A84C] uppercase mb-4">{t.browse}</h5>
          <ul className="space-y-2.5 text-sm font-light text-[#F5EDD8]/80">
            <li><a href="#listings" className="hover:text-white transition-colors">{t.allListings}</a></li>
            <li><a href="#listings" className="hover:text-white transition-colors">{t.agricultural}</a></li>
            <li><a href="#listings" className="hover:text-white transition-colors">{t.residential}</a></li>
            <li><a href="#listings" className="hover:text-white transition-colors">{t.commercial}</a></li>
          </ul>
        </div>

        {/* Links Column 2 */}
        <div className="text-left">
          <h5 className="text-[10px] font-bold tracking-widest text-[#C9A84C] uppercase mb-4">{t.sell}</h5>
          <ul className="space-y-2.5 text-sm font-light text-[#F5EDD8]/80">
            <li><a href="#add-listing" className="hover:text-white transition-colors">{t.listBtn}</a></li>
            <li><a href="#how" className="hover:text-white transition-colors">{t.howItWorks}</a></li>
            <li><a href="#how" className="hover:text-white transition-colors">{t.priceGuide}</a></li>
            <li><a href="#how" className="hover:text-white transition-colors">{t.deedHelp}</a></li>
          </ul>
        </div>

        {/* Links Column 3 - Support & Admin */}
        <div className="text-left">
          <h5 className="text-[10px] font-bold tracking-widest text-[#C9A84C] uppercase mb-4">{t.support}</h5>
          <ul className="space-y-2.5 text-sm font-light text-[#F5EDD8]/80">
            <li><a href={`tel:${COMPANY_CONFIG.phone}`} className="hover:text-white transition-colors">{COMPANY_CONFIG.phone}</a></li>
            <li><a href={`mailto:${COMPANY_CONFIG.email}`} className="hover:text-white transition-colors">{COMPANY_CONFIG.email}</a></li>
            {onOpenAdmin && (
              <li className="pt-2">
                <button
                  type="button"
                  onClick={onOpenAdmin}
                  className="flex items-center gap-1.5 text-xs text-[#E8C96B] hover:text-white font-bold bg-[#143B25] border border-[#C9A84C]/40 px-3 py-1.5 rounded-xl transition-all cursor-pointer shadow-sm"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-[#C9A84C]" />
                  <span>{t.adminPortal}</span>
                </button>
              </li>
            )}
          </ul>
        </div>
      </div>

      <div className="max-w-6xl mx-auto border-t border-white/10 mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <span className="text-[11px] font-light text-white/40">{t.copyright}</span>
        <span className="text-[11px] font-semibold text-[#C9A84C]">{t.tagline}</span>
      </div>
    </footer>
  );
}
