'use client';

import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import Image from 'next/image';
import { useRef, useEffect } from 'react';

export default function BrandEssenceVideoSection() {
  const { language } = useLanguage();
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
    <section className="relative min-h-[70vh] w-full overflow-hidden">
      <div className="absolute inset-0 z-0">
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
        >
          <source src="https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/kgmforest.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="absolute inset-0 bg-black/40 z-[1]" />
      </div>

      <div className="relative z-[2] flex items-center justify-center min-h-[70vh] px-6 md:px-12 text-center">
        <div className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.6 }}
            className="flex justify-center mb-6"
          >
            <Image
              src="https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/brandstory/icon-story-slogan.svg"
              alt={language === 'fr' ? "Profitez en toute confiance" : "Enjoy with Confidence"}
              width={400}
              height={80}
              className="w-auto h-12 md:h-16 lg:h-20"
              priority
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-6 space-y-3 text-white/90 text-sm md:text-base leading-relaxed"
            style={{ fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif' }}
          >
            <p>{language === 'fr' ? "Des nombreuses petites joies quotidiennes en ville" : "From the many small daily joys in the city"}</p>
            <p>{language === 'fr' ? "Aux diverses expériences de plein air dans la nature," : "To the diverse outdoor experiences in nature,"}</p>
            <p>
              {language === 'fr' ? "KGM s'efforce de fournir une mobilité qui permet aux clients de profiter en toute confiance de chaque moment de tout mode de vie," : "KGM strives to provide mobility that allows customers to confidently enjoy every moment of any lifestyle,"}
            </p>
            <p>
              {language === 'fr' ? "offrant une sécurité plus fiable et une praticité intuitive et pratique, se différenciant des autres marques." : "offering more reliable safety and intuitive, convenient practicality, differentiating itself from other brands."}
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}


