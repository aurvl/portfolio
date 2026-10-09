import { useSyncExternalStore } from 'react'

// Analytics consent (Google Analytics + Microsoft Clarity), stored per visitor.
export type AnalyticsConsent = 'granted' | 'denied' | null

const CONSENT_STORAGE_KEY = 'analytics-consent'
const CONSENT_CHANGE_EVENT = 'analytics-consent-change'
export const CONSENT_OPEN_EVENT = 'analytics-consent-open'

export function getAnalyticsConsent(): AnalyticsConsent {
  try {
    const value = window.localStorage.getItem(CONSENT_STORAGE_KEY)
    return value === 'granted' || value === 'denied' ? value : null
  } catch {
    return null
  }
}

export function setAnalyticsConsent(value: Exclude<AnalyticsConsent, null>) {
  const previous = getAnalyticsConsent()

  try {
    window.localStorage.setItem(CONSENT_STORAGE_KEY, value)
  } catch {
    // Storage blocked: the choice only lasts for this page view.
  }

  window.dispatchEvent(new Event(CONSENT_CHANGE_EVENT))

  // Scripts already loaded cannot be unloaded: reload so they are gone after a withdrawal.
  if (previous === 'granted' && value === 'denied') {
    window.location.reload()
  }
}

// Lets the footer reopen the banner to change the choice.
export function openConsentBanner() {
  window.dispatchEvent(new Event(CONSENT_OPEN_EVENT))
}

function subscribe(callback: () => void) {
  window.addEventListener(CONSENT_CHANGE_EVENT, callback)
  window.addEventListener('storage', callback)
  return () => {
    window.removeEventListener(CONSENT_CHANGE_EVENT, callback)
    window.removeEventListener('storage', callback)
  }
}

export function useAnalyticsConsent() {
  return useSyncExternalStore(subscribe, getAnalyticsConsent, () => null)
}
