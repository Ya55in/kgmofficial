'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';

interface Milestone {
  date: string;
  description: string;
}

interface PeriodData {
  [key: string]: Milestone[];
}

const corporateData: PeriodData = {
  '1954-1986': [
    { date: '1954. 01', description: 'Established Ha Dong-Hwan Motor Workshop' },
    { date: '1962. 12', description: 'Launched Ha Dong-Hwan Motors Co., Ltd.' },
    { date: '1963. 07', description: 'Merged Dongbang Motors Co., Ltd.' },
    { date: '1967. 05', description: 'Cooperative agreement with Shinjin Motors Co., Ltd.' },
    { date: '1967. 08', description: 'First exported large buses to Brunei in Korea' },
    { date: '1969. 11', description: 'Produced the first civilian-purpose four-wheel drive vehicles in South Korea' },
    { date: '1970. 11', description: 'Produced the wheel disc' },
    { date: '1974. 04', description: 'Co-established Shinjin Jeep Motor Co., Ltd. with AMC' },
    { date: '1974. 10', description: 'Developed both hard top and soft top jeeps' },
    { date: '1977. 02', description: 'Company name changed to Dong-A Motor Co., Ltd.' },
    { date: '1977. 12', description: 'Completed Bupyeong Plant construction' },
    { date: '1979. 03', description: 'Company name changed to Shinjin Motors Co., Ltd.' },
    { date: '1979. 12', description: 'Completed Pyeongtaek Plant construction' },
    { date: '1981. 03', description: 'Company name changed to Gohwa Motor Inc.' },
    { date: '1983. 03', description: 'Registered the Korando trademark' },
    { date: '1984. 04', description: 'First exported high-speed buses to Libya, Sudan in Korea' },
    { date: '1984. 12', description: 'Merged Dong-A Motor Co., Ltd.' },
    { date: '1985. 08', description: 'First developed house trailer in Korea' },
    { date: '1986. 08', description: 'Exported Korando to Japan' },
    { date: '1986. 11', description: 'Acquired by Ssangyong group' }
  ],
  '1987-1997': [
    { date: '1987. 06', description: 'Acquired \'PANTHER CAR Co, UK\'' },
    { date: '1988. 03', description: 'Company name changed to SsangYong Motor Co.' },
    { date: '1988. 03', description: 'Exported Korando to Northern Europe' },
    { date: '1990. 02', description: 'Korando won 1st place in the 10th Cyprus Rally' },
    { date: '1991. 02', description: 'Technology alliance with Mercedes-Benz' },
    { date: '1991. 06', description: 'Exported Korando and Korando Family to Vietnam in CKD type' },
    { date: '1992. 01', description: 'Launched the \'Three Harmonized Circle\' emblem' },
    { date: '1992. 06', description: 'Completed the R&D Center construction' },
    { date: '1993. 02', description: 'Agreement of technical alliance with Mercedes Benz for developing passenger cars' },
    { date: '1994. 04', description: 'Completed the After-Sales Service Technical Center construction in Daejeon' },
    { date: '1994. 06', description: 'Completed the Engine Plant construction in Changwon' },
    { date: '1994. 10', description: 'Musso won 1st place in the Pharaohs Rally' },
    { date: '1994. 10', description: 'Exported Musso to Europe' },
    { date: '1994. 10', description: 'Exported Transstar' },
    { date: '1995. 06', description: 'Completed the Parts Logistics Center in Cheonan construction' },
    { date: '1996. 09', description: 'First launched the brand exhibition hall in Korea' }
  ],
  '1998-2022': [
    { date: '1998. 01', description: 'Acquired by Daewoo Group' },
    { date: '1999. 09', description: 'Korando won 1st place in the Pampas rally' },
    { date: '1999. 11', description: 'Korando won 1st place in the Mexico BAJA-1000 rally' },
    { date: '2000. 04', description: 'Independence from Daewoo Group' },
    { date: '2001. 04', description: 'Changwon Engine Plant recorded a half-million-engine production' },
    { date: '2003. 01', description: 'Signed a contract for CKD business in China' },
    { date: '2004. 03', description: 'Musso Sports finished crossing the America Continent' },
    { date: '2004. 09', description: 'Completed 2nd engine shop construction in Changwon Plant' },
    { date: '2004. 10', description: 'Acquired by SAIC Motor Corp., Ltd.' },
    { date: '2006. 12', description: 'Established SsangYong European Parts Center in the Netherlands' },
    { date: '2009. 01', description: 'Kyron completed the Dakar Rally' },
    { date: '2009. 04', description: 'C200 presented with a best concept car in Seoul motor show 2009' },
    { date: '2009. 06', description: 'Chairman won a Golden Award for Ergonomic Design' },
    { date: '2011. 03', description: 'Acquired by Mahindra & Mahindra' },
    { date: '2012. 01', description: 'Korando C won 1st place in the ScanCovery Trial' },
    { date: '2018. 04', description: 'Tivoli completed the Dakar Rally' },
    { date: '2018. 12', description: 'Established Australian corporation' },
    { date: '2020. 04', description: 'Launched INFOCONN, connected car service' },
    { date: '2022. 11', description: 'Acquired by KG Group' }
  ],
  '2023-NOW': [
    { date: '2023. 03', description: 'Renamed the company as KG Mobility' },
    { date: '2023. 04', description: 'Established KG S&C, the specialized vehicle corporation' },
    { date: '2023. 11', description: 'Launched KG Mobility Corporation, KGM brand' },
    { date: '2024. 05', description: 'Launched Certified Pre-Owned' },
    { date: '2024. 11', description: 'Launched KGM BI / Slogan (Enjoy with Confidence)' },
    { date: '2025. 06', description: 'Launched KGM FORWARD' },
    { date: '2025. 07', description: 'Launched KGM MOBILING' },
    { date: '2025. 08', description: '40th Anniversary Ceremony of KG Group' }
  ]
};

