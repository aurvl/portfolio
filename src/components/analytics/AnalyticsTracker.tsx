import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useAnalyticsConsent } from '../../lib/consent'
import { getClarityProjectId, getGoogleAnalyticsMeasurementId } from '../../lib/site'

declare global {
  interface Window {
    dataLayer: unknown[]
    gtag?: (...args: unknown[]) => void
  }
}

const ANALYTICS_SCRIPT_ID = 'google-analytics-script'
const CLARITY_SCRIPT_ID = 'microsoft-clarity-script'

type ClarityFunction = ((...args: unknown[]) => void) & { q?: unknown[][] }

function AnalyticsTracker() {
  const location = useLocation()
  // Nothing is loaded or tracked until the visitor accepts the cookie banner, and never on a
  // local preview (dev server, local builds) so tests do not pollute the statistics.
  const isLiveSite = import.meta.env.PROD && !['localhost', '127.0.0.1'].includes(window.location.hostname)
  const hasConsent = useAnalyticsConsent() === 'granted' && isLiveSite
  const measurementId = hasConsent ? getGoogleAnalyticsMeasurementId().trim() : ''
  const clarityProjectId = hasConsent ? getClarityProjectId().trim() : ''

  useEffect(() => {
    if (!measurementId) {
      return
    }

    window.dataLayer = window.dataLayer || []
    window.gtag =
      window.gtag ||
      function gtag(...args: unknown[]) {
        window.dataLayer.push(args)
      }

    if (!document.getElementById(ANALYTICS_SCRIPT_ID)) {
      const script = document.createElement('script')
      script.id = ANALYTICS_SCRIPT_ID
      script.async = true
      script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`
      document.head.appendChild(script)
    }

    window.gtag('js', new Date())
    window.gtag('config', measurementId, { send_page_view: false })
  }, [measurementId])

  useEffect(() => {
    if (!clarityProjectId) {
      return
    }

    const clarityWindow = window as Window & { clarity?: ClarityFunction }
    const existingClarity = clarityWindow.clarity
    const clarity: ClarityFunction =
      existingClarity ||
      (((...args: unknown[]) => {
        const current = clarity as ClarityFunction
        const queue = (current.q = current.q || [])
        queue.push(args)
      }) as ClarityFunction)

    clarityWindow.clarity = clarity

    // This effect only runs after the visitor accepted the banner. Since Oct 2025 Clarity needs an
    // explicit signal for EEA/UK/CH visitors, otherwise each page view counts as a separate visitor.
    clarity('consentv2', { ad_Storage: 'denied', analytics_Storage: 'granted' })

    if (!document.getElementById(CLARITY_SCRIPT_ID)) {
      const script = document.createElement('script')
      script.id = CLARITY_SCRIPT_ID
      script.async = true
      script.src = `https://www.clarity.ms/tag/${clarityProjectId}`
      document.head.appendChild(script)
    }
  }, [clarityProjectId])

  useEffect(() => {
    if (!measurementId || !window.gtag) {
      return
    }

    const timeoutId = window.setTimeout(() => {
      window.gtag?.('config', measurementId, {
        page_location: window.location.href,
        page_path: `${window.location.pathname}${window.location.search}`,
        page_title: document.title,
      })
    }, 0)

    return () => {
      window.clearTimeout(timeoutId)
    }
  }, [location, measurementId])

  return null
}

export default AnalyticsTracker
