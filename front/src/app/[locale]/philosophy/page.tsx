'use client';

import Layout from '@/components/Layout';
import PhilosophyValuesSection from '@/components/PhilosophyValuesSection';
import Footer from '@/components/Footer';
import { useTranslation } from '@/hooks/useTranslation';

// generateStaticParams() is now in the parent layout.tsx

export default function PhilosophyPage() {
  const { t, language } = useTranslation();
  
  // Get French translations for main page
  const getFrenchText = (key: string) => {
    if (language === 'fr') {
      switch (key) {
        case 'philosophy.title': return 'PHILOSOPHIE';
        case 'philosophy.subtitle': return 'KGM est une entreprise familiale du Groupe KG.';
        default: return t(key);
      }
    }
    return t(key);
  };
  
  return (
    <Layout>
        <section className="relative h-[70vh] md:h-[80vh] overflow-hidden">
        <img
          src="https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/philosophy/img-cm-bg-about-managt.webp"
          alt="Philosophy Hero"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/60" />

        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center text-white px-6">
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-wide mb-4">{getFrenchText('philosophy.title') || 'PHILOSOPHY'}</h1>
          <p className="text-white/90 text-base md:text-lg max-w-2xl">
            {getFrenchText('philosophy.subtitle') || 'KGM is a family company of the KG Group.'}
          </p>
        </div>
      </section>
      
      <PhilosophyValuesSection />
      <Footer />
    </Layout>
  );
}


