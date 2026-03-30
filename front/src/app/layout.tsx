import type { Metadata } from 'next';
import '../styles/globals.css';
import { LanguageProvider } from '@/contexts/LanguageContext';

export const metadata: Metadata = {
  title: 'KGM Mobility Morocco | Véhicules SUV et Pick-up Premium',
  description: 'Découvrez la gamme KGM Mobility au Maroc : SUV et pick-up premium avec technologie avancée, sécurité maximale et design moderne. Tivoli, Torres, Torres EVX, Rexton et Musso Grand.',
  keywords: 'KGM Mobility, SUV Maroc, Pick-up Maroc, Tivoli, Torres, Rexton, Musso Grand, véhicules premium, voitures KGM',
  openGraph: {
    title: 'KGM Mobility Morocco | Véhicules SUV et Pick-up Premium',
    description: 'Découvrez la gamme KGM Mobility au Maroc : SUV et pick-up premium avec technologie avancée, sécurité maximale et design moderne.',
    type: 'website',
    locale: 'fr_FR',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
} 