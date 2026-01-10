import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import enTranslations from '../locales/en/common.json';
import ptBRTranslations from '../locales/pt-BR/common.json';

i18n
  .use(LanguageDetector) // Detects user's browser language
  .use(initReactI18next) // Passes i18n down to react-i18next
  .init({
    resources: {
      en: {
        translation: enTranslations
      },
      'pt-BR': {
        translation: ptBRTranslations
      }
    },
    fallbackLng: 'pt-BR', // Default to Portuguese to match sofluent.ai
    debug: false,
    
    interpolation: {
      escapeValue: false // React already escapes values
    },
    
    detection: {
      // Order of language detection
      order: ['localStorage', 'navigator'],
      // Cache user language preference
      caches: ['localStorage'],
      // Default language
      lookupLocalStorage: 'i18nextLng'
    }
  });

export default i18n;