const periods = ['1954-1986', '1987-1997', '1998-2022', '2023-NOW'];

export default function CorporateHistoryHero() {
  const { language } = useLanguage();
  const [activePeriod, setActivePeriod] = useState('1954-1986');
  const [isLoading, setIsLoading] = useState(true);
  const [activeYear, setActiveYear] = useState('1954');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isDropdownOpen) {
        const target = event.target as HTMLElement;
        if (!target.closest('.dropdown-container')) {
          setIsDropdownOpen(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  const currentMilestones = corporateData[activePeriod] || [];

  // Function to translate milestone descriptions
  const translateMilestoneDescription = (description: string): string => {
    if (language === 'fr') {
      // French translations for key milestones
      const frenchTranslations: { [key: string]: string } = {
        "Established Ha Dong-Hwan Motor Workshop": "Établissement de l'Atelier Motor Ha Dong-Hwan",
        "Launched Ha Dong-Hwan Motors Co., Ltd.": "Lancement de Ha Dong-Hwan Motors Co., Ltd.",
        "Merged Dongbang Motors Co., Ltd.": "Fusion avec Dongbang Motors Co., Ltd.",
        "Cooperative agreement with Shinjin Motors Co., Ltd.": "Accord de coopération avec Shinjin Motors Co., Ltd.",
        "First exported large buses to Brunei in Korea": "Première exportation de gros bus vers Brunei en Corée",
        "Produced the first civilian-purpose four-wheel drive vehicles in South Korea": "Production des premiers véhicules tout-terrain civils en Corée du Sud",
        "Produced the wheel disc": "Production de la jante",
        "Co-established Shinjin Jeep Motor Co., Ltd. with AMC": "Co-établissement de Shinjin Jeep Motor Co., Ltd. avec AMC",
        "Developed both hard top and soft top jeeps": "Développement de jeeps hard top et soft top",
        "Company name changed to Dong-A Motor Co., Ltd.": "Nom de l'entreprise changé en Dong-A Motor Co., Ltd.",
        "Completed Bupyeong Plant construction": "Construction de l'usine de Bupyeong terminée",
        "Company name changed to Shinjin Motors Co., Ltd.": "Nom de l'entreprise changé en Shinjin Motors Co., Ltd.",
        "Completed Pyeongtaek Plant construction": "Construction de l'usine de Pyeongtaek terminée",
        "Company name changed to Gohwa Motor Inc.": "Nom de l'entreprise changé en Gohwa Motor Inc.",
        "Registered the Korando trademark": "Enregistrement de la marque Korando",
        "First exported high-speed buses to Libya, Sudan in Korea": "Première exportation de bus haute vitesse vers la Libye, le Soudan en Corée",
        "Merged Dong-A Motor Co., Ltd.": "Fusion avec Dong-A Motor Co., Ltd.",
        "First developed house trailer in Korea": "Premier développement de remorque de maison en Corée",
        "Exported Korando to Japan": "Exportation de Korando vers le Japon",
        "Acquired by Ssangyong group": "Acquisition par le groupe Ssangyong"
      };
      return frenchTranslations[description] || description;
    }
    return description;
  };

  // Get unique years from milestones for timeline
  const getUniqueYears = () => {
    const years = currentMilestones.map(milestone => milestone.date.split('.')[0]);
    return Array.from(new Set(years)).sort();
  };

  const uniqueYears = getUniqueYears();

  return (
    <div className="relative bg-black min-h-screen">
      {/* Background Video */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
        >
          <source src="https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/HERITAGE%201954/brand-heritage-bg.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/60"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen">
        {/* Header Section */}
        <div className="w-full bg-black/95 backdrop-blur-sm py-8">
          <div className="container mx-auto px-4">
            <div className="text-left mb-8">
              <h1 className="text-lg md:text-2xl text-white mb-4 md:mb-6 font-serif">
                {language === 'fr' ? "Un esprit maître du premier titre de Corée" : "A master spirit of Korea's first title"}
              </h1>
              
              {/* Period Selector - 90% width with left-aligned text */}
              <div className="w-full md:w-[90%]">
                <div className="relative dropdown-container">
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="w-full bg-black text-white px-6 py-4 rounded-lg focus:outline-none cursor-pointer text-left font-serif font-bold hover:bg-gray-800 transition-colors duration-300 flex items-center justify-between text-3xl md:text-5xl"
                    style={{
                      fontFamily: 'serif',
                      fontWeight: 'bold',
                      color: '#c4a96c',
                      border: 'none'
                    }}
                  >
                    <span>{activePeriod}</span>
                    <motion.svg 
                      className="w-6 h-6 text-white" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                      animate={{ rotate: isDropdownOpen ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </motion.svg>
                  </button>

                  {/* Custom Dropdown Options */}
                  {isDropdownOpen && (
                    <motion.div
                      className="relative top-full left-0 w-full bg-black border border-gray-600 rounded-lg shadow-2xl z-50 mt-2"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                    >
                      {periods.map((period) => (
                        <button
                          key={period}
                          onClick={() => {
                            setActivePeriod(period);
                            setIsDropdownOpen(false);
                          }}
                          className={`w-full px-4 md:px-6 py-2 md:py-3 text-left font-serif font-bold hover:bg-gray-800 transition-all duration-300 text-xl md:text-3xl ${
                            activePeriod === period ? 'bg-gray-800' : ''
                          }`}
                            style={{
                              fontFamily: 'serif',
                              fontWeight: 'bold',
                              color: '#c5a96c'
                            }}
                        >
                          {language === 'fr' ? 
                            (period === '1954-1986' ? "1954-1986" :
                             period === '1987-1997' ? "1987-1997" :
                             period === '1998-2022' ? "1998-2022" :
                             "2023-MAINTENANT") :
                            period
                          }
                        </button>
                      ))}
                    </motion.div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="w-full -z-1 min-h-screen bg-black/80 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row gap-4 md:gap-8">
              {/* Left Side - Timeline (40% width) - Hidden on mobile */}
              <div className="hidden md:block w-full md:w-2/5">
                <div className="min-h-screen">
                  {isLoading ? (
                    <div className="flex items-center justify-center h-full">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
                    </div>
                  ) : (
                    <div className="space-y-4 md:space-y-6 p-3 md:p-6">
                      {/* Heritage Title Image */}
                      <div className="mb-8">
                        <img
                          src="https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/HERITAGE%201954/producthistory/img-heritage-product-title.png"
                          alt="Heritage 1954"
                          className="w-full h-auto"
                          onError={(e) => {
                            e.currentTarget.src = "https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/HERITAGE%201954/icon-heritage-logo.svg";
                          }}
                        />
                      </div>

                      {/* Timeline with Dotted Line */}
                      <div className="relative">
                        {/* Dotted Timeline Line */}
                        <div 
                          className="absolute left-8 top-0 bottom-0 w-0.5"
                          style={{
                            background: 'repeating-linear-gradient(to bottom, #666 0px, #666 4px, transparent 4px, transparent 8px)'
                          }}
                        ></div>
                        
                        {/* Timeline Items */}
                        <div className="space-y-4 md:space-y-8">
                          {currentMilestones.map((milestone, index) => {
                            const year = milestone.date.split('.')[0];
                            const isActive = activeYear === year;
                            
                            return (
                              <motion.div
                                key={`${milestone.date}-${index}`}
                                className="relative flex items-start gap-6 cursor-pointer"
                                initial={{ opacity: 0, x: -30 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                onClick={() => setActiveYear(year)}
                              >
                                {/* Timeline Dot */}
                                <motion.div 
                                  className={`absolute w-3 h-3 rounded-full border-2 transition-all duration-500 ${
                                    isActive ? 'border-kgm-amber bg-transparent' : 'border-transparent bg-transparent'
                                  }`}
                                  style={{ marginLeft: '-20px' }}
                                  initial={{ scale: 0, opacity: 0 }}
                                  animate={{ 
                                    scale: isActive ? 1 : 0,
                                    opacity: isActive ? 1 : 0
                                  }}
                                  transition={{ duration: 0.5 }}
                                />
                                
                                {/* Content */}
                                <div className="ml-8 md:ml-12 flex-1">
                                  <div className={`p-3 md:p-4 rounded-lg transition-all duration-300 ${
                                    isActive ? 'bg-white/10 backdrop-blur-sm border border-kgm-amber/30' : 'bg-white/5 backdrop-blur-sm border border-white/10'
                                  }`}>
                                    <p className={`font-semibold mb-1 md:mb-2 text-left text-sm md:text-base ${
                                      isActive ? 'text-kgm-amber' : 'text-gray-300'
                                    }`}>
                                      {milestone.date}
                                    </p>
                                    <p className={`text-xs md:text-sm leading-relaxed text-left ${
                                      isActive ? 'text-white' : 'text-gray-400'
                                    }`}>
                                      {translateMilestoneDescription(milestone.description)}
                                    </p>
                                  </div>
                                </div>
                              </motion.div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Navigation Button */}
                      <div className="mt-8">
                        <button className="w-full bg-transparent border border-white/30 text-white px-6 py-3 rounded-lg hover:bg-white/10 transition-all duration-300 flex items-center justify-center gap-2">
                          <span>Back to 1987-1997</span>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Side - Historical Images (60% width) - Full width on mobile */}
              <div className="w-full md:w-3/5">
                <div className="sticky top-8">
                  {/* Historical Images */}
                  <div className="mb-8">
                    <div className="w-full relative overflow-hidden rounded-lg">
                      <img
                        src={`https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/HERITAGE%201954/CorporateHistory/${activePeriod}.png`}
                        alt={`${activePeriod} Historical Image`}
                        className="w-full h-auto object-contain transition-transform duration-300 hover:scale-105"
                        onError={(e) => {
                          console.log('Image failed to load:', e.currentTarget.src);
                          const parent = e.currentTarget.parentElement;
                          if (parent) {
                            parent.innerHTML = `
                              <div class="w-full h-96 flex items-center justify-center bg-gray-800 text-white text-center p-4">
                                <div>
                                  <div class="text-4xl mb-2">🏭</div>
                                  <div class="text-sm">${activePeriod}</div>
                                </div>
                              </div>
                            `;
                          }
                        }}
                        onLoad={() => {
                          console.log('Image loaded successfully:', `https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/HERITAGE%201954/CorporateHistory/${activePeriod}.png`);
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
