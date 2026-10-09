import type { ChangeEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { IoLanguage } from 'react-icons/io5'
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
    <div className="relative flex items-center gap-1 text-[var(--text2-col)]">
      <IoLanguage size={13} aria-hidden="true" />
      <label className="sr-only" htmlFor="language-switcher">
        {t('navbar.language')}
      </label>
      <select
        id="language-switcher"
        name="language"
        value={currentLanguage}
        onChange={handleLanguageChange}
        aria-label={t('navbar.language')}
        className="language-switcher rounded-md bg-transparent py-0.5 pr-1 text-[var(--text2-col)] focus:outline-none"
      >
        <option className="bg-[var(--bg2-color)]" value="en">
          English
        </option>
        <option className="bg-[var(--bg2-color)]" value="fr">
          Français
        </option>
      </select>
    </div>
  )
}

export default LanguageSwitcher
