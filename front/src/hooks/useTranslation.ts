'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import enMessages from '@/messages/en.json';
import frMessages from '@/messages/fr.json';

type Messages = typeof enMessages;

const messages: Record<string, any> = {
  en: enMessages,
  fr: frMessages,
};

export function useTranslation() {
  const { language } = useLanguage();

  const t = (key: string): string => {
    const keys = key.split('.');
    let value: any = messages[language];

    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        // Fallback to English if key not found
        value = messages.en;
        for (const fallbackKey of keys) {
          if (value && typeof value === 'object' && fallbackKey in value) {
            value = value[fallbackKey];
          } else {
            return key; // Return the key if not found in any language
          }
        }
        break;
      }
    }

    return typeof value === 'string' ? value : key;
  };

  return { t, language };
}
