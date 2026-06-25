import React, { createContext, useContext, useState, useEffect } from 'react';
import translations from '../i18n/translations';

const LanguageContext = createContext();

export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
};

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState(() => {
    return localStorage.getItem('ecobot_language') || 'en';
  });

  // t() — translation function: t('key') → string in current language
  const t = (key) => {
    return translations[lang]?.[key] || translations['en']?.[key] || key;
  };

  const changeLanguage = (newLang) => {
    setLang(newLang);
    localStorage.setItem('ecobot_language', newLang);
    // Also mark language as selected (so we don't show selector again)
    localStorage.setItem('ecobot_language_selected', 'true');
  };

  const hasSelectedLanguage = () => {
    return localStorage.getItem('ecobot_language_selected') === 'true';
  };

  // Sync html lang attribute for accessibility
  useEffect(() => {
    document.documentElement.lang = lang === 'ta' ? 'ta' : 'en';
  }, [lang]);

  return (
    <LanguageContext.Provider value={{ lang, t, changeLanguage, hasSelectedLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};
