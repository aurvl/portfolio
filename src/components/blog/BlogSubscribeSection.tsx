import { useId, useState, type FormEvent } from 'react'
import { MdKeyboardArrowRight } from "react-icons/md";
import { useTranslation } from 'react-i18next'

type BlogSubscribeSectionProps = {
  contextType: 'post' | 'series'
  contextTitle: string
  contextSlug: string
}

const FORMSPREE_ENDPOINT = 'https://formspree.io/f/xgvewzqo'
const DIRECT_CONTACT_EMAIL = 'aurelvehi@outlook.fr'

function BlogSubscribeSection({
  contextType,
  contextTitle,
  contextSlug,
}: BlogSubscribeSectionProps) {
  const { t, i18n } = useTranslation()
  const inputId = useId()
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')

  const isEmailValid = email.includes('@')
  const isSubmitting = status === 'submitting'

  const fallbackMailtoHref = `mailto:${DIRECT_CONTACT_EMAIL}?subject=${encodeURIComponent(
    t('blog.subscribe.mailSubject', { title: contextTitle })
  )}&body=${encodeURIComponent(
    t('blog.subscribe.mailBody', {
      email: email || '[your email]',
      type: contextType,
      title: contextTitle,
      slug: contextSlug,
      language: i18n.resolvedLanguage ?? 'en',
    })
  )}`

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!isEmailValid) {
      setStatus('error')
      return
    }

    setStatus('submitting')

    try {
      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          email,
          contextType,
          contextTitle,
          contextSlug,
          language: i18n.resolvedLanguage ?? 'en',
          source: 'blog-subscribe-section',
          message: 'Visitor wants to be notified about future blog posts.',
        }),
      })

      if (!response.ok) {
        throw new Error('Request failed')
      }

      setStatus('success')
      setEmail('')
    } catch {
      setStatus('error')
    }
  }

  return (
    <section className="subscribe-v2 mt-10 rounded-lg border border-[var(--glass-border)] bg-[var(--bg2-color)] px-5 py-6 md:px-8 md:py-8">
      <div className="subscribe-v2__layout flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-2xl">
          <p className="subscribe-v2__eyebrow text-xs uppercase tracking-[0.28em] text-[var(--text2-col)]">
            {t('blog.subscribe.eyebrow')}
          </p>
          <h2 className="subscribe-v2__title mt-4 text-3xl font-semibold tracking-tight text-[var(--text-col)] md:text-5xl">
            {t('blog.subscribe.title')}
          </h2>
          <p className="subscribe-v2__description mt-4 max-w-xl text-base leading-8 text-[var(--text2-col)] md:text-lg">
            {t('blog.subscribe.description')}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="subscribe-v2__form w-full max-w-xl">
          <label htmlFor={inputId} className="subscribe-v2__label text-sm font-semibold text-[var(--text-col)]">
            {t('blog.subscribe.emailLabel')}
          </label>

          <div className="subscribe-v2__group">
            <input
              id={inputId}
              type="email"
              name="email"
              autoComplete="email"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value)
                if (status !== 'idle') {
                  setStatus('idle')
                }
              }}
              placeholder={t('blog.subscribe.emailPlaceholder')}
              className="subscribe-v2__input"
            />

            <button
              type="submit"
              disabled={!isEmailValid || isSubmitting}
              className="subscribe-v2__submit"
            >
              <span className="bg-gradient-to-r from-[#e05aff] to-[#ff8c42] bg-clip-text font-semibold text-transparent">
                {isSubmitting ? t('blog.subscribe.submitting') : t('blog.subscribe.submit')}
              </span>
              <MdKeyboardArrowRight size={22} style={{ fill: 'url(#btn-gradient)', flexShrink: 0 }} aria-hidden="true" />
              <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true">
                <defs>
                  <linearGradient id="btn-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#e05aff" />
                    <stop offset="100%" stopColor="#ff8c42" />
                  </linearGradient>
                </defs>
              </svg>
            </button>
          </div>

          <p className="subscribe-v2__note">{t('blog.subscribe.note')}</p>

          {status === 'success' && (
            <p className="subscribe-v2__status subscribe-v2__status--ok">{t('blog.subscribe.success')}</p>
          )}

          {status === 'error' && (
            <p className="subscribe-v2__status subscribe-v2__status--error">
              {t('blog.subscribe.error')}{' '}
              <a href={fallbackMailtoHref} className="underline underline-offset-4">
                {t('blog.subscribe.emailFallback')}
              </a>
            </p>
          )}
        </form>
      </div>
    </section>
  )
}

export default BlogSubscribeSection
