'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

const PhilosophyNavbar = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsVisible(scrollTop > 100);
      
      // Hide/show the original navbar
      const originalNavbar = document.querySelector('nav[class*="fixed top-0"]') as HTMLElement;
      if (originalNavbar) {
        if (scrollTop > 100) {
          originalNavbar.style.display = 'none';
        } else {
          originalNavbar.style.display = 'block';
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'ABOUT. KGM', href: '/about', isActive: false },
    { name: 'LOCATION', href: '/location', isActive: false },
    { name: 'PHILOSOPHY', href: '/philosophy', isActive: true },
    { name: 'CSR', href: '/csr', isActive: false },
    { name: 'COMPANY BROCHURE', href: '/company-brochure', isActive: false },
    { name: 'IR INFORMATION', href: '/ir-information', isActive: false },
    { name: 'FINANCIAL INFORMATION', href: '/financial-information', isActive: false },
    { name: 'IR RESOURCES', href: '/ir-resources', isActive: false },
  ];

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.nav
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="fixed top-0 left-0 right-0 z-50 bg-gray-100 border-b border-gray-200"
        >
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <div className="flex items-center justify-center py-4">
              <div className="flex items-center space-x-0">
                {navItems.map((item, index) => (
                  <div key={item.name} className="flex items-center">
                    <Link
                      href={item.href}
                      className={`px-4 py-2 text-sm transition-colors hover:text-gray-800 ${
                        item.isActive 
                          ? 'font-bold text-gray-900' 
                          : 'font-normal text-gray-700 hover:text-gray-900'
                      }`}
                    >
                      {item.name}
                    </Link>
                    {index < navItems.length - 1 && (
                      <div className="w-px h-4 bg-gray-300 mx-2" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.nav>
      )}
    </AnimatePresence>
  );
};

export default PhilosophyNavbar;
