// Dit si une règle CSS de média est vraie (ex. '(min-width: 1024px)') et se met à jour quand la fenêtre change.
// useSyncExternalStore : la valeur est lue directement dans le navigateur, sans « flash » au premier affichage.
import { useSyncExternalStore } from 'react'

export function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    (onChange) => {
      const mediaQuery = window.matchMedia(query)
      mediaQuery.addEventListener('change', onChange)

      return () => mediaQuery.removeEventListener('change', onChange)
    },
    () => window.matchMedia(query).matches,
    () => false,
  )
}
