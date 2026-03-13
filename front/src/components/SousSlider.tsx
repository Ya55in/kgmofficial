'use client';

import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
import CarouselNavigation from './CarouselNavigation';

interface SousSliderItem {
  id: number;
  title: string;
  description: string;
  video?: string;
  poster?: string;
  image?: string;
}

interface SousSliderProps {
  items: SousSliderItem[];
  isOpen: boolean;
  onClose: () => void;
  cardWidth?: string;
  headerTitle?: string;
  language?: 'en' | 'fr';
  itemsPerView?: number;
}

const SousSlider: React.FC<SousSliderProps> = ({
  items,
  isOpen,
  onClose,
  cardWidth = '320px',
  headerTitle,
  language = 'en',
  itemsPerView = 3
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [playingVideo, setPlayingVideo] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const sliderRef = useRef<HTMLDivElement>(null);

  // Mobile detection for responsive design - use useLayoutEffect for immediate check
  useLayoutEffect(() => {
    const checkMobile = () => {
      if (typeof window !== 'undefined') {
        setIsMobile(window.innerWidth < 768);
      }
    };
    
    // Check immediately on mount (synchronous, before paint)
    checkMobile();
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', checkMobile);
      return () => window.removeEventListener('resize', checkMobile);
    }
  }, []);

  // Reset to first card when carousel opens and scroll into view
  useEffect(() => {
    if (isOpen) {
      setCurrentSlide(0);
      setPlayingVideo(null); // Reset video state
      
      // Scroll to center the SousSlider when it opens
      setTimeout(() => {
        if (sliderRef.current) {
          sliderRef.current.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
            inline: 'nearest'
          });
        }
      }, 100); // Small delay to ensure DOM is updated
    }
  }, [isOpen]);

  // Swipe handlers for mobile
  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    
    if (isLeftSwipe && currentSlide < items.length - 1) {
      setCurrentSlide((prev) => prev + 1);
    }
    if (isRightSwipe && currentSlide > 0) {
      setCurrentSlide((prev) => prev - 1);
    }
  };

  if (!isOpen) return null;

  const totalPages = Math.ceil(items.length / itemsPerView);

  const handleSlideChange = (newIndex: number) => {
    setCurrentSlide(newIndex);
  };

  const handlePrevious = () => {
    setCurrentSlide(prev => prev === 0 ? items.length - 1 : prev - 1);
  };

  const handleNext = () => {
    setCurrentSlide(prev => prev === items.length - 1 ? 0 : prev + 1);
  };

  // Calculate width based on itemsPerView (assuming total of 3 cards visible in parent)
  const widthPercentage = itemsPerView === 3 ? '66.666%' : itemsPerView === 2 ? '66.666%' : '50%';

  // Calculate card width as percentage of container for proper navigation
  const cardWidthPercentage = `${100 / itemsPerView}%`;

  // Mobile card width and transform
  const mobileCardWidth = '65%';
  const mobileCardMargin = '4%';

  return (
    <div ref={sliderRef} className="flex-shrink-0 px-0 md:px-4" style={{ width: isMobile ? '100%' : widthPercentage }}>
      <div className="bg-black rounded-lg shadow-lg overflow-hidden flex flex-col relative" style={{ height: isMobile ? '450px' : '514px' }}>
        {/* Close Button */}
        {headerTitle && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center hover:bg-gray-600 transition-colors z-10"
            aria-label={language === 'fr' ? 'Fermer' : 'Close'}
          >
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}

        {/* Header - Optional */}
        {headerTitle && (
          <div className="bg-gray-800 text-white p-4 relative flex-shrink-0">
            <h3 className="text-base font-bold text-center">{headerTitle}</h3>
          </div>
        )}

        {/* Carousel Container */}
        <div className={`p-3 md:p-4 flex-1 flex flex-col overflow-hidden ${!headerTitle ? 'pt-16' : ''}`}>
          <div className="relative flex-1 overflow-hidden">
            <div 
              className="flex transition-transform duration-700 ease-out h-full sous-slider-container"
              style={{ 
                transform: isMobile
                  ? currentSlide === 0 
                    ? 'translateX(8%)'
                    : `translateX(calc(8% - ${currentSlide * 69}%))`
                  : `translateX(-${currentSlide * (100 / itemsPerView)}%)`
              }}
              onTouchStart={onTouchStart}
              onTouchMove={onTouchMove}
              onTouchEnd={onTouchEnd}
            >
              {items.map((item, index) => (
                <div 
                  key={item.id} 
                  className="sous-slider-card flex-shrink-0 px-2 md:px-2" 
                  style={{ 
                    width: isMobile ? mobileCardWidth : cardWidthPercentage,
                    marginRight: isMobile ? mobileCardMargin : '0',
                    marginLeft: index === 0 && isMobile ? '8%' : '0'
                  }}
                >
                  <div className="bg-white rounded-lg shadow-md overflow-hidden h-full flex flex-col w-full" style={{ height: isMobile ? '400px' : '100%' }}>
                    {/* Video/Image Section - Full Width */}
                    <div 
                      className="relative flex-shrink-0 w-full"
                      style={{ 
                        background: item.poster ? `url("${item.poster}") center center / cover no-repeat` : 'transparent',
                        height: '240px'
                      }}
                    >
                      {item.video ? (
                        <>
                          <video 
                            playsInline 
                            webkit-playsinline="" 
                            poster={item.poster}
                            className="w-full h-full object-cover"
                            onPlay={() => setPlayingVideo(item.video!)}
                            onPause={() => setPlayingVideo(null)}
                          >
                            <source src={item.video} type="video/mp4" />
                            <track kind="captions" />
                          </video>
                          {playingVideo !== item.video && (
                            <button 
                              type="button" 
                              className="play-control absolute inset-0 flex items-center justify-center bg-black/20 hover:bg-black/30 transition-colors cursor-pointer"
                              onClick={() => {
                                const video = document.querySelector(`video[poster="${item.poster}"]`) as HTMLVideoElement;
                                if (video) {
                                  video.play();
                                }
                              }}
                            >
                              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-all duration-300">
                                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                                  <path d="M8 5v14l11-7z"/>
                                </svg>
                              </div>
                            </button>
                          )}
                        </>
                      ) : item.image ? (
                        <img 
                          src={item.image} 
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                      ) : null}
                    </div>
                    
                    {/* Content Section - Display all text */}
                    <div className="p-3 md:p-4 flex-1 flex flex-col justify-start overflow-y-auto">
                      {/* Title section at top on mobile */}
                      <div className="md:hidden mb-3">
                        <h4 className="text-sm font-bold text-gray-800 mb-2 leading-tight">
                          {item.title}
                        </h4>
                      </div>
                      
                      {/* Desktop: Title */}
                      <h4 className="hidden md:block text-sm font-bold text-gray-800 mb-3 leading-tight">
                        {item.title}
                      </h4>
                      
                      {/* Description */}
                      <p 
                        className={`text-xs leading-relaxed ${
                          item.description.includes('ESC provides various features')
                            ? 'text-[#c5a86b]'
                            : item.description.includes('Toggle-switch type with auto hold')
                            ? 'text-white'
                            : 'text-gray-700'
                        }`}
                      >
                        {item.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Navigation Component */}
          <div className="flex justify-center mt-4 md:mt-6">
            {/* Simple dots navigation for mobile - hidden on desktop */}
            <div className="flex md:hidden items-center justify-center gap-2">
              {items.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`transition-all duration-300 rounded-full ${
                    currentSlide === index
                      ? 'w-2.5 h-2.5 bg-white'
                      : 'w-2 h-2 bg-white/40'
                  }`}
                  aria-label={`Go to card ${index + 1}`}
                />
              ))}
            </div>
            {/* Desktop navigation - hidden on mobile */}
            <div className="hidden md:block">
              <CarouselNavigation
                currentIndex={currentSlide}
                totalItems={items.length}
                itemsPerView={itemsPerView}
                showPerCard={true}
                onSlideChange={handleSlideChange}
                onPrevious={handlePrevious}
                onNext={handleNext}
                enableKeyboardNavigation={true}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SousSlider;

