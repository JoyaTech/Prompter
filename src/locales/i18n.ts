import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import enTranslations from './en.json';
import heTranslations from './he.json';

// Language detection function
const detectLanguage = (): string => {
  // Check localStorage first
  const savedLanguage = localStorage.getItem('alchemist-language');
  if (savedLanguage && ['en', 'he'].includes(savedLanguage)) {
    return savedLanguage;
  }
  
  // Check browser language
  const browserLang = navigator.language.toLowerCase();
  if (browserLang.startsWith('he') || browserLang.includes('il')) {
    return 'he';
  }
  
  return 'en'; // Default to English
};

// RTL languages configuration
const rtlLanguages = ['he', 'ar'];

// Set document direction based on language
const setDocumentDirection = (language: string) => {
  const isRTL = rtlLanguages.includes(language);
  document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
  document.documentElement.lang = language;
  
  // Add/remove RTL class for CSS
  if (isRTL) {
    document.documentElement.classList.add('rtl');
  } else {
    document.documentElement.classList.remove('rtl');
  }
};

const resources = {
  en: {
    translation: enTranslations
  },
  he: {
    translation: heTranslations
  }
};

const initialLanguage = detectLanguage();

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: initialLanguage,
    fallbackLng: 'en',
    
    interpolation: {
      escapeValue: false // React already escapes values
    },
    
    react: {
      useSuspense: false // Disable suspense for better compatibility
    },
    
    // Add debugging in development
    debug: process.env.NODE_ENV === 'development'
  });

// Set initial document direction
setDocumentDirection(initialLanguage);

// Listen for language changes
i18n.on('languageChanged', (lng: string) => {
  setDocumentDirection(lng);
  localStorage.setItem('alchemist-language', lng);
});

// Helper functions for language management
export const switchLanguage = (language: string) => {
  if (['en', 'he'].includes(language)) {
    i18n.changeLanguage(language);
  }
};

export const getCurrentLanguage = () => i18n.language;

export const isRTL = () => rtlLanguages.includes(i18n.language);

export const getSupportedLanguages = () => [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'he', name: 'Hebrew', nativeName: 'עברית' }
];

export default i18n;