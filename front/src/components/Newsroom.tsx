"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

// News data with images, titles, and dates
const NEWS_ITEMS = [
  {
    image: "https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/newsroom/20250619094255481_LQzJqV.jpg",
    title: "Musso EV and Torres HEV receive strong interest and positive feedback at global launch events",
    date: "2025.06.19"
  },
  {
    image: "https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/newsroom/20250519093735664_KIIWT1.jpg",
    title: "KGM Expands Global Presence with Official Brand Launch in Italy",
    date: "2025.05.19"
  },
  {
    image: "https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/newsroom/20250514120701844_qLcOvE.jpg",
    title: "KGM Signs HOA with Indonesia's State-Owned Defense Company PINDAD to Cooperate on National Car and EV...",
    date: "2025.05.13"
  }
];

export default function Newsroom() {
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
      className="relative w-full py-20 px-6 md:px-12 bg-[#0b0d16] text-white overflow-hidden min-h-screen"
    >
      {/* Header section */}
      <motion.div 
        className="relative mb-12 md:mb-16"
        style={{
          opacity: sectionOpacity,
          y: sectionY
        }}
      >
        {/* Title section */}
        <div className="text-center mb-8">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-lg md:text-xl text-white/90 mb-2"
          >
            Find our latest news and event!
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
            className="text-3xl md:text-5xl font-extrabold tracking-tight text-[#d4be83]"
          >
            Newsroom
          </motion.h2>
        </div>

        {/* Learn more link */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          className="text-center"
        >
          <a 
            href="#learn-more" 
            className="inline-flex items-center text-white hover:text-white/90 transition-colors font-semibold"
          >
            Learn more {'>'}
          </a>
        </motion.div>
      </motion.div>

      {/* News cards container */}
      <motion.div 
        className="max-w-7xl mx-auto"
        style={{
          opacity: sectionOpacity,
          y: sectionY
        }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {NEWS_ITEMS.map((item, index) => (
            <motion.article
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 + index * 0.1 }}
              className="bg-white/5 backdrop-blur-sm rounded-xl overflow-hidden ring-1 ring-white/10 hover:ring-white/20 transition-all duration-300 group"
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/20" />
              </div>
              
              {/* Content */}
              <div className="p-6">
                <h3 className="text-lg font-semibold text-white mb-3 leading-relaxed">
                  {item.title}
                </h3>
                <p className="text-white/60 text-sm">
                  {item.date}
                </p>
              </div>
            </motion.article>
          ))}
        </div>
      </motion.div>

      {/* Right side buttons */}
      <div className="fixed right-6 md:right-10 lg:right-14 bottom-28 flex flex-col gap-3">
        <button className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white/15 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
            <line x1="22" x2="16" y1="9" y2="15"/>
            <line x1="16" x2="22" y1="9" y2="15"/>
          </svg>
        </button>
        <button className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex flex-col items-center justify-center text-white text-[10px] leading-tight">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 mb-0.5">
            <rect width="18" height="18" x="3" y="3" rx="2"/>
            <path d="M3 9h18"/>
            <path d="M3 15h18"/>
            <path d="M9 3v18"/>
            <path d="M15 3v18"/>
          </svg>
          QUICK
        </button>
      </div>
    </section>
  );
}

