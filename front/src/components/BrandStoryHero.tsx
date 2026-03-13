'use client';

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const BrandStoryHero = () => {
  const { language } = useLanguage();
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handlePlayClick = async () => {
    if (videoRef.current) {
      try {
        if (isPlaying) {
          videoRef.current.pause();
          setIsPlaying(false);
        } else {
          // Unmute the video and play
          videoRef.current.muted = false;
          await videoRef.current.play();
          setIsPlaying(true);
        }
      } catch (error) {
        console.error('Error playing video:', error);
        // Fallback: try to play muted if unmuted fails
        try {
          videoRef.current.muted = true;
          await videoRef.current.play();
          setIsPlaying(true);
        } catch (fallbackError) {
          console.error('Fallback play failed:', fallbackError);
        }
      }
    }
  };

  const handleLearnMoreClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    await handlePlayClick();
  };

  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* Video Background */}
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover"
        muted
        loop
        playsInline
        preload="metadata"
      >
        <source src="https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/brand_key_visual_241220.mp4" type="video/mp4" />
      </video>

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Content Overlay */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4">
        {/* Main Text */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-white text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-light tracking-wide mb-8"
        >
          {language === 'fr' ? "Profitez en toute confiance" : "Enjoy with Confidence"}
        </motion.h1>

        {/* Play Button and Learn More */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex flex-col items-center space-y-4"
        >
          {/* Play/Pause Button */}
          <motion.button
            onClick={handlePlayClick}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="w-16 h-16 md:w-20 md:h-20 border-2 border-white rounded-full flex items-center justify-center group hover:bg-white/10 transition-colors"
          >
            {isPlaying ? (
              <Pause 
                size={24} 
                className="text-white group-hover:scale-110 transition-transform" 
              />
            ) : (
              <Play 
                size={24} 
                className="text-white ml-1 group-hover:scale-110 transition-transform" 
              />
            )}
          </motion.button>

          {/* Learn More Text */}
          <motion.button
            onClick={handleLearnMoreClick}
            whileHover={{ y: -2 }}
            className="text-white text-sm md:text-base font-light tracking-wide hover:underline transition-colors cursor-pointer"
          >
            {language === 'fr' ? "En savoir plus" : "Learn more"}
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
};

export default BrandStoryHero;
