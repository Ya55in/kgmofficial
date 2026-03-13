'use client';

import React from 'react';
import { motion } from 'framer-motion';

// Define Hotspot type locally
interface Hotspot {
  id: string;
  position: { x: string; y: string };
  title: string;
  description: string;
}

interface InteractiveHotspotProps {
  hotspot: Hotspot;
  onClick: (hotspotId: string) => void;
  isActive?: boolean;
  buttonColor?: string;
  buttonHoverColor?: string;
  iconColor?: string;
  size?: 'sm' | 'md' | 'lg';
}

const InteractiveHotspot: React.FC<InteractiveHotspotProps> = ({
  hotspot,
  onClick,
  isActive = false,
  buttonColor = 'bg-kgm-amber',
  buttonHoverColor = 'hover:bg-kgm-amber/80',
  iconColor = 'text-black',
  size = 'md'
}) => {
  const sizeClasses = {
    sm: 'w-6 h-6 text-sm',
    md: 'w-8 h-8 text-lg',
    lg: 'w-10 h-10 text-xl'
  };

  return (
    <motion.button
      key={hotspot.id}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.2 }}
      whileTap={{ scale: 0.9 }}
      className={`absolute ${sizeClasses[size]} ${buttonColor} ${buttonHoverColor} rounded-full flex items-center justify-center font-bold shadow-lg transition-all duration-300 ${iconColor}`}
      style={{
        left: hotspot.position.x,
        top: hotspot.position.y,
        transform: 'translate(-50%, -50%)'
      }}
      onClick={() => onClick(hotspot.id)}
    >
      {isActive ? '✓' : '+'}
    </motion.button>
  );
};

export default InteractiveHotspot;

