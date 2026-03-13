"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import enTranslations from '@/messages/en.json';
import frTranslations from '@/messages/fr.json';
import { useLanguage } from '@/contexts/LanguageContext';

// Video and image paths
const VIDEO_PATH = "https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/hero/202510301620.mp4";
const IMAGES = [
  "https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/brand/20250122162318291_aXwgIL.jpg",
  "https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/brand/20250122162343171_oTxtBO.jpg", 
  "https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/brand/20250122162541933_b9TkLy.jpg",
  "https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/brand/20250122162631430_uH0HuO.jpg"
];

export default function BrandSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const { language } = useLanguage();
  
  // Get current translations based on language
  const t = language === 'fr' ? frTranslations : enTranslations;
  
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  // Transform video size and position based on scroll
  const videoScale = useTransform(scrollYProgress, [0, 0.4], [1, 0.55]);
  const videoY = useTransform(scrollYProgress, [0, 0.4], [0, -30]);
  
  // Transform images opacity and position
  const imagesOpacity = useTransform(scrollYProgress, [0.2, 0.4], [0, 1]);
  const imagesScale = useTransform(scrollYProgress, [0.2, 0.4], [0.8, 1]);

  return (
    <section 
      ref={sectionRef} 
      className="relative w-full pt-8 pb-8 px-6 md:px-12 bg-gradient-to-b from-[#0e1122] via-[#0b0d16] to-[#0b0d16] text-white overflow-hidden"
    >
      {/* Title section at the top */}
      <div className="text-center mb-4 md:mb-6">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-3xl md:text-5xl font-extrabold tracking-tight text-white mb-4"
        >
          {language === 'fr' ? "Marque" : "Brand"}
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
          className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto"
        >
          {language === 'fr' ? "KGM se transforme, guidée par une vision audacieuse" : "KGM is transforming, driven by a bold new vision."}
        </motion.p>
      </div>

      {/* Main content container with video and images */}
      <div className="relative w-full">
        {/* Desktop layout: images on left, video full width in center, images on right */}
        <div className="hidden lg:flex items-stretch gap-4 relative">
          {/* Left side images */}
          <div className="flex flex-col gap-4 flex-shrink-0">
            {/* Top left image - Brand Story */}
            <motion.div 
              className="w-48 h-32 md:w-56 md:h-36 lg:w-64 lg:h-40 relative block"
              style={{
                opacity: imagesOpacity,
                scale: imagesScale
              }}
            >
              <img 
                src={IMAGES[0]} 
                alt="Brand story"
                className="w-full h-full object-cover rounded-lg shadow-lg ring-1 ring-white/20"
              />
              <div className="absolute inset-0 bg-black/40 rounded-lg">
              </div>
            </motion.div>

            {/* Bottom left image - CI-BI System */}
            <motion.div 
              className="w-48 h-32 md:w-56 md:h-36 lg:w-64 lg:h-40 relative"
              style={{
                opacity: imagesOpacity,
                scale: imagesScale
              }}
            >
              <img 
                src={IMAGES[1]} 
                alt="CI-BI System"
                className="w-full h-full object-cover rounded-lg shadow-lg ring-1 ring-white/20"
              />
              <div className="absolute inset-0 bg-black/40 rounded-lg">
              </div>
            </motion.div>
          </div>

          {/* Center video container - same height as images */}
          <div className="flex-1 relative overflow-hidden self-stretch">
            <video
              className="absolute inset-0 h-full w-full object-cover"
              autoPlay
              loop
              muted
              playsInline
            >
              <source src={VIDEO_PATH} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            
            {/* Dark overlay for readability */}
            <div className="absolute inset-0 bg-black/35" />
          </div>

          {/* Right side images */}
          <div className="flex flex-col gap-4 flex-shrink-0">
            {/* Top right image - KGM Steering */}
            <motion.div 
              className="w-48 h-32 md:w-56 md:h-36 lg:w-64 lg:h-40 relative"
              style={{
                opacity: imagesOpacity,
                scale: imagesScale
              }}
            >
              <img 
                src={IMAGES[2]} 
                alt="KGM Steering"
                className="w-full h-full object-cover rounded-lg shadow-lg ring-1 ring-white/20"
              />
              <div className="absolute inset-0 bg-black/40 rounded-lg flex flex-col justify-end p-3">
              </div>
            </motion.div>

            {/* Bottom right image - Heritage 1954 */}
            <motion.div 
              className="w-48 h-32 md:w-56 md:h-36 lg:w-64 lg:h-40 relative block"
              style={{
                opacity: imagesOpacity,
                scale: imagesScale
              }}
            >
              <img 
                src={IMAGES[3]} 
                alt="Heritage 1954"
                className="w-full h-full object-cover rounded-lg shadow-lg ring-1 ring-white/20"
              />
              <div className="absolute inset-0 bg-black/40 rounded-lg">
              </div>
            </motion.div>
          </div>
        </div>

        {/* Mobile video container - no scroll effects */}
        <div className="lg:hidden relative w-full aspect-[16/9] overflow-hidden">
          <video
            className="absolute inset-0 h-full w-full object-cover"
            autoPlay
            loop
            muted
            playsInline
          >
            <source src={VIDEO_PATH} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          
          {/* Dark overlay for readability */}
          <div className="absolute inset-0 bg-black/35" />
        </div>
      </div>

      {/* Mobile Cards Section */}
      <div className="lg:hidden mt-6 space-y-6">
        {/* Brand Story Card */}
        <motion.div
          className="block"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div className="relative h-48 rounded-xl overflow-hidden ring-1 ring-white/10">
            <img 
              src={IMAGES[0]} 
              alt="Brand story"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40" />
          </div>
        </motion.div>

        {/* CI-BI System Card */}
        <motion.div
          className="block group"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
        >
          <div className="relative h-48 rounded-xl overflow-hidden ring-1 ring-white/10">
            <img 
              src={IMAGES[1]} 
              alt="CI-BI System"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40">
            </div>
          </div>
        </motion.div>

        {/* Heritage 1954 Card */}
        <motion.div
          className="block"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
        >
          <div className="relative h-48 rounded-xl overflow-hidden ring-1 ring-white/10">
            <img 
              src={IMAGES[3]} 
              alt="Heritage 1954"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40" />
          </div>
        </motion.div>
      </div>


    </section>
  );
}
