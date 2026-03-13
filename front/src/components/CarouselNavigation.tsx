'use client';

import React, { useEffect } from 'react';

interface CarouselNavigationProps {
  currentIndex: number;
  totalItems: number;
  itemsPerView?: number;
  onSlideChange: (index: number) => void;
  onPrevious: () => void;
  onNext: () => void;
  enableKeyboardNavigation?: boolean;
  showPerCard?: boolean; // If true, show one indicator per card instead of per page
}

const CarouselNavigation: React.FC<CarouselNavigationProps> = ({
  currentIndex,
  totalItems,
  itemsPerView = 3,
  onSlideChange,
  onPrevious,
  onNext,
  enableKeyboardNavigation = false,
  showPerCard = false
}) => {
  const totalPages = Math.ceil(totalItems / itemsPerView);
  
  // Calculate the maximum index where we can still show itemsPerView cards
  // For example: if totalItems = 5 and itemsPerView = 3, maxIndex = 2 (showing cards 2, 3, 4)
  const maxIndex = Math.max(0, totalItems - itemsPerView);
  
  // Calculate progress based on how many cards are visible
  // When at index 0, we see cards 0 to (itemsPerView-1), so progress = itemsPerView / totalItems
  // When at maxIndex, we see the last itemsPerView cards, so progress = 100%
  const getProgress = () => {
    if (totalItems === 0) return 0;
    if (maxIndex === 0) return 100; // All items fit in one view
    if (currentIndex >= maxIndex) return 100; // At the last position, show 100%
    // Linear interpolation from start to end
    // At index 0: progress = itemsPerView / totalItems
    // At index maxIndex: progress = 100%
    const startProgress = (itemsPerView / totalItems) * 100;
    const endProgress = 100;
    const progress = startProgress + ((currentIndex / maxIndex) * (endProgress - startProgress));
    return Math.min(100, progress);
  };

  // Keyboard navigation support
  useEffect(() => {
    if (!enableKeyboardNavigation) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft') {
        onPrevious();
      } else if (event.key === 'ArrowRight') {
        onNext();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [enableKeyboardNavigation, onPrevious, onNext]);

  return (
    <div className="flex items-center justify-center mt-4 px-4 flex-shrink-0">
      {showPerCard ? (
        // Per-card navigation: [← Arrow] [Progress Bar] [→ Arrow]
        <>
          {/* Left Arrow Button */}
          <button 
            onClick={onPrevious}
            disabled={currentIndex === 0}
            className={`w-8 h-8 bg-black rounded-full flex items-center justify-center transition-all duration-200 border border-white flex-shrink-0 ${
              currentIndex === 0 
                ? 'opacity-40 cursor-not-allowed' 
                : 'hover:bg-gray-900 cursor-pointer'
            }`}
            aria-label="Previous"
          >
            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Progress Bar - Just the line, no dots */}
          <div className="flex-1 relative h-2 flex items-center mx-3" style={{ maxWidth: '300px', minWidth: '200px' }}>
            {/* Background Progress Bar Line - Full width gray line */}
            <div className="absolute inset-0 flex items-center">
              <div className="w-full h-0.5 bg-white/30 rounded-full"></div>
            </div>
            
            {/* Active Progress Segment - Continuous white line that fills */}
            <div 
              className="absolute left-0 top-1/2 h-0.5 bg-white rounded-full transition-all duration-300"
              style={{ 
                width: totalItems > 0 ? `${getProgress()}%` : '0%',
                transform: 'translateY(-50%)'
              }}
            />
          </div>

          {/* Right Arrow Button */}
          <button 
            onClick={onNext}
            disabled={currentIndex >= totalItems - 1}
            className={`w-8 h-8 bg-black rounded-full flex items-center justify-center transition-all duration-200 border border-white flex-shrink-0 ${
              currentIndex >= totalItems - 1 
                ? 'opacity-40 cursor-not-allowed' 
                : 'hover:bg-gray-900 cursor-pointer'
            }`}
            aria-label="Next"
          >
            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      ) : (
        // Original page-based navigation
        <>
          {/* Progress Bar with Active Segment */}
          <div className="flex-1 relative h-4 flex items-center mr-3">
            {/* Background Progress Bar */}
            <div className="absolute inset-0 flex items-center">
              <div className="w-full h-px bg-gray-500"></div>
            </div>
            
            {/* Active Progress Segment */}
            <div 
              className="absolute left-0 h-px bg-gray-300 transition-all duration-300"
              style={{ 
                width: `${((currentIndex + 1) / totalItems) * 100}%` 
              }}
            />
            
            {/* Clickable Pagination Indicators */}
            <div className="absolute inset-0 flex items-center justify-between">
              {Array.from({ length: totalPages }, (_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    const targetSlide = index * itemsPerView;
                    onSlideChange(Math.min(targetSlide, totalItems - 1));
                  }}
                  className={`transition-all duration-300 ${
                    Math.floor(currentIndex / itemsPerView) === index 
                      ? 'w-8 h-1 bg-white rounded-full' 
                      : 'w-1.5 h-1 bg-gray-500 rounded-full hover:bg-gray-400'
                  }`}
                />
              ))}
            </div>
          </div>
          
          {/* Navigation Buttons Group */}
          <div className="flex items-center space-x-1.5">
            <button 
              onClick={onPrevious}
              disabled={Math.floor(currentIndex / itemsPerView) === 0}
              className={`w-8 h-8 bg-black rounded-full flex items-center justify-center transition-all duration-200 border border-white ${
                Math.floor(currentIndex / itemsPerView) === 0 
                  ? 'opacity-40 cursor-not-allowed' 
                  : 'hover:bg-gray-900 cursor-pointer'
              }`}
              aria-label="Previous"
            >
              <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            <button 
              onClick={onNext}
              disabled={Math.floor(currentIndex / itemsPerView) === totalPages - 1}
              className={`w-8 h-8 bg-black rounded-full flex items-center justify-center transition-all duration-200 border border-white ${
                Math.floor(currentIndex / itemsPerView) === totalPages - 1 
                  ? 'opacity-40 cursor-not-allowed' 
                  : 'hover:bg-gray-900 cursor-pointer'
              }`}
              aria-label="Next"
            >
              <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default CarouselNavigation;

