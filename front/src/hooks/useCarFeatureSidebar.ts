import { useState } from 'react';

// Define HotspotContent type locally
interface HotspotContent {
  title: string;
  subtitle?: string;
  images?: string[];
  video?: string;
  texts?: string[];
  image?: string;
}

export const useCarFeatureSidebar = () => {
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);
  const [selectedHotspot, setSelectedHotspot] = useState<string | null>(null);
  const [currentHotspotImage, setCurrentHotspotImage] = useState(0);

  const openSidebar = (hotspotId: string) => {
    setSelectedHotspot(hotspotId);
    setIsSideMenuOpen(true);
    setCurrentHotspotImage(0);
  };

  const closeSidebar = () => {
    setIsSideMenuOpen(false);
    setSelectedHotspot(null);
    setCurrentHotspotImage(0);
  };

  const nextImage = () => {
    setCurrentHotspotImage((prev) => prev + 1);
  };

  const prevImage = () => {
    setCurrentHotspotImage((prev) => Math.max(0, prev - 1));
  };

  return {
    isSideMenuOpen,
    selectedHotspot,
    currentHotspotImage,
    setCurrentHotspotImage,
    openSidebar,
    closeSidebar,
    nextImage,
    prevImage
  };
};

