import { useTranslation } from 'react-i18next'
import { homeEn } from '../data/home'
import { homeFr } from '../data/home.fr'
import type { AppLanguage } from '../types/i18n'

// Homepage copy for the active language (fr or en).
export function useHomeContent() {
  const { i18n } = useTranslation()
  const lang: AppLanguage = (i18n.resolvedLanguage ?? i18n.language ?? 'en').startsWith('fr') ? 'fr' : 'en'

  return { content: lang === 'fr' ? homeFr : homeEn, lang }
}
