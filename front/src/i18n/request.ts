import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';

// Can be imported from a shared config
export const locales = ['fr', 'en']; // French first (default)
export const defaultLocale = 'fr';

export default getRequestConfig(async ({ locale }) => {
  // If no locale provided, use French as default
  const validLocale = locale || defaultLocale;
  
  // Validate that the incoming `locale` parameter is valid
  if (!validLocale || !locales.includes(validLocale as any)) notFound();

  return {
    locale: validLocale as string,
    messages: (await import(`../messages/${validLocale}.json`)).default
  };
});
