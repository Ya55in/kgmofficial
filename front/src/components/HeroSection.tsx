'use client';

import { motion } from 'framer-motion';
import { ArrowRight, VolumeX, Volume2 } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import enTranslations from '@/messages/en.json';
import frTranslations from '@/messages/fr.json';
import { useLanguage } from '@/contexts/LanguageContext';

const HeroSection = () => {
  const [isSoundPlaying, setIsSoundPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { language } = useLanguage();
  
  // Get current translations based on language
  const t = language === 'fr' ? frTranslations : enTranslations;

  useEffect(() => {
    // Lazily create the audio element so it doesn't block initial render
    const audio = new Audio();
    // Try common audio formats – the first that exists will play
    // Place your file at public/media/KGM_main_sound_400k-Cd1qYekB.(mp3|ogg|webm)
    const sources = [
      'https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/media/KGM_main_sound_400k-Cd1qYekB.mp3',
      '/media/KGM_main_sound_400k-Cd1qYekB.ogg',
      '/media/KGM_main_sound_400k-Cd1qYekB.webm',
    ];
    // Pick the first one; browser will 404 if not found, which is fine
    audio.src = sources[0];
    audio.preload = 'auto';
    audioRef.current = audio;

    // Cleanup on unmount
    return () => {
      audio.pause();
      audioRef.current = null;
    };
  }, []);

  const toggleSound = async () => {
    if (!audioRef.current) return;
    try {
      if (isSoundPlaying) {
        audioRef.current.pause();
        setIsSoundPlaying(false);
      } else {
        await audioRef.current.play();
        setIsSoundPlaying(true);
      }
    } catch (err) {
      // Autoplay restrictions or missing file – simply ignore for now
      console.error('Audio playback failed:', err);
    }
  };

  const heroVariants = {
    initial: { opacity: 0, y: 50 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  return (
    <section className="relative h-screen overflow-hidden">
      {/* Video Background - starts from very top */}
      <div className="absolute inset-0 z-0">
        <video
          src="https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/hero/202510301620%20(1).mp4"
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover"
          onLoadStart={() => console.log('Video started loading')}
          onError={(e) => console.error('Video failed to load:', e)}
        />
        
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-black/20"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 h-full flex flex-col">
        {/* Left Side Content - positioned like in the car interior image */}
        <div className="flex-1 flex items-center px-8 lg:px-16 pt-20">
          <motion.div
            variants={heroVariants}
            initial="initial"
            animate="animate"
            className="text-white max-w-md"
          >
            {/* TORRES Text */}
            <h2 className="text-2xl md:text-3xl font-bold mb-4 tracking-wide">
              {(t as any)?.home?.hero?.title || "TORRES"}
            </h2>
            
            {/* Main Tagline (smaller than before) */}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-8 leading-tight">
              {(t as any)?.home?.hero?.subtitle || "NEW TOOLS. NEW LIFE."}
            </h1>
            
            {/* Learn More Link */}
            <motion.a
              href="/models/torres"
              whileHover={{ x: 5 }}
              className="inline-flex items-center text-lg font-semibold hover:text-white/90 transition-colors"
            >
              {(t as any)?.home?.hero?.learnMore || "Learn more"} <ArrowRight className="ml-2 w-5 h-5" />
            </motion.a>
          </motion.div>
        </div>

        {/* Sound Control - bottom left (click to toggle) */}
        <div className="absolute bottom-8 left-8 z-20">
          <motion.button
            onClick={toggleSound}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex items-center space-x-2 text-white/90 hover:text-white transition-colors"
            aria-pressed={isSoundPlaying}
            aria-label="Toggle sound"
          >
            {isSoundPlaying ? (
              <Volume2 className="w-5 h-5" />
            ) : (
              <VolumeX className="w-5 h-5" />
            )}
            <span className="text-sm font-medium">{(t as any)?.home?.hero?.sound || "SOUND"}</span>
          </motion.button>
        </div>


      </div>
    </section>
  );
};

export default HeroSection; 