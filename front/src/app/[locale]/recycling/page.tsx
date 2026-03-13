import RecyclingHero from '@/components/RecyclingHero';
import RecyclingContent from '@/components/RecyclingContent';
import Footer from '@/components/Footer';
import TransparentNavbar from '@/components/TransparentNavbar';

// Required for static export with dynamic routes
export function generateStaticParams() {
  return [
    { locale: 'en' },
    { locale: 'fr' }
  ];
}

export default function RecyclingPage() {
  return (
    <div className="min-h-screen">
      <TransparentNavbar />
      <RecyclingHero />
      <RecyclingContent />
      <Footer />
    </div>
  );
}
