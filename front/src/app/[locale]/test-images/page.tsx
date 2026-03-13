import ImageTest from '@/components/ImageTest';

// Required for static export with dynamic routes
export function generateStaticParams() {
  return [
    { locale: 'en' },
    { locale: 'fr' }
  ];
}

export default function TestImages() {
  return <ImageTest />;
}
