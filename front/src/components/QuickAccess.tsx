"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import enTranslations from '@/messages/en.json';
import frTranslations from '@/messages/fr.json';
import { useLanguage } from '@/contexts/LanguageContext';

// Quick access items with icons and translation keys
const QUICK_ACCESS_ITEMS = [
  {
    icon: "https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/svgs/20250204104455534_bDo505.svg",
    labelKey: "quickAccess.catalog"
  },
  {
    icon: "https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/svgs/20250204104521375_zerRER.svg",
    labelKey: "quickAccess.ownersManual"
  },
  {
    icon: "https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/svgs/20250204104628720_urpDu9.svg",
    labelKey: "quickAccess.serviceManual"
  },
  {
    icon: "https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/svgs/20250204104724244_ozHPQo.svg",
    labelKey: "quickAccess.partsCatalog"
  }
];

export default function QuickAccess() {
  const sectionRef = useRef<HTMLElement>(null);
  const { language } = useLanguage();
  
  // Function to get translated text for quick access items
  const getQuickAccessText = (labelKey: string) => {
    if (language === 'fr') {
      switch (labelKey) {
        case "quickAccess.catalog":
          return "CATALOGUE";
        case "quickAccess.ownersManual":
          return "MANUEL DU PROPRIÉTAIRE";
        case "quickAccess.serviceManual":
          return "MANUEL DE SERVICE";
        case "quickAccess.partsCatalog":
          return "CATALOGUE DE PIÈCES";
        default:
          return "KGM";
      }
    } else {
      switch (labelKey) {
        case "quickAccess.catalog":
          return "CATALOG";
        case "quickAccess.ownersManual":
          return "OWNER'S MANUAL";
        case "quickAccess.serviceManual":
          return "SERVICE MANUAL";
        case "quickAccess.partsCatalog":
          return "PARTS CATALOG";
        default:
          return "KGM";
      }
    }
  };
  
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
      className="relative w-full py-16 px-6 md:px-12 bg-[#0b0d16] text-white overflow-hidden"
    >
      {/* Main content container */}
      <motion.div 
        className="max-w-6xl mx-auto relative"
        style={{
          opacity: sectionOpacity,
          y: sectionY
        }}
      >
        {/* Quick access items */}
        <div className="flex justify-center items-center space-x-8 md:space-x-12 lg:space-x-16">
          {QUICK_ACCESS_ITEMS.map((item, index) => (
            <motion.div
              key={index}
              className="flex flex-col items-center space-y-3 group cursor-pointer"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 * index }}
              whileHover={{ scale: 1.05 }}
            >
              {/* Icon container */}
              <div className="relative w-16 h-16 md:w-20 md:h-20 flex items-center justify-center">
                <img 
                  src={item.icon}
                  alt={getQuickAccessText(item.labelKey)}
                  className="w-full h-full object-contain filter brightness-0 invert group-hover:brightness-100 group-hover:invert-0 transition-all duration-300"
                />
              </div>
              
              {/* Label */}
              <span className="text-xs md:text-sm font-semibold text-white uppercase tracking-wide text-center">
                {getQuickAccessText(item.labelKey)}
              </span>
            </motion.div>
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
{language === 'fr' ? "RAPIDE" : "QUICK"}
        </button>
      </div>
    </section>
  );
}

