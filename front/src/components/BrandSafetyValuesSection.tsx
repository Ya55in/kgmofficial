'use client';

import React from 'react';
import Image from 'next/image';
import { useLanguage } from '@/contexts/LanguageContext';

const BrandSafetyValuesSection: React.FC = () => {
  const { language } = useLanguage();
  return (
    <section className="relative h-[80vh] flex items-center overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        <Image
          src="https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/brandstory/section5/img-br-safety.jpg"
          alt="KGM SUV driving on bridge at sunset"
          fill
          className="object-cover"
        />
      </div>
      
      {/* Content overlay */}
      <div className="relative z-10 w-full h-full flex">
        {/* Left side - Text content */}
        <div className="w-1/2 flex items-center justify-center p-8 lg:p-12">
          <div className="max-w-2xl">
            {/* Main Title */}
            <div className="mb-5">
              <h2 className="text-xl lg:text-2xl xl:text-3xl font-bold text-white mb-2 leading-tight">
                {language === 'fr' ? "Une valeur" : "A Non-Negotiable"}
                <br />
                <span className="text-kgm-amber">{language === 'fr' ? "non négociable. Sécurité" : "Value. Safety"}</span>
              </h2>
            </div>

            {/* Section 1: Protecting Our Customers' Joy */}
            <div className="mb-5">
              <h3 className="text-base lg:text-lg font-bold text-white mb-2">
                {language === 'fr' ? "Protéger la joie de nos clients" : "Protecting Our Customers' Joy"}
              </h3>
              <div className="text-white text-xs leading-relaxed space-y-1">
                <p>{language === 'fr' ? "Pour KGM, la sécurité est une valeur non négociable qui protège à la fois le bien-être physique des passagers et leur plaisir avec la voiture. Nous prévenons les accidents avec des systèmes d'aide à la conduite avancés et assurons la sécurité avec des carrosseries robustes et une qualité fiable, faisant tout notre possible pour garder les clients en sécurité même lors d'incidents imprévus." : "For KGM, safety is an uncompromisable value that protects both the physical well-being of passengers and their enjoyment with the car. We prevent accidents with advanced driver assistance systems and ensure safety with robust vehicle bodies and reliable quality, doing our utmost to keep customers safe even through unforeseen incidents."}</p>
              </div>
            </div>

            {/* Section 2: Protecting Our Employees' JOY */}
            <div>
              <h3 className="text-base lg:text-lg font-bold text-white mb-2">
                {language === 'fr' ? "Protéger la joie de nos employés" : "Protecting Our Employees' Joy"}
              </h3>
              <div className="text-white text-xs leading-relaxed space-y-1">
                <p>{language === 'fr' ? "Nous créons un environnement de travail sûr où chaque employé peut travailler avec confiance et fierté, contribuant à la satisfaction et au bien-être de tous." : "We create a safe working environment where every employee can work with confidence and pride, contributing to the satisfaction and well-being of all."}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Vehicle image area (background image will show through) */}
        <div className="w-1/2 relative">
          {/* This area will show the vehicle from the background image */}
        </div>
      </div>
    </section>
  );
};

export default BrandSafetyValuesSection;
