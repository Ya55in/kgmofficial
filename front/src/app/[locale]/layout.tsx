import React from 'react';

// Layout for [locale] dynamic route
// This exports generateStaticParams() for all child routes

// Required for static export with dynamic routes
export const dynamicParams = false; // Prevent generating pages for routes without locale

export function generateStaticParams() {
  return [
    { locale: 'fr' }, // French first (default)
    { locale: 'en' }
  ];
}

export default function LocaleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

