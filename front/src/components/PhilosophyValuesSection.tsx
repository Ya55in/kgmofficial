'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { useTranslation } from '@/hooks/useTranslation';

const PhilosophyValuesSection = () => {
  const { t, language } = useTranslation();
  
  // Temporary hardcoded French translations for testing
  const getFrenchText = (key: string) => {
    if (language === 'fr') {
      switch (key) {
        case 'philosophy.values.slogan': return 'Nous pensons grand.';
        case 'philosophy.values.brandSlogan': return 'thinKGreat';
        case 'philosophy.values.value1.title': return 'KG existe pour devenir une entreprise respectée qui rend tout le monde fier.';
        case 'philosophy.values.value1.description': return 'Notre objectif est de gagner le respect en fournissant une nouvelle valeur qui contribue au progrès humain et sociétal, et d\'être une organisation dont nos membres peuvent être fiers.';
        case 'philosophy.values.value2.title': return 'KG maintient un équilibre entre durabilité et croissance.';
        case 'philosophy.values.value2.description': return 'Nous réalisons notre vision avec une persistance significative et une croissance éthique et positive.';
        case 'philosophy.values.value3.title': return 'KG poursuit l\'innovation pour créer des valeurs uniques et différenciées.';
        case 'philosophy.values.value3.description': return 'Nous nous défions constamment avec de nouvelles méthodes que nous n\'avons jamais essayées auparavant, et cherchons la nouveauté pour créer des choses que personne n\'a jamais imaginées.';
        case 'philosophy.values.value4.title': return 'KG a confiance avec courtoisie basée sur un sens des responsabilités.';
        case 'philosophy.values.value4.description': return 'Nous comprenons clairement nos responsabilités et livrons des résultats qui reflètent la valeur que nous apportons.';
        default: return t(key);
      }
    }
    return t(key);
  };
  
  const values = [
    {
      icon: "https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/philosophy/section1/icon-cm-managt-01.svg",
      title: getFrenchText('philosophy.values.value1.title') || "KG exists to become a respected company that makes everyone proud.",
      description: getFrenchText('philosophy.values.value1.description') || "Our purpose is to earn respect by providing new value that contributes to human and societal advancement, and to be an organization that our members can be proud of."
    },
    {
      icon: "https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/philosophy/section1/icon-cm-managt-02.svg",
      title: getFrenchText('philosophy.values.value2.title') || "KG maintains a balance between sustainability and growth.",
      description: getFrenchText('philosophy.values.value2.description') || "We achieve our vision with meaningful persistence and ethical, positive growth."
    },
    {
      icon: "https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/philosophy/section1/icon-cm-managt-03.svg",
      title: getFrenchText('philosophy.values.value3.title') || "KG pursues innovation to create unique and differentiated values.",
      description: getFrenchText('philosophy.values.value3.description') || "We consistently challenge ourselves with new methods that we have never tried before, and seek novelty to create things that no one has ever thought of."
    },
    {
      icon: "https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/philosophy/section1/icon-cm-managt-04.svg",
      title: getFrenchText('philosophy.values.value4.title') || "KG has confidence with courtesy based on a sense of responsibility.",
      description: getFrenchText('philosophy.values.value4.description') || "We clearly understand our responsibilities and deliver results that reflect the value we provide."
    }
  ];

  return (
    <section className="relative bg-gray-100 py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Grid Container */}
        <div className="relative grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 lg:gap-16">
          {/* Central Circle with Slogan */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 hidden md:block">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="w-48 h-48 lg:w-56 lg:h-56 bg-white rounded-full shadow-lg flex flex-col items-center justify-center"
            >
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-1">{getFrenchText('philosophy.values.slogan') || 'We think great.'}</p>
                <p className="text-2xl lg:text-3xl font-bold text-gray-800">
                  {getFrenchText('philosophy.values.brandSlogan') || 'thinKGreat'}
                </p>
              </div>
            </motion.div>
          </div>

          {/* Value Cards */}
          {values.map((value, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white rounded-lg p-6 md:p-8 shadow-sm hover:shadow-md transition-shadow"
            >
              {/* Icon - Centered at top */}
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 bg-purple-700 rounded-full flex items-center justify-center">
                  <Image
                    src={value.icon}
                    alt={`Value ${index + 1} icon`}
                    width={32}
                    height={32}
                    className="w-8 h-8 filter invert"
                  />
                </div>
              </div>

              {/* Content */}
              <div className="text-center">
                <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-3 leading-tight">
                  {value.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {value.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Mobile Central Slogan */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="md:hidden mt-8 flex justify-center"
        >
          <div className="w-40 h-40 bg-white rounded-full shadow-lg flex flex-col items-center justify-center">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-1">{getFrenchText('philosophy.values.slogan') || 'We think great.'}</p>
              <p className="text-xl font-bold text-gray-800">
                {getFrenchText('philosophy.values.brandSlogan') || 'thinKGreat'}
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default PhilosophyValuesSection;
