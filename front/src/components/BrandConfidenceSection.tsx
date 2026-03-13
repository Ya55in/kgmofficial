'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';

const BrandConfidenceSection: React.FC = () => {
  const { language } = useLanguage();
  
  const confidenceItems = [
    {
      id: 1,
      title: language === 'fr' ? "DIFFÉREMMENT" : "DIFFERENTLY",
      description: language === 'fr' ? "Nous poursuivons des designs uniques et robustes qui nous différencient de la concurrence." : "We pursue unique and robust designs that differentiate us from competitors.",
      icon: (
        <div className="relative w-36 h-36 flex items-center justify-center">
          {/* Gold diamond with blue square inside */}
          <motion.div 
            className="absolute w-32 h-32 transform rotate-45 flex items-center justify-center"
            style={{ backgroundColor: '#c4a96c' }}
            animate={{ 
              rotate: [45, 405, 45],
              scale: [1, 1.1, 1]
            }}
            transition={{ 
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <motion.div 
              className="w-16 h-16 transform rotate-45"
              style={{ backgroundColor: '#2f2c4d' }}
              animate={{ 
                rotate: [45, -315, 45],
                scale: [1, 0.8, 1]
              }}
              transition={{ 
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            ></motion.div>
          </motion.div>
        </div>
      )
    },
    {
      id: 2,
      title: language === 'fr' ? "EN TOUTE SÉCURITÉ" : "SAFELY",
      description: language === 'fr' ? "Nous mettons en œuvre divers systèmes pour prévenir les accidents et construisons des carrosseries robustes pour protéger les passagers." : "We implement various systems to prevent accidents and build sturdy vehicle bodies to protect passengers.",
      icon: (
        <div className="relative w-36 h-36 flex items-center justify-center">
          {/* Blue circle with gold triangle on top */}
          <motion.div 
            className="w-32 h-32 rounded-full flex items-center justify-center"
            style={{ backgroundColor: '#2f2c4d' }}
            animate={{ 
              scale: [1, 1.2, 1],
              rotate: [0, 180, 360]
            }}
            transition={{ 
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <motion.div 
              className="w-0 h-0 border-l-[30px] border-r-[30px] border-b-[42px] border-l-transparent border-r-transparent"
              style={{ borderBottomColor: '#c4a96c' }}
              animate={{ 
                y: [0, -5, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            ></motion.div>
          </motion.div>
        </div>
      )
    },
    {
      id: 3,
      title: language === 'fr' ? "LIBREMENT" : "FREELY",
      description: language === 'fr' ? "Nous offrons une gamme pratique et créative et des options de personnalisation qui satisfont les modes de vie diversifiés." : "We offer a practical and creative lineup and customization options that satisfy diverse lifestyles.",
      icon: (
        <div className="relative w-36 h-36 flex items-center justify-center">
          {/* Gold circle with blue circle overlapping */}
          <motion.div 
            className="absolute w-24 h-24 rounded-full"
            style={{ backgroundColor: '#c4a96c' }}
            animate={{ 
              scale: [1, 1.3, 1],
              x: [0, 5, 0]
            }}
            transition={{ 
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          ></motion.div>
          <motion.div 
            className="absolute w-16 h-16 rounded-full ml-4"
            style={{ backgroundColor: '#2f2c4d' }}
            animate={{ 
              scale: [1, 0.7, 1],
              x: [0, -3, 0],
              y: [0, 2, 0]
            }}
            transition={{ 
              duration: 2.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          ></motion.div>
        </div>
      )
    }
  ];

  return (
    <section className="relative bg-gray-100 py-20 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Main Title */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="flex justify-center mb-4">
            <img
              src="https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/icon-story-slogan-black.svg"
              alt={language === 'fr' ? "Profitez en toute confiance" : "Enjoy with Confidence"}
              className="w-auto h-16 md:h-20 lg:h-24"
            />
          </div>
          <p className="text-lg md:text-xl text-gray-600">
            {language === 'fr' ? "Raisons d'avoir confiance en KGM" : "Reasons to have Confidence in KGM"}
          </p>
        </motion.div>

        {/* Desktop Version - Three Columns */}
        <div className="hidden md:grid grid-cols-3 gap-8 lg:gap-12">
          {confidenceItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              viewport={{ once: true }}
              className="text-center"
            >
              {/* Icon */}
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                whileInView={{ scale: 1, rotate: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 + 0.3 }}
                viewport={{ once: true }}
                className="flex justify-center mb-6"
              >
                {item.icon}
              </motion.div>

              {/* Title */}
              <motion.h3
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: index * 0.2 + 0.5 }}
                viewport={{ once: true }}
                className="text-2xl md:text-3xl font-bold mb-4 uppercase tracking-wide"
                style={{ color: '#c4a96c' }}
              >
                {item.title}
              </motion.h3>

              {/* Description */}
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: index * 0.2 + 0.7 }}
                viewport={{ once: true }}
                className="text-gray-700 text-base md:text-lg leading-relaxed"
              >
                {item.description}
              </motion.p>
            </motion.div>
          ))}
        </div>

        {/* Mobile Version - Vertical Stack with Design from Images */}
        <div className="md:hidden space-y-0">
          {confidenceItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="relative"
            >
              {/* Horizontal Line Separator (except for first item) */}
              {index > 0 && (
                <div className="w-full h-px bg-gray-300 mb-8"></div>
              )}

              <div className="flex items-start space-x-4 py-6">
                {/* Shapes on the left */}
                <div className="flex-shrink-0 mt-2">
                  {index === 0 && (
                    <div className="flex space-x-2">
                      {/* Gold triangle */}
                      <motion.div 
                        className="w-0 h-0 border-l-[12px] border-r-[12px] border-b-[16px] border-l-transparent border-r-transparent"
                        style={{ borderBottomColor: '#c4a96c' }}
                        animate={{ 
                          y: [0, -3, 0],
                          rotate: [0, 5, 0]
                        }}
                        transition={{ 
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      ></motion.div>
                      {/* Gold diamond with blue square inside */}
                      <motion.div 
                        className="w-6 h-6 transform rotate-45 flex items-center justify-center"
                        style={{ backgroundColor: '#c4a96c' }}
                        animate={{ 
                          rotate: [45, 405, 45],
                          scale: [1, 1.1, 1]
                        }}
                        transition={{ 
                          duration: 3,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      >
                        <motion.div 
                          className="w-3 h-3 transform rotate-45"
                          style={{ backgroundColor: '#2f2c4d' }}
                          animate={{ 
                            rotate: [45, -315, 45],
                            scale: [1, 0.8, 1]
                          }}
                          transition={{ 
                            duration: 2.5,
                            repeat: Infinity,
                            ease: "easeInOut"
                          }}
                        ></motion.div>
                      </motion.div>
                    </div>
                  )}
                  
                  {index === 1 && (
                    <div className="flex flex-col items-center space-y-2">
                      {/* Gold triangle above */}
                      <motion.div 
                        className="w-0 h-0 border-l-[12px] border-r-[12px] border-b-[16px] border-l-transparent border-r-transparent"
                        style={{ borderBottomColor: '#c4a96c' }}
                        animate={{ 
                          y: [0, -3, 0],
                          rotate: [0, 5, 0],
                          scale: [1, 1.1, 1]
                        }}
                        transition={{ 
                          duration: 2.5,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      ></motion.div>
                      
                      {/* Blue circle below */}
                      <motion.div 
                        className="w-6 h-6 rounded-full"
                        style={{ backgroundColor: '#2f2c4d' }}
                        animate={{ 
                          scale: [1, 1.2, 1],
                          rotate: [0, 180, 360],
                          y: [0, 2, 0]
                        }}
                        transition={{ 
                          duration: 4,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      ></motion.div>
                    </div>
                  )}
                  
                  {index === 2 && (
                    <div className="flex space-x-1">
                      <motion.div 
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: '#c4a96c' }}
                        animate={{ 
                          scale: [1, 1.3, 1],
                          x: [0, 2, 0]
                        }}
                        transition={{ 
                          duration: 2.5,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      ></motion.div>
                      <motion.div 
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: '#2f2c4d' }}
                        animate={{ 
                          scale: [1, 0.7, 1],
                          x: [0, -1, 0],
                          y: [0, 1, 0]
                        }}
                        transition={{ 
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      ></motion.div>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1">
                  {/* Title */}
                  <motion.h3
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: index * 0.1 + 0.2 }}
                    viewport={{ once: true }}
                    className="text-lg font-bold mb-2 uppercase tracking-wide"
                    style={{ color: '#c4a96c' }}
                  >
                    {item.title}
                  </motion.h3>

                  {/* Description */}
                  <motion.p
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: index * 0.1 + 0.3 }}
                    viewport={{ once: true }}
                    className="text-gray-700 text-sm leading-relaxed"
                  >
                    {item.description}
                  </motion.p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BrandConfidenceSection;
