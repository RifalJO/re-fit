"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { Locale, translations, detectLocale, getTranslation } from "./translations";

type I18nContextType = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: typeof translations.id;
};

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('id');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Detect locale from browser on mount
    const detectedLocale = detectLocale(typeof navigator !== 'undefined' ? navigator.language : null);
    setLocaleState(detectedLocale);
    setIsLoaded(true);
  }, []);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
  };

  const t = getTranslation(locale);

  if (!isLoaded) {
    return null; // Or loading spinner
  }

  return (
    <I18nContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (context === undefined) {
    throw new Error("useI18n must be used within an I18nProvider");
  }
  return context;
}
