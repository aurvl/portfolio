import { useEffect, useRef } from 'react'
import { useLocation, useNavigationType } from 'react-router-dom'

const SCROLL_RESTORE_DELAY_MS = 0

function ScrollManager() {
  const location = useLocation()
  const navigationType = useNavigationType()
  const scrollPositions = useRef<Record<string, number>>({})

  useEffect(() => {
    if (!('scrollRestoration' in window.history)) {
      return
    }

    const previousScrollRestoration = window.history.scrollRestoration
    window.history.scrollRestoration = 'manual'

    return () => {
      window.history.scrollRestoration = previousScrollRestoration
    }
  }, [])

  useEffect(() => {
    const positions = scrollPositions.current

    return () => {
      positions[location.key] = window.scrollY
    }
  }, [location.key])

  useEffect(() => {
    let retryId: number | undefined

    const timeoutId = window.setTimeout(() => {
      if (location.hash) {
        const targetId = decodeURIComponent(location.hash.slice(1))
        let attempts = 0

        // Arrivée directe sur une adresse avec ancre (ex. /projects#blog) : la page est chargée à la demande et son
        // contenu peut arriver après ce premier essai. On réessaie toutes les 100 ms (2 s au plus) jusqu'à trouver l'ancre.
        const scrollToTarget = () => {
          const target = document.getElementById(targetId)

          if (target) {
            target.scrollIntoView({ block: 'start' })
            return
          }

          attempts += 1

          if (attempts < 20) {
            retryId = window.setTimeout(scrollToTarget, 100)
          }
        }

        scrollToTarget()
        return
      }

      if (navigationType === 'POP') {
        window.scrollTo({ top: scrollPositions.current[location.key] ?? 0, left: 0 })
        return
      }

      window.scrollTo({ top: 0, left: 0 })
    }, SCROLL_RESTORE_DELAY_MS)

    return () => {
      window.clearTimeout(timeoutId)
      window.clearTimeout(retryId)
    }
  }, [location.hash, location.key, navigationType])

  return null
}

export default ScrollManager
