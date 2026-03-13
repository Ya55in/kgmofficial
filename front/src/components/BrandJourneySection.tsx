'use client';

import React from 'react';
import Image from 'next/image';
import { useTranslation } from '@/hooks/useTranslation';

const BrandJourneySection: React.FC = () => {
  const { t } = useTranslation();
  return (
    <section className="relative min-h-screen flex">
      {/* Left Side - Image */}
      <div className="w-1/2 relative">
        <Image
          src="https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/brandstory/section3/img-br-benefit01.jpg"
          alt="Woman enjoying journey in KGM car"
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Right Side - Text Content */}
      <div className="w-1/2 relative flex items-center justify-center">
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-kgm-amber/80 via-kgm-amber to-kgm-amber/90"></div>
        
        {/* Content */}
        <div className="relative z-10 px-8 lg:px-12 max-w-lg">
          <h2 className="text-4xl lg:text-5xl xl:text-6xl font-bold mb-8 leading-tight">
            <span className="text-kgm-amber">{t('brandStory.journeyContent.title')}</span>
            <br />
            <span className="text-white">{t('brandStory.journeyContent.subtitle')}</span>
          </h2>
          
          <div className="space-y-6 text-white text-lg leading-relaxed">
            <p>
              {t('brandStory.journeyContent.paragraph1')}
            </p>
            <p>
              {t('brandStory.journeyContent.paragraph2')}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BrandJourneySection;
