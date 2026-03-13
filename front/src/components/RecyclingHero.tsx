'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { useLanguage } from '@/contexts/LanguageContext';

const RecyclingHero = () => {
  const { language } = useLanguage();
  
  // Get French translations
  const getFrenchText = (key: string) => {
    if (language === 'fr') {
      switch (key) {
        case 'recycling.title': return 'Recyclage';
        case 'recycling.subtitle': return 'Nous nous engageons en faveur d\'un avenir durable en promouvant des pratiques de recyclage responsables et en minimisant notre impact environnemental.';
        default: return key;
      }
    }
    return key;
  };
  
  return (
    <section className="relative h-[50vh] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
          <Image
            src="https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/recycling/img-sr-bg-recycling.png"
            alt="Recycling Background"
            fill
            className="object-cover w-full h-full"
            priority
          />
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center text-white px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <h1 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold uppercase tracking-wide mb-6">
            {getFrenchText('recycling.title') || 'Recycling'}
          </h1>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
            className="max-w-4xl mx-auto"
          >
            <p className="text-xs sm:text-sm lg:text-base font-light leading-relaxed mb-8">
              {getFrenchText('recycling.subtitle') || 'We are committed to a sustainable future by promoting responsible recycling practices and minimizing our environmental impact.'}
            </p>
          </motion.div>

        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.2 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="w-6 h-10 border-2 border-white rounded-full flex justify-center"
        >
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="w-1 h-3 bg-white rounded-full mt-2"
          />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default RecyclingHero;
