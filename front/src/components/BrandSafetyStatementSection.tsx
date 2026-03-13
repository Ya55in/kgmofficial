'use client';

import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

const BrandSafetyStatementSection: React.FC = () => {
  const { language } = useLanguage();
  
  return (
    <section className="relative flex items-center justify-center overflow-hidden py-8 lg:py-12">
      {/* Content */}
      <div className="relative z-10 text-center px-6 sm:px-8 md:px-12 lg:px-16 w-full">
        <div className="w-full">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-5 leading-tight">
            {language === 'fr' ? "Le début de" : "The beginning of"} <span style={{ color: '#c4a96c' }}>{language === 'fr' ? "PLAISIR" : "ENJOYMENT"}</span>
          </h2>
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white uppercase tracking-wide">
            {language === 'fr' ? "SÉCURITÉ" : "SAFETY"}
          </h1>
        </div>
      </div>
    </section>
  );
};

export default BrandSafetyStatementSection;
