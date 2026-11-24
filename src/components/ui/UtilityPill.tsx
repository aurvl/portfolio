// Pilule grise translucide en haut à droite : choix de la langue + bascule clair/sombre.
// Réutilise la logique existante (i18n.changeLanguage et useTheme), seule la présentation change.
import type { ChangeEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { IoLanguage } from 'react-icons/io5'
import { LuMoonStar, LuSunMedium } from 'react-icons/lu'
import { useTheme } from '../../app/theme-context'
import i18n from '../../lib/i18n'
import { cn } from '../../lib/cn'
import type { AppLanguage } from '../../types/i18n'

type UtilityPillProps = {
  className?: string
}

function UtilityPill({ className }: UtilityPillProps) {
  const { t } = useTranslation()
  const { theme, toggleTheme } = useTheme()
  const isDarkTheme = theme === 'dark'
  const currentLanguage: AppLanguage = i18n.resolvedLanguage === 'fr' ? 'fr' : 'en'

  const handleLanguageChange = (event: ChangeEvent<HTMLSelectElement>) => {
    void i18n.changeLanguage(event.target.value as AppLanguage)
  }

  return (
    <div className={cn('utility-pill', className)}>
      <label className="utility-pill__language">
        <IoLanguage aria-hidden="true" />
        <span className="sr-only">{t('navbar.language')}</span>
        <select
          className="utility-pill__select"
          name="language"
          value={currentLanguage}
          onChange={handleLanguageChange}
        >
          <option value="en">EN</option>
          <option value="fr">FR</option>
        </select>
      </label>

      <button
        type="button"
        className="utility-pill__theme"
        onClick={toggleTheme}
        aria-label={t('navbar.themeToggle')}
        aria-pressed={isDarkTheme}
        title={t('navbar.themeToggle')}
      >
        {isDarkTheme ? <LuSunMedium aria-hidden="true" /> : <LuMoonStar aria-hidden="true" />}
      </button>
    </div>
  )
}

export default UtilityPill
