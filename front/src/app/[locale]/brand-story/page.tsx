import Layout from '@/components/Layout';
import BrandStoryHero from '@/components/BrandStoryHero';
import BrandManifestoSection from '@/components/BrandManifestoSection';
import BrandStatementSection from '@/components/BrandStatementSection';
import BrandLifestyleSection from '@/components/BrandLifestyleSection';
import BrandDiverseLifestylesSection from '@/components/BrandDiverseLifestylesSection';
import BrandSafetyStatementSection from '@/components/BrandSafetyStatementSection';
import BrandSafetyValuesSection from '@/components/BrandSafetyValuesSection';
import BrandBenefitSection from '@/components/BrandBenefitSection';
import BrandConfidenceSection from '@/components/BrandConfidenceSection';
import BrandDesignPhilosophySection from '@/components/BrandDesignPhilosophySection';
import BrandEssenceVideoSection from '@/components/BrandEssenceVideoSection';
import VideoBackgroundWrapper from '@/components/VideoBackgroundWrapper';
import Footer from '@/components/Footer';

// Required for static export with dynamic routes
export function generateStaticParams() {
  return [
    { locale: 'en' },
    { locale: 'fr' }
  ];
}

export default function BrandStory() {
  return (
    <Layout>
      <BrandStoryHero />
      <BrandManifestoSection />
      <VideoBackgroundWrapper>
        <BrandStatementSection />
        <BrandLifestyleSection />
        <BrandDiverseLifestylesSection />
        <BrandSafetyStatementSection />
      </VideoBackgroundWrapper>
      <BrandSafetyValuesSection />
      <BrandBenefitSection />
      <BrandEssenceVideoSection />
      <BrandConfidenceSection />
      <BrandDesignPhilosophySection />
      <Footer />
    </Layout>
  );
}
