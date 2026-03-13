'use client';

import React, { useState } from 'react';
import Layout from '@/components/Layout';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';

// generateStaticParams() is now in the parent layout.tsx

const ContactUs = () => {
  const { language } = useLanguage();
  const [formData, setFormData] = useState({
    lastName: '',
    firstName: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    service: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    alert(language === 'fr' ? "Votre message a été envoyé avec succès ! Nous vous contacterons bientôt." : "Your message has been sent successfully! We will contact you soon.");
    setFormData({
      lastName: '',
      firstName: '',
      email: '',
      phone: '',
      subject: '',
      message: '',
      service: ''
    });
    setIsSubmitting(false);
  };

  const services = [
    language === 'fr' ? "Demande générale" : "General Inquiry",
    language === 'fr' ? "Vente de véhicules" : "Vehicle Sales",
    language === 'fr' ? "Service et maintenance" : "Service & Maintenance",
    language === 'fr' ? "Pièces et accessoires" : "Parts & Accessories",
    language === 'fr' ? "Informations de garantie" : "Warranty Information",
    language === 'fr' ? "Support technique" : "Technical Support",
    language === 'fr' ? "Demande de concessionnaire" : "Dealer Inquiry",
    language === 'fr' ? "Autre" : "Other"
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="relative py-20 overflow-hidden">
          {/* Video Background */}
          <div className="absolute inset-0 z-0">
            <video
              src="https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/hero/202510301620.mp4"
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-full object-cover"
              onLoadStart={() => console.log('Contact Us video started loading')}
              onError={(e) => console.error('Contact Us video failed to load:', e)}
            />
            {/* Overlay for better text readability */}
            <div className="absolute inset-0 bg-black/40"></div>
          </div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center"
            >
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                {language === 'fr' ? "Contactez" : "Contact"} <span className="text-kgm-amber">{language === 'fr' ? "Nous" : "Us"}</span>
              </h1>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                {language === 'fr' ? "Nous sommes là pour vous aider. N'hésitez pas à nous contacter pour toute question ou demande d'information." : "We're here to help. Don't hesitate to contact us for any questions or information requests."}
              </p>
            </motion.div>
          </div>
        </section>

        {/* Contact Form Section */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="bg-white rounded-xl shadow-lg p-8"
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-6">{language === 'fr' ? "Formulaire de Contact" : "Contact Form"}</h2>
              <form onSubmit={handleSubmit} className="space-y-6" data-netlify="false">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'fr' ? "Nom" : "Last Name"} *
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-kgm-amber focus:border-transparent transition-colors"
                      placeholder={language === 'fr' ? "Entrez votre nom" : "Enter your last name"}
                    />
                  </div>
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'fr' ? "Prénom" : "First Name"} *
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-kgm-amber focus:border-transparent transition-colors"
                      placeholder={language === 'fr' ? "Entrez votre prénom" : "Enter your first name"}
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'fr' ? "Adresse e-mail" : "Email Address"} *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-kgm-amber focus:border-transparent transition-colors"
                      placeholder={language === 'fr' ? "Entrez votre adresse e-mail" : "Enter your email address"}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'fr' ? "Numéro de téléphone" : "Phone Number"}
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-kgm-amber focus:border-transparent transition-colors"
                      placeholder={language === 'fr' ? "Entrez votre numéro de téléphone" : "Enter your phone number"}
                    />
                  </div>
                  <div>
                    <label htmlFor="service" className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'fr' ? "Service d'intérêt" : "Service Interest"}
                    </label>
                    <select
                      id="service"
                      name="service"
                      value={formData.service}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-kgm-amber focus:border-transparent transition-colors"
                    >
                      <option value="">{language === 'fr' ? "Sélectionnez un service" : "Select a service"}</option>
                      {services.map((service, index) => (
                        <option key={index} value={service}>{service}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'fr' ? "Sujet" : "Subject"} *
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-kgm-amber focus:border-transparent transition-colors"
                    placeholder={language === 'fr' ? "Entrez le sujet de votre message" : "Enter the subject of your message"}
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'fr' ? "Message" : "Message"} *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-kgm-amber focus:border-transparent transition-colors resize-none"
                    placeholder={language === 'fr' ? "Entrez votre message ici" : "Enter your message here"}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-4 px-6 rounded-lg font-semibold text-white transition-colors duration-300 ${
                    isSubmitting
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-kgm-amber hover:bg-kgm-amber/80 focus:ring-4 focus:ring-kgm-amber/30'
                  }`}
                >
                  {isSubmitting ? (language === 'fr' ? "Envoi en cours..." : "Sending...") : (language === 'fr' ? "Envoyer le message" : "Send Message")}
                </button>
              </form>
            </motion.div>
          </div>
        </section>
      </div>
      <Footer />
    </Layout>
  );
};

export default ContactUs;