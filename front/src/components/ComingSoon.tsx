import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Mail, User, Check, Loader2, Phone, Building } from "lucide-react";
import { API_ENDPOINTS } from "@/utils/apiConfig";

const ComingSoon = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [isExpired, setIsExpired] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Form state
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    telephone: "",
    email: "",
    ville: "",
  });
  const [formErrors, setFormErrors] = useState({
    nom: "",
    prenom: "",
    telephone: "",
    email: "",
    ville: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Target date: December 2, 2025 at 12:15
  const targetDate = new Date("2025-12-02T12:15:00").getTime();

  const handleCountdownComplete = useCallback(() => {
    // Show success animation
    setShowSuccess(true);

    // After success animation, start transition
    setTimeout(() => {
      setIsTransitioning(true);

      // Store in localStorage and cookie that countdown is complete
      localStorage.setItem("comingSoonExpired", "true");
      document.cookie = "comingSoonExpired=true; path=/; max-age=31536000"; // 1 year

      // After transition animation, reload to show normal site
      setTimeout(() => {
        window.location.href = "/";
      }, 1500);
    }, 2000);
  }, []);

  useEffect(() => {
    // Ensure video plays
    const video = videoRef.current;
    if (video) {
      video.play().catch((error) => {
        console.error("Error playing video:", error);
      });
    }

    // Check if already expired on mount
    const now = new Date().getTime();
    if (now >= targetDate) {
      setIsExpired(true);
      handleCountdownComplete();
      return;
    }

    // Check if cookie says expired
    const cookieExpired = document.cookie.includes("comingSoonExpired=true");
    if (cookieExpired) {
      setIsExpired(true);
      handleCountdownComplete();
      return;
    }

    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference <= 0) {
        setIsExpired(true);
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      }

      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor(
          (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        ),
        minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((difference % (1000 * 60)) / 1000),
      };
    };

    // Calculate immediately
    setTimeLeft(calculateTimeLeft());

    // Update every second
    const timer = setInterval(() => {
      const newTimeLeft = calculateTimeLeft();
      setTimeLeft(newTimeLeft);

      if (
        newTimeLeft.days === 0 &&
        newTimeLeft.hours === 0 &&
        newTimeLeft.minutes === 0 &&
        newTimeLeft.seconds === 0 &&
        !isExpired
      ) {
        setIsExpired(true);
        handleCountdownComplete();
      }
    }, 1000);

    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [handleCountdownComplete]);

  // Form validation
  const validateForm = () => {
    const errors = { nom: "", prenom: "", telephone: "", email: "", ville: "" };
    let isValid = true;

    if (!formData.nom.trim()) {
      errors.nom = "Nom requis";
      isValid = false;
    } else if (formData.nom.trim().length < 2) {
      errors.nom = "Le nom doit contenir au moins 2 caractères";
      isValid = false;
    }

    if (!formData.prenom.trim()) {
      errors.prenom = "Prénom requis";
      isValid = false;
    } else if (formData.prenom.trim().length < 2) {
      errors.prenom = "Le prénom doit contenir au moins 2 caractères";
      isValid = false;
    }

    const phoneRegex = /^[+]?[\d\s\-()]{6,20}$/;
    if (!formData.telephone.trim()) {
      errors.telephone = "Téléphone requis";
      isValid = false;
    } else if (!phoneRegex.test(formData.telephone)) {
      errors.telephone = "Veuillez saisir un numéro valide";
      isValid = false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      errors.email = "Adresse email requise";
      isValid = false;
    } else if (!emailRegex.test(formData.email)) {
      errors.email = "Veuillez saisir une adresse email valide";
      isValid = false;
    }

    if (!formData.ville.trim()) {
      errors.ville = "Ville requise";
      isValid = false;
    } else if (formData.ville.trim().length < 2) {
      errors.ville = "La ville doit contenir au moins 2 caractères";
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (formErrors[name as keyof typeof formErrors]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(API_ENDPOINTS.COMING_SOON, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(formData),
      });

      // Check if response is ok before parsing JSON
      let data;
      try {
        data = await response.json();
      } catch (jsonError) {
        console.error("Failed to parse JSON response:", jsonError);
        setFormErrors({
          nom: "",
          prenom: "",
          telephone: "",
          email: "Erreur serveur. Veuillez réessayer plus tard.",
          ville: "",
        });
        return;
      }

      if (!response.ok) {
        // Handle validation errors
        if (data.errors) {
          const apiErrors: any = {};
          Object.keys(data.errors).forEach((key) => {
            apiErrors[key] = Array.isArray(data.errors[key])
              ? data.errors[key][0]
              : data.errors[key];
          });
          setFormErrors((prev) => ({ ...prev, ...apiErrors }));
        } else {
          setFormErrors({
            nom: "",
            prenom: "",
            telephone: "",
            email:
              data.message || "Une erreur est survenue. Veuillez réessayer.",
            ville: "",
          });
        }
        return;
      }

      // Success
      setSubmitSuccess(true);
      setFormData({ nom: "", prenom: "", telephone: "", email: "", ville: "" });

      // Reset success message after 5 seconds
      setTimeout(() => {
        setSubmitSuccess(false);
      }, 5000);
    } catch (error: any) {
      console.error("Form submission error:", error);
      console.error("API URL:", API_ENDPOINTS.COMING_SOON);
      
      // More specific error messages
      let errorMessage = "Erreur de connexion. Veuillez vérifier votre connexion et réessayer.";
      
      if (error instanceof TypeError && error.message.includes("fetch")) {
        errorMessage = "Impossible de se connecter au serveur. Vérifiez votre connexion internet.";
      } else if (error.message) {
        errorMessage = `Erreur: ${error.message}`;
      }
      
      setFormErrors({
        nom: "",
        prenom: "",
        telephone: "",
        email: errorMessage,
        ville: "",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const TimeUnit = ({
    value,
    label,
    animate = false,
  }: {
    value: number;
    label: string;
    animate?: boolean;
  }) => {
    return (
      <div className="flex flex-col items-center justify-center">
        <div className="relative bg-gray-900/80 backdrop-blur-sm rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-6 lg:p-8 min-w-[60px] sm:min-w-[80px] md:min-w-[100px] lg:min-w-[120px] border border-white/10 shadow-2xl">
          {animate ? (
            <motion.span
              key={value}
              initial={{ y: 5 }}
              animate={{ y: 0 }}
              transition={{ duration: 0.1, ease: "easeOut" }}
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white text-center block"
            >
              {String(value).padStart(2, "0")}
            </motion.span>
          ) : (
            <span className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white text-center block">
              {String(value).padStart(2, "0")}
            </span>
          )}
        </div>
        <p className="mt-2 sm:mt-3 text-[10px] sm:text-xs md:text-sm font-semibold text-white/70 uppercase tracking-wider">
          {label}
        </p>
      </div>
    );
  };

  return (
    <AnimatePresence mode="wait">
      {isTransitioning ? (
        <motion.div
          key="transition"
          className="fixed inset-0 z-[9999] bg-[#0b0d16] flex items-center justify-center"
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 1.5 }}
        />
      ) : (
        <motion.section
          key="coming-soon"
          className="relative w-full min-h-[calc(100vh-5rem)]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Video Background */}
          <div className="absolute inset-0 z-0">
            <video
              ref={videoRef}
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              className="w-full h-full object-cover"
            >
              <source
                src={process.env.NEXT_PUBLIC_COMING_SOON_VIDEO_URL || "/media/coming-soon-bg-new.mp4"} 
                type="video/mp4"
              />
              Your browser does not support the video tag.
            </video>
            {/* Dark overlay for better text readability */}
            <div className="absolute inset-0 bg-black/50" />
          </div>

          {/* Main content */}
          <div className="relative z-10 min-h-[calc(100vh-5rem)] flex flex-col items-center justify-start px-3 sm:px-4 md:px-6 pt-24 sm:pt-32 md:pt-40 lg:pt-48 pb-20 sm:pb-24 lg:pb-32 overflow-y-auto">
            <AnimatePresence mode="wait">
              {showSuccess ? (
                <motion.div
                  key="success"
                  className="flex flex-col items-center justify-center text-center px-4"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 1.5, opacity: 0 }}
                  transition={{ duration: 0.8, type: "spring" }}
                >
                  {/* Success checkmark */}
                  <motion.div
                    className="relative mb-6 sm:mb-8"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  >
                    <motion.div
                      className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 rounded-full bg-gradient-to-br from-[#c4a96c] to-[#b49a5c] flex items-center justify-center shadow-2xl"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 0.8 }}
                    >
                      <motion.svg
                        className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 text-white"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="4"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 0.5, delay: 0.5 }}
                      >
                        <motion.path
                          d="M5 13l4 4L19 7"
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                          transition={{ duration: 0.5, delay: 0.5 }}
                        />
                      </motion.svg>
                    </motion.div>
                  </motion.div>

                  <motion.h2
                    className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 sm:mb-4"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.7 }}
                  >
                    We're Live!
                  </motion.h2>
                  <motion.p
                    className="text-base sm:text-lg md:text-xl text-white/80"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.9 }}
                  >
                    Welcome to KGM Mobility
                  </motion.p>
                </motion.div>
              ) : (
                <motion.div
                  key="countdown"
                  className="flex flex-col items-center justify-center text-center max-w-4xl w-full px-2 sm:px-4"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                >
                  {/* Logo KGM */}
                  <motion.div
                    className="mb-4 sm:mb-6 md:mb-8"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.6, type: "spring", delay: 0.1 }}
                  >
                    {/* Logo removed but space preserved */}
                  </motion.div>

                  {/* Subtitle - Coming Soon */}
                  <motion.h2
                    className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-semibold text-white mb-4 sm:mb-6 md:mb-8"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    {/* Text removed but space preserved */}
                  </motion.h2>

                  {/* Descriptive Text */}
                  <motion.p
                    className="text-sm sm:text-base md:text-lg lg:text-xl text-white/90 mb-6 sm:mb-8 md:mb-10 lg:mb-12 max-w-2xl leading-relaxed px-2"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    We are preparing something extraordinary. Stay tuned to enjoy with confidence a new world.
                  </motion.p>

                  {/* Countdown timer */}
                  <motion.div
                    className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 md:gap-4 lg:gap-6 mb-6 sm:mb-8 md:mb-10 lg:mb-12 w-full px-2"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <TimeUnit
                      value={timeLeft.days}
                      label="Days"
                      animate={false}
                    />

                    {/* Separator dots */}
                    <div className="flex flex-col gap-1 hidden sm:flex">
                      <div className="w-1 h-1 bg-[#2D294E] rounded-full" />
                      <div className="w-1 h-1 bg-[#2D294E] rounded-full" />
                    </div>

                    <TimeUnit
                      value={timeLeft.hours}
                      label="Hours"
                      animate={false}
                    />

                    {/* Separator dots */}
                    <div className="flex flex-col gap-1 hidden sm:flex">
                      <div className="w-1 h-1 bg-[#2D294E] rounded-full" />
                      <div className="w-1 h-1 bg-[#2D294E] rounded-full" />
                    </div>

                    <TimeUnit
                      value={timeLeft.minutes}
                      label="Minutes"
                      animate={false}
                    />

                    {/* Separator dots */}
                    <div className="flex flex-col gap-1 hidden sm:flex">
                      <div className="w-1 h-1 bg-[#2D294E] rounded-full" />
                      <div className="w-1 h-1 bg-[#2D294E] rounded-full" />
                    </div>

                    <TimeUnit
                      value={timeLeft.seconds}
                      label="Seconds"
                      animate={true}
                    />
                  </motion.div>

                  {/* Newsletter Signup Form */}
                  <motion.div
                    className="w-full max-w-2xl mx-auto mb-6 sm:mb-8 md:mb-10"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 sm:p-8 border border-white/20 shadow-lg">
                      <motion.h3
                        className="text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4 text-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                      >
                        I want to be among the first to join this wonderful
                        experience.
                      </motion.h3>
                      <motion.p
                        className="text-sm text-white/80 mb-6 text-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.65 }}
                      >
                        Leave us your contact details and we will get in touch
                        with you as soon as we open.
                      </motion.p>

                      <AnimatePresence mode="wait">
                        {submitSuccess ? (
                          <motion.div
                            key="success"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="text-center py-4"
                          >
                            <motion.div
                              className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#2D294E] flex items-center justify-center"
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ type: "spring", stiffness: 200 }}
                            >
                              <Check className="w-8 h-8 text-white" />
                            </motion.div>
                            <p className="text-white font-semibold text-lg mb-1">
                              Merci !
                            </p>
                            <p className="text-white/80 text-sm">
                              Nous vous tiendrons informé du lancement.
                            </p>
                          </motion.div>
                        ) : (
                          <motion.form
                            key="form"
                            onSubmit={handleSubmit}
                            className="space-y-4"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                          >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {/* Nom */}
                              <div>
                                <div className="relative">
                                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <User className="h-5 w-5 text-white/60" />
                                  </div>
                                  <input
                                    type="text"
                                    name="nom"
                                    value={formData.nom}
                                    onChange={handleInputChange}
                                    placeholder="First name"
                                    className={`w-full pl-12 pr-4 py-3.5 bg-white/10 backdrop-blur-sm border rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#2D294E] focus:border-transparent transition-all ${
                                      formErrors.nom
                                        ? "border-red-400/50 focus:ring-red-400"
                                        : "border-white/20"
                                    }`}
                                  />
                                </div>
                                {formErrors.nom && (
                                  <motion.p
                                    initial={{ opacity: 0, y: -5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="mt-1.5 text-xs text-red-300 pl-1"
                                  >
                                    {formErrors.nom}
                                  </motion.p>
                                )}
                              </div>

                              {/* Prénom */}
                              <div>
                                <div className="relative">
                                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <User className="h-5 w-5 text-white/60" />
                                  </div>
                                  <input
                                    type="text"
                                    name="prenom"
                                    value={formData.prenom}
                                    onChange={handleInputChange}
                                    placeholder="Last name"
                                    className={`w-full pl-12 pr-4 py-3.5 bg-white/10 backdrop-blur-sm border rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#2D294E] focus:border-transparent transition-all ${
                                      formErrors.prenom
                                        ? "border-red-400/50 focus:ring-red-400"
                                        : "border-white/20"
                                    }`}
                                  />
                                </div>
                                {formErrors.prenom && (
                                  <motion.p
                                    initial={{ opacity: 0, y: -5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="mt-1.5 text-xs text-red-300 pl-1"
                                  >
                                    {formErrors.prenom}
                                  </motion.p>
                                )}
                              </div>

                              {/* Téléphone */}
                              <div>
                                <div className="relative">
                                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Phone className="h-5 w-5 text-white/60" />
                                  </div>
                                  <input
                                    type="tel"
                                    name="telephone"
                                    value={formData.telephone}
                                    onChange={handleInputChange}
                                    placeholder="Phone number"
                                    className={`w-full pl-12 pr-4 py-3.5 bg-white/10 backdrop-blur-sm border rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#2D294E] focus:border-transparent transition-all ${
                                      formErrors.telephone
                                        ? "border-red-400/50 focus:ring-red-400"
                                        : "border-white/20"
                                    }`}
                                  />
                                </div>
                                {formErrors.telephone && (
                                  <motion.p
                                    initial={{ opacity: 0, y: -5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="mt-1.5 text-xs text-red-300 pl-1"
                                  >
                                    {formErrors.telephone}
                                  </motion.p>
                                )}
                              </div>

                              {/* Email */}
                              <div>
                                <div className="relative">
                                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-white/60" />
                                  </div>
                                  <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    placeholder="Email"
                                    className={`w-full pl-12 pr-4 py-3.5 bg-white/10 backdrop-blur-sm border rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#2D294E] focus:border-transparent transition-all ${
                                      formErrors.email
                                        ? "border-red-400/50 focus:ring-red-400"
                                        : "border-white/20"
                                    }`}
                                  />
                                </div>
                                {formErrors.email && (
                                  <motion.p
                                    initial={{ opacity: 0, y: -5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="mt-1.5 text-xs text-red-300 pl-1"
                                  >
                                    {formErrors.email}
                                  </motion.p>
                                )}
                              </div>

                              {/* Ville */}
                              <div className="md:col-span-2">
                                <div className="relative">
                                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Building className="h-5 w-5 text-white/60" />
                                  </div>
                                  <input
                                    type="text"
                                    name="ville"
                                    value={formData.ville}
                                    onChange={handleInputChange}
                                    placeholder="City"
                                    className={`w-full pl-12 pr-4 py-3.5 bg-white/10 backdrop-blur-sm border rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#2D294E] focus:border-transparent transition-all ${
                                      formErrors.ville
                                        ? "border-red-400/50 focus:ring-red-400"
                                        : "border-white/20"
                                    }`}
                                  />
                                </div>
                                {formErrors.ville && (
                                  <motion.p
                                    initial={{ opacity: 0, y: -5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="mt-1.5 text-xs text-red-300 pl-1"
                                  >
                                    {formErrors.ville}
                                  </motion.p>
                                )}
                              </div>
                            </div>

                            {/* Submit Button */}
                            <motion.button
                              type="submit"
                              disabled={isSubmitting}
                              className="w-full py-3.5 px-6 bg-[#2D294E] text-white font-semibold rounded-lg hover:bg-[#3a3458] focus:outline-none focus:ring-2 focus:ring-[#2D294E] focus:ring-offset-2 focus:ring-offset-transparent transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-md"
                              whileHover={{ scale: isSubmitting ? 1 : 1.01 }}
                              whileTap={{ scale: isSubmitting ? 1 : 0.99 }}
                            >
                              {isSubmitting ? (
                                <>
                                  <Loader2 className="w-5 h-5 animate-spin" />
                                  <span>Envoi...</span>
                                </>
                              ) : (
                                <>
                                  <Mail className="w-5 h-5" />
                                  <span>Notify me</span>
                                </>
                              )}
                            </motion.button>
                          </motion.form>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.div>

                  {/* Launch scheduled text */}
                  <motion.p
                    className="text-xs sm:text-sm md:text-base text-white/70 mb-0"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7 }}
                  >
                    Launch scheduled for 02/12/2025
                  </motion.p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.section>
      )}
    </AnimatePresence>
  );
};

export default ComingSoon;


