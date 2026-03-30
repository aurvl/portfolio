import i18n from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import { initReactI18next } from 'react-i18next'
import en from '../locales/en.json'
import fr from '../locales/fr.json'
import { supportedLanguages, type AppLanguage } from '../types/i18n'

const resources = {
  en: { translation: en },
  fr: { translation: fr },
} as const

const fallbackLng: AppLanguage = 'en'

if (!i18n.isInitialized) {
  void i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      resources,
      fallbackLng,
      supportedLngs: [...supportedLanguages],
      interpolation: {
        escapeValue: false,
      },
      detection: {
        order: ['localStorage', 'navigator', 'htmlTag'],
        caches: ['localStorage'],
        lookupLocalStorage: 'portfolio-language',
      },
    })
}

export default i18n
