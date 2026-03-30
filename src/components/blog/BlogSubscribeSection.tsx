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
    <section className="mt-10 rounded-lg border border-[var(--glass-border)] bg-[var(--bg2-color)] px-5 py-6 shadow-[0_0_0_1px_rgba(255,255,255,0.03)] md:px-8 md:py-8">
      <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-2xl">
          <p className="text-xs uppercase tracking-[0.28em] text-[var(--text2-col)]">
            {t('blog.subscribe.eyebrow')}
          </p>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-[var(--text-col)] md:text-5xl">
            {t('blog.subscribe.title')}
          </h2>
          <p className="mt-4 max-w-xl text-base leading-8 text-[var(--text2-col)] md:text-lg">
            {t('blog.subscribe.description')}
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="w-full max-w-xl rounded-lg border border-[var(--glass-border)] bg-[var(--bg-color)]/50 p-4 backdrop-blur-xl md:p-5"
        >
          <label
            htmlFor={inputId}
            className="text-sm font-semibold text-[var(--text-col)]"
          >
            {t('blog.subscribe.emailLabel')}
          </label>

          <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center">
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
              className="min-w-0 flex-1 rounded-lg border border-[var(--glass-border)] bg-[var(--glass-bg)] px-4 py-3 text-[var(--text-col)] outline-none transition-colors duration-200 placeholder:text-[var(--text2-col)] focus:border-[var(--accent-blue)]"
            />

            <button
              type="submit"
              disabled={!isEmailValid || isSubmitting}
              className={`inline-flex items-center justify-center gap-2 px-5 py-3 transition-all duration-200 ${
                !isEmailValid || isSubmitting
                  ? 'cursor-not-allowed opacity-40'
                  : 'hover:gap-3'
              }`}
            >
              <span className="bg-gradient-to-r from-[#e05aff] to-[#ff8c42] bg-clip-text text-xl font-semibold text-transparent">
                {isSubmitting ? t('blog.subscribe.submitting') : t('blog.subscribe.submit')}
              </span>
              <span className="bg-gradient-to-r from-[#e05aff] to-[#ff8c42] bg-clip-text text-transparent">
                <MdKeyboardArrowRight
                  size={22}
                  style={{
                    fill: 'url(#btn-gradient)',
                    flexShrink: 0,
                  }}
                />
                {/* À mettre une seule fois dans le composant, hors du bouton */}
                <svg width="0" height="0" style={{ position: 'absolute' }}>
                  <defs>
                    <linearGradient id="btn-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#e05aff" />
                      <stop offset="100%" stopColor="#ff8c42" />
                    </linearGradient>
                  </defs>
                </svg>
              </span>
            </button>
          </div>

          <p className="mt-4 text-sm leading-7 text-[var(--text2-col)]">
            {t('blog.subscribe.note')}
          </p>

          {status === 'success' && (
            <p className="mt-4 text-sm text-[#4ade80]">
              {t('blog.subscribe.success')}
            </p>
          )}

          {status === 'error' && (
            <p className="mt-4 text-sm text-[#fca5a5]">
              {t('blog.subscribe.error')}{' '}
              <a
                href={fallbackMailtoHref}
                className="underline decoration-[var(--glass-border)] underline-offset-4"
              >
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
