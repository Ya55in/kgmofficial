'use client';

import React from 'react';
import CarFeatureSidebar from './CarFeatureSidebar';
import InteractiveHotspot from './InteractiveHotspot';
import { useCarFeatureSidebar } from '@/hooks/useCarFeatureSidebar';

// Define types locally
interface Hotspot {
  id: string;
  position: { x: string; y: string };
  title: string;
  description: string;
}

interface HotspotContent {
  title: string;
  subtitle?: string;
  images?: string[];
  video?: string;
  texts?: string[];
  image?: string;
}

interface CarFeatureSystemProps {
  hotspots: Hotspot[];
  getHotspotContent: (hotspotId: string) => HotspotContent | null;
  // Customization options
  backgroundColor?: string;
  textColor?: string;
  titleColor?: string;
  overlayColor?: string;
  buttonColor?: string;
  buttonHoverColor?: string;
  iconColor?: string;
  hotspotSize?: 'sm' | 'md' | 'lg';
  // Container styling
  containerClassName?: string;
  children?: React.ReactNode;
}

const CarFeatureSystem: React.FC<CarFeatureSystemProps> = ({
  hotspots,
  getHotspotContent,
  backgroundColor = '#ffffff',
  textColor = '#000000',
  titleColor = '#000000',
  overlayColor = 'rgba(0, 0, 0, 0.5)',
  buttonColor = 'bg-kgm-amber',
  buttonHoverColor = 'hover:bg-kgm-amber/80',
  iconColor = 'text-black',
  hotspotSize = 'md',
  containerClassName = '',
  children
}) => {
  const {
    isSideMenuOpen,
    selectedHotspot,
    currentHotspotImage,
    setCurrentHotspotImage,
    openSidebar,
    closeSidebar
  } = useCarFeatureSidebar();

  const handleHotspotClick = (hotspotId: string) => {
    openSidebar(hotspotId);
  };

  const getContent = () => {
    if (!selectedHotspot) return null;
    return getHotspotContent(selectedHotspot);
  };

  return (
    <div className={`relative ${containerClassName}`}>
      {children}
      
      {/* Interactive Hotspots */}
      {hotspots.map((hotspot) => (
        <InteractiveHotspot
          key={hotspot.id}
          hotspot={hotspot}
          onClick={handleHotspotClick}
          isActive={selectedHotspot === hotspot.id}
          buttonColor={buttonColor}
          buttonHoverColor={buttonHoverColor}
          iconColor={iconColor}
          size={hotspotSize}
        />
      ))}

      {/* Car Feature Sidebar */}
      <CarFeatureSidebar
        isOpen={isSideMenuOpen && !!selectedHotspot}
        onClose={closeSidebar}
        selectedHotspot={selectedHotspot}
        getHotspotContent={getContent}
        currentHotspotImage={currentHotspotImage}
        setCurrentHotspotImage={setCurrentHotspotImage}
      />
    </div>
  );
};

export default CarFeatureSystem;

