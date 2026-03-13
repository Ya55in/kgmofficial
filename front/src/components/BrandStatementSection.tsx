'use client';

import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import Image from 'next/image';

const BrandStatementSection: React.FC = () => {
  const { language } = useLanguage();
  
  return (
    <section className="relative flex items-center justify-center overflow-hidden py-8 lg:py-12">
      {/* Content */}
      <div className="relative z-10 text-center px-6 sm:px-8 md:px-12 lg:px-16">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-medium text-white mb-3 lg:mb-4 leading-tight pt-4 lg:pt-6">
            {language === 'fr' ? "Chez KGM, nous définissons les voitures comme une source" : "At KGM, We define cars as a source"}
          </h2>
          <div className="flex justify-center">
            <Image
              src="https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/brandstory/icon-story-slogan-large-en.svg"
              alt={language === 'fr' ? "DE JOIE" : "OF JOY"}
              width={300}
              height={60}
              className="w-auto h-12 sm:h-16 md:h-20 lg:h-24"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default BrandStatementSection;
