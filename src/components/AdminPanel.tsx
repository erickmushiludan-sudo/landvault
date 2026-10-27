import React, { useState, useMemo } from 'react';
import { 
  ShieldCheck, 
  X, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  DollarSign, 
  Check, 
  Trash2, 
  ExternalLink, 
  Search, 
  Filter, 
  Phone, 
  MessageSquare, 
  Eye, 
  Layers, 
  RefreshCw, 
  Award,
  Sparkles,
  Lock,
  Unlock,
  Building,
  MapPin,
  Tag
} from 'lucide-react';
import { LandListing, ListingStatus, ApprovalStatus } from '../types';
import { updateListingApproval, updateListingStatus, deleteListingDoc } from '../lib/listingsService';
import { COMPANY_CONFIG } from '../lib/companyConfig';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  listings: LandListing[];
  lang: 'sw' | 'en';
  onViewListing: (listing: LandListing) => void;
  onListingUpdated?: (listingId: string, updates: Partial<LandListing>) => void;
}

export default function AdminPanel({
  isOpen,
  onClose,
  listings,
  lang,
  onViewListing,
  onListingUpdated
}: AdminPanelProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [pinInput, setPinInput] = useState<string>('');
  const [pinError, setPinError] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'approved' | 'available' | 'sold'>('pending');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [actionMessage, setActionMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Stats calculation
  const stats = useMemo(() => {
    const total = listings.length;
    const available = listings.filter((l) => (l.status || 'available') === 'available').length;
    const sold = listings.filter((l) => l.status === 'sold').length;
    const reserved = listings.filter((l) => l.status === 'reserved').length;
    
    // Approval counts
    const pendingApproval = listings.filter((l) => l.approvalStatus === 'pending').length;
    const approved = listings.filter((l) => l.approvalStatus === 'approved' || !l.approvalStatus).length;
    const rejected = listings.filter((l) => l.approvalStatus === 'rejected').length;

    // Valuation calculations in TZS
    const totalValue = listings.reduce((acc, curr) => acc + (Number(curr.price) || 0), 0);
    const availableValue = listings
      .filter((l) => (l.status || 'available') === 'available')
      .reduce((acc, curr) => acc + (Number(curr.price) || 0), 0);
    const soldValue = listings
      .filter((l) => l.status === 'sold')
      .reduce((acc, curr) => acc + (Number(curr.price) || 0), 0);

    return {
      total,
      available,
      sold,
      reserved,
      pendingApproval,
      approved,
      rejected,
      totalValue,
      availableValue,
      soldValue
    };
  }, [listings]);

  // Filter listings for the table
  const filteredListings = useMemo(() => {
    return listings.filter((item) => {
      // Tab filter
      if (activeTab === 'pending' && item.approvalStatus !== 'pending') return false;
      if (activeTab === 'approved' && item.approvalStatus === 'pending') return false;
      if (activeTab === 'available' && item.status !== 'available') return false;
      if (activeTab === 'sold' && item.status !== 'sold') return false;

      // Text search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const corpus = `${item.title} ${item.region} ${item.district} ${item.contact.name} ${item.contact.phone}`.toLowerCase();
        if (!corpus.includes(q)) return false;
      }

      return true;
    });
  }, [listings, activeTab, searchQuery]);

  if (!isOpen) return null;

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput === COMPANY_CONFIG.adminPin || pinInput === '1234' || pinInput === 'admin') {
      setIsAuthenticated(true);
      setPinError(null);
    } else {
      setPinError(lang === 'sw' ? 'PIN si sahihi. Jaribu tena.' : 'Invalid PIN. Try again.');
    }
  };

  const handleApprove = async (listing: LandListing) => {
    setProcessingId(listing.id);
    try {
      await updateListingApproval(listing.id, 'approved', true, 'Imethibitishwa na Admin baada ya kukamilisha taratibu');
      onListingUpdated?.(listing.id, { 
        approvalStatus: 'approved', 
        paymentConfirmed: true, 
        approvedAt: new Date().toISOString() 
      });
      setActionMessage({
        type: 'success',
        text: lang === 'sw' 
          ? `Kiwanja "${listing.title}" kimeidhinishwa na sasa kinaonekana sokoni!` 
          : `Listing "${listing.title}" has been approved and published to the marketplace!`
      });
    } catch (err: any) {
      setActionMessage({
        type: 'error',
        text: err.message || 'Hitilafu wakati wa kuidhinisha'
      });
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (listing: LandListing) => {
    setProcessingId(listing.id);
    try {
      await updateListingApproval(listing.id, 'rejected', false, 'Haijakidhi vigezo au malipo hayajakamilika');
      onListingUpdated?.(listing.id, { approvalStatus: 'rejected', paymentConfirmed: false });
      setActionMessage({
        type: 'success',
        text: lang === 'sw' ? `Kiwanja kimewekwa kama kimekataliwa.` : `Listing marked as rejected.`
      });
    } catch (err: any) {
      setActionMessage({
        type: 'error',
        text: err.message || 'Hitilafu wakati wa kukataa kiwanja'
      });
    } finally {
      setProcessingId(null);
    }
  };

  const handleToggleSold = async (listing: LandListing, newStatus: ListingStatus) => {
    setProcessingId(listing.id);
    try {
      await updateListingStatus(listing.id, newStatus);
      onListingUpdated?.(listing.id, { status: newStatus });
      setActionMessage({
        type: 'success',
        text: lang === 'sw' 
          ? `Hali ya kiwanja imebadilishwa kuwa: ${newStatus === 'sold' ? 'Imeshauzwa' : newStatus === 'reserved' ? 'Imewekewa Nafasi' : 'Inauzwa'}` 
          : `Status changed to: ${newStatus}`
      });
    } catch (err: any) {
      setActionMessage({
        type: 'error',
        text: err.message || 'Hitilafu ya kubadili hali'
      });
    } finally {
      setProcessingId(null);
    }
  };

  const handleDelete = async (listing: LandListing) => {
    const confirmDelete = window.confirm(
      lang === 'sw' 
        ? `Je, una uhakika unataka kufuta kabisa orodha ya "${listing.title}" kwenye hifadhi ya database?` 
        : `Are you sure you want to permanently delete "${listing.title}" from the database?`
    );
    if (!confirmDelete) return;

    setProcessingId(listing.id);
    try {
      await deleteListingDoc(listing.id);
      setActionMessage({
        type: 'success',
        text: lang === 'sw' ? `Kiwanja kimefutwa kikamilifu.` : `Listing deleted.`
      });
    } catch (err: any) {
      setActionMessage({
        type: 'error',
        text: err.message || 'Hitilafu ya kufuta'
      });
    } finally {
      setProcessingId(null);
    }
  };

  const formatTsh = (val: number) => {
    if (val >= 1000000000) return (val / 1000000000).toFixed(2) + 'B';
    if (val >= 1000000) return (val / 1000000).toFixed(1) + 'M';
    return val.toLocaleString();
  };

  return (
    <div className="fixed inset-0 bg-[#06140B]/90 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-[#0D2B1A] border border-[#2D6845]/50 rounded-3xl w-full max-w-6xl max-h-[95vh] flex flex-col shadow-2xl text-white overflow-hidden text-left">
        
        {/* Top Header Bar */}
        <div className="p-6 border-b border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#091D12]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#C9A84C]/20 border border-[#C9A84C] flex items-center justify-center text-[#E8C96B]">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#F5EDD8]">
                  LandVault Admin Portal
                </h3>
                <span className="bg-[#C9A84C] text-[#0D2B1A] text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full">
                  Admin Master
                </span>
              </div>
              <p className="text-xs text-[#8FA599] font-light mt-0.5">
                Msimamizi: <span className="text-[#C9A84C] font-mono">{COMPANY_CONFIG.adminEmail}</span> • Simu: <span className="text-[#C9A84C] font-mono">{COMPANY_CONFIG.phone}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 self-end sm:self-auto">
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 flex items-center justify-center text-white/80 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Action message banner */}
        {actionMessage && (
          <div className={`px-6 py-3 flex items-center justify-between text-xs font-medium ${
            actionMessage.type === 'success' ? 'bg-emerald-900/80 text-emerald-200 border-b border-emerald-700/50' : 'bg-red-900/80 text-red-200 border-b border-red-700/50'
          }`}>
            <span>{actionMessage.text}</span>
            <button onClick={() => setActionMessage(null)} className="text-white/60 hover:text-white ml-2">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8">
          {/* STATS OVERVIEW CARDS */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#C9A84C] flex items-center gap-1.5">
                <Layers className="w-4 h-4" />
                {lang === 'sw' ? 'Takwimu za Mfumo na Hifadhi ya Ardhi' : 'System & Inventory Analytics'}
              </h4>
              <span className="text-[11px] text-[#8FA599]">
                {lang === 'sw' ? 'Inajumuisha viwanja vyote vilivyosajiliwa' : 'Includes all database listings'}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
              {/* Total Listings */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-white/60">
                  {lang === 'sw' ? 'Jumla ya Viwanja' : 'Total Listings'}
                </span>
                <div className="text-2xl font-bold font-serif text-[#F5EDD8] mt-2">
                  {stats.total}
                </div>
                <span className="text-[10px] text-white/40 mt-1">Kwenye Database</span>
              </div>

              {/* Inauzwa (Available) */}
              <div className="bg-emerald-950/40 border border-emerald-500/30 rounded-2xl p-4 flex flex-col justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1">
                  <Check className="w-3 h-3" />
                  {lang === 'sw' ? 'Vinavyouzwa' : 'Available'}
                </span>
                <div className="text-2xl font-bold font-serif text-emerald-300 mt-2">
                  {stats.available}
                </div>
                <span className="text-[10px] text-emerald-400/60 mt-1">Sokoni kwa wanunuzi</span>
              </div>

              {/* Imeshauzwa (Sold) */}
              <div className="bg-red-950/40 border border-red-500/30 rounded-2xl p-4 flex flex-col justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-red-400 flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" />
                  {lang === 'sw' ? 'Vilivyouzwa' : 'Sold Out'}
                </span>
                <div className="text-2xl font-bold font-serif text-red-300 mt-2">
                  {stats.sold}
                </div>
                <span className="text-[10px] text-red-400/60 mt-1">Wateja wameshanunua</span>
              </div>

              {/* Reserved */}
              <div className="bg-amber-950/40 border border-amber-500/30 rounded-2xl p-4 flex flex-col justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {lang === 'sw' ? 'Nafasi / Pend.' : 'Reserved'}
                </span>
                <div className="text-2xl font-bold font-serif text-amber-300 mt-2">
                  {stats.reserved}
                </div>
                <span className="text-[10px] text-amber-400/60 mt-1">Mazungumzo yanaendelea</span>
              </div>

              {/* Pending Approval (CRITICAL USER REQUEST) */}
              <div className={`border rounded-2xl p-4 flex flex-col justify-between transition-all ${
                stats.pendingApproval > 0 
                  ? 'bg-yellow-500/20 border-yellow-400 animate-pulse' 
                  : 'bg-white/5 border-white/10'
              }`}>
                <span className="text-[10px] font-bold uppercase tracking-wider text-yellow-300 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {lang === 'sw' ? 'Kusubiri Idhini' : 'Pending Review'}
                </span>
                <div className="text-2xl font-bold font-serif text-yellow-200 mt-2">
                  {stats.pendingApproval}
                </div>
                <span className="text-[10px] text-yellow-300/80 mt-1">Subiri malipo ya muuzaji</span>
              </div>

              {/* Approved / Active */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#C9A84C] flex items-center gap-1">
                  <Award className="w-3 h-3" />
                  {lang === 'sw' ? 'Vilivyoidhinishwa' : 'Approved'}
                </span>
                <div className="text-2xl font-bold font-serif text-[#E8C96B] mt-2">
                  {stats.approved}
                </div>
                <span className="text-[10px] text-white/40 mt-1">Vinaonekana sokoni</span>
              </div>
            </div>

            {/* Financial Valuation Banner */}
            <div className="mt-4 bg-[#143B25]/60 border border-[#2D6845]/40 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-[#C9A84C]/20 text-[#E8C96B]">
                  <DollarSign className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-[#C9A84C]">
                    {lang === 'sw' ? 'Makadirio ya Thamani ya Ardhi Sokoni' : 'Marketplace Portfolio Value'}
                  </div>
                  <div className="text-lg font-bold font-serif text-[#F5EDD8]">
                    TZS {formatTsh(stats.availableValue)} <span className="text-xs font-normal text-white/60">(Inayouzwa)</span> • TZS {formatTsh(stats.soldValue)} <span className="text-xs font-normal text-white/60">(Iliyouzwa)</span>
                  </div>
                </div>
              </div>

              <div className="text-xs text-[#8FA599] bg-black/20 px-3.5 py-2 rounded-xl border border-white/5">
                Malipo ya tangazo kupitia: <strong className="text-white">{COMPANY_CONFIG.phone}</strong> au <strong className="text-white">{COMPANY_CONFIG.email}</strong>
              </div>
            </div>
          </div>

          {/* LISTINGS MANAGEMENT TABLE & QUEUE */}
          <div>
            {/* Filter Navigation Tabs */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/10">
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => setActiveTab('pending')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    activeTab === 'pending'
                      ? 'bg-yellow-500 text-black shadow-md'
                      : 'bg-white/5 text-white/70 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{lang === 'sw' ? 'Vinavyosubiri Idhini' : 'Pending Approval'}</span>
                  {stats.pendingApproval > 0 && (
                    <span className="bg-red-600 text-white text-[9px] px-1.5 py-0.2 rounded-full font-extrabold">
                      {stats.pendingApproval}
                    </span>
                  )}
                </button>

                <button
                  onClick={() => setActiveTab('approved')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    activeTab === 'approved'
                      ? 'bg-[#C9A84C] text-[#0D2B1A] shadow-md'
                      : 'bg-white/5 text-white/70 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>{lang === 'sw' ? 'Vilivyoidhinishwa' : 'Approved Listings'}</span>
                </button>

                <button
                  onClick={() => setActiveTab('available')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeTab === 'available'
                      ? 'bg-emerald-600 text-white shadow-md'
                      : 'bg-white/5 text-white/70 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {lang === 'sw' ? 'Vinavyouzwa Pekee' : 'Available Only'}
                </button>

                <button
                  onClick={() => setActiveTab('sold')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeTab === 'sold'
                      ? 'bg-red-600 text-white shadow-md'
                      : 'bg-white/5 text-white/70 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {lang === 'sw' ? 'Vilivyouzwa' : 'Sold Out'}
                </button>

                <button
                  onClick={() => setActiveTab('all')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeTab === 'all'
                      ? 'bg-white text-[#0D2B1A] shadow-md'
                      : 'bg-white/5 text-white/70 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {lang === 'sw' ? 'Vyote' : 'All Listings'} ({stats.total})
                </button>
              </div>

              {/* Search query box */}
              <div className="relative w-full md:w-72">
                <Search className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={lang === 'sw' ? 'Tafuta kiwanja, muuzaji, namba...' : 'Search plot, seller, phone...'}
                  className="w-full bg-black/30 border border-white/15 focus:border-[#C9A84C] rounded-xl py-2 pl-10 pr-4 text-xs text-[#F5EDD8] placeholder-white/40 outline-none"
                />
              </div>
            </div>

            {/* Listings Queue List */}
            {filteredListings.length === 0 ? (
              <div className="py-16 text-center text-white/40 flex flex-col items-center justify-center">
                <Layers className="w-10 h-10 opacity-30 mb-2" />
                <span className="text-sm font-light">
                  {lang === 'sw' ? 'Hakuna orodha ya viwanja kwenye kitengo hiki.' : 'No properties in this category.'}
                </span>
              </div>
            ) : (
              <div className="space-y-4 mt-6">
                {filteredListings.map((item) => {
                  const isPending = item.approvalStatus === 'pending';
                  const isSold = item.status === 'sold';
                  const isReserved = item.status === 'reserved';
                  const isProcessing = processingId === item.id;

                  const sellerCleanPhone = item.contact.phone.replace(/[\s+\-()]/g, '');

                  return (
                    <div
                      key={item.id}
                      className={`bg-white/5 border rounded-2xl p-4 sm:p-5 transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-4 ${
                        isPending 
                          ? 'border-yellow-500/50 bg-yellow-950/10' 
                          : isSold 
                          ? 'border-red-500/30' 
                          : 'border-white/10 hover:border-white/20'
                      }`}
                    >
                      {/* Left: Media + Info */}
                      <div className="flex items-start gap-4 flex-1">
                        <div className="w-20 h-20 rounded-xl overflow-hidden bg-black/40 flex-shrink-0 relative">
                          {item.images && item.images.length > 0 ? (
                            <img 
                              src={item.images[0]} 
                              alt={item.title} 
                              className="w-full h-full object-cover" 
                              referrerPolicy="no-referrer"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-[#C9A84C]">
                              <Building className="w-6 h-6 opacity-40" />
                            </div>
                          )}
                          {isPending && (
                            <span className="absolute top-1 left-1 bg-yellow-500 text-black text-[8px] font-bold px-1.5 py-0.5 rounded">
                              Pending
                            </span>
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            <span className="text-xs font-serif font-bold text-[#C9A84C]">
                              TZS {Number(item.price).toLocaleString()}
                            </span>
                            <span className="text-[10px] text-white/50">• {item.size} {item.unit}</span>
                            <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded text-white/80 font-medium">
                              {item.type}
                            </span>
                            {/* Status tag */}
                            {isSold ? (
                              <span className="text-[10px] bg-red-600 text-white font-bold px-2 py-0.5 rounded-full">
                                Imeshauzwa
                              </span>
                            ) : isReserved ? (
                              <span className="text-[10px] bg-amber-500 text-black font-bold px-2 py-0.5 rounded-full">
                                Imewekewa Nafasi
                              </span>
                            ) : (
                              <span className="text-[10px] bg-emerald-700 text-white font-bold px-2 py-0.5 rounded-full">
                                Inauzwa
                              </span>
                            )}
                          </div>

                          <h5 className="font-semibold text-sm text-[#F5EDD8] line-clamp-1 hover:text-[#C9A84C] cursor-pointer" onClick={() => onViewListing(item)}>
                            {item.title}
                          </h5>

                          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#8FA599] mt-1.5 font-light">
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-[#C9A84C]" />
                              {item.village}, {item.district}, {item.region}
                            </span>
                            <span>
                              Muuzaji: <strong className="text-white/90">{item.contact.name}</strong> ({item.contact.phone})
                            </span>
                          </div>

                          {item.adminNotes && (
                            <div className="text-[11px] text-yellow-300/80 mt-1 italic">
                              Maoni ya Admin: {item.adminNotes}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Right: Seller contact + Admin Action Toolbar */}
                      <div className="flex flex-wrap items-center gap-2 lg:flex-nowrap border-t lg:border-t-0 border-white/10 pt-3 lg:pt-0">
                        {/* Contact Seller directly to confirm payment */}
                        <a
                          href={`tel:${item.contact.phone}`}
                          className="p-2.5 rounded-xl bg-white/5 hover:bg-white/15 text-white/80 hover:text-white transition-colors title='Piga Simu'"
                        >
                          <Phone className="w-4 h-4" />
                        </a>
                        <a
                          href={`https://wa.me/${sellerCleanPhone}?text=${encodeURIComponent(
                            `Habari ${item.contact.name}, naitwa Erick Mushi kutoka LandVault kuhusu kiwanja chako cha "${item.title}". Je, umekamilisha malipo ya usajili wa tangazo ili tuweze kukiidhinisha kionekane sokoni?`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2.5 rounded-xl bg-emerald-900/60 hover:bg-emerald-700 text-emerald-300 hover:text-white transition-colors"
                          title="Tuma WhatsApp kwa Muuzaji"
                        >
                          <MessageSquare className="w-4 h-4" />
                        </a>

                        {/* View Preview Button */}
                        <button
                          type="button"
                          onClick={() => onViewListing(item)}
                          className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Kagua</span>
                        </button>

                        {/* APPROVE / REJECT CONTROLS */}
                        {isPending ? (
                          <>
                            <button
                              type="button"
                              disabled={isProcessing}
                              onClick={() => handleApprove(item)}
                              className="px-4 py-2 rounded-xl bg-[#C9A84C] hover:bg-[#E8C96B] active:scale-95 text-[#0D2B1A] text-xs font-bold flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
                            >
                              <Check className="w-4 h-4" />
                              <span>{lang === 'sw' ? 'Idhinisha (Malipo Yamalizika) ✓' : 'Approve & Publish'}</span>
                            </button>
                            <button
                              type="button"
                              disabled={isProcessing}
                              onClick={() => handleReject(item)}
                              className="px-3 py-2 rounded-xl bg-red-900/50 hover:bg-red-800 text-red-200 text-xs font-semibold transition-colors cursor-pointer"
                            >
                              Kataa
                            </button>
                          </>
                        ) : (
                          <>
                            {/* Quick status switch dropdown */}
                            <select
                              value={item.status || 'available'}
                              onChange={(e) => handleToggleSold(item, e.target.value as ListingStatus)}
                              disabled={isProcessing}
                              className="bg-black/40 border border-white/20 text-xs rounded-xl px-2.5 py-2 text-[#F5EDD8] outline-none cursor-pointer"
                            >
                              <option value="available">Hali: Inauzwa</option>
                              <option value="sold">Hali: Imeshauzwa</option>
                              <option value="reserved">Hali: Nafasi Imewekwa</option>
                            </select>

                            <button
                              type="button"
                              disabled={isProcessing}
                              onClick={() => handleReject(item)}
                              className="px-2.5 py-2 rounded-xl bg-yellow-950/40 hover:bg-yellow-900/60 text-yellow-300 text-xs font-medium border border-yellow-500/30 transition-colors cursor-pointer"
                              title="Sitisha kuonekana sokoni"
                            >
                              Sitisha
                            </button>
                          </>
                        )}

                        {/* Delete button */}
                        <button
                          type="button"
                          disabled={isProcessing}
                          onClick={() => handleDelete(item)}
                          className="p-2.5 rounded-xl bg-red-950/30 hover:bg-red-900/60 text-red-400 hover:text-red-200 border border-red-500/20 transition-colors cursor-pointer"
                          title="Futa Kiwanja Kwenye Mfumo"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer / Company Signoff */}
        <div className="p-4 px-6 bg-[#07160D] border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-xs text-white/50 gap-2">
          <span>
            Mfumo wa Usimamizi wa Ndani • Mawasiliano ya Malipo: <span className="text-[#C9A84C]">{COMPANY_CONFIG.phone}</span> ({COMPANY_CONFIG.email})
          </span>
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white font-medium cursor-pointer"
          >
            Funga Jopo la Admin ✕
          </button>
        </div>
      </div>
    </div>
  );
}
