'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Menu, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';

const TransparentNavbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isBrandNewsHovered, setIsBrandNewsHovered] = useState(false);
  const [brandHoverTimeout, setBrandHoverTimeout] = useState<NodeJS.Timeout | null>(null);
  const { language, toggleLanguage } = useLanguage();

  const leftMenuItems = [
    { name: language === 'fr' ? "MODÈLES" : "MODELS", href: '/models' },
    { name: language === 'fr' ? "MARQUE" : "BRAND", href: '#brand' },
    { name: language === 'fr' ? "NOUS CONTACTER" : "CONTACT US", href: '/contact-us' },
  ];

  const rightMenuItems = [];

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.mobile-menu') && !target.closest('.hamburger-button')) {
        setIsMobileMenuOpen(false);
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMobileMenuOpen]);

  // Handle brand hover with timeout - only for BRAND item
  const handleBrandMouseEnter = (event: React.MouseEvent) => {
    const target = event.currentTarget as HTMLElement;
    const isBrandItem = target.getAttribute('data-menu-item') === 'brand';
    
    // Only show dropdown if hovering over BRAND item specifically
    if (isBrandItem) {
      if (brandHoverTimeout) {
        clearTimeout(brandHoverTimeout);
      }
      setBrandHoverTimeout(setTimeout(() => {
        setIsBrandNewsHovered(true);
      }, 150));
    }
  };

  const handleBrandMouseLeave = () => {
    if (brandHoverTimeout) {
      clearTimeout(brandHoverTimeout);
      setBrandHoverTimeout(null);
    }
    // Add delay before closing to allow moving to dropdown
    setBrandHoverTimeout(setTimeout(() => {
      setIsBrandNewsHovered(false);
    }, 200));
  };

  const handleDropdownMouseEnter = () => {
    if (brandHoverTimeout) {
      clearTimeout(brandHoverTimeout);
      setBrandHoverTimeout(null);
    }
    setIsBrandNewsHovered(true);
  };

  const handleDropdownMouseLeave = () => {
    if (brandHoverTimeout) {
      clearTimeout(brandHoverTimeout);
      setBrandHoverTimeout(null);
    }
    setIsBrandNewsHovered(false);
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (brandHoverTimeout) {
        clearTimeout(brandHoverTimeout);
      }
    };
  }, [brandHoverTimeout]);


  const navbarVariants = {
    initial: { backgroundColor: 'rgba(44, 41, 78, 0.1)' },
    scrolled: { 
      backgroundColor: 'rgba(44, 41, 78, 0.9)',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
    }
  };

  const mobileMenuVariants = {
    closed: {
      opacity: 0,
      height: 0,
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    },
    open: {
      opacity: 1,
      height: 'auto',
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    }
  };

  const popupVariants = {
    hidden: {
      opacity: 0,
      y: -10,
      scale: 0.95,
      transition: {
        duration: 0.2,
        ease: "easeOut"
      }
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.2,
        ease: "easeOut"
      }
    }
  };

  return (
    <>
      <motion.nav
        variants={navbarVariants}
        initial="initial"
        animate={isScrolled ? "scrolled" : "initial"}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="fixed top-0 left-0 right-0 z-[100] h-20"
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
          <div className="flex items-center justify-between h-full">
            
            {/* Left Menu Items - Desktop */}
            <div className="hidden lg:flex items-center space-x-8">
              {/* MODELS */}
              <motion.a
                href="/models"
                whileHover={{ y: -2 }}
                className="relative text-white font-semibold uppercase tracking-wide text-sm cursor-pointer group"
              >
                {language === 'fr' ? "MODÈLES" : "MODELS"}
                <motion.div
                  className="absolute bottom-0 left-0 h-0.5 bg-white"
                  initial={{ width: 0 }}
                  whileHover={{ width: '100%' }}
                  transition={{ duration: 0.2 }}
                />
              </motion.a>

              {/* BRAND - with dropdown */}
              <div className="relative">
                <motion.a
                  href="#brand"
                  whileHover={{ y: -2 }}
                  onMouseEnter={handleBrandMouseEnter}
                  onMouseLeave={handleBrandMouseLeave}
                  data-menu-item="brand"
                  className="relative text-white font-semibold uppercase tracking-wide text-sm cursor-pointer group"
                >
                  {language === 'fr' ? "MARQUE" : "BRAND"}
                  <motion.div
                    className="absolute bottom-0 left-0 h-0.5 bg-white"
                    initial={{ width: 0 }}
                    whileHover={{ width: '100%' }}
                    transition={{ duration: 0.2 }}
                  />
                </motion.a>

                {/* Brand Dropdown - Positioned under BRAND item */}
                <AnimatePresence>
                  {isBrandNewsHovered && (
                    <motion.div
                      variants={popupVariants}
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
                      onMouseEnter={handleDropdownMouseEnter}
                      onMouseLeave={handleDropdownMouseLeave}
                      className="absolute top-full left-0 w-64 bg-white shadow-xl border border-gray-200 z-50 rounded-lg overflow-hidden"
                    >
                      {/* Main content */}
                      <div className="p-6 bg-white">
                        {/* Brand Menu Items */}
                        <div className="space-y-4">
                          <a href="/brand-story" className="flex items-center text-black text-base hover:text-blue-600 transition-colors group">
                            <span className="font-semibold uppercase tracking-wide">{language === 'fr' ? "Histoire de la Marque" : "BRAND STORY"}</span>
                            <motion.div
                              className="ml-2 h-0.5 bg-blue-600"
                              initial={{ width: 0 }}
                              whileHover={{ width: 20 }}
                              transition={{ duration: 0.2 }}
                            />
                          </a>
                          <a href="/heritage-1954" className="flex items-center text-black text-base hover:text-blue-600 transition-colors group">
                            <span className="font-semibold uppercase tracking-wide">{language === 'fr' ? "Héritage 1954" : "HERITAGE 1954"}</span>
                            <motion.div
                              className="ml-2 h-0.5 bg-blue-600"
                              initial={{ width: 0 }}
                              whileHover={{ width: 20 }}
                              transition={{ duration: 0.2 }}
                            />
                          </a>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* CONTACT US */}
              <motion.a
                href="/contact-us"
                whileHover={{ y: -2 }}
                className="relative text-white font-semibold uppercase tracking-wide text-sm cursor-pointer group"
              >
                {language === 'fr' ? "NOUS CONTACTER" : "CONTACT US"}
                <motion.div
                  className="absolute bottom-0 left-0 h-0.5 bg-white"
                  initial={{ width: 0 }}
                  whileHover={{ width: '100%' }}
                  transition={{ duration: 0.2 }}
                />
              </motion.a>
            </div>


            {/* Center Logo */}
            <motion.div 
              className="flex-shrink-0"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <Link href="/" aria-label="Go to home">
                <Image
                  src="https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/hero/icon-logo-light.svg"
                  alt="KGM Logo"
                  width={100}
                  height={40}
                  className="w-auto h-7"
                  priority
                />
              </Link>
            </motion.div>

            {/* Right Menu Items & Icons - Desktop */}
            <div className="hidden lg:flex items-center space-x-8">
              {/* Search Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center space-x-2 text-white hover:text-white/90 transition-colors"
              >
                <span className="font-semibold uppercase tracking-wide text-sm">{language === 'fr' ? "RECHERCHER" : "SEARCH"}</span>
                <Search size={16} />
              </motion.button>

              {/* Language Switcher */}
              <motion.button
                onClick={toggleLanguage}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center space-x-2 text-white hover:text-white/90 transition-colors"
              >
                <span className="font-semibold uppercase tracking-wide text-sm">
                  {language === 'en' ? 'FR' : 'EN'}
                </span>
              </motion.button>
            </div>

            {/* Mobile Menu Button */}
            <motion.button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="lg:hidden text-white p-2 hamburger-button"
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </motion.button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            variants={mobileMenuVariants}
            initial="closed"
            animate="open"
            exit="closed"
            className="lg:hidden fixed top-20 left-0 right-0 z-40 bg-kgm-purple/95 backdrop-blur-sm mobile-menu"
          >
            <div className="px-4 py-6 space-y-4">
              {leftMenuItems.map((item) => {
                if (item.name === (language === 'fr' ? "MARQUE" : "BRAND")) {
                  return (
                    <div key={item.name} className="space-y-2">
                      <motion.a
                        href={item.href}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.2 }}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="block text-white font-semibold uppercase tracking-wide text-lg py-3 px-4 hover:bg-white/10 rounded-lg transition-colors"
                      >
                        {item.name}
                      </motion.a>
                      <div className="ml-4 space-y-1">
                        <motion.a
                          href="/brand-story"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          transition={{ duration: 0.2, delay: 0.1 }}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="block text-white/80 font-medium uppercase tracking-wide text-base py-2 px-4 hover:bg-white/10 rounded-lg transition-colors"
                        >
                          {language === 'fr' ? "Histoire de la Marque" : "BRAND STORY"}
                        </motion.a>
                        <motion.a
                          href="/heritage-1954"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          transition={{ duration: 0.2, delay: 0.2 }}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="block text-white/80 font-medium uppercase tracking-wide text-base py-2 px-4 hover:bg-white/10 rounded-lg transition-colors"
                        >
                          {language === 'fr' ? "Héritage 1954" : "HERITAGE 1954"}
                        </motion.a>
                      </div>
                    </div>
                  );
                }
                return (
                  <motion.a
                    key={item.name}
                    href={item.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block text-white font-semibold uppercase tracking-wide text-lg py-3 px-4 hover:bg-white/10 rounded-lg transition-colors"
                  >
                    {item.name}
                  </motion.a>
                );
              })}
              
              {/* Mobile Language Toggle */}
              <motion.button
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2, delay: 0.1 }}
                onClick={toggleLanguage}
                className="flex items-center space-x-3 text-white py-3 px-4 hover:bg-white/10 rounded-lg transition-colors w-full"
              >
                <span className="font-semibold uppercase tracking-wide">
                  {language === 'en' ? 'FR' : 'EN'}
                </span>
              </motion.button>

              {/* Mobile Search */}
              <motion.button
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2, delay: 0.2 }}
                className="flex items-center space-x-3 text-white py-3 px-4 hover:bg-white/10 rounded-lg transition-colors w-full"
              >
                <span className="font-semibold uppercase tracking-wide">{language === 'fr' ? "RECHERCHER" : "SEARCH"}</span>
                <Search size={20} />
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default TransparentNavbar;
