import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
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
  const measurementId = getGoogleAnalyticsMeasurementId().trim()
  const clarityProjectId = getClarityProjectId().trim()

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
