"use client";

import {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
  useLayoutEffect,
} from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useLanguage } from "@/contexts/LanguageContext";
import CarFeatureSidebar from "@/components/CarFeatureSidebar";
import SEO from "@/components/SEO";

// generateStaticParams() is now in the parent layout.tsx

const TivoliPage = () => {
  const { language } = useLanguage();
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isSecondSectionVisible, setIsSecondSectionVisible] = useState(false);
  const [carView, setCarView] = useState<"front" | "rear">("front");
  const [activeHotspot, setActiveHotspot] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"color" | "vr">("color");
  const [selectedColor, setSelectedColor] = useState(0);
  const [toneMode, setToneMode] = useState<"1 TONE">("1 TONE");
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
  const [currentSpecImage, setCurrentSpecImage] = useState(0);
  const [activeAccordion, setActiveAccordion] = useState(3); // TYRE INFORMATION is open by default
  const [activeAccessoryTab, setActiveAccessoryTab] = useState<
    "exterior" | "interior"
  >("exterior");
  const [isInteriorSliderOpen, setIsInteriorSliderOpen] = useState(false);
  const [currentInteriorSliderIndex, setCurrentInteriorSliderIndex] =
    useState(0);
  // Exterior sidebar state
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);
  const [selectedHotspot, setSelectedHotspot] = useState<string | null>(null);
  const [currentHotspotImage, setCurrentHotspotImage] = useState(0);

  // Interior sidebar state
  const [isInteriorSideMenuOpen, setIsInteriorSideMenuOpen] = useState(false);
  const [selectedInteriorHotspot, setSelectedInteriorHotspot] = useState<
    string | null
  >(null);
  const [currentInteriorHotspotImage, setCurrentInteriorHotspotImage] =
    useState(0);
  const [isMobile, setIsMobile] = useState(false);

  // Debug sidebar state
  useEffect(() => {
    console.log("Exterior sidebar state changed:", {
      isSideMenuOpen,
      selectedHotspot,
    });
  }, [isSideMenuOpen, selectedHotspot]);

  useEffect(() => {
    console.log("Interior sidebar state changed:", {
      isInteriorSideMenuOpen,
      selectedInteriorHotspot,
    });
  }, [isInteriorSideMenuOpen, selectedInteriorHotspot]);
  const section2Ref = useRef<HTMLDivElement>(null);
  const section4Ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: section2Ref,
    offset: ["start end", "end start"],
  });
  const { scrollYProgress: section4ScrollProgress } = useScroll({
    target: section4Ref,
    offset: ["start end", "end start"],
  });

  // Transform values for scroll animations
  const videoWidth = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    ["30%", "70%", "100%"]
  );
  const videoHeight = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    ["auto", "80%", "100%"]
  );
  const textSize = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [
      "clamp(2rem, 6vw, 4rem)",
      "clamp(1.8rem, 5vw, 3rem)",
      "clamp(1.5rem, 4vw, 2.5rem)",
    ]
  );

  // Transform values for section 4 (Driver-Centric Cockpit)
  const section4VideoWidth = useTransform(
    section4ScrollProgress,
    [0, 0.3, 0.6, 1],
    ["50%", "75%", "100%", "100%"]
  );
  const section4TextSize = useTransform(
    section4ScrollProgress,
    [0, 0.5, 1],
    [
      "clamp(2.5rem, 7vw, 5rem)",
      "clamp(2rem, 6vw, 4rem)",
      "clamp(1.5rem, 4vw, 2.5rem)",
    ]
  );
  const section4TextOpacity = useTransform(
    section4ScrollProgress,
    [0, 0.2, 0.8, 1],
    [1, 1, 0.9, 0.7]
  );

  const textLineHeight = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [1.2, 1.3, 1.4]
  );
  const textOpacity = useTransform(
    scrollYProgress,
    [0, 0.3, 0.7, 1],
    [1, 1, 0.9, 0.8]
  );
  const textY = useTransform(scrollYProgress, [0, 0.5, 1], [0, 0, 0]);

  // Mobile detection for responsive design
  useLayoutEffect(() => {
    const checkMobile = () => {
      if (typeof window !== "undefined") {
        setIsMobile(window.innerWidth < 768);
      }
    };

    checkMobile();
    if (typeof window !== "undefined") {
      window.addEventListener("resize", checkMobile);
      return () => window.removeEventListener("resize", checkMobile);
    }
  }, []);

  const features = useMemo(
    () => [
      {
        icon: "https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/Tivoli/hero/20250124172442986_VZpfKQ.svg",
        title: language === "fr" ? "Style Intelligent" : "Smart Style",
        description:
          language === "fr"
            ? "L'Essence de la Vie Urbaine"
            : "Essence of Urban Life",
      },
      {
        icon: "https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/Tivoli/hero/20250124172458046_LBeV4i.svg",
        title: language === "fr" ? "Extérieur Iconique" : "Iconic Exterior",
        description:
          language === "fr" ? "Compact et attractif" : "Compact and attractive",
      },
      {
        icon: "https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/Tivoli/hero/20250124172512877_nxoBQR.svg",
        title:
          language === "fr" ? "Intérieur Fonctionnel" : "Functional Interior",
        description:
          language === "fr"
            ? "Espace entièrement équipé"
            : "Fully-equipped space",
      },
    ],
    [language]
  );

  // Safety features data
  const safetyFeatures = useMemo(
    () => [
      {
        id: 0,
        title: language === "fr" ? "Système ADAS" : "ADAS System",
        subtitle:
          language === "fr"
            ? "Freinage d'Urgence Autonome : AEB (En option)"
            : "Autonomous Emergency Braking: AEB (Optional)",
        description:
          language === "fr"
            ? "L'AEB avertit le conducteur d'une collision frontale potentielle pendant la conduite et active automatiquement les freins pour éviter un accident."
            : "AEB warns the driver of a potential frontal collision while driving and automatically activates the brakes to prevent an accident.",
        image:
          "https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/Tivoli/section6/20250124180916235_9yM4WE.jpg",
        video:
          "https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/Tivoli/section6/20250124180916340_R2wnLR.mp4",
        bgColor: "bg-gray-800",
        textColor: "text-white",
        subtitleColor: "text-white",
        hasOpenButton: true,
      },
      {
        id: 1,
        title:
          language === "fr"
            ? "Conception axée sur la sécurité"
            : "Safety-prioritized design",
        subtitle:
          language === "fr"
            ? "79% d'acier haute résistance"
            : "79% high-strength steel",
        description:
          language === "fr"
            ? "L'utilisation d'acier haute résistance (79%) et d'acier ultra-haute résistance (40%) appliqué par le processus de formage à chaud (HPF) maximise la rigidité de la carrosserie et la sécurité des passagers."
            : "By applying the HPF (Hot Press Forming) process with high-strength (44%) and ultra-high-strength (34%) steel plates, the rigidity of the body and passenger safety have been maximized.",
        image:
          "https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/Tivoli/section6/20250124181354421_c7CWxL.jpg",
        bgColor: "bg-gray-200",
        textColor: "text-white",
        subtitleColor: "text-white",
        hasOpenButton: false,
      },
      {
        id: 2,
        title:
          language === "fr"
            ? "Protection de tous les occupants"
            : "Keeping all occupants safe",
        subtitle: language === "fr" ? "6 Airbags" : "6 Airbags",
        description:
          language === "fr"
            ? "Le véhicule est équipé de deux airbags pour le conducteur et le passager avant, de deux airbags latéraux en première rangée, et de deux airbags rideaux pour la deuxième rangée."
            : "The vehicle is equipped with two airbags for the driver and front passenger, two side airbags in the first row, and two curtain airbags for the second row.",
        image:
          "https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/Tivoli/section6/20250124181514169_NgMIlk.jpg",
        bgColor: "bg-gray-200",
        textColor: "text-white",
        subtitleColor: "text-white",
        hasOpenButton: false,
      },
      {
        id: 3,
        title:
          language === "fr"
            ? "Sécurité assurée dans toutes les conditions de conduite"
            : "Secured safety in all driving conditions",
        subtitle:
          language === "fr"
            ? "Contrôle de Stabilité Électronique (ESC)"
            : "Electronic Stability Control (ESC)",
        description:
          language === "fr"
            ? "L'ESC contribue à éviter la perte de contrôle du véhicule en agissant automatiquement sur les freins de certaines roues et en réduisant la puissance du moteur lorsque la trajectoire ne correspond plus à celle voulue par le conducteur. Il offre ainsi diverses fonctions permettant de prévenir les accidents en maintenant une stabilité optimale du véhicule dans de multiples situations de conduite."
            : "ESC helps prevent loss of control by automatically applying brakes to individual wheels and reducing engine power when it detects that the vehicle is not going where the driver is steering. ESC provides various features to prevent accidents in advance by ensuring stable vehicle posture control in a variety of driving conditions.",
        image:
          "https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/Design%20sans%20titre%20(8).png",
        bgColor: "bg-gray-800",
        textColor: "text-white",
        subtitleColor: "text-white",
        hasOpenButton: true,
      },
      {
        id: 4,
        title:
          language === "fr"
            ? "Fonctionnalités de Sécurité Supplémentaires"
            : "Additional Safety Features",
        subtitle:
          language === "fr"
            ? "Protection Complète"
            : "Comprehensive Protection",
        description:
          language === "fr"
            ? "Systèmes de sécurité avancés incluant ABS, EBD, BAS, HAC, et plus pour assurer une protection maximale pour tous les occupants."
            : "Advanced safety systems including ABS, EBD, BAS, HAC, and more to ensure maximum protection for all occupants.",
        image:
          "https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/Tivoli/section6/20250124181924579_ONlTRn.jpg",
        bgColor: "bg-blue-600",
        textColor: "text-white",
        subtitleColor: "text-white",
        hasOpenButton: true,
      },
    ],
    [language]
  );

  // Convenience features data
  const convenienceFeatures = useMemo(
    () => [
      {
        id: 0,
        title:
          language === "fr" ? "Sièges Confortables" : "Comfortable Seating",
        subtitle: language === "fr" ? "Design Ergonomique" : "Ergonomic Design",
        description:
          language === "fr"
            ? "Sièges conçus pour un confort maximal lors de longs trajets avec support ergonomique et matériaux."
            : "Featuring an 8-way powered seat with 2-way lumbar support (for adjusting the lower backrest), providing a comfortable driving environment tailored to anyone's needs.",
        image:
          "https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/Tivoli/section7/20250124182828797_9wPX6b.jpg",
        bgColor: "bg-gray-200",
        textColor: "text-white",
        subtitleColor: "text-white",
        hasOpenButton: false,
      },
      {
        id: 1,
        title: language === "fr" ? "Plateau Magique" : "Magic Tray",
        subtitle:
          language === "fr" ? "Stockage Polyvalent" : "Versatile Storage",
        description:
          language === "fr"
            ? "Système de plateau pliable innovant qui fournit des solutions de stockage flexibles et transforme votre espace intérieur."
            : "Innovative foldable tray system that provides flexible storage solutions and transforms your interior space.",
        image:
          "https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/Tivoli/section7/20250124182959348_sGb7us.jpg",
        bgColor: "bg-gray-400",
        textColor: "text-white",
        subtitleColor: "text-white",
        hasOpenButton: true,
      },
      {
        id: 2,
        title: language === "fr" ? "Contrôle Climatique" : "Climate Control",
        subtitle:
          language === "fr" ? "Climatisation Automatique" : "Automatic AC",
        description:
          language === "fr"
            ? "Système de climatisation avancé avec régulation automatique de la température pour un confort optimal dans toutes les conditions météorologiques."
            : "Advanced climate control system with automatic temperature regulation for optimal comfort in all weather conditions.",
        image:
          "https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/Tivoli/section7/20250124183154608_ZxRPpi.jpg",
        bgColor: "bg-gray-800",
        textColor: "text-white",
        subtitleColor: "text-white",
        hasOpenButton: false,
      },
      {
        id: 3,
        title:
          language === "fr"
            ? "Fonctionnalités Supplémentaires"
            : "Additional Features",
        subtitle:
          language === "fr" ? "Confort Intelligent" : "Smart Convenience",
        description:
          language === "fr"
            ? "Découvrez des fonctionnalités de confort supplémentaires conçues pour améliorer votre expérience de conduite et rendre chaque voyage plus confortable."
            : "Discover additional convenience features designed to enhance your driving experience and make every journey more comfortable.",
        image:
          "https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/Tivoli/section7/20250124183314923_KAyAwp.jpg",
        bgColor: "bg-blue-600",
        textColor: "text-white",
        subtitleColor: "text-white",
        hasOpenButton: true,
      },
    ],
    [language]
  );

  // Performance features data
  const performanceFeatures = useMemo(
    () => [
      {
        id: 2,
        title: language === "fr" ? "" : "",
        subtitle:
          language === "fr" ? "Moteur 1.5L GDI Turbo" : "1.5L GDI Turbo Engine",
        description:
          language === "fr"
            ? "Moteur 1.5L GDI Turbo avancé qui développe 163 Ch, offrant un couple maximal de 260 Nm."
            : "Advanced 1.5L GDI Turbo engine that develops 163 hp, offering a maximum torque of 260 Nm.",
        image:
          "https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/Tivoli/section8/20250124183925863_IlLs6i.jpg",
        bgColor: "bg-gray-400",
        textColor: "text-white",
        subtitleColor: "text-white",
        hasOpenButton: false,
      },
      {
        id: 3,
        title: language === "fr" ? "Moteur Écologique" : "Eco-Friendly Engine",
        subtitle:
          language === "fr"
            ? "Boite automatique 6 rapports"
            : "6-speed automatic transmission",
        description:
          language === "fr"
            ? "Boite de vitesse automatique CVT de 6 rapports pour une meilleure expérience de conduite."
            : "6-speed CVT automatic transmission for a better driving experience.",
        image:
          "https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/Tivoli/section8/20250124184200326_xdKS4w.jpg",
        bgColor: "bg-gray-800",
        textColor: "text-white",
        subtitleColor: "text-white",
        hasOpenButton: false,
      },
      {
        id: 4,
        title: language === "fr" ? "Conduite Agile" : "Agile Handling",
        subtitle:
          language === "fr" ? "Direction Réactive" : "Responsive Steering",
        description:
          language === "fr"
            ? "Direction précise et réglage de suspension pour une conduite confiante et une qualité de roulement fluide en ville et sur autoroute."
            : "Precise steering and suspension tuning for confident handling and smooth ride quality in both city and highway driving.",
        image:
          "https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/Tivoli/section8/20250210152333303_07oSa3.jpg",
        bgColor: "bg-blue-600",
        textColor: "text-white",
        subtitleColor: "text-white",
        hasOpenButton: false,
      },
    ],
    [language]
  );

  // Specification images
  const specImages = [
    {
      id: 0,
      src: "https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/Tivoli/section9/20250204095751200_nOsk1W.jpg",
      alt: "Front view of Tivoli",
    },
    {
      id: 1,
      src: "https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/Tivoli/section9/20250204095759042_oQPF7t.jpg",
      alt: "Side view of Tivoli",
    },
    {
      id: 2,
      src: "https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/Tivoli/section9/20250224134135542_yPGjdl.jpg",
      alt: "Rear view of Tivoli",
    },
  ];

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
      title: "DIMENSIONS",
      content: {
        dimensions: [
          { label: "Overall Length", value: "4,200mm" },
          { label: "Overall Width", value: "1,560mm" },
          { label: "Overall Height", value: "1,613mm" },
          { label: "Wheelbase", value: "2,600mm" },
          { label: "Ground Clearance", value: "190mm" },
        ],
      },
    },
    {
      id: 1,
      title: "POWERTRAIN",
      content: {
        engine: [
          { label: "Engine Type", value: "1.5L GDI Turbo" },
          { label: "Displacement", value: "1,497cc" },
          { label: "Max Power", value: "160ps @ 5,500rpm" },
          { label: "Max Torque", value: "25.5kgf·m @ 1,500-4,000rpm" },
        ],
        transmission: [
          { label: "Transmission", value: "6-Speed Automatic" },
          { label: "Drive Type", value: "FWD / AWD" },
        ],
      },
    },
    {
      id: 2,
      title: "FUEL EFFICIENCY",
      content: {
        efficiency: [
          { label: "City", value: "12.4 km/L" },
          { label: "Highway", value: "15.2 km/L" },
          { label: "Combined", value: "13.5 km/L" },
          { label: "CO2 Emissions", value: "119 g/km" },
        ],
      },
    },
    {
      id: 3,
      title: "TYRE INFORMATION",
      content: {
        tyres: [
          {
            maker: "KH",
            size: "205/60R16 SUMMER",
            productSheet:
              "/assets/Modelspage/Tivoli/section9/KH_16_SUMMER_PIS.pdf",
            tyreLabel: "/assets/Modelspage/Tivoli/section9/KH_16_SUMMER_TL.pdf",
          },
          {
            maker: "NX",
            size: "205/65R16",
            productSheet: "/assets/Modelspage/Tivoli/section9/NX_16_PIS.pdf",
            tyreLabel: "/assets/Modelspage/Tivoli/section9/NX_16_TL.pdf",
          },
          {
            maker: "KH",
            size: "215/50R18",
            productSheet: "/assets/Modelspage/Tivoli/section9/KH_18_PIS.pdf",
            tyreLabel: "/assets/Modelspage/Tivoli/section9/KH_18_TL.pdf",
          },
        ],
      },
    },
  ];

  // Accessory data
  const exteriorAccessories = [
    {
      id: 0,
      name: "Hood Deflector",
      image:
        "https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/Tivoli/section10/exterior/20250131114217908_ctP7lh.jpg",
      description: "Protects the hood from road debris and insects",
    },
    {
      id: 1,
      name: "Alloy Wheels & Fender Flares",
      image:
        "https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/Tivoli/section10/exterior/20250131114242520_Kvlsds.jpg",
      description: "Enhanced wheel design with protective fender flares",
    },
    {
      id: 2,
      name: "Side Steps",
      image:
        "https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/Tivoli/section10/exterior/20250131114304523_m3VCbQ.jpg",
      description: "Convenient side steps with TIVOLI branding",
    },
    {
      id: 3,
      name: "Roof Spoiler",
      image:
        "https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/Tivoli/section10/exterior/20250131114321175_JUNS2s.jpg",
      description: "Aerodynamic roof spoiler with integrated brake light",
    },
  ];

  const interiorAccessories = [
    {
      id: 0,
      name: "TIVOLI LADY PACKAGE",
      image:
        "https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/Tivoli/section10/interior/20250131114535629_vVrr0K.jpg",
      description: "Premium red leather accessories collection",
    },
    {
      id: 1,
      name: "AIR PURIFIER +",
      image:
        "https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/Tivoli/section10/interior/20250131114503408_cR5kCF.jpg",
      description: "Advanced air purification system",
    },
    {
      id: 2,
      name: "ALLOY SPORTS PEDAL +",
      image:
        "https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/Tivoli/section10/interior/20250131114520525_NV0Mlk.jpg",
      description: "Sporty alloy pedal covers",
    },
  ];

  const carHotspots = useMemo(() => {
    if (carView === "front") {
      return [
        {
          id: "headlight",
          position: { x: "46%", y: "45%" },
          title: language === "fr" ? "Phares LED" : "LED Headlights",
          description:
            language === "fr"
              ? "Système de phares LED avancé pour une visibilité supérieure"
              : "Advanced LED headlight system for superior visibility",
          content: {
            title: language === "fr" ? "Le nouveau Tivoli" : "The new Tivoli",
            images: ["/media/tivoli/nouveau-tivoli.jpg"],
            texts: [
              language === "fr"
                ? "Le nouveau Tivoli inspire calme et confiance dès le premier regard. Son pare-chocs avant, rehaussé d'un accent rouge audacieux, révèle un détail fonctionnel plein de caractère : le crochet de remorquage. Créer la tendance plutôt que la suivre — telle est sa philosophie. Par ses formes sculptées et son allure déterminée, il affirme toute sa force et son style."
                : "The new Tivoli inspires calm and confidence from the first glance. Its front bumper, enhanced with a bold red accent, reveals a functional detail full of character: the tow hook. Creating the trend rather than following it—that is its philosophy. Through its sculpted forms and determined appearance, it asserts all its strength and style.",
            ],
          },
        },
        {
          id: "foglight",
          position: { x: "40%", y: "55%" },
          title:
            language === "fr"
              ? "Tableau de bord LCD 10,25 pouces"
              : 'Deluxe 10.25" full colour LCD cluster',
          description:
            language === "fr"
              ? "Tableau de bord digital LCD 10,25 pouces avec affichage TFT-LCD couleur"
              : '10.25" colour TFT-LCD cluster',
          content: {
            title: language === "fr" ? "Le nouveau Tivoli" : "The new Tivoli",
            images: ["/media/tivoli/nouveau-tivoli.jpg"],
            texts: [
              language === "fr"
                ? "Le nouveau Tivoli inspire calme et confiance dès le premier regard. Son pare-chocs avant, rehaussé d'un accent rouge audacieux, révèle un détail fonctionnel plein de caractère : le crochet de remorquage. Créer la tendance plutôt que la suivre — telle est sa philosophie. Par ses formes sculptées et son allure déterminée, il affirme toute sa force et son style."
                : "The new Tivoli inspires calm and confidence from the first glance. Its front bumper, enhanced with a bold red accent, reveals a functional detail full of character: the tow hook. Creating the trend rather than following it—that is its philosophy. Through its sculpted forms and determined appearance, it asserts all its strength and style.",
            ],
          },
        },
        {
          id: "wheel",
          position: { x: "53%", y: "63%" },
          title:
            language === "fr" ? "Jantes Alliage Noires" : "Black Alloy Wheels",
          description:
            language === "fr"
              ? "Jantes alliage noires distinctives pour un look sportif"
              : "Distinctive black alloy wheels for a sporty look",
          content: {
            title: language === "fr" ? "Jantes Alliage" : "Wheels",
            images: [
              "https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/Tivoli/section2/buttonsfront/btn3/20250124173500143_P6ML3q.jpg",
            ],
            texts: [
              language === "fr"
                ? '18" Jantes noir brillant'
                : '18" Glossy black wheels',
            ],
          },
        },
      ];
    } else {
      return [
        {
          id: "rear-window",
          position: { x: "34%", y: "25%" },
          title: language === "fr" ? "Feu stop à LED" : "LED Brake Light",
          description:
            language === "fr"
              ? "Idéalement situé à hauteur de regard pour signaler clairement votre freinage"
              : "Ideally positioned at eye level to clearly signal your braking",
        },

        {
          id: "rear-door",
          position: { x: "54%", y: "11%" },
          title: language === "fr" ? "Barres de toit" : "Roof Bars",
          description:
            language === "fr"
              ? "Barres de toit au design épuré"
              : "Sleekly designed roof bars",
        },
        {
          id: "rear-wheel",
          position: { x: "69%", y: "29%" },
          title: language === "fr" ? "Roue Arrière" : "Rear Wheel",
          description:
            language === "fr"
              ? "Jante arrière alliage sport"
              : "Sport alloy rear wheel",
        },
      ];
    }
  }, [language, carView]);

  // Interior hotspots data with exact positioning from reference HTML
  const interiorHotspots = useMemo(
    () => [
      {
        id: "infotainment",
        position: { x: "49%", y: "47%" },
        title:
          language === "fr"
            ? "Climatisation avant bi-zone"
            : "Front dual zone auto air conditioning system",
        description:
          language === "fr"
            ? "Climatisation automatique double zone"
            : "Front dual zone auto air conditioning",
        content: {
          title:
            language === "fr"
              ? "Climatisation avant bi-zone"
              : "Front dual zone auto air conditioning system",
          images: ["/20250124180241918_MtBE4b.jpg"],
        },
      },
      {
        id: "climate-control",
        position: { x: "52%", y: "35%" },
        title:
          language === "fr"
            ? "Ecran Multimédia HD de 8 pouces"
            : '8" HD Multimedia Screen',
        description:
          language === "fr"
            ? "Système de navigation haute définition"
            : "High definition navigation system",
        content: {
          title:
            language === "fr"
              ? "Ecran Multimédia HD de 8 pouces"
              : '8" HD Multimedia Screen',
          subtitle:
            language === "fr"
              ? "Ecran Multimédia HD de 8 pouces"
              : '8" HD Multimedia Screen',
          image:
            "https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/Tivoli/section5/image1icons/20250210105428648_E13Z7s.jpg",
        },
      },
      {
        id: "passenger-seat",
        position: { x: "69%", y: "80%" },
        title:
          language === "fr"
            ? "Sièges en simili cuir + Sièges Inclinables (2ème rangée)"
            : "Faux leather seats + Reclining seats (2nd row)",
        description:
          language === "fr"
            ? "Les sièges de 2ème rangée, réglables à un angle d'inclinaison de 32,5 degrés, offrent un confort aux passagers arrière"
            : "The 2nd-row seats, adjustable to a reclining angle of 32.5 degrees, provide comfort for rear-seat passengers",
        content: {
          title:
            language === "fr"
              ? "Sièges en simili cuir + Sièges Inclinables (2ème rangée)"
              : "Faux leather seats + Reclining seats (2nd row)",
          subtitle:
            language === "fr"
              ? "Sièges en simili cuir + Sièges Inclinables (2ème rangée)"
              : "Faux leather seats + Reclining seats (2nd row)",
          texts: [
            language === "fr"
              ? "Les sièges de 2ème rangée, réglables à un angle d'inclinaison de 32,5 degrés, offrent un confort aux passagers arrière"
              : "The 2nd-row seats, adjustable to a reclining angle of 32.5 degrees, provide comfort for rear-seat passengers",
          ],
          image:
            "https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/Tivoli/section5/image1icons/20250124180309437_mU14OG.jpg",
        },
      },
      {
        id: "headlight",
        position: { x: "32%", y: "33%" },
        title: language === "fr" ? "Phares LED" : "LED Headlights",
        description:
          language === "fr"
            ? "Système de phares LED avancé pour une visibilité supérieure"
            : "Advanced LED headlight system for superior visibility",
        content: {
          title:
            language === "fr"
              ? "Tableau de bord LCD 10,25 pouces"
              : 'Deluxe 10.25" full colour LCD cluster',
          subtitle:
            language === "fr"
              ? "Tableau de bord digital LCD 10,25 pouces avec affichage TFT-LCD couleur"
              : '10.25" colour TFT-LCD cluster',
          image: "/media/tivoli/lcd-cluster.jpg",
          texts: [
            language === "fr"
              ? "Tableau de bord digital LCD 10,25 pouces avec affichage TFT-LCD couleur"
              : '10.25" colour TFT-LCD cluster',
          ],
        },
      },
    ],
    [language]
  );

  const carColors = [
    {
      id: 0,
      name: "Grand White",
      oneTone:
        "https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/Tivoli/section3/rgb(255%20255%20255%20%20var(--tw-text-opacity,%201)%201%20tone.jpg",
      twoTone:
        "https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/Tivoli/section3/rgb(255%20255%20255%20%20var(--tw-text-opacity,%201)2%20tones.jpg",
      colorSwatch: "#FFFFFF",
      vrImages: {
        oneTone: Array.from(
          { length: 36 },
          (_, i) =>
            `/assets/Modelspage/Tivoli/vr360/grand-white-1tone/${String(
              i + 1
            ).padStart(2, "0")}.png`
        ),
        twoTone: Array.from(
          { length: 36 },
          (_, i) =>
            `/assets/Modelspage/Tivoli/vr360/grand-white-2tone/${String(
              i + 1
            ).padStart(2, "0")}.png`
        ),
      },
    },
    {
      id: 1,
      name: "Latte Greige",
      oneTone:
        "https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/Tivoli/section3/rgb(212,%20196,%20168)%20one%20tone.jpg",
      twoTone:
        "https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/Tivoli/section3/rgb(212,%20196,%20168)%202%20tones.jpg",
      colorSwatch: "#D4C4A8",
      vrImages: {
        oneTone: Array.from(
          { length: 36 },
          (_, i) =>
            `/assets/Modelspage/Tivoli/vr360/latte-greige-1tone/${String(
              i + 1
            ).padStart(2, "0")}.png`
        ),
        twoTone: Array.from(
          { length: 36 },
          (_, i) =>
            `/assets/Modelspage/Tivoli/vr360/latte-greige-2tone/${String(
              i + 1
            ).padStart(2, "0")}.png`
        ),
      },
    },
    {
      id: 2,
      name: "Steel Grey",
      oneTone:
        "https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/Tivoli/section3/rgb(107,%20107,%20107)%201%20tone.jpg",
      twoTone:
        "https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/Tivoli/section3/rgb(107,%20107,%20107)%202%20tones.jpg",
      colorSwatch: "#6B6B6B",
      vrImages: {
        oneTone: Array.from(
          { length: 36 },
          (_, i) =>
            `/assets/Modelspage/Tivoli/vr360/steel-grey-1tone/${String(
              i + 1
            ).padStart(2, "0")}.png`
        ),
        twoTone: Array.from(
          { length: 36 },
          (_, i) =>
            `/assets/Modelspage/Tivoli/vr360/steel-grey-2tone/${String(
              i + 1
            ).padStart(2, "0")}.png`
        ),
      },
    },
    {
      id: 3,
      name: "Midnight Black",
      oneTone:
        "https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/Tivoli/section3/rgb(26,%2026,%2026)%201%20tonr.jpg",
      twoTone:
        "https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/Tivoli/section3/rgb(26,%2026,%2026)%202%20tons.jpg",
      colorSwatch: "#1A1A1A",
      vrImages: {
        oneTone: Array.from(
          { length: 36 },
          (_, i) =>
            `/assets/Modelspage/Tivoli/vr360/midnight-black-1tone/${String(
              i + 1
            ).padStart(2, "0")}.png`
        ),
        twoTone: Array.from(
          { length: 36 },
          (_, i) =>
            `/assets/Modelspage/Tivoli/vr360/midnight-black-2tone/${String(
              i + 1
            ).padStart(2, "0")}.png`
        ),
      },
    },
    {
      id: 4,
      name: "Ocean Blue",
      oneTone:
        "https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/Tivoli/section3/rgb(46,%2091,%20138)%201%20tonr.jpg",
      twoTone:
        "https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/Tivoli/section3/rgb(46,%2091,%20138)%202%20tons.jpg",
      colorSwatch: "#2E5B8A",
      vrImages: {
        oneTone: Array.from(
          { length: 36 },
          (_, i) =>
            `/assets/Modelspage/Tivoli/vr360/ocean-blue-1tone/${String(
              i + 1
            ).padStart(2, "0")}.png`
        ),
        twoTone: Array.from(
          { length: 36 },
          (_, i) =>
            `/assets/Modelspage/Tivoli/vr360/ocean-blue-2tone/${String(
              i + 1
            ).padStart(2, "0")}.png`
        ),
      },
    },
  ];

  // Get current VR images based on selected color and tone
  const getCurrentVrImages = () => {
    const color = carColors[selectedColor];
    return toneMode === "1 TONE"
      ? color.vrImages.oneTone
      : color.vrImages.twoTone;
  };

  // Reset frame when color or tone changes
  useEffect(() => {
    setCurrentFrame(0);
    setTargetFrame(0);

    // Force refresh by adding timestamp to image key
    const refreshKey = Date.now();
    console.log(`Switching to ${toneMode} mode at ${refreshKey}`);
  }, [selectedColor, toneMode]);

  // Handler functions for exterior hotspots
  const handleExteriorHotspotClick = (hotspotId: string) => {
    setSelectedHotspot(hotspotId);
    setCurrentHotspotImage(0); // Reset to first image
    setIsSideMenuOpen(true);
  };

  const closeSideMenu = () => {
    setIsSideMenuOpen(false);
    setSelectedHotspot(null);
  };

  // Handler functions for interior hotspots
  const handleInteriorHotspotClick = (hotspotId: string) => {
    setSelectedInteriorHotspot(hotspotId);
    setCurrentInteriorHotspotImage(0); // Reset to first image
    setIsInteriorSideMenuOpen(true);
  };

  const handleInteriorAccessoryClick = (accessoryIndex: number) => {
    setCurrentInteriorSliderIndex(accessoryIndex);
    setIsInteriorSliderOpen(true);
  };

  const closeInteriorSideMenu = () => {
    setIsInteriorSideMenuOpen(false);
    setSelectedInteriorHotspot(null);
  };

  const getHotspotContent = () => {
    console.log(
      "getHotspotContent called with selectedHotspot:",
      selectedHotspot
    );
    if (!selectedHotspot) {
      console.log("No selectedHotspot, returning null");
      return null;
    }

    // First check interior hotspots
    const interiorHotspot = interiorHotspots.find(
      (h) => h.id === selectedHotspot
    );
    if (interiorHotspot?.content) {
      console.log("Found interior hotspot:", interiorHotspot);
      return interiorHotspot.content;
    }

    // Then check exterior hotspots
    const exteriorHotspot = carHotspots.find((h) => h.id === selectedHotspot);
    console.log("carHotspots:", carHotspots);
    console.log("Looking for hotspot with id:", selectedHotspot);
    console.log("Found exterior hotspot:", exteriorHotspot);

    if (exteriorHotspot) {
      // Check if hotspot has content defined
      const hotspotWithContent = exteriorHotspot as any;
      if (hotspotWithContent.content) {
        console.log("Found exterior hotspot with content:", exteriorHotspot);
        return hotspotWithContent.content;
      }

      // For exterior hotspots without content, create default content
      if (selectedHotspot === "headlight") {
        const content = {
          title:
            language === "fr"
              ? "Tableau de bord LCD 10,25 pouces"
              : 'Deluxe 10.25" full colour LCD cluster',
          subtitle:
            language === "fr"
              ? "Tableau de bord digital LCD 10,25 pouces avec affichage TFT-LCD couleur"
              : '10.25" colour TFT-LCD cluster',
          image: "/media/tivoli/lcd-cluster.jpg",
          texts: [
            language === "fr"
              ? "Tableau de bord digital LCD 10,25 pouces avec affichage TFT-LCD couleur"
              : '10.25" colour TFT-LCD cluster',
          ],
        };
        console.log("Returning headlight content:", content);
        return content;
      }

      // Default content for other exterior hotspots
      const defaultContent = {
        title: exteriorHotspot.title,
        subtitle: exteriorHotspot.description,
        image: `/assets/Modelspage/Tivoli/section2/buttonsfront/${selectedHotspot}.jpg`,
        texts: [exteriorHotspot.description],
      };
      console.log("Returning default content:", defaultContent);
      return defaultContent;
    }

    console.log("No hotspot found, returning null");
    return null;
  };

  const getInteriorHotspotContent = () => {
    console.log(
      "getInteriorHotspotContent called with selectedInteriorHotspot:",
      selectedInteriorHotspot
    );
    if (!selectedInteriorHotspot) {
      console.log("No selectedInteriorHotspot, returning null");
      return null;
    }

    // Check interior hotspots only
    const interiorHotspot = interiorHotspots.find(
      (h) => h.id === selectedInteriorHotspot
    );
    if (interiorHotspot?.content) {
      console.log("Found interior hotspot:", interiorHotspot);
      return interiorHotspot.content;
    }

    console.log("No interior hotspot found, returning null");
    return null;
  };

  const nextHotspotImage = () => {
    const content = getHotspotContent();
    if (content) {
      const videoCount = "video" in content && content.video ? 1 : 0;
      const imagesCount =
        "images" in content && content.images ? content.images.length : 0;
      const imageCount = "image" in content && content.image ? 1 : 0;
      const totalItems = videoCount + imagesCount + imageCount;
      setCurrentHotspotImage((prev) => (prev + 1) % totalItems);
    }
  };

  const prevHotspotImage = () => {
    const content = getHotspotContent();
    if (content) {
      const videoCount = "video" in content && content.video ? 1 : 0;
      const imagesCount =
        "images" in content && content.images ? content.images.length : 0;
      const imageCount = "image" in content && content.image ? 1 : 0;
      const totalItems = videoCount + imagesCount + imageCount;
      setCurrentHotspotImage((prev) => (prev - 1 + totalItems) % totalItems);
    }
  };

  const nextInteriorHotspotImage = () => {
    const content = getInteriorHotspotContent();
    if (content) {
      const videoCount = "video" in content && content.video ? 1 : 0;
      const imagesCount =
        "images" in content && content.images ? content.images.length : 0;
      const imageCount = "image" in content && content.image ? 1 : 0;
      const totalItems = videoCount + imagesCount + imageCount;
      setCurrentInteriorHotspotImage((prev) => (prev + 1) % totalItems);
    }
  };

  const prevInteriorHotspotImage = () => {
    const content = getInteriorHotspotContent();
    if (content) {
      const videoCount = "video" in content && content.video ? 1 : 0;
      const imagesCount =
        "images" in content && content.images ? content.images.length : 0;
      const imageCount = "image" in content && content.image ? 1 : 0;
      const totalItems = videoCount + imagesCount + imageCount;
      setCurrentInteriorHotspotImage(
        (prev) => (prev - 1 + totalItems) % totalItems
      );
    }
  };

  // ============================================================================
  // HIGH-PERFORMANCE 360° VR ROTATION SYSTEM
  // ============================================================================

  // Frame interpolation with easing for smooth transitions
  const interpolateFrame = (
    from: number,
    to: number,
    progress: number
  ): number => {
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
    setCurrentSafetyCard((prev) =>
      Math.min(prev + 1, safetyFeatures.length - 3)
    );
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
    setCurrentConvenienceCard((prev) =>
      Math.min(prev + 1, convenienceFeatures.length - 3)
    );
  };

  const prevConvenienceCard = () => {
    setCurrentConvenienceCard((prev) => Math.max(prev - 1, 0));
  };

  // Navigation functions for performance carousel
  const nextPerformanceCard = () => {
    setCurrentPerformanceCard((prev) =>
      Math.min(prev + 1, performanceFeatures.length - 3)
    );
  };

  const prevPerformanceCard = () => {
    setCurrentPerformanceCard((prev) => Math.max(prev - 1, 0));
  };

  // Specification carousel navigation
  const nextSpecImage = () => {
    setCurrentSpecImage((prev) => (prev + 1) % specImages.length);
  };
  const prevSpecImage = () => {
    setCurrentSpecImage(
      (prev) => (prev - 1 + specImages.length) % specImages.length
    );
  };

  // Accordion toggle
  const toggleAccordion = (index: number) => {
    setActiveAccordion(activeAccordion === index ? -1 : index);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <SEO
        title="KGM Tivoli | SUV Compact Premium au Maroc"
        description="Découvrez le KGM Tivoli, SUV compact premium au Maroc. Design moderne, technologie avancée, sécurité maximale. Réservez votre essai dès maintenant."
        keywords="KGM Tivoli, SUV compact Maroc, Tivoli prix, SUV premium, KGM Mobility"
        titleFr="KGM Tivoli | SUV Compact Premium au Maroc"
        descriptionFr="Découvrez le KGM Tivoli, SUV compact premium au Maroc. Design moderne, technologie avancée, sécurité maximale. Réservez votre essai dès maintenant."
        keywordsFr="KGM Tivoli, SUV compact Maroc, Tivoli prix, SUV premium, KGM Mobility"
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
            <source
              src="https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/Tivoli/hero/20250124172534178_WKhl8n.mp4"
              type="video/mp4"
            />
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

          {/* Bottom Content - TIVOLI title, subtitle, and buttons */}
          <div className="flex justify-center lg:justify-start px-4 sm:px-8 lg:px-16 pb-8 sm:pb-12 lg:pb-16">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="max-w-2xl text-center lg:text-left"
            >
              {/* Model Name - smaller size */}
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="text-4xl lg:text-5xl font-bold uppercase tracking-tight mb-4"
                style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)" }}
              >
                {language === "fr" ? "TIVOLI" : "TIVOLI"}
              </motion.h1>

              {/* Subtitle - smaller size */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="text-lg lg:text-xl text-white mb-8 font-light"
                style={{ fontSize: "clamp(1rem, 2vw, 1.5rem)" }}
              >
                {language === "fr"
                  ? "Réinvente vos trajets du quotidien"
                  : "Reinvent your daily journeys"}
              </motion.p>

              {/* Action Buttons - responsive size */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start"
              >
                <motion.a
                  href="/book-test-drive?model=tivoli"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 sm:px-6 py-2 sm:py-3 bg-kgm-amber/90 border border-kgm-amber text-white font-semibold uppercase tracking-wide hover:bg-kgm-amber transition-all duration-300 rounded-sm text-xs sm:text-sm"
                  style={{ minWidth: "100px" }}
                >
                  {language === "fr"
                    ? "Réservez Votre Essai"
                    : "Book Your Test Drive"}
                </motion.a>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Feature Boxes - Bottom Right - responsive */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="absolute bottom-4 sm:bottom-8 right-4 sm:right-8 z-20 hidden lg:block"
        >
          <div className="flex flex-col xl:flex-row gap-3 sm:gap-4">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.2 + index * 0.2 }}
                whileHover={{ scale: 1.05 }}
                className="bg-gray-900/90 backdrop-blur-sm border border-kgm-amber/40 p-3 sm:p-4 rounded-lg"
                style={{
                  minWidth: "140px",
                  maxWidth: "160px",
                }}
              >
                <div className="text-white mb-2">
                  <Image
                    src={feature.icon}
                    alt={feature.title}
                    width={20}
                    height={20}
                    className="w-5 h-5 sm:w-6 sm:h-6"
                  />
                </div>
                <h3 className="text-white font-bold text-xs sm:text-sm mb-1">
                  {feature.title}
                </h3>
                <p className="text-white/80 text-xs leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Mobile Feature Boxes - responsive */}
      <section className="lg:hidden bg-gray-900 py-6 sm:py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-gray-800/50 backdrop-blur-sm border border-kgm-amber/30 p-4 sm:p-6 rounded-lg text-center"
              >
                <div className="text-white mb-3 flex justify-center">
                  <Image
                    src={feature.icon}
                    alt={feature.title}
                    width={32}
                    height={32}
                    className="w-8 h-8"
                  />
                </div>
                <h3 className="text-white font-bold text-sm sm:text-base mb-2">
                  {feature.title}
                </h3>
                <p className="text-white/80 text-xs sm:text-sm leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Second Section - Scroll-based Video and Text Animation */}
      <section ref={section2Ref} className="relative  bg-black overflow-hidden">
        {/* Video Container - Centered and responsive to scroll */}
        <div className="absolute inset-0 z-0 flex items-center justify-center">
          <motion.div className="relative h-full" style={{ width: videoWidth }}>
            <video
              autoPlay
              muted
              loop
              playsInline
              className="w-full  object-cover"
            >
              <source
                src="https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/Tivoli/section1/20250124173106718_kZQegv.mp4"
                type="video/mp4"
              />
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
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          </motion.div>
        </motion.div>
      </section>

      {/* Second Section - Video with Scroll Animation */}
      <section
        ref={section2Ref}
        className="relative h-screen bg-black overflow-hidden z-20"
      >
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
            <source
              src="https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/Tivoli/section1/20250124173106718_kZQegv.mp4"
              type="video/mp4"
            />
          </motion.video>
        </div>

        {/* Text Overlay - Changes size based on scroll */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center z-10"
          style={{
            opacity: textOpacity,
          }}
        >
          <motion.h2
            className="text-white font-bold uppercase text-center px-8"
            style={{
              fontSize: textSize,
              lineHeight: textLineHeight,
              textShadow: "2px 2px 4px rgba(0,0,0,0.8)",
            }}
          >
            {language === "fr"
              ? "CONFIANT, JEUNE ET ASTUCIEUX"
              : "CONFIDENT, YOUTHFUL AND SAVVY"}
          </motion.h2>
        </motion.div>

        {/* Scroll to Top Button */}
        <motion.button
          className="absolute bottom-8 right-8 z-20 w-12 h-12 bg-black/50 backdrop-blur-sm rounded-full border border-white/30 flex flex-col items-center justify-center text-white hover:bg-white/10 transition-all duration-300"
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.1 }}
          viewport={{ once: false, amount: 0.5 }}
          transition={{ duration: 0.6 }}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          <svg className="w-4 h-4 mb-1" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2l8 8h-5v10h-6V10H4l8-8z" />
          </svg>
          <span className="text-xs font-medium">
            {language === "fr" ? "HAUT" : "TOP"}
          </span>
        </motion.button>
      </section>

      {/* Exterior Section */}
      <section
        className="relative min-h-[800px] bg-gradient-to-b from-black via-gray-900 to-black overflow-hidden py-16"
        style={{ position: "relative" }}
      >
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-100 to-black"></div>

        {/* Header */}
        <div className="relative z-10 pt-16 text-center">
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-white text-lg uppercase tracking-wide mb-4"
          >
            {language === "fr" ? "EXTÉRIEUR" : "EXTERIOR"}
          </motion.h3>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-kgm-amber text-3xl lg:text-4xl font-bold uppercase tracking-wide"
          >
            {language === "fr"
              ? "ESPRIT ET HÉRITAGE DE KGM"
              : "SPIRIT & HERITAGE OF KGM"}
          </motion.h2>
        </div>

        {/* View Selector */}
        <div className="relative z-10 flex justify-center mt-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex bg-white/10 backdrop-blur-sm rounded-full p-1"
          >
            <button
              onClick={() => setCarView("front")}
              className={`px-6 py-3 rounded-full flex items-center gap-2 transition-all duration-300 ${
                carView === "front"
                  ? "bg-white text-black"
                  : "text-white hover:bg-white/20"
              }`}
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
              {language === "fr" ? "Avant" : "Front"}
            </button>
            <button
              onClick={() => setCarView("rear")}
              className={`px-6 py-3 rounded-full flex items-center gap-2 transition-all duration-300 ${
                carView === "rear"
                  ? "bg-white text-black"
                  : "text-white hover:bg-white/20"
              }`}
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
              {language === "fr" ? "Arrière" : "Rear"}
            </button>
          </motion.div>
        </div>

        {/* Car Display */}
        <div className="relative z-10 flex-1 flex items-center justify-center mt-8">
          <motion.div
            key={carView}
            initial={{ opacity: 1, scale: 1 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0 }}
            className="relative w-full h-[700px] flex items-center justify-center mb-40"
          >
            <Image
              src={
                carView === "front"
                  ? "https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/Tivoli/section2/20250210191434311_hHUcwZ.png"
                  : "https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/Tivoli/section2/20250124173659358_ic6XYX.png"
              }
              alt={`TIVOLI ${carView} view`}
              fill
              className="object-contain"
              style={{
                backgroundColor: "transparent",
                mixBlendMode: "normal",
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
                className="absolute w-8 h-8 bg-kgm-amber rounded-full flex items-center justify-center text-black font-bold text-lg shadow-lg hover:bg-kgm-amber/80 transition-all duration-300"
                style={{
                  left: hotspot.position.x,
                  top: hotspot.position.y,
                  transform: "translate(-50%, -50%)",
                }}
                onClick={() => {
                  console.log("Exterior hotspot clicked:", hotspot.id);
                  console.log("Opening exterior sidebar for:", hotspot.id);
                  handleExteriorHotspotClick(hotspot.id);
                }}
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
                  {carHotspots.find((h) => h.id === activeHotspot)?.title}
                </h4>
                <p className="text-white text-sm">
                  {carHotspots.find((h) => h.id === activeHotspot)?.description}
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

        {/* Car Feature Sidebar Component */}
        <CarFeatureSidebar
          isOpen={isSideMenuOpen}
          onClose={() => setIsSideMenuOpen(false)}
          selectedHotspot={selectedHotspot}
          getHotspotContent={getHotspotContent}
          currentHotspotImage={currentHotspotImage}
          setCurrentHotspotImage={setCurrentHotspotImage}
          sectionType="exterior"
        />
      </section>

      {/* Color Configurator Section */}
      <section className="relative bg-black overflow-hidden">
        {/* Car Display Area */}
        <div className="relative z-10 flex-1 flex items-center justify-center mt-8">
          {(viewMode as "color" | "vr") === "color" ? (
            <motion.div
              key={`${selectedColor}-${toneMode}`}
              initial={{ opacity: 1, scale: 1 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0 }}
              className="relative w-full h-[500px] flex items-center justify-center bg-black"
            >
              <Image
                src={
                  toneMode === "1 TONE"
                    ? carColors[selectedColor].oneTone
                    : carColors[selectedColor].twoTone
                }
                alt={`TIVOLI in ${carColors[selectedColor].name} - ${toneMode}`}
                fill
                className="object-cover w-full h-full"
                priority
                style={{
                  backgroundColor: "black",
                  mixBlendMode: "normal",
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
                    onClick={() => setViewMode("color")}
                    className={`px-6 py-3 rounded-full flex items-center gap-2 transition-all duration-300 ${
                      (viewMode as "color" | "vr") === "color"
                        ? "bg-blue-600 text-white"
                        : "text-white hover:bg-white/20"
                    }`}
                  >
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                    </svg>
                    {language === "fr" ? "Palette Couleurs" : "Color Board"}
                  </button>
                  <button
                    onClick={() => setViewMode("vr")}
                    className={`px-6 py-3 rounded-full flex items-center gap-2 transition-all duration-300 ${
                      (viewMode as "color" | "vr") === "vr"
                        ? "bg-blue-600 text-white"
                        : "text-white hover:bg-white/20"
                    }`}
                  >
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                    </svg>
                    {language === "fr" ? "360° VR" : "360° VR"}
                  </button>
                </motion.div>
              </div>

              {/* Color Selection Panel - Inside Image (Smaller) */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20">
                <motion.div
                  initial={{ opacity: 1, y: 0 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0 }}
                  className="bg-white/20 backdrop-blur-sm rounded-2xl p-3 max-w-md mx-auto shadow-2xl"
                >
                  {/* Current Color Name */}
                  <div className="text-center mb-3">
                    <h3 className="text-sm font-bold text-white">
                      {carColors[selectedColor].name}
                    </h3>
                  </div>

                  {/* Color Swatches */}
                  <div className="flex justify-center gap-2 mb-3">
                    {carColors.map((color) => (
                      <motion.button
                        key={color.id}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSelectedColor(color.id)}
                        className={`rounded-full border-2 transition-all duration-300 ${
                          selectedColor === color.id
                            ? "border-white scale-110"
                            : "border-white/50 hover:border-white"
                        }`}
                        style={{
                          backgroundColor: color.colorSwatch,
                          width: "20px", // Smaller color swatches
                          height: "20px",
                        }}
                      >
                        {selectedColor === color.id && (
                          <div className="w-full h-full rounded-full flex items-center justify-center">
                            <svg
                              className="text-white w-3 h-3"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                            </svg>
                          </div>
                        )}
                      </motion.button>
                    ))}
                  </div>

                  {/* Tone Options */}
                  <div className="flex justify-center gap-4">
                    <label className="flex items-center gap-1 cursor-pointer">
                      <input
                        type="radio"
                        name="tone"
                        value="1 TONE"
                        checked={toneMode === "1 TONE"}
                        onChange={(e) =>
                          setToneMode(e.target.value as "1 TONE")
                        }
                        className="w-3 h-3 text-blue-600"
                      />
                      <span className="text-white font-semibold text-xs">
                        {language === "fr" ? "1 TON" : "1 TONE"}
                      </span>
                    </label>
                  </div>
                </motion.div>
              </div>

              {/* Disclaimer Text */}
              <div className="hidden md:block absolute bottom-4 left-4 lg:bottom-8 lg:left-8 text-left max-w-md px-1.5 lg:px-0 z-30">
                <p
                  className="text-white text-[8px] lg:text-xs leading-tight lg:leading-relaxed font-medium"
                  style={{
                    textShadow:
                      "2px 2px 4px rgba(0, 0, 0, 1), -1px -1px 2px rgba(0, 0, 0, 1), 1px -1px 2px rgba(0, 0, 0, 1), -1px 1px 2px rgba(0, 0, 0, 1)",
                  }}
                >
                  {language === "fr"
                    ? "* Les images de ce véhicule sont fournies à titre indicatif uniquement et peuvent différer du produit réel."
                    : "* Images of this vehicle are for reference only and may differ from the actual product."}
                </p>
                <p
                  className="text-white text-[8px] lg:text-xs leading-tight lg:leading-relaxed mt-0.5 lg:mt-1 font-medium"
                  style={{
                    textShadow:
                      "2px 2px 4px rgba(0, 0, 0, 1), -1px -1px 2px rgba(0, 0, 0, 1), 1px -1px 2px rgba(0, 0, 0, 1), -1px 1px 2px rgba(0, 0, 0, 1)",
                  }}
                >
                  {language === "fr"
                    ? "* Chaque couleur est arrangée de gauche à droite selon la préférence des clients."
                    : "* Each color is arranged from left to right in order of customer preference."}
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
              className="relative w-full h-[500px] flex items-center justify-center bg-black mb-40"
            >
              {/* 360° VR Background */}
              <Image
                src="https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/Tivoli/section3/bg%20360vr/rotate-bg.png"
                alt="360° VR Background"
                fill
                className="object-cover w-full h-full"
                priority
                style={{
                  backgroundColor: "black",
                  mixBlendMode: "normal",
                }}
              />

              {/* 360° VR Viewer */}
              {getCurrentVrImages().length > 0 ? (
                <div
                  className={`absolute inset-0 z-10 select-none ${
                    isDragging ? "cursor-grabbing" : "cursor-grab"
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
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    touchAction: "none",
                    WebkitTouchCallout: "none",
                    WebkitUserSelect: "none",
                    userSelect: "none",
                  }}
                >
                  {/* Crossfade between two frames for smooth transitions */}
                  {(() => {
                    const vrImages = getCurrentVrImages();
                    if (!vrImages || vrImages.length === 0) return null;

                    const safeCurrentFrame =
                      isNaN(currentFrame) || currentFrame < 0
                        ? 0
                        : currentFrame;
                    const currentFrameIndex =
                      Math.floor(safeCurrentFrame) % FRAME_COUNT;
                    const nextFrameIndex =
                      (currentFrameIndex + 1) % FRAME_COUNT;
                    const fractional =
                      safeCurrentFrame - Math.floor(safeCurrentFrame);
                    const currentOpacity = Math.max(
                      0,
                      Math.min(1, 1 - fractional)
                    );
                    const nextOpacity = Math.max(0, Math.min(1, fractional));

                    if (
                      !vrImages[currentFrameIndex] ||
                      !vrImages[nextFrameIndex]
                    )
                      return null;

                    return (
                      <>
                        {/* Current frame */}
                        <Image
                          key={`${toneMode}-${currentFrameIndex}-current`}
                          src={vrImages[currentFrameIndex]}
                          alt={`360° View - Frame ${
                            currentFrameIndex + 1
                          }/${FRAME_COUNT}`}
                          width={800}
                          height={600}
                          unoptimized
                          priority
                          className="object-contain"
                          style={{
                            position: "absolute",
                            backgroundColor: "transparent",
                            mixBlendMode: "normal",
                            filter: isDragging
                              ? "brightness(1.1)"
                              : "brightness(1)",
                            opacity: currentOpacity,
                            transition: "opacity 0.15s ease-out",
                            willChange: "opacity",
                            left: "50%",
                            top: "50%",
                            transform: "translate(-50%, -50%)",
                            zIndex: 1,
                            maxWidth: "100vw",
                            maxHeight: "100%",
                            width: "auto",
                            height: "auto",
                            minWidth: "200px",
                          }}
                        />
                        {/* Next frame (for crossfade) */}
                        <Image
                          key={`${toneMode}-${nextFrameIndex}-next`}
                          src={vrImages[nextFrameIndex]}
                          alt={`360° View - Frame ${
                            nextFrameIndex + 1
                          }/${FRAME_COUNT}`}
                          width={800}
                          height={600}
                          unoptimized
                          priority
                          className="object-contain"
                          style={{
                            position: "absolute",
                            backgroundColor: "transparent",
                            mixBlendMode: "normal",
                            filter: isDragging
                              ? "brightness(1.1)"
                              : "brightness(1)",
                            opacity: nextOpacity,
                            transition: "opacity 0.15s ease-out",
                            willChange: "opacity",
                            left: "50%",
                            top: "50%",
                            transform: "translate(-50%, -50%)",
                            zIndex: 2,
                            maxWidth: "100vw",
                            maxHeight: "100%",
                            width: "auto",
                            height: "auto",
                            minWidth: "200px",
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
                    <p className="text-lg opacity-80">
                      VR images not available for this color/tone combination
                    </p>
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
                    onClick={() => setViewMode("color")}
                    className={`px-6 py-3 rounded-full flex items-center gap-2 transition-all duration-300 ${
                      (viewMode as "color" | "vr") === "color"
                        ? "bg-blue-600 text-white"
                        : "text-white hover:bg-white/20"
                    }`}
                  >
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                    </svg>
                    {language === "fr" ? "Palette de Couleurs" : "Color Board"}
                  </button>
                  <button
                    onClick={() => setViewMode("vr")}
                    className={`px-6 py-3 rounded-full flex items-center gap-2 transition-all duration-300 ${
                      (viewMode as "color" | "vr") === "vr"
                        ? "bg-blue-600 text-white"
                        : "text-white hover:bg-white/20"
                    }`}
                  >
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                    </svg>
                    {language === "fr" ? "VR 360°" : "VR 360°"}
                  </button>
                </motion.div>
              </div>

              {/* Color Selection Panel - Inside VR View (Smaller) */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20">
                <motion.div
                  initial={{ opacity: 1, y: 0 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0 }}
                  className="bg-white/20 backdrop-blur-sm rounded-2xl p-3 max-w-md mx-auto shadow-2xl"
                >
                  {/* Current Color Name */}
                  <div className="text-center mb-3">
                    <h3 className="text-sm font-bold text-white">
                      {carColors[selectedColor].name}
                    </h3>
                  </div>

                  {/* Color Swatches */}
                  <div className="flex justify-center gap-2 mb-3">
                    {carColors.map((color) => (
                      <motion.button
                        key={color.id}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSelectedColor(color.id)}
                        className={`rounded-full border-2 transition-all duration-300 ${
                          selectedColor === color.id
                            ? "border-white scale-110"
                            : "border-white/50 hover:border-white"
                        }`}
                        style={{
                          backgroundColor: color.colorSwatch,
                          width: "20px", // Smaller color swatches
                          height: "20px",
                        }}
                      >
                        {selectedColor === color.id && (
                          <div className="w-full h-full rounded-full flex items-center justify-center">
                            <svg
                              className="text-white w-3 h-3"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                            </svg>
                          </div>
                        )}
                      </motion.button>
                    ))}
                  </div>

                  {/* Tone Options */}
                  <div className="flex justify-center gap-4">
                    <label className="flex items-center gap-1 cursor-pointer">
                      <input
                        type="radio"
                        name="tone"
                        value="1 TONE"
                        checked={toneMode === "1 TONE"}
                        onChange={(e) =>
                          setToneMode(e.target.value as "1 TONE")
                        }
                        className="w-3 h-3 text-blue-600"
                      />
                      <span className="text-white font-semibold text-xs">
                        1 TONE
                      </span>
                    </label>
                  </div>
                </motion.div>
              </div>

              {/* Disclaimer Text */}
              <div className="hidden md:block absolute bottom-4 left-4 lg:bottom-8 lg:left-8 text-left max-w-md px-1.5 lg:px-0 z-30">
                <p
                  className="text-white text-[8px] lg:text-xs leading-tight lg:leading-relaxed font-medium"
                  style={{
                    textShadow:
                      "2px 2px 4px rgba(0, 0, 0, 1), -1px -1px 2px rgba(0, 0, 0, 1), 1px -1px 2px rgba(0, 0, 0, 1), -1px 1px 2px rgba(0, 0, 0, 1)",
                  }}
                >
                  {language === "fr"
                    ? "* Les images de ce véhicule sont fournies à titre indicatif uniquement et peuvent différer du produit réel."
                    : "* Images of this vehicle are for reference only and may differ from the actual product."}
                </p>
                <p
                  className="text-white text-[8px] lg:text-xs leading-tight lg:leading-relaxed mt-0.5 lg:mt-1 font-medium"
                  style={{
                    textShadow:
                      "2px 2px 4px rgba(0, 0, 0, 1), -1px -1px 2px rgba(0, 0, 0, 1), 1px -1px 2px rgba(0, 0, 0, 1), -1px 1px 2px rgba(0, 0, 0, 1)",
                  }}
                >
                  {language === "fr"
                    ? "* Chaque couleur est arrangée de gauche à droite selon la préférence des clients."
                    : "* Each color is arranged from left to right in order of customer preference."}
                </p>
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* Section 4: Driver-Centric Cockpit */}
      <section
        ref={section4Ref}
        className="relative h-screen bg-black overflow-hidden"
      >
        <motion.div
          className="w-full h-full flex items-center justify-center"
          style={{
            zIndex: 1,
          }}
        >
          {/* Background Video */}
          <motion.div
            className="relative h-full flex items-center justify-center"
            style={{
              width: section4VideoWidth,
              height: "100%",
            }}
          >
            <video
              className="w-full h-full object-cover"
              autoPlay
              muted
              loop
              playsInline
            >
              <source
                src="https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/Tivoli/section4/20250210200932670_6KEZrm.mp4"
                type="video/mp4"
              />
            </video>

            {/* Text Overlay - Changes size based on scroll */}
            <motion.div
              className="absolute inset-0 flex items-center justify-center z-10"
              style={{
                opacity: section4TextOpacity,
              }}
            >
              <motion.h2
                className="text-white font-bold uppercase text-center px-8"
                style={{
                  fontSize: section4TextSize,
                  textShadow: "2px 2px 4px rgba(0,0,0,0.8)",
                }}
              >
                {language === "fr"
                  ? "POSTE DE PILOTAGE CENTRÉ CONDUCTEUR"
                  : "DRIVER-CENTRIC COCKPIT"}
              </motion.h2>
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* Section 5: Interior Features & Colors */}
      <section className="relative bg-black overflow-hidden">
        {/* Header */}
        <div
          className="absolute top-0 left-0 right-0 md:top-8 md:left-1/2 md:transform md:-translate-x-1/2 z-20 text-center px-0 md:px-4"
          style={{ bottom: isMobile ? "calc(21vh + 5px)" : undefined }}
        >
          <h2 className="text-kgm-amber text-sm font-light mb-2">
            {language === "fr" ? (
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

        {/* First Interior Image (BLACK) */}
        <div className="relative w-full h-[35vh] md:h-screen flex items-center justify-center overflow-hidden px-0 md:px-4">
          <div
            className="absolute left-0 right-0 bottom-0 top-auto md:inset-x-0 md:top-0 md:h-full h-[60%]"
            style={{ bottom: isMobile ? "5px" : undefined }}
          >
            <Image
              src="https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/Tivoli/section5/20250207173930904_ci58t7.jpg"
              alt="Interior Features 4"
              fill
              className="object-contain md:object-cover"
              priority
              quality={90}
            />
          </div>

          {/* Interactive Hotspots */}
          {interiorHotspots.map((hotspot) => {
            // Calculate adjusted position for mobile (image container is 60% height, positioned at bottom with 5px margin)
            // Convert from top-based to bottom-based positioning
            const yPercent = parseFloat(hotspot.position.y);
            // Image is 60% height at bottom, so: bottom position = 60% - (yPercent * 0.6)
            const adjustedYFromBottom = 60 - yPercent * 0.6 + 4; // Calculate from bottom, add small offset

            // Calculate adjusted X position for mobile (move slightly to the left)
            const xPercent = parseFloat(hotspot.position.x);
            const adjustedX = isMobile ? xPercent - 3 : xPercent; // Move 3% to the left on mobile

            return (
              <motion.button
                key={hotspot.id}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.2 }}
                transition={{ duration: 0.3 }}
                onClick={() => {
                  console.log("Interior hotspot clicked:", hotspot.id);
                  console.log("Opening interior sidebar for:", hotspot.id);
                  handleInteriorHotspotClick(hotspot.id);
                }}
                className="absolute cursor-pointer group z-30 w-6 h-6 md:w-10 md:h-10"
                style={{
                  left: isMobile ? `${adjustedX}%` : hotspot.position.x,
                  bottom: isMobile
                    ? `calc(${adjustedYFromBottom}% - 26px)`
                    : undefined,
                  top: isMobile ? undefined : hotspot.position.y,
                  transform: "translate(-50%, 50%)",
                }}
              >
                <div className="w-full h-full bg-kgm-amber rounded-full flex items-center justify-center shadow-2xl group-hover:bg-kgm-amber/80 transition-all duration-300">
                  <svg
                    className="w-3 h-3 md:w-5 md:h-5 text-black"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z" />
                  </svg>
                </div>
                {/* Pulse animation */}
                <div className="absolute inset-0 w-full h-full bg-kgm-amber rounded-full animate-ping opacity-20"></div>
              </motion.button>
            );
          })}

          {/* Color Label */}
          <div className="hidden md:block absolute bottom-8 left-8 z-20">
            <h3 className="text-white text-2xl font-bold mb-2">
              {language === "fr" ? "NOIR" : "BLACK"}
            </h3>
            <p className="text-white/70 text-sm max-w-xs">
              *{" "}
              {language === "fr"
                ? "Les photos et descriptions sont fournies à titre indicatif uniquement et peuvent différer du produit réel."
                : "The photos and descriptions are for reference only and may differ from the actual product."}
            </p>
          </div>
        </div>

        {/* Second Interior Image */}
        <div className="relative w-full h-screen flex items-center justify-center">
          <Image
            src="https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/Tivoli/section5/20250124180440965_wslkay.jpg"
            alt="Interior Features 1"
            fill
            className="object-cover"
            quality={90}
          />
        </div>

        {/* Interior Feature Sidebar Component */}
        <CarFeatureSidebar
          isOpen={isInteriorSideMenuOpen}
          onClose={closeInteriorSideMenu}
          selectedHotspot={selectedInteriorHotspot}
          getHotspotContent={getInteriorHotspotContent}
          currentHotspotImage={currentInteriorHotspotImage}
          setCurrentHotspotImage={setCurrentInteriorHotspotImage}
          sectionType="interior"
        />
      </section>

      {/* Section 6: Safety Features - Horizontal Card Slider */}
      <section className="relative pt-20 bg-black overflow-hidden">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-white text-sm font-light mb-2">
            {language === "fr" ? "SÉCURITÉ" : "SAFETY"}
          </h2>
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
            {language === "fr" ? "CARACTÉRISTIQUES" : "FEATURES"}
          </h1>
        </div>

        {/* Horizontal Card Slider Container */}
        <div className="relative max-w-7xl mx-auto px-4">
          {/* Cards Container */}
          <div className="relative overflow-hidden">
            <div
              className="flex transition-transform duration-700 ease-out"
              style={{
                transform: `translateX(-${currentSafetyCard * (100 / 3)}%)`,
              }}
            >
              {safetyFeatures.map((feature, index) => (
                <div
                  key={feature.id}
                  className="flex-shrink-0 px-4"
                  style={{ width: "33.333%" }}
                >
                  <div className="h-[514px] rounded-lg overflow-hidden relative">
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

                    {/* Content Overlay - Hidden when video is playing */}
                    {!(playingVideo === feature.video && videoPlaying) && (
                      <div className="absolute inset-0 p-8 flex flex-col justify-between z-10">
                        {/* Title section at top - always at top */}
                        <div className="flex flex-col backdrop-blur-sm bg-black/10 rounded-lg p-3 md:p-4">
                          <h3
                            className={`${feature.textColor} text-sm font-light mb-2 drop-shadow-lg`}
                          >
                            {feature.title}
                          </h3>
                          <h2
                            className={`${feature.subtitleColor} text-2xl font-bold mb-4 drop-shadow-lg`}
                          >
                            {feature.subtitle}
                          </h2>
                          {feature.hasOpenButton && (
                            <button className="bg-kgm-amber text-black w-10 h-10 rounded-full font-semibold hover:bg-kgm-amber/80 transition-colors duration-300 flex items-center justify-center">
                              <span className="text-lg">+</span>
                            </button>
                          )}
                        </div>

                        {/* Description - always at bottom */}
                        <div className="flex flex-col items-end backdrop-blur-sm bg-black/10 rounded-lg p-3 md:p-4">
                          <p
                            className={`text-sm leading-relaxed mb-4 drop-shadow-lg text-right ${
                              feature.description.includes(
                                "ESC helps prevent loss of control"
                              ) ||
                              feature.description.includes(
                                "ESC provides various features"
                              )
                                ? "text-white"
                                : feature.description.includes(
                                    "There are 8 airbags"
                                  ) ||
                                  feature.description.includes(
                                    "By applying the HPF"
                                  )
                                ? "text-white"
                                : feature.textColor
                            }`}
                          >
                            {feature.description}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Video Play/Stop Button */}
                    {feature.video && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <button
                          onClick={() => toggleVideo(feature.video!)}
                          className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-all duration-300 cursor-pointer z-20"
                        >
                          {playingVideo === feature.video && videoPlaying ? (
                            <svg
                              className="w-8 h-8 text-white"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                            </svg>
                          ) : (
                            <svg
                              className="w-8 h-8 text-white"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path d="M8 5v14l11-7z" />
                            </svg>
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={prevSafetyCard}
            disabled={currentSafetyCard === 0}
            className={`absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 z-10 shadow-lg ${
              currentSafetyCard === 0
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-white text-black hover:bg-gray-100"
            }`}
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
            </svg>
          </button>

          <button
            onClick={nextSafetyCard}
            disabled={currentSafetyCard >= safetyFeatures.length - 3}
            className={`absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 z-10 shadow-lg ${
              currentSafetyCard >= safetyFeatures.length - 3
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-white text-black hover:bg-gray-100"
            }`}
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8.59 16.59L10 18l6-6-6-6-1.41 1.41L13.17 12z" />
            </svg>
          </button>

          {/* Pagination Dots */}
          <div className="flex justify-center mt-8 space-x-2">
            {safetyFeatures.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSafetyCard(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentSafetyCard ? "bg-white w-8" : "bg-white/50"
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Section 7: Convenience Features - Horizontal Card Slider */}
      <section className="relative pt-20 bg-black overflow-hidden">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-white text-sm font-light mb-2">
            {language === "fr" ? "CONFORT" : "CONVENIENCE"}
          </h2>
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
            {language === "fr"
              ? "DES DÉPLACEMENTS PLUS INTELLIGENTS, FACILES ET CONFORTABLES"
              : "FOR SMARTER, EASIER AND MORE COMFORTABLE TRAVEL"}
          </h1>
        </div>

        {/* Horizontal Card Slider Container */}
        <div className="relative max-w-7xl mx-auto px-4">
          {/* Cards Container */}
          <div className="relative overflow-hidden">
            <div
              className="flex transition-transform duration-700 ease-out"
              style={{
                transform: `translateX(-${
                  currentConvenienceCard * (100 / 3)
                }%)`,
              }}
            >
              {convenienceFeatures.map((feature, index) => (
                <div
                  key={feature.id}
                  className="flex-shrink-0 px-4"
                  style={{ width: "33.333%" }}
                >
                  <div className="h-[514px] rounded-lg overflow-hidden relative">
                    {/* Background Image */}
                    <Image
                      src={feature.image}
                      alt={feature.subtitle}
                      fill
                      className="object-cover"
                      quality={90}
                    />

                    {/* Content Overlay */}
                    <div className="absolute inset-0 p-8 flex flex-col justify-between z-10">
                      {/* Top Content */}
                      <div className="flex-1 backdrop-blur-sm bg-black/10 rounded-lg p-3 md:p-4">
                        <h3 className="text-white text-sm font-light mb-2 drop-shadow-lg">
                          {feature.title}
                        </h3>
                        <h2 className="text-white text-2xl font-bold mb-4 drop-shadow-lg">
                          {feature.subtitle}
                        </h2>
                      </div>

                      {/* Bottom Content */}
                      <div className="flex flex-col items-end backdrop-blur-sm bg-black/10 rounded-lg p-3 md:p-4">
                        <p
                          className={`text-sm leading-relaxed mb-4 drop-shadow-lg text-right ${
                            feature.description.includes(
                              "Featuring an 8-way powered seat"
                            )
                              ? "text-white"
                              : "text-white"
                          }`}
                        >
                          {feature.description}
                        </p>
                        {feature.hasOpenButton && (
                          <button className="bg-kgm-amber text-black w-10 h-10 rounded-full font-semibold hover:bg-kgm-amber/80 transition-colors duration-300 flex items-center justify-center">
                            <span className="text-lg">+</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={prevConvenienceCard}
            disabled={currentConvenienceCard === 0}
            className={`absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 z-10 shadow-lg ${
              currentConvenienceCard === 0
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-white text-black hover:bg-gray-100"
            }`}
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
            </svg>
          </button>

          <button
            onClick={nextConvenienceCard}
            disabled={currentConvenienceCard >= convenienceFeatures.length - 3}
            className={`absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 z-10 shadow-lg ${
              currentConvenienceCard >= convenienceFeatures.length - 3
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-white text-black hover:bg-gray-100"
            }`}
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8.59 16.59L10 18l6-6-6-6-1.41 1.41L13.17 12z" />
            </svg>
          </button>

          {/* Pagination Dots */}
          <div className="flex justify-center mt-8 space-x-2">
            {convenienceFeatures.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentConvenienceCard(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentConvenienceCard
                    ? "bg-white w-8"
                    : "bg-white/50"
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Section 8: Performance Features - Horizontal Card Slider */}
      <section className="relative pt-20 bg-black overflow-hidden">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-white text-sm font-light mb-2">
            {language === "fr" ? "PERFORMANCE" : "PERFORMANCE"}
          </h2>
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
            {language === "fr"
              ? "DÉPLACEMENT PUISSANT ET DYNAMIQUE"
              : "POWERFUL, DYNAMIC MOVE"}
          </h1>
        </div>

        {/* Horizontal Card Slider Container */}
        <div className="relative max-w-7xl mx-auto px-4">
          {/* Cards Container */}
          <div className="relative overflow-hidden">
            <div
              className="flex transition-transform duration-700 ease-out"
              style={{
                transform: `translateX(-${
                  currentPerformanceCard * (100 / 3)
                }%)`,
              }}
            >
              {performanceFeatures.map((feature, index) => (
                <div
                  key={feature.id}
                  className="flex-shrink-0 px-4"
                  style={{ width: "33.333%" }}
                >
                  <div className="h-[514px] rounded-lg overflow-hidden relative">
                    {/* Background Image or Video */}
                    {(feature as any).video &&
                    playingVideo === (feature as any).video &&
                    videoPlaying ? (
                      <video
                        src={(feature as any).video}
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

                    {/* Content Overlay - Hidden when video is playing */}
                    {!(
                      (feature as any).video &&
                      playingVideo === (feature as any).video &&
                      videoPlaying
                    ) && (
                      <div className="absolute inset-0 p-8 flex flex-col justify-between z-10">
                        {/* Top Content */}
                        <div className="flex-1 backdrop-blur-sm bg-black/10 rounded-lg p-3 md:p-4">
                          <h3 className="text-white text-sm font-light mb-2 drop-shadow-lg">
                            {feature.title}
                          </h3>
                          <h2 className="text-white text-2xl font-bold mb-4 drop-shadow-lg">
                            {feature.subtitle}
                          </h2>
                        </div>

                        {/* Bottom Content */}
                        <div className="flex flex-col items-end backdrop-blur-sm bg-black/10 rounded-lg p-3 md:p-4">
                          <p
                            className={`text-sm leading-relaxed mb-4 drop-shadow-lg text-right ${
                              feature.description.includes(
                                "ESC helps prevent loss of control"
                              ) ||
                              feature.description.includes(
                                "ESC provides various features"
                              )
                                ? "text-white"
                                : feature.description.includes(
                                    "There are 8 airbags"
                                  ) ||
                                  feature.description.includes(
                                    "By applying the HPF"
                                  )
                                ? "text-white"
                                : "text-white"
                            }`}
                          >
                            {feature.description}
                          </p>
                          {feature.hasOpenButton && (
                            <button className="bg-kgm-amber text-black w-10 h-10 rounded-full font-semibold hover:bg-kgm-amber/80 transition-colors duration-300 flex items-center justify-center">
                              <span className="text-lg">+</span>
                            </button>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Video Play/Stop Button */}
                    {(feature as any).video && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <button
                          onClick={() => toggleVideo((feature as any).video!)}
                          className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-all duration-300 cursor-pointer z-20"
                        >
                          {(feature as any).video &&
                          playingVideo === (feature as any).video &&
                          videoPlaying ? (
                            <svg
                              className="w-8 h-8 text-white"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                            </svg>
                          ) : (
                            <svg
                              className="w-8 h-8 text-white"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path d="M8 5v14l11-7z" />
                            </svg>
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={prevPerformanceCard}
            disabled={currentPerformanceCard === 0}
            className={`absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 z-10 shadow-lg ${
              currentPerformanceCard === 0
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-white text-black hover:bg-gray-100"
            }`}
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
            </svg>
          </button>

          <button
            onClick={nextPerformanceCard}
            disabled={currentPerformanceCard >= performanceFeatures.length - 3}
            className={`absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 z-10 shadow-lg ${
              currentPerformanceCard >= performanceFeatures.length - 3
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-white text-black hover:bg-gray-100"
            }`}
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8.59 16.59L10 18l6-6-6-6-1.41 1.41L13.17 12z" />
            </svg>
          </button>

          {/* Pagination Dots */}
          <div className="flex justify-center mt-8 space-x-2">
            {performanceFeatures.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentPerformanceCard(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentPerformanceCard
                    ? "bg-white w-8"
                    : "bg-white/50"
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Section 9: Download Brochure */}
      <section className="relative pt-20 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex flex-col items-center justify-center">
            {/* Download Button */}
            <a
              href="/brochures/tivoli.pdf"
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
              <span className="whitespace-nowrap">
                {language === "fr"
                  ? "Téléchargez votre brochure"
                  : "Download your brochure"}
              </span>
            </a>
          </div>
        </div>
      </section>

      {/* Scroll to Top Button */}
      <motion.button
        className="absolute bottom-8 right-8 z-30 w-12 h-12 bg-purple-600 backdrop-blur-sm rounded-full border border-white/30 flex flex-col items-center justify-center text-white hover:bg-purple-700 transition-all duration-300"
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.1 }}
        viewport={{ once: false, amount: 0.5 }}
        transition={{ duration: 0.6 }}
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      >
        <svg className="w-4 h-4 mb-1" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2l8 8h-5v10h-6V10H4l8-8z" />
        </svg>
        <span className="text-xs font-medium">
          {language === "fr" ? "HAUT" : "TOP"}
        </span>
      </motion.button>

      <Footer />
    </div>
  );
};

export default TivoliPage;
