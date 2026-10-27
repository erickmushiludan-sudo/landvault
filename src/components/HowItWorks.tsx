import React from 'react';
import { FilePlus, Eye, Users2, Landmark } from 'lucide-react';

interface HowItWorksProps {
  lang: 'sw' | 'en';
}

export default function HowItWorks({ lang }: HowItWorksProps) {
  const t = {
    sw: {
      eyebrow: 'Mchakato Wetu',
      title: 'Jinsi LandVault Inavyofanya Kazi',
      sub: 'Iwe unataka kuuza au kununua ardhi nchini Tanzania, jukwaa letu linarahisisha taratibu zote kwa ufanisi, uwazi na usalama wa hali ya juu.',
      step1Title: '1. Sajili Maelezo ya Ardhi',
      step1Desc: 'Jaza fomu yetu rahisi kuelezea eneo, ukubwa, bei, hali ya hati na kupakia picha na video ya shamba au kiwanja chako.',
      step2Title: '2. Ukaguzi & Idhini ya Admin',
      step2Desc: 'Admin hukagua taarifa na kuthibitisha malipo ya usajili kupitia 0745636292 au erickmushiludan@gmail.com, kisha kiwanja kinaanza kuonekana sokoni.',
      step3Title: '3. Wanunuzi Kuwasiliana',
      step3Desc: 'Wanunuzi waliovutiwa watawasiliana nawe moja kwa moja kupitia WhatsApp au Simu ya kawaida kwa faragha na bila madalali wa kati.',
      step4Title: '4. Kukamilisha Malengo',
      step4Desc: 'Fanya biashara na miamala kwa ujasiri. Soko letu linaendeshwa na mifumo salama ya kiwingu ya low-latency ili kuhakikisha huduma bora.'
    },
    en: {
      eyebrow: 'Our Process',
      title: 'How LandVault Works',
      sub: 'Whether you want to sell or buy land in Tanzania, our platform simplifies the entire process with maximum speed, transparency, and top-tier security.',
      step1Title: '1. Post Your Property',
      step1Desc: 'Fill out our friendly wizard with size, region, title deed details, price and upload photos and video of your land.',
      step2Title: '2. Review & Admin Approval',
      step2Desc: 'Admin reviews listing integrity and confirms registration payment via 0745636292 or erickmushiludan@gmail.com, then publishes the listing.',
      step3Title: '3. Connect Direct with Buyers',
      step3Desc: 'Prospective buyers contact you directly on your chosen channel (Phone or WhatsApp) privately, without third-party commission.',
      step4Title: '4. Seal the Future Deal',
      step4Desc: 'Transact with total peace of mind. Our state-of-the-art Firestore cloud architecture ensures persistent and secure records.'
    }
  }[lang];

  return (
    <section id="how" className="bg-[#F5EDD8] py-20 px-6 md:px-12">
      <div className="max-w-4xl mx-auto text-center mb-14">
        <span className="text-[10px] tracking-widest font-bold text-[#2D6845] uppercase border border-[#2D6845]/20 px-3.5 py-1.5 rounded-full bg-[#0D2B1A]/5">
          {t.eyebrow}
        </span>
        <h2 className="font-serif text-3xl md:text-5xl font-medium text-[#0D2B1A] mt-4">
          {t.title}
        </h2>
        <p className="text-[#3D4F45] text-sm md:text-base font-light mt-3 max-w-xl mx-auto leading-relaxed">
          {t.sub}
        </p>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Card 1 */}
        <div className="bg-white p-6 rounded-3xl border border-[#E8D9B8] hover:border-[#C9A84C]/40 hover:shadow-xl transition-all duration-300 text-left flex flex-col group">
          <div className="w-12 h-12 rounded-2xl bg-[#0D2B1A] text-[#E8C96B] flex items-center justify-center mb-6 group-hover:scale-105 transition-transform duration-300">
            <FilePlus className="w-5 h-5" />
          </div>
          <h4 className="font-sans font-bold text-base text-[#2C3E35] mb-2">{t.step1Title}</h4>
          <p className="text-xs text-[#3D4F45]/80 font-light leading-relaxed">{t.step1Desc}</p>
        </div>

        {/* Card 2 */}
        <div className="bg-white p-6 rounded-3xl border border-[#E8D9B8] hover:border-[#C9A84C]/40 hover:shadow-xl transition-all duration-300 text-left flex flex-col group">
          <div className="w-12 h-12 rounded-2xl bg-[#0D2B1A] text-[#E8C96B] flex items-center justify-center mb-6 group-hover:scale-105 transition-transform duration-300">
            <Eye className="w-5 h-5" />
          </div>
          <h4 className="font-sans font-bold text-base text-[#2C3E35] mb-2">{t.step2Title}</h4>
          <p className="text-xs text-[#3D4F45]/80 font-light leading-relaxed">{t.step2Desc}</p>
        </div>

        {/* Card 3 */}
        <div className="bg-white p-6 rounded-3xl border border-[#E8D9B8] hover:border-[#C9A84C]/40 hover:shadow-xl transition-all duration-300 text-left flex flex-col group">
          <div className="w-12 h-12 rounded-2xl bg-[#0D2B1A] text-[#E8C96B] flex items-center justify-center mb-6 group-hover:scale-105 transition-transform duration-300">
            <Users2 className="w-5 h-5" />
          </div>
          <h4 className="font-sans font-bold text-base text-[#2C3E35] mb-2">{t.step3Title}</h4>
          <p className="text-xs text-[#3D4F45]/80 font-light leading-relaxed">{t.step3Desc}</p>
        </div>

        {/* Card 4 */}
        <div className="bg-white p-6 rounded-3xl border border-[#E8D9B8] hover:border-[#C9A84C]/40 hover:shadow-xl transition-all duration-300 text-left flex flex-col group">
          <div className="w-12 h-12 rounded-2xl bg-[#0D2B1A] text-[#E8C96B] flex items-center justify-center mb-6 group-hover:scale-105 transition-transform duration-300">
            <Landmark className="w-5 h-5" />
          </div>
          <h4 className="font-sans font-bold text-base text-[#2C3E35] mb-2">{t.step4Title}</h4>
          <p className="text-xs text-[#3D4F45]/80 font-light leading-relaxed">{t.step4Desc}</p>
        </div>
      </div>
    </section>
  );
}
