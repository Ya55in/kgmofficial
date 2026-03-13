'use client';

import React from 'react';
import Image from 'next/image';
import { useLanguage } from '@/contexts/LanguageContext';

const BrandLifestyleSection: React.FC = () => {
  const { language } = useLanguage();
  
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden py-12 lg:py-20">
      <div className="relative z-10 w-full h-full flex flex-col lg:flex-row">
        {/* Image - Full width on mobile, half width on desktop */}
        <div className="w-full lg:w-1/2 h-80 sm:h-96 lg:h-auto relative">
          <Image
            src="https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/brandstory/section3/img-br-benefit01.jpg"
            alt="Woman enjoying car journey"
            fill
            className="object-cover"
          />
        </div>

        {/* Text content - Full width on mobile, half width on desktop */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-10 lg:p-12 xl:p-16">
          <div className="max-w-xl lg:max-w-lg xl:max-w-xl">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-8 lg:mb-10 leading-tight">
              <span style={{ color: '#c4a96c' }}>{language === 'fr' ? "PLAISIR" : "ENJOYMENT"}</span>
              <span className="text-white text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl"> {language === 'fr' ? "dans chaque voyage avec la mobilité" : "in Every Journey with Mobility"}</span>
            </h2>
            
            <div className="space-y-5 lg:space-y-6 text-white text-sm sm:text-base lg:text-lg xl:text-xl leading-relaxed">
              <p>
                {language === 'fr' ? "De l'anticipation avant la conduite, le confort et le bonheur pendant le voyage, à la satisfaction à l'arrivée, et les souvenirs précieux à la destination." : "From the anticipation before the drive, the comfort and happiness during the journey, to the satisfaction upon arrival, and the cherished memories at the destination."}
              </p>
              
              <p>
                {language === 'fr' ? "KGM s'engage à rendre chaque moment que vous passez avec votre voiture agréable." : "KGM is dedicated to making every moment you spend with your car enjoyable."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BrandLifestyleSection;
