import type { ChangeEvent } from 'react'
import { useTranslation } from 'react-i18next'
import i18n from '../../lib/i18n'
import type { AppLanguage } from '../../types/i18n'

function LanguageSwitcher() {
  const { t } = useTranslation()
  const currentLanguage: AppLanguage =
    i18n.resolvedLanguage === 'fr' ? 'fr' : 'en'

  const handleLanguageChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const nextLanguage = event.target.value as AppLanguage
    void i18n.changeLanguage(nextLanguage)
  }

  return (
    <div className="relative">
      <label className="sr-only" htmlFor="language-switcher">
        {t('navbar.language')}
      </label>
      <select
        id="language-switcher"
        name="language"
        value={currentLanguage}
        onChange={handleLanguageChange}
        aria-label={t('navbar.language')}
        className="rounded-lg bg-transparent px-3 py-2 text-[var(--text2-col)] focus:outline-none"
      >
        <option className="bg-[var(--bg2-color)]" value="en">
          EN
        </option>
        <option className="bg-[var(--bg2-color)]" value="fr">
          FR
        </option>
      </select>
    </div>
  )
}

export default LanguageSwitcher
