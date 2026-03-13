import Layout from '@/components/Layout';
import HeroSection from '@/components/HeroSection';
import ExploreLineup from '@/components/ExploreLineup';
import BrandSection from '@/components/BrandSection';
import Footer from '@/components/Footer';
import type { Metadata } from 'next';

// Required for static export with dynamic routes
export const dynamicParams = false; // Prevent generating pages for routes without locale

export function generateStaticParams() {
  return [
    { locale: 'fr' }, // French first (default)
    { locale: 'en' }
  ];
}

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const isFr = params.locale === 'fr';
  return {
    title: isFr 
      ? 'KGM Mobility Morocco | Accueil - Véhicules SUV et Pick-up Premium'
      : 'KGM Mobility Morocco | Home - Premium SUV and Pick-up Vehicles',
    description: isFr
      ? 'Découvrez KGM Mobility au Maroc : gamme complète de SUV et pick-up premium. Tivoli, Torres, Torres EVX, Rexton et Musso Grand. Technologie avancée, sécurité maximale, design moderne.'
      : 'Discover KGM Mobility in Morocco: complete range of premium SUVs and pick-ups. Tivoli, Torres, Torres EVX, Rexton and Musso Grand. Advanced technology, maximum safety, modern design.',
    keywords: isFr
      ? 'KGM Mobility, SUV Maroc, Pick-up Maroc, Tivoli, Torres, Rexton, Musso Grand, véhicules premium'
      : 'KGM Mobility, SUV Morocco, Pick-up Morocco, Tivoli, Torres, Rexton, Musso Grand, premium vehicles',
  };
}

export default function Home() {
  return (
    <Layout>
      {/* Hero with bottom gradient overlay to transition into dark section */}
      <div className="relative">
        <HeroSection />
        <div className="pointer-events-none absolute inset-x-0 -bottom-px h-24 bg-gradient-to-b from-transparent to-[#0b0d16]" />
      </div>

      {/* Explore KGM Lineup (dark mode section) */}
      <ExploreLineup />

      {/* Brand section */}
      <BrandSection />


      {/* Newsroom section removed */}

      {/* KGM Banner section removed */}


      {/* Existing demo sections can remain or be removed if not needed */}

     
      <Footer />
    </Layout>
  );
} 