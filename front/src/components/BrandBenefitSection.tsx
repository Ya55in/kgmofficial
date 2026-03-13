'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';

const BrandBenefitSection: React.FC = () => {
  const { language } = useLanguage();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFixed, setIsFixed] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const stickyContainerRef = useRef<HTMLDivElement>(null);
  
  const benefits = [
    {
      id: 1,
      title: language === 'fr' ? "CRÉATIVITÉ" : "CREATIVITY",
      brandEssence: language === 'fr' ? "Des produits créatifs qui offrent\nDe nouvelles capacités uniques" : "Creative products that offer\nNew and unique capabilities",
      workWay: language === 'fr' ? "Une culture de travail qui\nRecherche toujours de nouvelles innovations" : "A work culture of always\nSeeking out new innovations",
      image: "https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/brandstory/section6/img-benefit-essence-01.jpg",
      color: "text-kgm-amber"
    },
    {
      id: 2,
      title: language === 'fr' ? "PRATIQUE" : "PRACTICALITY", 
      brandEssence: language === 'fr' ? "Des produits pratiques qui\nSatisfont des modes de vie diversifiés" : "Practical products that\nSatisfy diverse lifestyles",
      workWay: language === 'fr' ? "Mettre en œuvre une efficacité\nOptimale de l'espace et une\nUtilisabilité intuitive et pratique" : "Implementing optimal space\nEfficiency and convenient,\nIntuitive usability",
      image: "https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/brandstory/section6/img-benefit-essence-02.jpg",
      color: "text-kgm-amber"
    },
    {
      id: 3,
      title: language === 'fr' ? "PLAISIR" : "ENJOYMENT",
      brandEssence: language === 'fr' ? "Des produits qui apportent\nDu plaisir et de la satisfaction" : "Products that bring\nJoy and satisfaction",
      workWay: language === 'fr' ? "Créer des expériences\nMémorables et agréables" : "Creating memorable\nAnd enjoyable experiences",
      image: "https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/brandstory/section6/img-benefit-essence-03.jpg",
      color: "text-kgm-amber"
    },
    {
      id: 4,
      title: language === 'fr' ? "SÉCURITÉ" : "SAFETY",
      brandEssence: language === 'fr' ? "Des produits sécurisés qui\nProtègent et rassurent" : "Secure products that\nProtect and reassure",
      workWay: language === 'fr' ? "Prioriser la sécurité dans\nTous nos processus de travail" : "Prioritizing safety in\nAll our work processes",
      image: "https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/brandstory/section6/img-benefit-essence-04.jpg",
      color: "text-kgm-amber"
    }
  ];

  // Handle fixed positioning based on scroll
  useEffect(() => {
    let isScrollingToNext = false;
    
    const handleScroll = () => {
      if (!containerRef.current || !stickyContainerRef.current) return;
      
      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      // Section is 400vh, sticky should be active when section is in viewport
      // Start fixing when section top reaches viewport top
      // Stop fixing when section bottom reaches viewport top (after 300vh of scroll)
      const scrollableDistance = 3 * windowHeight; // 300vh
      
      // Calculate scroll progress for card selection
      let scrollProgress = 0;
      if (rect.top <= 0 && rect.top >= -scrollableDistance) {
        // Section is scrolling through cards
        scrollProgress = Math.abs(rect.top) / scrollableDistance;
      } else if (rect.top < -scrollableDistance) {
        // Section has scrolled past, show last card
        scrollProgress = 1;
      }
      
      // Determine which card should be visible
      const cardIndex = Math.floor(scrollProgress * benefits.length);
      const clampedCardIndex = Math.min(Math.max(cardIndex, 0), benefits.length - 1);
      const isLastCard = clampedCardIndex >= benefits.length - 1; // SAFETY card (index 3)
      
      // Update current image index if needed (use functional update to avoid dependency issues)
      setCurrentImageIndex((prevIndex) => {
        if (clampedCardIndex !== prevIndex) {
          return clampedCardIndex;
        }
        return prevIndex;
      });
      
      // Check if next section is visible
      const nextSection = containerRef.current.nextElementSibling as HTMLElement;
      let nextSectionTop = Infinity;
      if (nextSection) {
        const nextRect = nextSection.getBoundingClientRect();
        nextSectionTop = nextRect.top;
      }
      
      // If we're on the last card and section has scrolled past, prevent further scrolling
      // and scroll to next section instead
      if (rect.top < -scrollableDistance && isLastCard && nextSection && nextSectionTop > windowHeight) {
        // We're on last card and section has scrolled past, but next section hasn't arrived yet
        // Prevent scroll and jump to next section
        if (!isScrollingToNext) {
          isScrollingToNext = true;
          // Calculate the scroll position to jump to next section
          const nextSectionOffset = nextSection.offsetTop;
          
          // Scroll smoothly to next section
          window.scrollTo({
            top: nextSectionOffset,
            behavior: 'smooth'
          });
          
          // Reset flag after scroll animation
          setTimeout(() => {
            isScrollingToNext = false;
          }, 1000);
        }
        
        // Keep fixed during this transition
        setIsFixed(true);
        return;
      }
      
      // Keep fixed when:
      // 1. Section is scrolling through cards (rect.top <= 0 && rect.top >= -scrollableDistance)
      // 2. OR we're on the last card and next section hasn't reached viewport yet
      if (rect.top <= 0 && rect.top >= -scrollableDistance) {
        // Section is scrolling through cards, keep fixed
        setIsFixed(true);
      } else if (rect.top < -scrollableDistance && isLastCard && nextSection && nextSectionTop > windowHeight) {
        // Section has scrolled past, we're on last card, but next section hasn't arrived yet
        // Keep fixed to show last card until next section starts arriving
        setIsFixed(true);
      } else if (nextSection && nextSectionTop <= windowHeight) {
        // Next section is visible in viewport (top <= windowHeight), release fixed immediately
        setIsFixed(false);
      } else if (rect.top >= 0) {
        // Section hasn't reached viewport top yet, not fixed
        setIsFixed(false);
      } else {
        // Default: release fixed
        setIsFixed(false);
      }
    };

    // Initial check
    handleScroll();
    
    // Listen to scroll events with throttling
    let ticking = false;
    const throttledHandleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };
    
    window.addEventListener('scroll', throttledHandleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', throttledHandleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [benefits.length]);

  const currentBenefit = benefits[currentImageIndex];

  return (
    <section 
      ref={containerRef} 
      className="relative h-[400vh] w-full"
      style={{ 
        position: 'relative',
        overflow: 'visible',
        height: '400vh'
      }}
    >
      {/* Fixed container - controlled by JavaScript */}
      <div 
        ref={stickyContainerRef}
        className="h-screen w-full px-[5px]"
        style={{ 
          position: isFixed ? 'fixed' : 'absolute',
          top: isFixed ? 0 : 0,
          left: 0,
          right: 0,
          height: '100vh',
          width: '100%',
          display: 'block',
          overflow: 'visible',
          zIndex: isFixed ? 10 : 1 // Lower z-index when not fixed
        }}
      >
        {/* Content overlay - centered with flexbox */}
        <div className="relative z-10 w-full h-full flex items-center justify-center overflow-hidden">
          {/* Left side - Text content */}
          <div className="w-1/2 flex items-center justify-center p-8 lg:p-12">
            <div className="max-w-2xl w-full flex flex-col items-center justify-center">
              {/* Main Title */}
              <motion.div 
                key={currentImageIndex}
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="mb-8"
              >
                <h2 className="text-sm lg:text-base xl:text-lg font-bold text-black mb-2 leading-tight">
                  {language === 'fr' ? "ESSENCE DE MARQUE & MÉTHODE DE TRAVAIL" : "BRAND ESSENCE & WORK WAY"}
                </h2>
                <div className="text-3xl lg:text-4xl xl:text-5xl font-bold text-black mb-2">
                  KGM
                </div>
                <div className={`text-3xl lg:text-4xl xl:text-5xl font-bold ${currentBenefit.color} mb-8`}>
                  {currentBenefit.title}
                </div>
              </motion.div>

              {/* Brand Essence Section */}
              <motion.div 
                key={`essence-${currentImageIndex}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="mb-6 w-full"
              >
                <div className="flex w-full">
                  <div className="w-1/3">
                    <h3 className="text-xs lg:text-sm font-bold text-black mb-2">
                      {language === 'fr' ? "ESSENCE DE MARQUE" : "BRAND ESSENCE"}
                    </h3>
                    <div className="w-full h-px bg-black mb-2"></div>
                    <h3 className="text-xs lg:text-sm font-bold text-black">
                      {language === 'fr' ? "MÉTHODE DE TRAVAIL" : "WORK WAY"}
                    </h3>
                  </div>
                  <div className="w-2/3 pl-4">
                    <div className="text-xs lg:text-xs text-black leading-relaxed mb-4">
                      {currentBenefit.brandEssence.split('\n').map((line, index) => (
                        <p key={index}>{line}</p>
                      ))}
                    </div>
                    <div className="w-full h-px bg-black mb-4"></div>
                    <div className="text-xs lg:text-xs text-black leading-relaxed">
                      {currentBenefit.workWay.split('\n').map((line, index) => (
                        <p key={index}>{line}</p>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Right side - Image area */}
          <div className="w-1/2 relative">
            <motion.div
              key={currentImageIndex}
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <Image
                src={currentBenefit.image}
                alt={`KGM ${currentBenefit.title} benefit`}
                width={500}
                height={500}
                className="object-cover rounded-lg"
                priority
              />
            </motion.div>
            
            {/* Decorative elements */}
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="absolute bottom-8 right-8 flex flex-col items-end space-y-2"
            >
              <div className="w-16 h-16 bg-blue-900 rounded-full"></div>
              <div className="w-0 h-0 border-l-[12px] border-r-[12px] border-b-[20px] border-l-transparent border-r-transparent border-b-kgm-amber"></div>
            </motion.div>
          </div>
        </div>

        {/* Progress indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {benefits.map((_, index) => (
            <div
              key={index}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentImageIndex 
                  ? 'bg-kgm-amber scale-125' 
                  : 'bg-gray-400'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default BrandBenefitSection;