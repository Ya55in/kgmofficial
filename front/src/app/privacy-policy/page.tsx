"use client";

import Layout from '@/components/Layout';
import Footer from '@/components/Footer';
import { useLanguage } from '@/contexts/LanguageContext';
import SEO from '@/components/SEO';

export default function PrivacyPolicyPage() {
  const { language } = useLanguage();

  return (
    <Layout>
      <SEO
        title="Politique de Confidentialité | KGM Mobility Morocco"
        description="Politique de confidentialité de KGM Mobility Morocco. Découvrez comment nous collectons, utilisons et protégeons vos données personnelles."
        keywords="KGM Mobility, confidentialité, protection des données, RGPD, vie privée"
        titleFr="Politique de Confidentialité | KGM Mobility Morocco"
        descriptionFr="Politique de confidentialité de KGM Mobility Morocco. Découvrez comment nous collectons, utilisons et protégeons vos données personnelles."
        keywordsFr="KGM Mobility, confidentialité, protection des données, RGPD, vie privée"
      />
      <div className="min-h-screen bg-[#0b0d16] text-white">
        <div className="max-w-4xl mx-auto px-6 md:px-12 py-16 md:py-24">
          <h1 className="text-4xl md:text-5xl font-bold mb-8 text-[#d4be83]">
            {language === 'fr' ? 'Politique de Confidentialité' : 'Privacy Policy'}
          </h1>

          {/* Introduction */}
          <section className="mb-12">
            <h2 className="text-2xl md:text-3xl font-semibold mb-4 text-white">
              {language === 'fr' ? 'Introduction' : 'Introduction'}
            </h2>
            <p className="text-white/80 leading-relaxed">
              {language === 'fr' 
                ? "KGM Mobility Morocco (ci-après « nous », « notre » ou « la société ») s'engage à protéger la confidentialité et la sécurité des informations personnelles que vous nous confiez. Cette politique de confidentialité explique comment nous collectons, utilisons, stockons et protégeons vos données personnelles conformément à la législation marocaine et internationale en vigueur."
                : "KGM Mobility Morocco (hereinafter 'we', 'our' or 'the company') is committed to protecting the privacy and security of personal information you entrust to us. This privacy policy explains how we collect, use, store and protect your personal data in accordance with applicable Moroccan and international legislation."
              }
            </p>
          </section>

          {/* Data Collection */}
          <section className="mb-12">
            <h2 className="text-2xl md:text-3xl font-semibold mb-4 text-white">
              {language === 'fr' ? '1. Données que nous collectons' : '1. Data We Collect'}
            </h2>
            <p className="text-white/80 mb-4 leading-relaxed">
              {language === 'fr'
                ? 'Nous pouvons collecter les types de données personnelles suivants :'
                : 'We may collect the following types of personal data:'
              }
            </p>
            <div className="space-y-4 text-white/80">
              <div>
                <p className="font-semibold mb-2">
                  {language === 'fr' ? 'a) Données d\'identification' : 'a) Identification data'}
                </p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>{language === 'fr' ? 'Nom et prénom,' : 'First and last name,'}</li>
                  <li>{language === 'fr' ? 'Adresse e-mail,' : 'Email address,'}</li>
                  <li>{language === 'fr' ? 'Numéro de téléphone,' : 'Phone number,'}</li>
                  <li>{language === 'fr' ? 'Adresse postale.' : 'Postal address.'}</li>
                </ul>
              </div>
              <div>
                <p className="font-semibold mb-2">
                  {language === 'fr' ? 'b) Données de navigation' : 'b) Navigation data'}
                </p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>{language === 'fr' ? 'Adresse IP,' : 'IP address,'}</li>
                  <li>{language === 'fr' ? 'Type de navigateur et système d\'exploitation,' : 'Browser type and operating system,'}</li>
                  <li>{language === 'fr' ? 'Pages visitées et durée de visite,' : 'Pages visited and visit duration,'}</li>
                  <li>{language === 'fr' ? 'Données de localisation (si autorisées).' : 'Location data (if authorized).'}</li>
                </ul>
              </div>
              <div>
                <p className="font-semibold mb-2">
                  {language === 'fr' ? 'c) Données de communication' : 'c) Communication data'}
                </p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>{language === 'fr' ? 'Correspondances par e-mail ou formulaire de contact,' : 'Correspondence by email or contact form,'}</li>
                  <li>{language === 'fr' ? 'Demandes de test drive,' : 'Test drive requests,'}</li>
                  <li>{language === 'fr' ? 'Préférences et intérêts exprimés.' : 'Expressed preferences and interests.'}</li>
                </ul>
              </div>
            </div>
          </section>

          {/* How we use data */}
          <section className="mb-12">
            <h2 className="text-2xl md:text-3xl font-semibold mb-4 text-white">
              {language === 'fr' ? '2. Utilisation de vos données' : '2. Use of Your Data'}
            </h2>
            <p className="text-white/80 mb-4 leading-relaxed">
              {language === 'fr'
                ? 'Nous utilisons vos données personnelles pour les finalités suivantes :'
                : 'We use your personal data for the following purposes:'
              }
            </p>
            <ul className="list-disc list-inside space-y-2 text-white/80 ml-4">
              <li>{language === 'fr' ? 'Répondre à vos demandes et vous fournir les services demandés (test drive, informations sur les véhicules),' : 'Respond to your requests and provide requested services (test drive, vehicle information),'}</li>
              <li>{language === 'fr' ? 'Améliorer notre site web et votre expérience utilisateur,' : 'Improve our website and your user experience,'}</li>
              <li>{language === 'fr' ? 'Vous envoyer des communications marketing (avec votre consentement),' : 'Send you marketing communications (with your consent),'}</li>
              <li>{language === 'fr' ? 'Respecter nos obligations légales et réglementaires,' : 'Comply with our legal and regulatory obligations,'}</li>
              <li>{language === 'fr' ? 'Analyser l\'utilisation du site et effectuer des statistiques.' : 'Analyze site usage and perform statistics.'}</li>
            </ul>
          </section>

          {/* Data sharing */}
          <section className="mb-12">
            <h2 className="text-2xl md:text-3xl font-semibold mb-4 text-white">
              {language === 'fr' ? '3. Partage des données' : '3. Data Sharing'}
            </h2>
            <p className="text-white/80 leading-relaxed">
              {language === 'fr'
                ? 'Nous ne vendons pas vos données personnelles. Nous pouvons partager vos informations uniquement dans les cas suivants : avec nos prestataires de services techniques (hébergement, maintenance), lorsque la loi l\'exige, ou avec votre consentement explicite. Tous nos partenaires sont tenus de respecter la confidentialité de vos données.'
                : 'We do not sell your personal data. We may share your information only in the following cases: with our technical service providers (hosting, maintenance), when required by law, or with your explicit consent. All our partners are required to respect the confidentiality of your data.'
              }
            </p>
          </section>

          {/* Data security */}
          <section className="mb-12">
            <h2 className="text-2xl md:text-3xl font-semibold mb-4 text-white">
              {language === 'fr' ? '4. Sécurité des données' : '4. Data Security'}
            </h2>
            <p className="text-white/80 leading-relaxed">
              {language === 'fr'
                ? 'Nous mettons en œuvre des mesures techniques et organisationnelles appropriées pour protéger vos données personnelles contre tout accès non autorisé, perte, destruction ou altération. Cependant, aucune méthode de transmission sur Internet n\'est totalement sécurisée, et nous ne pouvons garantir une sécurité absolue.'
                : 'We implement appropriate technical and organizational measures to protect your personal data against unauthorized access, loss, destruction or alteration. However, no method of transmission over the Internet is completely secure, and we cannot guarantee absolute security.'
              }
            </p>
          </section>

          {/* Your rights */}
          <section className="mb-12">
            <h2 className="text-2xl md:text-3xl font-semibold mb-4 text-white">
              {language === 'fr' ? '5. Vos droits' : '5. Your Rights'}
            </h2>
            <p className="text-white/80 mb-4 leading-relaxed">
              {language === 'fr'
                ? 'Conformément à la législation en vigueur, vous disposez des droits suivants concernant vos données personnelles :'
                : 'In accordance with applicable legislation, you have the following rights regarding your personal data:'
              }
            </p>
            <ul className="list-disc list-inside space-y-2 text-white/80 ml-4">
              <li>{language === 'fr' ? 'Droit d\'accès : vous pouvez demander une copie de vos données personnelles,' : 'Right of access: you can request a copy of your personal data,'}</li>
              <li>{language === 'fr' ? 'Droit de rectification : vous pouvez corriger vos données inexactes,' : 'Right of rectification: you can correct your inaccurate data,'}</li>
              <li>{language === 'fr' ? 'Droit à l\'effacement : vous pouvez demander la suppression de vos données,' : 'Right to erasure: you can request deletion of your data,'}</li>
              <li>{language === 'fr' ? 'Droit d\'opposition : vous pouvez vous opposer au traitement de vos données,' : 'Right to object: you can object to the processing of your data,'}</li>
              <li>{language === 'fr' ? 'Droit à la portabilité : vous pouvez récupérer vos données dans un format structuré,' : 'Right to portability: you can retrieve your data in a structured format,'}</li>
              <li>{language === 'fr' ? 'Droit de retirer votre consentement à tout moment.' : 'Right to withdraw your consent at any time.'}</li>
            </ul>
            <p className="text-white/70 text-sm italic mt-4">
              {language === 'fr'
                ? 'Pour exercer ces droits, veuillez nous contacter à l\'adresse indiquée ci-dessous.'
                : 'To exercise these rights, please contact us at the address indicated below.'
              }
            </p>
          </section>

          {/* Data retention */}
          <section className="mb-12">
            <h2 className="text-2xl md:text-3xl font-semibold mb-4 text-white">
              {language === 'fr' ? '6. Conservation des données' : '6. Data Retention'}
            </h2>
            <p className="text-white/80 leading-relaxed">
              {language === 'fr'
                ? 'Nous conservons vos données personnelles uniquement pendant la durée nécessaire aux finalités pour lesquelles elles ont été collectées, ou conformément aux obligations légales. Une fois cette durée expirée, vos données sont supprimées ou anonymisées de manière sécurisée.'
                : 'We retain your personal data only for the period necessary for the purposes for which they were collected, or in accordance with legal obligations. Once this period has expired, your data is securely deleted or anonymized.'
              }
            </p>
          </section>

          {/* Cookies */}
          <section className="mb-12">
            <h2 className="text-2xl md:text-3xl font-semibold mb-4 text-white">
              {language === 'fr' ? '7. Cookies' : '7. Cookies'}
            </h2>
            <p className="text-white/80 leading-relaxed">
              {language === 'fr'
                ? 'Notre site utilise des cookies pour améliorer votre expérience. Pour plus d\'informations sur notre utilisation des cookies, veuillez consulter notre '
                : 'Our site uses cookies to improve your experience. For more information about our use of cookies, please see our '
              }
              <a href="/cookies" className="text-[#d4be83] hover:text-[#c4a96c] transition-colors underline">
                {language === 'fr' ? 'Politique de Cookies' : 'Cookie Policy'}
              </a>.
            </p>
          </section>

          {/* Changes to policy */}
          <section className="mb-12">
            <h2 className="text-2xl md:text-3xl font-semibold mb-4 text-white">
              {language === 'fr' ? '8. Modifications de la politique' : '8. Policy Changes'}
            </h2>
            <p className="text-white/80 leading-relaxed">
              {language === 'fr'
                ? 'Nous nous réservons le droit de modifier cette politique de confidentialité à tout moment. Toute modification sera publiée sur cette page avec une date de mise à jour. Nous vous encourageons à consulter régulièrement cette page pour rester informé de nos pratiques.'
                : 'We reserve the right to modify this privacy policy at any time. Any changes will be published on this page with an update date. We encourage you to regularly consult this page to stay informed of our practices.'
              }
            </p>
          </section>

          {/* Contact */}
          <section className="mb-12">
            <h2 className="text-2xl md:text-3xl font-semibold mb-4 text-white">
              {language === 'fr' ? '9. Contact' : '9. Contact'}
            </h2>
            <p className="text-white/80 mb-4 leading-relaxed">
              {language === 'fr'
                ? 'Pour toute question, demande d\'accès, de rectification ou d\'opposition concernant vos données personnelles, vous pouvez nous contacter :'
                : 'For any questions, requests for access, rectification or opposition regarding your personal data, you can contact us:'
              }
            </p>
            <div className="space-y-2 text-white/80">
              <p>📧 {language === 'fr' ? 'Email :' : 'Email:'} <a href="mailto:kgmmorocco@gmail.com" className="text-[#d4be83] hover:text-[#c4a96c] transition-colors">kgmmorocco@gmail.com</a></p>
              <p>📍 {language === 'fr' ? 'Adresse :' : 'Address:'} 1 Place Bandoeng, Casablanca 20250</p>
              <p>📞 {language === 'fr' ? 'Téléphone :' : 'Phone:'} <a href="tel:+212522361010" className="text-[#d4be83] hover:text-[#c4a96c] transition-colors">+212 522 361 010</a></p>
            </div>
          </section>

          {/* Last update */}
          <section className="mb-12">
            <p className="text-white/60 text-sm italic">
              {language === 'fr' 
                ? 'Dernière mise à jour : Décembre 2024'
                : 'Last updated: December 2024'
              }
            </p>
          </section>
        </div>
      </div>
      <Footer />
    </Layout>
  );
}

