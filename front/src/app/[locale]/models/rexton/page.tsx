"use client";

import {
  useState,
  useEffect,
  useRef,
  useCallback,
  useLayoutEffect,
} from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useLanguage } from "@/contexts/LanguageContext";
import CarFeatureSidebar from "@/components/CarFeatureSidebar";
import { useCarFeatureSidebar } from "@/hooks/useCarFeatureSidebar";
import SousSlider from "@/components/SousSlider";
import React from "react";
import SEO from "@/components/SEO";

// generateStaticParams() is now in the parent layout.tsx

const RextonPage = () => {
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
    closeSidebar,
  } = useCarFeatureSidebar();

  // Interior sidebar state
  const [isInteriorSideMenuOpen, setIsInteriorSideMenuOpen] = useState(false);
  const [selectedInteriorHotspot, setSelectedInteriorHotspot] = useState<
    string | null
  >(null);
  const [currentInteriorHotspotImage, setCurrentInteriorHotspotImage] =
    useState(0);
  const [viewMode, setViewMode] = useState<"color" | "vr">("color");
  const [selectedColor, setSelectedColor] = useState(0);
  const [toneMode, setToneMode] = useState<"1 TONE" | "2 TONE">("1 TONE");
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
  const [isESCCarouselOpen, setIsESCCarouselOpen] = useState(false);
  const [isAdditionalSafetyCarouselOpen, setIsAdditionalSafetyCarouselOpen] =
    useState(false);
  const [currentSpecImage, setCurrentSpecImage] = useState(0);
  const [activeAccordion, setActiveAccordion] = useState(3); // TYRE INFORMATION is open by default
  const [activeAccessoryTab, setActiveAccessoryTab] = useState<
    "exterior" | "interior"
  >("exterior");
  const [showSpecialLineupFeatures, setShowSpecialLineupFeatures] =
    useState(false);
  const [activeSpecificationAccordion, setActiveSpecificationAccordion] =
    useState<number | null>(3); // TYRE INFORMATION is open by default
  const [isMobile, setIsMobile] = useState(false);
  const section2Ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: section2Ref,
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

  const features = [
    {
      icon: "https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/REXTON/hero/selling_point_1_luxury.svg",
      title: language === "fr" ? "Conduisez dans le Luxe" : "Drive in Luxury",
      description: language === "fr" ? "Voyagez avec Style" : "Travel in Style",
    },
    {
      icon: "https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/REXTON/hero/selling_point_2_space.svg",
      title: language === "fr" ? "Beaucoup d'Espace" : "Loads of Space",
      description: language === "fr" ? "Siège Confortable" : "Comforting Seat",
    },
    {
      icon: "https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/REXTON/hero/selling_point_3_safety.svg",
      title: language === "fr" ? "Avec 9 Airbags" : "With 9 Airbags",
      description:
        language === "fr" ? "Sécurité Garantie" : "Guaranteed Safety",
    },
  ];

  // Safety features data
  const safetyFeatures = [
    {
      id: 0,
      title:
        language === "fr" ? "Rigidité structurelle" : "Structural rigidity",
      subtitle:
        language === "fr"
          ? "Châssis à quatre couches"
          : "Quadruple-layered frame",
      description:
        language === "fr"
          ? "Contrairement à un véhicule de type monocoque, le moteur et la suspension sont montés sur un châssis en acier ; cela garantit la sécurité lors des impacts tout en optimisant le contrôle du bruit des sources externes."
          : "Unlike a monocoque body type vehicle, the engine and suspension are mounted on a steel frame; this ensures safety upon impacts while also optimizing noise control from external sources.",
      image:
        "https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/REXTON/safety/structural-rigidity.jpg",
      video:
        "https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/REXTON/safety/structural-rigidity.mp4",
      bgColor: "bg-gray-800",
      textColor: "text-white",
      subtitleColor: "text-white",
      hasOpenButton: false,
    },
    {
      id: 1,
      title:
        language === "fr" ? "Conçu pour la sécurité" : "Designed for safety",
      subtitle:
        language === "fr"
          ? "81.7% d'acier haute résistance"
          : "81.7% High-strength steel",
      description:
        language === "fr"
          ? "Avec une conception structurelle renforcée, Rexton offre une rigidité de conduite améliorée, une résistance globale du corps renforcée et une sécurité accrue, en particulier autour de la zone de l'habitacle."
          : "With a reinforced structural design, Rexton offers enhanced driving rigidity, improved overall body strength, and heightened safety, especially around the cabin area.",
      image:
        "https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/REXTON/safety/high-strength-steel.jpg",
      video: "",
      bgColor: "bg-gray-200",
      textColor: "text-white",
      subtitleColor: "text-white",
      hasOpenButton: false,
    },
    {
      id: 2,
      title:
        language === "fr"
          ? "Garder tout le monde en sécurité"
          : "Keeping everyone safe",
      subtitle: language === "fr" ? "9 airbags" : "9 airbags",
      description:
        language === "fr"
          ? "Un total de 9 airbags : siège conducteur et passager avant (2 EA), protection genou conducteur (1 EA), côté conducteur et passager avant et côté siège arrière (4 EA), et rideau (2 EA)."
          : "A total of 9 airbags: driver and front passenger's seat (2 EA), driver knee protection (1 EA), driver and front passenger's side and rear seat side (4 EA), and curtain (2 EA).",
      image:
        "https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/REXTON/safety/9-airbags.jpg",
      video: "",
      bgColor: "bg-gray-200",
      textColor: "text-white",
      subtitleColor: "text-white",
      hasOpenButton: false,
    },
    {
      id: 3,
      title: language === "fr" ? "Système ADAS" : "ADAS System",
      subtitle:
        language === "fr"
          ? "Contrôle de Croisière Adaptatif Intelligent (ACC & SSA)"
          : "Intelligent Adaptive Cruise Control (ACC & SSA)",
      description:
        language === "fr"
          ? "L'ACC & SSA aide à maintenir une distance de sécurité avec le véhicule devant en fonction de la vitesse définie (lors de l'accélération, de la décélération, de l'arrêt et du démarrage) et assiste la conduite à une vitesse sûre."
          : "ACC & SSA helps maintain a safe distance from the vehicle ahead based on the set speed (when accelerating, decelerating, stopping, and starting) and assists driving at a safe speed.",
      image:
        "https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/REXTON/safety/acc-ssa.jpg",
      video:
        "https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/REXTON/safety/acc-ssa.mp4",
      bgColor: "bg-gray-800",
      textColor: "text-white",
      subtitleColor: "text-white",
      hasOpenButton: false,
    },
    {
      id: 4,
      title: language === "fr" ? "Système ADAS" : "ADAS System",
      subtitle:
        language === "fr"
          ? "Freinage d'Urgence Autonome (AEB)"
          : "Autonomous Emergency Braking (AEB)",
      description:
        language === "fr"
          ? "L'AEB avertit le conducteur d'une collision frontale potentielle pendant la conduite et active automatiquement les freins pour éviter un accident."
          : "AEB warns the driver of a potential frontal collision while driving and automatically activates the brakes to prevent an accident.",
      image:
        "https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/REXTON/safety/aeb.jpg",
      video:
        "https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/REXTON/safety/aeb.mp4",
      bgColor: "bg-gray-800",
      textColor: "text-white",
      subtitleColor: "text-white",
      hasOpenButton: true,
    },
    {
      id: 5,
      title:
        language === "fr"
          ? "Direction plus sûre lors du remorquage"
          : "Safer steering when towing",
      subtitle:
        language === "fr"
          ? "Assistance à la Stabilité de Remorque (TSA)"
          : "Trailer Stability Assist (TSA)",
      description:
        language === "fr"
          ? "Lors du remorquage d'une remorque ou d'une caravane, le TSA stabilise le contrôle de direction en réponse au balancement latéral causé par des conditions routières difficiles."
          : "When towing a trailer or caravan, TSA stabilizes steering control in response to side-to-side swaying caused by harsh road conditions.",
      image:
        "https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/REXTON/safety/tsa.jpg",
      video:
        "https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/REXTON/safety/tsa.mp4",
      bgColor: "bg-gray-800",
      textColor: "text-white",
      subtitleColor: "text-white",
      hasOpenButton: false,
    },
    {
      id: 6,
      title:
        language === "fr"
          ? "Sécurité garantie dans toutes les conditions de conduite"
          : "Secured safety in all driving conditions",
      subtitle:
        language === "fr"
          ? "Contrôle de Stabilité Électronique (ESC)"
          : "Electronic Stability Control (ESC)",
      description:
        language === "fr"
          ? "L'ESC fournit diverses fonctionnalités pour prévenir les accidents à l'avance en assurant un contrôle stable de la posture du véhicule dans une variété de conditions de conduite."
          : "ESC provides various features to prevent accidents in advance by ensuring stable vehicle posture control in a variety of driving conditions.",
      image:
        "https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/REXTON/safety/esc.jpg",
      video: "",
      bgColor: "bg-gray-200",
      textColor: "text-black",
      subtitleColor: "text-black",
      hasOpenButton: true,
    },
    {
      id: 7,
      title:
        language === "fr"
          ? "Fonctionnalités de sécurité supplémentaires"
          : "Additional safety features",
      subtitle:
        language === "fr"
          ? "Systèmes de Sécurité Améliorés"
          : "Enhanced Safety Systems",
      description:
        language === "fr"
          ? "Fonctionnalités de sécurité complètes incluant des systèmes d'assistance au conducteur avancés et des technologies de protection pour une tranquillité d'esprit maximale."
          : "Comprehensive safety features including advanced driver assistance systems and protective technologies for maximum peace of mind.",
      image:
        "https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/REXTON/safety/additional-features.jpg",
      video: "",
      bgColor: "bg-gray-800",
      textColor: "text-white",
      subtitleColor: "text-white",
      hasOpenButton: true,
    },
  ];

  // ESC Carousel Data for Rexton
  const escCarouselData = React.useMemo(
    () => [
      {
        id: 0,
        title:
          language === "fr"
            ? "Contrôle de Descente de Colline (HDC)"
            : "Hill Descent Control (HDC)",
        description:
          language === "fr"
            ? "Lors de la descente d'une pente à basse vitesse, le HDC applique automatiquement les freins pour maintenir une vitesse constante sans le contrôle du conducteur."
            : "When descending a slope at a low speed, HDC automatically applies the brakes to maintain a constant speed without the driver's control.",
        video:
          "https://en.kg-mobility.com/attached/contents/display/video/2000003000100050004/20250124175726577_E6f66j.mp4",
        poster:
          "https://en.kg-mobility.com/attached/contents/display/video/2000003000100050004/20250124175726471_ISnF8c.jpg",
      },
      {
        id: 1,
        title:
          language === "fr"
            ? "Système d'Assistance au Freinage (BAS)"
            : "Brake Assist System (BAS)",
        description:
          language === "fr"
            ? "Le BAS applique une force maximale sur les freins lorsque le conducteur panique et qu'un freinage soudain est détecté, réduisant considérablement la distance de freinage dans les situations d'urgence."
            : "BAS applies maximum force onto the brakes when the driver panics and sudden braking is detected, significantly reducing braking distance in emergencies.",
        video:
          "https://en.kg-mobility.com/attached/contents/display/video/2000003000100050004/20250124175746339_vBJzHj.mp4",
        poster:
          "https://en.kg-mobility.com/attached/contents/display/video/2000003000100050004/20250124175746237_t0wGE1.jpg",
      },
      {
        id: 2,
        title:
          language === "fr"
            ? "Protection Active contre le Renversement (ARP)"
            : "Active Roll-over Protection (ARP)",
        description:
          language === "fr"
            ? "L'ARP aide à maintenir une posture stable du véhicule en priorisant le contrôle du système lorsque les conditions de conduite deviennent très instables."
            : "ARP assists in maintaining a stable vehicle posture by prioritizing system control when driving conditions become highly unstable.",
        video:
          "https://en.kg-mobility.com/attached/contents/display/video/2000003000100050004/20250124175805836_pgWG4N.mp4",
        poster:
          "https://en.kg-mobility.com/attached/contents/display/video/2000003000100050004/20250124175805697_R2FBuX.jpg",
      },
      {
        id: 3,
        title:
          language === "fr"
            ? "Assistance au Démarrage en Côte (HSA)"
            : "Hill Start Assist (HSA)",
        description:
          language === "fr"
            ? "Le HSA aide à prévenir le recul lorsque le conducteur relâche la pédale de frein sur une pente et que le véhicule commence à se déplacer le long d'une inclinaison en maintenant un certain niveau de pression de frein pendant 2~3 secondes."
            : "HSA helps prevent roll-back when the driver releases the brake pedal on a slope and the vehicle begins to travel along an incline by maintaining a certain level of brake pressure for 2~3 seconds.",
        video:
          "https://en.kg-mobility.com/attached/contents/display/video/2000003000100050004/20250124175825765_T7wjZt.mp4",
        poster:
          "https://en.kg-mobility.com/attached/contents/display/video/2000003000100050004/20250124175825646_QwCFlK.jpg",
      },
      {
        id: 4,
        title:
          language === "fr"
            ? "Signal d'Arrêt d'Urgence (ESS)"
            : "Emergency Stop Signal (ESS)",
        description:
          language === "fr"
            ? "L'ESS fait clignoter les feux de freinage ou les feux de détresse pour avertir les conducteurs qui suivent lorsqu'un freinage soudain se produit ou lorsque l'ABS est activé."
            : "ESS flashes the brake lights or hazard lights to warn trailing drivers when suddenly braking or when ABS is activated.",
        video:
          "https://en.kg-mobility.com/attached/contents/display/video/2000003000100050004/20250124175846296_RExl4K.mp4",
        poster:
          "https://en.kg-mobility.com/attached/contents/display/video/2000003000100050004/20250124175846174_7eLYWQ.jpg",
      },
    ],
    [language]
  );

  // Convenience features data
  const convenienceFeatures = [
    {
      id: 0,
      title:
        language === "fr"
          ? "Surveillance des angles morts"
          : "Blind spot monitoring",
      subtitle:
        language === "fr"
          ? "Système de surveillance 3D 360°"
          : "3D 360° around view monitoring system",
      description:
        language === "fr"
          ? "Quatre caméras à l'extérieur surveillent le stationnement et la conduite, fournissant utilement une vue claire des zones arrière et du sol."
          : "Four cameras on the exterior monitor parking and driving, helpfully providing a clear view of the rear and ground areas.",
      image:
        "https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/REXTON/CONVENIENCE/blind-spot-monitoring.jpg",
      video: "",
      bgColor: "bg-gray-800",
      textColor: "text-white",
      subtitleColor: "text-white",
      hasOpenButton: false,
    },
    {
      id: 1,
      title: language === "fr" ? "Confort de conduite" : "Comfort driving",
      subtitle:
        language === "fr"
          ? "Siège conducteur réglable électriquement à 8 directions"
          : "8-way power-adjustable driver seat",
      description:
        language === "fr"
          ? "Siège conducteur réglable électriquement à 8 directions et support lombaire à 2 directions, siège réglable électriquement à 6 directions pour offrir une expérience de conduite confortable."
          : "8-way power-adjustable driver seat and 2-way lumber support, 6-way power-adjustable seat provides a comfortable driving experience.",
      image:
        "https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/REXTON/CONVENIENCE/comfort-driving.jpg",
      video: "",
      bgColor: "bg-gray-200",
      textColor: "text-black",
      subtitleColor: "text-black",
      hasOpenButton: false,
    },
    {
      id: 2,
      title:
        language === "fr"
          ? "Espace bagages de classe supérieure"
          : "Best-in-class luggage space",
      subtitle:
        language === "fr"
          ? "Configurations d'assise"
          : "Seating configurations",
      description:
        language === "fr"
          ? "Quatre sacs de golf peuvent être chargés commodément horizontalement sans avoir besoin de plier les sièges de la deuxième rangée."
          : "Four golf caddy bags can be conveniently loaded horizontally without needing to fold the second-row seats.",
      image:
        "https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/REXTON/CONVENIENCE/luggage-space.jpg",
      video: "",
      bgColor: "bg-gray-200",
      textColor: "text-black",
      subtitleColor: "text-black",
      hasOpenButton: true,
      expandedImages: [
        {
          title:
            language === "fr"
              ? "2ème rangée 100% pliée"
              : "2nd row 100% folded",
          image:
            "https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/REXTON/CONVENIENCE/luggage-space-expanded/2nd-row-100-folded.jpg",
        },
        {
          title:
            language === "fr" ? "2ème rangée 40% pliée" : "2nd row 40% folded",
          image:
            "https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/REXTON/CONVENIENCE/luggage-space-expanded/2nd-row-40-folded.jpg",
        },
        {
          title:
            language === "fr" ? "2ème rangée 60% pliée" : "2nd row 60% folded",
          image:
            "https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/REXTON/CONVENIENCE/luggage-space-expanded/2nd-row-60-folded.jpg",
        },
      ],
    },
    {
      id: 3,
      title: language === "fr" ? "Plus de fonctionnalités" : "More features",
      subtitle: language === "fr" ? "Ouvrir" : "Open",
      description: "",
      image:
        "https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/REXTON/CONVENIENCE/more-features.jpg",
      video: "",
      bgColor: "bg-gray-800",
      textColor: "text-white",
      subtitleColor: "text-white",
      hasOpenButton: true,
      expandedImages: [
        {
          title:
            language === "fr"
              ? "Hayon électrique intelligent"
              : "Smart power tailgate",
          image:
            "https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/REXTON/CONVENIENCE/more-features-expanded/smart-power-tailgate.jpg",
        },
        {
          title:
            language === "fr"
              ? "Dispositif d'accès passager"
              : "Passenger's seat walk-in device",
          image:
            "https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/REXTON/CONVENIENCE/more-features-expanded/passenger-seat-walk-in.jpg",
        },
        {
          title:
            language === "fr"
              ? "Aération arrière sur console centrale"
              : "Rear air vent on centre console",
          image:
            "https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/REXTON/CONVENIENCE/more-features-expanded/rear-air-vent.jpg",
        },
        {
          title:
            language === "fr"
              ? "Connectivité voiture - Apple CarPlay & Android Auto"
              : "Car connectivity - Apple CarPlay & Android Auto",
          image:
            "https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/REXTON/CONVENIENCE/more-features-expanded/car-connectivity.jpg",
        },
        {
          title:
            language === "fr"
              ? "Vitres électriques avant et toutes sécurisées"
              : "Front and all safety power windows",
          image:
            "https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/REXTON/CONVENIENCE/more-features-expanded/power-windows.jpg",
        },
        {
          title:
            language === "fr"
              ? "Réglages de mémoire d'assise pour les conducteurs"
              : "Seating memory settings for the drivers",
          image:
            "https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/REXTON/CONVENIENCE/more-features-expanded/seating-memory.jpg",
        },
        {
          title:
            language === "fr"
              ? "Rétroviseurs extérieurs inclinaison automatique en marche arrière"
              : "Automatic tilt-down external mirrors when reversing",
          image:
            "https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/REXTON/CONVENIENCE/more-features-expanded/tilt-mirrors.jpg",
        },
        {
          title:
            language === "fr"
              ? "Chargeur mobile sans fil (15W)"
              : "Wireless mobile charger (15W)",
          image:
            "https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/REXTON/CONVENIENCE/more-features-expanded/wireless-charger.jpg",
        },
        {
          title:
            language === "fr"
              ? "Emplacements USB type C sur la console avant et arrière"
              : "C-type USB slots on the front & back console",
          image:
            "https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/REXTON/CONVENIENCE/more-features-expanded/usb-slots.jpg",
        },
        {
          title:
            language === "fr"
              ? "Poignées de porte tactiles 2 canaux avec éclairage externe (1ère rangée)"
              : "2-channel touch-sensitive door handles with external lights (1st row)",
          image:
            "https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/REXTON/CONVENIENCE/more-features-expanded/touch-handles.jpg",
        },
        {
          title: language === "fr" ? "Fermeture automatique" : "Auto closing",
          image:
            "https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/REXTON/CONVENIENCE/more-features-expanded/auto-closing.jpg",
        },
        {
          title: "2nd row seats with folding centre armrest & cupholder",
          image:
            "https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/REXTON/CONVENIENCE/more-features-expanded/folding-armrest.jpg",
        },
        {
          title:
            language === "fr"
              ? "Essuie-glaces avant à détection de pluie"
              : "Rain-sensing front wipers",
          image:
            "https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/REXTON/CONVENIENCE/more-features-expanded/rain-sensing-wipers.jpg",
        },
        {
          title:
            language === "fr"
              ? "Toit ouvrant électrique sécurisé"
              : "Safety powered sunroof",
          image:
            "https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/REXTON/CONVENIENCE/more-features-expanded/safety-sunroof.jpg",
        },
        {
          title:
            language === "fr"
              ? "Sièges avant et arrière chauffants"
              : "Heated front and rear seats",
          image:
            "https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/REXTON/CONVENIENCE/more-features-expanded/heated-seats.jpg",
        },
        {
          title:
            language === "fr"
              ? "Sièges avant ventilés"
              : "Ventilated front seats",
          image:
            "https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/REXTON/CONVENIENCE/more-features-expanded/ventilated-seats.jpg",
        },
        {
          title:
            language === "fr"
              ? "Store manuel pour 2ème rangée"
              : "Manual roller blind for 2nd-row",
          image:
            "https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/REXTON/CONVENIENCE/more-features-expanded/roller-blind.jpg",
        },
        {
          title:
            language === "fr"
              ? "Couverture de volant en cuir chauffante"
              : "Heated leather steering wheel cover",
          image:
            "https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/REXTON/CONVENIENCE/more-features-expanded/heated-steering.jpg",
        },
        {
          title:
            language === "fr"
              ? "Protège-bas de porte avant éclairé (1ère rangée, option)"
              : "Illuminated front-door scuff (1st-row, option)",
          image:
            "https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/REXTON/CONVENIENCE/more-features-expanded/illuminated-scuff.jpg",
        },
        {
          title:
            language === "fr"
              ? "Poignée d'assistance montant B"
              : "B-pillar assist grip",
          image:
            "https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/REXTON/CONVENIENCE/more-features-expanded/assist-grip.jpg",
        },
        {
          title:
            language === "fr"
              ? "Console plafond et éclairage cabine LED"
              : "Overhead console & LED cabin light",
          image:
            "https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/REXTON/CONVENIENCE/more-features-expanded/overhead-console.jpg",
        },
        {
          title:
            language === "fr"
              ? "Rétroviseurs extérieurs avec lampe de marquage"
              : "Exterior rear view mirrors with puddle lamp",
          image:
            "https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/REXTON/CONVENIENCE/more-features-expanded/puddle-lamp.jpg",
        },
      ],
    },
  ];

  // Performance features data
  const performanceFeatures = [
    {
      id: 0,
      title:
        language === "fr"
          ? "Traction sélectionnable"
          : "Selectable wheel drive",
      subtitle:
        language === "fr"
          ? "4RM à temps partiel avec changement en marche"
          : "Part-time 4WD with shifting on the fly",
      description:
        language === "fr"
          ? "En conditions normales, il fonctionne en traction à deux roues, mais sur des routes enneigées ou pluvieuses, il peut passer activement en 4H, et pour la conduite tout-terrain, il peut sélectionner 4L."
          : "Under normal conditions, it operates in two-wheel drive, but on snowy or rainy roads, it can actively switch to 4H, and for off-road driving, it can select 4L.",
      image:
        "https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/REXTON/PERFORMANCE/selectable-wheel-drive.jpg",
      video:
        "https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/REXTON/PERFORMANCE/selectable-wheel-drive.mp4",
      bgColor: "bg-gray-800",
      textColor: "text-white",
      subtitleColor: "text-white",
      hasOpenButton: false,
    },
    {
      id: 1,
      title:
        language === "fr"
          ? "Concentration de puissance pour l'évasion tout-terrain"
          : "Power concentration for off-road escape",
      subtitle:
        language === "fr"
          ? "Différentiel verrouillable"
          : "Locking differential",
      description:
        language === "fr"
          ? "En appliquant les freins aux roues sans traction, il transfère la force motrice aux autres roues, assurant des performances exceptionnelles même dans des situations tout-terrain comme l'escalade de bosses."
          : "By applying the brakes to the wheels with no traction, it transfers driving force to the other wheels, ensuring outstanding performance even in off-road situations like climbing over bumps.",
      image:
        "https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/REXTON/PERFORMANCE/locking-differential.jpg",
      video:
        "https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/REXTON/PERFORMANCE/locking-differential.mp4",
      bgColor: "bg-gray-800",
      textColor: "text-white",
      subtitleColor: "text-white",
      hasOpenButton: false,
    },
    {
      id: 2,
      title: language === "fr" ? "Puissance de conduite" : "Driving power",
      subtitle:
        language === "fr"
          ? "Moteur diesel 2.2 litres"
          : "2.2 Litre diesel engine",
      description:
        language === "fr"
          ? "Il maintient un couple maximum dans la plage de régime fréquemment utilisée de 1600 à 2600, offrant des performances de conduite puissantes pendant la conduite quotidienne."
          : "It maintains maximum torque in the frequently used RPM range of 1600 to 2600, delivering powerful driving performance during everyday driving.",
      image:
        "https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/REXTON/PERFORMANCE/diesel-engine.jpg",
      video: "",
      bgColor: "bg-gray-200",
      textColor: "text-black",
      subtitleColor: "text-black",
      hasOpenButton: false,
    },
    {
      id: 3,
      title:
        language === "fr"
          ? "Commutateur 'Shift-By-Wire'"
          : "'Shift-By-Wire' toggle switch",
      subtitle:
        language === "fr"
          ? "Transmission automatique 8 vitesses"
          : "8-speed automatic transmission",
      description:
        language === "fr"
          ? "Transmission automatique électronique 8 vitesses, équipée d'un commutateur de déverrouillage pour prévenir les dysfonctionnements, offre des performances de changement de vitesse fluides et stables."
          : "8-speed electronic automatic transmission, equipped with an unlock switch to prevent malfunction, offers smooth and stable shifting performance.",
      image:
        "https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/REXTON/PERFORMANCE/automatic-transmission.jpg",
      video: "",
      bgColor: "bg-gray-200",
      textColor: "text-black",
      subtitleColor: "text-black",
      hasOpenButton: false,
    },
    {
      id: 4,
      title:
        language === "fr"
          ? "Suspension avant à double triangulation"
          : "Front double-wishbone suspension",
      subtitle:
        language === "fr"
          ? "Suspension arrière multi-bras"
          : "Multi-link rear suspension",
      description:
        language === "fr"
          ? "Il fournit une traction maximale même sur des surfaces routières irrégulières, avec les impacts routiers dispersés à travers plusieurs liaisons, assurant une expérience de conduite stable."
          : "It provides maximum traction even on irregular road surfaces, with road impacts dispersed through multiple links, ensuring a stable driving experience.",
      image:
        "https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/REXTON/PERFORMANCE/multi-link-suspension.jpg",
      video: "",
      bgColor: "bg-gray-200",
      textColor: "text-black",
      subtitleColor: "text-black",
      hasOpenButton: false,
    },
    {
      id: 5,
      title: language === "fr" ? "Système de traction" : "Drive system",
      subtitle:
        language === "fr"
          ? "Système de traction arrière (RWD)"
          : "Rear Wheel Drive (RWD) system",
      description:
        language === "fr"
          ? "En adoptant la traction arrière (RWD), généralement trouvée dans les berlines premium, il offre une tenue de route stable en virage et une conduite confortable."
          : "By adopting rear-wheel drive (RWD), typically found in premium sedans, it offers stable cornering and a comfortable ride.",
      image:
        "https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/REXTON/PERFORMANCE/rwd-system.jpg",
      video: "",
      bgColor: "bg-gray-200",
      textColor: "text-black",
      subtitleColor: "text-black",
      hasOpenButton: false,
    },
    {
      id: 6,
      title:
        language === "fr"
          ? "Performance de freinage améliorée"
          : "Enhanced braking performance",
      subtitle:
        language === "fr"
          ? "Freins à disques ventilés avant et arrière"
          : "Ventilated disc brakes for front and rear",
      description:
        language === "fr"
          ? "Il facilite le refroidissement facile de la chaleur générée par le frottement des disques, contribuant à des performances de freinage plus sûres et plus efficaces (roues avant et arrière)"
          : "It facilitates easy cooling of heat generated by disc friction, contributing to safer and more effective braking performance (front and rear wheels)",
      image:
        "https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/REXTON/PERFORMANCE/ventilated-brakes.jpg",
      video: "",
      bgColor: "bg-gray-200",
      textColor: "text-black",
      subtitleColor: "text-black",
      hasOpenButton: false,
    },
    {
      id: 7,
      title:
        language === "fr"
          ? "Support de conduite économique"
          : "Supporting economic driving",
      subtitle:
        language === "fr"
          ? "Système ISG (Idle Stop & Go)"
          : "ISG system (Idle Stop & Go)",
      description:
        language === "fr"
          ? "Arrête automatiquement le moteur lorsque le véhicule est à l'arrêt, comme à un feu de signalisation, pour améliorer l'efficacité énergétique en réduisant le ralenti inutile (peut être activé/désactivé)."
          : "Automatically shuts off the engine when the vehicle is stationary, such as at a traffic signal, to improve fuel efficiency by reducing unnecessary idling (can be switched on/off).",
      image:
        "https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/REXTON/PERFORMANCE/isg-system.jpg",
      video: "",
      bgColor: "bg-gray-200",
      textColor: "text-black",
      subtitleColor: "text-black",
      hasOpenButton: false,
    },
    {
      id: 8,
      title:
        language === "fr"
          ? "Support de conduite agile"
          : "Supporting agile driving",
      subtitle:
        language === "fr" ? "Palettes de changement" : "Paddle shifters",
      description:
        "Offering manual mode shifting with up/down shift controls on the steering wheel, allowing for quick response to sudden driving situations.",
      image:
        "https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/REXTON/PERFORMANCE/paddle-shifters.jpg",
      video: "",
      bgColor: "bg-gray-200",
      textColor: "text-black",
      subtitleColor: "text-black",
      hasOpenButton: false,
    },
    {
      id: 9,
      title:
        language === "fr"
          ? "Fonction Auto-hold incluse"
          : "Auto-hold function included",
      subtitle:
        language === "fr"
          ? "Frein de stationnement électronique avec fonction auto-hold"
          : "Electronic parking brake with auto-hold function",
      description: "It is toggle-switch type including auto-hold function.",
      image:
        "https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/REXTON/PERFORMANCE/electronic-parking-brake.jpg",
      video: "",
      bgColor: "bg-gray-200",
      textColor: "text-black",
      subtitleColor: "text-black",
      hasOpenButton: false,
    },
    {
      id: 10,
      title: language === "fr" ? "Réduction du bruit" : "Noise reduction",
      subtitle: "NVH control",
      description:
        "Meticulous attention to detail, even in hidden areas of the vehicle, ensures minimized interior noise through enhanced sound insulation.",
      image:
        "https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/REXTON/PERFORMANCE/nvh-control.jpg",
      video: "",
      bgColor: "bg-gray-800",
      textColor: "text-white",
      subtitleColor: "text-white",
      hasOpenButton: true,
      expandedImages: [
        {
          title: "Engine room around sealing",
          image:
            "https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/REXTON/PERFORMANCE/nvh-control-expanded/engine-room-sealing.jpg",
        },
        {
          title: "Door quadruple structure sealing",
          image:
            "https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/REXTON/PERFORMANCE/nvh-control-expanded/door-quadruple-sealing.jpg",
        },
        {
          title: "polyethylene wheel house",
          image:
            "https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/REXTON/PERFORMANCE/nvh-control-expanded/polyethylene-wheel-house.jpg",
        },
        {
          title: "Noise control glass",
          image:
            "https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/REXTON/PERFORMANCE/nvh-control-expanded/noise-control-glass.jpg",
        },
      ],
    },
    {
      id: 11,
      title: "Supporting safe driving",
      subtitle: "Drive mode system",
      description:
        "With an integrated steering and suspension system, optimal driving performance is maintained according to the selected mode (NORMAL/SPORTS/WINTER).",
      image:
        "https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/REXTON/PERFORMANCE/drive-mode-system.jpg",
      video: "",
      bgColor: "bg-gray-200",
      textColor: "text-black",
      subtitleColor: "text-black",
      hasOpenButton: false,
    },
  ];

  // Special Lineup data
  const specialLineupFeatures = [
    {
      id: 0,
      title: "1,462 litres of loading space & maximum load of 300 kg",
      description:
        "Equipped with a vertical partition panel, allowing for safe and efficient storage",
      image:
        "https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/REXTON/SPECIALLINEUP/20250206090948971_vj6I1r.jpg",
    },
    {
      id: 1,
      title: "In-cable control and protection device (IC-CPD)",
      description: "Simple, easy charging",
      image:
        "https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/REXTON/SPECIALLINEUP/20250206091009725_VKdNbH.jpg",
    },
  ];

  // Specification images
  const specImages = [
    {
      id: 0,
      src: "https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/REXTON/SPECIFICATION/front_view.jpg",
      alt: "Front view",
    },
    {
      id: 1,
      src: "https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/REXTON/SPECIFICATION/side_view.jpg",
      alt: "Side view",
    },
    {
      id: 2,
      src: "https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/REXTON/SPECIFICATION/rear_view.jpg",
      alt: "Rear view",
    },
  ];

  // Specification data
  const specificationData = {
    dimensions: [
      {
        label: language === "fr" ? "ROUES MOTRICES" : "DRIVEN WHEELS",
        value: "2WD",
      },
      {
        label: language === "fr" ? "TRANSMISSION" : "TRANSMISSION",
        value: "1AT",
      },
      { label: "Type", value: "Wagon" },
      { label: "Overall length (mm)", value: "4,715" },
      { label: "Overall width (mm)", value: "1,890" },
      { label: "Overall height (mm)", value: "1,715 (1,725 with roof rack)" },
      { label: "Wheelbase (mm)", value: "2,680" },
      { label: "Tread", value: "Front (mm): 1,620, Rear (mm): 1,640" },
      { label: "Overhang", value: "Front (mm): 930, Rear (mm): 1,105" },
      { label: "Approach angle (degree)", value: "18.3" },
      { label: "Departure angle (degree)", value: "20.8" },
      { label: "Ramp angle (degree)", value: "15.3" },
      { label: "Minimum ground clearance (mm)", value: "169" },
      { label: "Minimum turning radius (m)", value: "5.42" },
      { label: "Gross vehicle weight (kg)", value: "2,410" },
      { label: "Kerb weight (kg)", value: "1,915" },
      {
        label: "Gross trailer weight",
        value: "Braked (kg): 1,500, Unbraked (kg): 500",
      },
    ],
    powertrain: [
      {
        label: language === "fr" ? "ROUES MOTRICES" : "DRIVEN WHEELS",
        value: "2WD",
      },
      { label: "Engine type", value: "Electric motor" },
      { label: "Transmission", value: "1AT" },
      { label: "Battery", value: "Lithium Iron Phosphate (LifeP04)" },
      {
        label: "Standard charging time (0 to 100%)",
        value: "Three phase : 30h (IC-CPD, 2kW), 9h (11kW)",
      },
      {
        label: "Fast charge time (10% to 80%)",
        value: "300kW: 37min, 100kW: 42min",
      },
      { label: "On-board charger power (kW)", value: "10.5" },
      { label: "Capacity (kWh)", value: "73.4" },
      { label: "Battery voltage (V)", value: "390.4" },
      { label: "Max. power", value: "kW: 152.2, ps: 206.934" },
      { label: "Max. torque", value: "Nm: 339, kg.m: 34.6" },
      { label: "Acceleration from 0 to 100 km/h (sec)", value: "8.11" },
      { label: "Max. speed (km/h)", value: "175" },
    ],
    fuelEfficiency: [
      {
        label: language === "fr" ? "ROUES MOTRICES" : "DRIVEN WHEELS",
        value: "2WD",
      },
      {
        label: language === "fr" ? "TRANSMISSION" : "TRANSMISSION",
        value: "1AT",
      },
      {
        label: language === "fr" ? "Moteur Électrique" : "Electric Motor",
        value: "Interior permanent magnet synchronous motor",
      },
      {
        label: "Electric energy consumption (Wh/km)",
        value: "135.5: City, 186.5: Combined",
      },
      { label: "Electric range (km)", value: "462" },
      { label: "Electric range city (km)", value: "635" },
    ],
    tyreInformation: [
      { label: "Maker", value: "NX" },
      { label: "Size", value: "225/60R18" },
      {
        label:
          language === "fr"
            ? "Fiche d'Information Produit"
            : "Product Information Sheet",
        value: "PDF",
      },
      {
        label: language === "fr" ? "Étiquette Pneu" : "Tyre Label",
        value: "PDF",
      },
    ],
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
      title: language === "fr" ? "DIMENSIONS" : "DIMENSIONS",
      content: {
        dimensions: [
          {
            label: language === "fr" ? "Longueur Totale" : "Overall Length",
            value: "4,200mm",
          },
          {
            label: language === "fr" ? "Largeur Totale" : "Overall Width",
            value: "1,560mm",
          },
          {
            label: language === "fr" ? "Hauteur Totale" : "Overall Height",
            value: "1,613mm",
          },
          {
            label: language === "fr" ? "Empattement" : "Wheelbase",
            value: "2,600mm",
          },
          {
            label: language === "fr" ? "Garde au Sol" : "Ground Clearance",
            value: "190mm",
          },
        ],
      },
    },
    {
      id: 1,
      title: language === "fr" ? "GROUPE MOTOPROPULSEUR" : "POWERTRAIN",
      content: {
        engine: [
          {
            label: language === "fr" ? "Type de Moteur" : "Engine Type",
            value: "1.5L GDI Turbo",
          },
          {
            label: language === "fr" ? "Cylindrée" : "Displacement",
            value: "1,497cc",
          },
          {
            label: language === "fr" ? "Puissance Max" : "Max Power",
            value: "160ps @ 5,500rpm",
          },
          {
            label: language === "fr" ? "Couple Max" : "Max Torque",
            value: "25.5kgf·m @ 1,500-4,000rpm",
          },
        ],
        transmission: [
          {
            label: language === "fr" ? "Transmission" : "Transmission",
            value: "6-Speed Automatic",
          },
          {
            label: language === "fr" ? "Type de Traction" : "Drive Type",
            value: "FWD / AWD",
          },
        ],
      },
    },
    {
      id: 2,
      title: language === "fr" ? "EFFICACITÉ ÉNERGÉTIQUE" : "FUEL EFFICIENCY",
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
      title:
        language === "fr" ? "INFORMATIONS SUR LES PNEUS" : "TYRE INFORMATION",
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
      name: language === "fr" ? "MARCHEPIED LATÉRAL" : "SIDE STEP",
      image:
        "https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/REXTON/ACCESSORY/exterior/20250124183741695_NQUeeZ.jpg",
      description:
        language === "fr"
          ? "Marchepieds latéraux pratiques avec surface antidérapante texturée"
          : "Convenient side steps with textured non-slip surface",
    },
  ];

  const interiorAccessories = [
    {
      id: 0,
      name: language === "fr" ? "PURIFICATEUR D'AIR" : "AIR PURIFIER",
      image:
        "https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/REXTON/ACCESSORY/interior/20250124183936107_5MINPf.jpg",
      description:
        language === "fr"
          ? "Système de purification d'air avancé pour un air intérieur propre"
          : "Advanced air purification system for clean interior air",
    },
    {
      id: 1,
      name:
        language === "fr" ? "LAMPE DE PROJECTION DE PORTE" : "DOOR SPOT LAMP",
      image:
        "https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/REXTON/ACCESSORY/interior/20250124183950181_9EdE5O.jpg",
      description:
        language === "fr"
          ? "Seuil de porte éclairé avec projection du logo de la marque"
          : "Illuminated door sill with brand logo projection",
    },
    {
      id: 2,
      name: language === "fr" ? "PÉDALE SPORT ALLIAGE" : "ALLOY SPORTS PEDAL",
      image:
        "https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/REXTON/ACCESSORY/interior/20250124184004822_78G9wN.jpg",
      description:
        language === "fr"
          ? "Couvre-pédales en alliage sportif avec poignée texturée"
          : "Sporty alloy pedal covers with textured grip",
    },
    {
      id: 3,
      name:
        language === "fr"
          ? "CLIMATISATION SOUFFLAGE ARRIÈRE"
          : "AIR CONDITIONER AFTER BLOW",
      image:
        "https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/REXTON/ACCESSORY/interior/20250124184019588_utnKhT.jpg",
      description:
        language === "fr"
          ? "Système de climatisation avancé avec fonction de soufflage arrière"
          : "Advanced climate control system with after-blow feature",
    },
  ];

  const carHotspots = [
    {
      id: "headlight",
      position: { x: "45%", y: "41%" },
      title: "LED Headlights",
      description: "Advanced LED lighting technology",
    },
    {
      id: "grille",
      position: { x: "41%", y: "54%" },
      title: "Signature Grille",
      description: "Distinctive front grille design",
    },
    {
      id: "foglight",
      position: { x: "51%", y: "66%" },
      title: "Fog Lights",
      description: "Enhanced visibility in all conditions",
    },
    {
      id: "wheel",
      position: { x: "35%", y: "47%" },
      title: "Alloy Wheels",
      description: "Sporty multi-spoke design",
    },
  ];

  // Interior hotspots data
  const interiorHotspots = [
    {
      id: "dashboard",
      position: { x: "31%", y: "28%" },
      title:
        language === "fr"
          ? 'Cluster Numérique 12,3"'
          : '12.3" Full-Digital Cluster',
      description:
        language === "fr"
          ? "Affichage numérique complet"
          : "Full digital display",
      content: {
        title:
          language === "fr"
            ? 'Cluster Numérique 12,3"'
            : '12.3" Full-Digital Cluster',
        subtitle:
          language === "fr"
            ? "Affichage numérique complet"
            : "Full digital display",
        image:
          "https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/REXTON/Btnsinterior/btn1/20250204132428905_BRlPHX.jpg",
        texts: [
          language === "fr"
            ? "Le cluster numérique de 12,3\" inclut trois modes d'affichage, une fonction de miroir AVN et des modes d'animation d'accueil et d'au revoir."
            : '12.3" full-digital cluster includes three screen mode patterns, an AVN mirroring function and Welcome & Goodbye animation modes.',
        ],
      },
    },
    {
      id: "steering",
      position: { x: "49%", y: "25%" },
      title: language === "fr" ? 'Navigation 12,3"' : '12.3" Navigation',
      description:
        language === "fr"
          ? "Navigation flottante intuitive"
          : "Intuitive floating navigation",
      content: {
        title: language === "fr" ? 'Navigation 12,3"' : '12.3" Navigation',
        subtitle:
          language === "fr"
            ? "Navigation flottante intuitive"
            : "Intuitive floating navigation",
        image:
          "https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/REXTON/Btnsinterior/btn2/20250204132450236_HemV8P.jpg",
        texts: [
          language === "fr"
            ? "La navigation de type flottant offre une utilisabilité intuitive et fournit des mises à jour automatiques en temps réel lorsqu'elle est connectée à Internet."
            : "The floating-type navigation offers intuitive usability and provides real-time automatic updates when connected to the internet.",
        ],
      },
    },
    {
      id: "seats",
      position: { x: "65%", y: "84%" },
      title: language === "fr" ? "Sièges Électriques" : "Electric Seats",
      description:
        language === "fr"
          ? "Réglage électrique précis"
          : "Precise electric adjustment",
      content: {
        title: language === "fr" ? "Sièges Électriques" : "Electric Seats",
        subtitle:
          language === "fr"
            ? "Réglage électrique précis"
            : "Precise electric adjustment",
        image:
          "https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/REXTON/Btnsinterior/btn5/20250124173828184_MsDq1c.jpg",
        texts: [
          language === "fr"
            ? "Les sièges électriques offrent un réglage précis et confortable pour une position de conduite optimale, avec des commandes intuitives et une mémoire des positions."
            : "The electric seats provide precise and comfortable adjustment for optimal driving position, with intuitive controls and position memory.",
        ],
      },
    },
    {
      id: "gear-selector",
      position: { x: "44%", y: "44%" },
      title:
        language === "fr"
          ? "Système de Climatisation Double Zone"
          : "Front dual-temperature zone auto air conditioning system",
      description:
        language === "fr"
          ? "Contrôleur d'affichage LCD intuitif"
          : "Intuitive LCD display controller",
      content: {
        title:
          language === "fr"
            ? "Système de Climatisation Double Zone"
            : "Front dual-temperature zone auto air conditioning system",
        subtitle:
          language === "fr"
            ? "Contrôleur d'affichage LCD intuitif"
            : "Intuitive LCD display controller",
        image:
          "https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/REXTON/Btnsinterior/btn3/20250210202342178_L0EoWT.jpg",
        texts: [
          language === "fr"
            ? "Le système de climatisation automatique double zone avant avec contrôleur d'affichage LCD intuitif et fonctions de chauffage rapide (PTC) et de dégivrage automatique."
            : "Front dual-temperature zone auto air conditioning system with intuitive LCD display controller and rapid heater (PTC) and auto defogging functions.",
        ],
      },
    },
    {
      id: "air-conditioning",
      position: { x: "60%", y: "41%" },
      title:
        language === "fr" ? "32 Éclairages d'Ambiance" : "32 ambient lights",
      description:
        language === "fr"
          ? "Créer diverses atmosphères"
          : "Create various atmospheres",
      content: {
        title:
          language === "fr" ? "32 Éclairages d'Ambiance" : "32 ambient lights",
        subtitle:
          language === "fr"
            ? "Créer diverses atmosphères"
            : "Create various atmospheres",
        image:
          "https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/REXTON/Btnsinterior/btn4/20250827173601141_meEyFa.jpg",
        texts: [
          language === "fr"
            ? "Créez diverses atmosphères à l'intérieur du véhicule en combinant l'éclairage indirect sur l'avant de l'IP, et les garnitures de portes, et les lampes de pied, avec jusqu'à 32 options de couleurs."
            : "Create various atmospheres inside the vehicle by combining indirect lighting on the IP front, and door trim, and foot lamps, with up to 32 color options.",
        ],
      },
    },
  ];

  // Interior hotspot handlers
  const handleInteriorHotspotClick = (hotspotId: string) => {
    setSelectedInteriorHotspot(hotspotId);
    setIsInteriorSideMenuOpen(true);
    setCurrentInteriorHotspotImage(0);
  };

  const closeInteriorSideMenu = () => {
    setIsInteriorSideMenuOpen(false);
    setSelectedInteriorHotspot(null);
    setCurrentInteriorHotspotImage(0);
  };

  const getInteriorHotspotContent = () => {
    if (!selectedInteriorHotspot) return null;
    const hotspot = interiorHotspots.find(
      (h) => h.id === selectedInteriorHotspot
    );
    return hotspot?.content || null;
  };

  const nextInteriorHotspotImage = () => {
    const content = getInteriorHotspotContent();
    if (content) {
      const videoCount = "video" in content && content.video ? 1 : 0;
      const imagesCount =
        "images" in content && Array.isArray(content.images)
          ? content.images.length
          : 0;
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
        "images" in content && Array.isArray(content.images)
          ? content.images.length
          : 0;
      const imageCount = "image" in content && content.image ? 1 : 0;
      const totalItems = videoCount + imagesCount + imageCount;
      setCurrentInteriorHotspotImage((prev) =>
        prev === 0 ? totalItems - 1 : prev - 1
      );
    }
  };

  // Hotspot content function for sidebar
  const getHotspotContent = (hotspotId: string) => {
    const hotspot = carHotspots.find((h) => h.id === hotspotId);
    if (!hotspot) return null;

    // Special case for headlight hotspot - Full LED 4-ball front head lights with LED DRL
    if (hotspotId === "headlight") {
      return {
        title:
          language === "fr"
            ? "Phares LED 4-balles avant avec LED DRL"
            : "Full LED 4-ball front head lights with LED DRL",
        subtitle:
          language === "fr"
            ? "Système d'éclairage LED avancé"
            : "Advanced LED lighting system",
        video:
          "https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/REXTON/Btns/btn1/20250124171010570_rCapxn.mp4",
        texts: [
          language === "fr"
            ? "Les feux de circulation diurne (DRL) et les feux de clignotement séquentiels sont intégrés ; Les phares LED supérieurs/inférieurs sont équipés d'un système d'éclairage à quatre lampes."
            : "Daytime running lights (DRL) and sequential turn signal lamps are built-in; The upper/lower LED head lights are equipped with a four-lamp lighting system.",
        ],
      };
    }

    // Special case for grille hotspot - Deluxed mesh-shaped radiator grille
    if (hotspotId === "wheel") {
      return {
        title:
          language === "fr"
            ? "Calandre radiateur en forme de maille de luxe"
            : "Deluxed mesh-shaped radiator grille",
        subtitle: language === "fr" ? "Finition Satin Silver" : "Satin Silver",
        images: [
          "https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/REXTON/Btns/btn2/20250124170918044_dJSZSV.jpg",
          "https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/REXTON/Btns/btn2/20250124170933999_pxG2tD.jpg",
        ],
        texts: [
          language === "fr"
            ? "Calandre radiateur en forme de maille de luxe avec finition Satin Silver"
            : "Deluxed mesh-shaped radiator grille with Satin Silver finish",
        ],
      };
    }

    // Special case for wheel hotspot - Cornering lamp with built-in LED fog lamp
    if (hotspotId === "grille") {
      return {
        title:
          language === "fr"
            ? "Lampe de virage avec phare antibrouillard LED intégré"
            : "Cornering lamp with built-in LED fog lamp",
        subtitle:
          language === "fr"
            ? "Noir brillant haute qualité"
            : "Black high glossy",
        video:
          "https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/REXTON/Btns/btn3/20250210210015747_XBELB8.mp4",
        texts: [
          language === "fr"
            ? "Lampe de virage avec phare antibrouillard LED intégré, finition noire brillante haute qualité"
            : "Cornering lamp with built-in LED fog lamp, black high glossy finish",
        ],
      };
    }

    // Special case for wheel hotspot - Wheel specifications content
    if (hotspotId === "foglight") {
      return {
        title: language === "fr" ? "Jantes" : "Wheels",
        images: [
          "https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/REXTON/Btns/btn4/20250124171027386_BYDQTZ.jpg",
          "https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/REXTON/Btns/btn4/20250124171046975_INJXP2.jpg",
          "https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/REXTON/Btns/btn4/20250124171105041_brfcqH.jpg",
        ],
        texts: [
          language === "fr"
            ? '18" jantes alliage finition diamant (P255/60R18)'
            : '18" diamond-cut finished alloy wheels (P255/60R18)',
          language === "fr"
            ? '20" jantes alliage finition diamant (P255/50R20)'
            : '20" diamond-cut finished alloy wheels (P255/50R20)',
          language === "fr"
            ? '20" jantes alliage finition diamant (P255/50R20)'
            : '20" diamond-cut finished alloy wheels (P255/50R20)',
        ],
      };
    }

    return {
      title: hotspot.title,
      subtitle: hotspot.description,
      images: [
        `/assets/Modelspage/REXTON/section2/buttonsfront/${hotspotId}1.jpg`,
        `/assets/Modelspage/REXTON/section2/buttonsfront/${hotspotId}2.jpg`,
        `/assets/Modelspage/REXTON/section2/buttonsfront/${hotspotId}3.jpg`,
      ],
      texts: [
        `Discover the advanced technology behind the ${hotspot.title.toLowerCase()}.`,
        `Experience the precision engineering that makes ${hotspot.title.toLowerCase()} exceptional.`,
        `Learn about the innovative design features of the ${hotspot.title.toLowerCase()}.`,
      ],
    };
  };

  const carColors = [
    {
      id: 0,
      name: "Space Black",
      oneTone:
        "https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/REXTON/section3/Space%20Black/1tone/20250124172106000_AtKCOM.jpg",
      twoTone:
        "https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/REXTON/section3/Space%20Black/2tone/20250210195308373_pelBG1.jpg",
      colorSwatch: "#1A1A1A",
      hasTwoTones: true, // This color has two tones
      vrImages: {
        oneTone: Array.from(
          { length: 36 },
          (_, i) =>
            `/assets/Modelspage/REXTON/vr360/space-black-1tone/${String(
              i + 1
            ).padStart(2, "0")}.png`
        ),
        twoTone: Array.from(
          { length: 36 },
          (_, i) =>
            `/assets/Modelspage/REXTON/vr360/space-black-2tone/${String(
              i + 1
            ).padStart(2, "0")}.png`
        ),
      },
    },
    {
      id: 1,
      name: "Elemental Gray",
      oneTone:
        "https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/REXTON/section3/Elemental%20Gray/20250124172355810_aFC7rE.jpg",
      twoTone:
        "https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/REXTON/section3/Elemental%20Gray/20250124172355810_aFC7rE.jpg", // Same image for both tones
      colorSwatch: "#6B6B6B",
      hasTwoTones: false, // This color only has one tone
      vrImages: {
        oneTone: Array.from(
          { length: 36 },
          (_, i) =>
            `/assets/Modelspage/REXTON/vr360/elemental-gray-1tone/${String(
              i + 1
            ).padStart(2, "0")}.png`
        ),
        twoTone: Array.from(
          { length: 36 },
          (_, i) =>
            `/assets/Modelspage/REXTON/vr360/elemental-gray-1tone/${String(
              i + 1
            ).padStart(2, "0")}.png`
        ), // Same VR images since only 1-tone available
      },
    },
    {
      id: 2,
      name: "Grand White",
      oneTone:
        "https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/REXTON/section3/Grand%20White/20250124172631603_OKPwlc.jpg",
      twoTone:
        "https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/REXTON/section3/Grand%20White/20250124172631603_OKPwlc.jpg", // Same image for both tones
      colorSwatch: "#FFFFFF",
      hasTwoTones: false, // This color only has one tone
      vrImages: {
        oneTone: Array.from(
          { length: 36 },
          (_, i) =>
            `/assets/Modelspage/REXTON/vr360/grand-white-1tone/${String(
              i + 1
            ).padStart(2, "0")}.png`
        ),
        twoTone: Array.from(
          { length: 36 },
          (_, i) =>
            `/assets/Modelspage/REXTON/vr360/grand-white-1tone/${String(
              i + 1
            ).padStart(2, "0")}.png`
        ), // Same VR images since only 1-tone available
      },
    },
    {
      id: 3,
      name: "Marble Gray",
      oneTone:
        "https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/REXTON/section3/Marble%20Gray/20250124172822194_AxHu4l.jpg",
      twoTone:
        "https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/REXTON/section3/Marble%20Gray/20250124172822194_AxHu4l.jpg", // Same image for both tones
      colorSwatch: "#8B8B8B",
      hasTwoTones: false, // This color only has one tone
      vrImages: {
        oneTone: Array.from(
          { length: 36 },
          (_, i) =>
            `/assets/Modelspage/REXTON/vr360/marble-gray-1tone/${String(
              i + 1
            ).padStart(2, "0")}.png`
        ),
        twoTone: Array.from(
          { length: 36 },
          (_, i) =>
            `/assets/Modelspage/REXTON/vr360/marble-gray-1tone/${String(
              i + 1
            ).padStart(2, "0")}.png`
        ), // Same VR images since only 1-tone available
      },
    },
  ];

  // Handle color selection with automatic tone mode adjustment
  const handleColorSelection = (colorId: number) => {
    setSelectedColor(colorId);
    const color = carColors[colorId];
    // If color only has one tone, automatically set to 1 TONE
    if (!color.hasTwoTones) {
      setToneMode("1 TONE");
    }
  };

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

    // Debug color selection
    const currentColor = carColors[selectedColor];
    console.log(`Selected color: ${currentColor.name}, Tone: ${toneMode}`);
    console.log(
      `Image source: ${
        toneMode === "1 TONE" ? currentColor.oneTone : currentColor.twoTone
      }`
    );
  }, [selectedColor, toneMode]);

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
      Math.min(prev + 1, convenienceFeatures.length - 4)
    );
  };

  const prevConvenienceCard = () => {
    setCurrentConvenienceCard((prev) => Math.max(prev - 1, 0));
  };

  // Navigation functions for performance carousel
  const nextPerformanceCard = () => {
    setCurrentPerformanceCard((prev) =>
      Math.min(prev + 1, performanceFeatures.length - 6)
    );
  };

  const prevPerformanceCard = () => {
    setCurrentPerformanceCard((prev) => Math.max(prev - 1, 0));
  };

  // Toggle special lineup features visibility
  const toggleSpecialLineupFeatures = () => {
    setShowSpecialLineupFeatures((prev) => !prev);
  };

  // Toggle specification accordion
  const toggleSpecificationAccordion = (index: number) => {
    setActiveSpecificationAccordion(
      activeSpecificationAccordion === index ? null : index
    );
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
        title="KGM Rexton | SUV Premium Luxe au Maroc"
        description="Découvrez le KGM Rexton, SUV premium luxe au Maroc. Confort exceptionnel, technologie avancée, performances remarquables. Réservez votre essai."
        keywords="KGM Rexton, SUV luxe Maroc, Rexton prix, SUV premium, KGM Mobility"
        titleFr="KGM Rexton | SUV Premium Luxe au Maroc"
        descriptionFr="Découvrez le KGM Rexton, SUV premium luxe au Maroc. Confort exceptionnel, technologie avancée, performances remarquables. Réservez votre essai."
        keywordsFr="KGM Rexton, SUV luxe Maroc, Rexton prix, SUV premium, KGM Mobility"
      />
      <Navbar />

      {/* Hero Section */}
      <SEO
        title="KGM Rexton | SUV Premium Luxe au Maroc"
        description="Découvrez le KGM Rexton, SUV premium luxe au Maroc. Confort exceptionnel, technologie avancée, performances remarquables. Réservez votre essai."
        keywords="KGM Rexton, SUV luxe Maroc, Rexton prix, SUV premium, KGM Mobility"
        titleFr="KGM Rexton | SUV Premium Luxe au Maroc"
        descriptionFr="Découvrez le KGM Rexton, SUV premium luxe au Maroc. Confort exceptionnel, technologie avancée, performances remarquables. Réservez votre essai."
        keywordsFr="KGM Rexton, SUV luxe Maroc, Rexton prix, SUV premium, KGM Mobility"
      />
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
              src="https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/REXTON/hero/rexton_hero_video.mp4"
              type="video/mp4"
            />
            {/* Fallback image if video doesn't load */}
            <Image
              src="https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/Tivoli/20250123100604289_9mmu8c.png"
              alt="REXTON"
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

          {/* Bottom Content - REXTON title, subtitle, and buttons */}
          <div className="flex justify-center lg:justify-start px-8 sm:px-12 lg:px-16 pb-16">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="max-w-2xl"
            >
              {/* Model Name - smaller size */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="mb-4"
              >
                <Image
                  src="https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/REXTON/hero/rexton_title_logo.svg"
                  alt="REXTON"
                  width={400}
                  height={80}
                  className="h-16 lg:h-20 w-auto"
                />
              </motion.div>

              {/* Subtitle - smaller size */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="text-lg lg:text-xl text-white mb-8 font-light"
                style={{ fontSize: "clamp(1rem, 2vw, 1.5rem)" }}
              >
                {language === "fr"
                  ? "Quand l'Élégance Rencontre la Performance"
                  : "When Elegance Meets Performance"}
              </motion.p>

              {/* Action Buttons - smaller size */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <motion.a
                  href="/book-test-drive?model=rexton"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-3 bg-kgm-amber/90 border border-kgm-amber text-white font-semibold uppercase tracking-wide hover:bg-kgm-amber transition-all duration-300 rounded-sm text-sm"
                  style={{ minWidth: "120px" }}
                >
                  {language === "fr"
                    ? "Réservez Votre Essai"
                    : "Book Your Test Drive"}
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
                className="bg-gray-800/90 backdrop-blur-sm border border-gray-600/40 p-6 rounded-xl"
                style={{
                  minWidth: "200px",
                  maxWidth: "220px",
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

      {/* Mobile Feature Boxes - smaller size */}
      <section className="lg:hidden bg-gray-900 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="bg-gray-800 border border-gray-600/30 p-6 rounded-xl"
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
                src="https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/REXTON/section1/rexton_section1_video.mp4"
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
              src="https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/REXTON/section1/rexton_section1_video.mp4"
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
              ? "COURBES ÉLÉGANTES ET MAJESTUEUSES"
              : "ELEGANT AND MAJESTIC CURVES"}
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
      <section className="relative min-h-[800px] bg-gradient-to-b from-black via-gray-900 to-black overflow-hidden py-16">
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

        {/* Car Display */}
        <div className="relative z-10 flex-1 flex items-center justify-center mt-8">
          <motion.div
            initial={{ opacity: 1, scale: 1 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0 }}
            className="relative w-full h-[600px] flex items-center justify-center"
          >
            <Image
              src="https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/REXTON/section2/rexton_exterior_front.png"
              alt="REXTON front view"
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

        {/* Car Feature Sidebar */}
        <CarFeatureSidebar
          isOpen={isSideMenuOpen && !!selectedHotspot}
          onClose={closeSidebar}
          selectedHotspot={selectedHotspot}
          getHotspotContent={() =>
            selectedHotspot ? getHotspotContent(selectedHotspot) : null
          }
          currentHotspotImage={currentHotspotImage}
          setCurrentHotspotImage={setCurrentHotspotImage}
        />
      </section>

      {/* Color Configurator Section */}
      <section className="relative bg-black overflow-hidden mt-16">
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
                key={`${selectedColor}-${toneMode}`}
                src={
                  toneMode === "1 TONE"
                    ? carColors[selectedColor].oneTone
                    : carColors[selectedColor].twoTone
                }
                alt={`TORRES in ${carColors[selectedColor].name} - ${toneMode}`}
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
                    {language === "fr" ? "360° VR" : "360° VR"}
                  </button>
                </motion.div>
              </div>

              {/* Color Selection Panel - Inside Image */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20">
                <motion.div
                  initial={{ opacity: 1, y: 0 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0 }}
                  className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 max-w-4xl mx-auto shadow-2xl"
                >
                  {/* Current Color Name */}
                  <div className="text-center mb-4">
                    <h3 className="text-lg font-bold text-white">
                      {carColors[selectedColor].name}
                    </h3>
                  </div>

                  {/* Color Swatches */}
                  <div className="flex justify-center gap-3 mb-4">
                    {carColors.map((color) => (
                      <motion.button
                        key={color.id}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleColorSelection(color.id)}
                        className={`rounded-full border-2 transition-all duration-300 ${
                          selectedColor === color.id
                            ? "border-white scale-110"
                            : "border-white/50 hover:border-white"
                        }`}
                        style={{
                          backgroundColor: color.colorSwatch,
                          width: "24px", // All colors are now half size
                          height: "24px",
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

                  {/* Tone Options - Only show if color has two tones */}
                  {carColors[selectedColor].hasTwoTones && (
                    <div className="flex justify-center gap-8">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="tone"
                          value="1 TONE"
                          checked={toneMode === "1 TONE"}
                          onChange={(e) =>
                            setToneMode(e.target.value as "1 TONE" | "2 TONE")
                          }
                          className="w-4 h-4 text-blue-600"
                        />
                        <span className="text-white font-semibold text-sm">
                          {language === "fr" ? "1 TON" : "1 TONE"}
                        </span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="tone"
                          value="2 TONE"
                          checked={toneMode === "2 TONE"}
                          onChange={(e) =>
                            setToneMode(e.target.value as "1 TONE" | "2 TONE")
                          }
                          className="w-4 h-4 text-blue-600"
                        />
                        <span className="text-white font-semibold text-sm">
                          {language === "fr" ? "2 TONS" : "2 TONE"}
                        </span>
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
                    <h3 className="text-2xl font-bold mb-4">
                      {language === "fr" ? "Vue VR 360°" : "360° VR View"}
                    </h3>
                    <p className="text-lg opacity-80">
                      {language === "fr"
                        ? "Images VR non disponibles pour cette combinaison de couleur/ton"
                        : "VR images not available for this color/tone combination"}
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
                    {language === "fr" ? "360° VR" : "360° VR"}
                  </button>
                </motion.div>
              </div>

              {/* Color Selection Panel - Inside VR View */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20">
                <motion.div
                  initial={{ opacity: 1, y: 0 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0 }}
                  className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 max-w-4xl mx-auto shadow-2xl"
                >
                  {/* Current Color Name */}
                  <div className="text-center mb-4">
                    <h3 className="text-lg font-bold text-white">
                      {carColors[selectedColor].name}
                    </h3>
                  </div>

                  {/* Color Swatches */}
                  <div className="flex justify-center gap-3 mb-4">
                    {carColors.map((color) => (
                      <motion.button
                        key={color.id}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleColorSelection(color.id)}
                        className={`rounded-full border-2 transition-all duration-300 ${
                          selectedColor === color.id
                            ? "border-white scale-110"
                            : "border-white/50 hover:border-white"
                        }`}
                        style={{
                          backgroundColor: color.colorSwatch,
                          width: "24px", // All colors are now half size
                          height: "24px",
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

                  {/* Tone Options - Only show if color has two tones */}
                  {carColors[selectedColor].hasTwoTones && (
                    <div className="flex justify-center gap-8">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="tone"
                          value="1 TONE"
                          checked={toneMode === "1 TONE"}
                          onChange={(e) =>
                            setToneMode(e.target.value as "1 TONE" | "2 TONE")
                          }
                          className="w-4 h-4 text-blue-600"
                        />
                        <span className="text-white font-semibold text-sm">
                          {language === "fr" ? "1 TON" : "1 TONE"}
                        </span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="tone"
                          value="2 TONE"
                          checked={toneMode === "2 TONE"}
                          onChange={(e) =>
                            setToneMode(e.target.value as "1 TONE" | "2 TONE")
                          }
                          className="w-4 h-4 text-blue-600"
                        />
                        <span className="text-white font-semibold text-sm">
                          {language === "fr" ? "2 TONS" : "2 TONE"}
                        </span>
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

        {/* First Interior Image - Maroon Red Interior */}
        <div className="relative w-full h-[35vh] md:h-screen flex items-center justify-center overflow-hidden px-0 md:px-4">
          <div
            className="absolute left-0 right-0 bottom-0 top-auto md:inset-x-0 md:top-0 md:h-full h-[60%]"
            style={{ bottom: isMobile ? "5px" : undefined }}
          >
            <Image
              src="https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/REXTON/features/card1/20250827172518106_INw0s8.jpg"
              alt="Maroon Red Interior"
              fill
              className="object-contain md:object-cover"
              priority
              quality={90}
            />
          </div>

          {/* Color Scheme Text Overlay */}
          <div className="hidden md:block absolute bottom-8 left-8 z-30">
            <h3 className="text-white text-4xl md:text-5xl font-bold mb-2">
              {language === "fr" ? "BEIGE CLASSIQUE" : "CLASSIC BEIGE"}
            </h3>
            <p className="text-white text-sm opacity-80">
              {language === "fr"
                ? "* Les photos et descriptions sont fournies à titre indicatif uniquement et peuvent différer du produit réel."
                : "* The photos and descriptions are for reference only and may differ from the actual product."}
            </p>
          </div>

          {/* Interactive Interior Hotspots */}
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
                whileTap={{ scale: 0.9 }}
                className="absolute w-5 h-5 md:w-8 md:h-8 bg-kgm-amber rounded-full flex items-center justify-center text-black font-bold text-xs md:text-lg shadow-lg hover:bg-kgm-amber/80 transition-all duration-300 z-30"
                style={{
                  left: isMobile
                    ? `calc(${adjustedX}% + 8px)`
                    : hotspot.position.x,
                  bottom: isMobile
                    ? `calc(${adjustedYFromBottom}% - 25px)`
                    : undefined,
                  top: isMobile ? undefined : hotspot.position.y,
                  transform: "translate(-50%, 50%)",
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

        {/* Second Interior Image - Black */}
        <div className="relative w-full h-screen flex items-center justify-center">
          <Image
            src="https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/REXTON/features/card2/20250124174010880_oSLDus.jpg"
            alt="Black Interior"
            fill
            className="object-cover"
            quality={90}
          />

          {/* Color Scheme Text Overlay */}
          <div className="absolute bottom-8 left-8 z-30">
            <h3 className="text-white text-4xl md:text-5xl font-bold mb-2">
              {language === "fr" ? "NOIR" : "BLACK"}
            </h3>
            <p className="text-white text-sm opacity-80">
              {language === "fr"
                ? "* Les photos et descriptions sont fournies à titre indicatif uniquement et peuvent différer du produit réel."
                : "* The photos and descriptions are for reference only and may differ from the actual product."}
            </p>
          </div>

          {/* TOP Button */}
          <div className="absolute bottom-8 right-8 z-30">
            <button className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center shadow-lg hover:bg-purple-700 transition-colors duration-300">
              <svg
                className="w-6 h-6 text-white"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z" />
              </svg>
            </button>
            <span className="text-white text-xs mt-1 block text-center">
              {language === "fr" ? "HAUT" : "TOP"}
            </span>
          </div>
        </div>

        {/* Third Interior Image - Classical Beige */}
        <div className="relative w-full h-screen flex items-center justify-center">
          <Image
            src="https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/REXTON/features/card3/20250124174025921_lCMXJ1.jpg"
            alt="Classical Beige Interior"
            fill
            className="object-cover"
            quality={90}
          />

          {/* Color Scheme Text Overlay */}
          <div className="absolute bottom-8 left-8 z-30">
            <h3 className="text-white text-4xl md:text-5xl font-bold mb-2">
              {language === "fr" ? "BEIGE CLASSIQUE" : "CLASSICAL BEIGE"}
            </h3>
            <p className="text-white text-sm opacity-80">
              {language === "fr"
                ? "* Les photos et descriptions sont fournies à titre indicatif uniquement et peuvent différer du produit réel."
                : "* The photos and descriptions are for reference only and may differ from the actual product."}
            </p>
          </div>

          {/* TOP Button */}
          <div className="absolute bottom-8 right-8 z-30">
            <button className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center shadow-lg hover:bg-purple-700 transition-colors duration-300">
              <svg
                className="w-6 h-6 text-white"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z" />
              </svg>
            </button>
            <span className="text-white text-xs mt-1 block text-center">
              {language === "fr" ? "HAUT" : "TOP"}
            </span>
          </div>
        </div>

        {/* Fifth Interior Image - Additional Interior Option */}
        <div className="relative w-full h-screen flex items-center justify-center">
          <Image
            src="https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/REXTON/features/card5/20250124174056007_gZfzjX.jpg"
            alt="Additional Interior Option"
            fill
            className="object-cover"
            quality={90}
          />

          {/* TOP Button */}
          <div className="absolute bottom-8 right-8 z-30">
            <button className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center shadow-lg hover:bg-purple-700 transition-colors duration-300">
              <svg
                className="w-6 h-6 text-white"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z" />
              </svg>
            </button>
            <span className="text-white text-xs mt-1 block text-center">
              {language === "fr" ? "HAUT" : "TOP"}
            </span>
          </div>
        </div>
      </section>

      {/* Section 6: Safety Features - Horizontal Card Slider */}
      <section className="relative py-20 bg-black overflow-hidden">
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
            {language === "fr"
              ? "SÉCURITÉ ET SÉRÉNITÉ SUR TOUTES LES ROUTES"
              : "SAFE AND SOUND ON EVERY ROAD"}
          </h1>
        </div>

        {/* Safety Features Slider */}
        <div className="relative max-w-7xl mx-auto px-4">
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
                            <button
                              onClick={() => {
                                if (feature.id === 6) {
                                  setIsESCCarouselOpen((prev) => !prev);
                                } else if (feature.id === 7) {
                                  setIsAdditionalSafetyCarouselOpen(
                                    (prev) => !prev
                                  );
                                }
                              }}
                              className="text-kgm-amber text-sm font-medium hover:text-kgm-amber/80 transition-colors duration-300"
                            >
                              {language === "fr" ? "Ouvrir" : "Open"}
                            </button>
                          )}
                        </div>

                        {/* Bottom Content - Description and buttons */}
                        <div className="flex flex-col gap-4 backdrop-blur-sm bg-black/10 rounded-lg p-3 md:p-4">
                          <p
                            className={`${
                              feature.description.includes(
                                "With a reinforced structural design"
                              ) ||
                              feature.description.includes(
                                "A total of 9 airbags"
                              )
                                ? "text-white"
                                : feature.textColor
                            } text-sm leading-relaxed drop-shadow-lg`}
                          >
                            {feature.description}
                          </p>

                          {/* Play Button for Videos */}
                          {feature.video && (
                            <button
                              onClick={() => toggleVideo(feature.video)}
                              className={`flex items-center space-x-2 ${feature.textColor} hover:text-kgm-amber transition-colors duration-300`}
                            >
                              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                                <svg
                                  className="w-4 h-4 ml-1"
                                  fill="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path d="M8 5v14l11-7z" />
                                </svg>
                              </div>
                              <span className="text-sm font-medium">
                                {language === "fr"
                                  ? "Regarder la Vidéo"
                                  : "Watch Video"}
                              </span>
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ESC Carousel - appears after ESC card */}
          {safetyFeatures.map((feature) => (
            <React.Fragment key={`carousel-${feature.id}`}>
              {feature.id === 6 && (
                <SousSlider
                  items={escCarouselData}
                  isOpen={isESCCarouselOpen}
                  onClose={() => setIsESCCarouselOpen(false)}
                  cardWidth="320px"
                  language={language}
                  itemsPerView={3}
                />
              )}
            </React.Fragment>
          ))}

          {/* Navigation Controls */}
          <div className="flex justify-center items-center mt-8 space-x-4">
            <button
              onClick={prevSafetyCard}
              disabled={currentSafetyCard === 0}
              className={`w-12 h-12 backdrop-blur-sm rounded-full flex items-center justify-center transition-colors duration-300 ${
                currentSafetyCard === 0
                  ? "bg-white/5 text-white/30 cursor-not-allowed"
                  : "bg-white/10 text-white hover:bg-white/20"
              }`}
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
              </svg>
            </button>

            <div className="flex space-x-2">
              {safetyFeatures.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSafetyCard(index)}
                  className={`w-3 h-3 rounded-full transition-colors duration-300 ${
                    currentSafetyCard === index ? "bg-kgm-amber" : "bg-white/30"
                  }`}
                />
              ))}
            </div>

            <button
              onClick={nextSafetyCard}
              disabled={currentSafetyCard >= safetyFeatures.length - 3}
              className={`w-12 h-12 backdrop-blur-sm rounded-full flex items-center justify-center transition-colors duration-300 ${
                currentSafetyCard >= safetyFeatures.length - 3
                  ? "bg-white/5 text-white/30 cursor-not-allowed"
                  : "bg-white/10 text-white hover:bg-white/20"
              }`}
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8.59 16.59L10 18l6-6-6-6-1.41 1.41L13.17 12z" />
              </svg>
            </button>
          </div>
        </div>
      </section>

      {/* Section 7: Convenience Features - Horizontal Card Slider */}
      <section className="relative py-20 bg-black overflow-hidden">
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
              ? "DES DEPLACEMENTS PLUS INTELLIGENTS, PLUS FACILES ET PLUS CONFORTABLES"
              : "FOR SMARTER, EASIER AND COMFORTABLE MOVES"}
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
                  currentConvenienceCard * (100 / 4)
                }%)`,
              }}
            >
              {convenienceFeatures.map((feature, index) => (
                <div
                  key={feature.id}
                  className="flex-shrink-0 px-4"
                  style={{ width: "25%" }}
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
                          <p className="text-white text-sm leading-relaxed mb-4 drop-shadow-lg text-right">
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

                    {/* Video Play/Stop Button - Only show when not playing video */}
                    {feature.video &&
                      !(playingVideo === feature.video && videoPlaying) && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <button
                            onClick={() => toggleVideo(feature.video!)}
                            className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-all duration-300 cursor-pointer z-20"
                          >
                            <svg
                              className="w-8 h-8 text-white"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path d="M8 5v14l11-7z" />
                            </svg>
                          </button>
                        </div>
                      )}

                    {/* Video Stop Button - Only show when video is playing */}
                    {feature.video &&
                      playingVideo === feature.video &&
                      videoPlaying && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <button
                            onClick={() => toggleVideo(feature.video!)}
                            className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-all duration-300 cursor-pointer z-20"
                          >
                            <svg
                              className="w-8 h-8 text-white"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                            </svg>
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
            onClick={prevConvenienceCard}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 w-12 h-12 bg-white rounded-full flex items-center justify-center text-black hover:bg-gray-100 transition-all duration-300 z-10 shadow-lg"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
            </svg>
          </button>

          <button
            onClick={nextConvenienceCard}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 w-12 h-12 bg-white rounded-full flex items-center justify-center text-black hover:bg-gray-100 transition-all duration-300 z-10 shadow-lg"
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
                onClick={() => setCurrentPerformanceCard(index)}
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
      <section className="relative py-20 bg-black overflow-hidden">
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
                  currentPerformanceCard * (100 / 6)
                }%)`,
              }}
            >
              {performanceFeatures.map((feature, index) => (
                <div
                  key={feature.id}
                  className="flex-shrink-0 px-4"
                  style={{ width: "calc(16.666% + 50px)" }}
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

                    {/* Toggle Button for NVH Control - only show if needed */}
                    {feature.hasOpenButton &&
                      !(playingVideo === feature.video && videoPlaying) && (
                        <div className="absolute bottom-4 right-4 z-10">
                          <button className="bg-kgm-amber text-black w-10 h-10 rounded-full font-semibold hover:bg-kgm-amber/80 transition-colors duration-300 flex items-center justify-center">
                            <span className="text-lg">+</span>
                          </button>
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
            onClick={prevConvenienceCard}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 w-12 h-12 bg-white rounded-full flex items-center justify-center text-black hover:bg-gray-100 transition-all duration-300 z-10 shadow-lg"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
            </svg>
          </button>

          <button
            onClick={nextConvenienceCard}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 w-12 h-12 bg-white rounded-full flex items-center justify-center text-black hover:bg-gray-100 transition-all duration-300 z-10 shadow-lg"
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
                onClick={() => setCurrentPerformanceCard(index)}
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

      {/* Section 10: Download Brochure */}
      <section className="relative py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex flex-col items-center justify-center">
            {/* Download Button */}
            <a
              href="/brochures/REXTON_EXE_.pdf"
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
        className="fixed bottom-8 right-8 z-30 w-12 h-12 bg-purple-600 backdrop-blur-sm rounded-full border border-white/30 flex flex-col items-center justify-center text-white hover:bg-purple-700 transition-all duration-300"
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

export default RextonPage;
