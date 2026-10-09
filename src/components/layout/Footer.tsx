import { useTranslation } from 'react-i18next'
import { openConsentBanner } from '../../lib/consent'

function Footer() {
  const { t } = useTranslation()

  return (
    <footer className="border-t border-[var(--glass-border)] py-8">
      <div className="section-shell flex flex-col items-center justify-center gap-4 text-sm text-[var(--text2-col)] md:flex-row md:items-center md:justify-between">
        <p>{t('footer.copyright')}</p>

        <div className="flex items-center gap-4">
          <a
            href="https://github.com/aurvl"
            target="_blank"
            rel="noreferrer"
            className="transition hover:text-[var(--text-col)]"
          >
            GitHub
          </a>
          <a
            href="https://www.linkedin.com/in/aurel-vehi/"
            target="_blank"
            rel="noreferrer"
            className="transition hover:text-[var(--text-col)]"
          >
            LinkedIn
          </a>
          <a
            href="https://www.threads.com/@aur_rel_"
            target="_blank"
            rel="noreferrer"
            className="transition hover:text-[var(--text-col)]"
          >
            Threads
          </a>
          <a
            href="mailto:aurelvehi@outlook.fr"
            className="transition hover:text-[var(--text-col)]"
          >
            Email
          </a>
          <button
            type="button"
            onClick={openConsentBanner}
            className="transition hover:text-[var(--text-col)]"
          >
            {t('consent.settings')}
          </button>
        </div>
      </div>
    </footer>
  )
}

export default Footer
