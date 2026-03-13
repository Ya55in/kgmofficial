'use client';

import { useState, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import Vr360 from '@/components/Vr360';
import Footer from '@/components/Footer';
import CarFeatureSidebar from '@/components/CarFeatureSidebar';
import { useCarFeatureSidebar } from '@/hooks/useCarFeatureSidebar';

const TivoliPage = () => {
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [carView, setCarView] = useState<'front' | 'rear'>('front');
  const [activeHotspot, setActiveHotspot] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'color' | 'vr'>('color');
  const [selectedColor, setSelectedColor] = useState(0);
  const [toneMode, setToneMode] = useState<'1 TONE' | '2 TONE'>('2 TONE');
  
  // Sidebar functionality
  const {
    isSideMenuOpen,
    selectedHotspot,
    currentHotspotImage,
    setCurrentHotspotImage,
    openSidebar,
    closeSidebar
  } = useCarFeatureSidebar();
  
  // Handle color selection with automatic tone setting
  const handleColorSelection = (colorId: number) => {
    setSelectedColor(colorId);
    const color = carColors[colorId];
    if (!color.hasTwoTones) {
      setToneMode('1 TONE');
    }
  };
  
  const section2Ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: section2Ref,
    offset: ["start end", "end start"]
  });

  // Transform values for scroll animations
  const videoWidth = useTransform(scrollYProgress, [0, 0.5, 1], ["30%", "70%", "100%"]);
  const videoHeight = useTransform(scrollYProgress, [0, 0.5, 1], ["auto", "80%", "100%"]);
  const textSize = useTransform(scrollYProgress, [0, 0.5, 1], ["clamp(2rem, 6vw, 4rem)", "clamp(1.8rem, 5vw, 3rem)", "clamp(1.5rem, 4vw, 2.5rem)"]);
  const textLineHeight = useTransform(scrollYProgress, [0, 0.5, 1], [1.2, 1.3, 1.4]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [1, 1, 0.9, 0.8]);
  const textY = useTransform(scrollYProgress, [0, 0.5, 1], [0, 0, 0]);

  const features = [
    {
      icon: "https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/Tivoli/hero/20250124172442986_VZpfKQ.svg",
      title: "Smart Style",
      description: "Spot-On for Urban Life"
    },
    {
      icon: "https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/Tivoli/hero/20250124172458046_LBeV4i.svg",
      title: "Iconic Exterior",
      description: "Compact but Attractive"
    },
    {
      icon: "https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/Tivoli/hero/20250124172512877_nxoBQR.svg",
      title: "Functional Interior",
      description: "Fully-Equipped Space"
    }
  ];

  const carHotspots = [
    {
      id: 'headlight',
      position: { x: '25%', y: '35%' },
      title: 'LED Headlights',
      description: 'Advanced LED lighting technology for better visibility and energy efficiency'
    },
    {
      id: 'grille',
      position: { x: '50%', y: '30%' },
      title: 'Signature Grille',
      description: 'Distinctive front grille design that defines the TIVOLI character'
    },
    {
      id: 'wheels',
      position: { x: '20%', y: '70%' },
      title: 'Alloy Wheels',
      description: 'Stylish multi-spoke alloy wheels for enhanced performance and aesthetics'
    },
    {
      id: 'roof',
      position: { x: '50%', y: '20%' },
      title: 'Roof Rails',
      description: 'Functional roof rail system'
    }
  ];

  // Hotspot content function for sidebar
  const getHotspotContent = (hotspotId: string) => {
    const hotspot = carHotspots.find(h => h.id === hotspotId);
    if (!hotspot) return null;

    return {
      title: hotspot.title,
      subtitle: hotspot.description,
      images: [
        `/assets/Modelspage/Tivoli/section2/buttonsfront/${hotspotId}1.jpg`,
        `/assets/Modelspage/Tivoli/section2/buttonsfront/${hotspotId}2.jpg`,
        `/assets/Modelspage/Tivoli/section2/buttonsfront/${hotspotId}3.jpg`
      ],
      texts: [
        `Discover the advanced technology behind the ${hotspot.title.toLowerCase()}.`,
        `Experience the precision engineering that makes ${hotspot.title.toLowerCase()} exceptional.`,
        `Learn about the innovative design features of the ${hotspot.title.toLowerCase()}.`
      ]
    };
  };

  const carColors = [
    {
      id: 0,
      name: 'Grand White',
      oneTone: 'https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/Tivoli/section3/rgb(255%20255%20255%20%20var(--tw-text-opacity,%201)%201%20tone.jpg',
      twoTone: 'https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/Tivoli/section3/rgb(255%20255%20255%20%20var(--tw-text-opacity,%201)2%20tones.jpg',
      colorSwatch: '#FFFFFF',
      hasTwoTones: true,
      vrImages: {
        oneTone: Array.from({ length: 36 }, (_, i) => `/assets/Modelspage/Tivoli/vr360/white-1tone/${String(i + 1).padStart(2, '0')}.png`),
        twoTone: Array.from({ length: 36 }, (_, i) => `/assets/Modelspage/Tivoli/vr360/white-2tone/${String(i + 1).padStart(2, '0')}.png`)
      }
    },
    {
      id: 1,
      name: 'Latte Greige',
      oneTone: 'https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/Tivoli/section3/rgb(212,%20196,%20168)%20one%20tone.jpg',
      twoTone: 'https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/Tivoli/section3/rgb(212,%20196,%20168)%20one%20tone.jpg',
      colorSwatch: '#D4C4A8',
      hasTwoTones: false,
      vrImages: {
        oneTone: Array.from({ length: 36 }, (_, i) => `/assets/Modelspage/Tivoli/vr360/greige-1tone/${String(i + 1).padStart(2, '0')}.png`),
        twoTone: Array.from({ length: 36 }, (_, i) => `/assets/Modelspage/Tivoli/vr360/greige-1tone/${String(i + 1).padStart(2, '0')}.png`)
      }
    },
    {
      id: 2,
      name: 'Iron Metal',
      oneTone: 'https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/Tivoli/section3/rgb(107,%20107,%20107)%201%20tone.jpg',
      twoTone: 'https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/Tivoli/section3/rgb(107,%20107,%20107)%201%20tone.jpg',
      colorSwatch: '#6B6B6B',
      hasTwoTones: false,
      vrImages: {
        oneTone: Array.from({ length: 36 }, (_, i) => `/assets/Modelspage/Tivoli/vr360/iron-metal-1tone/${String(i + 1).padStart(2, '0')}.png`),
        twoTone: Array.from({ length: 36 }, (_, i) => `/assets/Modelspage/Tivoli/vr360/iron-metal-1tone/${String(i + 1).padStart(2, '0')}.png`)
      }
    },
    {
      id: 3,
      name: 'Midnight Black',
      oneTone: 'https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/Tivoli/section3/rgb(26,%2026,%2026)%201%20tonr.jpg',
      twoTone: 'https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/Tivoli/section3/rgb(26,%2026,%2026)%202%20tons.jpg',
      colorSwatch: '#1A1A1A',
      hasTwoTones: true,
      vrImages: {
        oneTone: Array.from({ length: 36 }, (_, i) => `/assets/Modelspage/Tivoli/vr360/black-1tone/${String(i + 1).padStart(2, '0')}.png`),
        twoTone: Array.from({ length: 36 }, (_, i) => `/assets/Modelspage/Tivoli/vr360/black-2tone/${String(i + 1).padStart(2, '0')}.png`)
      }
    },
    {
      id: 4,
      name: 'Ocean Blue',
      oneTone: 'https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/Tivoli/section3/rgb(46,%2091,%20138)%201%20tonr.jpg',
      twoTone: 'https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/Tivoli/section3/rgb(46,%2091,%20138)%202%20tons.jpg',
      colorSwatch: '#2E5B8A',
      hasTwoTones: true,
      vrImages: {
        oneTone: Array.from({ length: 36 }, (_, i) => `/assets/Modelspage/Tivoli/vr360/blue-1tone/${String(i + 1).padStart(2, '0')}.png`),
        twoTone: Array.from({ length: 36 }, (_, i) => `/assets/Modelspage/Tivoli/vr360/blue-2tone/${String(i + 1).padStart(2, '0')}.png`)
      }
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative h-screen overflow-hidden">
        <div className="absolute inset-0 z-0">
          <video
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover"
            onLoadedData={() => setIsVideoLoaded(true)}
          >
            <source src="https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/Tivoli/hero/20250124172534178_WKhl8n.mp4" type="video/mp4" />
            <Image
              src="https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/Tivoli/20250123100604289_9mmu8c.png"
              alt="TIVOLI"
              fill
              className="object-cover"
            />
          </video>
          
          {/* Orange/red glow overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-kgm-amber/10 via-transparent to-transparent" />
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-3/4 h-1/2 bg-gradient-to-t from-kgm-amber/40 via-kgm-amber/20 to-transparent rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 h-full flex flex-col">
          <div className="flex-1"></div> {/* Spacer */}
          <div className="flex justify-center lg:justify-start px-8 sm:px-12 lg:px-16 pb-16">
            <motion.div className="max-w-2xl">
              <motion.h1 
                className="text-4xl lg:text-5xl font-bold uppercase tracking-tight mb-4"
                style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)' }}
              >
                TIVOLI
              </motion.h1>
              <motion.p 
                className="text-lg lg:text-xl text-white mb-8 font-light"
                style={{ fontSize: 'clamp(1rem, 2vw, 1.5rem)' }}
              >
                My 1st SUV
              </motion.p>
              <motion.div className="flex flex-col sm:flex-row gap-4">
                <motion.button 
                  className="px-6 py-3 bg-kgm-amber/90 border border-kgm-amber text-white font-semibold uppercase tracking-wide hover:bg-kgm-amber transition-all duration-300 rounded-sm text-sm"
                  style={{ minWidth: '120px' }}
                >
                  CATALOG
                </motion.button>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Feature Boxes */}
        <motion.div className="absolute bottom-8 right-8 z-20 hidden lg:block">
          <div className="flex gap-4">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="bg-gray-900/90 backdrop-blur-sm border border-kgm-amber/40 p-4 rounded-lg"
                style={{ minWidth: '160px', maxWidth: '180px' }}
              >
                <div className="text-white mb-2">
                  <Image
                    src={feature.icon}
                    alt={feature.title}
                    width={24}
                    height={24}
                    className="w-6 h-6"
                  />
                </div>
                <h3 className="text-white font-bold text-sm mb-1">{feature.title}</h3>
                <p className="text-white/80 text-xs leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Second Section - Video with Scroll Animation */}
      <section ref={section2Ref} className="relative h-screen bg-black overflow-hidden z-20">
        <div className="absolute inset-0 bg-black z-0"></div>
        <div className="relative w-full h-full flex items-center justify-center z-10">
          <motion.video
            autoPlay
            muted
            loop
            playsInline
            className="object-cover"
            style={{ width: videoWidth, height: videoHeight }}
          >
            <source src="https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/Tivoli/section1/20250124173106718_kZQegv.mp4" type="video/mp4" />
          </motion.video>
        </div>
        
        <motion.div 
          className="absolute inset-0 flex items-center justify-center z-10"
          style={{ opacity: textOpacity }}
        >
          <motion.h2 
            className="text-white font-bold uppercase text-center px-8"
            style={{ 
              fontSize: textSize, 
              lineHeight: textLineHeight,
              textShadow: '2px 2px 4px rgba(0,0,0,0.8)'
            }}
          >
            CONFIDENT, YOUTHFUL AND SAVVY
          </motion.h2>
        </motion.div>

        {/* Scroll to Top Button */}
        <motion.button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="absolute bottom-8 right-8 bg-kgm-amber hover:bg-kgm-amber/80 text-white px-4 py-2 rounded-full transition-colors duration-300 z-20"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </motion.button>
      </section>

      {/* Exterior Section */}
      <section className="relative h-screen bg-gradient-to-b from-black via-gray-900 to-black overflow-hidden">
        {/* Header */}
        <div className="relative z-10 pt-16 pb-8">
          <div className="text-center mb-8">
            <h2 className="text-4xl lg:text-6xl font-bold text-white mb-4">EXTERIOR</h2>
            <p className="text-lg lg:text-xl text-gray-300">SPIRIT & HERITAGE OF KGM</p>
          </div>
          
          {/* View Selector */}
          <div className="flex justify-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="flex bg-white/10 backdrop-blur-sm rounded-full p-1"
            >
              <button
                onClick={() => setCarView('front')}
                className={`px-6 py-3 rounded-full flex items-center gap-2 transition-all duration-300 ${
                  carView === 'front'
                    ? 'bg-white text-black'
                    : 'text-white hover:bg-white/20'
                }`}
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                </svg>
                Front
              </button>
              <button
                onClick={() => setCarView('rear')}
                className={`px-6 py-3 rounded-full flex items-center gap-2 transition-all duration-300 ${
                  carView === 'rear'
                    ? 'bg-white text-black'
                    : 'text-white hover:bg-white/20'
                }`}
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                </svg>
                Rear
              </button>
            </motion.div>
          </div>
        </div>

        {/* Car Display */}
        <div className="relative z-10 flex-1 flex items-center justify-center mt-8">
          <motion.div
            key={carView}
            initial={{ opacity: 1, scale: 1 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0 }}
            className="relative w-full h-96 flex items-center justify-center"
          >
            <Image
              src={carView === 'front' 
                ? "https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/Tivoli/section2/20250124173659358_ic6XYX.png"
                : "https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/Tivoli/section2/20250210191434311_hHUcwZ.png"
              }
              alt={`TIVOLI ${carView} view`}
              fill
              className="object-cover w-full h-full"
              style={{ 
                backgroundColor: 'transparent',
                mixBlendMode: 'normal'
              }}
            />

            {/* Interactive Hotspots */}
            {carView === 'front' && carHotspots.map((hotspot) => (
              <motion.button
                key={hotspot.id}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                className="absolute w-8 h-8 bg-kgm-amber rounded-full flex items-center justify-center text-black font-bold text-lg shadow-lg hover:bg-kgm-amber/80 transition-all duration-300"
                style={{
                  left: hotspot.position.x,
                  top: hotspot.position.y,
                  transform: 'translate(-50%, -50%)'
                }}
                onClick={() => openSidebar(hotspot.id)}
              >
                +
              </motion.button>
            ))}

            {/* Hotspot Info Panel */}
            {activeHotspot && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="absolute top-4 right-4 bg-black/80 backdrop-blur-sm rounded-lg p-4 max-w-xs"
              >
                <h4 className="text-kgm-amber font-bold text-lg mb-2">
                  {carHotspots.find(h => h.id === activeHotspot)?.title}
                </h4>
                <p className="text-white text-sm">
                  {carHotspots.find(h => h.id === activeHotspot)?.description}
                </p>
                <button
                  onClick={() => setActiveHotspot(null)}
                  className="absolute top-2 right-2 text-white/60 hover:text-white"
                >
                  ×
                </button>
              </motion.div>
            )}
          </motion.div>
        </div>

        {/* Car Feature Sidebar */}
        <CarFeatureSidebar
          isOpen={isSideMenuOpen && !!selectedHotspot}
          onClose={closeSidebar}
          selectedHotspot={selectedHotspot}
          getHotspotContent={() => selectedHotspot ? getHotspotContent(selectedHotspot) : null}
          currentHotspotImage={currentHotspotImage}
          setCurrentHotspotImage={setCurrentHotspotImage}
        />
      </section>

      {/* Color Configurator Section */}
      <section className="relative h-screen bg-gradient-to-b from-gray-100 via-white to-gray-200 overflow-hidden">
        {/* Background Image / 360 VR */}
        <div className="absolute inset-0 z-0 flex items-center justify-center">
          {viewMode === 'color' ? (
            <motion.div
              key={`bg-${selectedColor}-${toneMode}`}
              initial={{ opacity: 1 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0 }}
            >
              <Image
                src={toneMode === '1 TONE' ? carColors[selectedColor].oneTone : carColors[selectedColor].twoTone}
                alt={`TIVOLI in ${carColors[selectedColor].name} - ${toneMode}`}
                fill
                className="object-cover w-full h-full"
                priority
                style={{ 
                  backgroundColor: 'transparent',
                  mixBlendMode: 'normal'
                }}
              />
            </motion.div>
          ) : (
            <Vr360 
              className="w-full h-full" 
              images={carColors[selectedColor].vrImages[toneMode === '1 TONE' ? 'oneTone' : 'twoTone']}
            />
          )}
        </div>

        {/* Top Navigation */}
        <div className="relative z-10 pt-8 flex justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex bg-white/20 backdrop-blur-sm rounded-full p-1"
          >
            <button
              onClick={() => setViewMode('color')}
              className={`px-6 py-3 rounded-full flex items-center gap-2 transition-all duration-300 ${
                viewMode === 'color'
                  ? 'bg-blue-600 text-white'
                  : 'text-white hover:bg-white/20'
              }`}
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
              </svg>
              Color Board
            </button>
            <button
              onClick={() => setViewMode('vr')}
              className={`px-6 py-3 rounded-full flex items-center gap-2 transition-all duration-300 ${
                viewMode === 'vr'
                  ? 'bg-blue-600 text-white'
                  : 'text-white hover:bg-white/20'
              }`}
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
              360° VR
            </button>
          </motion.div>
        </div>

        {/* Car Display Area */}
        <div className="relative z-10 flex-1 flex items-center justify-center mt-8">
          {viewMode === 'color' ? (
            <motion.div
              key={`${selectedColor}-${toneMode}`}
              initial={{ opacity: 1, scale: 1 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0 }}
              className="relative w-full h-96 flex items-center justify-center"
            >
              <Image
                src={toneMode === '1 TONE' ? carColors[selectedColor].oneTone : carColors[selectedColor].twoTone}
                alt={`TIVOLI in ${carColors[selectedColor].name} - ${toneMode}`}
                fill
                className="object-cover w-full h-full"
                style={{ 
                  backgroundColor: 'transparent',
                  mixBlendMode: 'normal'
                }}
              />
            </motion.div>
          ) : null}
        </div>

        {/* Color Selection Panel */}
        {viewMode === 'color' && (
          <div className="absolute bottom-0 left-0 right-0 z-20 p-8">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 max-w-4xl mx-auto shadow-2xl"
            >
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-800">
                  {carColors[selectedColor].name}
                </h3>
              </div>

              {/* Color Swatches */}
              <div className="flex justify-center gap-4 mb-6">
                {carColors.map((color) => (
                  <motion.button
                    key={color.id}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleColorSelection(color.id)}
                    className={`rounded-full border-2 transition-all duration-300 ${
                      selectedColor === color.id
                        ? 'border-gray-800 scale-110'
                        : 'border-gray-300 hover:border-gray-500'
                    }`}
                    style={{ 
                      backgroundColor: color.colorSwatch,
                      width: '24px',
                      height: '24px'
                    }}
                  >
                    {selectedColor === color.id && (
                      <div className="w-full h-full rounded-full flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                        </svg>
                      </div>
                    )}
                  </motion.button>
                ))}
              </div>

              {/* Tone Options */}
              {carColors[selectedColor].hasTwoTones && (
                <div className="flex justify-center gap-8">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="tone"
                      value="1 TONE"
                      checked={toneMode === '1 TONE'}
                      onChange={(e) => setToneMode(e.target.value as '1 TONE' | '2 TONE')}
                      className="w-4 h-4 text-blue-600"
                    />
                    <span className="text-gray-700 font-medium">1 TONE</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="tone"
                      value="2 TONE"
                      checked={toneMode === '2 TONE'}
                      onChange={(e) => setToneMode(e.target.value as '1 TONE' | '2 TONE')}
                      className="w-4 h-4 text-blue-600"
                    />
                    <span className="text-gray-700 font-medium">2 TONE</span>
                  </label>
                </div>
              )}
            </motion.div>

            {/* Disclaimer */}
            <div className="text-center mt-4">
              <p className="text-gray-600 text-sm">
                * Images of this vehicle are for reference only and may differ from the actual product.
              </p>
              <p className="text-gray-600 text-sm">
                * Each color is arranged from left to right in order of customer preference.
              </p>
            </div>
          </div>
        )}

        {/* Scroll to Top Button */}
        <motion.button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="absolute bottom-8 right-8 bg-kgm-amber hover:bg-kgm-amber/80 text-white px-4 py-2 rounded-full transition-colors duration-300 z-20"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </motion.button>
      </section>

      <Footer />
    </div>
  );
};

export default TivoliPage;
