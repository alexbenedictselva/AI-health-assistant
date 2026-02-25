import React, { createContext, useContext, useState, useEffect } from 'react';
import { translateTexts } from '../services/translationService';

interface TranslationContextType {
  language: string;
  setLanguage: (lang: string) => void;
  t: (text: string) => string;
  translations: { [key: string]: string };
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

export const TranslationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState(localStorage.getItem('language') || 'en');
  const [translations, setTranslations] = useState<{ [key: string]: string }>({});

  const setLanguage = (lang: string) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
    setTranslations({});
  };

  const t = (text: string): string => {
    if (language === 'en') return text;
    return translations[text] || text;
  };

  useEffect(() => {
    const translatePage = async () => {
      if (language === 'en') return;

      const allText = Array.from(document.querySelectorAll('[data-translate]'))
        .map(el => el.textContent || '')
        .filter(text => text.trim());

      if (allText.length === 0) return;

      const translated = await translateTexts(allText, language);
      const newTranslations: { [key: string]: string } = {};
      allText.forEach((text, i) => {
        newTranslations[text] = translated[i];
      });
      setTranslations(prev => ({ ...prev, ...newTranslations }));
    };

    translatePage();
  }, [language]);

  return (
    <TranslationContext.Provider value={{ language, setLanguage, t, translations }}>
      {children}
    </TranslationContext.Provider>
  );
};

export const useTranslation = () => {
  const context = useContext(TranslationContext);
  if (!context) throw new Error('useTranslation must be used within TranslationProvider');
  return context;
};
