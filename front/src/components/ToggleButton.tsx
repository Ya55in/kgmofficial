'use client';

import React from 'react';

interface ToggleButtonProps {
  isOpen: boolean;
  onClick: () => void;
  className?: string;
}

const ToggleButton: React.FC<ToggleButtonProps> = ({
  isOpen,
  onClick,
  className = 'bg-kgm-amber text-black w-10 h-10 rounded-full font-semibold hover:bg-kgm-amber/80 transition-colors duration-300 flex items-center justify-center'
}) => {
  return (
    <button 
      onClick={onClick}
      className={className}
      aria-label={isOpen ? 'Close' : 'Open'}
    >
      <span className="text-lg">{isOpen ? '−' : '+'}</span>
    </button>
  );
};

export default ToggleButton;

