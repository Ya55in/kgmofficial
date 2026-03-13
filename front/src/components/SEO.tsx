"use client";

import { useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

interface SEOProps {
  title: string;
  description: string;
  keywords?: string;
  titleFr?: string;
  descriptionFr?: string;
  keywordsFr?: string;
}

export default function SEO({ 
  title, 
  description, 
  keywords,
  titleFr,
  descriptionFr,
  keywordsFr
}: SEOProps) {
  const { language } = useLanguage();
  const isFr = language === 'fr';

  useEffect(() => {
    // Update document title
    document.title = isFr && titleFr ? titleFr : title;

    // Update or create meta description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute('content', isFr && descriptionFr ? descriptionFr : description);

    // Update or create meta keywords
    if (keywords || keywordsFr) {
      let metaKeywords = document.querySelector('meta[name="keywords"]');
      if (!metaKeywords) {
        metaKeywords = document.createElement('meta');
        metaKeywords.setAttribute('name', 'keywords');
        document.head.appendChild(metaKeywords);
      }
      metaKeywords.setAttribute('content', isFr && keywordsFr ? keywordsFr : (keywords || ''));
    }

    // Update Open Graph tags
    let ogTitle = document.querySelector('meta[property="og:title"]');
    if (!ogTitle) {
      ogTitle = document.createElement('meta');
      ogTitle.setAttribute('property', 'og:title');
      document.head.appendChild(ogTitle);
    }
    ogTitle.setAttribute('content', isFr && titleFr ? titleFr : title);

    let ogDescription = document.querySelector('meta[property="og:description"]');
    if (!ogDescription) {
      ogDescription = document.createElement('meta');
      ogDescription.setAttribute('property', 'og:description');
      document.head.appendChild(ogDescription);
    }
    ogDescription.setAttribute('content', isFr && descriptionFr ? descriptionFr : description);
  }, [language, title, description, keywords, titleFr, descriptionFr, keywordsFr, isFr]);

  return null;
}

