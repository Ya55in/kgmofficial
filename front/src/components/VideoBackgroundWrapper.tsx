'use client';

import React from 'react';

interface VideoBackgroundWrapperProps {
  children: React.ReactNode;
}

const VideoBackgroundWrapper: React.FC<VideoBackgroundWrapperProps> = ({ children }) => {
  return (
    <div className="relative">
      {/* Single continuous Video Background for all wrapped sections */}
      <video
        className="absolute inset-0 w-full h-full object-cover z-0"
        autoPlay
        loop
        muted
        playsInline
      >
        <source src="https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/brandstory/video-bg.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      
      {/* Dark overlay for text readability */}
      <div className="absolute inset-0 bg-black/40 z-10"></div>
      
      {/* Content with higher z-index and proper spacing */}
      <div className="relative z-20 space-y-0">
        {children}
      </div>
    </div>
  );
};

export default VideoBackgroundWrapper;

