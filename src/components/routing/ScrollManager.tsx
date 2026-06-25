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
    const timeoutId = window.setTimeout(() => {
      if (location.hash) {
        const target = document.getElementById(decodeURIComponent(location.hash.slice(1)))

        if (target) {
          target.scrollIntoView({ block: 'start' })
        }

        return
      }

      if (navigationType === 'POP') {
        window.scrollTo({ top: scrollPositions.current[location.key] ?? 0, left: 0 })
        return
      }

      window.scrollTo({ top: 0, left: 0 })
    }, SCROLL_RESTORE_DELAY_MS)

    return () => window.clearTimeout(timeoutId)
  }, [location.hash, location.key, navigationType])

  return null
}

export default ScrollManager
