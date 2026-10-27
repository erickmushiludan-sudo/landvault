import React, { useState } from 'react';
import { 
  ChevronRight, 
  ChevronLeft, 
  Plus, 
  CheckCircle, 
  Upload, 
  Trash2, 
  Video, 
  Camera, 
  Compass, 
  Check,
  Crosshair,
  Film,
  AlertCircle
} from 'lucide-react';
import { addListing } from '../lib/listingsService';
import { uploadLandVideo } from '../lib/videoUpload';
import { TANZANIA_REGIONS } from '../lib/tanzaniaRegions';
import { LandType } from '../types';
import { COMPANY_CONFIG } from '../lib/companyConfig';

interface AddListingFormProps {
  lang: 'sw' | 'en';
  onSuccess: () => void;
}

export default function AddListingForm({ lang, onSuccess }: AddListingFormProps) {
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [gpsLoading, setGpsLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Form Field States - Step 1: Basic
  const [title, setTitle] = useState('');
  const [type, setType] = useState<LandType | ''>('Residential');
  const [price, setPrice] = useState('');
  const [size, setSize] = useState('');
  const [unit, setUnit] = useState('Ekari');
  const [plotNumber, setPlotNumber] = useState('');
  const [paymentTerms, setPaymentTerms] = useState('Maelewano');
  const [leasePeriod, setLeasePeriod] = useState('Miaka 99');
  const [desc, setDesc] = useState('');

  // Step 2: Location
  const [region, setRegion] = useState('Dar es Salaam');
  const [district, setDistrict] = useState('');
  const [ward, setWard] = useState('');
  const [village, setVillage] = useState('');
  const [lat, setLat] = useState('');
  const [lon, setLon] = useState('');
  const [road, setRoad] = useState('');
  const [roadcond, setRoadcond] = useState('Barabara ya Changarawe');

  // Step 3: Land specs & Infrastructure
  const [deed, setDeed] = useState('Hati Miliki Iliyosajiliwa (CCRO/Hati)');
  const [beaconsPlaced, setBeaconsPlaced] = useState(true);
  const [topo, setTopo] = useState('Bapa / Tambarare');
  const [soil, setSoil] = useState('Udongo wa Mbolea');
  const [utilities, setUtilities] = useState<string[]>(['Water', 'Electricity']);
  const [waterDetails, setWaterDetails] = useState('');
  const [electricityDetails, setElectricityDetails] = useState('');
  const [amenities, setAmenities] = useState('');

  // Step 4: Media (Photos & Video Upload)
  const [images, setImages] = useState<string[]>([]);
  const [imageUrlInput, setImageUrlInput] = useState('');
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string>('');
  const [videoFileName, setVideoFileName] = useState<string>('');
  const [videoSize, setVideoSize] = useState<number>(0);
  const [videoTitle, setVideoTitle] = useState<string>('');
  const [uploadingVideo, setUploadingVideo] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);

  // Step 5: Contact
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPreferred, setContactPreferred] = useState('WhatsApp');
  const [contactRole, setContactRole] = useState('Mmiliki / Muuzaji wa Moja kwa Moja');
  const [contactNotes, setContactNotes] = useState('');

  const t = {
    sw: {
      sectionTitle: 'Orodhesha Ardhi Yako Mtandaoni',
      sectionSub: 'Jukwaa lenye uwezo wa kuhifadhi maelfu ya orodha za ardhi kote Tanzania, lenye picha na video za ukaguzi wa kina zilizopakiwa moja kwa moja.',
      formTitle: 'Sajili Ardhi Mpya',
      formSub: 'Jaza taarifa zote sahihi za ardhi ili kuvutia wanunuzi makini kwa haraka',
      step1: '1. Taarifa za Msingi',
      step2: '2. Mahali & Eneo',
      step3: '3. Hati & Miundombinu',
      step4: '4. Picha & Video',
      step5: '5. Mawasiliano',
      fTitle: 'Kichwa cha Orodha ya Ardhi *',
      fTitlePl: 'Mfano: Shamba la Hekari 20 Karibu na Mto – Morogoro',
      fType: 'Aina ya Ardhi *',
      fPrice: 'Bei Inayoulizwa (TZS) *',
      fPricePl: 'Mfano: 35000000',
      fSize: 'Ukubwa wa Eneo *',
      fSizePl: 'Mfano: 15',
      fUnit: 'Kipimo cha Ardhi',
      fPlot: 'Nambari ya Kiwanja / Block (Plot No.)',
      fPlotPl: 'Mfano: Plot 104, Block C au Shamba Na. 12',
      fPayment: 'Masharti ya Malipo',
      fLease: 'Muda wa Hati / Umiliki',
      fDesc: 'Maelezo ya Kina ya Ardhi *',
      fDescPl: 'Eleza ubora wa ardhi, shughuli zinazofaa, uoto wa asili, majirani, na sababu za kuuza...',
      fRegion: 'Mkoa (Mikoa Yote ya Tanzania) *',
      fDistrict: 'Wilaya *',
      fDistrictPl: 'Mfano: Bagamoyo',
      fWard: 'Kata *',
      fWardPl: 'Mfano: Fukayosi',
      fVillage: 'Kijiji / Mtaa *',
      fVillagePl: 'Mfano: Makurunge',
      fLat: 'GPS Latitude',
      fLon: 'GPS Longitude',
      gpsBtn: 'Chukua GPS Yangu Sasa',
      fRoad: 'Umbali kutoka Barabara Kuu',
      fRoadPl: 'Mfano: mita 150 kutoka barabara ya lami',
      fRoadCond: 'Hali ya Barabara',
      fDeed: 'Hati Miliki ya Ardhi *',
      fBeacons: 'Vigingi vya Mipaka (Survey Beacons)',
      fBeaconsYes: 'Ndio, vigingi vimewekwa tayari',
      fBeaconsNo: 'Bado havijawekwa',
      fTopo: 'Topografia / Mandhari',
      fSoil: 'Aina ya Udongo',
      fUtils: 'Huduma Zinazopatikana',
      fWaterDetail: 'Maelezo ya Ziada ya Maji',
      fWaterDetailPl: 'Mfano: Mto unapita mpakani, au maji ya bomba ya DAWASA yapo',
      fElecDetail: 'Maelezo ya Ziada ya Umeme',
      fElecDetailPl: 'Mfano: Nguzo ya TANESCO iko mita 20, transfoma iko karibu',
      fAmenities: 'Huduma za Karibu (Shule, Hospitali, Masoko)',
      fAmenitiesPl: 'Mfano: Zahanati iko mita 500, Shule ya Msingi km 1...',
      fPhotos: 'Picha za Ardhi (Picha Halisi)',
      photoUploadText: 'Bofya au kokota picha hapa (JPG, PNG)',
      photoUploadSub: 'Picha hubanwa kiotomatiki kwa usalama na kuwezesha database kuhifadhi maelfu ya data',
      addUrlBtn: 'Weka kwa URL',
      urlPl: 'Bandika kiungo cha picha (https://...)',
      fVideo: 'Pakia Video ya Ardhi (Video Tour / Drone Footage)',
      videoSub: 'Pakia faili la video moja kwa moja kutoka kwenye simu au kompyuta yako (MP4, WebM, MOV)',
      videoUploadTitle: 'Bofya hapa kupakia faili la video ya ardhi',
      videoUploadSub: 'Inasaidia faili za MP4, WebM, MOV (Hadi 50MB)',
      videoTitleField: 'Kichwa / Maelezo ya Video',
      videoTitlePl: 'Mfano: Mandhari ya Angani (Drone) & Ziara ya Shambani',
      removeVideoBtn: 'Ondoa Video Hii',
      fName: 'Jina Kamili la Muuzaji *',
      fNamePl: 'Mfano: Erick Mushi',
      fPhone: 'Nambari ya Simu (Yenye Code ya Nchi) *',
      fPhonePl: 'Mfano: +255 765 432 109',
      fEmail: 'Barua Pepe (Email)',
      fEmailPl: 'Mfano: erick@landvault.co.tz',
      fPreferred: 'Njia Pendwa ya Mawasiliano',
      fRole: 'Nafasi Yako Kuhusiana na Ardhi',
      fNotes: 'Maelezo ya Ziada kwa Wanunuzi',
      fNotesPl: 'Mfano: Hati ipo safi haina mgogoro, nipo tayari kwa mazungumzo...',
      terms: '✓ Nathibitisha kuwa taarifa zote za ardhi, picha na video zilizopakiwa ni halisi na nina haki kisheria ya kuitangaza ardhi hii.',
      next: 'Inayofuata ↗',
      prev: '← Rudi Nyuma',
      publish: 'Sajili Ardhi Yako Sasa ✓',
      publishing: 'Inasajili kwenye Database...',
      successTitle: 'Ardhi Imewasilishwa Kikamilifu!',
      successSub: 'Hongera! Taarifa, picha na video ya kiwanja chako zimehifadhiwa salama kwenye database. Ili kiwanja kianze kuonekana moja kwa moja sokoni kwa wanunuzi, tafadhali thibitisha au kamilisha malipo ya usajili na Admin kupitia namba 0745636292 au barua pepe erickmushiludan@gmail.com.',
      addAnother: 'Sajili Kiwanja Kingine +'
    },
    en: {
      sectionTitle: 'List Your Land Online',
      sectionSub: 'High-capacity database architecture built to store tens of thousands of verified land properties across Tanzania with photos, uploaded video tours, and precision specs.',
      formTitle: 'Register New Land',
      formSub: 'Provide complete property parameters to attract verified buyers faster',
      step1: '1. Basic Info',
      step2: '2. Location & GPS',
      step3: '3. Title & Specs',
      step4: '4. Photos & Video',
      step5: '5. Contact Info',
      fTitle: 'Listing Title *',
      fTitlePl: 'e.g., 20 Acres Riverfront Agricultural Farm – Morogoro',
      fType: 'Land Category *',
      fPrice: 'Asking Price (TZS) *',
      fPricePl: 'e.g., 35000000',
      fSize: 'Property Size *',
      fSizePl: 'e.g., 15',
      fUnit: 'Measurement Unit',
      fPlot: 'Survey Plot / Block Number',
      fPlotPl: 'e.g., Plot 104, Block C or Farm No. 12',
      fPayment: 'Payment Terms',
      fLease: 'Lease Duration / Tenure',
      fDesc: 'Full Land Description *',
      fDescPl: 'Describe soil fertility, potential uses, topography, neighbors, title clarity...',
      fRegion: 'Region (All 31 Tanzania Regions) *',
      fDistrict: 'District *',
      fDistrictPl: 'e.g., Bagamoyo',
      fWard: 'Ward *',
      fWardPl: 'e.g., Fukayosi',
      fVillage: 'Village / Street *',
      fVillagePl: 'e.g., Makurunge',
      fLat: 'GPS Latitude',
      fLon: 'GPS Longitude',
      gpsBtn: 'Get My Current GPS',
      fRoad: 'Distance to Main Highway',
      fRoadPl: 'e.g., 150 meters from tarmac road',
      fRoadCond: 'Access Road Condition',
      fDeed: 'Title Deed Status *',
      fBeacons: 'Boundary Survey Beacons',
      fBeaconsYes: 'Yes, survey beacons are placed',
      fBeaconsNo: 'Not placed yet',
      fTopo: 'Topography',
      fSoil: 'Main Soil Type',
      fUtils: 'Available Utilities',
      fWaterDetail: 'Water Source Details',
      fWaterDetailPl: 'e.g., Year-round river border, or municipal DAWASA water',
      fElecDetail: 'Electricity Details',
      fElecDetailPl: 'e.g., TANESCO pole within 20m, transformer adjacent',
      fAmenities: 'Nearby Amenities',
      fAmenitiesPl: 'e.g., Dispensary 500m away, Primary School 1km...',
      fPhotos: 'Land Photos (High Resolution)',
      photoUploadText: 'Click or drop land photos here (JPG, PNG)',
      photoUploadSub: 'Photos are automatically compressed client-side to ensure scalable storage for thousands of records',
      addUrlBtn: 'Add via URL',
      urlPl: 'Paste image link (https://...)',
      fVideo: 'Upload Land Video (Tour / Drone Footage)',
      videoSub: 'Upload your video file directly from your phone or computer (MP4, WebM, MOV)',
      videoUploadTitle: 'Click here to upload land video file',
      videoUploadSub: 'Supports MP4, WebM, MOV files (Up to 50MB)',
      videoTitleField: 'Video Title / Tag',
      videoTitlePl: 'e.g., Aerial Drone Survey & Property Walkthrough',
      removeVideoBtn: 'Remove This Video',
      fName: 'Full Name *',
      fNamePl: 'e.g., Erick Mushi',
      fPhone: 'Phone Number (with country code) *',
      fPhonePl: 'e.g., +255 765 432 109',
      fEmail: 'Email Address',
      fEmailPl: 'e.g., erick@landvault.co.tz',
      fPreferred: 'Preferred Contact Method',
      fRole: 'Your Role / Status',
      fNotes: 'Additional Notes for Buyers',
      fNotesPl: 'e.g., Clear title deed in hand, negotiable, site visits arranged...',
      terms: '✓ I confirm all information, photos and uploaded video are genuine and I have legal rights to market this land.',
      next: 'Next Step ↗',
      prev: '← Previous',
      publish: 'Publish Land Listing ✓',
      publishing: 'Saving to Database...',
      successTitle: 'Land Submitted Successfully!',
      successSub: 'Congratulations! Your listing with photos and video is securely saved. To activate and display your land to buyers on the public marketplace, please confirm listing payment with the admin via 0745636292 or email erickmushiludan@gmail.com.',
      addAnother: 'Add Another Listing +'
    }
  }[lang];

  // Geolocation detector
  const handleDetectGPS = () => {
    if (!navigator.geolocation) {
      alert(lang === 'sw' ? 'Kifaa chako hakiruhusu utambuzi wa GPS.' : 'Geolocation is not supported by your browser.');
      return;
    }
    setGpsLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLat(pos.coords.latitude.toFixed(6));
        setLon(pos.coords.longitude.toFixed(6));
        setGpsLoading(false);
      },
      (err) => {
        setGpsLoading(false);
        alert(lang === 'sw' ? `Haikuweza kupata GPS: ${err.message}` : `GPS lookup failed: ${err.message}`);
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  // Image compressor & handler
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const fileList = Array.from(files);
    const remainingCount = 8 - images.length;
    const selectedFiles = fileList.slice(0, remainingCount);

    selectedFiles.forEach((file: any) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          const img = new Image();
          img.src = event.target.result as string;
          img.onload = () => {
            const canvas = document.createElement('canvas');
            const MAX_WIDTH = 1000;
            const MAX_HEIGHT = 750;
            let width = img.width;
            let height = img.height;

            if (width > height) {
              if (width > MAX_WIDTH) {
                height *= MAX_WIDTH / width;
                width = MAX_WIDTH;
              }
            } else {
              if (height > MAX_HEIGHT) {
                width *= MAX_HEIGHT / height;
                height = MAX_HEIGHT;
              }
            }

            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            ctx?.drawImage(img, 0, 0, width, height);
            const compressedBase64 = canvas.toDataURL('image/jpeg', 0.65);
            setImages((prev) => [...prev, compressedBase64]);
          };
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleAddImageUrl = () => {
    if (!imageUrlInput.trim()) return;
    if (images.length >= 8) {
      alert(lang === 'sw' ? 'Upeo ni picha 8.' : 'Maximum 8 photos allowed.');
      return;
    }
    setImages((prev) => [...prev, imageUrlInput.trim()]);
    setImageUrlInput('');
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  // Video file upload handler
  const handleVideoFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('video/')) {
      alert(lang === 'sw' ? 'Tafadhali chagua faili sahihi la video (MP4, WebM, MOV).' : 'Please select a valid video file (MP4, WebM, MOV).');
      return;
    }

    if (file.size > 55 * 1024 * 1024) {
      alert(lang === 'sw' ? 'Ukubwa wa video usizidi 50MB kwa ajili ya kufanya kazi kwa haraka.' : 'Video size must be under 50MB for optimal performance.');
      return;
    }

    setVideoFile(file);
    setVideoFileName(file.name);
    setVideoSize(file.size);
    if (!videoTitle) {
      setVideoTitle(lang === 'sw' ? 'Ziara ya Video ya Ardhi (Video Tour)' : 'Property Video Tour');
    }

    // Instant local object preview so user can play it right away
    const localPreviewUrl = URL.createObjectURL(file);
    setVideoUrl(localPreviewUrl);

    // Upload to Storage or persistent DB in background
    setUploadingVideo(true);
    setUploadProgress(15);
    try {
      const res = await uploadLandVideo(file, (pct) => setUploadProgress(pct));
      setVideoUrl(res.url);
    } catch (err) {
      console.warn('Video background upload fallback active:', err);
      // local preview is already active and functional
    } finally {
      setUploadingVideo(false);
    }
  };

  const removeVideo = () => {
    setVideoFile(null);
    setVideoUrl('');
    setVideoFileName('');
    setVideoSize(0);
    setVideoTitle('');
  };

  // Validation before step transition
  const validateStep = (currentStep: number) => {
    setFormError(null);
    if (currentStep === 1) {
      if (!title.trim() || !type || !price || !size || !desc.trim()) {
        setFormError(lang === 'sw' ? 'Tafadhali jaza sehemu zote zenye alama ya nyota (*) za msingi.' : 'Please fill all required basic information fields.');
        return false;
      }
    } else if (currentStep === 2) {
      if (!region || !district.trim() || !ward.trim() || !village.trim()) {
        setFormError(lang === 'sw' ? 'Tafadhali jaza taarifa zote za mahali ilipo ardhi (Mkoa, Wilaya, Kata, Kijiji).' : 'Please fill complete location fields.');
        return false;
      }
    } else if (currentStep === 3) {
      if (!deed) {
        setFormError(lang === 'sw' ? 'Tafadhali chagua hali ya hati miliki.' : 'Please select a deed status.');
        return false;
      }
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setFormError(null);
      setStep((prev) => Math.min(prev + 1, 5));
    }
  };

  const handlePrev = () => {
    setFormError(null);
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    if (!contactName.trim() || !contactPhone.trim()) {
      setFormError(lang === 'sw' ? 'Tafadhali jaza jina lako na nambari ya simu ya mawasiliano.' : 'Please enter your contact name and telephone number.');
      return;
    }

    setSubmitting(true);
    try {
      const cleanPriceStr = price.replace(/[,\s]/g, '');
      const parsedPrice = parseInt(cleanPriceStr, 10) || 0;
      const parsedSize = parseFloat(size) || 0;

      const randomColor = ['from-green', 'from-blue', 'from-amber', 'from-purple', 'from-cyan'][Math.floor(Math.random() * 5)];

      const newListingData = {
        title: title.trim(),
        type: type as LandType,
        status: 'available' as const,
        price: parsedPrice,
        size: parsedSize,
        unit,
        plotNumber: plotNumber.trim() || null,
        paymentTerms: paymentTerms.trim() || null,
        leasePeriod: leasePeriod.trim() || null,
        desc: desc.trim(),
        region,
        district: district.trim(),
        ward: ward.trim(),
        village: village.trim(),
        lat: lat.trim() || null,
        lon: lon.trim() || null,
        road: road.trim() || null,
        roadcond,
        deed,
        beaconsPlaced,
        topo,
        soil,
        utilities,
        waterDetails: waterDetails.trim() || null,
        electricityDetails: electricityDetails.trim() || null,
        amenities: amenities.trim() || null,
        images,
        videoUrl: videoUrl || null,
        videoTitle: videoTitle.trim() || (videoUrl ? (lang === 'sw' ? 'Ziara ya Video ya Ardhi' : 'Land Video Tour') : null),
        videoFileName: videoFileName || null,
        videoSize: videoSize || null,
        contact: {
          name: contactName.trim(),
          phone: contactPhone.trim(),
          email: contactEmail.trim() || null,
          preferred: contactPreferred as any,
          role: contactRole,
          notes: contactNotes.trim() || null
        },
        featured: false,
        color: randomColor
      };

      await addListing(newListingData);
      setShowSuccess(true);
      onSuccess();
    } catch (err: any) {
      console.error('Error adding land listing:', err);
      setFormError(lang === 'sw' ? `Kosa wakati wa kusajili ardhi: ${err.message}` : `Error registering land: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setTitle('');
    setType('Residential');
    setPrice('');
    setSize('');
    setPlotNumber('');
    setDesc('');
    setDistrict('');
    setWard('');
    setVillage('');
    setLat('');
    setLon('');
    setRoad('');
    setImages([]);
    setVideoFile(null);
    setVideoUrl('');
    setVideoFileName('');
    setVideoSize(0);
    setVideoTitle('');
    setContactName('');
    setContactPhone('');
    setContactEmail('');
    setContactNotes('');
    setStep(1);
    setShowSuccess(false);
  };

  return (
    <section id="add-listing" className="py-20 px-6 md:px-12 bg-[#091D12] text-white relative overflow-hidden">
      {/* Background ambient texture */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#C9A84C_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 bg-[#C9A84C]/15 border border-[#C9A84C]/30 text-[#E8C96B] font-bold text-xs uppercase tracking-widest px-4 py-1.5 rounded-full mb-3">
            <Plus className="w-3.5 h-3.5" />
            {t.formTitle}
          </div>
          <h2 className="font-serif text-3xl md:text-5xl font-bold text-[#F5EDD8] tracking-tight leading-tight">
            {t.sectionTitle}
          </h2>
          <p className="text-[#8FA599] text-sm md:text-base font-light mt-3 leading-relaxed">
            {t.sectionSub}
          </p>
        </div>

        {/* Wizard Form Container */}
        <div className="bg-[#0D2B1A] border border-[#2D6845]/40 rounded-3xl p-6 md:p-10 shadow-2xl">
          {showSuccess ? (
            /* Success State */
            <div className="py-16 text-center max-w-lg mx-auto flex flex-col items-center">
              <div className="w-20 h-20 rounded-full bg-[#C9A84C]/20 border border-[#C9A84C] flex items-center justify-center text-[#E8C96B] mb-6 animate-bounce">
                <CheckCircle className="w-10 h-10" />
              </div>
              <h3 className="font-serif text-3xl font-bold text-[#F5EDD8] mb-3">
                {t.successTitle}
              </h3>
              <p className="text-[#8FA599] text-sm font-light leading-relaxed mb-8">
                {t.successSub}
              </p>
              {/* Payment & Admin Verification Notice Box */}
              <div className="w-full bg-[#143B25]/80 border border-[#C9A84C]/40 rounded-2xl p-5 mb-8 text-left space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#C9A84C]">
                  <Phone className="w-4 h-4 text-[#C9A84C]" />
                  <span>{lang === 'sw' ? 'Wasiliana na Admin Kukamilisha Malipo & Uthibitisho' : 'Contact Admin to Finalize Payment & Approval'}</span>
                </div>
                <div className="text-xs text-[#F5EDD8]/90 font-light space-y-1.5 leading-relaxed">
                  <div>
                    Namba ya Simu / WhatsApp ya Kampuni: <strong className="text-white font-mono">{COMPANY_CONFIG.phone}</strong> (Erick Mushi)
                  </div>
                  <div>
                    Barua Pepe Rasmi: <strong className="text-white font-mono">{COMPANY_CONFIG.email}</strong>
                  </div>
                  <div className="text-[11px] text-[#C9A84C] pt-1">
                    {lang === 'sw' 
                      ? '✓ Baada ya kuthibitisha malipo, tangazo lako litawekwa "Approved" na kuanza kuonekana sokoni mara moja.' 
                      : '✓ Once payment is verified by the admin, your listing status will be set to "Approved" and go live immediately.'}
                  </div>
                </div>

                <a
                  href={`https://wa.me/255745636292?text=${encodeURIComponent(
                    `Habari Admin Erick Mushi (LandVault), nimemaliza kusajili kiwanja changu kwenye mfumo: "${title}". Naomba uthibitisho wa malipo na idhini ya kiwanja changu kionekane sokoni.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-md transition-colors mt-2"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>{lang === 'sw' ? 'Tuma Uthibitisho WhatsApp (0745636292)' : 'Send Confirmation via WhatsApp'}</span>
                </a>
              </div>

              <div className="flex flex-wrap gap-4 justify-center">
                <a
                  href="#listings"
                  className="bg-[#C9A84C] hover:bg-[#E8C96B] text-[#0D2B1A] font-bold text-sm px-6 py-3.5 rounded-full shadow-lg transition-transform active:scale-95"
                >
                  {lang === 'sw' ? 'Tazama Kwenye Orodha ↗' : 'View In Marketplace ↗'}
                </a>
                <button
                  onClick={resetForm}
                  className="bg-white/10 hover:bg-white/15 border border-white/20 text-[#F5EDD8] font-semibold text-sm px-6 py-3.5 rounded-full transition-all cursor-pointer"
                >
                  {t.addAnother}
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              {/* Stepper Header */}
              <div className="mb-10 pb-6 border-b border-[#2D6845]/40">
                <div className="flex items-center justify-between mb-4 overflow-x-auto pb-2 gap-2">
                  {[
                    { num: 1, label: t.step1 },
                    { num: 2, label: t.step2 },
                    { num: 3, label: t.step3 },
                    { num: 4, label: t.step4 },
                    { num: 5, label: t.step5 }
                  ].map((s) => (
                    <button
                      type="button"
                      key={s.num}
                      onClick={() => {
                        if (s.num < step || validateStep(step)) {
                          setStep(s.num);
                        }
                      }}
                      className={`flex items-center gap-2 text-xs font-semibold px-3 py-2 rounded-xl transition-all whitespace-nowrap cursor-pointer ${
                        step === s.num
                          ? 'bg-[#C9A84C] text-[#0D2B1A] shadow-md font-bold'
                          : step > s.num
                          ? 'bg-[#1A4029] text-[#E8C96B]'
                          : 'bg-white/5 text-white/40'
                      }`}
                    >
                      <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                        step === s.num ? 'bg-[#0D2B1A] text-[#C9A84C]' : 'bg-white/10'
                      }`}>
                        {s.num}
                      </span>
                      <span className="hidden sm:inline">{s.label.split('. ')[1]}</span>
                    </button>
                  ))}
                </div>

                <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-[#C9A84C] to-[#E8C96B] h-full transition-all duration-300"
                    style={{ width: `${(step / 5) * 100}%` }}
                  />
                </div>
              </div>

              {/* Form Validation Error Banner */}
              {formError && (
                <div className="mb-6 p-4 bg-red-950/80 border border-red-500/40 rounded-2xl text-red-200 text-xs flex items-center gap-3 shadow-lg">
                  <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                  <span className="font-medium">{formError}</span>
                </div>
              )}

              {/* STEP 1: Basic Info */}
              {step === 1 && (
                <div className="space-y-6 text-left">
                  <div>
                    <label className="block text-xs font-bold text-[#E8C96B] tracking-wider uppercase mb-2">
                      {t.fTitle}
                    </label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder={t.fTitlePl}
                      required
                      className="w-full bg-[#08180E] border border-[#2D6845]/50 focus:border-[#C9A84C] rounded-2xl p-4 text-[#F5EDD8] placeholder-white/20 text-sm outline-none transition-colors"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold text-[#E8C96B] tracking-wider uppercase mb-2">
                        {t.fType}
                      </label>
                      <select
                        value={type}
                        onChange={(e) => setType(e.target.value as LandType)}
                        className="w-full bg-[#08180E] border border-[#2D6845]/50 focus:border-[#C9A84C] rounded-2xl p-4 text-[#F5EDD8] text-sm outline-none transition-colors cursor-pointer"
                      >
                        <option value="Residential">{lang === 'sw' ? 'Makazi (Residential)' : 'Residential'}</option>
                        <option value="Agricultural">{lang === 'sw' ? 'Kilimo & Mifugo (Agricultural)' : 'Agricultural'}</option>
                        <option value="Commercial">{lang === 'sw' ? 'Biashara & Hoteli (Commercial)' : 'Commercial'}</option>
                        <option value="Industrial">{lang === 'sw' ? 'Viwanda & Maghala (Industrial)' : 'Industrial'}</option>
                        <option value="Mixed Use">{lang === 'sw' ? 'Matumizi Mchanganyiko (Mixed Use)' : 'Mixed Use'}</option>
                        <option value="Forest / Conservation">{lang === 'sw' ? 'Msitu / Hifadhi' : 'Forest / Conservation'}</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#E8C96B] tracking-wider uppercase mb-2">
                        {t.fPrice}
                      </label>
                      <input
                        type="text"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        placeholder={t.fPricePl}
                        required
                        className="w-full bg-[#08180E] border border-[#2D6845]/50 focus:border-[#C9A84C] rounded-2xl p-4 text-[#F5EDD8] placeholder-white/20 text-sm outline-none transition-colors"
                      />
                      {price && !isNaN(Number(price.replace(/[,\s]/g, ''))) && (
                        <div className="text-[11px] text-[#C9A84C] mt-1.5 font-medium">
                          ≈ TSh {Number(price.replace(/[,\s]/g, '')).toLocaleString()}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="col-span-2">
                      <label className="block text-xs font-bold text-[#E8C96B] tracking-wider uppercase mb-2">
                        {t.fSize}
                      </label>
                      <div className="flex gap-3">
                        <input
                          type="number"
                          step="0.01"
                          value={size}
                          onChange={(e) => setSize(e.target.value)}
                          placeholder={t.fSizePl}
                          required
                          className="flex-1 bg-[#08180E] border border-[#2D6845]/50 focus:border-[#C9A84C] rounded-2xl p-4 text-[#F5EDD8] placeholder-white/20 text-sm outline-none transition-colors"
                        />
                        <select
                          value={unit}
                          onChange={(e) => setUnit(e.target.value)}
                          className="bg-[#08180E] border border-[#2D6845]/50 focus:border-[#C9A84C] rounded-2xl px-5 text-[#F5EDD8] text-sm outline-none cursor-pointer"
                        >
                          <option value="Ekari">Ekari (Acres)</option>
                          <option value="Mita za Mraba">Mita za Mraba (SQM)</option>
                          <option value="Hekta">Hekta (Hectares)</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#E8C96B] tracking-wider uppercase mb-2">
                        {t.fPlot}
                      </label>
                      <input
                        type="text"
                        value={plotNumber}
                        onChange={(e) => setPlotNumber(e.target.value)}
                        placeholder={t.fPlotPl}
                        className="w-full bg-[#08180E] border border-[#2D6845]/50 focus:border-[#C9A84C] rounded-2xl p-4 text-[#F5EDD8] placeholder-white/20 text-sm outline-none transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold text-[#E8C96B] tracking-wider uppercase mb-2">
                        {t.fPayment}
                      </label>
                      <select
                        value={paymentTerms}
                        onChange={(e) => setPaymentTerms(e.target.value)}
                        className="w-full bg-[#08180E] border border-[#2D6845]/50 focus:border-[#C9A84C] rounded-2xl p-4 text-[#F5EDD8] text-sm outline-none transition-colors cursor-pointer"
                      >
                        <option value="Maelewano">{lang === 'sw' ? 'Maelewano (Negotiable)' : 'Negotiable'}</option>
                        <option value="Cash">{lang === 'sw' ? 'Malipo ya Moja kwa Moja (Cash Only)' : 'Cash Only'}</option>
                        <option value="Malipo ya Awamu (Installments)">{lang === 'sw' ? 'Malipo ya Awamu (Installments)' : 'Installments'}</option>
                        <option value="Mkopo wa Benki">{lang === 'sw' ? 'Mkopo wa Benki (Bank Mortgage)' : 'Bank Mortgage'}</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#E8C96B] tracking-wider uppercase mb-2">
                        {t.fLease}
                      </label>
                      <select
                        value={leasePeriod}
                        onChange={(e) => setLeasePeriod(e.target.value)}
                        className="w-full bg-[#08180E] border border-[#2D6845]/50 focus:border-[#C9A84C] rounded-2xl p-4 text-[#F5EDD8] text-sm outline-none transition-colors cursor-pointer"
                      >
                        <option value="Miaka 99">Miaka 99 (99 Years Renewable Lease)</option>
                        <option value="Miaka 66">Miaka 66 (66 Years Lease)</option>
                        <option value="Miaka 33">Miaka 33 (33 Years Lease)</option>
                        <option value="Hati ya Kijiji ya Kudumu">Hati ya Kijiji ya Kudumu (Customary Title)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#E8C96B] tracking-wider uppercase mb-2">
                      {t.fDesc}
                    </label>
                    <textarea
                      rows={4}
                      value={desc}
                      onChange={(e) => setDesc(e.target.value)}
                      placeholder={t.fDescPl}
                      required
                      className="w-full bg-[#08180E] border border-[#2D6845]/50 focus:border-[#C9A84C] rounded-2xl p-4 text-[#F5EDD8] placeholder-white/20 text-sm outline-none transition-colors"
                    />
                  </div>
                </div>
              )}

              {/* STEP 2: Location & GPS (All 31 Tanzania Regions) */}
              {step === 2 && (
                <div className="space-y-6 text-left">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold text-[#E8C96B] tracking-wider uppercase mb-2">
                        {t.fRegion}
                      </label>
                      <select
                        value={region}
                        onChange={(e) => setRegion(e.target.value)}
                        className="w-full bg-[#08180E] border border-[#2D6845]/50 focus:border-[#C9A84C] rounded-2xl p-4 text-[#F5EDD8] text-sm outline-none cursor-pointer"
                      >
                        {TANZANIA_REGIONS.map((reg) => (
                          <option key={reg} value={reg}>{reg}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#E8C96B] tracking-wider uppercase mb-2">
                        {t.fDistrict}
                      </label>
                      <input
                        type="text"
                        value={district}
                        onChange={(e) => setDistrict(e.target.value)}
                        placeholder={t.fDistrictPl}
                        required
                        className="w-full bg-[#08180E] border border-[#2D6845]/50 focus:border-[#C9A84C] rounded-2xl p-4 text-[#F5EDD8] placeholder-white/20 text-sm outline-none transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold text-[#E8C96B] tracking-wider uppercase mb-2">
                        {t.fWard}
                      </label>
                      <input
                        type="text"
                        value={ward}
                        onChange={(e) => setWard(e.target.value)}
                        placeholder={t.fWardPl}
                        required
                        className="w-full bg-[#08180E] border border-[#2D6845]/50 focus:border-[#C9A84C] rounded-2xl p-4 text-[#F5EDD8] placeholder-white/20 text-sm outline-none transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#E8C96B] tracking-wider uppercase mb-2">
                        {t.fVillage}
                      </label>
                      <input
                        type="text"
                        value={village}
                        onChange={(e) => setVillage(e.target.value)}
                        placeholder={t.fVillagePl}
                        required
                        className="w-full bg-[#08180E] border border-[#2D6845]/50 focus:border-[#C9A84C] rounded-2xl p-4 text-[#F5EDD8] placeholder-white/20 text-sm outline-none transition-colors"
                      />
                    </div>
                  </div>

                  {/* GPS Coordinates with Auto-detection */}
                  <div className="bg-[#08180E] border border-[#2D6845]/40 rounded-2xl p-5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                      <div>
                        <div className="text-xs font-bold text-[#E8C96B] uppercase tracking-wider flex items-center gap-1.5">
                          <Compass className="w-4 h-4 text-[#C9A84C]" />
                          GPS Coordinates (Lat & Lon)
                        </div>
                        <div className="text-[11px] text-[#8FA599] mt-0.5 font-light">
                          Husaidia wanunuzi kufanya ukaguzi wa ramani za anga (Google Earth & Maps)
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={handleDetectGPS}
                        disabled={gpsLoading}
                        className="inline-flex items-center gap-1.5 bg-[#C9A84C]/20 hover:bg-[#C9A84C] hover:text-[#0D2B1A] border border-[#C9A84C] text-[#E8C96B] text-xs font-bold px-4 py-2 rounded-full transition-all cursor-pointer self-start sm:self-auto"
                      >
                        <Crosshair className={`w-3.5 h-3.5 ${gpsLoading ? 'animate-spin' : ''}`} />
                        {gpsLoading ? 'Inatafuta...' : t.gpsBtn}
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <span className="text-[10px] font-bold text-white/50 uppercase tracking-wider block mb-1">Latitude</span>
                        <input
                          type="text"
                          value={lat}
                          onChange={(e) => setLat(e.target.value)}
                          placeholder="-6.823456"
                          className="w-full bg-[#0D2B1A] border border-white/10 focus:border-[#C9A84C] rounded-xl p-3 text-sm text-[#F5EDD8] outline-none font-mono"
                        />
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-white/50 uppercase tracking-wider block mb-1">Longitude</span>
                        <input
                          type="text"
                          value={lon}
                          onChange={(e) => setLon(e.target.value)}
                          placeholder="39.269450"
                          className="w-full bg-[#0D2B1A] border border-white/10 focus:border-[#C9A84C] rounded-xl p-3 text-sm text-[#F5EDD8] outline-none font-mono"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold text-[#E8C96B] tracking-wider uppercase mb-2">
                        {t.fRoad}
                      </label>
                      <input
                        type="text"
                        value={road}
                        onChange={(e) => setRoad(e.target.value)}
                        placeholder={t.fRoadPl}
                        className="w-full bg-[#08180E] border border-[#2D6845]/50 focus:border-[#C9A84C] rounded-2xl p-4 text-[#F5EDD8] placeholder-white/20 text-sm outline-none transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#E8C96B] tracking-wider uppercase mb-2">
                        {t.fRoadCond}
                      </label>
                      <select
                        value={roadcond}
                        onChange={(e) => setRoadcond(e.target.value)}
                        className="w-full bg-[#08180E] border border-[#2D6845]/50 focus:border-[#C9A84C] rounded-2xl p-4 text-[#F5EDD8] text-sm outline-none cursor-pointer"
                      >
                        <option value="Barabara ya Lami">Barabara ya Lami (Tarmac Road)</option>
                        <option value="Barabara ya Changarawe">Barabara ya Changarawe (Gravel / Murram)</option>
                        <option value="Njia ya Udongo">Njia ya Udongo (Dirt Track)</option>
                        <option value="Inafikika kwa Gari">Inafikika kwa Gari Yoyote Msimu Wote</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3: Specs & Infrastructure */}
              {step === 3 && (
                <div className="space-y-6 text-left">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold text-[#E8C96B] tracking-wider uppercase mb-2">
                        {t.fDeed}
                      </label>
                      <select
                        value={deed}
                        onChange={(e) => setDeed(e.target.value)}
                        className="w-full bg-[#08180E] border border-[#2D6845]/50 focus:border-[#C9A84C] rounded-2xl p-4 text-[#F5EDD8] text-sm outline-none cursor-pointer"
                      >
                        <option value="Hati Miliki Iliyosajiliwa (CCRO/Hati)">Hati Miliki Iliyosajiliwa (Certificate of Title / CCRO)</option>
                        <option value="Cheti cha Ardhi ya Kijiji">Cheti cha Ardhi ya Kijiji (Village Land Certificate)</option>
                        <option value="Barua ya Ofa (Letter of Offer)">Barua ya Ofa (Letter of Offer ya Wizara)</option>
                        <option value="Ardhi Iliyopimwa Bado Hati">Ardhi Iliyopimwa (Surveyed - Pending Title)</option>
                        <option value="Mkataba wa Mauziano wa Kiserikali">Mkataba wa Mauziano na Serikali ya Mtaa</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#E8C96B] tracking-wider uppercase mb-2">
                        {t.fBeacons}
                      </label>
                      <div className="flex gap-4 p-3 bg-[#08180E] border border-[#2D6845]/50 rounded-2xl">
                        <label className="flex items-center gap-2 cursor-pointer text-sm">
                          <input
                            type="radio"
                            name="beacons"
                            checked={beaconsPlaced === true}
                            onChange={() => setBeaconsPlaced(true)}
                            className="accent-[#C9A84C]"
                          />
                          <span>{t.fBeaconsYes}</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer text-sm">
                          <input
                            type="radio"
                            name="beacons"
                            checked={beaconsPlaced === false}
                            onChange={() => setBeaconsPlaced(false)}
                            className="accent-[#C9A84C]"
                          />
                          <span>{t.fBeaconsNo}</span>
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold text-[#E8C96B] tracking-wider uppercase mb-2">
                        {t.fTopo}
                      </label>
                      <select
                        value={topo}
                        onChange={(e) => setTopo(e.target.value)}
                        className="w-full bg-[#08180E] border border-[#2D6845]/50 focus:border-[#C9A84C] rounded-2xl p-4 text-[#F5EDD8] text-sm outline-none cursor-pointer"
                      >
                        <option value="Bapa / Tambarare">Bapa / Tambarare (Flat Land)</option>
                        <option value="Mteremko Mdogo">Mteremko Mdogo (Gentle Slope)</option>
                        <option value="Kilima / Mwinuko">Kilima / Mwinuko (Elevated / Hillside)</option>
                        <option value="Bonde / Karibu na Maji">Bonde / Karibu na Maji (Valley Basin)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#E8C96B] tracking-wider uppercase mb-2">
                        {t.fSoil}
                      </label>
                      <select
                        value={soil}
                        onChange={(e) => setSoil(e.target.value)}
                        className="w-full bg-[#08180E] border border-[#2D6845]/50 focus:border-[#C9A84C] rounded-2xl p-4 text-[#F5EDD8] text-sm outline-none cursor-pointer"
                      >
                        <option value="Udongo wa Mbolea">Udongo wa Mbolea (Loam / Fertile Soil)</option>
                        <option value="Udongo wa Mchanga">Udongo wa Mchanga (Sandy Soil)</option>
                        <option value="Udongo wa Udongo">Udongo wa Kichanga & Kifusi (Clay / Hardpan)</option>
                        <option value="Udongo Mweusi wa Kilimo">Udongo Mweusi wa Asili (Black Cotton Soil)</option>
                        <option value="Udongo wa Miamba">Udongo wa Kokoto / Miamba (Rocky / Gravel)</option>
                      </select>
                    </div>
                  </div>

                  {/* Utilities checkboxes */}
                  <div>
                    <label className="block text-xs font-bold text-[#E8C96B] tracking-wider uppercase mb-3">
                      {t.fUtils}
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {[
                        { key: 'Water', label: '💧 Maji ya Bomba / DAWASA' },
                        { key: 'Electricity', label: '⚡ Umeme wa TANESCO' },
                        { key: 'Borehole', label: '🔩 Kisima cha Maji' },
                        { key: 'River', label: '🌊 Mto / Kijito cha Asili' },
                        { key: 'Internet', label: '📶 Mtandao & Mawasiliano' },
                        { key: 'Fence', label: '🔒 Uzio Uliojengwa' }
                      ].map((item) => (
                        <label 
                          key={item.key}
                          className={`flex items-center gap-2 p-3 rounded-xl border text-xs font-medium cursor-pointer transition-all ${
                            utilities.includes(item.key)
                              ? 'bg-[#1A4029] border-[#C9A84C] text-[#E8C96B]'
                              : 'bg-[#08180E] border-white/10 text-white/60 hover:border-white/20'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={utilities.includes(item.key)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setUtilities([...utilities, item.key]);
                              } else {
                                setUtilities(utilities.filter((u) => u !== item.key));
                              }
                            }}
                            className="accent-[#C9A84C]"
                          />
                          <span>{item.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold text-[#E8C96B] tracking-wider uppercase mb-2">
                        {t.fWaterDetail}
                      </label>
                      <input
                        type="text"
                        value={waterDetails}
                        onChange={(e) => setWaterDetails(e.target.value)}
                        placeholder={t.fWaterDetailPl}
                        className="w-full bg-[#08180E] border border-[#2D6845]/50 focus:border-[#C9A84C] rounded-2xl p-4 text-[#F5EDD8] placeholder-white/20 text-sm outline-none transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#E8C96B] tracking-wider uppercase mb-2">
                        {t.fElecDetail}
                      </label>
                      <input
                        type="text"
                        value={electricityDetails}
                        onChange={(e) => setElectricityDetails(e.target.value)}
                        placeholder={t.fElecDetailPl}
                        className="w-full bg-[#08180E] border border-[#2D6845]/50 focus:border-[#C9A84C] rounded-2xl p-4 text-[#F5EDD8] placeholder-white/20 text-sm outline-none transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#E8C96B] tracking-wider uppercase mb-2">
                      {t.fAmenities}
                    </label>
                    <input
                      type="text"
                      value={amenities}
                      onChange={(e) => setAmenities(e.target.value)}
                      placeholder={t.fAmenitiesPl}
                      className="w-full bg-[#08180E] border border-[#2D6845]/50 focus:border-[#C9A84C] rounded-2xl p-4 text-[#F5EDD8] placeholder-white/20 text-sm outline-none transition-colors"
                    />
                  </div>
                </div>
              )}

              {/* STEP 4: Media (Photos & Video File Upload) */}
              {step === 4 && (
                <div className="space-y-8 text-left">
                  {/* Photo section */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs font-bold text-[#E8C96B] tracking-wider uppercase flex items-center gap-1.5">
                        <Camera className="w-4 h-4 text-[#C9A84C]" />
                        {t.fPhotos} ({images.length}/8)
                      </label>
                      <span className="text-[11px] text-[#8FA599] font-light">
                        {images.length >= 8 ? 'Upeo umefikiwa' : 'Max 8 photos'}
                      </span>
                    </div>

                    <div className="border-2 border-dashed border-[#2D6845]/60 hover:border-[#C9A84C] rounded-2xl p-6 text-center bg-[#08180E] transition-colors relative mb-4">
                      <input
                        type="file"
                        multiple
                        accept="image/png, image/jpeg, image/webp"
                        onChange={handleImageUpload}
                        disabled={images.length >= 8}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                      />
                      <Upload className="w-10 h-10 text-[#C9A84C] mx-auto mb-2 opacity-80" />
                      <div className="text-sm font-semibold text-[#F5EDD8]">
                        {t.photoUploadText}
                      </div>
                      <div className="text-xs text-[#8FA599] font-light mt-1">
                        {t.photoUploadSub}
                      </div>
                    </div>

                    {/* Add by image URL */}
                    <div className="flex gap-2 mb-4">
                      <input
                        type="url"
                        value={imageUrlInput}
                        onChange={(e) => setImageUrlInput(e.target.value)}
                        placeholder={t.urlPl}
                        className="flex-1 bg-[#08180E] border border-white/10 focus:border-[#C9A84C] rounded-xl px-4 py-2 text-xs text-[#F5EDD8] outline-none"
                      />
                      <button
                        type="button"
                        onClick={handleAddImageUrl}
                        className="bg-white/10 hover:bg-[#C9A84C] hover:text-[#0D2B1A] text-xs font-bold px-4 py-2 rounded-xl transition-colors cursor-pointer"
                      >
                        {t.addUrlBtn}
                      </button>
                    </div>

                    {/* Images thumbnail list */}
                    {images.length > 0 && (
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {images.map((img, idx) => (
                          <div key={idx} className="relative group rounded-xl overflow-hidden aspect-video bg-black/40 border border-white/10">
                            <img 
                              src={img} 
                              alt={`Land Preview ${idx + 1}`} 
                              className="w-full h-full object-cover"
                              referrerPolicy="no-referrer"
                            />
                            {idx === 0 && (
                              <span className="absolute top-1 left-1 bg-[#C9A84C] text-[#0D2B1A] text-[9px] font-bold px-1.5 py-0.5 rounded">
                                Cover
                              </span>
                            )}
                            <button
                              type="button"
                              onClick={() => removeImage(idx)}
                              className="absolute top-1 right-1 bg-red-600/90 hover:bg-red-700 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* DIRECT VIDEO UPLOAD SECTION (NO TEXT LINK - DIRECT FILE UPLOAD ONLY) */}
                  <div className="border-t border-[#2D6845]/40 pt-6">
                    <div className="mb-4">
                      <label className="text-xs font-bold text-[#E8C96B] tracking-wider uppercase flex items-center gap-1.5 mb-1">
                        <Video className="w-4 h-4 text-[#C9A84C]" />
                        {t.fVideo}
                      </label>
                      <p className="text-xs text-[#8FA599] font-light">
                        {t.videoSub}
                      </p>
                    </div>

                    {!videoUrl ? (
                      /* Video File Drag-and-Drop / Upload Area */
                      <div className="border-2 border-dashed border-[#C9A84C]/50 hover:border-[#C9A84C] rounded-2xl p-8 text-center bg-[#08180E] transition-all relative group cursor-pointer">
                        <input
                          type="file"
                          accept="video/mp4, video/webm, video/ogg, video/quicktime, video/*"
                          onChange={handleVideoFileChange}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        />
                        <div className="w-16 h-16 rounded-full bg-[#C9A84C]/15 group-hover:bg-[#C9A84C]/25 border border-[#C9A84C] flex items-center justify-center text-[#E8C96B] mx-auto mb-3 transition-transform group-hover:scale-105">
                          <Film className="w-8 h-8 text-[#C9A84C]" />
                        </div>
                        <div className="text-base font-semibold text-[#F5EDD8]">
                          {t.videoUploadTitle}
                        </div>
                        <div className="text-xs text-[#8FA599] font-light mt-1">
                          {t.videoUploadSub}
                        </div>
                        <div className="mt-4 inline-flex items-center gap-2 bg-[#C9A84C] text-[#0D2B1A] font-bold text-xs px-5 py-2.5 rounded-full shadow-md group-hover:bg-[#E8C96B] transition-colors">
                          <Upload className="w-4 h-4" />
                          <span>{lang === 'sw' ? 'Chagua Video kutoka Kwenye Kifaa' : 'Choose Video from Device'}</span>
                        </div>
                      </div>
                    ) : (
                      /* Uploaded Video Card with Interactive Player */
                      <div className="bg-[#08180E] border border-[#C9A84C]/40 rounded-2xl p-5 shadow-xl">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/10 mb-4">
                          <div className="flex items-center gap-3">
                            <div className="w-11 h-11 rounded-xl bg-[#C9A84C]/20 border border-[#C9A84C]/40 flex items-center justify-center text-[#E8C96B] flex-shrink-0">
                              <Video className="w-6 h-6 text-[#C9A84C]" />
                            </div>
                            <div>
                              <div className="text-sm font-semibold text-[#F5EDD8] truncate max-w-xs sm:max-w-md">
                                {videoFileName || (lang === 'sw' ? 'Video ya Ardhi Imepakiwa' : 'Land Video Uploaded')}
                              </div>
                              <div className="text-xs text-[#8FA599] font-mono mt-0.5 flex items-center gap-2">
                                {videoSize > 0 && <span>{(videoSize / (1024 * 1024)).toFixed(1)} MB</span>}
                                <span className="text-emerald-400 font-semibold flex items-center gap-1">
                                  <Check className="w-3 h-3" />
                                  {uploadingVideo ? `${uploadProgress}%...` : (lang === 'sw' ? 'Video Iko Tayari' : 'Video Ready')}
                                </span>
                              </div>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={removeVideo}
                            className="flex items-center gap-1.5 text-xs text-red-400 hover:text-red-300 bg-red-950/40 border border-red-800/40 px-4 py-2 rounded-xl transition-colors cursor-pointer self-start sm:self-auto"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>{t.removeVideoBtn}</span>
                          </button>
                        </div>

                        {/* Video Title Input */}
                        <div className="mb-4">
                          <label className="text-[11px] font-semibold text-white/70 block mb-1.5">
                            {t.videoTitleField}
                          </label>
                          <input
                            type="text"
                            value={videoTitle}
                            onChange={(e) => setVideoTitle(e.target.value)}
                            placeholder={t.videoTitlePl}
                            className="w-full bg-[#0D2B1A] border border-white/15 focus:border-[#C9A84C] rounded-xl p-3 text-sm text-[#F5EDD8] outline-none"
                          />
                        </div>

                        {/* Live Player Screen */}
                        <div className="rounded-xl overflow-hidden aspect-video bg-black shadow-inner border border-white/10">
                          <video
                            src={videoUrl}
                            controls
                            className="w-full h-full object-contain"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* STEP 5: Contact Info */}
              {step === 5 && (
                <div className="space-y-6 text-left">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold text-[#E8C96B] tracking-wider uppercase mb-2">
                        {t.fName}
                      </label>
                      <input
                        type="text"
                        value={contactName}
                        onChange={(e) => setContactName(e.target.value)}
                        placeholder={t.fNamePl}
                        required
                        className="w-full bg-[#08180E] border border-[#2D6845]/50 focus:border-[#C9A84C] rounded-2xl p-4 text-[#F5EDD8] placeholder-white/20 text-sm outline-none transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#E8C96B] tracking-wider uppercase mb-2">
                        {t.fPhone}
                      </label>
                      <input
                        type="tel"
                        value={contactPhone}
                        onChange={(e) => setContactPhone(e.target.value)}
                        placeholder={t.fPhonePl}
                        required
                        className="w-full bg-[#08180E] border border-[#2D6845]/50 focus:border-[#C9A84C] rounded-2xl p-4 text-[#F5EDD8] placeholder-white/20 text-sm outline-none transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold text-[#E8C96B] tracking-wider uppercase mb-2">
                        {t.fEmail}
                      </label>
                      <input
                        type="email"
                        value={contactEmail}
                        onChange={(e) => setContactEmail(e.target.value)}
                        placeholder={t.fEmailPl}
                        className="w-full bg-[#08180E] border border-[#2D6845]/50 focus:border-[#C9A84C] rounded-2xl p-4 text-[#F5EDD8] placeholder-white/20 text-sm outline-none transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#E8C96B] tracking-wider uppercase mb-2">
                        {t.fPreferred}
                      </label>
                      <select
                        value={contactPreferred}
                        onChange={(e) => setContactPreferred(e.target.value)}
                        className="w-full bg-[#08180E] border border-[#2D6845]/50 focus:border-[#C9A84C] rounded-2xl p-4 text-[#F5EDD8] text-sm outline-none cursor-pointer"
                      >
                        <option value="WhatsApp">WhatsApp (Inapendekezwa zaidi)</option>
                        <option value="Simu">Simu ya Kawaida (Phone Call)</option>
                        <option value="Barua Pepe">Barua Pepe (Email)</option>
                        <option value="Njia Yoyote">Njia Yoyote ile</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#E8C96B] tracking-wider uppercase mb-2">
                      {t.fRole}
                    </label>
                    <select
                      value={contactRole}
                      onChange={(e) => setContactRole(e.target.value)}
                      className="w-full bg-[#08180E] border border-[#2D6845]/50 focus:border-[#C9A84C] rounded-2xl p-4 text-[#F5EDD8] text-sm outline-none cursor-pointer"
                    >
                      <option value="Mmiliki / Muuzaji wa Moja kwa Moja">Mmiliki / Muuzaji wa Moja kwa Moja (Direct Owner)</option>
                      <option value="Wakala wa Ardhi Aliye na Leseni">Wakala wa Ardhi Aliye na Leseni (Licensed Real Estate Agent)</option>
                      <option value="Mwakilishi wa Familia">Mwakilishi wa Familia (Family Representative)</option>
                      <option value="Kampuni ya Uwekezaji wa Ardhi">Kampuni ya Uwekezaji wa Ardhi (Land Investment Firm)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#E8C96B] tracking-wider uppercase mb-2">
                      {t.fNotes}
                    </label>
                    <textarea
                      rows={3}
                      value={contactNotes}
                      onChange={(e) => setContactNotes(e.target.value)}
                      placeholder={t.fNotesPl}
                      className="w-full bg-[#08180E] border border-[#2D6845]/50 focus:border-[#C9A84C] rounded-2xl p-4 text-[#F5EDD8] placeholder-white/20 text-sm outline-none transition-colors"
                    />
                  </div>

                  {/* Legal Terms acceptance */}
                  <div className="bg-[#08180E] border border-[#2D6845]/40 p-4 rounded-2xl text-xs text-[#8FA599] leading-relaxed">
                    {t.terms}
                  </div>
                </div>
              )}

              {/* Form Navigation Buttons */}
              <div className="flex items-center justify-between mt-10 pt-6 border-t border-[#2D6845]/40">
                {step > 1 ? (
                  <button
                    type="button"
                    onClick={handlePrev}
                    className="flex items-center gap-1.5 bg-white/10 hover:bg-white/15 text-[#F5EDD8] text-xs md:text-sm font-semibold py-3 px-6 rounded-full transition-all cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    {t.prev}
                  </button>
                ) : (
                  <div />
                )}

                {step < 5 ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="flex items-center gap-1.5 bg-[#C9A84C] hover:bg-[#E8C96B] text-[#0D2B1A] font-bold text-xs md:text-sm py-3 px-8 rounded-full shadow-lg transition-all active:scale-95 cursor-pointer ml-auto"
                  >
                    {t.next}
                    <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex items-center gap-2 bg-[#C9A84C] hover:bg-[#E8C96B] disabled:opacity-50 text-[#0D2B1A] font-bold text-xs md:text-sm py-3.5 px-8 rounded-full shadow-xl transition-all active:scale-95 cursor-pointer ml-auto"
                  >
                    {submitting ? t.publishing : t.publish}
                  </button>
                )}
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
