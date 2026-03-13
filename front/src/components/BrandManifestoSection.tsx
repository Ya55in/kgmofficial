'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { useLanguage } from '@/contexts/LanguageContext';

const BrandManifestoSection = () => {
  const { language } = useLanguage();
  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url(https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/brandstory/section1/brand-manifesto-bg.jpg)'
        }}
      />

      {/* Dark Overlay for better text readability */}
      <div className="absolute inset-0 bg-black/30" />

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col justify-center px-4 py-20">
        <div className="w-[35%] mx-auto text-center">
          {/* Main Title */}
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-white text-2xl md:text-3xl lg:text-4xl font-light tracking-wide mb-8"
          >
            {language === 'fr' ? "KGM évolue" : "KGM is evolving"}
          </motion.h2>

          {/* Content Container */}
          <div className="mx-auto space-y-6">
            {/* First Paragraph */}
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
              className="text-white text-sm md:text-base lg:text-lg font-light leading-relaxed text-center"
            >
              {language === 'fr' ? "Nous nous transformons en une entreprise qui satisfait les modes de vie urbains et de plein air diversifiés avec des solutions de mobilité pratiques, créatives et sûres, satisfaisant et apportant de la joie à nos clients." : "We are transforming into a company that satisfies diverse urban and outdoor lifestyles with practical, creative, and safe mobility solutions, satisfying and bringing joy to our customers."}
            </motion.p>

            {/* Second Paragraph */}
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              viewport={{ once: true }}
              className="text-white text-sm md:text-base lg:text-lg font-light leading-relaxed text-center"
            >
              {language === 'fr' ? "Le nouveau système de valeurs a été développé pour communiquer la direction de KGM à la fois en interne et en externe, fournir des lignes directrices pour les stratégies à moyen et long terme, et encourager les changements dans le comportement des employés, visant finalement à modifier la perception de la marque par les consommateurs." : "The new value system was developed to communicate KGM's direction both internally and externally, provide guidelines for mid-to long-term strategies, and encourage changes in employee behavior, ultimately aiming to shift consumer brand perception."}
            </motion.p>
          </div>

          {/* Call to Action */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            viewport={{ once: true }}
            className="mt-12 flex justify-center"
          >
            <Image
              src="https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/brandstory/icon-story-slogan.svg"
              alt={language === 'fr' ? "Profitez en toute confiance" : "Enjoy with Confidence"}
              width={300}
              height={60}
              className="w-auto h-8 md:h-10 lg:h-12"
              unoptimized
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default BrandManifestoSection;




