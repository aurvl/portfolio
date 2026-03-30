import { useId, useState, type SubmitEvent } from 'react'
import { useTranslation } from 'react-i18next'

type ProjectWindowAccessGateProps = {
  projectSlug: string
  projectTitle: string
}

const FORMSPREE_ENDPOINT = 'https://formspree.io/f/xgvewzqo'
const DIRECT_CONTACT_EMAIL = 'aurelvehi@outlook.fr'

function ProjectWindowAccessGate({
  projectSlug,
  projectTitle,
}: ProjectWindowAccessGateProps) {
  const { t, i18n } = useTranslation()
  const inputId = useId()
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')

  const isEmailValid = email.includes('@')
  const isSubmitting = status === 'submitting'
  
  const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
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
          projectSlug,
          projectTitle,
          language: i18n.resolvedLanguage ?? 'en',
          source: 'project-window-access-gate',
          message: `Project access request for ${projectTitle} (${projectSlug}).`,
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

  const fallbackMailtoHref = `mailto:${DIRECT_CONTACT_EMAIL}?subject=${encodeURIComponent(
    `Project access request - ${projectTitle}`
  )}&body=${encodeURIComponent(
    `Project: ${projectTitle} (${projectSlug})\nEmail: ${email || '[your email]'}`
  )}`

  return (
    <section className="rounded-[18px] border border-[var(--glass-border)] bg-[var(--bg2-color)] p-5 sm:p-6">
      <div className="max-w-2xl">
        <p className="text-xl font-semibold text-[var(--text-col)]">
          {t('projects.window.locked.title')}
        </p>
        <p className="mt-3 text-sm leading-7 text-[var(--text2-col)] sm:text-base">
          {t('projects.window.locked.description')}
        </p>
      </div>

      <form className="mt-5 flex flex-col gap-3" onSubmit={handleSubmit}>
        <label
          htmlFor={inputId}
          className="text-sm font-medium uppercase tracking-[0.16em] text-[var(--text2-col)]"
        >
          {t('projects.window.locked.emailLabel')}
        </label>

        <div className="flex flex-col gap-3 sm:flex-row">
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
            placeholder={t('projects.window.locked.emailPlaceholder')}
            className="min-w-0 flex-1 rounded-xl border border-[var(--glass-border)] bg-[var(--glass-bg)] px-4 py-3 text-[var(--text-col)] outline-none transition-colors duration-200 placeholder:text-[var(--text2-col)] focus:border-[var(--accent-blue)]"
          />

          <button
            type="submit"
            disabled={!isEmailValid || isSubmitting}
            className={`rounded-xl px-5 py-3 font-semibold transition-colors duration-200 ${
              !isEmailValid || isSubmitting
                ? 'cursor-not-allowed bg-white/10 text-[var(--text2-col)]'
                : 'bg-[var(--text-col)] text-[var(--bg-color)] hover:bg-white/90'
            }`}
          >
            {isSubmitting
              ? t('projects.window.locked.submitting')
              : t('projects.window.locked.submit')}
          </button>
        </div>
      </form>

      {status === 'success' && (
        <p className="mt-4 text-sm text-[#4ade80]">
          {t('projects.window.locked.success')}
        </p>
      )}

      {status === 'error' && (
        <p className="mt-4 text-sm text-[#fca5a5]">
          {t('projects.window.locked.error')}{' '}
          <a
            href={fallbackMailtoHref}
            className="underline decoration-[var(--glass-border)] underline-offset-4"
          >
            {t('projects.window.locked.emailFallback')}
          </a>
        </p>
      )}
    </section>
  )
}

export default ProjectWindowAccessGate
