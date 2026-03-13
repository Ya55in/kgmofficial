"use client";

import Layout from '@/components/Layout';
import Footer from '@/components/Footer';
import { useLanguage } from '@/contexts/LanguageContext';
import SEO from '@/components/SEO';

export default function CookiesPage() {
  const { language } = useLanguage();

  return (
    <Layout>
      <SEO
        title="Politique de Cookies | KGM Mobility Morocco"
        description="Politique de cookies de KGM Mobility Morocco. Découvrez comment nous utilisons les cookies sur notre site web."
        keywords="KGM Mobility, cookies, politique cookies, confidentialité"
        titleFr="Politique de Cookies | KGM Mobility Morocco"
        descriptionFr="Politique de cookies de KGM Mobility Morocco. Découvrez comment nous utilisons les cookies sur notre site web."
        keywordsFr="KGM Mobility, cookies, politique cookies, confidentialité"
      />
      <div className="min-h-screen bg-[#0b0d16] text-white">
        <div className="max-w-4xl mx-auto px-6 md:px-12 py-16 md:py-24">
          <h1 className="text-4xl md:text-5xl font-bold mb-8 text-[#d4be83]">
            {language === 'fr' ? 'Politique de Cookies' : 'Cookie Policy'}
          </h1>

          {/* Introduction */}
          <section className="mb-12">
            <h2 className="text-2xl md:text-3xl font-semibold mb-4 text-white">
              {language === 'fr' ? 'Introduction' : 'Introduction'}
            </h2>
            <p className="text-white/80 leading-relaxed">
              {language === 'fr' 
                ? "Lors de votre navigation sur notre site, des cookies ou technologies similaires peuvent être déposés sur votre appareil (ordinateur, smartphone, tablette…). Cette politique a pour but de vous informer sur l'utilisation que nous faisons de ces cookies, leurs finalités, et les moyens à votre disposition pour les gérer."
                : "When you navigate on our site, cookies or similar technologies may be placed on your device (computer, smartphone, tablet…). This policy aims to inform you about the use we make of these cookies, their purposes, and the means at your disposal to manage them."
              }
            </p>
          </section>

          {/* What is a cookie */}
          <section className="mb-12">
            <h2 className="text-2xl md:text-3xl font-semibold mb-4 text-white">
              {language === 'fr' ? "Qu'est-ce qu'un cookie ?" : 'What is a cookie?'}
            </h2>
            <p className="text-white/80 leading-relaxed">
              {language === 'fr'
                ? "Un cookie est un petit fichier texte enregistré sur votre terminal lors de la consultation d'un site internet. Il permet notamment de reconnaître votre appareil lors de visites ultérieures et d'améliorer votre expérience utilisateur (par exemple, en mémorisant vos préférences de langue ou vos identifiants de session)."
                : "A cookie is a small text file stored on your terminal when browsing a website. It notably allows you to recognize your device during subsequent visits and to improve your user experience (for example, by remembering your language preferences or session identifiers)."
              }
            </p>
          </section>

          {/* Why do we use cookies */}
          <section className="mb-12">
            <h2 className="text-2xl md:text-3xl font-semibold mb-4 text-white">
              {language === 'fr' ? 'Pourquoi utilisons-nous des cookies ?' : 'Why do we use cookies?'}
            </h2>
            <p className="text-white/80 mb-4 leading-relaxed">
              {language === 'fr'
                ? 'Nous utilisons différents types de cookies afin de :'
                : 'We use different types of cookies to:'
              }
            </p>
            <div className="space-y-4 text-white/80">
              <div>
                <p className="font-semibold mb-2">
                  {language === 'fr' ? 'a) Faciliter votre navigation' : 'a) Facilitate your navigation'}
                </p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>{language === 'fr' ? 'Mémoriser vos préférences (ex. langue, affichage, authentification),' : 'Remember your preferences (ex. language, display, authentication),'}</li>
                  <li>{language === 'fr' ? 'Assurer le bon fonctionnement technique du site.' : 'Ensure the proper functioning of the site.'}</li>
                </ul>
              </div>
              <div>
                <p className="font-semibold mb-2">
                  {language === 'fr' ? 'b) Mesurer l\'audience' : 'b) Measure audience'}
                </p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>{language === 'fr' ? 'Évaluer la performance du site,' : 'Evaluate the performance of the site,'}</li>
                  <li>{language === 'fr' ? 'Identifier les axes d\'amélioration.' : 'Identify areas for improvement.'}</li>
                </ul>
              </div>
              <div>
                <p className="font-semibold mb-2">
                  {language === 'fr' ? 'c) Personnaliser les contenus et les publicités' : 'c) Personalize content and ads'}
                </p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>{language === 'fr' ? 'Vous proposer des contenus adaptés à vos intérêts,' : 'Offer you content adapted to your interests,'}</li>
                  <li>{language === 'fr' ? 'Améliorer la pertinence des publicités affichées.' : 'Improve the relevance of ads displayed.'}</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Data shared with third parties */}
          <section className="mb-12">
            <h2 className="text-2xl md:text-3xl font-semibold mb-4 text-white">
              {language === 'fr' ? 'Données partagées avec des tiers' : 'Data shared with third parties'}
            </h2>
            <p className="text-white/80 leading-relaxed">
              {language === 'fr'
                ? 'Certaines informations issues des cookies peuvent être transmises à des partenaires techniques ou publicitaires afin de nous aider à analyser l\'utilisation du site ou à diffuser des contenus ciblés. Aucune donnée personnelle nominative n\'est partagée sans votre accord préalable.'
                : 'Some information from cookies may be transmitted to technical or advertising partners in order to help us analyze the use of the site or to distribute targeted content. No personal data is shared without your prior consent.'
              }
            </p>
          </section>

          {/* Retention period */}
          <section className="mb-12">
            <h2 className="text-2xl md:text-3xl font-semibold mb-4 text-white">
              {language === 'fr' ? 'Durée de conservation' : 'Retention period'}
            </h2>
            <p className="text-white/80 leading-relaxed">
              {language === 'fr'
                ? 'Les cookies sont conservés pour une durée limitée, généralement entre quelques jours et 12 mois maximum. Cette durée peut varier selon le type de cookie.'
                : 'Cookies are kept for a limited period, generally between a few days and a maximum of 12 months. This period may vary depending on the type of cookie.'
              }
            </p>
          </section>

          {/* How to manage preferences */}
          <section className="mb-12">
            <h2 className="text-2xl md:text-3xl font-semibold mb-4 text-white">
              {language === 'fr' ? 'Comment gérer vos préférences ?' : 'How to manage your preferences?'}
            </h2>
            <p className="text-white/80 mb-4 leading-relaxed">
              {language === 'fr'
                ? 'Vous pouvez refuser ou personnaliser l\'utilisation des cookies à tout moment :'
                : 'You can refuse or personalize the use of cookies at any time:'
              }
            </p>
            <ul className="list-disc list-inside space-y-2 text-white/80 ml-4">
              <li>
                {language === 'fr'
                  ? 'En paramétrant vos préférences via le bandeau cookies lors de votre première visite,'
                  : 'By setting your preferences via the cookie banner when you first visit,'
                }
              </li>
              <li>
                {language === 'fr'
                  ? 'En modifiant les réglages de votre navigateur pour bloquer ou supprimer les cookies déjà enregistrés.'
                  : 'By modifying the settings of your browser to block or delete already saved cookies.'
                }
              </li>
            </ul>
            <p className="text-white/70 text-sm italic mt-4">
              {language === 'fr'
                ? 'Veuillez noter que le refus de certains cookies peut altérer la qualité de votre expérience sur notre site.'
                : 'Please note that refusing certain cookies may affect the quality of your experience on our site.'
              }
            </p>
          </section>

          {/* Contact */}
          <section className="mb-12">
            <h2 className="text-2xl md:text-3xl font-semibold mb-4 text-white">
              {language === 'fr' ? 'Contact' : 'Contact'}
            </h2>
            <p className="text-white/80 mb-4 leading-relaxed">
              {language === 'fr'
                ? 'Pour toute question ou demande liée à cette politique, vous pouvez nous contacter à l\'adresse suivante :'
                : 'For any question or request related to this policy, you can contact us at the following address:'
              }
            </p>
            <div className="space-y-2 text-white/80">
              <p>📧 {language === 'fr' ? 'Email :' : 'Email:'} <a href="mailto:kgmmorocco@gmail.com" className="text-[#d4be83] hover:text-[#c4a96c] transition-colors">kgmmorocco@gmail.com</a></p>
              <p>📍 {language === 'fr' ? 'Adresse :' : 'Address:'} 1 Place Bandoeng, Casablanca 20250</p>
            </div>
          </section>
        </div>
      </div>
      <Footer />
    </Layout>
  );
}








