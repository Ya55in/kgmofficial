'use client';

import React from 'react';
import Image from 'next/image';
import { useLanguage } from '@/contexts/LanguageContext';

const BrandDiverseLifestylesSection: React.FC = () => {
  const { language } = useLanguage();
  
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden py-12 lg:py-20">
      <div className="relative z-10 w-full h-full flex flex-col lg:flex-row">
        {/* Text content - Full width on mobile, half width on desktop */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-10 lg:p-12 xl:p-16">
          <div className="max-w-xl lg:max-w-lg xl:max-w-xl">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-8 lg:mb-10 leading-tight">
              <span style={{ color: '#c4a96c' }}>{language === 'fr' ? "TROUVER LA JOIE" : "FINDING JOY"}</span>
              <span className="text-white text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-normal"> {language === 'fr' ? "à travers" : "through"} </span>
              <span className="text-white text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl">{language === 'fr' ? "Styles de Vie Diversifiés" : "Diverse Lifestyles"}</span>
            </h2>
            
            <div className="text-white text-sm sm:text-base lg:text-lg xl:text-xl leading-relaxed">
              <p>
                {language === 'fr' ? "Que vous cherchiez le bonheur simple en famille, que vous profitiez de votre liberté en solo, que vous aspiriez à une vie sophistiquée dans une ville animée, ou que vous savouriez les aventures en plein air le week-end, KGM vise à améliorer votre joie et à s'assurer qu'elle ne soit jamais interrompue, n'importe quand, n'importe où." : "Whether you seek simple happiness with your family, enjoy your freedom alone, strive for a sophisticated life in a busy city, or relish outdoor adventures on weekends, KGM aims to enhance your joy and ensure it is never interrupted, anytime, anywhere."}
              </p>
            </div>
          </div>
        </div>

        {/* Image - Full width on mobile, half width on desktop */}
        <div className="w-full lg:w-1/2 h-80 sm:h-96 lg:h-auto relative">
          <Image
            src="https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/brandstory/section4/img-br-benefit02.jpg"
            alt="Family enjoying outdoor lifestyle with KGM vehicle"
            fill
            className="object-cover"
          />
        </div>
      </div>
    </section>
  );
};

export default BrandDiverseLifestylesSection;