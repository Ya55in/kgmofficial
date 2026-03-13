import Layout from '@/components/Layout';
import ProductHistoryHero from '@/components/ProductHistoryHero';
import Footer from '@/components/Footer';

// Required for static export with dynamic routes
export function generateStaticParams() {
  return [
    { locale: 'en' },
    { locale: 'fr' }
  ];
}

export default function ProductHistory() {
  return (
    <Layout>
      <ProductHistoryHero />
      <Footer />
    </Layout>
  );
}
