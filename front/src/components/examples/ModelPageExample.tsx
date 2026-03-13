'use client';

import React from 'react';
import CarFeatureSystem from '../CarFeatureSystem';

// Define types locally
interface Hotspot {
  id: string;
  position: { x: string; y: string };
  title: string;
  description: string;
  content: HotspotContent;
}

interface HotspotContent {
  title: string;
  subtitle?: string;
  images?: string[];
  video?: string;
  texts?: string[];
  image?: string;
}

// Example usage of the reusable CarFeatureSystem
const ModelPageExample = () => {
  // Define your hotspots
  const hotspots: Hotspot[] = [
    {
      id: 'headlight',
      position: { x: '25%', y: '35%' },
      title: 'LED Headlights',
      description: 'Advanced LED lighting technology',
      content: {
        title: 'Advanced LED Headlights',
        images: ['/path/to/headlight1.jpg', '/path/to/headlight2.jpg'],
        video: '/path/to/headlight-video.mp4',
        texts: [
          'Full projection front head lights with DRL',
          'Advanced LED technology for superior visibility'
        ]
      }
    },
    {
      id: 'grille',
      position: { x: '50%', y: '45%' },
      title: 'Signature Grille',
      description: 'Distinctive front grille design',
      content: {
        title: 'Signature Grille',
        images: ['/path/to/grille1.jpg'],
        texts: ['Distinctive front grille design with chrome finish']
      }
    }
  ];

  // Function to get hotspot content
  const getHotspotContent = (hotspotId: string): HotspotContent | null => {
    const hotspot = hotspots.find(h => h.id === hotspotId);
    return hotspot?.content || null;
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Your page content */}
      <div className="relative">
        {/* Car image or 3D model */}
        <img 
          src="/path/to/car-image.jpg" 
          alt="Car Model" 
          className="w-full h-screen object-cover"
        />
        
        {/* Car Feature System - handles all hotspots and sidebar */}
        <CarFeatureSystem
          hotspots={hotspots}
          getHotspotContent={getHotspotContent}
          // Customization options
          backgroundColor="#ffffff"
          textColor="#000000"
          titleColor="#000000"
          overlayColor="rgba(0, 0, 0, 0.5)"
          buttonColor="bg-kgm-amber"
          buttonHoverColor="hover:bg-kgm-amber/80"
          iconColor="text-black"
          hotspotSize="md"
        />
      </div>
    </div>
  );
};

export default ModelPageExample;

