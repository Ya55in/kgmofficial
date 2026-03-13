'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';

const BrandDesignPhilosophySection: React.FC = () => {
  const { language } = useLanguage();
  const [isOverlayVisible, setIsOverlayVisible] = useState(true);
  const [isGrayscaleActive, setIsGrayscaleActive] = useState(true);
  const [hoveredImage, setHoveredImage] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const images = [
    {
      id: 1,
      src: "https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/brandstory/section8/design-philosophy-01.jpg",
      alt: "Design Philosophy 1",
      title: language === 'fr' ? "ARCHITECTURE ROBUSTE" : "ROBUST ARCHITECTURE",
      description: language === 'fr' ? "Des structures solides et fiables qui résistent à l'épreuve du temps." : "Solid and reliable structures that stand the test of time."
    },
    {
      id: 2,
      src: "https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/brandstory/section8/design-philosophy-02.jpg",
      alt: "Design Philosophy 2",
      title: language === 'fr' ? "CONTRASTE VIBRANT" : "VIBRANT CONTRAST",
      description: language === 'fr' ? "Une harmonie entre force et élégance qui capte l'attention." : "A harmony between strength and elegance that captures attention."
    },
    {
      id: 3,
      src: "https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/brandstory/section8/design-philosophy-03.jpg",
      alt: "Design Philosophy 3",
      title: language === 'fr' ? "PLAISIR INATTENDU" : "UNEXPECTED DELIGHT",
      description: language === 'fr' ? "Des détails surprenants qui apportent de la joie à chaque interaction." : "Surprising details that bring joy to every interaction."
    },
    {
      id: 4,
      src: "https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/brandstory/section8/design-philosophy-04.jpg",
      alt: "Design Philosophy 4",
      title: language === 'fr' ? "COMMUNION AVEC LA NATURE" : "COMMUNION WITH NATURE",
      description: language === 'fr' ? "Une connexion profonde avec l'environnement naturel." : "A deep connection with the natural environment."
    }
  ];

  // Handle 3-second timer to manage grayscale and overlay
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsGrayscaleActive(false);
      setIsOverlayVisible(false);
    }, 2000); // 3 seconds

    return () => clearTimeout(timer);
  }, []);

  return (
    <section ref={containerRef} className="relative h-[100vh] w-full overflow-hidden">
      {/* Desktop Version - Horizontal Layout */}
      <div className="absolute inset-0 hidden lg:flex">
        {images.map((image, index) => (
          <motion.div
            key={image.id}
            className="relative h-full"
            animate={{
              width: hoveredImage === image.id ? '80%' : hoveredImage ? '6.67%' : '25%',
              zIndex: hoveredImage === image.id ? 10 : 1
            }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            onMouseEnter={() => !isGrayscaleActive && setHoveredImage(image.id)}
            onMouseLeave={() => !isGrayscaleActive && setHoveredImage(null)}
            style={{
              filter: isGrayscaleActive 
                ? 'grayscale(100%)' 
                : hoveredImage && hoveredImage !== image.id 
                  ? 'blur(2px)' 
                  : 'blur(0px)'
            }}
          >
            <Image
              src={image.src}
              alt={image.alt}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
              className="object-cover"
              priority={index === 0}
            />
            
            {/* Text Overlay */}
            <motion.div
              className="absolute inset-0 bg-black bg-opacity-60 flex flex-col justify-center items-center text-white p-8 z-20"
              initial={{ opacity: 0 }}
              animate={{ 
                opacity: hoveredImage === image.id ? 1 : 0 
              }}
              transition={{ duration: 0.3 }}
            >
              <motion.h3
                className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-center"
                initial={{ y: 20, opacity: 0 }}
                animate={{ 
                  y: hoveredImage === image.id ? 0 : 20,
                  opacity: hoveredImage === image.id ? 1 : 0 
                }}
                transition={{ duration: 0.4, delay: 0.1 }}
              >
                {image.title}
              </motion.h3>
              
              <motion.p
                className="text-lg md:text-xl text-center max-w-md leading-relaxed"
                initial={{ y: 20, opacity: 0 }}
                animate={{ 
                  y: hoveredImage === image.id ? 0 : 20,
                  opacity: hoveredImage === image.id ? 1 : 0 
                }}
                transition={{ duration: 0.4, delay: 0.2 }}
              >
                {image.description}
              </motion.p>
            </motion.div>
          </motion.div>
        ))}
      </div>

      {/* Mobile Version - Vertical Layout */}
      <div className="absolute inset-0 flex flex-col lg:hidden">
        {images.map((image, index) => (
          <motion.div
            key={image.id}
            className="relative w-full h-1/4"
            style={{
              filter: isGrayscaleActive ? 'grayscale(100%)' : 'grayscale(0%)'
            }}
          >
            <Image
              src={image.src}
              alt={image.alt}
              fill
              sizes="100vw"
              className="object-cover"
              priority={index === 0}
            />
            
            {/* Text Overlay for Mobile */}
            <div className="absolute inset-0 bg-black bg-opacity-60 flex flex-col justify-center items-center text-white p-4 z-20">
              <h3 className="text-xl font-bold mb-2 text-center">
                {image.title}
              </h3>
              <p className="text-sm text-center max-w-xs leading-relaxed">
                {image.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Desktop Black Overlay with Text */}
      <motion.div
        className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center z-20 hidden lg:flex"
        animate={{
          opacity: isOverlayVisible ? 1 : 0,
          pointerEvents: isOverlayVisible ? 'auto' : 'none'
        }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
      >
        <div className="text-center px-8 max-w-4xl">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6"
          >
            {language === 'fr' ? "PHILOSOPHIE DE DESIGN" : "DESIGN PHILOSOPHY"}
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-lg md:text-xl lg:text-2xl text-white leading-relaxed mb-8"
          >
            {language === 'fr' ? "La robustesse de KGM est la force motrice derrière notre poursuite incessante de nouvelles innovations avec confiance et passion. Nous nous engageons à développer une mobilité sûre pour les voyages de nos clients, à tout moment et en tout lieu." : "KGM's toughness is the driving force behind our relentless pursuit of new innovations with confidence and passion. We are committed to developing safe mobility for our customer's journeys, anytime and anywhere."}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-white"
          >
            {language === 'fr' ? "Alimenté par la Robustesse" : "Powered by Toughness"}
          </motion.div>
        </div>
      </motion.div>

      {/* Desktop Timer Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-30 hidden lg:block"
        animate={{
          opacity: isGrayscaleActive ? 1 : 0
        }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col items-center text-white">
          <span className="text-sm mb-2">{language === 'fr' ? "Attendez 3 secondes pour révéler" : "Wait 3 seconds to reveal"}</span>
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-6 h-10 border-2 border-white rounded-full flex justify-center"
          >
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-1 h-3 bg-white rounded-full mt-2"
            />
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

export default BrandDesignPhilosophySection;