"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export default function KGMBanner() {
  const sectionRef = useRef<HTMLElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  // Transform based on scroll
  const sectionOpacity = useTransform(scrollYProgress, [0, 0.2], [0, 1]);
  const sectionY = useTransform(scrollYProgress, [0, 0.2], [50, 0]);

  return (
    <section 
      ref={sectionRef} 
      className="relative w-full py-8 bg-[#0b0d16] text-white overflow-hidden"
    >
      {/* Container with 70% width and centered */}
      <div className="w-[70%] mx-auto h-[120px] relative overflow-hidden rounded-lg shadow-2xl">
        {/* Background image */}
        <div className="absolute inset-0">
          <img 
            src="https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/kgm-banner.jpg"
            alt="KGM Banner"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/50" />
        </div>

        {/* Main content */}
        <motion.div 
          className="relative z-10 h-full flex items-center justify-between px-6 md:px-12"
          style={{
            opacity: sectionOpacity,
            y: sectionY
          }}
        >
          {/* Left side content */}
          <motion.div 
            className="flex-1"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
          
          </motion.div>

          {/* Right side - Learn more link */}
          <motion.a 
            href="#learn-more"
            className="inline-flex items-center text-white hover:text-white/90 transition-colors font-semibold text-sm md:text-base"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
          >
            Learn more {'>'}
          </motion.a>
        </motion.div>

        {/* Navigation arrows */}
        <motion.div 
          className="absolute left-2 top-1/2 transform -translate-y-1/2"
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
        >
          <button className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white/15 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15,18 9,12 15,6"/>
            </svg>
          </button>
        </motion.div>

        <motion.div 
          className="absolute right-2 top-1/2 transform -translate-y-1/2"
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
        >
          <button className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white/15 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9,18 15,12 9,6"/>
            </svg>
          </button>
        </motion.div>
      </div>
    </section>
  );
}
