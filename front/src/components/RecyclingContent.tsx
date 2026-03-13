'use client';

import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';

const RecyclingContent = () => {
  const { language } = useLanguage();
  
  // Get French translations
  const getFrenchText = (key: string) => {
    if (language === 'fr') {
      switch (key) {
        case 'recycling.intro1': return 'Chez KGM, nous nous engageons en faveur d\'un avenir durable en intégrant des pratiques de recyclage responsables dans tous les aspects de nos opérations. Nous reconnaissons l\'importance de minimiser notre impact environnemental et de contribuer à un monde plus vert.';
        case 'recycling.intro2': return 'Notre programme de recyclage comprend des processus complets pour la gestion des véhicules en fin de vie, la récupération des matériaux précieux et l\'élimination sécurisée des déchets. Nous travaillons en étroite collaboration avec des partenaires certifiés pour garantir que tous les matériaux sont traités de manière responsable.';
        case 'recycling.section1.title': return 'Recyclage Automobile';
        case 'recycling.section1.content': return 'Nous recyclons les véhicules en fin de vie de manière responsable, en récupérant les matériaux précieux et en minimisant les déchets. Notre processus de recyclage suit les normes environnementales les plus strictes.';
        case 'recycling.section2.title': return 'Métaux Lourds';
        case 'recycling.section2.content': return 'Nous gérons de manière sécurisée les métaux lourds présents dans les véhicules, en nous assurant qu\'ils sont traités et éliminés de manière écologique pour protéger l\'environnement.';
        case 'recycling.section3.title': return 'Informations de Démantèlement';
        case 'recycling.section3.content': return 'Notre processus de démantèlement est conçu pour maximiser la récupération des matériaux réutilisables tout en respectant les réglementations environnementales. Nous fournissons des informations détaillées sur chaque étape du processus.';
        default: return key;
      }
    }
    return key;
  };
  
  const sections = [
    {
      title: getFrenchText('recycling.section1.title') || "Automotive Recycling",
      content: getFrenchText('recycling.section1.content') || "We responsibly recycle end-of-life vehicles, recovering valuable materials and minimizing waste. Our recycling process follows the strictest environmental standards."
    },
    {
      title: getFrenchText('recycling.section2.title') || "Heavy Metals",
      content: getFrenchText('recycling.section2.content') || "We safely handle heavy metals found in vehicles, ensuring they are processed and disposed of in an environmentally friendly manner to protect the environment."
    },
    {
      title: getFrenchText('recycling.section3.title') || "Dismantling Information",
      content: getFrenchText('recycling.section3.content') || "Our dismantling process is designed to maximize recovery of reusable materials while adhering to environmental regulations. We provide detailed information about each step of the process."
    }
  ];

  return (
    <section className="py-16 lg:py-24 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Introduction */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <p className="text-gray-700 text-base lg:text-lg leading-relaxed mb-6">
            {getFrenchText('recycling.intro1') || "At KGM, we are committed to a sustainable future by integrating responsible recycling practices into all aspects of our operations. We recognize the importance of minimizing our environmental impact and contributing to a greener world."}
          </p>
          <p className="text-gray-700 text-base lg:text-lg leading-relaxed">
            {getFrenchText('recycling.intro2') || "Our recycling program includes comprehensive processes for end-of-life vehicle management, valuable material recovery, and safe waste disposal. We work closely with certified partners to ensure all materials are handled responsibly."}
          </p>
        </motion.div>

        {/* Content Sections */}
        <div className="space-y-12">
          {sections.map((section, index) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              viewport={{ once: true }}
              className="border-l-4 border-green-600 pl-6"
            >
              <h2 className="text-xl lg:text-2xl font-bold text-green-600 mb-4 uppercase tracking-wide">
                {section.title}
              </h2>
              <p className="text-gray-700 text-base lg:text-lg leading-relaxed">
                {section.content}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RecyclingContent;
