// Pied de page de tout le site : fin de bandeau bambous (on « ressort de la forêt »), puis quatre colonnes
// (marque, navigation, profils, contact) et une ligne du bas (© et cookies, langue, retour en haut).
// Référence : design/BRIEF.md (style éditorial) et la maquette du pied de page dans design/PLAN.md, étape 8b.
import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { FiArrowRight, FiArrowUp } from 'react-icons/fi'
import { Link } from 'react-router-dom'
import { SOCIAL_LINKS } from '../../data/home'
import { useSiteNav } from '../../hooks/useSiteNav'
import { openConsentBanner } from '../../lib/consent'
import { withBasePath } from '../../lib/site'
import type { AppLanguage } from '../../types/i18n'
import AnimatedLogo from './AnimatedLogo'

const LANGUAGES: AppLanguage[] = ['fr', 'en']

// Lien vers un autre site : s'ouvre dans un nouvel onglet
function ExternalLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a
      className="site-footer__link"
      href={href}
      target="_blank"
      rel="noreferrer"
    >
      {children}
    </a>
  )
}

function Footer() {
  const { t, i18n } = useTranslation()
  const { pageSections } = useSiteNav()
  const currentLanguage: AppLanguage = i18n.resolvedLanguage === 'fr' ? 'fr' : 'en'

  // Mêmes entrées que la navbar, sans l'accueil (le logo y mène) ni le contact (il a sa propre colonne)
  const navigationLinks = pageSections.filter((section) => section.id !== 'home' && section.id !== 'contact-form')

  return (
    <footer className="site-footer">
      {/* Fin du bandeau de bambous : même photo et même voile que les autres bannières, déjà chargée plus haut */}
      <div
        className="site-footer__forest"
        aria-hidden="true"
      >
        <img
          className="site-footer__forest-image"
          src={withBasePath('assets/images/hero-bamboo.webp')}
          alt=""
          loading="lazy"
          decoding="async"
        />
      </div>

      <div className="site-footer__inner">
        <div className="site-footer__grid">
          <div className="site-footer__brand">
            <AnimatedLogo />
            <p className="site-footer__tagline">{t('footer.tagline')}</p>
          </div>

          <nav
            className="site-footer__column"
            aria-label={t('footer.navigation')}
          >
            <h2 className="eyebrow">{t('footer.navigation')}</h2>
            <ul className="site-footer__list">
              {navigationLinks.map((section) => (
                <li key={section.id}>
                  {section.download && section.href ? (
                    <a
                      className="site-footer__link"
                      href={section.href}
                      download
                    >
                      {t('footer.resume')}
                    </a>
                  ) : (
                    <Link
                      className="site-footer__link"
                      to={section.href ?? '/'}
                    >
                      {section.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          <div className="site-footer__column">
            <h2 className="eyebrow">{t('footer.profiles')}</h2>
            <ul className="site-footer__list">
              <li>
                <ExternalLink href={SOCIAL_LINKS.orcid}>ORCID</ExternalLink>
              </li>
              <li>
                <ExternalLink href={SOCIAL_LINKS.researchgate}>ResearchGate</ExternalLink>
              </li>
              <li>
                <ExternalLink href={SOCIAL_LINKS.github}>GitHub</ExternalLink>
              </li>
              <li>
                <ExternalLink href={SOCIAL_LINKS.threads}>Threads</ExternalLink>
              </li>
            </ul>
          </div>

          <div className="site-footer__column">
            <h2 className="eyebrow">{t('footer.contact')}</h2>
            <ul className="site-footer__list">
              <li>
                <a
                  className="site-footer__link"
                  href={`mailto:${SOCIAL_LINKS.email}`}
                >
                  {t('footer.email')}
                </a>
              </li>
              <li>
                <ExternalLink href={SOCIAL_LINKS.linkedin}>LinkedIn</ExternalLink>
              </li>
              <li>
                <Link
                  className="site-footer__link site-footer__link--action"
                  to="/#contact-form"
                >
                  {t('footer.contactMe')}
                  <FiArrowRight aria-hidden="true" />
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="site-footer__bottom">
        <div className="site-footer__bottom-inner">
          <p className="site-footer__legal">
            {t('footer.copyright')}
            <span aria-hidden="true"> · </span>
            <button
              type="button"
              className="site-footer__link"
              onClick={openConsentBanner}
            >
              {t('consent.settings')}
            </button>
          </p>

          <div className="site-footer__actions">
            <div
              className="site-footer__languages"
              role="group"
              aria-label={t('navbar.language')}
            >
              {LANGUAGES.map((language, index) => (
                <span key={language}>
                  {index > 0 ? <span aria-hidden="true"> | </span> : null}
                  <button
                    type="button"
                    className="site-footer__link"
                    lang={language}
                    aria-pressed={language === currentLanguage}
                    onClick={() => void i18n.changeLanguage(language)}
                  >
                    {language.toUpperCase()}
                  </button>
                </span>
              ))}
            </div>

            <button
              type="button"
              className="site-footer__link site-footer__link--action"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              <FiArrowUp aria-hidden="true" />
              {t('footer.backToTop')}
            </button>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
