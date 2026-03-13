import Layout from '@/components/Layout';
import HeroSection from '@/components/HeroSection';
import ExploreLineup from '@/components/ExploreLineup';
import BrandSection from '@/components/BrandSection';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';

export default function Home() {
  return (
    <Layout>
      <SEO
        title="KGM Mobility Morocco | Accueil - Véhicules SUV et Pick-up Premium"
        description="Découvrez KGM Mobility au Maroc : gamme complète de SUV et pick-up premium. Tivoli, Torres, Torres EVX, Rexton et Musso Grand. Technologie avancée, sécurité maximale, design moderne."
        keywords="KGM Mobility, SUV Maroc, Pick-up Maroc, Tivoli, Torres, Rexton, Musso Grand, véhicules premium"
        titleFr="KGM Mobility Morocco | Accueil - Véhicules SUV et Pick-up Premium"
        descriptionFr="Découvrez KGM Mobility au Maroc : gamme complète de SUV et pick-up premium. Tivoli, Torres, Torres EVX, Rexton et Musso Grand. Technologie avancée, sécurité maximale, design moderne."
        keywordsFr="KGM Mobility, SUV Maroc, Pick-up Maroc, Tivoli, Torres, Rexton, Musso Grand, véhicules premium"
      />
      <div className="relative">
        <HeroSection />
        <div className="pointer-events-none absolute inset-x-0 -bottom-px h-24 bg-gradient-to-b from-transparent to-[#0b0d16]" />
      </div>
      <ExploreLineup />
      <BrandSection />
      <Footer />
    </Layout>
  );
} 