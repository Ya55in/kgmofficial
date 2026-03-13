import Layout from '@/components/Layout';
import HeritageHero from '@/components/HeritageHero';
import Footer from '@/components/Footer';

// Required for static export with dynamic routes
export function generateStaticParams() {
  return [
    { locale: 'en' },
    { locale: 'fr' }
  ];
}

export default function Heritage1954() {
  return (
    <Layout>
      <HeritageHero />
      <Footer />
    </Layout>
  );
}