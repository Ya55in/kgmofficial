'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';

interface Vr360Props {
  className?: string;
  images: string[];
  autoRotate?: boolean;
  rotationSpeed?: number;
}

const Vr360 = ({ className = '', images, autoRotate = false, rotationSpeed = 0.5 }: Vr360Props) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [dragStartIndex, setDragStartIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>();

  // Auto-rotation effect
  useEffect(() => {
    if (autoRotate) {
      const rotate = () => {
        setCurrentImageIndex((prev) => (prev + 1) % images.length);
        animationRef.current = requestAnimationFrame(rotate);
      };
      animationRef.current = requestAnimationFrame(rotate);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [autoRotate, images.length]);

  // Mouse events
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStartX(e.clientX);
    setDragStartIndex(currentImageIndex);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    
    const deltaX = e.clientX - dragStartX;
    const sensitivity = 0.3;
    const newIndex = Math.round((dragStartIndex + deltaX * sensitivity) % images.length);
    const normalizedIndex = newIndex < 0 ? images.length + newIndex : newIndex;
    setCurrentImageIndex(normalizedIndex);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Touch events
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    setDragStartX(e.touches[0].clientX);
    setDragStartIndex(currentImageIndex);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    
    const deltaX = e.touches[0].clientX - dragStartX;
    const sensitivity = 0.3;
    const newIndex = Math.round((dragStartIndex + deltaX * sensitivity) % images.length);
    const normalizedIndex = newIndex < 0 ? images.length + newIndex : newIndex;
    setCurrentImageIndex(normalizedIndex);
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  // Keyboard events
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
    } else if (e.key === 'ArrowRight') {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }
  };

  // Don't render if no images are available
  if (!images || images.length === 0 || !images[currentImageIndex]) {
    return (
      <div className={`relative overflow-hidden select-none flex items-center justify-center bg-gray-100 ${className}`}>
        <div className="text-center text-gray-500">
          <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p className="text-lg font-medium">360° View Not Available</p>
          <p className="text-sm">VR images for this color/tone are not yet available</p>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden select-none ${className}`}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
    >
      {/* Current Image */}
      <Image
        src={images[currentImageIndex]}
        alt={`360 view ${currentImageIndex + 1}`}
        fill
        className="object-contain"
        priority
        style={{ 
          backgroundColor: 'transparent',
          mixBlendMode: 'normal'
        }}
      />

      {/* Progress Indicator */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-1">
        {images.map((_, index) => (
          <div
            key={index}
            className={`w-2 h-2 rounded-full transition-all duration-200 ${
              index === currentImageIndex ? 'bg-white' : 'bg-white/30'
            }`}
          />
        ))}
      </div>

      {/* Instructions */}
      <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-sm rounded-lg px-3 py-2 text-white text-sm">
        <div className="flex items-center space-x-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
          </svg>
          <span>Drag to rotate</span>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={() => setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 backdrop-blur-sm rounded-full p-2 text-white hover:bg-black/70 transition-all duration-200"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <button
        onClick={() => setCurrentImageIndex((prev) => (prev + 1) % images.length)}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 backdrop-blur-sm rounded-full p-2 text-white hover:bg-black/70 transition-all duration-200"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
};

export default Vr360;