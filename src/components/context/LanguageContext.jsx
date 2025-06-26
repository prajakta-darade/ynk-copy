import React, { createContext, useState, useContext, useEffect } from 'react';

// Create the context with a default value
const LanguageContext = createContext({
  language: 'en',
  toggleLanguage: () => {},
});

// Provider component
export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    // Try to get language from localStorage or default to 'en'
    return localStorage.getItem('language') || 'en';
  });

  // Sync language with localStorage
  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  // Toggle language between 'en' and 'mr'
  const toggleLanguage = () => {
    setLanguage((prev) => (prev === 'en' ? 'mr' : 'en'));
  };

  // Validate language on change
  useEffect(() => {
    if (!['en', 'mr'].includes(language)) {
      setLanguage('en'); // Fallback to 'en' if invalid
    }
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

// Custom hook to use the context
export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}