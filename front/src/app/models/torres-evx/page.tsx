'use client';

import { useState, useEffect, useLayoutEffect, useRef, useCallback } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useLanguage } from '@/contexts/LanguageContext';
import CarFeatureSidebar from '@/components/CarFeatureSidebar';
import { useCarFeatureSidebar } from '@/hooks/useCarFeatureSidebar';
import CarouselNavigation from '@/components/CarouselNavigation';
import SousSlider from '@/components/SousSlider';
import ToggleButton from '@/components/ToggleButton';
import React from 'react';
import SEO from '@/components/SEO';

const TorresPage = () => {
  const { language } = useLanguage();
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isSecondSectionVisible, setIsSecondSectionVisible] = useState(false);
  const [activeHotspot, setActiveHotspot] = useState<string | null>(null);
  
  // Sidebar functionality
  const {
    isSideMenuOpen,
    selectedHotspot,
    currentHotspotImage,
    setCurrentHotspotImage,
    openSidebar,
    closeSidebar
  } = useCarFeatureSidebar();
  
  // Interior sidebar state
  const [isInteriorSideMenuOpen, setIsInteriorSideMenuOpen] = useState(false);
  const [selectedInteriorHotspot, setSelectedInteriorHotspot] = useState<string | null>(null);
  const [currentInteriorHotspotImage, setCurrentInteriorHotspotImage] = useState(0);
  
  const [viewMode, setViewMode] = useState<'color' | 'vr'>('color');
  const [selectedColor, setSelectedColor] = useState(0);
  const [toneMode, setToneMode] = useState<'1 TONE' | '2 TONE'>('2 TONE');
  // 360° VR Rotation System - Instant Updates Configuration
  const SENSITIVITY = 2.0; // Higher sensitivity for more responsive rotation
  const DEADZONE_PIXELS = 1; // Minimum drag distance before rotation starts
  const FRAME_COUNT = 36; // Total number of rotation frames
  
  const [currentFrame, setCurrentFrame] = useState(0);
  const [targetFrame, setTargetFrame] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const currentFrameRef = useRef(0);
  const [dragStart, setDragStart] = useState(0);
  const [lastDragTime, setLastDragTime] = useState(0);
  const [lastDragX, setLastDragX] = useState(0);
  const [currentSafetyCard, setCurrentSafetyCard] = useState(0);
  const [playingVideo, setPlayingVideo] = useState<string | null>(null);
  const [videoPlaying, setVideoPlaying] = useState<boolean>(false);
  const [currentConvenienceCard, setCurrentConvenienceCard] = useState(0);
  const [isSeatingCarouselOpen, setIsSeatingCarouselOpen] = useState(false);
  const [isMoreFeaturesOpen, setIsMoreFeaturesOpen] = useState(false);
  const [isChargingCarouselOpen, setIsChargingCarouselOpen] = useState(false);
  const [currentPerformanceCard, setCurrentPerformanceCard] = useState(0);
  const [isBSDCarouselOpen, setIsBSDCarouselOpen] = useState(false);
  const [isAEBCarouselOpen, setIsAEBCarouselOpen] = useState(false);
  const [isESCCarouselOpen, setIsESCCarouselOpen] = useState(false);
  const [isEnhancedSafetyCarouselOpen, setIsEnhancedSafetyCarouselOpen] = useState(false);
  const [currentSpecImage, setCurrentSpecImage] = useState(0);
  const [activeAccordion, setActiveAccordion] = useState(3); // TYRE INFORMATION is open by default
  const [activeAccessoryTab, setActiveAccessoryTab] = useState<'exterior' | 'interior'>('exterior');
  const [viewAngle, setViewAngle] = useState<'front' | 'rear'>('front');
  const [activeSpecificationAccordion, setActiveSpecificationAccordion] = useState<number | null>(3); // TYRE INFORMATION is open by default
  const [isMobile, setIsMobile] = useState(false);
  const section2Ref = useRef<HTMLDivElement>(null);
  const section4Ref = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: section2Ref,
    offset: ["start end", "end start"]
  });
  const { scrollYProgress: section4ScrollProgress } = useScroll({
    target: section4Ref,
    offset: ["start end", "end start"]
  });
  

  // Transform values for scroll animations
  const videoWidth = useTransform(scrollYProgress, [0, 0.5, 1], ["30%", "70%", "100%"]);
  const videoHeight = useTransform(scrollYProgress, [0, 0.5, 1], ["auto", "80%", "100%"]);
  const textSize = useTransform(scrollYProgress, [0, 0.5, 1], ["clamp(2rem, 6vw, 4rem)", "clamp(1.8rem, 5vw, 3rem)", "clamp(1.5rem, 4vw, 2.5rem)"]);
  
  // Transform values for section 4 (Driver-Centric Cockpit)
  const section4VideoWidth = useTransform(section4ScrollProgress, [0, 0.15, 0.3, 0.45, 0.6, 1], ["30%", "50%", "70%", "100%", "100%", "100%"]);
  const section4TextScale = useTransform(section4ScrollProgress, [0, 0.2, 0.4, 0.5, 0.6, 1], [0, 0.2, 0.5, 0.8, 1, 1]);
  const section4TextOpacity = useTransform(section4ScrollProgress, [0, 0.2, 0.4, 0.5, 0.6, 1], [0, 0, 0.3, 0.7, 1, 1]);
  const section4Sticky = useTransform(section4ScrollProgress, [0, 0.1, 0.9, 1], [0, 1, 1, 0]);
  
  
  const textLineHeight = useTransform(scrollYProgress, [0, 0.5, 1], [1.2, 1.3, 1.4]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [1, 1, 0.9, 0.8]);
  const textY = useTransform(scrollYProgress, [0, 0.5, 1], [0, 0, 0]);

  // Mobile detection for responsive design - use useLayoutEffect for immediate check
  useLayoutEffect(() => {
    const checkMobile = () => {
      if (typeof window !== 'undefined') {
        setIsMobile(window.innerWidth < 768);
      }
    };
    
    // Check immediately on mount (synchronous, before paint)
    checkMobile();
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', checkMobile);
      return () => window.removeEventListener('resize', checkMobile);
    }
  }, []);

  // Interior scrollytelling wave: base pinned, others slide up
  // Each slide arrives from bottom, stays pinned for a plateau, then hands off to next
  


  const features = [
    {
      icon: "https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/TORRES-EVX/hero/20250203170922234_j0eplK.svg",
      title: language === 'fr' ? 'Extérieur Unique' : 'Unique Exterior',
      description: language === 'fr' ? 'Design distinctif qui se démarque de la foule' : 'Distinctive design that stands out from the crowd'
    },
    {
      icon: "https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/TORRES-EVX/hero/20250203170939780_s8n76l.svg",
      title: language === 'fr' ? 'Intérieur Raffiné' : 'Finest Interior',
      description: language === 'fr' ? 'Matériaux premium et savoir-faire artisanal' : 'Premium materials and craftsmanship throughout'
    },
    {
      icon: "https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/TORRES-EVX/hero/20250203170956683_p164k1.svg",
      title: language === 'fr' ? 'Intelligent & Pratique' : 'Smart & Convenient',
      description: language === 'fr' ? 'Technologie avancée pour une expérience de conduite améliorée' : 'Advanced technology for enhanced driving experience'
    }
  ];

  // Safety features data
  const safetyFeatures = [
    {
      id: 0,
      title: language === 'fr' ? 'Sécurité Complète' : 'Comprehensive Safety',
      subtitle: language === 'fr' ? "Protection BSD 4 angles" : "4-corner BSD protection",
      description: language === 'fr' ? 'Systèmes de sécurité avancés incluant la détection d\'angle mort 4 angles pour une protection complète' : 'Advanced safety systems including 4-corner Blind Spot Detection for complete protection',
      image: "https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/TORRES-EVX/features/card1/card8_wireless_charger.jpg",
      bgColor: "bg-gray-800",
      textColor: "text-white",
      subtitleColor: "text-white",
      hasOpenButton: true
    },
    {
      id: 1,
      title: language === 'fr' ? "Système ADAS" : "ADAS System",
      subtitle: language === 'fr' ? "L'ALC change automatiquement de voie sur l'autoroute." : "Automatic Lane Change (ALC)",
      description: language === 'fr' ? "L'ALC basé sur la navigation change automatiquement de voie sur l'autoroute. Le véhicule se dirigera dans la direction activée par le clignotant." : "Navigation-based ALC automatically changes lanes on the highway or motorway. The vehicle will steer into the direction activated by the turn signal.",
      image: "https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/TORRES-EVX/features/card2/20250204084257164_CFTWli.jpg",
      video: "https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/TORRES-EVX/features/card2/20250204084257440_4TVbTO.mp4",
      bgColor: "bg-gray-800",
      textColor: "text-white",
      subtitleColor: "text-white",
      hasOpenButton: false
    },
    {
      id: 2,
      title: language === 'fr' ? "Système ADAS" : "ADAS System",
      subtitle: language === 'fr' ? "Régulateur de Vitesse Adaptatif Intelligent (ACC & SSA)" : "Intelligent Adaptive Cruise Control (ACC & SSA)",
      description: language === 'fr' ? "L'ACC et le SSA aident à maintenir une distance de sécurité avec le véhicule devant basée sur la vitesse définie (lors de l'accélération, de la décélération, de l'arrêt et du démarrage) et assistent la conduite à une vitesse sûre." : "ACC & SSA helps maintain a safe distance from the vehicle ahead based on the set speed (when accelerating, decelerating, stopping, and starting) and assists driving at a safe speed.",
      image: "https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/TORRES-EVX/features/card3/20250204084434313_8Wsz6H.jpg",
      video: "https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/TORRES-EVX/features/card3/20250206110822416_SbsUIL.mp4",
      bgColor: "bg-gray-800",
      textColor: "text-white",
      subtitleColor: "text-white",
      hasOpenButton: false
    },
    {
      id: 3,
      title: language === 'fr' ? "Système ADAS" : "ADAS System",
      subtitle: language === 'fr' ? "Freinage d'Urgence Autonome (AEB)" : "Autonomous Emergency Braking (AEB)",
      description: language === 'fr' ? "L'AEB avertit le conducteur d'une collision frontale potentielle pendant la conduite et active automatiquement les freins pour éviter un accident." : "AEB warns the driver of a potential frontal collision while driving and automatically activates the brakes to prevent an accident.",
      image: "https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/TORRES-EVX/features/card4/20250204084611032_VUMXSR.jpg",
      video: "https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/TORRES-EVX/features/card4/20250204084611244_qA6f60.mp4",
      bgColor: "bg-gray-800",
      textColor: "text-white",
      subtitleColor: "text-white",
      hasOpenButton: true
    },
    {
      id: 4,
      title: language === 'fr' ? 'Assistance aux Panneaux de Signalisation' : 'Traffic Sign Assist',
      subtitle: language === 'fr' ? 'TSA' : 'TSA',
      description: language === 'fr' ? 'Système de reconnaissance de panneaux de signalisation avancé qui aide les conducteurs à rester informés des limites de vitesse et des conditions routières.' : 'Advanced traffic sign recognition system that helps drivers stay informed about speed limits and road conditions.',
      image: "https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/TORRES-EVX/features/card5/20250204085107026_4If5UD.jpg",
      video: "https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/TORRES-EVX/features/card5/20250204085107236_6aSw8D.mp4",
      bgColor: "bg-gray-800",
      textColor: "text-white",
      subtitleColor: "text-white",
      hasOpenButton: false
    },
    {
      id: 5,
      title: language === 'fr' ? 'Contrôle de Stabilité Électronique' : 'Electronic Stability Control',
      subtitle: language === 'fr' ? 'ESC' : 'ESC',
      description: language === 'fr' ? 'Système de contrôle de stabilité avancé qui aide à prévenir la perte de contrôle en appliquant automatiquement les freins aux roues individuelles.' : 'Advanced stability control system that helps prevent loss of control by automatically applying brakes to individual wheels.',
      image: "https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/TORRES-EVX/features/card6/20250204085240649_bPuWD1.jpg",
      bgColor: "bg-gray-800",
      textColor: "text-white",
      subtitleColor: "text-white",
      hasOpenButton: true
    },
    {
      id: 6,
      title: language === 'fr' ? 'Frein Multi-Collision' : 'Multi-Collision Brake',
      subtitle: language === 'fr' ? 'MCB' : 'MCB',
      description: language === 'fr' ? 'Système de freinage automatique qui aide à prévenir les collisions secondaires après un impact initial.' : 'Automatic brake system that helps prevent secondary collisions after an initial impact.',
      image: "https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/TORRES-EVX/features/card7/20250204085558155_cYMqt3.jpg",
      video: "https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/TORRES-EVX/features/card7/20250204085558278_QmiSoP.mp4",
      bgColor: "bg-gray-800",
      textColor: "text-white",
      subtitleColor: "text-white",
      hasOpenButton: false
    },
    {
      id: 7,
      title: language === 'fr' ? 'Carrosserie en Acier Haute Résistance' : 'High-Strength Steel Body',
      subtitle: language === 'fr' ? "81% Acier haute résistance" : "81% High-strength steel",
      description: language === 'fr' ? "En appliquant le processus HPF (Hot Press Forming) avec des plaques d'acier haute résistance (34%) et ultra-haute résistance (47%), la rigidité de la carrosserie et la sécurité des passagers ont été maximisées." : "By applying the HPF (Hot Press Forming) process with high-strength (34%) and ultra-high-strength (47%) steel plates, the rigidity of the body and passenger safety have been maximized.",
      image: "https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/TORRES-EVX/features/card8/20250204085731236_8qu3O4.jpg",
      bgColor: "bg-gray-200",
      textColor: "text-white",
      subtitleColor: "text-white",
      hasOpenButton: false
    },
    {
      id: 8,
      title: language === 'fr' ? 'Système d\'Airbags Complet' : 'Comprehensive Airbag System',
      subtitle: language === 'fr' ? '7 Airbags' : '7 Airbags',
      description: language === 'fr' ? 'Protection complète par airbags incluant les airbags frontaux, latéraux et rideaux pour tous les occupants.' : 'Complete airbag protection including front, side, and curtain airbags for all occupants.',
      image: "https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/TORRES-EVX/features/card9/20250204085905967_QOXyXh.jpg",
      bgColor: "bg-gray-200",
      textColor: "text-white",
      subtitleColor: "text-white",
      hasOpenButton: false
    },
    {
      id: 9,
      title: language === 'fr' ? 'Fonctionnalités de Sécurité Améliorées' : 'Enhanced Safety Features',
      subtitle: language === 'fr' ? 'Protection Avancée' : 'Advanced Protection',
      description: language === 'fr' ? 'Systèmes de sécurité supplémentaires incluant l\'avertissement de sortie de voie, l\'avertissement de collision frontale, et plus encore.' : 'Additional safety systems including lane departure warning, forward collision warning, and more.',
      image: "https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/TORRES-EVX/features/card9/20250204090040955_8Yk0ww.jpg",
      bgColor: "bg-gray-800",
      textColor: "text-white",
      subtitleColor: "text-white",
      hasOpenButton: true
    }
  ];

  // 4-corner BSD Carousel Data
  const bsdCarouselData = React.useMemo(() => [
    {
      id: 0,
      title: language === 'fr' ? 'Traversée de Carrefour' : 'Junction Crossing',
      description: language === 'fr' ? 'Lors de la conduite en ligne droite à un carrefour et avec un véhicule s\'approchant de côté, cette fonction avertira le conducteur et appliquera un freinage d\'urgence pour éviter ou réduire l\'impact de collision.' : 'When driving straight ahead at a junction and with a vehicle approaching from the side, this function will warn the driver and apply emergency braking to avoid or reduce collision impact.',
      video: 'https://en.kg-mobility.com/attached/contents/display/video/2000003000100080004/20250204083935503_mdQpwB.mp4',
      poster: 'https://en.kg-mobility.com/attached/contents/display/video/2000003000100080004/20250204083935386_czQWs1.jpg'
    },
    {
      id: 1,
      title: language === 'fr' ? 'Tournant de Carrefour' : 'Junction Turning',
      description: language === 'fr' ? 'Lors d\'un virage à une intersection et avec un véhicule s\'approchant de la direction opposée, cette fonction avertira le conducteur et appliquera un freinage d\'urgence pour éviter ou réduire l\'impact d\'une collision.' : 'When turning at an intersection and with a vehicle approaching from the opposite direction, this function will warn the driver and apply emergency braking to avoid or reduce the impact of a collision.',
      video: 'https://en.kg-mobility.com/attached/contents/display/video/2000003000100080004/20250204083955718_LTRnPs.mp4',
      poster: 'https://en.kg-mobility.com/attached/contents/display/video/2000003000100080004/20250204083955545_SYnoBY.jpg'
    },
    {
      id: 2,
      title: language === 'fr' ? 'Maintien de Voie d\'Urgence – Dépassement de Trafic' : 'Emergency Lane Keeping – Overtaking Traffic',
      description: language === 'fr' ? 'Assistance à la direction lorsqu\'un risque est détecté depuis un véhicule adjacent lors d\'un dépassement.' : 'Assisting steering when a risk is detected from an adjacent vehicle while overtaking.',
      video: 'https://en.kg-mobility.com/attached/contents/display/video/2000003000100080004/20250204084015429_thiCG3.mp4',
      poster: 'https://en.kg-mobility.com/attached/contents/display/video/2000003000100080004/20250204084015259_DCysX5.jpg'
    },
    {
      id: 3,
      title: language === 'fr' ? 'Maintien de Voie d\'Urgence – Dépassement de Trafic' : 'Emergency Lane Keeping – Overtaking Traffic',
      description: language === 'fr' ? 'Assistance à la direction lorsqu\'un risque est détecté lors d\'un dépassement depuis un véhicule venant en sens inverse.' : 'Assisting steering when a risk is detected during overtaking from an oncoming vehicle.',
      video: 'https://en.kg-mobility.com/attached/contents/display/video/2000003000100080004/20250204084035267_XfjoY5.mp4',
      poster: 'https://en.kg-mobility.com/attached/contents/display/video/2000003000100080004/20250204084035124_g2NMta.jpg'
    },
    {
      id: 4,
      title: language === 'fr' ? 'Maintien de Voie d\'Urgence – Assistance de Direction d\'Urgence' : 'Emergency Lane Keeping – Emergency Steering Assist',
      description: language === 'fr' ? 'Assistance à la direction du véhicule (indépendamment de l\'état de la voie) dans la direction prévue par le conducteur pour éviter un obstacle devant.' : 'Assisting steering the vehicle (irrelevant to lane condition) towards the driver\'s intended direction to avoid an obstacle ahead.',
      video: 'https://en.kg-mobility.com/attached/contents/display/video/2000003000100080004/20250204084056981_eWx3nn.mp4',
      poster: 'https://en.kg-mobility.com/attached/contents/display/video/2000003000100080004/20250204084056813_NRDEAe.jpg'
    }
  ], [language]);

  // AEB Carousel Data for Torres EVX
  const aebCarouselData = React.useMemo(() => [
    {
      id: 0,
      title: language === 'fr' ? 'Avertissement de Sortie de Sécurité (SEW)' : 'Safety Exit Warning (SEW)',
      description: language === 'fr' ? 'Lorsqu\'un conducteur ou un passager tente de sortir du véhicule à l\'arrêt, le SEW alerte le conducteur et les passagers avec des lumières d\'avertissement et des sons.' : 'When a driver or passenger attempts to exit the vehicle when stationary, SEW alerts the driver and passengers with warning lights and sounds.',
      video: 'https://en.kg-mobility.com/attached/contents/display/video/2000003000100080004/20250204084630641_HaWfvH.mp4',
      poster: 'https://en.kg-mobility.com/attached/contents/display/video/2000003000100080004/20250204084630407_d2vQDO.jpg'
    },
    {
      id: 1,
      title: language === 'fr' ? 'Avertissement de Démarrage du Véhicule Avant (FVSW)' : 'Front Vehicle Start Warning (FVSW)',
      description: language === 'fr' ? 'Le FVSW attire l\'attention du conducteur avec une alerte visuelle pop-up et un son audible lorsque le véhicule directement devant s\'éloigne.' : 'FVSW attracts the driver\'s attention with a visual pop-up alert and audible sound when the vehicle directly in front is pulling away.',
      video: 'https://en.kg-mobility.com/attached/contents/display/video/2000003000100080004/20250204084650245_S4P8Te.mp4',
      poster: 'https://en.kg-mobility.com/attached/contents/display/video/2000003000100080004/20250204084650131_yonUbr.jpg'
    },
    {
      id: 2,
      title: language === 'fr' ? 'Avertissement de Distance de Sécurité (SDW)' : 'Safety Distance Warning (SDW)',
      description: language === 'fr' ? 'Le SDW détecte la distance du véhicule qui précède et avertit le conducteur lorsqu\'une distance de sécurité n\'est pas correctement maintenue.' : 'SDW detects the distance from the vehicle ahead and warns the driver when a safe distance is not properly maintained.',
      video: 'https://en.kg-mobility.com/attached/contents/display/video/2000003000100080004/20250204084710563_xIfBTr.mp4',
      poster: 'https://en.kg-mobility.com/attached/contents/display/video/2000003000100080004/20250204084710425_i2iFog.jpg'
    },
    {
      id: 3,
      title: language === 'fr' ? 'Feux de Route Intelligents (SHB)' : 'Smart High Beam (SHB)',
      description: language === 'fr' ? 'Le SHB abaisse automatiquement les feux de route lorsqu\'un véhicule approchant est détecté, rendant la conduite nocturne plus facile et plus sûre.' : 'SHB automatically lowers the high beam when an approaching vehicle is detected, making night-driving easier and safer.',
      video: 'https://en.kg-mobility.com/attached/contents/display/video/2000003000100080004/20250204084731451_OHZlcT.mp4',
      poster: 'https://en.kg-mobility.com/attached/contents/display/video/2000003000100080004/20250204084731302_89ksaP.jpg'
    },
    {
      id: 4,
      title: language === 'fr' ? 'Assistance Intelligente à la Vitesse (ISA)' : 'Intelligent Speed Assist (ISA)',
      description: language === 'fr' ? 'Sur l\'autoroute, l\'ISA permet une conduite sûre en avertissant le conducteur des limites de vitesse.' : 'While driving on the highway, ISA allows for safe driving  by warning speed limits to the driver.',
      video: 'https://en.kg-mobility.com/attached/contents/display/video/2000003000100080004/20250204084751227_6Od3zd.mp4',
      poster: 'https://en.kg-mobility.com/attached/contents/display/video/2000003000100080004/20250204084751038_x0P9on.jpg'
    },
    {
      id: 5,
      title: language === 'fr' ? 'Avertissement de Circulation Transversale Arrière (RCTW) / Assistance de Collision de Circulation Transversale Arrière (RCTA)' : 'Rear Cross Traffic Warning (RCTW) / Rear Cross Traffic Collision Assist (RCTA)',
      description: language === 'fr' ? 'En stationnement ou en marche arrière, le RCTW/RCTA détecte les objets s\'approchant du véhicule et alerte le conducteur d\'une collision potentielle et active le freinage d\'urgence.' : 'While parked or in reverse, RCTW/RCTA detects objects approaching towards the vehicle and alerts the driver of a potential collision and activates emergency braking.',
      video: 'https://en.kg-mobility.com/attached/contents/display/video/2000003000100080004/20250204084810270_sS0lcZ.mp4',
      poster: 'https://en.kg-mobility.com/attached/contents/display/video/2000003000100080004/20250204084810063_sMpD8s.jpg'
    },
    {
      id: 6,
      title: language === 'fr' ? 'Détection d\'Avertissement d\'Angle Mort (BSW) / Assistance de Collision d\'Angle Mort (BSA)' : 'Blind Spot Detection Warning (BSW) / Blind Spot Collision Assist (BSA)',
      description: language === 'fr' ? 'Le BSW/BSA assiste automatiquement le freinage lorsque le conducteur change de voie et que le système détecte un risque de collision avec des véhicules dans l\'angle mort.' : 'BSW/BSA automatically assists braking when the driver changes lanes and the system detects a risk of collision with vehicles in the blind spot.',
      video: 'https://en.kg-mobility.com/attached/contents/display/video/2000003000100080004/20250204084829917_sr4vtJ.mp4',
      poster: 'https://en.kg-mobility.com/attached/contents/display/video/2000003000100080004/20250204084829738_OTJlde.jpg'
    },
    {
      id: 7,
      title: language === 'fr' ? 'Avertissement d\'Attention de Somnolence du Conducteur (DDAW)' : 'Driver Drowsiness Attention Warning (DDAW)',
      description: language === 'fr' ? 'Si le système DDAW détecte que le niveau d\'attention du conducteur a considérablement diminué, il émettra un avertissement sonore et affichera un graphique sur le tableau de bord.' : 'If the DDAW system senses that the driver\'s attention level has significantly reduced, it will sound an audible warning and display a graphic on the instrument cluster.',
      video: 'https://en.kg-mobility.com/attached/contents/display/video/2000003000100080004/20250204084850472_jl6ePW.mp4',
      poster: 'https://en.kg-mobility.com/attached/contents/display/video/2000003000100080004/20250204084850270_1QIhWi.jpg'
    },
    {
      id: 8,
      title: language === 'fr' ? 'Avertissement de Départ de Voie (LDW) / Assistance de Centrage de Maintien de Voie (CLKA)' : 'Lane Departure Warning (LDW) / Centering Lane Keeping Assist (CLKA)',
      description: language === 'fr' ? 'Le LDW/CLKA utilise une caméra avant pour surveiller les marqueurs de voie peints sur la route. Il corrige automatiquement la direction assistée électrique pour maintenir le véhicule dans la voie prévue.' : 'LDW/CLKA uses a front camera to monitor the painted lane markers on the road. It automatically corrects the electric power steering to keep the vehicle within the intended lane.',
      video: 'https://en.kg-mobility.com/attached/contents/display/video/2000003000100080004/20250204084909946_4MTnrY.mp4',
      poster: 'https://en.kg-mobility.com/attached/contents/display/video/2000003000100080004/20250204084909810_dN185m.jpg'
    },
    {
      id: 9,
      title: language === 'fr' ? 'Avertissement de Collision par l\'Arrière (RCW)' : 'Rear-end Collision Warning (RCW)',
      description: language === 'fr' ? 'Le RCW alerte le conducteur avec des avertissements visuels et sonores si une collision potentielle avec un véhicule s\'approchant de l\'arrière est détectée lors d\'un arrêt ou d\'une conduite à basse vitesse.' : 'RCW alerts the driver with visual and audible warnings if a potential collision with an approaching vehicle from the rear is detected while stopped or driving at low speeds.',
      video: 'https://en.kg-mobility.com/attached/contents/display/video/2000003000100080004/20250204084929330_MHfp0u.mp4',
      poster: 'https://en.kg-mobility.com/attached/contents/display/video/2000003000100080004/20250204084929131_ro3wJ3.jpg'
    }
  ], [language]);

  // ESC Carousel Data for Torres EVX
  const escCarouselData = React.useMemo(() => [
    {
      id: 0,
      title: language === 'fr' ? 'Contrôle de Descente de Colline (HDC)' : 'Hill Descent Control (HDC)',
      description: language === 'fr' ? 'Lors de la descente d\'une pente à basse vitesse, le HDC applique automatiquement les freins pour maintenir une vitesse constante sans le contrôle du conducteur.' : 'When descending a slope at a low speed, HDC automatically applies the brakes to maintain a constant speed without the driver\'s control.',
      video: 'https://en.kg-mobility.com/attached/contents/display/video/2000003000100080004/20250204085300809_9f85yN.mp4',
      poster: 'https://en.kg-mobility.com/attached/contents/display/video/2000003000100080004/20250204085300659_nQW1lD.jpg'
    },
    {
      id: 1,
      title: language === 'fr' ? 'Système d\'Assistance au Freinage (BAS)' : 'Brake Assist System (BAS)',
      description: language === 'fr' ? 'Le BAS applique une force maximale sur les freins lorsque le conducteur panique et qu\'un freinage soudain est détecté, réduisant considérablement la distance de freinage dans les situations d\'urgence.' : 'BAS applies maximum force onto the brakes when the driver panics and sudden braking is detected, significantly reducing braking distance in emergencies.',
      video: 'https://en.kg-mobility.com/attached/contents/display/video/2000003000100080004/20250204085320432_tSrL41.mp4',
      poster: 'https://en.kg-mobility.com/attached/contents/display/video/2000003000100080004/20250204085320265_gqLK7J.jpg'
    },
    {
      id: 2,
      title: language === 'fr' ? 'Protection Active contre le Renversement (ARP)' : 'Active Roll-over Protection (ARP)',
      description: language === 'fr' ? 'L\'ARP aide à maintenir une posture stable du véhicule en priorisant le contrôle du système lorsque les conditions de conduite deviennent très instables.' : 'ARP assists in maintaining a stable vehicle posture by prioritizing system control when driving conditions become highly unstable.',
      video: 'https://en.kg-mobility.com/attached/contents/display/video/2000003000100080004/20250204085340012_Jx6Sz0.mp4',
      poster: 'https://en.kg-mobility.com/attached/contents/display/video/2000003000100080004/20250204085339772_IFeVRf.jpg'
    },
    {
      id: 3,
      title: language === 'fr' ? 'Assistance au Démarrage en Côte (HSA)' : 'Hill Start Assist (HSA)',
      description: language === 'fr' ? 'Le HSA aide à prévenir le recul lorsque le conducteur relâche la pédale de frein sur une pente et que le véhicule commence à se déplacer le long d\'une inclinaison en maintenant un certain niveau de pression de frein pendant 2~3 secondes.' : 'HSA helps prevent roll-back when the driver releases the brake pedal on a slope and the vehicle begins to travel along an incline by maintaining a certain level of brake pressure for 2~3 seconds.',
      video: 'https://en.kg-mobility.com/attached/contents/display/video/2000003000100080004/20250204085358669_IUi0Cq.mp4',
      poster: 'https://en.kg-mobility.com/attached/contents/display/video/2000003000100080004/20250204085358493_q93naa.jpg'
    },
    {
      id: 4,
      title: language === 'fr' ? 'Signal d\'Arrêt d\'Urgence (ESS)' : 'Emergency Stop Signal (ESS)',
      description: language === 'fr' ? 'L\'ESS fait clignoter les feux de freinage ou les feux de détresse pour avertir les conducteurs qui suivent lorsqu\'un freinage soudain se produit ou lorsque l\'ABS est activé.' : 'ESS flashes the brake lights or hazard lights to warn trailing drivers when suddenly braking or when ABS is activated.',
      video: 'https://en.kg-mobility.com/attached/contents/display/video/2000003000100080004/20250204085418957_ljetmP.mp4',
      poster: 'https://en.kg-mobility.com/attached/contents/display/video/2000003000100080004/20250204085418838_vDY0tO.jpg'
    }
  ], [language]);

  // Enhanced Safety Features Carousel Data for Torres EVX
  const enhancedSafetyCarouselData = React.useMemo(() => [
    {
      id: 0,
      title: language === 'fr' ? 'Système d\'Alerte Acoustique Véhicule (AVAS)' : 'Acoustic Vehicle Alert System (AVAS)',
      description: '',
      image: 'https://en.kg-mobility.com/attached/contents/display/video/2000003000100080004/20250204090102828_CO7Fon.jpg'
    },
    {
      id: 1,
      title: language === 'fr' ? 'Système de Surveillance de la Pression des Pneus (TPMS)' : 'Tyre Pressure Monitoring System (TPMS)',
      description: '',
      image: 'https://en.kg-mobility.com/attached/contents/display/video/2000003000100080004/20250204090119914_DAZiGr.jpg'
    },
    {
      id: 2,
      title: language === 'fr' ? 'Fixation de Siège Enfant (ISO-FIX)' : 'Child seat anchorage (ISO-FIX)',
      description: '',
      image: 'https://en.kg-mobility.com/attached/contents/display/video/2000003000100080004/20250204090139310_CX84SJ.jpg'
    }
  ], [language]);

  // Keyboard navigation for carousels - Escape to close
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        if (isBSDCarouselOpen) {
          setIsBSDCarouselOpen(false);
        }
        if (isAEBCarouselOpen) {
          setIsAEBCarouselOpen(false);
        }
        if (isESCCarouselOpen) {
          setIsESCCarouselOpen(false);
        }
        if (isEnhancedSafetyCarouselOpen) {
          setIsEnhancedSafetyCarouselOpen(false);
        }
      }
    };

    if (isBSDCarouselOpen || isAEBCarouselOpen || isESCCarouselOpen || isEnhancedSafetyCarouselOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isBSDCarouselOpen, isAEBCarouselOpen, isESCCarouselOpen, isEnhancedSafetyCarouselOpen]);

  // Convenience features data
  const convenienceFeatures = [
    {
      id: 0,
      title: language === 'fr' ? 'Explorez le plein air avec la technologie EV' : 'Explore the outdoors with EV technology',
      subtitle: language === 'fr' ? 'Véhicule vers charge (V2L)' : 'Vehicle to load (V2L)',
      description: language === 'fr' ? 'Utilisation simultanée jusqu\'à 3,5 kW de puissance - les appareils peuvent être chargés jusqu\'à ce que la capacité minimale de batterie prédéfinie (de 20 à 70 %) soit atteinte.' : 'Simultaneous use with up to 3.5 kW of power - appliances can be charged until the pre-set minimum battery capacity (from 20~70%) is reached.',
      image: 'https://en.kg-mobility.com/attached/contents/display/video/2000003000100080004/20250204090324627_UlZiim.jpg',
      video: 'https://en.kg-mobility.com/attached/contents/display/video/2000003000100080004/20250204090324860_uP6Sml.mp4',
      bgColor: "bg-gray-800",
      textColor: "text-white",
      subtitleColor: "text-white",
      hasOpenButton: true
    },
    {
      id: 1,
      title: language === 'fr' ? 'Votre camp de base dans la nature' : 'Your base camp in the wild',
      subtitle: language === 'fr' ? 'Bouton d\'ouverture de hayon interne' : 'Internal tailgate opening button',
      description: language === 'fr' ? 'Le hayon comprend un bouton interne qui vous permet d\'ouvrir et de fermer le hayon depuis l\'intérieur du véhicule, ce qui est pratique lors du camping dans la voiture.' : 'The tailgate includes an internal button that allows you to open and close the tailgate from inside the vehicle, making it convenient when camping in the car.',
      image: 'https://en.kg-mobility.com/attached/contents/display/video/2000003000100080004/20250204090522396_IRNmkV.jpg',
      video: 'https://en.kg-mobility.com/attached/contents/display/video/2000003000100080004/20250204090522637_vqf69M.mp4',
      bgColor: "bg-gray-800",
      textColor: "text-white",
      subtitleColor: "text-white",
      hasOpenButton: true
    },
    {
      id: 2,
      title: language === 'fr' ? 'Surveillance des angles morts' : 'Blind spot monitoring',
      subtitle: language === 'fr' ? 'Système de surveillance 3D 360°' : '3D 360° around view monitoring system',
      description: language === 'fr' ? 'Quatre caméras extérieures surveillent les manœuvres de stationnement et la conduite, offrant une vue claire et utile des zones arrière ainsi que de l\'environnement au sol.' : 'Four cameras on the exterior monitor parking and driving, helpfully providing a clear view of the rear and ground areas.',
      image: 'https://en.kg-mobility.com/attached/contents/display/video/2000003000100080004/20250204113458061_rk8niN.jpg',
      video: "",
      bgColor: "bg-gray-800",
      textColor: "text-white",
      subtitleColor: "text-white",
      hasOpenButton: true
    },
    {
      id: 3,
      title: language === 'fr' ? 'Confort de conduite' : 'Driving comfort',
      subtitle: language === 'fr' ? 'Sièges avant réglables électriquement 8 directions' : '8-way power-adjustable front seats',
      description: language === 'fr' ? 'Doté d\'un siège électrique 8 directions avec support lombaire 2 directions (pour régler le dossier inférieur), offrant un environnement de conduite confortable adapté aux besoins de chacun.' : "Featuring an 8-way powered seat with 2-way lumbar support (for adjusting the lower backrest), providing a comfortable driving environment tailored to anyone's needs.",
      image: 'https://en.kg-mobility.com/attached/contents/display/video/2000003000100080004/20250204090839379_TVJg79.jpg',
      video: "",
      bgColor: "bg-gray-200",
      textColor: "text-white",
      subtitleColor: "text-white",
      hasOpenButton: true
    },
    {
      id: 4,
      title: language === 'fr' ? 'Espace de chargement de classe supérieure' : 'Best-in-class luggage space',
      subtitle: language === 'fr' ? 'Configurations d\'assise' : 'Seating configurations',
      description: language === 'fr' ? 'Offrant un espace de chargement de premier plan de 1 662 litres, adapté à diverses activités de plein air.' : 'Offering a class-leading cargo space of 1,662 litres, suitable for various outdoor activities.',
      image: 'https://en.kg-mobility.com/attached/contents/display/video/2000003000100080004/20250204091016529_EtHLHW.jpg',
      video: "",
      bgColor: "bg-gray-200",
      textColor: "text-white",
      subtitleColor: "text-white",
      hasOpenButton: true
    },
    {
      id: 5,
      title: language === 'fr' ? 'Contrôle de la qualité de l\'air' : 'Air quality control',
      subtitle: language === 'fr' ? 'Système de climatisation automatique à double zone de température avant' : 'Front dual temperature zone auto air conditioning system',
      description: language === 'fr' ? 'Inclut un filtre de climatisation micro, un dégivrage automatique et des fonctions de soufflage après pour une conduite plus confortable.' : 'Includes a micro air conditioning filter, auto defogging, and after-blow functions for a more comfortable ride.',
      image: 'https://en.kg-mobility.com/attached/contents/display/video/2000003000100080004/20250204091243264_2EcwFG.jpg',
      video: "",
      bgColor: "bg-gray-800",
      textColor: "text-white",
      subtitleColor: "text-white",
      hasOpenButton: true
    },
    {
      id: 6,
      title: language === 'fr' ? 'Mode adapté aux animaux de compagnie' : 'Pet-friendly mode',
      subtitle: language === 'fr' ? 'Mode conditionnement (confort de l\'habitacle)' : 'Conditioning (cabin comfort) mode',
      description: language === 'fr' ? 'Permet de verrouiller le véhicule en maintenant une température confortable pour vos animaux pendant votre absence.' : "When you need to briefly exit the vehicle and can't take your pets with you, it allows you to lock the doors with the conditioning mode on to maintain a cabin temperature safe for your little pals.",
      image: 'https://en.kg-mobility.com/attached/contents/display/video/2000003000100080004/20250204091415790_SWgC6S.jpg',
      video: "",
      bgColor: "bg-gray-800",
      textColor: "text-white",
      subtitleColor: "text-white",
      hasOpenButton: true
    },
    {
      id: 7,
      title: '',
      subtitle: language === 'fr' ? 'Plus de fonctionnalités' : 'More features',
      description: '',
      image: 'https://en.kg-mobility.com/attached/contents/display/video/2000003000100080004/20250204091550061_g8W8Ev.jpg',
      video: "",
      bgColor: "bg-gradient-to-br from-blue-600 to-blue-800",
      textColor: "text-white",
      subtitleColor: "text-white",
      hasOpenButton: true
    }
  ];

  // Convenience: Seating configurations inner slider data
  const seatingCarouselData = [
    {
      id: 0,
      title: language === 'fr' ? '100% déplié (703 litres)' : '100% unfolded (703  litres)',
      description: '',
      image: 'https://en.kg-mobility.com/attached/contents/display/video/2000003000100080004/20250204091031995_AaMaof.jpg'
    },
    {
      id: 1,
      title: language === 'fr' ? '2ème rangée 40% repliée (1 181 litres)' : '2nd row 40% folded (1,181 litres)',
      description: '',
      image: 'https://en.kg-mobility.com/attached/contents/display/video/2000003000100080004/20250204091049223_7pxo2t.jpg'
    },
    {
      id: 2,
      title: language === 'fr' ? '2ème rangée 60% repliée (1 320 litres)' : '2nd row 60% folded (1,320 litres)',
      description: '',
      image: 'https://en.kg-mobility.com/attached/contents/display/video/2000003000100080004/20250204091110461_QCIxge.jpg'
    }
  ];

  // Convenience: More features inner slider data
  const moreFeaturesCarouselData = [
    { id: 0, title: language === 'fr' ? 'Hayon électrique intelligent' : 'Smart power tailgate', description: '', image: 'https://en.kg-mobility.com/attached/contents/display/video/2000003000100080004/20250204091607937_rIABbJ.jpg' },
    { id: 1, title: language === 'fr' ? 'Dispositif d\'accès passager' : "Passenger's seat walk-in device", description: '', image: 'https://en.kg-mobility.com/attached/contents/display/video/2000003000100080004/20250204091623881_sgd1pb.jpg' },
    { id: 2, title: language === 'fr' ? 'Aération arrière' : 'Rear air vent', description: '', image: 'https://en.kg-mobility.com/attached/contents/display/video/2000003000100080004/20250204091641568_RRlvJ4.jpg' },
    { id: 3, title: language === 'fr' ? 'Android Auto et Apple CarPlay' : 'Android Auto & Apple CarPlay', description: '', image: 'https://en.kg-mobility.com/attached/contents/display/video/2000003000100080004/20250204091657861_NFdBcY.jpg' },
    { id: 4, title: language === 'fr' ? 'Inclinaison 2ème rangée (Max 32,5º)' : '2nd-row reclining  (Max 32.5º)', description: '', image: 'https://en.kg-mobility.com/attached/contents/display/video/2000003000100080004/20250204091714700_KgZ0Cq.jpg' },
    { id: 5, title: language === 'fr' ? 'Caméra avant/arrière' : 'Front/rearview camera', description: '', image: 'https://en.kg-mobility.com/attached/contents/display/video/2000003000100080004/20250204091729173_civgI7.jpg' },
    { id: 6, title: language === 'fr' ? 'Chargeur mobile sans fil' : 'Wireless mobile charger', description: '', image: 'https://en.kg-mobility.com/attached/contents/display/video/2000003000100080004/20250204091745448_spnXmo.jpg' },
    { id: 7, title: language === 'fr' ? 'Prise USB type C, avant et arrière' : 'C type USB slot, front and rear', description: '', image: 'https://en.kg-mobility.com/attached/contents/display/video/2000003000100080004/20250204091759879_vvQRFX.jpg' },
    { id: 8, title: language === 'fr' ? 'Porte-gobelet avant grande taille' : 'Big-sized front cup holder', description: '', image: 'https://en.kg-mobility.com/attached/contents/display/video/2000003000100080004/20250204091814116_MDklDy.jpg' },
    { id: 9, title: language === 'fr' ? 'Accoudoir et porte-gobelet central banquette arrière' : 'Rear seat centre armrest and cup holder', description: '', image: 'https://en.kg-mobility.com/attached/contents/display/video/2000003000100080004/20250204091830332_G1rjbD.jpg' },
    { id: 10, title: language === 'fr' ? 'Poches cartes dossier siège avant' : 'Front seat back map pockets', description: '', image: 'https://en.kg-mobility.com/attached/contents/display/video/2000003000100080004/20250204091847759_17XdaA.jpg' },
    { id: 11, title: language === 'fr' ? 'Essuie-glaces à détection de pluie' : 'Rain sensing windscreen wipers', description: '', image: 'https://en.kg-mobility.com/attached/contents/display/video/2000003000100080004/20250204091902193_s3a3kn.jpg' },
    { id: 12, title: language === 'fr' ? 'Toit ouvrant électrique sécurisé' : 'Safety powered sunroof', description: '', image: 'https://en.kg-mobility.com/attached/contents/display/video/2000003000100080004/20250204091916558_zJWKP0.jpg' },
    { id: 13, title: language === 'fr' ? 'Sièges chauffants, avant et arrière' : 'Heated seats, front and rear', description: '', image: 'https://en.kg-mobility.com/attached/contents/display/video/2000003000100080004/20250204091931497_M5Mdzr.jpg' },
    { id: 14, title: language === 'fr' ? 'Sièges avant ventilés' : 'Ventilated front seats', description: '', image: 'https://en.kg-mobility.com/attached/contents/display/video/2000003000100080004/20250204091948116_sm3gNP.jpg' },
    { id: 15, title: language === 'fr' ? 'Stores manuels 2ème rangée' : '2nd-row manual roller blinds', description: '', image: 'https://en.kg-mobility.com/attached/contents/display/video/2000003000100080004/20250204092004381_CVbPnR.jpg' },
    { id: 16, title: language === 'fr' ? 'Appuie-tête avec porte-manteaux (conducteur et passager)' : 'Hanger headrests (driver and passenger)', description: '', image: 'https://en.kg-mobility.com/attached/contents/display/video/2000003000100080004/20250204092022780_xEdgrA.jpg' },
    { id: 17, title: language === 'fr' ? 'Volant chauffant' : 'Heated steering wheel', description: '', image: 'https://en.kg-mobility.com/attached/contents/display/video/2000003000100080004/20250204092038603_SfpO0g.jpg' },
    { id: 18, title: language === 'fr' ? 'Dispositif de contrôle et de protection intégré au câble (IC-CPD)' : 'In-cable control and protection device (IC-CPD)', description: '', image: 'https://en.kg-mobility.com/attached/contents/display/video/2000003000100080004/20250204092056601_9JHw33.jpg' }
  ];
  
  // Performance: Charging and range inner slider data
  const chargingCarouselData = [
    { id: 0, title: language === 'fr' ? 'Recharge rapide 300 kW de 10% à 80% : 37 min / Recharge rapide 100 kW de 10% à 80% : 42 min' : '300 kW fast-charging from 10% to 80% : 37 mins / 100 kW fast-charging from 10% to 80% : 42 mins', description: '', image: 'https://en.kg-mobility.com/attached/contents/display/video/2000003000100080004/20250206110928881_JmgmTb.jpg' },
    { id: 1, title: language === 'fr' ? 'Recharge niveau 2 de 11 kW de 0% à 100% : 9 heures (à température ambiante)' : '11 kW Level 2 charging from 0% to 100% : 9 hours (at room temperature)', description: '', image: 'https://en.kg-mobility.com/attached/contents/display/video/2000003000100080004/20250206110936767_sc3K0H.jpg' },
    { id: 2, title: language === 'fr' ? 'Recharge portable de 0% à 100% : 30 heures (à température ambiante)' : 'Portable charging from 0% to 100% : 30 hours (at room temperature)', description: '', image: 'https://en.kg-mobility.com/attached/contents/display/video/2000003000100080004/20250206110944693_aXeJlB.jpg' }
  ];


  // Performance features data
  const performanceFeatures = [
    {
      id: 0,
      title: language === 'fr' ? 'Spécifications de batterie' : 'Battery specs',
      subtitle: language === 'fr' ? 'Batterie LFP blade' : 'LFP blade battery',
      description: language === 'fr' ? "Axée sur la protection des batteries EV, la batterie lithium fer phosphate de nouvelle génération de 73,4 kWh assure une excellente sécurité aux chocs et une efficacité de charge grâce à la technologie cell-to-pack la plus récente" : 'Focusing on EV battery safety, the next-generation 73.4 kWh lithium iron phosphate battery ensures excellent impact safety and charging efficiency through the latest cell-to-pack technology.',
      image: "https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/TORRES-EVX/PERFORMANCE/card1/20250204092236855_T8yk4B.jpg",
      video: "",
      bgColor: "bg-gray-800",
      textColor: "text-white",
      subtitleColor: "text-white",
      hasOpenButton: false
    },
    {
      id: 1,
      title: language === 'fr' ? 'Optimisation des performances' : 'Performance optimization',
      subtitle: language === 'fr' ? 'Système de gestion de batterie haute tension' : 'High-Voltage battery management system',
      description: language === 'fr' ? "Ce système a été concu avec proactivité pour s'adapter aux différentes températures (à partir de 8°C), permettant le maintien des performances optimales, tout en évitant la dégradation de la durabilité due au vieillissement de la batterie : Garantie 10 ans/ 1 000 000 KM)" : 'This system proactively prepares for temperatures starting from 8°C, maintaining optimal performance and preventing durability degradation due to battery aging. (10-year/1,000,000 km warranty)',
      image: "https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/TORRES-EVX/PERFORMANCE/card2/20250204092433350_rQTBU3.jpg",
      video: "",
      bgColor: "bg-gray-800",
      textColor: "text-white",
      subtitleColor: "text-white",
      hasOpenButton: false
    },
    {
      id: 2,
      title: language === 'fr' ? "Module de gestion de l'énergie" : 'Power management module',
      subtitle: language === 'fr' ? 'Système de propulsion EV' : 'EV drive system',
      description: language === 'fr' ? 'Associé à un moteur de 152,2 kW et à un réducteur de répartition de couple, ce système offre une expérience de conduite puissante.' : 'Combined with a 152.2 kW motor and torque distribution reducer, this system provides a powerful driving experience.',
      image: "https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/TORRES-EVX/PERFORMANCE/card3/20250204092605226_SGCNXE.jpg",
      video: "",
      bgColor: "bg-gray-800",
      textColor: "text-white",
      subtitleColor: "text-white",
      hasOpenButton: false
    },
    {
      id: 3,
      title: language === 'fr' ? 'Recharge et autonomie' : 'Charging and range',
      subtitle: language === 'fr' ? 'Autonomie maximale sur une seule charge : 462 km (norme WLTP)' : 'Maximum driving range on a single charge : 462 km (WLTP standard)',
      description: language === 'fr' ? 'Lors de l\'utilisation d\'une borne AC 11 kW ou d\'un chargeur portable, le système AVN permet de définir les heures de début et de fin de charge ; avec une borne AC 11 kW ou une charge rapide, vous pouvez définir un niveau de charge cible.' : 'When using a Level 2 or portable charger, the AVN system allows you to set the charging start and end times; with a Level 2 or fast charger, you can set a target charge level.',
      image: "https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/TORRES-EVX/PERFORMANCE/card4/20250204092737612_I1NLmO.jpg",
      video: "",
      bgColor: "bg-gray-800",
      textColor: "text-white",
      subtitleColor: "text-white",
      hasOpenButton: true
    },
    {
      id: 4,
      title: language === 'fr' ? 'Attention à la sécurité' : 'Attention to safety',
      subtitle: language === 'fr' ? 'Système de transmission électronique avec dispositif de sécurité' : 'Electronic transmission system with safety system',
      description: language === 'fr' ? 'Un système de sécurité a été mis en place pour prévenir les accidents pouvant être causés par divers dysfonctionnements. (SBW appliqué)' : 'A safety system has been implemented to prevent accidents that could be caused by various malfunctions. (SBW applied)',
      image: "https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/TORRES-EVX/PERFORMANCE/card5/20250204092957002_Blgjby.jpg",
      video: "",
      bgColor: "bg-gray-200",
      textColor: "text-white",
      subtitleColor: "text-white",
      hasOpenButton: false
    },
    {
      id: 5,
      title: language === 'fr' ? 'Contrôle régénératif' : 'Regenerative control',
      subtitle: language === 'fr' ? 'Palettes au volant' : 'Paddle shifters',
      description: language === 'fr' ? 'Les commandes de montée/descente sur le volant permettent de gérer le freinage régénératif avec 3 niveaux différents.' : 'The up/down shift controls on the steering wheel allow you to manage the regenerative braking with 3 different levels.',
      image: "https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/TORRES-EVX/PERFORMANCE/card6/20250204093130274_uItiWE.jpg",
      video: "",
      bgColor: "bg-gray-800",
      textColor: "text-white",
      subtitleColor: "text-white",
      hasOpenButton: false
    },
    {
      id: 6,
      title: language === 'fr' ? 'EPB' : 'EPB',
      subtitle: language === 'fr' ? 'Frein de stationnement électronique' : 'Electronic Parking Brake',
      description: language === 'fr' ? 'Interrupteur à bascule avec maintien automatique' : 'Toggle-switch type with auto hold',
      image: "https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/TORRES-EVX/PERFORMANCE/card7/20250204093304624_tP08iE.jpg",
      video: "",
      bgColor: "bg-gray-200",
      textColor: "text-white",
      subtitleColor: "text-white",
      hasOpenButton: false
    }
  ];

  // Specification images
  const specImages = [
    {
      id: 0,
      src: "https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/TORRES-EVX/SPECIFICATION/20250204094936764_7KNWzz.jpg",
      alt: 'Front view of Torres EVX'
    },
    {
      id: 1,
      src: "https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/TORRES-EVX/SPECIFICATION/20250204094936764_7KNWzz.jpg",
      alt: 'Side view of Torres EVX'
    },
    {
      id: 2,
      src: "https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/TORRES-EVX/SPECIFICATION/20250204094936764_7KNWzz.jpg",
      alt: 'Rear view of Torres EVX'
    }
  ];

  // Specification data
  const specificationData = {
    dimensions: [
      { label: 'Driven Wheels', value: "2WD" },
      { label: 'Transmission', value: "1AT" },
      { label: 'Type', value: "Wagon" },
      { label: 'Overall Length', value: '4,715' },
      { label: 'Overall Width', value: '1,890' },
      { label: 'Overall Height', value: '1,715 (1,725 with roof rack)' },
      { label: 'Wheelbase', value: '2,680' },
      { label: 'Tread', value: 'Front (mm): 1,620, Rear (mm): 1,640' },
      { label: 'Overhang', value: 'Front (mm): 930, Rear (mm): 1,105' },
      { label: 'Approach Angle', value: '18.3' },
      { label: 'Departure Angle', value: '20.8' },
      { label: 'Ramp Angle', value: '15.3' },
      { label: 'Minimum Ground Clearance', value: '169' },
      { label: 'Minimum Turning Radius', value: '5.42' },
      { label: 'Gross Vehicle Weight', value: '2,410' },
      { label: 'Kerb Weight', value: '1,915' },
      { label: 'Gross Trailer Weight', value: 'Braked (kg): 1,500, Unbraked (kg): 500' }
    ],
    powertrain: [
      { label: 'Driven Wheels', value: "2WD" },
      { label: 'Engine Type', value: "Electric motor" },
      { label: 'Transmission', value: "1AT" },
      { label: 'Battery', value: "Lithium Iron Phosphate (LifeP04)" },
      { label: 'Standard Charging Time', value: 'Three phase : 30h (IC-CPD, 2kW), 9h (11kW)' },
      { label: 'Fast Charge Time', value: '300kW: 37min, 100kW: 42min' },
      { label: 'Onboard Charger Power', value: '10.5' },
      { label: 'Capacity', value: '73.4' },
      { label: 'Battery Voltage', value: '390.4' },
      { label: 'Max Power', value: 'kW: 152.2, ps: 206.934' },
      { label: 'Max Torque', value: 'Nm: 339, kg.m: 34.6' },
      { label: 'Acceleration Time', value: '8.11' },
      { label: "Max. speed (km/h)", value: "175" }
    ],
    fuelEfficiency: [
      { label: "DRIVEN WHEELS", value: "2WD" },
      { label: language === 'fr' ? 'Transmission' : 'Transmission', value: '1AT' },
      { label: language === 'fr' ? 'Moteur Électrique' : 'Electric Motor', value: 'Interior permanent magnet synchronous motor' },
      { label: language === 'fr' ? 'Consommation Électrique' : 'Electric Energy Consumption', value: '135.5: City, 186.5: Combined' },
      { label: "Electric range (km)", value: "462" },
      { label: "Electric range city (km)", value: "635" }
    ],
    tyreInformation: [
      { label: language === 'fr' ? 'Fabricant' : 'Maker', value: 'NX' },
      { label: language === 'fr' ? 'Taille' : 'Size', value: '225/60R18' },
      { label: language === 'fr' ? 'Fiche d\'Information Produit' : 'Product Information Sheet', value: 'PDF' },
      { label: language === 'fr' ? 'Étiquette Pneu' : 'Tyre Label', value: 'PDF' }
    ]
  };

  // Specification accordion data
  const specAccordions: Array<{
    id: number;
    title: string;
    content: {
      dimensions?: Array<{ label: string; value: string }>;
      engine?: Array<{ label: string; value: string }>;
      transmission?: Array<{ label: string; value: string }>;
      efficiency?: Array<{ label: string; value: string }>;
      tyres?: Array<{
        maker: string;
        size: string;
        productSheet: string;
        tyreLabel: string;
      }>;
    };
  }> = [
    {
      id: 0,
      title: language === 'fr' ? 'DIMENSIONS' : 'DIMENSIONS',
      content: {
        dimensions: [
          { label: language === 'fr' ? 'Longueur Totale' : 'Overall Length', value: '4,200mm' },
          { label: language === 'fr' ? 'Largeur Totale' : 'Overall Width', value: '1,560mm' },
          { label: language === 'fr' ? 'Hauteur Totale' : 'Overall Height', value: '1,613mm' },
          { label: language === 'fr' ? 'Empattement' : 'Wheelbase', value: '2,600mm' },
          { label: language === 'fr' ? 'Garde au Sol' : 'Ground Clearance', value: '190mm' }
        ]
      }
    },
    {
      id: 1,
      title: language === 'fr' ? 'GROUPE MOTOPROPULSEUR' : 'POWERTRAIN',
      content: {
        engine: [
          { label: "Engine Type", value: "1.5L GDI Turbo" },
          { label: "Displacement", value: "1,497cc" },
          { label: "Max Power", value: "160ps @ 5,500rpm" },
          { label: "Max Torque", value: "25.5kgf·m @ 1,500-4,000rpm" }
        ],
        transmission: [
          { label: "Transmission", value: "6-Speed Automatic" },
          { label: "Drive Type", value: "FWD / AWD" }
        ]
      }
    },
    {
      id: 2,
      title: "FUEL EFFICIENCY",
      content: {
        efficiency: [
          { label: "City", value: "12.4 km/L" },
          { label: "Highway", value: "15.2 km/L" },
          { label: "Combined", value: "13.5 km/L" },
          { label: "CO2 Emissions", value: "119 g/km" }
        ]
      }
    },
    {
      id: 3,
      title: "TYRE INFORMATION",
      content: {
        tyres: [
          {
            maker: "KH",
            size: "205/60R16 SUMMER",
            productSheet: "/assets/Modelspage/Tivoli/section9/KH_16_SUMMER_PIS.pdf",
            tyreLabel: "/assets/Modelspage/Tivoli/section9/KH_16_SUMMER_TL.pdf"
          },
          {
            maker: "NX",
            size: "205/65R16",
            productSheet: "/assets/Modelspage/Tivoli/section9/NX_16_PIS.pdf",
            tyreLabel: "/assets/Modelspage/Tivoli/section9/NX_16_TL.pdf"
          },
          {
            maker: "KH",
            size: "215/50R18",
            productSheet: "/assets/Modelspage/Tivoli/section9/KH_18_PIS.pdf",
            tyreLabel: "/assets/Modelspage/Tivoli/section9/KH_18_TL.pdf"
          }
        ]
      }
    }
  ];

  // Accessory data
  const exteriorAccessories = [
    {
      id: 0,
      name: "C-Pillar Storage Box",
      image: "https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/TORRES-EVX/ACCESSORY/exterior/20250204093636787_Yfwxbo.jpg",
      description: "Lockable storage box integrated into C-pillar design"
    },
    {
      id: 1,
      name: "Cross Bar",
      image: "https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/TORRES-EVX/ACCESSORY/exterior/20250204093653765_0hm4Og.jpg",
      description: "Roof rack cross bars for additional cargo carrying capacity"
    },
    {
      id: 2,
      name: "Roof Flat Carrier",
      image: "https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/TORRES-EVX/ACCESSORY/exterior/20250204093708933_vjI5Tz.jpg",
      description: "Flat roof carrier for additional cargo space"
    },
    {
      id: 3,
      name: "Side Steps",
      image: "https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/TORRES-EVX/ACCESSORY/exterior/20250204093725855_OIMj8M.jpg",
      description: "Convenient side steps with textured non-slip surface"
    }
  ];

  const interiorAccessories = [
    {
      id: 0,
      name: "Alloy Sports Pedal",
      image: "https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/TORRES-EVX/ACCESSORY/interior/20250204093949852_bfhyTj.jpg",
      description: "Sporty alloy pedal covers with textured grip"
    },
    {
      id: 1,
      name: "Air Mat",
      image: "https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/TORRES-EVX/ACCESSORY/interior/20250204094005862_Y60Fyv.jpg",
      description: "Inflatable air mattress for comfortable car camping"
    },
    {
      id: 2,
      name: "Multi Curtain",
      image: "https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/TORRES-EVX/ACCESSORY/interior/20250204094023334_cxvNRh.jpg",
      description: "Privacy curtains and storage organizers for interior comfort"
    },
    {
      id: 3,
      name: "Umbrella Hanger",
      image: "https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/TORRES-EVX/ACCESSORY/interior/20250204094041052_ZykeG3.jpg",
      description: "Convenient umbrella storage and hanging system"
    }
  ];


  // Front hotspots with real images/videos - Desktop positions
  const frontHotspotsDesktop = [
    {
      id: 'headlight',
      position: { x: '57%', y: '29%' },
      title: language === 'fr' ? 'Hood garnish' : 'Hood garnish',
      description: language === 'fr' ? 'Soutenant diverses activités de plein air - peut être utilisé pour installer des GoPros, des équipements de protection de véhicule, des bâches et plus encore.' : 'Supporting various outdoor activities - can be used to install GoPros, vehicle protection gear, tarps and more.'
    },
    {
      id: 'grille',
      position: { x: '41%', y: '41%' },
      title: language === 'fr' ? 'Calandre avec signature lumineuse' : 'Grille with luminous signature',
      description: language === 'fr' ? 'Plongez au cœur de l\'innovation derrière la calandre lumineuse.' : 'Dive into the heart of innovation behind the luminous grille.'
    },
    {
      id: 'foglight',
      position: { x: '58%', y: '39%' },
      title: language === 'fr' ? 'Convertisseur DC-DC basse tension 2,2kW (LDC)' : '2.2kW low voltage DC-DC Converter (LDC)',
      description: language === 'fr' ? 'Le port de charge sur le côté conducteur de l\'aile avant prend en charge la charge DC combo.' : 'The charging port on the driver\'s side of the front fender supports DC combo charging.'
    },
    {
      id: 'wheel',
      position: { x: '45%', y: '59%' },
      title: language === 'fr' ? 'Phares avant LED complets avec nivellement' : 'Full LED front head lights with leveling',
      description: language === 'fr' ? 'Le pare-chocs avant est équipé de feux de croisement/route intégrés de type projection (type à quatre éléments).' : 'The front bumper is equipped with built-in projection-type high/low beam lights (four-element type).'
    },
    {
      id: 'roof',
      position: { x: '52%', y: '67%' },
      title: language === 'fr' ? ' Alliage' : ' Wheels',
      description: language === 'fr' ? 'Jantes alliage avec finition diamant' : 'Alloy wheels with diamond-cut finish'
    }
  ];

  // Front hotspots - Mobile positions
  const frontHotspotsMobile = [
    {
      id: 'headlight',
      position: { x: '66%', y: '33%' },
      title: language === 'fr' ? 'Hood garnish' : 'Hood garnish',
      description: language === 'fr' ? 'Soutenant diverses activités de plein air - peut être utilisé pour installer des GoPros, des équipements de protection de véhicule, des bâches et plus encore.' : 'Supporting various outdoor activities - can be used to install GoPros, vehicle protection gear, tarps and more.'
    },
    {
      id: 'grille',
      position: { x: '41%', y: '41%' },
      title: language === 'fr' ? 'Calandre avec signature lumineuse' : 'Grille with luminous signature',
      description: language === 'fr' ? 'Plongez au cœur de l\'innovation derrière la calandre lumineuse.' : 'Dive into the heart of innovation behind the luminous grille.'
    },
    {
      id: 'foglight',
      position: { x: '58%', y: '39%' },
      title: language === 'fr' ? 'Convertisseur DC-DC basse tension 2,2kW (LDC)' : '2.2kW low voltage DC-DC Converter (LDC)',
      description: language === 'fr' ? 'Le port de charge sur le côté conducteur de l\'aile avant prend en charge la charge DC combo.' : 'The charging port on the driver\'s side of the front fender supports DC combo charging.'
    },
    {
      id: 'wheel',
      position: { x: '45%', y: '59%' },
      title: language === 'fr' ? 'Phares avant LED complets avec nivellement' : 'Full LED front head lights with leveling',
      description: language === 'fr' ? 'Le pare-chocs avant est équipé de feux de croisement/route intégrés de type projection (type à quatre éléments).' : 'The front bumper is equipped with built-in projection-type high/low beam lights (four-element type).'
    },
    {
      id: 'roof',
      position: { x: '52%', y: '67%' },
      title: language === 'fr' ? ' Alliage' : ' Wheels',
      description: language === 'fr' ? 'Jantes alliage avec finition diamant' : 'Alloy wheels with diamond-cut finish'
    }
  ];

  // Use mobile or desktop positions based on screen size
  const frontHotspots = isMobile ? frontHotspotsMobile : frontHotspotsDesktop;

  // Rear hotspots with fake text content (no images) - Desktop positions
  const rearHotspotsDesktop = [
    {
      id: 'rear-window',
      position: { x: '55%', y: '21%' },
      title: language === 'fr' ? 'Barres de Toit Utilitaires' : 'Utility roof rail',
      description: language === 'fr' ? 'Pour vous permettre d\'attacher facilement des coffres de toit et des tentes de toit pour les activités de plein air.' : 'For you to conveniently attach outdoor roof boxes and rooftop tents.'
    },
    {
      id: 'rear-door',
      position: { x: '38%', y: '40%' },
      title: language === 'fr' ? 'Détail Arrière Central Hexagonal de Couleur Carrosserie' : 'Body-coloured hexagonal rear centre detailing',
      description: language === 'fr' ? 'La garniture arrière, qui amplifie le sens de la profondeur du Torres EVX, ainsi que les verrous disposés sur les côtés, transmettent l\'identité SUV originale de la marque Torres.' : 'The rear garnish, which amplifies the Torres EVX\'s sense of depth, along with the latches arranged on the sides conveys the original SUV identity of the Torres brand.'
    },
    {
      id: 'rear-taillight',
      position: { x: '32%', y: '63%' },
      title: language === 'fr' ? 'Pare-chocs Arrière avec Feu de Marche Arrière' : 'Rear bumper with reverse lamp',
      description: language === 'fr' ? 'Le feu de marche arrière est intégré dans un pare-chocs arrière robuste mais moderne de style plaque de protection.' : 'The reverse lamp is integrated into a rugged yet modern skid plate-style rear bumper.'
    },
    {
      id: 'rear-spoiler',
      position: { x: '45%', y: '44%' },
      title: language === 'fr' ? 'Feu Arrière Combiné avec Feux de Freinage LED' : 'Rear combination lamp with LED brake lights',
      description: language === 'fr' ? 'Les feux arrière et de freinage LED montés en surface, ainsi que les feux de clignotant LED, ont été appliqués pour maximiser la visibilité pour les véhicules qui suivent.' : 'LED surface-mounted tail and stop lamps, along with LED turn signal lamps, have been applied to maximize visibility for trailing vehicles.'
    },
    {
      id: 'rear-wiper',
      position: { x: '50%', y: '20%' },
      title: language === 'fr' ? 'Essuie-Glace Arrière' : 'Rear Wiper',
      description: language === 'fr' ? 'Essuie-glace arrière intermittent avec lave-glace' : 'Intermittent rear wiper with washer'
    }
  ];

  // Rear hotspots - Mobile positions
  const rearHotspotsMobile = [
    {
      id: 'rear-window',
      position: { x: '54%', y: '22%' },
      title: language === 'fr' ? 'Barres de Toit Utilitaires' : 'Utility roof rail',
      description: language === 'fr' ? 'Pour vous permettre d\'attacher facilement des coffres de toit et des tentes de toit pour les activités de plein air.' : 'For you to conveniently attach outdoor roof boxes and rooftop tents.'
    },
    {
      id: 'rear-door',
      position: { x: '38%', y: '40%' },
      title: language === 'fr' ? 'Détail Arrière Central Hexagonal de Couleur Carrosserie' : 'Body-coloured hexagonal rear centre detailing',
      description: language === 'fr' ? 'La garniture arrière, qui amplifie le sens de la profondeur du Torres EVX, ainsi que les verrous disposés sur les côtés, transmettent l\'identité SUV originale de la marque Torres.' : 'The rear garnish, which amplifies the Torres EVX\'s sense of depth, along with the latches arranged on the sides conveys the original SUV identity of the Torres brand.'
    },
    {
      id: 'rear-taillight',
      position: { x: '32%', y: '63%' },
      title: language === 'fr' ? 'Pare-chocs Arrière avec Feu de Marche Arrière' : 'Rear bumper with reverse lamp',
      description: language === 'fr' ? 'Le feu de marche arrière est intégré dans un pare-chocs arrière robuste mais moderne de style plaque de protection.' : 'The reverse lamp is integrated into a rugged yet modern skid plate-style rear bumper.'
    },
    {
      id: 'rear-spoiler',
      position: { x: '45%', y: '44%' },
      title: language === 'fr' ? 'Feu Arrière Combiné avec Feux de Freinage LED' : 'Rear combination lamp with LED brake lights',
      description: language === 'fr' ? 'Les feux arrière et de freinage LED montés en surface, ainsi que les feux de clignotant LED, ont été appliqués pour maximiser la visibilité pour les véhicules qui suivent.' : 'LED surface-mounted tail and stop lamps, along with LED turn signal lamps, have been applied to maximize visibility for trailing vehicles.'
    },
    {
      id: 'rear-wiper',
      position: { x: '48%', y: '31%' },
      title: language === 'fr' ? 'Essuie-Glace Arrière' : 'Rear Wiper',
      description: language === 'fr' ? 'Essuie-glace arrière intermittent avec lave-glace' : 'Intermittent rear wiper with washer'
    }
  ];

  // Use mobile or desktop positions based on screen size
  const rearHotspots = isMobile ? rearHotspotsMobile : rearHotspotsDesktop;

  // Combined hotspots based on current view
  const carHotspots = viewAngle === 'front' ? frontHotspots : rearHotspots;

  // Interior hotspots data - same as Torres
  const interiorHotspots = [
    {
      id: 'dashboard',
      position: { x: '40%', y: '38%' },
      title: language === 'fr' ? "Tableau de bord panoramique" : "Panoramic display",
      description: language === 'fr' ? "Cluster numérique 12,3\" et système AVNT" : "12.3\" digital cluster and AVNT system",
      content: {
        title: language === 'fr' ? "Tableau de bord panoramique" : "Panoramic display",
        subtitle: language === 'fr' ? "Cluster numérique 12,3\" et système AVNT" : "12.3\" digital cluster and AVNT system",
        video: 'https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/kgmvtorresevx.mp4',
        texts: [
          language === 'fr' ? "Le tableau de bord numérique de 12,3\" et le système AVNT fonctionnent comme un panneau de commande intégré, offrant un contrôle simple et intuitif de nombreuses informations, notamment les données de conduite." : "The 12.3\" digital cluster and AVNT system function as an integrated control panel, allowing easy and convenient control of various information, including driving data."
        ]
      }
    },
    {
      id: 'steering',
      position: { x: '62%', y: '43%' },
      title: language === 'fr' ? "Éclairage d'ambiance" : "Mood lighting",
      description: language === 'fr' ? "Éclairage indirect personnalisable" : "Customizable indirect lighting",
      content: {
        title: language === 'fr' ? "Éclairage d'ambiance" : "Mood lighting",
        subtitle: language === 'fr' ? "Éclairage indirect personnalisable" : "Customizable indirect lighting",
        image: 'https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/20250203180937116_B1zkON.jpg',
        texts: [
          language === 'fr' ? "L'éclairage indirect de la planche de bord, de la console centrale et des panneaux de porte est personnalisable avec jusqu'à 32 combinaisons de couleurs (6 couleurs par défaut)" : "The indirect lighting on the IP front, centre console, and door trims can be customized with up to 32 color combinations (with a default of 6 colors)."
        ]
      }
    },
    {
      id: 'seats',
      position: { x: '46%', y: '73%' },
      title: language === 'fr' ? "Sélecteur de Vitesse" : "'Shift By Wire' Toggle switch",
      description: language === 'fr' ? "Le sélecteur de vitesses moderne offre un contrôle précis de la transmission pour une conduite fluide et efficace." : "Including a malfunction prevention safety system, enhancing operational convenience while also ensuring ample storage space.",
      content: {
        title: language === 'fr' ? "Sélecteur de Vitesse" : "'Shift By Wire' Toggle switch",
        subtitle: language === 'fr' ? "Le sélecteur de vitesses moderne offre un contrôle précis de la transmission pour une conduite fluide et efficace." : "Including a malfunction prevention safety system, enhancing operational convenience while also ensuring ample storage space.",
        image: 'https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/TORRES/btnsinterior/btn3/20250124153617443_GYEtNk.jpg',
        texts: [
          language === 'fr' ? "Le sélecteur de vitesses moderne offre un contrôle précis de la transmission pour une conduite fluide et efficace." : "Including a malfunction prevention safety system, enhancing operational convenience while also ensuring ample storage space."
        ]
      }
    },
    {
      id: 'gear-selector',
      position: { x: '50%', y: '75%' },
      title: language === 'fr' ? "Console centrale" : "Centre under tray",
      description: language === 'fr' ? "Idéal pour ranger facilement vos affaires personnelles comme les sacs et les parapluies pliants." : "Easily store personal items such as bags and folding umbrellas.",
      content: {
        title: language === 'fr' ? "Console centrale" : "Centre under tray",
        subtitle: language === 'fr' ? "Idéal pour ranger facilement vos affaires personnelles comme les sacs et les parapluies pliants." : "Easily store personal items such as bags and folding umbrellas.",
        image: 'https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/TORRES/btnsinterior/btn4/20250124153631339_lNWy1V.jpg',
        texts: [
          language === 'fr' ? "Idéal pour ranger facilement vos affaires personnelles comme les sacs et les parapluies pliants." : "Easily store personal items such as bags and folding umbrellas."
        ]
      }
    },
    {
      id: 'after-blow',
      position: { x: '73%', y: '36%' },
      title: language === 'fr' ? "Mode Après-Soufflage" : "After-blow mode(Air conditioning dehumidification)",
      description: language === 'fr' ? "Déshumidification de la climatisation" : "Air conditioning dehumidification",
      content: {
        title: language === 'fr' ? "Mode Après-Soufflage" : "After-blow mode(Air conditioning dehumidification)",
        subtitle: language === 'fr' ? "Déshumidification de la climatisation" : "Air conditioning dehumidification",
        image: 'https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/20250210153918931_EmNlrb.jpg',
        texts: [
          language === 'fr' ? "Le système de climatisation sèche automatiquement l'humidité dans tout l'intérieur, y compris l'évaporateur, pour minimiser les facteurs qui causent des odeurs désagréables à l'intérieur du véhicule." : "The air conditioning system automatically dries the moisture throughout the interior, including the evaporator, to minimize the factors that cause unpleasant odors inside the vehicle."
        ]
      }
    }
  ];

  // Interior hotspot handlers
  const handleInteriorHotspotClick = (hotspotId: string) => {
    setSelectedInteriorHotspot(hotspotId);
    setCurrentInteriorHotspotImage(0);
    setIsInteriorSideMenuOpen(true);
  };

  const closeInteriorSideMenu = () => {
    setIsInteriorSideMenuOpen(false);
    setSelectedInteriorHotspot(null);
  };

  const getInteriorHotspotContent = () => {
    if (!selectedInteriorHotspot) return null;
    const hotspot = interiorHotspots.find(h => h.id === selectedInteriorHotspot);
    return hotspot?.content || null;
  };

  // Hotspot content function for sidebar
  const getHotspotContent = (hotspotId: string) => {
    const hotspot = carHotspots.find(h => h.id === hotspotId);
    if (!hotspot) return null;

    // Check if it's a front hotspot (with real media) or rear hotspot (fake text only)
    const isFrontHotspot = frontHotspots.some(h => h.id === hotspotId);
    const isRealRearHotspot = hotspotId === 'rear-window' || hotspotId === 'rear-door' || hotspotId === 'rear-spoiler' || hotspotId === 'rear-taillight';

    if (isFrontHotspot || isRealRearHotspot) {
      // Front hotspots with real images/videos
      const mediaMap: { [key: string]: { video?: string; images?: string[] } } = {
        'headlight': { 
          images: ['https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/TORRES-EVX/Btns/btn1/20250203172226828_aPIla9.jpg'] 
        },
        'grille': { 
          video: 'https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/TORRES-EVX/Btns/btn2/20250203172118703_WVFDWU.mp4' 
        },
        'foglight': { 
          video: 'https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/TORRES-EVX/Btns/btn3/20250224102948954_VVQN7x.mp4' 
        },
        'wheel': { 
          images: ['https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/TORRES-EVX/Btns/btn4/videoframe_8007.png'] 
        },
        'roof': { 
          images: [
            'https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/TORRES-EVX/Btns/btn5/20250203172153675_n6FiAA.jpg', 
            'https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/TORRES-EVX/Btns/btn5/20250203172210832_NDarf6.jpg'
          ] 
        },
        'rear-window': { 
          images: ['https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/TORRES-EVX/Btns/rear/btn1/20250203172807650_hx4fTZ.jpg'] 
        },
        'rear-door': { 
          images: ['https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/TORRES-EVX/Btns/rear/btn4/20250203172700750_sC069U.jpg'] 
        },
        'rear-spoiler': { 
          video: 'https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/TORRES-EVX/Btns/rear/btn3/20250203172717785_zBJ4rK.mp4' 
        },
        'rear-taillight': { 
          images: ['https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/TORRES-EVX/Btns/rear/btn5/20250203172643250_zD2097.jpg'] 
        }
      };

      const media = mediaMap[hotspotId] || {};

      return {
        title: hotspot.title,
        subtitle: hotspot.description,
        video: media.video,
        images: media.images,
        texts: [
          hotspotId === 'foglight' 
            ? (language === 'fr' ? "Le port de charge sur le côté conducteur de l'aile avant prend en charge la charge DC combo." : "The charging port on the driver's side of the front fender supports DC combo charging.")
            : hotspotId === 'headlight'
            ? (language === 'fr' ? "Soutenant diverses activités de plein air - peut être utilisé pour installer des GoPros, des équipements de protection de véhicule, des bâches et plus encore." : "Supporting various outdoor activities - can be used to install GoPros, vehicle protection gear, tarps and more.")
            : hotspotId === 'wheel'
            ? (language === 'fr' ? "Le pare-chocs avant est équipé de feux de croisement/route intégrés de type projection (type à quatre éléments)." : "The front bumper is equipped with built-in projection-type high/low beam lights (four-element type).")
            : hotspotId === 'grille'
            ? (language === 'fr' ? "Plongez au cœur de l'innovation derrière la calandre lumineuse." : "Dive into the heart of innovation behind the luminous grille.")
            : hotspotId === 'roof'
            ? (language === 'fr' ? "Jantes alliage 20\" avec pneus 245/45R (finition diamant)" : "20\" alloy wheels with 245/45R tyres (diamond-cut finish)")
            : hotspotId === 'rear-window'
            ? (language === 'fr' ? "Vitre arrière avec dégivrage intégré pour une visibilité optimale en toutes conditions météorologiques." : "Rear window with integrated defrosting for optimal visibility in all weather conditions.")
            : hotspotId === 'rear-door'
            ? (language === 'fr' ? "La garniture arrière, qui amplifie le sens de la profondeur du Torres EVX, ainsi que les verrous disposés sur les côtés, transmettent l'identité SUV originale de la marque Torres." : "The rear garnish, which amplifies the Torres EVX's sense of depth, along with the latches arranged on the sides conveys the original SUV identity of the Torres brand.")
            : hotspotId === 'rear-spoiler'
            ? (language === 'fr' ? "Les feux arrière et de freinage LED montés en surface, ainsi que les feux de clignotant LED, ont été appliqués pour maximiser la visibilité pour les véhicules qui suivent." : "LED surface-mounted tail and stop lamps, along with LED turn signal lamps, have been applied to maximize visibility for trailing vehicles.")
            : hotspotId === 'rear-taillight'
            ? (language === 'fr' ? "Le feu de marche arrière est intégré dans un pare-chocs arrière robuste mais moderne de style plaque de protection." : "The reverse lamp is integrated into a rugged yet modern skid plate-style rear bumper.")
            : `Discover the advanced technology behind the ${hotspot.title.toLowerCase()}.`,
          hotspotId === 'roof'
            ? (language === 'fr' ? "Jantes alliage 18\" avec pneus 225/60R (finition diamant)" : "18\" alloy wheels with 225/60R tyres (diamond-cut finish)")
            : hotspotId === 'rear-door'
            ? (language === 'fr' ? "Design hexagonal distinctif qui rehausse l'esthétique du véhicule" : "Distinctive hexagonal design that enhances the vehicle's aesthetics")
            : hotspotId === 'rear-taillight'
            ? (language === 'fr' ? "Design robuste qui allie fonctionnalité et esthétique moderne" : "Rugged design that combines functionality with modern aesthetics")
            : `Experience the precision engineering that makes ${hotspot.title.toLowerCase()} exceptional.`,
          `Learn about the innovative design features of the ${hotspot.title.toLowerCase()}.`
        ]
      };
    } else {
      // Rear hotspots with fake text content only (no images/videos)
      const fakeTexts: { [key: string]: string[] } = {
        'rear-window': [
          language === 'fr' ? "Pour vous permettre d'attacher facilement des coffres de toit et des tentes de toit pour les activités de plein air." : "For you to conveniently attach outdoor roof boxes and rooftop tents.",
          language === 'fr' ? "Design robuste et fonctionnel pour toutes vos aventures en plein air." : "Robust and functional design for all your outdoor adventures.",
          language === 'fr' ? "Facilite le transport d'équipements supplémentaires pour vos voyages." : "Makes it easy to transport additional equipment for your travels."
        ],
        'rear-door': [
          language === 'fr' ? "La garniture arrière, qui amplifie le sens de la profondeur du Torres EVX, ainsi que les verrous disposés sur les côtés, transmettent l'identité SUV originale de la marque Torres." : "The rear garnish, which amplifies the Torres EVX's sense of depth, along with the latches arranged on the sides conveys the original SUV identity of the Torres brand.",
          language === 'fr' ? "Design hexagonal distinctif qui rehausse l'esthétique du véhicule" : "Distinctive hexagonal design that enhances the vehicle's aesthetics",
          language === 'fr' ? "Finition de couleur carrosserie pour une intégration parfaite" : "Body-coloured finish for perfect integration"
        ],
        'rear-taillight': [
          language === 'fr' ? "Le feu de marche arrière est intégré dans un pare-chocs arrière robuste mais moderne de style plaque de protection." : "The reverse lamp is integrated into a rugged yet modern skid plate-style rear bumper.",
          language === 'fr' ? "Design robuste qui allie fonctionnalité et esthétique moderne" : "Rugged design that combines functionality with modern aesthetics",
          language === 'fr' ? "Intégration parfaite du feu de marche arrière pour une sécurité optimale" : "Perfect integration of reverse lamp for optimal safety"
        ],
        'rear-spoiler': [
          language === 'fr' ? "Les feux arrière et de freinage LED montés en surface, ainsi que les feux de clignotant LED, ont été appliqués pour maximiser la visibilité pour les véhicules qui suivent." : "LED surface-mounted tail and stop lamps, along with LED turn signal lamps, have been applied to maximize visibility for trailing vehicles.",
          language === 'fr' ? "Technologie LED avancée pour une sécurité routière optimale" : "Advanced LED technology for optimal road safety",
          language === 'fr' ? "Design moderne qui améliore la visibilité et l'esthétique" : "Modern design that enhances visibility and aesthetics"
        ],
        'rear-wiper': [
          language === 'fr' ? "Hood garnish" : "Hood garnish",
          language === 'fr' ? "Soutenant diverses activités de plein air - peut être utilisé pour installer des GoPros, des équipements de protection de véhicule, des bâches et plus encore." : "Supporting various outdoor activities - can be used to install GoPros, vehicle protection gear, tarps and more.",
          language === 'fr' ? "Design élégant et fonctionnel pour une expérience de conduite supérieure." : "Elegant and functional design for a superior driving experience."
        ]
      };

      return {
        title: hotspot.title,
        subtitle: hotspot.description,
        video: undefined,
        images: [],
        texts: fakeTexts[hotspotId] || [
          language === 'fr' ? "Fonctionnalité arrière innovante pour une expérience de conduite exceptionnelle." : "Innovative rear functionality for an exceptional driving experience.",
          language === 'fr' ? "Design soigné et technologie avancée pour votre confort." : "Refined design and advanced technology for your comfort.",
          language === 'fr' ? "Qualité et fiabilité au service de votre sécurité." : "Quality and reliability at the service of your safety."
        ]
      };
    }
  };

  const carColors = [
    {
      id: 0,
      name: 'Dandy Blue',
      oneTone: 'https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/TORRES-EVX/section3/20250203173034853_xGt7V7.jpg',
      twoTone: 'https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/TORRES-EVX/section3/20250203173034853_xGt7V7.jpg', // Same image for both tones
      colorSwatch: '#2E5B8A',
      hasTwoTones: false, // This color only has one tone
      vrImages: {
        oneTone: Array.from({ length: 36 }, (_, i) => `https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/TORRES-EVX/vr360/dandy-blue-1tone/${String(i + 1).padStart(2, '0')}.png`),
        twoTone: Array.from({ length: 36 }, (_, i) => `https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/TORRES-EVX/vr360/dandy-blue-1tone/${String(i + 1).padStart(2, '0')}.png`) // Same VR images
      }
    },
    {
      id: 1,
      name: 'Forest Green',
      oneTone: 'https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/TORRES-EVX/section3/20250203173320615_3ptfZ1.jpg',
      twoTone: 'https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/TORRES-EVX/section3/20250203173430333_IWjbnc.jpg',
      colorSwatch: '#228B22',
      hasTwoTones: true, // This color has two tones
      vrImages: {
        oneTone: Array.from({ length: 36 }, (_, i) => `https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/TORRES-EVX/vr360/forest-green-1tone/${String(i + 1).padStart(2, '0')}.png`),
        twoTone: Array.from({ length: 36 }, (_, i) => `https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/TORRES-EVX/vr360/forest-green-2tone/${String(i + 1).padStart(2, '0')}.png`)
      }
    },
    {
      id: 2,
      name: 'Grand White',
      oneTone: 'https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/TORRES-EVX/section3/20250203173653368_Dg3Gcc.jpg',
      twoTone: 'https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/TORRES-EVX/section3/20250203173808063_kZ6btU.jpg',
      colorSwatch: '#FFFFFF',
      hasTwoTones: true,
      vrImages: {
        oneTone: Array.from({ length: 36 }, (_, i) => `https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/TORRES-EVX/vr360/grand-white-1tone/${String(i + 1).padStart(2, '0')}.png`),
        twoTone: Array.from({ length: 36 }, (_, i) => `https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/TORRES-EVX/vr360/grand-white-2tone/${String(i + 1).padStart(2, '0')}.png`)
      }
    },
    {
      id: 3,
      name: 'Iron Metal',
      oneTone: 'https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/TORRES-EVX/section3/20250203174052334_fOGuv2.jpg',
      twoTone: 'https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/TORRES-EVX/section3/20250203174206686_ErrSYH.jpg',
      colorSwatch: '#6B6B6B',
      hasTwoTones: true, // This color has two tones
      vrImages: {
        oneTone: Array.from({ length: 36 }, (_, i) => `https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/TORRES-EVX/vr360/iron-metal-1tone/${String(i + 1).padStart(2, '0')}.png`),
        twoTone: Array.from({ length: 36 }, (_, i) => `https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/TORRES-EVX/vr360/iron-metal-2tone/${String(i + 1).padStart(2, '0')}.png`)
      }
    },
    {
      id: 4,
      name: 'Latte Greige',
      oneTone: 'https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/TORRES-EVX/section3/20250203174447321_dzDFr2.jpg',
      twoTone: 'https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/TORRES-EVX/section3/20250203174605224_AKvtN4.jpg',
      colorSwatch: '#D4C4A8',
      hasTwoTones: true, // This color has two tones
      vrImages: {
        oneTone: Array.from({ length: 36 }, (_, i) => `https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/TORRES-EVX/vr360/latte-greige-1tone/${String(i + 1).padStart(2, '0')}.png`),
        twoTone: Array.from({ length: 36 }, (_, i) => `https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/TORRES-EVX/vr360/latte-greige-2tone/${String(i + 1).padStart(2, '0')}.png`)
      }
    },
    {
      id: 5,
      name: 'Space Black',
      oneTone: 'https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/TORRES-EVX/section3/20250203174846960_pBeHes.jpg',
      twoTone: 'https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/TORRES-EVX/section3/20250203174846960_pBeHes.jpg', // Using same image for both tones since we only have 1-tone
      colorSwatch: '#1A1A1A',
      hasTwoTones: false, // This color only has one tone
      vrImages: {
        oneTone: Array.from({ length: 36 }, (_, i) => `https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/TORRES-EVX/vr360/space-black-1tone/${String(i + 1).padStart(2, '0')}.png`),
        twoTone: Array.from({ length: 36 }, (_, i) => `https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/TORRES-EVX/vr360/space-black-1tone/${String(i + 1).padStart(2, '0')}.png`) // Using same VR images
      }
    }
  ];

  // Handle color selection with automatic tone mode adjustment
  const handleColorSelection = (colorId: number) => {
    setSelectedColor(colorId);
    const color = carColors[colorId];
    // If color only has one tone, automatically set to 1 TONE
    if (!color.hasTwoTones) {
      setToneMode('1 TONE');
    }
  };

  // Get current VR images based on selected color and tone
  const getCurrentVrImages = () => {
    const color = carColors[selectedColor];
    return toneMode === '1 TONE' ? color.vrImages.oneTone : color.vrImages.twoTone;
  };

  // Reset frame when color or tone changes
  useEffect(() => {
    setCurrentFrame(0);
    setTargetFrame(0);
    
    // Debug color selection
    const currentColor = carColors[selectedColor];
    console.log(`Selected color: ${currentColor.name}, Tone: ${toneMode}`);
    console.log(`Image source: ${toneMode === '1 TONE' ? currentColor.oneTone : currentColor.twoTone}`);
  }, [selectedColor, toneMode]);

  // Preload all VR images to prevent glitches during rotation
  useEffect(() => {
    const vrImages = getCurrentVrImages();
    if (!vrImages || vrImages.length === 0) return;

    // Preload all images in the current set
    const imagePromises = vrImages.map((src) => {
      return new Promise((resolve, reject) => {
        const img = new window.Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = src;
        // Set crossOrigin for external images
        if (src.startsWith('http')) {
          img.crossOrigin = 'anonymous';
        }
      });
    });

    // Preload images in background (don't block UI)
    Promise.all(imagePromises).catch((error) => {
      console.warn('Some VR images failed to preload:', error);
    });
  }, [selectedColor, toneMode]);

  // ============================================================================
  // HIGH-PERFORMANCE 360° VR ROTATION SYSTEM
  // ============================================================================
  
  // Frame interpolation with easing for smooth transitions
  const interpolateFrame = (from: number, to: number, progress: number): number => {
    // Easing function for smooth interpolation (ease-out)
    const easeOut = 1 - Math.pow(1 - progress, 3);
    return from + (to - from) * easeOut;
  };

  // Normalize frame to stay within bounds with smooth wrapping
  const normalizeFrame = (frame: number): number => {
    return ((frame % FRAME_COUNT) + FRAME_COUNT) % FRAME_COUNT;
  };

  // No animation loop needed - instant updates only

  // ============================================================================
  // UNIFIED POINTER EVENTS (Mouse + Touch)
  // ============================================================================
  
  const handlePointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    setIsDragging(true);
    setDragStart(e.clientX);
    setLastDragX(e.clientX);
    setLastDragTime(Date.now());
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    
    const currentTime = Date.now();
    const deltaTime = currentTime - lastDragTime;
    const currentX = e.clientX;
    const deltaX = currentX - lastDragX; // Use incremental movement, not total distance
    
    // Apply deadzone - ignore very small movements
    if (Math.abs(deltaX) < DEADZONE_PIXELS) return;
    
    // No velocity calculation needed for instant updates
    
    // Update target frame with precise sensitivity - use incremental movement
    const frameDelta = deltaX * SENSITIVITY;
    const newFrame = normalizeFrame(targetFrame + frameDelta);
    setTargetFrame(newFrame);
    
    setLastDragX(currentX); // Update last position for next incremental calculation
    setLastDragTime(currentTime);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    
    setIsDragging(false);
  };

  // ============================================================================
  // LEGACY MOUSE/TOUCH EVENTS (Fallback for older browsers)
  // ============================================================================
  
  const handleMouseDown = (e: React.MouseEvent) => {
    handlePointerDown(e as any);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    handlePointerMove(e as any);
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    handlePointerUp(e as any);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
    const touch = e.touches[0] || e.changedTouches[0];
    if (touch) {
      const clientX = touch.clientX;
      setDragStart(clientX);
      setLastDragX(clientX);
      setLastDragTime(Date.now());
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    e.stopPropagation();
    
    const touch = e.touches[0] || e.changedTouches[0];
    if (!touch) return;
    
    const currentTime = Date.now();
    const currentX = touch.clientX;
    const deltaX = currentX - lastDragX; // Use incremental movement, not total distance
    
    // Apply deadzone - ignore very small movements
    if (Math.abs(deltaX) < DEADZONE_PIXELS) return;
    
    // Update target frame with precise sensitivity - use incremental movement
    const frameDelta = deltaX * SENSITIVITY;
    const newFrame = normalizeFrame(targetFrame + frameDelta);
    setTargetFrame(newFrame);
    
    setLastDragX(currentX); // Update last position for next incremental calculation
    setLastDragTime(currentTime);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  // ============================================================================
  // SMOOTH FRAME INTERPOLATION WITH EASING
  // ============================================================================
  
  // Smooth animation loop using requestAnimationFrame
  useEffect(() => {
    let animationFrameId: number;
    
    const animate = () => {
      // Get current frame from ref to avoid dependency issues
      const current = currentFrameRef.current;
      
      // Smooth interpolation speed (frames per second)
      const interpolationSpeed = isDragging ? 0.25 : 0.12; // Faster when dragging, slower when not
      
      // Calculate the difference between current and target
      let diff = targetFrame - current;
      
      // Handle wrapping (shortest path around the circle)
      if (Math.abs(diff) > FRAME_COUNT / 2) {
        diff = diff > 0 ? diff - FRAME_COUNT : diff + FRAME_COUNT;
      }
      
      // If difference is very small, snap to target
      if (Math.abs(diff) < 0.01) {
        currentFrameRef.current = targetFrame;
        setCurrentFrame(targetFrame);
      } else {
        // Smooth interpolation with easing
        const step = diff * interpolationSpeed;
        const newFrame = normalizeFrame(current + step);
        currentFrameRef.current = newFrame;
        setCurrentFrame(newFrame);
      }
      
      animationFrameId = requestAnimationFrame(animate);
    };
    
    animationFrameId = requestAnimationFrame(animate);
    
    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [targetFrame, isDragging]);
  
  // Update ref when currentFrame changes externally
  useEffect(() => {
    currentFrameRef.current = currentFrame;
  }, [currentFrame]);

  // Navigation functions for safety carousel
  const nextSafetyCard = () => {
    // Close carousels if open when navigating
    if (isBSDCarouselOpen) {
      setIsBSDCarouselOpen(false);
    }
    if (isAEBCarouselOpen) {
      setIsAEBCarouselOpen(false);
    }
    if (isESCCarouselOpen) {
      setIsESCCarouselOpen(false);
    }
    if (isEnhancedSafetyCarouselOpen) {
      setIsEnhancedSafetyCarouselOpen(false);
    }
    setCurrentSafetyCard((prev) => Math.min(prev + 1, safetyFeatures.length - 3));
  };

  const prevSafetyCard = () => {
    // Close carousels if open when navigating
    if (isBSDCarouselOpen) {
      setIsBSDCarouselOpen(false);
    }
    if (isAEBCarouselOpen) {
      setIsAEBCarouselOpen(false);
    }
    if (isESCCarouselOpen) {
      setIsESCCarouselOpen(false);
    }
    if (isEnhancedSafetyCarouselOpen) {
      setIsEnhancedSafetyCarouselOpen(false);
    }
    setCurrentSafetyCard((prev) => Math.max(prev - 1, 0));
  };

  // Video play function
  const toggleVideo = (videoSrc: string) => {
    if (playingVideo === videoSrc && videoPlaying) {
      // Stop video
      setVideoPlaying(false);
      setPlayingVideo(null);
    } else {
      // Start video
      setPlayingVideo(videoSrc);
      setVideoPlaying(true);
    }
  };

  // Navigation functions for convenience carousel
  const nextConvenienceCard = () => {
    setCurrentConvenienceCard((prev) => Math.min(prev + 1, convenienceFeatures.length - 4));
  };

  const prevConvenienceCard = () => {
    setCurrentConvenienceCard((prev) => Math.max(prev - 1, 0));
  };

  // Navigation functions for performance carousel
  const nextPerformanceCard = () => {
    setCurrentPerformanceCard((prev) => Math.min(prev + 1, performanceFeatures.length - 3));
  };

  const prevPerformanceCard = () => {
    setCurrentPerformanceCard((prev) => Math.max(prev - 1, 0));
  };

  // Swipe handlers for mobile
  const minSwipeDistance = 50;
  const [safetyTouchStart, setSafetyTouchStart] = useState<number | null>(null);
  const [safetyTouchEnd, setSafetyTouchEnd] = useState<number | null>(null);
  const [convenienceTouchStart, setConvenienceTouchStart] = useState<number | null>(null);
  const [convenienceTouchEnd, setConvenienceTouchEnd] = useState<number | null>(null);
  const [performanceTouchStart, setPerformanceTouchStart] = useState<number | null>(null);
  const [performanceTouchEnd, setPerformanceTouchEnd] = useState<number | null>(null);

  const onSafetyTouchStart = (e: React.TouchEvent) => {
    setSafetyTouchEnd(null);
    setSafetyTouchStart(e.targetTouches[0].clientX);
  };

  const onSafetyTouchMove = (e: React.TouchEvent) => {
    setSafetyTouchEnd(e.targetTouches[0].clientX);
  };

  const onSafetyTouchEnd = () => {
    if (!safetyTouchStart || !safetyTouchEnd) return;
    const distance = safetyTouchStart - safetyTouchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    
    if (isLeftSwipe && currentSafetyCard < safetyFeatures.length - 1) {
      setCurrentSafetyCard((prev) => prev + 1);
    }
    if (isRightSwipe && currentSafetyCard > 0) {
      setCurrentSafetyCard((prev) => prev - 1);
    }
  };

  const onConvenienceTouchStart = (e: React.TouchEvent) => {
    setConvenienceTouchEnd(null);
    setConvenienceTouchStart(e.targetTouches[0].clientX);
  };

  const onConvenienceTouchMove = (e: React.TouchEvent) => {
    setConvenienceTouchEnd(e.targetTouches[0].clientX);
  };

  const onConvenienceTouchEnd = () => {
    if (!convenienceTouchStart || !convenienceTouchEnd) return;
    const distance = convenienceTouchStart - convenienceTouchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    
    if (isLeftSwipe && currentConvenienceCard < convenienceFeatures.length - 1) {
      setCurrentConvenienceCard((prev) => prev + 1);
    }
    if (isRightSwipe && currentConvenienceCard > 0) {
      setCurrentConvenienceCard((prev) => prev - 1);
    }
  };

  const onPerformanceTouchStart = (e: React.TouchEvent) => {
    setPerformanceTouchEnd(null);
    setPerformanceTouchStart(e.targetTouches[0].clientX);
  };

  const onPerformanceTouchMove = (e: React.TouchEvent) => {
    setPerformanceTouchEnd(e.targetTouches[0].clientX);
  };

  const onPerformanceTouchEnd = () => {
    if (!performanceTouchStart || !performanceTouchEnd) return;
    const distance = performanceTouchStart - performanceTouchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    
    if (isLeftSwipe && currentPerformanceCard < performanceFeatures.length - 1) {
      setCurrentPerformanceCard((prev) => prev + 1);
    }
    if (isRightSwipe && currentPerformanceCard > 0) {
      setCurrentPerformanceCard((prev) => prev - 1);
    }
  };

  // Toggle specification accordion
  const toggleSpecificationAccordion = (index: number) => {
    setActiveSpecificationAccordion(activeSpecificationAccordion === index ? null : index);
  };

  // Specification carousel navigation
  const nextSpecImage = () => {
    setCurrentSpecImage((prev) => (prev + 1) % specImages.length);
  };
  const prevSpecImage = () => {
    setCurrentSpecImage((prev) => (prev - 1 + specImages.length) % specImages.length);
  };

  // Accordion toggle
  const toggleAccordion = (index: number) => {
    setActiveAccordion(activeAccordion === index ? -1 : index);
  };


  return (
    <div className="min-h-screen bg-black text-white w-full overflow-x-hidden">
      <SEO
        title="KGM Torres EVX | SUV Électrique Premium au Maroc"
        description="Découvrez le KGM Torres EVX, SUV électrique premium au Maroc. Technologie électrique avancée, autonomie exceptionnelle, design moderne. Réservez votre essai."
        keywords="KGM Torres EVX, SUV électrique Maroc, Torres EVX prix, véhicule électrique, KGM Mobility"
        titleFr="KGM Torres EVX | SUV Électrique Premium au Maroc"
        descriptionFr="Découvrez le KGM Torres EVX, SUV électrique premium au Maroc. Technologie électrique avancée, autonomie exceptionnelle, design moderne. Réservez votre essai."
        keywordsFr="KGM Torres EVX, SUV électrique Maroc, Torres EVX prix, véhicule électrique, KGM Mobility"
      />
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative h-screen overflow-hidden">
        {/* Background Video */}
        <div className="absolute inset-0 z-0">
          <video
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover"
            onLoadedData={() => setIsVideoLoaded(true)}
          >
            <source src="https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/TORRES-EVX/hero/20250203171024125_y4BawO.mp4" type="video/mp4" />
            {/* Fallback image if video doesn't load */}
            <Image
              src="https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/Tivoli/20250123100604289_9mmu8c.png"
              alt="TIVOLI"
              fill
              className="object-cover"
            />
          </video>
          
          {/* Orange/red glow overlay - matching the image */}
          <div className="absolute inset-0 bg-gradient-to-br from-kgm-amber/10 via-transparent to-transparent" />
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-3/4 h-1/2 bg-gradient-to-t from-kgm-amber/40 via-kgm-amber/20 to-transparent rounded-full blur-3xl" />
        </div>

        {/* Content Overlay */}
        <div className="relative z-10 h-full flex flex-col">
          {/* Spacer to push content to bottom */}
          <div className="flex-1"></div>
          
          {/* Mobile Content - Title, Features, and Buttons */}
          <div className="lg:hidden absolute bottom-0 left-0 right-0 z-20 px-4 pb-6">
            <div className="max-w-4xl mx-auto">
              {/* Text Info - Title and Subtitle */}
              <div className="text-info mb-4">
                <h2 className="text-4xl font-bold uppercase tracking-tight mb-2 text-white">
                  <span>TORRES EVX</span>
                </h2>
                <p className="text-lg text-white font-light">
                  <span>{language === 'fr' ? "Véhicule électrique intelligent" : "Smart electric vehicle"}</span>
                </p>
              </div>

              {/* Selling Points - 3 Cards in Row Layout */}
              <div className="selling-point mb-4">
                {features.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 + index * 0.2 }}
                    className="selling-point__box"
                  >
                    <div className="selling-point__img">
                      <Image
                        src={feature.icon}
                        alt={feature.description}
                        width={40}
                        height={40}
                        className="w-10 h-10"
                      />
                    </div>
                    <div className="selling-point__text">
                      <p className="point-text">
                        {feature.title}
                      </p>
                      <p className="point-title">
                        {feature.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Button Group */}
              <div className="btn-group">
                <motion.a
                  href="/book-test-drive?model=torres-evx"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 1 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn"
                >
                  {language === 'fr' ? "Réservez Votre Essai" : "Book Your Test Drive"}
                </motion.a>
              </div>
            </div>
          </div>
          
          {/* Bottom Content - TORRES EVX title, subtitle, and buttons - Desktop only */}
          <div className="hidden lg:flex justify-center lg:justify-start px-8 sm:px-12 lg:px-16 pb-16">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="max-w-2xl"
            >
              {/* Model Name - smaller size */}
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="text-4xl lg:text-5xl font-bold uppercase tracking-tight mb-4"
                style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)' }}
              >
                TORRES EVX
              </motion.h1>

              {/* Subtitle - smaller size */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="text-lg lg:text-xl text-white mb-8 font-light"
                style={{ fontSize: 'clamp(1rem, 2vw, 1.5rem)' }}
              >
                {language === 'fr' ? "Véhicule électrique intelligent" : "Smart electric vehicle"}
              </motion.p>

              {/* Action Buttons - smaller size */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <motion.a
                  href="/book-test-drive?model=torres-evx"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-3 bg-kgm-amber/90 border border-kgm-amber text-white font-semibold uppercase tracking-wide hover:bg-kgm-amber transition-all duration-300 rounded-sm text-sm"
                  style={{ minWidth: '120px' }}
                >
                  {language === 'fr' ? "Réservez Votre Essai" : "Book Your Test Drive"}
                </motion.a>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Feature Boxes - Bottom Right - smaller size */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="absolute bottom-8 right-8 z-20 hidden lg:block"
        >
          <div className="flex gap-4">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.2 + index * 0.2 }}
                whileHover={{ scale: 1.05 }}
                className="bg-black/20 backdrop-blur-sm border border-kgm-amber p-4 rounded-lg"
                style={{ 
                  minWidth: '200px',
                  maxWidth: '220px'
                }}
              >
                <div className="flex items-start gap-4">
                  <div className="text-white flex-shrink-0">
                    <Image
                      src={feature.icon}
                      alt={feature.title}
                      width={32}
                      height={32}
                      className="w-8 h-8"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-white/70 font-light text-sm mb-1">
                      {feature.title}
                    </h3>
                    <p className="text-white font-bold text-base leading-tight">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>


       {/* Second Section - Scroll-based Video and Text Animation */}
       <section ref={section2Ref} className="relative  bg-black overflow-hidden">
         {/* Video Container - Centered and responsive to scroll */}
         <div className="absolute inset-0 z-0 flex items-center justify-center">
           <motion.div
             className="relative h-full"
             style={{ width: videoWidth }}
           >
             <video
               autoPlay
               muted
               loop
               playsInline
               className="w-full  object-cover"
             >
               <source src="https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/TORRES-EVX/section1/20250203171719464_RaJoQB.mp4" type="video/mp4" />
             </video>
             
             {/* Dark overlay for text readability */}
             <div className="absolute inset-0 bg-black/30" />
           </motion.div>
         </div>

  

         {/* Scroll indicator */}
         <motion.div
           className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20"
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           transition={{ delay: 1 }}
         >
           <motion.div
             animate={{ y: [0, 10, 0] }}
             transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
             className="text-white/70"
           >
             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
             </svg>
           </motion.div>
         </motion.div>
       </section>

      {/* Second Section - Video with Scroll Animation */}
      <section ref={section2Ref} className="relative h-screen bg-black overflow-hidden z-20">
        {/* Solid black background to ensure no overlap */}
        <div className="absolute inset-0 bg-black z-0"></div>
        
        {/* Video Container */}
        <div className="relative w-full h-full flex items-center justify-center z-10">
          <motion.video
            autoPlay
            muted
            loop
            playsInline
            className="object-cover"
            style={{
              width: videoWidth,
              height: videoHeight,
            }}
          >
            <source src="https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/TORRES-EVX/section1/20250203171719464_RaJoQB.mp4" type="video/mp4" />
          </motion.video>
        </div>

        {/* Text Overlay - Changes size based on scroll */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center z-10"
          style={{
            opacity: textOpacity
          }}
        >
          <motion.h2
            className="text-white font-bold uppercase text-center px-8"
            style={{
              fontSize: textSize,
              lineHeight: textLineHeight,
              textShadow: '2px 2px 4px rgba(0,0,0,0.8)'
            }}
          >
{language === 'fr' ? "DESIGN ACCROCHEUR" : "EYE-CATCHING DESIGN"}
          </motion.h2>
        </motion.div>

       </section>

       {/* Exterior Section */}
       <section className="relative min-h-[41vh] lg:min-h-[800px] bg-gradient-to-b from-black via-gray-900 to-black overflow-hidden py-8 lg:py-16">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-100 to-black"></div>
        
        {/* Header */}
        <div className="relative z-10 pt-8 lg:pt-16 text-center">
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-white text-lg uppercase tracking-wide mb-4"
          >
            {language === 'fr' ? "EXTÉRIEUR" : "EXTERIOR"}
          </motion.h3>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-kgm-amber text-3xl lg:text-4xl font-bold uppercase tracking-wide mb-8 lg:mb-0"
          >
{language === 'fr' ? "ESPRIT & HÉRITAGE DE KGM" : "SPIRIT & HERITAGE OF KGM"}
          </motion.h2>
        </div>

        {/* Front/Rear Toggle */}
        <div className="relative z-20 flex justify-center mt-8 lg:mt-0">
          <div className="bg-gray-800 rounded-lg p-1 flex">
            <button
              onClick={() => setViewAngle('front')}
              className={`px-6 py-3 rounded-md flex items-center gap-2 transition-all duration-300 ${
                viewAngle === 'front'
                  ? 'bg-kgm-amber text-black shadow-lg'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
{language === 'fr' ? "Avant" : "Front"}
            </button>
            <button
              onClick={() => setViewAngle('rear')}
              className={`px-6 py-3 rounded-md flex items-center gap-2 transition-all duration-300 ${
                viewAngle === 'rear'
                  ? 'bg-kgm-amber text-black shadow-lg'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
{language === 'fr' ? "Arrière" : "Rear"}
            </button>
          </div>
        </div>

        {/* Car Display */}
        <div className="relative z-10 flex-1 flex items-center justify-center mt-20 lg:mt-8 -top-[122px] lg:top-0">
          <motion.div
            initial={{ opacity: 1, scale: 1 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0 }}
            className="relative w-full max-w-[90%] lg:max-w-none h-[35vh] lg:h-[600px] flex items-center justify-center mb-20 lg:mb-40"
          >
            <Image
              src={viewAngle === 'front' 
                ? "https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/TORRES-EVX/section2/20250210191509697_EtVnAP.png"
                : "https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/TORRES-EVX/section2/20250203172442922_6HRgNo.png"
              }
              alt={`TORRES EVX ${viewAngle} view`}
              fill
              className="object-contain"
              style={{ 
                backgroundColor: 'transparent',
                mixBlendMode: 'normal'
              }}
            />

            {/* Interactive Hotspots */}
            {carHotspots.map((hotspot) => (
              <motion.button
                key={hotspot.id}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                className="absolute w-4 h-4 lg:w-8 lg:h-8 bg-kgm-amber rounded-full flex items-center justify-center text-black font-bold text-xs lg:text-lg shadow-lg hover:bg-kgm-amber/80 transition-all duration-300"
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
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
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
      <section className="relative bg-black overflow-hidden mt-16">


        {/* Car Display Area */}
        <div className="relative z-10 flex-1 flex items-center justify-center mt-8">
          {(viewMode as 'color' | 'vr') === 'color' ? (
            <motion.div
              key={`${selectedColor}-${toneMode}`}
              initial={{ opacity: 1, scale: 1 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0 }}
              className="relative w-full h-[500px] flex items-center justify-center bg-black"
            >
              <Image
                key={`${selectedColor}-${toneMode}`}
                src={toneMode === '1 TONE' ? carColors[selectedColor].oneTone : carColors[selectedColor].twoTone}
                alt={`TORRES in ${carColors[selectedColor].name} - ${toneMode}`}
                fill
                className="object-cover w-full h-full"
                priority
                style={{ 
                  backgroundColor: 'black',
                  mixBlendMode: 'normal'
                }}
              />
            
            {/* Top Navigation Buttons */}
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-20">
              <motion.div
                initial={{ opacity: 1, y: 0 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0 }}
                className="flex bg-white/20 backdrop-blur-sm rounded-full p-1"
              >
                <button
                  onClick={() => setViewMode('color')}
                  className={`px-6 py-3 rounded-full flex items-center gap-2 transition-all duration-300 ${
                    (viewMode as 'color' | 'vr') === 'color'
                      ? 'bg-blue-600 text-white'
                      : 'text-white hover:bg-white/20'
                  }`}
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                  </svg>
                  {language === 'fr' ? "Palette de Couleurs" : "Color Board"}
                </button>
                <button
                  onClick={() => setViewMode('vr')}
                  className={`px-6 py-3 rounded-full flex items-center gap-2 transition-all duration-300 ${
                    (viewMode as 'color' | 'vr') === 'vr'
                      ? 'bg-blue-600 text-white'
                      : 'text-white hover:bg-white/20'
                  }`}
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                  {language === 'fr' ? "360° VR" : "360° VR"}
                </button>
              </motion.div>
            </div>

            {/* Color Selection Panel - Inside Image */}
            <div className="absolute bottom-4 lg:bottom-8 left-1/2 transform -translate-x-1/2 z-20">
              <motion.div
                initial={{ opacity: 1, y: 0 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0 }}
                className="bg-white/20 backdrop-blur-sm rounded-lg lg:rounded-2xl p-2 lg:p-4 max-w-[98%] lg:max-w-2xl mx-auto shadow-2xl"
              >
                {/* Current Color Name */}
                <div className="text-center mb-1.5 lg:mb-4">
                  <h3 className="text-xs lg:text-lg font-bold text-white">
                    {carColors[selectedColor].name}
                  </h3>
                </div>

                {/* Color Swatches */}
                <div className="flex justify-center gap-1 lg:gap-3 mb-1.5 lg:mb-4">
                  {carColors.map((color) => (
                    <motion.button
                      key={color.id}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleColorSelection(color.id)}
                      className={`rounded-full border-2 transition-all duration-300 ${
                        selectedColor === color.id
                          ? 'border-white scale-110'
                          : 'border-white/50 hover:border-white'
                      }`}
                      style={{ 
                        backgroundColor: color.colorSwatch,
                        width: '18px',
                        height: '18px'
                      }}
                    >
                      {selectedColor === color.id && (
                        <div className="w-full h-full rounded-full flex items-center justify-center">
                          <svg className="text-white w-2 h-2 lg:w-3 lg:h-3" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                          </svg>
                        </div>
                      )}
                    </motion.button>
                  ))}
                </div>

                {/* Tone Options - Only show if color has two tones */}
                {carColors[selectedColor].hasTwoTones && (
                <div className="flex justify-center gap-3 lg:gap-8">
                  <label className="flex items-center gap-1 lg:gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="tone"
                      value="1 TONE"
                      checked={toneMode === '1 TONE'}
                      onChange={(e) => setToneMode(e.target.value as '1 TONE' | '2 TONE')}
                      className="w-2.5 h-2.5 lg:w-4 lg:h-4 text-blue-600"
                    />
                    <span className="text-white font-semibold text-[9px] lg:text-sm">{language === 'fr' ? "1 TONE" : "1 TONE"}</span>
                  </label>
                  <label className="flex items-center gap-1 lg:gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="tone"
                      value="2 TONE"
                      checked={toneMode === '2 TONE'}
                      onChange={(e) => setToneMode(e.target.value as '1 TONE' | '2 TONE')}
                      className="w-2.5 h-2.5 lg:w-4 lg:h-4 text-blue-600"
                    />
                    <span className="text-white font-semibold text-[9px] lg:text-sm">{language === 'fr' ? "Bi-ton" : "2 TONE"}</span>
                  </label>
                </div>
                )}
              </motion.div>
            </div>

            {/* Disclaimer Text */}
            <div className="hidden md:block absolute bottom-4 left-4 lg:bottom-8 lg:left-8 text-left max-w-md pl-4 lg:pl-8 z-30">
              <p
                className="text-white text-[8px] lg:text-xs leading-tight lg:leading-relaxed font-medium"
                style={{
                  textShadow:
                    "2px 2px 4px rgba(0, 0, 0, 1), -1px -1px 2px rgba(0, 0, 0, 1), 1px -1px 2px rgba(0, 0, 0, 1), -1px 1px 2px rgba(0, 0, 0, 1)",
                }}
              >
                {language === 'fr' ? "* Les images de ce véhicule sont fournies à titre indicatif uniquement et peuvent différer du produit réel." : "* Images of this vehicle are for reference only and may differ from the actual product."}
              </p>
              <p
                className="text-white text-[8px] lg:text-xs leading-tight lg:leading-relaxed mt-0.5 lg:mt-1 font-medium"
                style={{
                  textShadow:
                    "2px 2px 4px rgba(0, 0, 0, 1), -1px -1px 2px rgba(0, 0, 0, 1), 1px -1px 2px rgba(0, 0, 0, 1), -1px 1px 2px rgba(0, 0, 0, 1)",
                }}
              >
                {language === 'fr' ? "* Chaque couleur est arrangée de gauche à droite selon la préférence des clients." : "* Each color is arranged from left to right in order of customer preference."}
              </p>
            </div>
            </motion.div>
          ) : (
            /* 360° VR View */
            <motion.div
              key="vr-view"
              initial={{ opacity: 1, scale: 1 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0 }}
              className="relative w-full h-[500px] flex items-center justify-center bg-black"
            >
              {/* 360° VR Background */}
              <Image
                src="https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/Tivoli/section3/bg%20360vr/rotate-bg.png"
                alt="360° VR Background"
                fill
                className="object-cover w-full h-full"
                priority
                style={{ 
                  backgroundColor: 'black',
                  mixBlendMode: 'normal'
                }}
              />
              
              {/* 360° VR Viewer */}
              {getCurrentVrImages().length > 0 ? (
                <div 
                  className={`absolute inset-0 z-10 select-none ${
                    isDragging ? 'cursor-grabbing' : 'cursor-grab'
                  }`}
                  onPointerDown={handlePointerDown}
                  onPointerMove={handlePointerMove}
                  onPointerUp={handlePointerUp}
                  onPointerLeave={handlePointerUp}
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp}
                  onTouchStart={handleTouchStart}
                  onTouchMove={handleTouchMove}
                  onTouchEnd={handleTouchEnd}
                  style={{ 
                    width: '100%', 
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    touchAction: 'none',
                    WebkitTouchCallout: 'none',
                    WebkitUserSelect: 'none',
                    userSelect: 'none'
                  }}
                >
                  {/* Crossfade between two frames for smooth transitions */}
                  {(() => {
                    const vrImages = getCurrentVrImages();
                    if (!vrImages || vrImages.length === 0) return null;
                    
                    const safeCurrentFrame = isNaN(currentFrame) || currentFrame < 0 ? 0 : currentFrame;
                    const currentFrameIndex = Math.floor(safeCurrentFrame) % FRAME_COUNT;
                    const nextFrameIndex = (currentFrameIndex + 1) % FRAME_COUNT;
                    const fractional = safeCurrentFrame - Math.floor(safeCurrentFrame);
                    const currentOpacity = Math.max(0, Math.min(1, 1 - fractional));
                    const nextOpacity = Math.max(0, Math.min(1, fractional));
                    
                    if (!vrImages[currentFrameIndex] || !vrImages[nextFrameIndex]) return null;
                    
                    return (
                      <>
                        {/* Current frame */}
                        <Image
                          key={`${toneMode}-${currentFrameIndex}-current`}
                          src={vrImages[currentFrameIndex]}
                          alt={`360° View - Frame ${currentFrameIndex + 1}/${FRAME_COUNT}`}
                          width={800}
                          height={600}
                          unoptimized
                          priority={currentFrameIndex < 3}
                          loading={currentFrameIndex < 3 ? 'eager' : 'lazy'}
                          className="object-contain"
                          style={{ 
                            position: 'absolute',
                            backgroundColor: 'transparent',
                            mixBlendMode: 'normal',
                            filter: isDragging ? 'brightness(1.1)' : 'brightness(1)',
                            opacity: currentOpacity,
                            transition: 'opacity 0.15s ease-out',
                            willChange: 'opacity',
                            left: '50%',
                            top: '50%',
                            transform: 'translate(-50%, -50%)',
                            zIndex: 1,
                            maxWidth: '100vw',
                            maxHeight: '100%',
                            width: 'auto',
                            height: 'auto',
                            minWidth: '200px',
                            imageRendering: 'auto'
                          }}
                        />
                        {/* Next frame (for crossfade) */}
                        <Image
                          key={`${toneMode}-${nextFrameIndex}-next`}
                          src={vrImages[nextFrameIndex]}
                          alt={`360° View - Frame ${nextFrameIndex + 1}/${FRAME_COUNT}`}
                          width={800}
                          height={600}
                          unoptimized
                          priority={nextFrameIndex < 3}
                          loading={nextFrameIndex < 3 ? 'eager' : 'lazy'}
                          className="object-contain"
                          style={{ 
                            position: 'absolute',
                            backgroundColor: 'transparent',
                            mixBlendMode: 'normal',
                            filter: isDragging ? 'brightness(1.1)' : 'brightness(1)',
                            opacity: nextOpacity,
                            transition: 'opacity 0.15s ease-out',
                            willChange: 'opacity',
                            left: '50%',
                            top: '50%',
                            transform: 'translate(-50%, -50%)',
                            zIndex: 2,
                            maxWidth: '100vw',
                            maxHeight: '100%',
                            width: 'auto',
                            height: 'auto',
                            minWidth: '200px',
                            imageRendering: 'auto'
                          }}
                        />
                      </>
                    );
                  })()}
                </div>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center z-10">
                  <div className="text-center text-white">
                    <h3 className="text-2xl font-bold mb-4">360° VR View</h3>
                    <p className="text-lg opacity-80">VR images not available for this color/tone combination</p>
                  </div>
                </div>
              )}
              
              {/* Top Navigation Buttons */}
              <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-20">
                <motion.div
                  initial={{ opacity: 1, y: 0 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0 }}
                  className="flex bg-white/20 backdrop-blur-sm rounded-full p-1"
                >
                  <button
                    onClick={() => setViewMode('color')}
                    className={`px-6 py-3 rounded-full flex items-center gap-2 transition-all duration-300 ${
                      (viewMode as 'color' | 'vr') === 'color'
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
                      (viewMode as 'color' | 'vr') === 'vr'
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

              {/* Color Selection Panel - Inside VR View */}
              <div className="absolute bottom-8 lg:bottom-12 left-1/2 transform -translate-x-1/2 z-20">
                <motion.div
                  initial={{ opacity: 1, y: 0 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0 }}
                  className="bg-white/20 backdrop-blur-sm rounded-lg lg:rounded-2xl p-2 lg:p-4 max-w-[98%] lg:max-w-2xl mx-auto shadow-2xl"
                >
                  {/* Current Color Name */}
                  <div className="text-center mb-1.5 lg:mb-4">
                    <h3 className="text-xs lg:text-lg font-bold text-white">
                      {carColors[selectedColor].name}
                    </h3>
                  </div>

                  {/* Color Swatches */}
                  <div className="flex justify-center gap-1 lg:gap-3 mb-1.5 lg:mb-4">
                    {carColors.map((color) => (
                      <motion.button
                        key={color.id}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleColorSelection(color.id)}
                        className={`rounded-full border-2 transition-all duration-300 ${
                          selectedColor === color.id
                            ? 'border-white scale-110'
                            : 'border-white/50 hover:border-white'
                        }`}
                        style={{ 
                          backgroundColor: color.colorSwatch,
                          width: '18px',
                          height: '18px'
                        }}
                      >
                        {selectedColor === color.id && (
                          <div className="w-full h-full rounded-full flex items-center justify-center">
                            <svg className="text-white w-2 h-2 lg:w-3 lg:h-3" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                            </svg>
                          </div>
                        )}
                      </motion.button>
                    ))}
                  </div>

                  {/* Tone Options - Only show if color has two tones */}
                  {carColors[selectedColor].hasTwoTones && (
                  <div className="flex justify-center gap-3 lg:gap-8">
                    <label className="flex items-center gap-1 lg:gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="tone"
                        value="1 TONE"
                        checked={toneMode === '1 TONE'}
                        onChange={(e) => setToneMode(e.target.value as '1 TONE' | '2 TONE')}
                        className="w-2.5 h-2.5 lg:w-4 lg:h-4 text-blue-600"
                      />
                      <span className="text-white font-semibold text-[9px] lg:text-sm">1 TONE</span>
                    </label>
                    <label className="flex items-center gap-1 lg:gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="tone"
                        value="2 TONE"
                        checked={toneMode === '2 TONE'}
                        onChange={(e) => setToneMode(e.target.value as '1 TONE' | '2 TONE')}
                        className="w-2.5 h-2.5 lg:w-4 lg:h-4 text-blue-600"
                      />
                      <span className="text-white font-semibold text-[9px] lg:text-sm">{language === 'fr' ? "Bi-ton" : "2 TONE"}</span>
                    </label>
                  </div>
                  )}
                </motion.div>
              </div>

              {/* Disclaimer Text */}
              <div className="hidden md:block absolute bottom-4 left-4 lg:bottom-8 lg:left-8 text-left max-w-md pl-4 lg:pl-8 z-30">
                <p
                  className="text-white text-[8px] lg:text-xs leading-tight lg:leading-relaxed font-medium"
                  style={{
                    textShadow:
                      "2px 2px 4px rgba(0, 0, 0, 1), -1px -1px 2px rgba(0, 0, 0, 1), 1px -1px 2px rgba(0, 0, 0, 1), -1px 1px 2px rgba(0, 0, 0, 1)",
                  }}
                >
                  {language === 'fr' ? "* Les images de ce véhicule sont fournies à titre indicatif uniquement et peuvent différer du produit réel." : "* Images of this vehicle are for reference only and may differ from the actual product."}
                </p>
                <p
                  className="text-white text-[8px] lg:text-xs leading-tight lg:leading-relaxed mt-0.5 lg:mt-1 font-medium"
                  style={{
                    textShadow:
                      "2px 2px 4px rgba(0, 0, 0, 1), -1px -1px 2px rgba(0, 0, 0, 1), 1px -1px 2px rgba(0, 0, 0, 1), -1px 1px 2px rgba(0, 0, 0, 1)",
                  }}
                >
                  {language === 'fr' ? "* Chaque couleur est arrangée de gauche à droite selon la préférence des clients." : "* Each color is arranged from left to right in order of customer preference."}
                </p>
              </div>
            </motion.div>
          )}
        </div>

        {/* Section 4: Modern & Sleek Display */}
        <section ref={section4Ref} className="relative h-screen bg-black overflow-hidden">
          <motion.div 
            className="sticky top-0 w-full h-screen flex items-center justify-center"
            style={{
              position: 'sticky',
              top: 0,
              zIndex: 1
            }}
          >
            {/* Background Image (appears first) */}
            <motion.div
              className="absolute inset-0 w-full h-full"
              style={{
                backgroundImage: 'url(https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/TORRES-EVX/section4/20250220173530705_IEcme9.png)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
              }}
            />
            
            {/* Background Video */}
            <motion.div
              className="relative h-full flex items-center justify-center"
              style={{
                width: section4VideoWidth,
                height: "100%"
              }}
            >
              <video
                className="w-full h-full object-cover"
                autoPlay
                muted
                loop
                playsInline
              >
                <source src="https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/TORRES-EVX/section2/20250210195807318_NDXvEO.mp4?v=2" type="video/mp4" />
              </video>
              
              {/* Text Overlay */}
              <motion.div
                className="absolute inset-0 flex items-center justify-center z-10"
                style={{
                  scale: section4TextScale,
                  opacity: 1
                }}
              >
                <h2 
                  className="text-white font-bold text-center leading-tight"
                  style={{
                    fontSize: '70px',
                    textShadow: '2px 2px 4px rgba(0,0,0,0.8)'
                  }}
                >
{language === 'fr' ? "Intelligence et connectivité" : "Intelligence and connectivity"}
                </h2>
              </motion.div>
            </motion.div>
          </motion.div>
        </section>

        {/* Section 5: Interior Features & Colors */}
        <section className="relative bg-black overflow-hidden">
          {/* Header */}
          <div className="absolute top-0 left-0 right-0 md:top-8 md:left-1/2 md:transform md:-translate-x-1/2 z-20 text-center px-0 md:px-4" style={{ bottom: isMobile ? 'calc(21vh + 5px)' : undefined }}>
            <h2 className="text-kgm-amber text-sm font-light mb-2">
              {language === 'fr' ? (
                <>
                  <span
                    className="font-bold text-white"
                    style={{
                      textShadow:
                        "2px 2px 4px rgba(0, 0, 0, 1), -1px -1px 2px rgba(0, 0, 0, 1), 1px -1px 2px rgba(0, 0, 0, 1), -1px 1px 2px rgba(0, 0, 0, 1)",
                    }}
                  >
                    INTÉRIEUR
                  </span>
                </>
              ) : (
                <>
                  <span
                    className="font-bold text-white"
                    style={{
                      textShadow:
                        "2px 2px 4px rgba(0, 0, 0, 1), -1px -1px 2px rgba(0, 0, 0, 1), 1px -1px 2px rgba(0, 0, 0, 1), -1px 1px 2px rgba(0, 0, 0, 1)",
                    }}
                  >
                    INTERIOR
                  </span>
                </>
              )}
            </h2>
          </div>

          {/* First Interior Image - Driver's Perspective with Panoramic Display */}
          <div className="relative w-full h-[35vh] md:h-screen flex items-center justify-center overflow-hidden px-0 md:px-4">
            <div className="absolute left-0 right-0 bottom-0 top-auto md:inset-x-0 md:top-0 md:h-full h-[60%]" style={{ bottom: isMobile ? '5px' : undefined }}>
              <Image
                src="https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/TORRES-EVX/section2/20250210152823073_yBJJ6x.jpg"
                alt="Driver's Perspective with Panoramic Display"
                fill
                className="object-contain md:object-cover"
                priority
                quality={90}
              />
            </div>
            
            {/* Interactive Interior Hotspots */}
            {interiorHotspots.map((hotspot) => {
              // Calculate adjusted position for mobile (image container is 60% height, positioned at bottom with 5px margin)
              // Convert from top-based to bottom-based positioning
              const yPercent = parseFloat(hotspot.position.y);
              // Image is 60% height at bottom, so: bottom position = 60% - (yPercent * 0.6)
              const adjustedYFromBottom = 60 - (yPercent * 0.6) + 4; // Calculate from bottom, add small offset
              
              // Calculate adjusted X position for mobile (move slightly to the left)
              const xPercent = parseFloat(hotspot.position.x);
              const adjustedX = isMobile ? xPercent - 3 : xPercent; // Move 3% to the left on mobile
              
              return (
                <motion.button
                  key={hotspot.id}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  className="absolute w-5 h-5 md:w-8 md:h-8 bg-kgm-amber rounded-full flex items-center justify-center text-black font-bold text-xs md:text-lg shadow-lg hover:bg-kgm-amber/80 transition-all duration-300 z-30"
                  style={{
                    left: isMobile ? `${adjustedX}%` : hotspot.position.x,
                    bottom: isMobile ? `calc(${adjustedYFromBottom}% - 15px)` : undefined,
                    top: isMobile ? undefined : hotspot.position.y,
                    transform: 'translate(-50%, 50%)'
                  }}
                  onClick={() => handleInteriorHotspotClick(hotspot.id)}
                >
                  +
                </motion.button>
              );
            })}

            {/* Interior Feature Sidebar Component - Inside this specific image */}
            <CarFeatureSidebar
              isOpen={isInteriorSideMenuOpen}
              onClose={closeInteriorSideMenu}
              selectedHotspot={selectedInteriorHotspot}
              getHotspotContent={getInteriorHotspotContent}
              currentHotspotImage={currentInteriorHotspotImage}
              setCurrentHotspotImage={setCurrentInteriorHotspotImage}
              sectionType="interior"
            />
          </div>

          {/* Second Interior Image - Charcoal Black */}
          <div className="relative w-full h-screen flex items-center justify-center">
            <Image
              src="https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/TORRES-EVX/section2/20250203181151145_Z4nX0i.jpg"
              alt="Charcoal Black Interior"
              fill
              className="object-cover"
              quality={90}
            />
            
            {/* Color Scheme Text Overlay */}
            <div className="absolute bottom-8 left-8 z-30">
              <h3 className="text-white text-4xl md:text-5xl font-bold mb-2">{language === 'fr' ? "NOIR CHARBON" : "CHARCOAL BLACK"}</h3>
              <div className="bg-black/70 backdrop-blur-sm px-4 py-2 rounded-lg">
                <p className="text-white text-sm">{language === 'fr' ? "* Les photos et descriptions sont à titre indicatif uniquement et peuvent différer du produit réel." : "* The photos and descriptions are for reference only and may differ from the actual product."}</p>
              </div>
            </div>
          </div>

          {/* Third Interior Image - Rawhide Brown */}
          <div className="relative w-full h-screen flex items-center justify-center">
            <Image
              src="https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/TORRES-EVX/section2/20250203181207795_Rw5jIy.jpg"
              alt="Rawhide Brown Interior"
              fill
              className="object-cover"
              quality={90}
            />
            
            {/* Color Scheme Text Overlay */}
            <div className="absolute bottom-8 left-8 z-30">
              <h3 className="text-white text-4xl md:text-5xl font-bold mb-2">{language === 'fr' ? "BRUN CUIR" : "RAWHIDE BROWN"}</h3>
              <div className="bg-black/70 backdrop-blur-sm px-4 py-2 rounded-lg">
                <p className="text-white text-sm">{language === 'fr' ? "* Les photos et descriptions sont à titre indicatif uniquement et peuvent différer du produit réel." : "* The photos and descriptions are for reference only and may differ from the actual product."}</p>
              </div>
            </div>
          </div>

          {/* Fourth Interior Image - Teal Grey & Greige White Bi-ton */}
          <div className="relative w-full h-screen flex items-center justify-center">
            <Image
              src="https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/TORRES-EVX/section2/20250203181224550_z1PZsS.jpg"
              alt="Teal Grey & Greige White Bi-ton Interior"
              fill
              className="object-cover"
              quality={90}
            />
            
            {/* Color Scheme Text Overlay */}
            <div className="absolute bottom-8 left-8 z-30">
              <h3 className="text-white text-4xl md:text-5xl font-bold mb-2">{language === 'fr' ? "GRIS SARCEL & BLANC GREIGE BI-TON" : "TEAL GREY & GREIGE WHITE BI-TONE"}</h3>
              <div className="bg-black/70 backdrop-blur-sm px-4 py-2 rounded-lg">
                <p className="text-white text-sm">{language === 'fr' ? "* Les photos et descriptions sont à titre indicatif uniquement et peuvent différer du produit réel." : "* The photos and descriptions are for reference only and may differ from the actual product."}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 6: Safety Features - Horizontal Card Slider */}
        <section className="relative py-20 bg-black overflow-hidden w-full">
            {/* Header */}
          <div className="text-center mb-16">
              <h2 className="text-white text-sm font-light mb-2">{language === 'fr' ? "SÉCURITÉ" : "SAFETY"}</h2>
              <h1
                style={{
                  fontSize: "24px",
                  fontFamily: "inherit",
                  lineHeight: "1.2",
                  fontWeight: "700",
                  margin: 0,
                  padding: 0,
                  color: "white",
                }}
              >
                {language === 'fr' ? "SÛR ET FIABLE SUR TOUTES LES ROUTES" : "SAFE AND SOUND ON EVERY ROAD"}
              </h1>
            </div>

          {/* Horizontal Card Slider Container */}
          <div className="relative max-w-7xl mx-auto px-0 md:px-4 w-full overflow-hidden">
            {/* Cards Container */}
            <div className="relative overflow-hidden w-full">
              <div 
                className="flex transition-transform duration-700 ease-out safety-slider w-full"
                style={{ 
                  transform: isMobile
                    ? currentSafetyCard === 0 
                      ? 'translateX(0%)'
                      : `translateX(calc(-${8 + currentSafetyCard * 69}%))`
                    : `translateX(-${currentSafetyCard * (100 / 3)}%)`
                }}
                onTouchStart={onSafetyTouchStart}
                onTouchMove={onSafetyTouchMove}
                onTouchEnd={onSafetyTouchEnd}
              >
                {safetyFeatures.map((feature, index) => (
                  <React.Fragment key={feature.id}>
                    <div className="safety-card flex-shrink-0 w-[65%] md:w-[33.333%] mr-[4%] md:mr-0 md:px-4" style={{ marginLeft: index === 0 && isMobile ? '8%' : '0' }}>
                      <div className="slide-item-wrap">
                        <div className="gallery-wrap rounded-lg overflow-hidden relative" style={{ height: isMobile ? '450px' : '514px' }}>
                          {/* Background Image or Video */}
                          {playingVideo === feature.video && videoPlaying ? (
                            <video
                              src={feature.video}
                              className="w-full h-full object-cover"
                              autoPlay
                              muted
                              loop
                            />
                          ) : (
                            <Image
                              src={feature.image}
                              alt={feature.subtitle}
                              fill
                              className="object-cover"
                              quality={90}
                            />
                          )}
                          
                          {/* Gradient Overlay - Top and Bottom Shadow */}
                          <div 
                            className="absolute inset-0 z-[5] pointer-events-none"
                            style={{
                              background: 'linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, transparent 30%, transparent 70%, rgba(0,0,0,0.5) 100%)'
                            }}
                          />
                          
                          {/* Text Box - Hidden when video is playing */}
                          {!(playingVideo === feature.video && videoPlaying) && (
                            <div className="text-box absolute inset-0 p-6 md:p-8 flex flex-col justify-between z-10">
                              {/* Title section at top - always at top */}
                              <div className="flex flex-col backdrop-blur-sm bg-black/10 rounded-lg p-3 md:p-4">
                                <h3 className={`${feature.textColor} text-sm font-light mb-2 drop-shadow-lg`}>{feature.title}</h3>
                                <h2 className={`${feature.subtitleColor} text-xl md:text-2xl font-bold mb-3 md:mb-4 drop-shadow-lg`}>{feature.subtitle}</h2>
                                {feature.hasOpenButton && (
                                  <ToggleButton
                                    isOpen={(feature.id === 0 && isBSDCarouselOpen) || (feature.id === 3 && isAEBCarouselOpen) || (feature.id === 5 && isESCCarouselOpen) || (feature.id === 9 && isEnhancedSafetyCarouselOpen)}
                                    onClick={() => {
                                      if (feature.id === 0) {
                                        setIsBSDCarouselOpen(prev => !prev);
                                      } else if (feature.id === 3) {
                                        setIsAEBCarouselOpen(prev => !prev);
                                      } else if (feature.id === 5) {
                                        setIsESCCarouselOpen(prev => !prev);
                                      } else if (feature.id === 9) {
                                        setIsEnhancedSafetyCarouselOpen(prev => !prev);
                                      }
                                    }}
                                  />
                                )}
                              </div>
                              
                              {/* Description - always at bottom */}
                              <div className="flex flex-col items-end backdrop-blur-sm bg-black/10 rounded-lg p-3 md:p-4">
                                <p className={`${
                                  (feature.description.includes('Featuring an 8-way powered seat') ||
                                   feature.description.includes('Toggle-switch type with auto hold') ||
                                   feature.description.includes('By applying the HPF') ||
                                   feature.description.includes('Complete airbag protection') ||
                                   feature.description.includes('When you need to briefly exit the vehicle'))
                                    ? 'text-white'
                                    : feature.textColor
                                } text-sm leading-relaxed mb-4 drop-shadow-lg text-right`}>
                                  {feature.description}
                                </p>
                              </div>
                            </div>
                          )}
                        
                        {/* Video Play/Stop Button - Only show when not playing video */}
                        {feature.video && !(playingVideo === feature.video && videoPlaying) && (
                          <div className="absolute bottom-6 right-6 z-20">
                            <button 
                              onClick={() => toggleVideo(feature.video!)}
                              className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-all duration-300 cursor-pointer"
                            >
                              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M8 5v14l11-7z"/>
                              </svg>
                            </button>
                          </div>
                        )}
                        
                        {/* Video Stop Button - Only show when video is playing */}
                        {feature.video && playingVideo === feature.video && videoPlaying && (
                          <div className="absolute bottom-6 right-6 z-20">
                            <button 
                              onClick={() => toggleVideo(feature.video!)}
                              className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-all duration-300 cursor-pointer"
                            >
                              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
                              </svg>
                            </button>
                          </div>
                        )}
                        </div>
                      </div>
                    </div>

                    {/* BSD Carousel - appears after 4-corner BSD protection card */}
                    {feature.id === 0 && (
                      <SousSlider
                        items={bsdCarouselData}
                        isOpen={isBSDCarouselOpen}
                        onClose={() => setIsBSDCarouselOpen(false)}
                        cardWidth="320px"
                        language={language}
                        itemsPerView={3}
                      />
                    )}

                    {/* AEB Carousel - appears after AEB card */}
                    {feature.id === 3 && (
                      <SousSlider
                        items={aebCarouselData}
                        isOpen={isAEBCarouselOpen}
                        onClose={() => setIsAEBCarouselOpen(false)}
                        cardWidth="320px"
                        language={language}
                        itemsPerView={3}
                      />
                    )}

                    {/* ESC Carousel - appears after ESC card */}
                    {feature.id === 5 && (
                      <SousSlider
                        items={escCarouselData}
                        isOpen={isESCCarouselOpen}
                        onClose={() => setIsESCCarouselOpen(false)}
                        cardWidth="320px"
                        language={language}
                        itemsPerView={3}
                      />
                    )}

                    {/* Enhanced Safety Features Carousel - appears after Enhanced Safety Features card */}
                    {feature.id === 9 && (
                      <SousSlider
                        items={enhancedSafetyCarouselData}
                        isOpen={isEnhancedSafetyCarouselOpen}
                        onClose={() => setIsEnhancedSafetyCarouselOpen(false)}
                        cardWidth="320px"
                        language={language}
                        itemsPerView={3}
                      />
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>

            {/* Navigation Component */}
            <div className="flex justify-center mt-6 md:mt-8">
              {/* Simple dots navigation for mobile - hidden on desktop */}
              <div className="flex md:hidden items-center justify-center gap-2">
                {safetyFeatures.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSafetyCard(index)}
                    className={`transition-all duration-300 rounded-full ${
                      currentSafetyCard === index
                        ? 'w-2.5 h-2.5 bg-white'
                        : 'w-2 h-2 bg-white/40'
                    }`}
                    aria-label={`Go to card ${index + 1}`}
                  />
                ))}
              </div>
              {/* Desktop navigation - hidden on mobile */}
              <div className="hidden md:block">
                <CarouselNavigation
                  currentIndex={currentSafetyCard}
                  totalItems={safetyFeatures.length}
                  itemsPerView={3}
                  showPerCard={true}
                  onSlideChange={(index) => {
                    // Close carousels if open when changing slide
                    if (isBSDCarouselOpen) {
                      setIsBSDCarouselOpen(false);
                    }
                    if (isAEBCarouselOpen) {
                      setIsAEBCarouselOpen(false);
                    }
                    if (isESCCarouselOpen) {
                      setIsESCCarouselOpen(false);
                    }
                    if (isEnhancedSafetyCarouselOpen) {
                      setIsEnhancedSafetyCarouselOpen(false);
                    }
                    setCurrentSafetyCard(index);
                  }}
                  onPrevious={prevSafetyCard}
                  onNext={nextSafetyCard}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Section 7: Convenience Features - Horizontal Card Slider */}
        <section className="relative py-20 bg-black overflow-hidden w-full">
          {/* Header */}
          <div className="text-center mb-16">
            <h2 className="text-white text-sm font-light mb-2">{language === 'fr' ? 'CONFORT' : 'CONVENIENCE'}</h2>
            <h1 style={{ fontSize: "24px", fontFamily: "inherit", lineHeight: "1.2", fontWeight: "700", margin: 0, padding: 0, color: "white" }}>{language === 'fr' ? 'DES DEPLACEMENTS PLUS INTELLIGENTS, PLUS FACILES ET PLUS CONFORTABLES' : 'FOR SMARTER, EASIER AND COMFORTABLE MOVES'}</h1>
          </div>

          {/* Horizontal Card Slider Container */}
          <div className="relative max-w-7xl mx-auto px-0 md:px-4 w-full overflow-hidden">
            {/* Cards Container */}
            <div className="relative overflow-hidden w-full">
              <div 
                className="flex transition-transform duration-700 ease-out convenience-slider w-full"
                style={{ 
                  transform: isMobile
                    ? currentConvenienceCard === 0 
                      ? 'translateX(0%)'
                      : `translateX(calc(-${8 + currentConvenienceCard * 69}%))`
                    : `translateX(-${currentConvenienceCard * (100 / 4)}%)`
                }}
                onTouchStart={onConvenienceTouchStart}
                onTouchMove={onConvenienceTouchMove}
                onTouchEnd={onConvenienceTouchEnd}
              >
                {convenienceFeatures.map((feature, index) => (
                  <React.Fragment key={feature.id}>
                  <div className="convenience-card flex-shrink-0 w-[65%] md:w-[25%] mr-[4%] md:mr-0 md:px-4" style={{ marginLeft: index === 0 && isMobile ? '8%' : '0' }}>
                    <div className="slide-item-wrap">
                      <div className="gallery-wrap rounded-lg overflow-hidden relative" style={{ height: isMobile ? '450px' : '514px' }}>
                        {/* Background Image or Video */}
                        {playingVideo === feature.video && videoPlaying ? (
                          <video
                            src={feature.video}
                            className="w-full h-full object-cover"
                            autoPlay
                            muted
                            loop
                          />
                        ) : (
                          <Image
                            src={feature.image}
                            alt={feature.subtitle}
                            fill
                            className="object-cover"
                            quality={90}
                            unoptimized
                          />
                        )}
                        
                        {/* Gradient Overlay - Top and Bottom Shadow */}
                        <div 
                          className="absolute inset-0 z-[5] pointer-events-none"
                          style={{
                            background: 'linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, transparent 30%, transparent 70%, rgba(0,0,0,0.5) 100%)'
                          }}
                        />
                        
                        {/* Text Box - Hidden when video is playing */}
                        {!(playingVideo === feature.video && videoPlaying) && (
                          <div className="text-box absolute inset-0 p-6 md:p-8 flex flex-col justify-between z-10">
                            {/* Title section at top - always at top */}
                            <div className="flex flex-col backdrop-blur-sm bg-black/10 rounded-lg p-3 md:p-4">
                              <h3 className={`${feature.textColor} text-sm font-light mb-2 drop-shadow-lg`}>{feature.title}</h3>
                              <h2 className={`${feature.subtitleColor} text-xl md:text-2xl font-bold mb-3 md:mb-4 drop-shadow-lg`}>{feature.subtitle}</h2>
                              {feature.id === 4 && (
                                <button 
                                  className="bg-kgm-amber text-black w-10 h-10 rounded-full font-semibold hover:bg-kgm-amber/80 transition-colors duration-300 flex items-center justify-center"
                                  onClick={() => {
                                    setIsSeatingCarouselOpen(prev => !prev);
                                  }}
                                >
                                  <span className="text-lg">{isSeatingCarouselOpen ? '−' : '+'}</span>
                                </button>
                              )}
                            </div>
                            
                            {/* Description - always at bottom */}
                            <div className="flex flex-col items-end backdrop-blur-sm bg-black/10 rounded-lg p-3 md:p-4">
                                <p className={`${
                                  (feature.description.includes('Featuring an 8-way powered seat') ||
                                   feature.description.includes('Toggle-switch type with auto hold') ||
                                   feature.description.includes('By applying the HPF') ||
                                   feature.description.includes('Complete airbag protection') ||
                                   feature.description.includes('When you need to briefly exit the vehicle'))
                                    ? 'text-white'
                                    : feature.textColor
                                } text-sm leading-relaxed mb-4 drop-shadow-lg text-right`}>
                                  {feature.description}
                                </p>
                            </div>
                          </div>
                        )}
                      
                      {/* Video Play/Stop Button - Only show when not playing video */}
                      {feature.video && !(playingVideo === feature.video && videoPlaying) && (
                        <div className="absolute bottom-6 right-6 z-20">
                          <button 
                            onClick={() => toggleVideo(feature.video!)}
                            className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-all duration-300 cursor-pointer"
                          >
                            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M8 5v14l11-7z"/>
                            </svg>
                          </button>
                        </div>
                      )}
                      
                      {/* Video Stop Button - Only show when video is playing */}
                      {feature.video && playingVideo === feature.video && videoPlaying && (
                        <div className="absolute bottom-6 right-6 z-20">
                          <button 
                            onClick={() => toggleVideo(feature.video!)}
                            className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-all duration-300 cursor-pointer"
                          >
                            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
                            </svg>
                          </button>
                        </div>
                      )}
                      </div>
                    </div>
                  </div>

                  {/* Seating Configurations Inner Slider */}
                  {feature.id === 4 && (
                    <SousSlider
                      items={seatingCarouselData}
                      isOpen={isSeatingCarouselOpen}
                      onClose={() => setIsSeatingCarouselOpen(false)}
                      itemsPerView={3}
                      headerTitle="Seating configurations"
                    />
                  )}
                  </React.Fragment>
                ))}
              </div>
            </div>

            {/* Navigation Component */}
            <div className="flex justify-center mt-6 md:mt-8">
              {/* Simple dots navigation for mobile - hidden on desktop */}
              <div className="flex md:hidden items-center justify-center gap-2">
                {convenienceFeatures.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentConvenienceCard(index)}
                    className={`transition-all duration-300 rounded-full ${
                      currentConvenienceCard === index
                        ? 'w-2.5 h-2.5 bg-white'
                        : 'w-2 h-2 bg-white/40'
                    }`}
                    aria-label={`Go to card ${index + 1}`}
                  />
                ))}
              </div>
              {/* Desktop navigation - hidden on mobile */}
              <div className="hidden md:block">
                <CarouselNavigation
                  currentIndex={currentConvenienceCard}
                  totalItems={convenienceFeatures.length}
                  itemsPerView={4}
                  showPerCard={true}
                  onSlideChange={setCurrentConvenienceCard}
                  onPrevious={prevConvenienceCard}
                  onNext={nextConvenienceCard}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Section 8: Performance Features - Horizontal Card Slider */}
        <section className="relative py-20 bg-black overflow-hidden w-full">
          {/* Header */}
          <div className="text-center mb-16">
            <h2 className="text-white text-sm font-light mb-2">{language === 'fr' ? "PERFORMANCE" : "PERFORMANCE"}</h2>
            <h1 style={{ fontSize: "24px", fontFamily: "inherit", lineHeight: "1.2", fontWeight: "700", margin: 0, padding: 0, color: "white" }}>{language === 'fr' ? "Pour une mobilité puissante et dynamique" : "For powerful and dynamic mobility"}</h1>
          </div>

          {/* Horizontal Card Slider Container */}
          <div className="relative max-w-7xl mx-auto px-0 md:px-4 w-full overflow-hidden">
            {/* Cards Container */}
            <div className="relative overflow-hidden w-full">
              <div 
                className="flex transition-transform duration-700 ease-out performance-slider w-full"
                style={{ 
                  transform: isMobile
                    ? currentPerformanceCard === 0 
                      ? 'translateX(0%)'
                      : `translateX(calc(-${8 + currentPerformanceCard * 69}%))`
                    : `translateX(-${currentPerformanceCard * (100 / 3)}%)`
                }}
                onTouchStart={onPerformanceTouchStart}
                onTouchMove={onPerformanceTouchMove}
                onTouchEnd={onPerformanceTouchEnd}
              >
                {performanceFeatures.map((feature, index) => (
                  <React.Fragment key={feature.id}>
                  <div className="performance-card flex-shrink-0 w-[65%] md:w-[33.333%] mr-[4%] md:mr-0 md:px-4" style={{ marginLeft: index === 0 && isMobile ? '8%' : '0' }}>
                    <div className="slide-item-wrap">
                      <div className="gallery-wrap rounded-lg overflow-hidden relative" style={{ height: isMobile ? '450px' : '514px' }}>
                        {/* Background Image or Video */}
                        {playingVideo === feature.video && videoPlaying ? (
                          <video
                            src={feature.video}
                            className="w-full h-full object-cover"
                            autoPlay
                            muted
                            loop
                          />
                        ) : (
                          <Image
                            src={feature.image}
                            alt={feature.subtitle}
                            fill
                            className="object-cover"
                            quality={90}
                          />
                        )}
                        
                        {/* Gradient Overlay - Top and Bottom Shadow */}
                        <div 
                          className="absolute inset-0 z-[5] pointer-events-none"
                          style={{
                            background: 'linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, transparent 30%, transparent 70%, rgba(0,0,0,0.5) 100%)'
                          }}
                        />
                        
                        {/* Text Box - Hidden when video is playing */}
                        {!(playingVideo === feature.video && videoPlaying) && (
                          <div className="text-box absolute inset-0 p-6 md:p-8 flex flex-col justify-between z-10">
                            {/* Title section at top - always at top */}
                            <div className="flex flex-col backdrop-blur-sm bg-black/10 rounded-lg p-3 md:p-4">
                              <h3 className={`${feature.textColor} text-sm font-light mb-2 drop-shadow-lg`}>{feature.title}</h3>
                              <h2 className={`${feature.subtitleColor} text-xl md:text-2xl font-bold mb-3 md:mb-4 drop-shadow-lg`}>{feature.subtitle}</h2>
                              {feature.hasOpenButton && (
                                <button 
                                  className="bg-kgm-amber text-black w-10 h-10 rounded-full font-semibold hover:bg-kgm-amber/80 transition-colors duration-300 flex items-center justify-center"
                                  onClick={() => { if (feature.id === 3) setIsChargingCarouselOpen(prev => !prev); }}
                                >
                                  <span className="text-lg">{feature.id === 3 ? (isChargingCarouselOpen ? '−' : '+') : '+'}</span>
                                </button>
                              )}
                            </div>
                            
                            {/* Description - always at bottom */}
                            <div className="flex flex-col items-end backdrop-blur-sm bg-black/10 rounded-lg p-3 md:p-4">
                                <p className={`${
                                  (feature.description.includes('Featuring an 8-way powered seat') ||
                                   feature.description.includes('Toggle-switch type with auto hold') ||
                                   feature.description.includes('By applying the HPF') ||
                                   feature.description.includes('Complete airbag protection') ||
                                   feature.description.includes('When you need to briefly exit the vehicle'))
                                    ? 'text-white'
                                    : feature.textColor
                                } text-sm leading-relaxed mb-4 drop-shadow-lg text-right`}>
                                  {feature.description}
                                </p>
                            </div>
                          </div>
                        )}
                      
                      {/* Video Play/Stop Button */}
                      {feature.video && (
                        <div className="absolute inset-0 flex items-center justify-center z-20">
                          <button 
                            onClick={() => toggleVideo(feature.video!)}
                            className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-all duration-300 cursor-pointer"
                          >
                            {playingVideo === feature.video && videoPlaying ? (
                              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
                              </svg>
                            ) : (
                              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M8 5v14l11-7z"/>
                              </svg>
                            )}
                          </button>
                        </div>
                      )}
                      </div>
                    </div>
                  </div>

                  {/* Charging & Range Inner Slider */}
                  {feature.id === 3 && (
                    <SousSlider
                      items={chargingCarouselData}
                      isOpen={isChargingCarouselOpen}
                      onClose={() => setIsChargingCarouselOpen(false)}
                      itemsPerView={3}
                      headerTitle={language === 'fr' ? 'Recharge et autonomie' : 'Charging and range'}
                    />
                  )}
                  </React.Fragment>
                ))}
              </div>
            </div>

            {/* Navigation Component */}
            <div className="flex justify-center mt-6 md:mt-8">
              {/* Simple dots navigation for mobile - hidden on desktop */}
              <div className="flex md:hidden items-center justify-center gap-2">
                {performanceFeatures.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentPerformanceCard(index)}
                    className={`transition-all duration-300 rounded-full ${
                      currentPerformanceCard === index
                        ? 'w-2.5 h-2.5 bg-white'
                        : 'w-2 h-2 bg-white/40'
                    }`}
                    aria-label={`Go to card ${index + 1}`}
                  />
                ))}
              </div>
              {/* Desktop navigation - hidden on mobile */}
              <div className="hidden md:block">
                <CarouselNavigation
                  currentIndex={currentPerformanceCard}
                  totalItems={performanceFeatures.length}
                  itemsPerView={3}
                  showPerCard={true}
                  onSlideChange={setCurrentPerformanceCard}
                onPrevious={prevPerformanceCard}
                onNext={nextPerformanceCard}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Section 10: Download Brochure */}
        <section className="relative py-20 bg-white">
          <div className="max-w-4xl mx-auto px-4">
            <div className="flex flex-col items-center justify-center">
              {/* Download Button */}
              <a
                href="/brochures/torres_evx .pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-4 px-10 py-5 bg-black text-white rounded-lg font-semibold text-lg hover:bg-gray-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                {/* Download Icon */}
                <svg 
                  className="w-6 h-6 flex-shrink-0" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
                  />
                      </svg>
                <span className="whitespace-nowrap">{language === 'fr' ? 'Téléchargez votre brochure' : 'Download your brochure'}</span>
              </a>
            </div>
          </div>
        </section>


      </section>

      <Footer />
    </div>
  );
}

export default TorresPage;
