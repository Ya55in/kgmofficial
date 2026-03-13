import Layout from '@/components/Layout';
import CorporateHistoryHero from '@/components/CorporateHistoryHero';
import Footer from '@/components/Footer';

// Required for static export with dynamic routes
export function generateStaticParams() {
  return [
    { locale: 'en' },
    { locale: 'fr' }
  ];
}

export default function CorporateHistory() {
  return (
    <Layout>
      <CorporateHistoryHero />
      <Footer />
    </Layout>
  );
}
