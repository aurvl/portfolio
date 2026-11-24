import { useEffect, useState, type ReactNode } from 'react'
import {
  ThemeContext,
  type ThemeContextValue,
  type ThemeMode,
} from './theme-context'

const THEME_STORAGE_KEY = 'portfolio-theme'

function getPreferredTheme(): ThemeMode {
  if (typeof window === 'undefined') {
    return 'light'
  }

  const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY)

  if (storedTheme === 'light' || storedTheme === 'dark') {
    return storedTheme
  }

  // Le design v3 est pensé en clair : sombre seulement si le système le demande explicitement
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light'
}

function AppProviders({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemeMode>(() => getPreferredTheme())

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    document.documentElement.style.colorScheme = theme
    window.localStorage.setItem(THEME_STORAGE_KEY, theme)
  }, [theme])

  const value: ThemeContextValue = {
    theme,
    setTheme: setThemeState,
    toggleTheme: () => {
      setThemeState((currentTheme) =>
        currentTheme === 'dark' ? 'light' : 'dark'
      )
    },
  }

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export default AppProviders
