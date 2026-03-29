import { LuMoonStar, LuSunMedium } from 'react-icons/lu'
import { useTranslation } from 'react-i18next'
import { useTheme } from '../../app/theme-context'

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  const { t } = useTranslation()
  const isDarkTheme = theme === 'dark'

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={t('navbar.themeToggle')}
      aria-pressed={!isDarkTheme}
      title={t('navbar.themeToggle')}
      className="border-class toggle-btn rounded-lg px-2 py-2 text-sm text-[var(--text2-col)] transition hover:text-[var(--toggle-hover)]"
    >
      {isDarkTheme ? <LuSunMedium size={24} /> : <LuMoonStar size={24} />}
    </button>
  )
}

export default ThemeToggle
