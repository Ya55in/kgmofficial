'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { useTranslation } from '@/hooks/useTranslation';

const HeritageHero = () => {
  const { t } = useTranslation();
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Video */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover"
        >
          <source src="https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/HERITAGE%201954/brand-heritage-bg.mp4" type="video/mp4" />
        </video>
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-black/40"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-24 md:pt-28">
        {/* Main Title Image */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-6 drop-shadow-[0_2px_6px_rgba(0,0,0,0.6)]"
        >
          <img
            src="https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/HERITAGE%201954/img-heritage-intro-title.png"
            alt="Heritage 1954"
            className="mx-auto max-w-full h-auto"
            style={{ maxHeight: '200px' }}
            onError={(e) => {
              console.error('Image failed to load:', e);
              // Try fallback image
              e.currentTarget.src = "https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/HERITAGE%201954/icon-heritage-logo.svg";
            }}
            onLoad={() => {
              console.log('Image loaded successfully');
            }}
          />
        </motion.div>

        {/* Description */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          className="text-white text-lg md:text-xl lg:text-2xl max-w-4xl mx-auto mb-12 space-y-4 drop-shadow-[0_1px_4px_rgba(0,0,0,0.6)]"
          style={{ 
            fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
            fontWeight: '400',
            letterSpacing: '0.02em',
            lineHeight: '1.4'
          }}
        >
          <p className="font-bold text-xl md:text-2xl lg:text-3xl mb-4">
            {t('heritage1954.hero.description1')}
          </p>
          <p className="text-base md:text-lg lg:text-xl">
            {t('heritage1954.hero.description2')}
          </p>
        </motion.div>

        {/* Cards Container */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto"
        >
          {/* KGM Product History View Card */}
          <motion.a
            href="/heritage-1954/product-history"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="bg-white rounded-lg overflow-hidden shadow-2xl cursor-pointer group"
          >
            {/* Main Content Area - 80% height */}
            <div className="relative h-96 bg-gradient-to-b from-teal-600 to-emerald-400 flex items-center justify-center">
              {/* Vintage SUV Image */}
              <Image
                src="https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/HERITAGE%201954/img-heritage-list-01.png"
                alt="KGM Product History"
                width={350}
                height={250}
                className="object-contain h-full w-auto"
              />
              
              {/* Top Right Image */}
              <div className="absolute top-4 right-4">
                <Image
                  src="https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/HERITAGE%201954/img-heritage-card-bi.svg"
                  alt="Enjoy with Confidence KGM"
                  width={143}
                  height={33}
                  className="text-white"
                />
              </div>
              
              {/* Bottom Left Text - Large Vintage Style */}
              <div className="absolute bottom-4 left-4 text-white">
                <p className="text-4xl md:text-5xl font-bold leading-none" style={{ fontFamily: 'serif' }}>
                  1950's~
                </p>
                <p className="text-4xl md:text-5xl font-bold leading-none" style={{ fontFamily: 'serif' }}>
                  2020's
                </p>
              </div>
            </div>

            {/* Bottom Interactive Section - 20% height */}
            <div className="bg-white p-4 flex items-center justify-between shadow-lg">
              <div className="flex items-center space-x-3">
                <div className="text-gray-800">
                  <p className="text-sm font-bold">KGM</p>
                </div>
                  <p className="text-gray-800 font-medium">{t('heritage1954.hero.productHistoryView')}</p>
              </div>
              <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center group-hover:bg-gray-600 transition-colors">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </motion.a>

          {/* KGM Corporate History View Card */}
          <motion.a
            href="/heritage-1954/corporate-history"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="bg-white rounded-lg overflow-hidden shadow-2xl cursor-pointer group"
          >
            {/* Main Content Area - 80% height */}
            <div className="relative h-96 bg-gradient-to-b from-gray-300 to-gray-500 flex items-center justify-center">
              {/* Corporate History Image */}
              <Image
                src="https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/HERITAGE%201954/img-heritage-list-02.png"
                alt="KGM Corporate History"
                width={350}
                height={250}
                className="object-contain h-full w-auto"
              />
              
              {/* Top Right Image */}
              <div className="absolute top-4 right-4">
                <Image
                  src="https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/HERITAGE%201954/img-heritage-card-bi.svg"
                  alt="Enjoy with Confidence KGM"
                  width={143}
                  height={33}
                  className="text-white"
                />
              </div>
              
              {/* Bottom Left Text - Large Vintage Style */}
              <div className="absolute bottom-4 left-4 text-white">
                <p className="text-4xl md:text-5xl font-bold leading-none" style={{ fontFamily: 'serif' }}>
                  1950's~
                </p>
                <p className="text-4xl md:text-5xl font-bold leading-none" style={{ fontFamily: 'serif' }}>
                  2020's
                </p>
              </div>
            </div>

            {/* Bottom Interactive Section - 20% height */}
            <div className="bg-white p-4 flex items-center justify-between shadow-lg">
              <div className="flex items-center space-x-3">
                <div className="text-gray-800">
                  <p className="text-sm font-bold">KGM</p>
                </div>
                <p className="text-gray-800 font-medium">{t('heritage1954.hero.corporateHistoryView')}</p>
              </div>
              <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center group-hover:bg-gray-600 transition-colors">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </motion.a>
        </motion.div>
      </div>
    </div>
  );
};

export default HeritageHero;