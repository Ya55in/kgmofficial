'use client';

import React, { useState, useEffect, useLayoutEffect, useRef, useCallback, useMemo } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useLanguage } from '@/contexts/LanguageContext';
import CarFeatureSidebar from '@/components/CarFeatureSidebar';
import { useCarFeatureSidebar } from '@/hooks/useCarFeatureSidebar';
import CarouselNavigation from '@/components/CarouselNavigation';
import SousSlider from '@/components/SousSlider';

const MussoGrandPage = () => {
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
  const [currentPerformanceCard, setCurrentPerformanceCard] = useState(0);
  const [isAEBCarouselOpen, setIsAEBCarouselOpen] = useState(false);
  const [isESCCarouselOpen, setIsESCCarouselOpen] = useState(false);
  const [isTPMSCarouselOpen, setIsTPMSCarouselOpen] = useState(false);
  const [isMoreFeaturesCarouselOpen, setIsMoreFeaturesCarouselOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [currentSpecImage, setCurrentSpecImage] = useState(0);
  const [activeAccordion, setActiveAccordion] = useState(3); // TYRE INFORMATION is open by default
  const [activeAccessoryTab, setActiveAccessoryTab] = useState<'exterior' | 'interior'>('exterior');
  const [viewAngle, setViewAngle] = useState<'front' | 'rear'>('front');
  const [activeSpecificationAccordion, setActiveSpecificationAccordion] = useState<number | null>(3); // TYRE INFORMATION is open by default
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

  const features = [
    {
      icon: "https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/GRANDMUSSO/hero/safety-icon.svg",
      title: language === 'fr' ? 'Fort en Sécurité' : 'Strong Safety',
      description: language === 'fr' ? 'Systèmes de sécurité avancés conçus pour une protection maximale' : 'Advanced safety systems designed for maximum protection'
    },
    {
      icon: "https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/GRANDMUSSO/hero/deck-icon.svg",
      title: language === 'fr' ? 'Plateau Plus Long' : 'Longer Deck',
      description: language === 'fr' ? 'Plateau de chargement étendu pour une utilité et un confort maximaux' : 'Extended cargo bed for maximum utility and convenience'
    },
    {
      icon: "https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/GRANDMUSSO/hero/city-car-icon.svg",
      title: language === 'fr' ? 'Voiture de Ville' : 'City Car',
      description: language === 'fr' ? 'Parfait pour la conduite urbaine avec une excellente maniabilité' : 'Perfect for urban driving with excellent maneuverability'
    }
  ];

  // Safety features data
  const safetyFeatures = [
    {
      id: 0,
      title: language === 'fr' ? 'Rigidité Structurelle' : 'Structural Rigidity',
      subtitle: language === 'fr' ? 'Châssis Renforcé' : 'Reinforced Chassis',
      description: language === 'fr' ? 'Châssis renforcé avec structure en acier haute résistance pour une sécurité maximale' : 'Reinforced chassis with high-strength steel structure for maximum safety',
      image: "https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/GRANDMUSSO/section6/20250131143523801_9AWhfB.jpg",
      video: "https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/GRANDMUSSO/section6/20250131143523918_YLJGpt.mp4",
      bgColor: "bg-gray-800",
      textColor: "text-white",
      subtitleColor: "text-white",
      hasOpenButton: false
    },
    {
      id: 1,
      title: language === 'fr' ? 'Design de Sécurité' : 'Safety Design',
      subtitle: language === 'fr' ? 'Protection Avancée' : 'Advanced Protection',
      description: language === 'fr' ? 'Design de sécurité avancé avec systèmes de protection intégrés' : 'Advanced safety design with integrated protection systems',
      image: "https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/GRANDMUSSO/section6/20250131143703529_HXHp1d.jpg",
      bgColor: "bg-gray-800",
      textColor: "text-white",
      subtitleColor: "text-white",
      hasOpenButton: false
    },
    {
      id: 2,
      title: language === 'fr' ? 'Système d\'Airbags' : 'Airbag System',
      subtitle: language === 'fr' ? 'Protection Complète' : 'Complete Protection',
      description: language === 'fr' ? 'Système d\'airbags complet pour la protection de tous les occupants' : 'Complete airbag system for protection of all occupants',
      image: "https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/GRANDMUSSO/section6/20250131143828345_1NEHNT.jpg",
      bgColor: "bg-gray-800",
      textColor: "text-white",
      subtitleColor: "text-white",
      hasOpenButton: false
    },
    {
      id: 3,
      title: language === 'fr' ? "Système ADAS" : "ADAS System",
      subtitle: language === 'fr' ? "Contrôle de Croisière Adaptatif Intelligent (ACC & SSA)" : "Intelligent Adaptive Cruise Control (ACC & SSA)",
      description: language === 'fr' ? "L'ACC & SSA aide à maintenir une distance de sécurité avec le véhicule devant en fonction de la vitesse définie (lors de l'accélération, de la décélération, de l'arrêt et du démarrage) et assiste la conduite à une vitesse sûre." : "ACC & SSA helps maintain a safe distance from the vehicle ahead based on the set speed (when accelerating, decelerating, stopping, and starting) and assists driving at a safe speed.",
      image: "https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/GRANDMUSSO/section6/20250131143957906_NDv4sx.jpg",
      video: "/assets/Modelspage/GRANDMUSSO/section6/20250206111027795_LHNmgd.mp4",
      bgColor: "bg-gray-800",
      textColor: "text-white",
      subtitleColor: "text-white",
      hasOpenButton: true
    },
    {
      id: 4,
      title: language === 'fr' ? "Système ADAS" : "ADAS System",
      subtitle: language === 'fr' ? "Freinage d'Urgence Autonome (AEB)" : "Autonomous Emergency Braking (AEB)",
      description: language === 'fr' ? "L'AEB avertit le conducteur d'une collision frontale potentielle pendant la conduite et active automatiquement les freins pour éviter un accident." : "AEB warns the driver of a potential frontal collision while driving and automatically activates the brakes to prevent an accident.",
      image: "https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/GRANDMUSSO/section6/20250131144126383_QqZU77.jpg",
      video: "/assets/Modelspage/GRANDMUSSO/section6/20250131144126497_EWrPjn.mp4",
      bgColor: "bg-gray-800",
      textColor: "text-white",
      subtitleColor: "text-white",
      hasOpenButton: true
    },
    {
      id: 5,
      title: language === 'fr' ? "Sécurité garantie dans toutes les conditions de conduite" : "Secured safety in all driving conditions",
      subtitle: language === 'fr' ? "Contrôle de Stabilité Électronique (ESC)" : "Electronic Stability Control (ESC)",
      description: language === 'fr' ? "L'ESC aide à prévenir la perte de contrôle en appliquant automatiquement les freins aux roues individuelles et en réduisant la puissance du moteur lorsqu'il détecte que le véhicule ne va pas là où le conducteur dirige." : "ESC helps prevent loss of control by automatically applying brakes to individual wheels and reducing engine power when it detects that the vehicle is not going where the driver is steering.",
      image: "https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/GRANDMUSSO/section6/20250131144612857_4kDBL1.jpg",
      bgColor: "bg-gray-800",
      textColor: "text-white",
      subtitleColor: "text-white",
      hasOpenButton: true
    },
    {
      id: 6,
      title: language === 'fr' ? "Système ESC avancé" : "Advanced ESC system",
      subtitle: language === 'fr' ? "Frein Multi-Collision (MCB)" : "Multi Collision Brake (MCB)",
      description: language === 'fr' ? "Après qu'un accident se produise, le MCB prévient les accidents secondaires par freinage d'urgence automatique lorsque le conducteur est temporairement incapable de contrôler le véhicule." : "After an accident occurs, the MCB prevents secondary accidents through automatic emergency braking when the driver is temporarily unable to control the vehicle.",
      image: "https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/GRANDMUSSO/section6/20250131144928553_GS6Ufd.jpg",
      bgColor: "bg-gray-800",
      textColor: "text-white",
      subtitleColor: "text-white",
      hasOpenButton: false
    },
    {
      id: 7,
      title: language === 'fr' ? "Fonctionnalités de sécurité supplémentaires" : "Additional safety features",
      subtitle: language === 'fr' ? "Système de Surveillance de la Pression des Pneus (TPMS)" : "Tyre Pressure Monitoring System (TPMS)",
      description: language === 'fr' ? "Le TPMS surveille la pression des pneus et alerte le conducteur lorsque la pression est faible, aidant à prévenir les accidents liés aux pneus." : "TPMS monitors tire pressure and alerts the driver when pressure is low, helping prevent tire-related accidents.",
      image: "https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/GRANDMUSSO/section6/20250131145110830_Fk2a6M.jpg",
      bgColor: "bg-gray-800",
      textColor: "text-white",
      subtitleColor: "text-white",
      hasOpenButton: true
    }
  ];

  // AEB inner slider items
  const aebCarouselData = [
    {
      id: 0,
      title: language === 'fr' ? 'Avertissement de Sortie de Sécurité (SEW)' : 'Safety Exit Warning (SEW)',
      description: language === 'fr' ? 'Lorsqu\'un conducteur ou un passager tente de sortir du véhicule à l\'arrêt, le SEW alerte avec des lumières d\'avertissement et des sons.' : 'When a driver or passenger attempts to exit the vehicle when stationary, SEW alerts with warning lights and sounds.',
      video: 'https://en.kg-mobility.com/attached/contents/display/video/2000003000200020004/20250131144145086_UiCoUj.mp4',
      poster: 'https://en.kg-mobility.com/attached/contents/display/video/2000003000200020004/20250131144144964_XvqQCh.jpg'
    },
    {
      id: 1,
      title: language === 'fr' ? "Avertissement de Démarrage du Véhicule Avant (FVSW)" : "Front Vehicle Start Warning (FVSW)",
      description: language === 'fr' ? "Le FVSW alerte lorsque le véhicule devant s'éloigne." : "FVSW alerts when the vehicle ahead is pulling away.",
      video: 'https://en.kg-mobility.com/attached/contents/display/video/2000003000200020004/20250131144204824_2Otfha.mp4',
      poster: 'https://en.kg-mobility.com/attached/contents/display/video/2000003000200020004/20250131144204705_NvRGMS.jpg'
    },
    {
      id: 2,
      title: language === 'fr' ? 'Avertissement de Distance de Sécurité (SDW)' : 'Safety Distance Warning (SDW)',
      description: language === 'fr' ? 'Détecte la distance du véhicule qui précède et avertit lorsqu\'elle est dangereuse.' : 'Detects distance from the vehicle ahead and warns when unsafe.',
      video: 'https://en.kg-mobility.com/attached/contents/display/video/2000003000200020004/20250131144225257_87HkEP.mp4',
      poster: 'https://en.kg-mobility.com/attached/contents/display/video/2000003000200020004/20250131144225148_ZNYWHC.jpg'
    },
    {
      id: 3,
      title: 'Smart High Beam (SHB)',
      description: 'Automatically lowers high beam when an approaching vehicle is detected.',
      video: 'https://en.kg-mobility.com/attached/contents/display/video/2000003000200020004/20250131144244881_6ckaAp.mp4',
      poster: 'https://en.kg-mobility.com/attached/contents/display/video/2000003000200020004/20250131144244769_w56Tlj.jpg'
    },
    {
      id: 4,
      title: 'Intelligent Speed Assist (ISA)',
      description: 'Warns speed limits on highways for safe driving.',
      video: 'https://en.kg-mobility.com/attached/contents/display/video/2000003000200020004/20250131144310945_s1Uum3.mp4',
      poster: 'https://en.kg-mobility.com/attached/contents/display/video/2000003000200020004/20250131144310835_1L8crw.jpg'
    },
    {
      id: 5,
      title: 'Rear Cross Traffic Warning (RCTW) / Rear Cross Traffic Collision Assist (RCTA)',
      description: 'Detects crossing traffic while parked or reversing and can activate emergency braking.',
      video: 'https://en.kg-mobility.com/attached/contents/display/video/2000003000200020004/20250131144330198_mKtbz0.mp4',
      poster: 'https://en.kg-mobility.com/attached/contents/display/video/2000003000200020004/20250131144330081_2muLcI.jpg'
    },
    {
      id: 6,
      title: 'Blind Spot Detection Warning (BSW) / Blind Spot Collision Assist (BSA)',
      description: 'Assists braking if a lane change risks collision with vehicles in the blind spot.',
      video: 'https://en.kg-mobility.com/attached/contents/display/video/2000003000200020004/20250131144350208_B2tt37.mp4',
      poster: 'https://en.kg-mobility.com/attached/contents/display/video/2000003000200020004/20250131144350091_t64piT.jpg'
    },
    {
      id: 7,
      title: 'Driver Drowsiness Attention Warning (DDAW)',
      description: "Sounds an audible warning and shows a graphic when the driver's attention drops significantly.",
      video: 'https://en.kg-mobility.com/attached/contents/display/video/2000003000200020004/20250131144409854_QySTcr.mp4',
      poster: 'https://en.kg-mobility.com/attached/contents/display/video/2000003000200020004/20250131144409734_K5qjGQ.jpg'
    },
    {
      id: 8,
      title: 'Lane Departure Warning (LDW) / Centering Lane Keeping Assist (CLKA)',
      description: 'Uses a front camera to monitor lane markers and assists steering to keep the vehicle within the lane.',
      video: 'https://en.kg-mobility.com/attached/contents/display/video/2000003000200020004/20250131144429038_aLMqNN.mp4',
      poster: 'https://en.kg-mobility.com/attached/contents/display/video/2000003000200020004/20250131144428929_ffdr99.jpg'
    }
  ];

  // ESC inner slider items
  const escCarouselData = useMemo(() => [
    {
      id: 0,
      title: language === 'fr' ? 'Contrôle de Descente de Colline (HDC)' : 'Hill Descent Control (HDC)',
      description: language === 'fr' ? 'Lors de la descente d\'une pente à faible vitesse, le HDC applique automatiquement les freins pour maintenir une vitesse constante sans contrôle du conducteur.' : 'When descending a slope at a low speed, HDC automatically applies the brakes to maintain a constant speed without the driver\'s control.',
      video: 'https://en.kg-mobility.com/attached/contents/display/video/2000003000200020004/20250131144633528_g8l8tk.mp4',
      poster: 'https://en.kg-mobility.com/attached/contents/display/video/2000003000200020004/20250131144633398_zMLypQ.jpg'
    },
    {
      id: 1,
      title: language === 'fr' ? 'Système d\'Assistance au Freinage (BAS)' : 'Brake Assist System (BAS)',
      description: language === 'fr' ? 'Le BAS applique une force maximale sur les freins lorsque le conducteur panique et qu\'un freinage soudain est détecté, réduisant considérablement la distance de freinage en cas d\'urgence.' : 'BAS applies maximum force onto the brakes when the driver panics and sudden braking is detected, significantly reducing braking distance in emergencies.',
      video: 'https://en.kg-mobility.com/attached/contents/display/video/2000003000200020004/20250131144653427_PhaZtq.mp4',
      poster: 'https://en.kg-mobility.com/attached/contents/display/video/2000003000200020004/20250131144653305_FgX94w.jpg'
    },
    {
      id: 2,
      title: language === 'fr' ? 'Protection Active contre le Renversement (ARP)' : 'Active Roll-over Protection (ARP)',
      description: language === 'fr' ? 'L\'ARP aide à maintenir une posture stable du véhicule en priorisant le contrôle du système lorsque les conditions de conduite deviennent très instables.' : 'ARP assists in maintaining a stable vehicle posture by prioritizing system control when driving conditions become highly unstable.',
      video: 'https://en.kg-mobility.com/attached/contents/display/video/2000003000200020004/20250131144713673_lF8lCm.mp4',
      poster: 'https://en.kg-mobility.com/attached/contents/display/video/2000003000200020004/20250131144713559_6GkKuS.jpg'
    },
    {
      id: 3,
      title: language === 'fr' ? 'Assistance au Démarrage en Côte (HSA)' : 'Hill Start Assist (HSA)',
      description: language === 'fr' ? 'Le HSA aide à prévenir le recul lorsque le conducteur relâche la pédale de frein sur une pente et que le véhicule commence à se déplacer le long d\'une inclinaison en maintenant un certain niveau de pression de frein pendant 2~3 secondes.' : 'HSA helps prevent roll-back when the driver releases the brake pedal on a slope and the vehicle begins to travel along an incline by maintaining a certain level of brake pressure for 2~3 seconds.',
      video: 'https://en.kg-mobility.com/attached/contents/display/video/2000003000200020004/20250131144734251_zsa5EQ.mp4',
      poster: 'https://en.kg-mobility.com/attached/contents/display/video/2000003000200020004/20250131144734140_hxcUvC.jpg'
    },
    {
      id: 4,
      title: language === 'fr' ? 'Signal d\'Arrêt d\'Urgence (ESS)' : 'Emergency Stop Signal (ESS)',
      description: language === 'fr' ? 'L\'ESS fait clignoter les feux de freinage ou les feux de détresse pour avertir les conducteurs qui suivent lorsqu\'un freinage soudain se produit ou lorsque l\'ABS est activé.' : 'ESS flashes the brake lights or hazard lights to warn trailing drivers when suddenly braking or when ABS is activated.',
      video: 'https://en.kg-mobility.com/attached/contents/display/video/2000003000200020004/20250131144801388_dRGUFE.mp4',
      poster: 'https://en.kg-mobility.com/attached/contents/display/video/2000003000200020004/20250131144801264_dVmYi5.jpg'
    }
  ], [language]);

  // TPMS inner slider items
  const tpmsCarouselData = [
    {
      id: 0,
      title: 'Tyre Pressure Monitoring System (TPMS)',
      description: '',
      image: 'https://en.kg-mobility.com/attached/contents/display/video/2000003000200020004/20250131145110830_Fk2a6M.jpg'
    },
    {
      id: 1,
      title: 'Child seat anchorage (ISO-FIX)',
      description: '',
      image: 'https://en.kg-mobility.com/attached/contents/display/video/2000003000200020004/20250131145127889_JJBjfb.jpg'
    }
  ];

  // Convenience features data
  const convenienceFeatures = [
    {
      id: 0,
      title: language === 'fr' ? "Surveillance des angles morts" : "Blind spot monitoring",
      subtitle: language === 'fr' ? "Système de surveillance 3D panoramique" : "3D around- view monitoring system",
      description: language === 'fr' ? "En utilisant quatre caméras installées à l'extérieur, le système crée une vue 3D de l'environnement du véhicule, aidant à prévenir les accidents lors du stationnement ou de la conduite sur des routes étroites." : "By utilizing four externally installed cameras, the system creates a 3D view of the vehicle's surroundings, helping prevent accidents when parking or driving on narrow roads.",
      image: "https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/GRANDMUSSO/section7/20250131145300923_mOun9e.jpg",
      video: undefined,
      bgColor: "bg-gray-800",
      textColor: "text-white",
      subtitleColor: "text-white",
      hasOpenButton: false
    },
    {
      id: 1,
      title: language === 'fr' ? "Confort de conduite" : "Driving comfort",
      subtitle: language === 'fr' ? "Sièges avant réglables électriquement à 8 directions" : "8-way power-adjustable front seats",
      description: language === 'fr' ? "Avec un siège conducteur réglable électriquement à 8 directions avec support lombaire à 2 directions, siège réglable électriquement à 6 directions pour offrir une expérience de conduite confortable." : "Featuring an 8-way power-adjustable driver seat  with 2-way lumbar support, 6-way power-adjustable seat to provide a comfortable driving experience.",
      image: "https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/GRANDMUSSO/section7/20250131145439404_jqtknq.jpg",
      video: undefined,
      bgColor: "bg-gray-800",
      textColor: "text-white",
      subtitleColor: "text-white",
      hasOpenButton: false
    },
    {
      id: 2,
      title: language === 'fr' ? "Plus de fonctionnalités" : "More features",
      subtitle: language === 'fr' ? "Fonctionnalités de confort supplémentaires" : "Additional Convenience Features",
      description: language === 'fr' ? "Console plafond avec lampes LED, aération arrière, Android Auto & Apple CarPlay, emplacements USB type C, essuie-glaces avant à détection de pluie, toit ouvrant électrique sécurisé, sièges avant et arrière chauffants, sièges avant ventilés." : "Overhead console with LED map lamps, rear air vent, Android Auto & Apple CarPlay, C-type USB slots, rain sensing front windscreen wipers, safety powered sunroof, heated front and rear seats, ventilated front seats.",
      image: "https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/GRANDMUSSO/section7/20250131145603205_Da9PNp.jpg",
      video: undefined,
      bgColor: "bg-gray-800",
      textColor: "text-white",
      subtitleColor: "text-white",
      hasOpenButton: true
    }
  ];

  // More features inner slider items
  const moreFeaturesCarouselData = useMemo(() => [
    {
      id: 0,
      title: language === 'fr' ? 'Console plafond avec lampes LED' : 'Overhead console with LED map lamps',
      description: '',
      image: 'https://en.kg-mobility.com/attached/contents/display/video/2000003000200020004/20250131145619010_M20V9M.jpg'
    },
    {
      id: 1,
      title: language === 'fr' ? 'Aération arrière' : 'Rear air vent',
      description: '',
      image: 'https://en.kg-mobility.com/attached/contents/display/video/2000003000200020004/20250131145635485_8GJp0y.jpg'
    },
    {
      id: 2,
      title: language === 'fr' ? 'Android Auto & Apple CarPlay' : 'Android Auto & Apple CarPlay',
      description: '',
      image: 'https://en.kg-mobility.com/attached/contents/display/video/2000003000200020004/20250131145650695_ZAKN5m.jpg'
    },
    {
      id: 3,
      title: language === 'fr' ? 'Emplacements USB type C' : 'C-type USB slots',
      description: '',
      image: 'https://en.kg-mobility.com/attached/contents/display/video/2000003000200020004/20250224105632987_QWeH5m.jpg'
    },
    {
      id: 4,
      title: language === 'fr' ? 'Essuie-glaces avant à détection de pluie' : 'Rain sensing front windscreen wipers',
      description: '',
      image: 'https://en.kg-mobility.com/attached/contents/display/video/2000003000200020004/20250131145721039_GA9ZQF.jpg'
    },
    {
      id: 5,
      title: language === 'fr' ? 'Toit ouvrant électrique sécurisé' : 'Safety powered sunroof',
      description: '',
      image: 'https://en.kg-mobility.com/attached/contents/display/video/2000003000200020004/20250131145735080_lgjZZS.jpg'
    },
    {
      id: 6,
      title: language === 'fr' ? 'Sièges avant et arrière chauffants' : 'Heated front and rear seats',
      description: '',
      image: 'https://en.kg-mobility.com/attached/contents/display/video/2000003000200020004/20250131145750360_M8usIR.jpg'
    },
    {
      id: 7,
      title: language === 'fr' ? 'Sièges avant ventilés' : 'Ventilated front seats',
      description: '',
      image: 'https://en.kg-mobility.com/attached/contents/display/video/2000003000200020004/20250131145806584_Ab0pYi.jpg'
    },
    {
      id: 8,
      title: language === 'fr' ? 'Couverture de volant chauffante' : 'Heated steering wheel cover',
      description: '',
      image: 'https://en.kg-mobility.com/attached/contents/display/video/2000003000200020004/20250131145821846_cSdnjQ.jpg'
    }
  ], [language]);

  // Performance features data
  const performanceFeatures = [
    {
      id: 0,
      title: language === 'fr' ? "Traction sélectionnable" : "Selectable wheel drive",
      subtitle: language === 'fr' ? "4RM à temps partiel avec changement en marche" : "Part-time 4WD with shifting on the fly",
      description: language === 'fr' ? "En conditions normales, le système fonctionne en traction à deux roues. Lorsqu'une traction renforcée est nécessaire, comme sur des routes enneigées ou pluvieuses, il passe automatiquement en 4H, tandis que 4L est disponible pour les terrains tout-terrain exigeants." : "Under normal conditions, the system operates in two-wheel drive. When enhanced traction is needed, such as on snowy or rainy roads, it automatically shifts to 4H, while 4L is available for demanding off-road terrain.",
      image: "https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/GRANDMUSSO/section8/20250131145955835_yD4LWz.jpg",
      video: "https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/GRANDMUSSO/section8/20250131145956019_orAvE1.mp4",
      bgColor: "bg-gray-800",
      textColor: "text-white",
      subtitleColor: "text-white",
      hasOpenButton: false
    },
    {
      id: 1,
      title: language === 'fr' ? "Concentration de puissance pour l'évasion tout-terrain" : "Power concentration for off-road escape",
      subtitle: language === 'fr' ? "Différentiel verrouillable" : "Locking differential",
      description: language === 'fr' ? "En appliquant les freins aux roues sans traction, il transfère la force motrice aux autres roues, assurant des performances exceptionnelles même dans des situations tout-terrain comme l'escalade de bosses." : "By applying the brakes to the wheels with no traction, it transfers driving force to the other wheels, ensuring outstanding performance even in off-road situations like climbing over bumps.",
      image: "https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/GRANDMUSSO/section8/20250131150136211_mvrgEx.jpg",
      video: "https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/GRANDMUSSO/section8/20250131150136332_wy26sL.mp4",
      bgColor: "bg-gray-800",
      textColor: "text-white",
      subtitleColor: "text-white",
      hasOpenButton: false
    },
    {
      id: 2,
      title: language === 'fr' ? "Puissance du moteur" : "Engine power",
      subtitle: language === 'fr' ? "Moteur diesel 2.2 litres" : "2.2 Litre diesel engine",
      description: language === 'fr' ? "Il maintient un couple maximum dans la plage de régime fréquemment utilisée de 1600 à 2600, offrant des performances de conduite puissantes pendant la conduite quotidienne." : "It maintains maximum torque in the frequently used RPM range of 1600 to 2600, delivering powerful driving performance during everyday driving.",
      image: "https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/GRANDMUSSO/section8/20250131150259385_zUXtOD.jpg",
      bgColor: "bg-gray-800",
      textColor: "text-white",
      subtitleColor: "text-white",
      hasOpenButton: false
    },
    {
      id: 3,
      title: language === 'fr' ? "Conduite agile et réactive" : "Agile response handling",
      subtitle: language === 'fr' ? "Transmission automatique 6 vitesses" : "6-speed automatic transmission",
      description: language === 'fr' ? "La transmission Aisin 6 vitesses de troisième génération, adoptée par des véhicules de classe mondiale, offre une durabilité éprouvée et des performances de changement de vitesse stables." : "The third-generation Aisin 6-speed transmission, adopted by world-class vehicles, offers proven durability and stable shifting performance.",
      image: "https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/GRANDMUSSO/section8/20250210212355849_hboNvH.jpg",
      bgColor: "bg-gray-800",
      textColor: "text-white",
      subtitleColor: "text-white",
      hasOpenButton: false
    },
    {
      id: 4,
      title: language === 'fr' ? "Capacité de charge maximale de 500kg" : "Maximum load capacity of 500kg",
      subtitle: language === 'fr' ? "Système de suspension arrière à cinq bras avec ressorts hélicoïdaux" : "Five-link rear suspension system with coil springs",
      description: language === 'fr' ? "Contrairement à la suspension dure typique des véhicules de fret standard, le système à cinq bras indépendant distribue efficacement les impacts, équilibrant le confort de conduite et la robustesse." : "Unlike the hard suspension typical of standard cargo vehicles, the independent five-link system effectively distributes impacts, balancing ride comfort and sturdiness.",
      image: "https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/GRANDMUSSO/section8/20250210212404461_bct373.jpg",
      bgColor: "bg-gray-800",
      textColor: "text-white",
      subtitleColor: "text-white",
      hasOpenButton: false
    },
    {
      id: 5,
      title: language === 'fr' ? "Capacité de charge maximale de 700kg" : "Maximum load capacity of 700kg",
      subtitle: language === 'fr' ? "Suspension arrière à lames" : "Leaf spring rear suspension",
      description: language === 'fr' ? "Se concentrant sur le support de charges lourdes et la conduite tout-terrain, offrant une stabilité de conduite solide avec une configuration de suspension relativement ferme." : "Focusing on supporting heavy loads and off-road driving, offering solid driving stability with a relatively firm suspension setup.",
      image: "https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/GRANDMUSSO/section8/20250210212413443_vmlKUT.jpg",
      bgColor: "bg-gray-800",
      textColor: "text-white",
      subtitleColor: "text-white",
      hasOpenButton: false
    },
    {
      id: 6,
      title: language === 'fr' ? "Support d'un virage stable" : "Supporting stable cornering",
      subtitle: language === 'fr' ? "Système de traction arrière (RWD)" : "Rear Wheel Drive (RWD) system",
      description: language === 'fr' ? "Avec la traction arrière (RWD), typiquement trouvée dans les berlines premium, Musso Grand assure un virage stable et une conduite confortable." : "With rear-wheel drive (RWD), typically found in premium sedans, Musso Grand ensures stable cornering and a comfortable ride.",
      image: "https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/GRANDMUSSO/section8/20250131150832146_1g9BVC.jpg",
      bgColor: "bg-gray-800",
      textColor: "text-white",
      subtitleColor: "text-white",
      hasOpenButton: false
    },
    {
      id: 7,
      title: language === 'fr' ? "Conduite économique" : "Drive economically",
      subtitle: language === 'fr' ? "Système Idle Stop & Go" : "Idle Stop & Go system",
      description: language === 'fr' ? "Arrête automatiquement le moteur lorsque le véhicule est à l'arrêt, comme à un feu de signalisation, pour améliorer l'efficacité énergétique en réduisant le ralenti inutile (peut être activé/désactivé)." : "Automatically shuts off the engine when the vehicle is stationary, such as at a traffic signal, to improve fuel efficiency by reducing unnecessary idling (can be switched on/off).",
      image: "https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/GRANDMUSSO/section8/20250131150955606_RIvkbN.jpg",
      bgColor: "bg-gray-800",
      textColor: "text-white",
      subtitleColor: "text-white",
      hasOpenButton: false
    },
    {
      id: 8,
      title: language === 'fr' ? "Agilité de conduite" : "Drive agility",
      subtitle: language === 'fr' ? "Palettes de changement" : "Paddle shifters",
      description: language === 'fr' ? "Offrant un changement de vitesse en mode manuel avec des commandes de changement de vitesse haut/bas sur le volant, permettant une réponse rapide aux situations de conduite soudaines." : "Offering manual mode shifting with up/down shift controls on the steering wheel, allowing for quick response to sudden driving situations.",
      image: "https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/GRANDMUSSO/section8/20250131151117731_9Tv3aX.jpg",
      bgColor: "bg-gray-800",
      textColor: "text-white",
      subtitleColor: "text-white",
      hasOpenButton: false
    },
    {
      id: 9,
      title: language === 'fr' ? "Conduite dynamique" : "Dynamic driving",
      subtitle: language === 'fr' ? "Système de modes de conduite" : "Drive mode system",
      description: language === 'fr' ? "Fournissant des performances de conduite optimales basées sur le mode sélectionné (NORMAL/SPORT/HIVER) en intégrant les systèmes de direction et de suspension." : "Providing optimal driving performance based on the selected mode (NORMAL/SPORT/WINTER) by integrating the steering and suspension systems.",
      image: "https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/GRANDMUSSO/section8/20250131151240926_hRMDyx.jpg",
      bgColor: "bg-gray-800",
      textColor: "text-white",
      subtitleColor: "text-white",
      hasOpenButton: false
    }
  ];


  // Specification images
  const specImages = [
    {
      id: 0,
      src: "https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/GRANDMUSSO/section9/20250204095937688_TVh7mL.jpg",
      alt: "앞면"
    },
    {
      id: 1,
      src: "https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/GRANDMUSSO/section9/20250204095944616_klTslR.jpg",
      alt: "측면"
    },
    {
      id: 2,
      src: "https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/GRANDMUSSO/section9/20250204095952085_M2YoFd.jpg",
      alt: "후면"
    }
  ];

  // Specification data
  const specificationData = {
    dimensions: [
      { label: language === 'fr' ? "ROUES MOTRICES" : "DRIVEN WHEELS", value: "2WD", value2: "Part time 4WD", value3: "" },
      { label: language === 'fr' ? "TRANSMISSION" : "TRANSMISSION", value: "6AT", value2: "6MT", value3: "6AT" },
      { label: language === 'fr' ? "Longueur totale (mm)" : "Overall length (mm)", value: "", value2: "5,405 / 5,415 (with special pack)", value3: "5,405 / 5,415 (with special pack)" },
      { label: language === 'fr' ? "Largeur totale (mm)" : "Overall width (mm)", value: "", value2: "1,950", value3: "1,950" },
      { label: language === 'fr' ? "Hauteur totale (mm)" : "Overall height (mm)", value: "", value2: "1,855 (Pole antenna), 1,885 (Shark-fin antenna)", value3: "1,855 (Pole antenna), 1,885 (Shark-fin antenna)" },
      { label: language === 'fr' ? "Empattement (mm)" : "Wheelbase (mm)", value: "", value2: "3,210", value3: "3,210" },
      { label: language === 'fr' ? "Voie Avant (mm)" : "Tread Front (mm)", value: "", value2: "1,640 (235/70R17)", value3: "1,640 (235/70R17)" },
      { label: language === 'fr' ? "Voie Arrière (mm)" : "Tread Rear (mm)", value: "", value2: "1,640 (235/70R17)", value3: "1,640 (235/70R17)" },
      { label: language === 'fr' ? "Débordement Avant (mm)" : "Overhang Front (mm)", value: "", value2: "890 / 900 (with special pack)", value3: "890 / 900 (with special pack)" },
      { label: language === 'fr' ? "Débordement Arrière (mm)" : "Overhang Rear (mm)", value: "", value2: "1,305", value3: "1,305" },
      { label: language === 'fr' ? "Garde au sol minimale (mm)" : "Minimum ground clearance (mm)", value: "", value2: "220 (Between the axles clearance)", value3: "220 (Between the axles clearance)" },
      { label: language === 'fr' ? "Rayon de braquage minimal (m)" : "Minimum turning radius (m)", value: "", value2: "6.09", value3: "6.09" },
        { label: language === 'fr' ? "Suspension Avant" : "Suspension Front", value: "", value2: "Double Wishbone", value3: "Double Wishbone" },
        { label: language === 'fr' ? "Suspension Arrière" : "Suspension Rear", value: "5-Link", value2: "Leaf spring", value3: "5-Link" },
      { label: language === 'fr' ? "Poids total en charge (kg)" : "Gross vehicle weight (kg)", value: "2,890", value2: "3,260", value3: "2,990" },
      { label: language === 'fr' ? "Poids à vide (kg)" : "Kerb weight (kg)", value: "2,020 ~ 2,105", value2: "2,175 ~ 2,246", value3: "2,110 ~ 2,195" },
      { label: language === 'fr' ? "Poids remorque freinée (kg)" : "Gross trailer weight Braked (kg)", value: "2,600", value2: "2,600", value3: "2,600" },
      { label: language === 'fr' ? "Poids remorque non freinée (kg)" : "Gross trailer weight Unbraked (kg)", value: "", value2: "", value3: "750" }
    ],
    powertrain: [
      { label: language === 'fr' ? "ROUES MOTRICES" : "DRIVEN WHEELS", value: "2WD", value2: "Part time 4WD", value3: "Part time 4WD" },
        { label: language === 'fr' ? "Type de moteur" : "Engine type", value: "Diesel 2.2", value2: "Diesel 2.2", value3: "Diesel 2.2" },
        { label: language === 'fr' ? "Transmission" : "Transmission", value: "6AT", value2: "6MT", value3: "6AT" },
        { label: language === 'fr' ? "Émission" : "Emission", value: "Euro 6e", value2: "Euro 6e", value3: "Euro 6e" },
        { label: language === 'fr' ? "Carburant" : "Fuel", value: "Diesel", value2: "Diesel", value3: "Diesel" },
        { label: language === 'fr' ? "Réservoir de carburant (ℓ)" : "Fuel tank (l)", value: "75", value2: "75", value3: "75" },
        { label: language === 'fr' ? "Cylindrée (cc)" : "Capacity (cc)", value: "2,157", value2: "2,157", value3: "2,157" },
        { label: language === 'fr' ? "Alésage x Course (mm)" : "Bore x Stroke (mm)", value: "86.2 X 92.4", value2: "86.2 X 92.4", value3: "86.2 X 92.4" },
        { label: language === 'fr' ? "Taux de compression" : "Compression ratio", value: "15.5:1", value2: "15.5:1", value3: "15.5:1" },
        { label: language === 'fr' ? "Nombre de cylindres" : "Number of cylinders", value: "4 In-line", value2: "4 In-line", value3: "4 In-line" },
        { label: language === 'fr' ? "Puissance max. (kW/tr/min)" : "Max. power kW/rpm", value: "148.6/3,800", value2: "148.6/3,800", value3: "148.6/3,800" },
        { label: language === 'fr' ? "Puissance max. (ch/tr/min)" : "Max. power ps/rpm", value: "202/3,800", value2: "202/3,800", value3: "202/3,800" },
        { label: language === 'fr' ? "Couple max. (Nm/tr/min)" : "Max. torque Nm/rpm", value: "400/1,400~2,800", value2: "441/1,600~2,600", value3: "441/1,600~2,600" },
        { label: language === 'fr' ? "Couple max. (kg.m/tr/min)" : "Max. torque kg.m/rpm", value: "40.8/1,400~2,800", value2: "45/1,600~2,600", value3: "45/1,600~2,600" },
        { label: language === 'fr' ? "Vitesse max. (km/h)" : "Max. speed (km/h)", value: "172", value2: "177", value3: "172" }
    ],
    fuelEfficiency: [
      { label: language === 'fr' ? "ROUES MOTRICES" : "DRIVEN WHEELS", value: "2WD", value2: "", value3: "" },
      { label: language === 'fr' ? "TRANSMISSION" : "TRANSMISSION", value: "6AT", value2: "", value3: "" },
        { label: language === 'fr' ? "ISG (Idle Stop & Go)" : "ISG (Idle Stop & Go)", value: "None", value2: "None", value3: "Standard" },
        { label: language === 'fr' ? "Suspension Avant" : "Suspension Front", value: "", value2: "", value3: "" },
        { label: language === 'fr' ? "Suspension Arrière" : "Suspension Rear", value: "5-Link", value2: "Leaf spring", value3: "" },
        { label: language === 'fr' ? "CO2 (combiné, g/km)" : "CO2 (combined, g/km)", value: "236.0", value2: "233.0", value3: "227.0" },
        { label: language === 'fr' ? "Combiné (ℓ/100km)" : "Combined (ℓ/100km)", value: "9.003", value2: "8.897", value3: "8.665" },
        { label: language === 'fr' ? "Phase 1 (Phase basse, ℓ/100km)" : "Phase 1 (Low phase, ℓ/100km)", value: "11.772", value2: "11.012", value3: "10.171" },
        { label: language === 'fr' ? "Phase 2 (Phase moyenne, ℓ/100km)" : "Phase 2 (Mid phase, ℓ/100km)", value: "8.803", value2: "8.558", value3: "8.366" },
        { label: language === 'fr' ? "Phase 3 (Phase haute, ℓ/100km)" : "Phase 3 (High phase, ℓ/100km)", value: "7.816", value2: "7.769", value3: "7.641" },
        { label: language === 'fr' ? "Phase 4 (Phase extra haute, ℓ/100km)" : "Phase 4 (Extra High phase, ℓ/100km)", value: "9.111", value2: "9.279", value3: "9.161" }
    ],
    tyreInformation: [
      { label: language === 'fr' ? "Fabricant" : "Maker", value: "KH", value2: "NX", value3: "KH" },
      { label: language === 'fr' ? "Taille" : "Size", value: "235/70R17", value2: "235/70R17 (XL)", value3: "255/60R18" },
      { label: language === 'fr' ? "Fiche d'Information Produit" : "Product Information Sheet", value: "PDF", value2: "PDF", value3: "PDF" },
      { label: language === 'fr' ? "Étiquette Pneu" : "Tyre Label", value: "PDF", value2: "PDF", value3: "PDF" }
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
      title: language === 'fr' ? "DIMENSIONS" : "DIMENSIONS",
      content: {
        dimensions: [
          { label: language === 'fr' ? "Longueur Totale" : "Overall Length", value: "4,200mm" },
          { label: language === 'fr' ? "Largeur Totale" : "Overall Width", value: "1,560mm" },
          { label: language === 'fr' ? "Hauteur Totale" : "Overall Height", value: "1,613mm" },
          { label: language === 'fr' ? "Empattement" : "Wheelbase", value: "2,600mm" },
          { label: language === 'fr' ? "Garde au Sol" : "Ground Clearance", value: "190mm" }
        ]
      }
    },
    {
      id: 1,
      title: language === 'fr' ? "GROUPE MOTOPROPULSEUR" : "POWERTRAIN",
      content: {
        engine: [
          { label: language === 'fr' ? "Type de Moteur" : "Engine Type", value: "1.5L GDI Turbo" },
          { label: language === 'fr' ? "Cylindrée" : "Displacement", value: "1,497cc" },
          { label: language === 'fr' ? "Puissance Max" : "Max Power", value: "160ps @ 5,500rpm" },
          { label: language === 'fr' ? "Couple Max" : "Max Torque", value: "25.5kgf·m @ 1,500-4,000rpm" }
        ],
        transmission: [
          { label: language === 'fr' ? "Transmission" : "Transmission", value: "6-Speed Automatic" },
          { label: language === 'fr' ? "Type de Traction" : "Drive Type", value: "FWD / AWD" }
        ]
      }
    },
    {
      id: 2,
      title: language === 'fr' ? "EFFICACITÉ ÉNERGÉTIQUE" : "FUEL EFFICIENCY",
      content: {
        efficiency: [
          { label: language === 'fr' ? "Ville" : "City", value: "12.4 km/L" },
          { label: language === 'fr' ? "Autoroute" : "Highway", value: "15.2 km/L" },
          { label: language === 'fr' ? "Mixte" : "Combined", value: "13.5 km/L" },
          { label: language === 'fr' ? "Émissions CO2" : "CO2 Emissions", value: "119 g/km" }
        ]
      }
    },
    {
      id: 3,
      title: language === 'fr' ? "INFORMATIONS SUR LES PNEUS" : "TYRE INFORMATION",
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
        name: language === 'fr' ? "Boîte de Stockage Pilier C" : "C-Pillar Storage Box",
      image: "https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/TORRES-EVX/ACCESSORY/exterior/20250204093636787_Yfwxbo.jpg",
        description: language === 'fr' ? "Boîte de stockage verrouillable intégrée dans la conception du pilier C" : "Lockable storage box integrated into C-pillar design"
    },
    {
      id: 1,
      name: language === 'fr' ? "Barre Transversale" : "Cross Bar",
      image: "https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/TORRES-EVX/ACCESSORY/exterior/20250204093653765_0hm4Og.jpg",
      description: language === 'fr' ? "Barres transversales de galerie de toit pour une capacité de transport de cargaison supplémentaire" : "Roof rack cross bars for additional cargo carrying capacity"
    },
    {
      id: 2,
      name: language === 'fr' ? "Porteur de Toit Plat" : "Roof Flat Carrier",
      image: "https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/TORRES-EVX/ACCESSORY/exterior/20250204093708933_vjI5Tz.jpg",
      description: language === 'fr' ? "Porteur de toit plat pour un espace cargo supplémentaire" : "Flat roof carrier for additional cargo space"
    },
    {
      id: 3,
      name: language === 'fr' ? "Marches Latérales" : "Side Steps",
      image: "https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/TORRES-EVX/ACCESSORY/exterior/20250204093725855_OIMj8M.jpg",
      description: language === 'fr' ? "Marches latérales pratiques avec surface antidérapante texturée" : "Convenient side steps with textured non-slip surface"
    }
  ];

  const interiorAccessories = [
    {
      id: 0,
      name: language === 'fr' ? "Pédale Sport Alliage" : "Alloy Sports Pedal",
      image: "https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/TORRES-EVX/ACCESSORY/interior/20250204093949852_bfhyTj.jpg",
      description: language === 'fr' ? "Couvre-pédales sport en alliage avec prise texturée" : "Sporty alloy pedal covers with textured grip"
    },
    {
      id: 1,
      name: language === 'fr' ? "Matelas d'Air" : "Air Mat",
      image: "https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/TORRES-EVX/ACCESSORY/interior/20250204094005862_Y60Fyv.jpg",
      description: language === 'fr' ? "Matelas pneumatique pour camping confortable en voiture" : "Inflatable air mattress for comfortable car camping"
    },
    {
      id: 2,
      name: language === 'fr' ? "Rideau Multi" : "Multi Curtain",
      image: "https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/TORRES-EVX/ACCESSORY/interior/20250204094023334_cxvNRh.jpg",
      description: language === 'fr' ? "Rideaux d'intimité et organisateurs de stockage pour le confort intérieur" : "Privacy curtains and storage organizers for interior comfort"
    },
    {
      id: 3,
      name: language === 'fr' ? "Porte-Parapluie" : "Umbrella Hanger",
      image: "https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/TORRES-EVX/ACCESSORY/interior/20250204094041052_ZykeG3.jpg",
      description: language === 'fr' ? "Système de stockage et d'accrochage de parapluie pratique" : "Convenient umbrella storage and hanging system"
    }
  ];

  const carHotspots = [
    {
      id: 'headlight',
      position: { x: '40%', y: '56%' },
      title: 'LED Headlights',
      description: 'Advanced LED lighting technology'
    },
    {
      id: 'grille',
      position: { x: '58%', y: '29%' },
      title: 'Signature Grille',
      description: 'Distinctive front grille design'
    },
    {
      id: 'foglight',
      position: { x: '48%', y: '68%' },
      title: 'Fog Lights',
      description: 'Enhanced visibility in all conditions'
    },
    {
      id: 'roof',
      position: { x: '40%', y: '43%' },
      title: 'Roof Rails',
      description: 'Functional roof rail system'
    }
  ];

  // Interior hotspots data
  const interiorHotspots = [
    {
      id: 'dashboard',
      position: { x: '31%', y: '28%' },
      title: language === 'fr' ? "Cluster Numérique 12,3\"" : "12.3\" Digital Cluster",
      description: language === 'fr' ? "Affichage numérique complet" : "Full digital display",
      content: {
        title: language === 'fr' ? "Tableau de bord numérique 12,3\"" : "12.3\" Digital Dashboard",
        subtitle: language === 'fr' ? "Affichage numérique complet" : "Full digital display",
        video: 'https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/GRANDMUSSO/btninterior/btn1/20250210204844800_wp67EB.mp4',
        texts: [
          language === 'fr' ? "Le tableau de bord numérique de 12,3\" inclut trois modes d'affichage, une fonction de miroir AVN ainsi que des animations d'accueil et d'au revoir." : "The 12.3\" digital dashboard includes three display modes, an AVN mirroring function as well as welcome and goodbye animations."
        ]
      }
    },
    {
      id: 'steering',
      position: { x: '48%', y: '30%' },      title: language === 'fr' ? "Navigation 12,3 pouces" : "12.3\" Navigation",
      description: language === 'fr' ? "Navigation 12,3 pouces" : "12.3\" Navigation",
      content: {
        title: language === 'fr' ? "Navigation 12,3 pouces" : "12.3\" Navigation",
        subtitle: language === 'fr' ? "Navigation 12,3 pouces" : "12.3\" Navigation",
        video: 'https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/GRANDMUSSO/btninterior/btn2/20250210204901059_6Un4xg.mp4',
        texts: []
      }
    },
    {
      id: 'seats',
      position: { x: '48%', y: '48%' },
      title: language === 'fr' ? "Sièges Chauffants" : "Heated Seats",
      description: language === 'fr' ? "Confort en hiver" : "Winter comfort",
      content: {
        title: language === 'fr' ? "Climatisation automatique bi-zone" : "Front dual-temperature zone auto air conditioning system (Touch type)",
        subtitle: language === 'fr' ? "Système de climatisation automatique bi-zone de température avant (type tactile), doté d'un contrôleur LCD intuitif permettant des réglages indépendants gauche/droite, d'un chauffage rapide (PTC) et d'une fonction de dégivrage automatique." : "Front dual-temperature zone auto air conditioning system (Touch type)",
        images: [
          'https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/GRANDMUSSO/btninterior/btn3/20250131142638936_90jvPZ.jpg',
          'https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/GRANDMUSSO/btninterior/btn3/20250131142654911_IPB8Yv.jpg'
        ],
        texts: [
          language === 'fr' ? "Système de climatisation automatique bi-zone de température avant (type tactile), doté d'un contrôleur LCD intuitif permettant des réglages indépendants gauche/droite, d'un chauffage rapide (PTC) et d'une fonction de dégivrage automatique." : "Dual-zone full auto air conditioning: Features an intuitive LCD display controller with independent left and right settings, rapid heater (PTC), and auto defogging function.",
          language === 'fr' ? "Système de climatisation manuelle avant : Une opération pratique est prise en charge avec des commandes de type bouton et une interface utilisateur intuitive." : "Front manual air conditioning system : Convenient operation is supported with button-type controls and an intuitive UI."
        ]
      }
    },
    {
      id: 'gear-selector',
      position: { x: '60%', y: '41%' },
      title: language === 'fr' ? "Éclairage d'Ambiance" : "Ambient Lighting",
      description: language === 'fr' ? "Éclairage indirect personnalisable" : "Customizable indirect lighting",
      content: {
        title: language === 'fr' ? "Éclairage d'Ambiance" : "Ambient Lighting",
        subtitle: language === 'fr' ? "Éclairage indirect personnalisable" : "Customizable indirect lighting",
        image: 'https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/GRANDMUSSO/btninterior/btn4/20250204143652718_jO6Ir5.jpg',
        texts: [
          language === 'fr' ? "L'éclairage indirect sur l'avant de l'IP, la console centrale et les garnitures de portes peut être personnalisé avec jusqu'à 32 combinaisons de couleurs, permettant de créer diverses atmosphères intérieures." : "The indirect lighting on the IP front, centre console, and door trims can be customized with up to 32 color combinations, allowing for various interior atmospheres."
        ]
      }
    },
    {
      id: 'additional-feature',
      position: { x: '81%', y: '11%' },
      title: language === 'fr' ? "Poignée d'assistance" : "Assist grip",
      description: language === 'fr' ? "Caractéristique d'un authentique pick-up" : "Characteristic of an authentic pickup truck",
      content: {
        title: language === 'fr' ? "Poignée d'assistance" : "Assist grip",
        subtitle: language === 'fr' ? "Caractéristique d'un authentique pick-up" : "Characteristic of an authentic pickup truck",
        image: 'https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/GRANDMUSSO/btninterior/btn5/20250131142727785_gIlD4A.jpg',
        texts: [
          language === 'fr' ? "Caractéristique d'un authentique pick-up, des poignées de maintien sont prévues pour assurer une entrée et une sortie plus sûres, même dans des situations comme les manœuvres à faible allure." : "Characteristic of an authentic pickup truck, grip handles are applied to ensure safer entry and exit, even in situations like inching up."
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
    setCurrentInteriorHotspotImage(0);
  };

  const getInteriorHotspotContent = () => {
    if (!selectedInteriorHotspot) return null;
    const hotspot = interiorHotspots.find(h => h.id === selectedInteriorHotspot);
    return hotspot?.content || null;
  };

  const nextInteriorHotspotImage = () => {
    const content = getInteriorHotspotContent();
    if (!content) return;
    
    let totalItems = 0;
    if ('video' in content) totalItems += 1;
    if ('images' in content && Array.isArray(content.images)) totalItems += content.images.length;
    if ('image' in content) totalItems += 1;
    
    setCurrentInteriorHotspotImage((prev) => (prev + 1) % totalItems);
  };

  const prevInteriorHotspotImage = () => {
    const content = getInteriorHotspotContent();
    if (!content) return;
    
    let totalItems = 0;
    if ('video' in content) totalItems += 1;
    if ('images' in content && Array.isArray(content.images)) totalItems += content.images.length;
    if ('image' in content) totalItems += 1;
    
    setCurrentInteriorHotspotImage((prev) => (prev - 1 + totalItems) % totalItems);
  };

  // Hotspot content function for sidebar
  const getHotspotContent = (hotspotId: string) => {
    const hotspot = carHotspots.find(h => h.id === hotspotId);
    if (!hotspot) return null;

    // Special case for grille hotspot
    if (hotspotId === 'grille') {
      return {
        title: language === 'fr' ? "Rétroviseurs Extérieurs avec Lampes de Sol" : "Exterior rear view mirrors with puddle lamps",
        subtitle: language === 'fr' ? "Éclairage de sécurité" : "Safety lighting",
        image: 'https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/GRANDMUSSO/btnexterior/btn1/20250131113323630_OA6gq7.jpg',
        texts: [
          language === 'fr' ? "Lorsque les portes sont ouvertes, les lampes de sol éclairent le sol, offrant un embarquement sûr même dans des environnements sombres." : "When the doors are opened, puddle lamps illuminate the ground, providing safe boarding even in dark environments."
        ]
      };
    }

    // Special case for roof hotspot
    if (hotspotId === 'roof') {
      return {
        title: language === 'fr' ? "Phares Avant à Projection avec LED DRL" : "Projection front head lights with LED DRL",
        subtitle: language === 'fr' ? "Système d'éclairage LED avancé" : "Advanced LED lighting system",
        video: 'https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/GRANDMUSSO/btnexterior/btn2/20250131113351995_52Zx65.mp4',
        texts: [
          language === 'fr' ? "Les feux de circulation diurne (DRL) et les feux de clignotement séquentiels sont intégrés ; Les phares LED supérieurs/inférieurs sont équipés d'un système d'éclairage à quatre lampes." : "Daytime running lights (DRL) and sequential turn signal lamps are built-in; The upper/lower LED head lights are equipped with a four-lamp lighting system."
        ]
      };
    }

    // Special case for headlight hotspot
    if (hotspotId === 'headlight') {
      return {
        title: language === 'fr' ? "Lampe de Virage avec Phares Antibrouillard LED Intégrés" : "Cornering lamp with built-in LED fog lamps",
        subtitle: language === 'fr' ? "Éclairage de virage intelligent" : "Intelligent cornering lighting",
        video: 'https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/GRANDMUSSO/btnexterior/btn3/20250131113336921_OFhffu.mp4',
        texts: [
          language === 'fr' ? "La nuit, les lampes de virage s'illuminent selon la direction de braquage, améliorant la visibilité de la route." : "At night, cornering lamps illuminate according to the steering direction, improving the road visibility."
        ]
      };
    }

    // Special case for foglight hotspot
    if (hotspotId === 'foglight') {
      return {
        title: language === 'fr' ? "Jantes" : "Wheels",
        subtitle: language === 'fr' ? "Jantes alliage avec finition diamant" : "Alloy wheels with diamond-cut finish",
        images: [
          'https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/GRANDMUSSO/btnexterior/btn4/20250131113407215_qs2qpi.jpg',
          'https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/GRANDMUSSO/btnexterior/btn4/20250131113420771_fOIGpz.jpg',
          'https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/GRANDMUSSO/btnexterior/btn4/20250131113434359_1G9qGS.jpg',
          'https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/GRANDMUSSO/btnexterior/btn4/20250131113448112_vMcaH2.jpg'
        ],
        texts: [
          language === 'fr' ? "18\" Jantes alliage avec pneus 235/70R" : "18\" Alloy wheels with 235/70R tyres",
          language === 'fr' ? "17\" Jantes alliage avec pneus 235/70R" : "17\" Alloy wheels with 235/70R tyres",
          language === 'fr' ? "20\" Jantes alliage avec pneus 255/50R" : "20\" Alloy wheels with 255/50R tyres",
          language === 'fr' ? "20\" Jantes alliage avec pneus 255/50R" : "20\" Alloy wheels with 255/50R tyres"
        ]
      };
    }

    return {
      title: hotspot.title,
      subtitle: hotspot.description,
      images: [
        `/assets/Modelspage/GRANDMUSSO/section2/buttonsfront/${hotspotId}1.jpg`,
        `/assets/Modelspage/GRANDMUSSO/section2/buttonsfront/${hotspotId}2.jpg`,
        `/assets/Modelspage/GRANDMUSSO/section2/buttonsfront/${hotspotId}3.jpg`
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
      name: 'Amazonia Green',
      oneTone: 'https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/GRANDMUSSO/section3/Amazonia%20Green/1tone.jpg',
      twoTone: 'https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/GRANDMUSSO/section3/Amazonia%20Green/2tone.jpg',
      colorSwatch: '#228B22',
      hasTwoTones: true,
      vrImages: {
        oneTone: Array.from({ length: 36 }, (_, i) => `https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/GRANDMUSSO/section3/360vr/amazonia-green-1tone/${String(i + 1).padStart(2, '0')}.png`),
        twoTone: Array.from({ length: 36 }, (_, i) => `https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/GRANDMUSSO/section3/360vr/amazonia-green-2tone/${String(i + 1).padStart(2, '0')}.png`)
      }
    },
    {
      id: 1,
      name: 'Grand White',
      oneTone: 'https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/GRANDMUSSO/section3/Grand%20White/1tone/20250131114023511_kxqBiQ.jpg',
      twoTone: 'https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/GRANDMUSSO/section3/Grand%20White/2%20tones/20250210194710275_APxoCK.jpg',
      colorSwatch: '#FFFFFF',
      hasTwoTones: true,
      vrImages: {
        oneTone: Array.from({ length: 36 }, (_, i) => `https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/GRANDMUSSO/section3/360vr/grand-white-1tone/${String(i + 1).padStart(2, '0')}.png`),
        twoTone: Array.from({ length: 36 }, (_, i) => `https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/GRANDMUSSO/section3/360vr/grand-white-2tone/${String(i + 1).padStart(2, '0')}.png`)
      }
    },
    {
      id: 2,
      name: 'Indian Red',
      oneTone: 'https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/GRANDMUSSO/section3/Indian%20Red/1tone.jpg',
      twoTone: 'https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/GRANDMUSSO/section3/Indian%20Red/1tone.jpg', // Same image for both tones
      colorSwatch: '#DC143C',
      hasTwoTones: false, // This color only has one tone
      vrImages: {
        oneTone: Array.from({ length: 36 }, (_, i) => `https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/GRANDMUSSO/section3/360vr/indian-red-1tone/${String(i + 1).padStart(2, '0')}.png`),
        twoTone: Array.from({ length: 36 }, (_, i) => `https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/GRANDMUSSO/section3/360vr/indian-red-1tone/${String(i + 1).padStart(2, '0')}.png`) // Same VR images
      }
    },
    {
      id: 3,
      name: 'Marble Gray',
      oneTone: 'https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/GRANDMUSSO/section3/Marble%20Gray/1tone.jpg',
      twoTone: 'https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/GRANDMUSSO/section3/Marble%20Gray/2tone.jpg',
      colorSwatch: '#6B6B6B',
      hasTwoTones: true,
      vrImages: {
        oneTone: Array.from({ length: 36 }, (_, i) => `https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/GRANDMUSSO/section3/360vr/marble-gray-1tone/${String(i + 1).padStart(2, '0')}.png`),
        twoTone: Array.from({ length: 36 }, (_, i) => `https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/GRANDMUSSO/section3/360vr/marble-gray-2tone/${String(i + 1).padStart(2, '0')}.png`)
      }
    },
    {
      id: 4,
      name: 'Sandstone Beige',
      oneTone: 'https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/GRANDMUSSO/section3/Sandstone%20Beige/1tone.jpg',
      twoTone: 'https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/GRANDMUSSO/section3/Sandstone%20Beige/2tone.jpg',
      colorSwatch: '#D4C4A8',
      hasTwoTones: true,
      vrImages: {
        oneTone: Array.from({ length: 36 }, (_, i) => `https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/GRANDMUSSO/section3/360vr/sandstone-beige-1tone/${String(i + 1).padStart(2, '0')}.png`),
        twoTone: Array.from({ length: 36 }, (_, i) => `https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/GRANDMUSSO/section3/360vr/sandstone-beige-2tone/${String(i + 1).padStart(2, '0')}.png`)
      }
    },
    {
      id: 5,
      name: 'Silky White Pearl',
      oneTone: 'https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/GRANDMUSSO/section3/Silky%20White%20Pearl/1tone.jpg',
      twoTone: 'https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/GRANDMUSSO/section3/Silky%20White%20Pearl/1tone.jpg', // Same image for both tones
      colorSwatch: '#F8F8FF',
      hasTwoTones: false, // This color only has one tone
      vrImages: {
        oneTone: Array.from({ length: 36 }, (_, i) => `https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/GRANDMUSSO/section3/360vr/silky-white-pearl-1tone/${String(i + 1).padStart(2, '0')}.png`),
        twoTone: Array.from({ length: 36 }, (_, i) => `https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/GRANDMUSSO/section3/360vr/silky-white-pearl-1tone/${String(i + 1).padStart(2, '0')}.png`) // Same VR images
      }
    },
    {
      id: 6,
      name: 'Space Black',
      oneTone: 'https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/GRANDMUSSO/section3/Space%20Black/1tone.jpg',
      twoTone: 'https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/GRANDMUSSO/section3/Space%20Black/2tone.jpg',
      colorSwatch: '#1A1A1A',
      hasTwoTones: true,
      vrImages: {
        oneTone: Array.from({ length: 36 }, (_, i) => `https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/GRANDMUSSO/section3/360vr/space-black-1tone/${String(i + 1).padStart(2, '0')}.png`),
        twoTone: Array.from({ length: 36 }, (_, i) => `https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/GRANDMUSSO/section3/360vr/space-black-2tone/${String(i + 1).padStart(2, '0')}.png`)
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
    const clientX = e.clientX || (e as any).touches?.[0]?.clientX || 0;
    setDragStart(clientX);
    setLastDragX(clientX);
    setLastDragTime(Date.now());
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    
    const currentTime = Date.now();
    const deltaTime = currentTime - lastDragTime;
    const clientX = e.clientX || (e as any).touches?.[0]?.clientX || (e as any).changedTouches?.[0]?.clientX || lastDragX;
    const currentX = clientX;
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
    setCurrentSafetyCard((prev) => Math.min(prev + 1, safetyFeatures.length - 3));
  };

  const prevSafetyCard = () => {
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

  // Swipe handlers for mobile - Performance
  const minSwipeDistance = 50;
  const [performanceTouchStart, setPerformanceTouchStart] = useState<number | null>(null);
  const [performanceTouchEnd, setPerformanceTouchEnd] = useState<number | null>(null);

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

  // Swipe handlers for mobile - Safety
  const [safetyTouchStart, setSafetyTouchStart] = useState<number | null>(null);
  const [safetyTouchEnd, setSafetyTouchEnd] = useState<number | null>(null);

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

  // Swipe handlers for mobile - Convenience
  const [convenienceTouchStart, setConvenienceTouchStart] = useState<number | null>(null);
  const [convenienceTouchEnd, setConvenienceTouchEnd] = useState<number | null>(null);

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
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative h-screen overflow-hidden w-full">
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
            <source src="https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/GRANDMUSSO/hero/musso-grand-hero-video.mp4" type="video/mp4" />
            {/* Fallback image if video doesn't load */}
            <Image
              src="https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/GRANDMUSSO/section2/20250210191548220_7isWeA.png"
              alt="GRAND MUSSO"
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
                  <span>{language === 'fr' ? "GRAND MUSSO" : "GRAND MUSSO"}</span>
                </h2>
                <p className="text-lg text-white font-light">
                  <span>{language === 'fr' ? "Pick-up robuste et fiable" : "Authentic pickup truck"}</span>
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
                  href="/book-test-drive?model=musso-grand"
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
          
          {/* Bottom Content - GRAND MUSSO title, subtitle, and buttons - Desktop only */}
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
                {language === 'fr' ? "GRAND MUSSO" : "GRAND MUSSO"}
              </motion.h1>

              {/* Subtitle - smaller size */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="text-lg lg:text-xl text-white mb-8 font-light"
                style={{ fontSize: 'clamp(1rem, 2vw, 1.5rem)' }}
              >
                {language === 'fr' ? "Pick-up robuste et fiable" : "Authentic pickup truck"}
              </motion.p>

              {/* Action Buttons - smaller size */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <motion.a
                  href="/book-test-drive?model=musso-grand"
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
               <source src="https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/GRANDMUSSO/section1/20250131113026329_Ajs1At.mp4" type="video/mp4" />
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
            <source src="https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/GRANDMUSSO/section1/20250131113026329_Ajs1At.mp4" type="video/mp4" />
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
            {language === 'fr' ? "PUISSANT ET INNOVANT" : "FORMIDABLE & INNOVATIVE"}
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
            className="text-kgm-amber text-3xl lg:text-4xl font-bold uppercase tracking-wide"
          >
            {language === 'fr' ? "ESPRIT ET HÉRITAGE DE KGM" : "SPIRIT & HERITAGE OF KGM"}
          </motion.h2>
        </div>

        {/* Front View Only */}
        <div className="relative z-10 flex justify-center mt-8">
          <div className="bg-gray-800 rounded-lg p-1 flex">
            <div className="px-6 py-3 rounded-md flex items-center gap-2 bg-kgm-amber text-black shadow-lg">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {language === 'fr' ? "Avant" : "Front"}
            </div>
          </div>
        </div>

        {/* Car Display */}
        <div className="relative z-10 flex-1 flex items-center justify-center mt-8 -top-[122px] lg:top-0">
          <motion.div
            initial={{ opacity: 1, scale: 1 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0 }}
            className="relative w-full max-w-[80%] lg:max-w-none h-[17.5vh] lg:h-[600px] flex items-center justify-center mb-20 lg:mb-40"
          >
            <Image
              src="https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/GRANDMUSSO/section2/20250210191548220_7isWeA.png"
              alt="GRAND MUSSO front view"
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
            <div
              key={`${selectedColor}-${toneMode}`}
              className="relative w-full h-[500px] flex items-center justify-center bg-black"
            >
              <Image
                key={`${selectedColor}-${toneMode}`}
                src={toneMode === '1 TONE' ? carColors[selectedColor].oneTone : carColors[selectedColor].twoTone}
                alt={`GRAND MUSSO in ${carColors[selectedColor].name} - ${toneMode}`}
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
                    <span className="text-white font-semibold text-[9px] lg:text-sm">{language === 'fr' ? "2 TONS" : "2 TONE"}</span>
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
            </div>
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
                    <h3 className="text-2xl font-bold mb-4">{language === 'fr' ? "Vue VR 360°" : "360° VR View"}</h3>
                    <p className="text-lg opacity-80">{language === 'fr' ? "Images VR non disponibles pour cette combinaison de couleur/ton" : "VR images not available for this color/tone combination"}</p>
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

              {/* Color Selection Panel - Inside VR View */}
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
                      <span className="text-white font-semibold text-[9px] lg:text-sm">{language === 'fr' ? "1 TON" : "1 TONE"}</span>
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
                      <span className="text-white font-semibold text-[9px] lg:text-sm">2 TONE</span>
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
        </section>

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
                <source src="https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/GRANDMUSSO/section4/20250224134521785_grwArt.mp4" type="video/mp4" />
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
                  {language === 'fr' ? "FIABLE, SÛR ET FONCTIONNEL" : "EASY, SAFE AND CONVENIENT"}
                </h2>
              </motion.div>
            </motion.div>
          </motion.div>
        </section>

        {/* Section 5: Interior Features & Colors */}
        <section className="relative bg-black overflow-hidden">
          {/* Header */}
          <div className="absolute top-4 left-0 right-0 md:top-8 md:left-1/2 md:transform md:-translate-x-1/2 z-20 text-center px-0 md:px-4">
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

          {/* First Interior Image - Khaki with black headlining */}
          <div className="relative w-full h-[35vh] md:h-screen flex items-center justify-center overflow-hidden px-0 pt-24 md:pt-32">
            <div className="absolute inset-x-0 top-0 h-[60%] md:h-full md:top-0">
              <Image
                src="https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/GRANDMUSSO/section5/1.jpg"
                alt="Khaki with black headlining Interior"
                fill
                className="object-cover scale-105 md:scale-100"
                priority
                quality={90}
              />
            </div>

            {/* Interactive Interior Hotspots */}
            {interiorHotspots.map((hotspot) => {
              // Calculate adjusted position for mobile (image is 50% height, so adjust y position proportionally)
              const yPercent = parseFloat(hotspot.position.y);
              const adjustedY = (yPercent / 2) - 4; // Since image container is 50% height on mobile, adjusted position
              
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
                  className="absolute w-6 h-6 md:w-8 md:h-8 bg-kgm-amber rounded-full flex items-center justify-center text-black font-bold text-sm md:text-lg shadow-lg hover:bg-kgm-amber/80 transition-all duration-300 z-30"
                  style={{
                    left: isMobile ? `${adjustedX}%` : hotspot.position.x,
                    top: isMobile ? `${adjustedY}%` : hotspot.position.y,
                    transform: 'translate(-50%, -50%)'
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

          {/* Third Interior Image - Black with grey headlining */}
          <div className="relative w-full h-screen flex items-center justify-center">
            <Image
              src="https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/GRANDMUSSO/section5/3.jpg"
              alt="Black with grey headlining Interior"
              fill
              className="object-cover"
              quality={90}
            />
            
            {/* Color Scheme Text Overlay */}
            <div className="absolute bottom-8 left-8 z-30">
              <h3 className="text-white text-4xl md:text-5xl font-bold mb-2">{language === 'fr' ? "NOIR AVEC PLAFOND NOIR" : "BLACK WITH BLACK HEADLINING"}</h3>
              <p className="text-white text-sm opacity-80">{language === 'fr' ? "* Les photos et descriptions sont à titre indicatif uniquement et peuvent différer du produit réel." : "* The photos and descriptions are for reference only and may differ from the actual product."}</p>
            </div>

            </div>

          {/* Fourth Interior Image - Additional Interior View */}
          <div className="relative w-full h-screen flex items-center justify-center">
            <Image
              src="https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/GRANDMUSSO/section5/4.jpg"
              alt="Interior Features View"
              fill
              className="object-cover"
              quality={90}
            />
            
            {/* Color Scheme Text Overlay */}
            <div className="absolute bottom-8 left-8 z-30">
              <h3 className="text-white text-4xl md:text-5xl font-bold mb-2">{language === 'fr' ? "INTÉRIEUR PREMIUM" : "PREMIUM INTERIOR"}</h3>
              <p className="text-white text-sm opacity-80">{language === 'fr' ? "* Les photos et descriptions sont à titre indicatif uniquement et peuvent différer du produit réel." : "* The photos and descriptions are for reference only and may differ from the actual product."}</p>
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
                {language === 'fr' ? "SÛR ET SÉCURISÉ SUR TOUTE ROUTE" : "SAFE AND SOUND ON EVERY ROAD"}
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
                    <div className="rounded-lg overflow-hidden relative" style={{ height: isMobile ? '450px' : '514px' }}>
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
                      
                      {/* Content Overlay - Hidden when video is playing */}
                      {!(playingVideo === feature.video && videoPlaying) && (
                        <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-between z-10">
                          {/* Special layout for TPMS card (id 7) */}
                          {feature.id === 7 ? (
                            <div className="flex flex-col justify-between h-full">
                              <div className="flex-1"></div>
                              <div className="text-box backdrop-blur-sm bg-black/10 rounded-lg p-3 md:p-4">
                                <div>
                                  <em className={`${feature.textColor} text-sm font-light mb-2 drop-shadow-lg opacity-0`}></em>
                                  <p className={`${feature.textColor} text-2xl font-bold mb-4 drop-shadow-lg`}>{feature.title}</p>
                                  {feature.hasOpenButton && (
                                    <button 
                                      className="bg-kgm-amber text-black w-10 h-10 rounded-full font-semibold hover:bg-kgm-amber/80 transition-colors duration-300 flex items-center justify-center"
                                      onClick={() => setIsTPMSCarouselOpen(prev => !prev)}
                                    >
                                      <span className="text-lg">{isTPMSCarouselOpen ? '−' : '+'}</span>
                                    </button>
                                  )}
                                </div>
                                <p className={`${feature.textColor} text-sm leading-relaxed drop-shadow-lg`}></p>
                              </div>
                            </div>
                          ) : (
                            <>
                              {/* Title section at top - always at top */}
                              <div className="flex flex-col backdrop-blur-sm bg-black/10 rounded-lg p-3 md:p-4">
                                <h3 className={`${feature.textColor} text-sm font-light mb-2 drop-shadow-lg`}>{feature.title}</h3>
                                <h2 className={`${feature.subtitleColor} text-xl md:text-2xl font-bold mb-3 md:mb-4 drop-shadow-lg`}>{feature.subtitle}</h2>
                                {feature.hasOpenButton && (feature.id === 4 || feature.id === 5) && (
                                  <button 
                                    className="bg-kgm-amber text-black w-10 h-10 rounded-full font-semibold hover:bg-kgm-amber/80 transition-colors duration-300 flex items-center justify-center"
                                    onClick={() => {
                                      if (feature.id === 4) {
                                        setIsAEBCarouselOpen(prev => !prev);
                                      } else if (feature.id === 5) {
                                        setIsESCCarouselOpen(prev => !prev);
                                      }
                                    }}
                                  >
                                    <span className="text-lg">
                                      {(feature.id === 4 && isAEBCarouselOpen) || (feature.id === 5 && isESCCarouselOpen) ? '−' : '+'}
                                    </span>
                                  </button>
                                )}
                              </div>
                              
                              {/* Bottom Content - Description always at bottom */}
                              <div className="flex flex-col items-end backdrop-blur-sm bg-black/10 rounded-lg p-3 md:p-4">
                                {feature.id === 5 ? (
                                  <p className={`${feature.textColor} text-sm leading-relaxed mb-[15px] md:mb-[15px] drop-shadow-lg text-right`}>
                                    {feature.description}
                                  </p>
                                ) : (
                                  <p className={`${feature.textColor} text-sm leading-relaxed mb-4 md:mb-4 drop-shadow-lg text-right`}>
                                    {feature.description}
                                  </p>
                                )}
                              </div>
                            </>
                          )}
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

                  {/* AEB Inner Slider */}
                  {feature.id === 4 && (
                    <SousSlider
                      items={aebCarouselData}
                      isOpen={isAEBCarouselOpen}
                      onClose={() => setIsAEBCarouselOpen(false)}
                      itemsPerView={3}
                      language={language}
                    />
                  )}

                  {/* ESC Inner Slider */}
                  {feature.id === 5 && (
                    <SousSlider
                      items={escCarouselData}
                      isOpen={isESCCarouselOpen}
                      onClose={() => setIsESCCarouselOpen(false)}
                      itemsPerView={3}
                      language={language}
                    />
                  )}

                  {/* TPMS Inner Slider */}
                  {feature.id === 7 && (
                    <SousSlider
                      items={tpmsCarouselData}
                      isOpen={isTPMSCarouselOpen}
                      onClose={() => setIsTPMSCarouselOpen(false)}
                      itemsPerView={3}
                      language={language}
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
                  onSlideChange={setCurrentSafetyCard}
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
            <h2 className="text-white text-sm font-light mb-2">{language === 'fr' ? "FONCTIONNALITÉS" : "FEATURES"}</h2>
            <h1 style={{ fontSize: "24px", fontFamily: "inherit", lineHeight: "1.2", fontWeight: "700", margin: 0, padding: 0, color: "white" }}>{language === 'fr' ? "Intelligence et connectivité" : "Intelligence and connectivity"}</h1>
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
                  <div className="convenience-card flex-shrink-0 w-[65%] md:w-[25%] mr-[4%] md:mr-4" style={{ marginLeft: index === 0 && isMobile ? '8%' : '0' }}>
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
                            {/* Title section at top on mobile */}
                            <div className="md:hidden backdrop-blur-sm bg-black/10 rounded-lg p-3 md:p-4">
                              <em className="text-white text-sm font-light block mb-2 drop-shadow-lg">{feature.title}</em>
                              <p className="text-white text-xl font-bold mb-3 drop-shadow-lg">{feature.subtitle}</p>
                              {feature.hasOpenButton && feature.id === 2 && (
                                <button 
                                  type="button"
                                  className="dsc-expand-btn cursor-zoom bg-kgm-amber text-black px-4 py-2 rounded font-semibold hover:bg-kgm-amber/80 transition-colors duration-300 mb-3"
                                  onClick={() => setIsMoreFeaturesCarouselOpen(prev => !prev)}
                                >
                                  {isMoreFeaturesCarouselOpen ? (language === 'fr' ? 'Fermer' : 'Close') : (language === 'fr' ? 'Ouvrir' : 'Open')}
                                </button>
                              )}
                            </div>
                            
                            {/* Bottom section - Description at bottom on mobile, all content on desktop */}
                            <div className="flex flex-col gap-6 md:gap-0">
                              {/* Desktop: title section */}
                              <div className="hidden md:block backdrop-blur-sm bg-black/10 rounded-lg p-3 md:p-4">
                                <em className="text-white text-sm font-light block mb-2 drop-shadow-lg">{feature.title}</em>
                                <p className="text-white text-xl font-bold mb-3 drop-shadow-lg">{feature.subtitle}</p>
                                {feature.hasOpenButton && feature.id === 2 && (
                                  <button 
                                    type="button"
                                    className="dsc-expand-btn cursor-zoom bg-kgm-amber text-black px-4 py-2 rounded font-semibold hover:bg-kgm-amber/80 transition-colors duration-300 mb-3"
                                    onClick={() => setIsMoreFeaturesCarouselOpen(prev => !prev)}
                                  >
                                    {isMoreFeaturesCarouselOpen ? (language === 'fr' ? 'Fermer' : 'Close') : (language === 'fr' ? 'Ouvrir' : 'Open')}
                                  </button>
                                )}
                              </div>
                              {/* Description - always at bottom */}
                              <p className={`${
                                feature.description.includes('Featuring an 8-way power-adjustable driver seat')
                                  ? 'text-white'
                                  : 'text-white'
                              } text-sm leading-relaxed drop-shadow-lg backdrop-blur-sm bg-black/10 rounded-lg p-3 md:p-4`}>{feature.description}</p>
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

                  {/* More Features Inner Slider */}
                  {feature.id === 2 && (
                    <SousSlider
                      items={moreFeaturesCarouselData}
                      isOpen={isMoreFeaturesCarouselOpen}
                      onClose={() => setIsMoreFeaturesCarouselOpen(false)}
                      itemsPerView={3}
                      language={language}
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
          <div className="text-center mb-12 md:mb-16 px-4">
            <h2 className="text-white text-sm font-light mb-2">{language === 'fr' ? "PERFORMANCE" : "PERFORMANCE"}</h2>
            <h1 style={{ fontSize: "24px", fontFamily: "inherit", lineHeight: "1.2", fontWeight: "700", margin: 0, padding: 0, color: "white" }}>{language === 'fr' ? "Baroudeur dans l'âme, puissant et agile à chaque aventure" : "Adventurer at heart, powerful and agile on every adventure"}</h1>
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
                    : `translateX(calc(-${currentPerformanceCard * (100 / 3)}% - ${currentPerformanceCard * 16}px))`
                }}
                onTouchStart={onPerformanceTouchStart}
                onTouchMove={onPerformanceTouchMove}
                onTouchEnd={onPerformanceTouchEnd}
              >
                {performanceFeatures.map((feature, index) => (
                  <div 
                    key={feature.id} 
                    className="performance-card flex-shrink-0 w-[65%] md:w-[calc(33.333%_-_11px)] mr-[4%] md:mr-4"
                  >
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
                            {/* Title section at top on mobile */}
                            <div className="md:hidden backdrop-blur-sm bg-black/10 rounded-lg p-3 md:p-4">
                              <em className="text-white text-sm font-light block mb-2 drop-shadow-lg">{feature.title}</em>
                              <p className="text-white text-xl font-bold mb-3 drop-shadow-lg">{feature.subtitle}</p>
                              {feature.hasOpenButton && (
                                <button 
                                  type="button"
                                  className="dsc-expand-btn cursor-zoom bg-kgm-amber text-black px-4 py-2 rounded font-semibold hover:bg-kgm-amber/80 transition-colors duration-300 mb-3"
                                >
                                  Open
                                </button>
                              )}
                            </div>
                            
                            {/* Bottom section - Description at bottom on mobile, all content on desktop */}
                            <div className="flex flex-col gap-6 md:gap-0">
                              {/* Desktop: title section */}
                              <div className="hidden md:block backdrop-blur-sm bg-black/10 rounded-lg p-3 md:p-4">
                                <em className="text-white text-sm font-light block mb-2 drop-shadow-lg">{feature.title}</em>
                                <p className="text-white text-2xl font-bold mb-3 drop-shadow-lg">{feature.subtitle}</p>
                                {feature.hasOpenButton && (
                                  <button 
                                    type="button"
                                    className="dsc-expand-btn cursor-zoom bg-kgm-amber text-black px-4 py-2 rounded font-semibold hover:bg-kgm-amber/80 transition-colors duration-300 mb-3"
                                  >
                                    Open
                                  </button>
                                )}
                              </div>
                              {/* Description - always at bottom */}
                              <p className="text-white text-sm md:text-sm leading-relaxed drop-shadow-lg backdrop-blur-sm bg-black/10 rounded-lg p-3 md:p-4">{feature.description}</p>
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
                href="/brochures/Musso.pdf"
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


      <Footer />
    </div>
  );
};

export default MussoGrandPage;