import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { CONSENT_OPEN_EVENT, setAnalyticsConsent, useAnalyticsConsent } from '../../lib/consent'

// Bottom bar asking whether audience statistics (GA4, Clarity) may be used.
function CookieBanner() {
  const { t } = useTranslation()
  const consent = useAnalyticsConsent()
  const [isReopened, setIsReopened] = useState(false)

  useEffect(() => {
    const reopen = () => setIsReopened(true)
    window.addEventListener(CONSENT_OPEN_EVENT, reopen)
    return () => window.removeEventListener(CONSENT_OPEN_EVENT, reopen)
  }, [])

  if (consent !== null && !isReopened) {
    return null
  }

  const choose = (value: 'granted' | 'denied') => {
    setIsReopened(false)
    setAnalyticsConsent(value)
  }

  return (
    <div className="cookie-banner" role="dialog" aria-live="polite" aria-label={t('consent.title')}>
      <p className="cookie-banner__text">
        <b>{t('consent.title')}</b> {t('consent.text')}
      </p>
      <div className="cookie-banner__actions">
        <button type="button" className="cookie-banner__btn" onClick={() => choose('denied')}>
          {t('consent.decline')}
        </button>
        <button type="button" className="cookie-banner__btn cookie-banner__btn--primary" onClick={() => choose('granted')}>
          {t('consent.accept')}
        </button>
      </div>
    </div>
  )
}

export default CookieBanner
