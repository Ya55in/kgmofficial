'use client';

import React, { useRef, useEffect } from 'react';
import Image from 'next/image';

const BrandEnjoyConfidenceSection: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.play().catch((error) => {
        console.error('Error playing video:', error);
      });
    }
  }, []);

  return (
    <section className="relative h-[80vh] flex items-center overflow-hidden">
      {/* Background video */}
      <div className="absolute inset-0 z-0">
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          className="w-full h-full object-cover"
        >
          <source src="https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/kgmforest.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
      
      {/* Dark overlay for better text readability */}
      <div className="absolute inset-0 bg-black/30 z-[1]" />
      
      {/* Content overlay */}
      <div className="relative z-[2] w-full h-full flex items-center justify-center">
        <div className="text-center max-w-4xl px-8">
          {/* Main Title */}
          <div className="flex justify-center mb-8">
            <Image
              src="https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/brandstory/icon-story-slogan.svg"
              alt="Enjoy with Confidence"
              width={500}
              height={100}
              className="w-auto h-16 md:h-20 lg:h-24 xl:h-28"
              priority
            />
          </div>
          
          {/* Body Text */}
          <div className="text-right max-w-3xl ml-auto">
            <p className="text-white text-lg md:text-xl lg:text-2xl font-light leading-relaxed" style={{ fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif' }}>
              From the many small daily joys in the city
              <br />
              To the diverse outdoor experiences in nature,
              <br />
              KGM strives to provide mobility that allows
              <br />
              customers to confidently enjoy every
              <br />
              moment of any lifestyle,
              <br />
              offering more reliable safety and intuitive,
              <br />
              convenient practicality, differentiating itself
              <br />
              from other brands.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BrandEnjoyConfidenceSection;
