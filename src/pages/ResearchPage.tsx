import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import MainLayout from '../components/layout/MainLayout'
import Seo from '../components/seo/Seo'
import { PERSON_NAME, buildAbsoluteSiteUrl } from '../lib/site'

function ResearchPage() {
  const { t, i18n } = useTranslation()
  const sections = [
    { id: 'home', label: t('nav.home'), href: '/' },
    { id: 'about', label: t('nav.about'), href: '/#about' },
    { id: 'research', label: t('nav.research') },
    { id: 'scientific-publications', label: t('nav.publications'), href: '/#scientific-publications' },
    { id: 'work', label: t('nav.projects'), href: '/projects' },
    { id: 'notes', label: t('nav.blog'), href: '/blog' },
    { id: 'contact', label: t('nav.contact'), href: '/#contact-form' },
  ]

  return (
    <MainLayout sections={sections}>
      <Seo
        title={`${t('researchPage.seoTitle')} | ${PERSON_NAME}`}
        description={t('researchPage.seoDescription')}
        path="research"
        lang={i18n.language}
        image={buildAbsoluteSiteUrl('assets/images/hero-image.png')}
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'ProfilePage',
          name: `${PERSON_NAME} — ${t('researchPage.seoTitle')}`,
          url: buildAbsoluteSiteUrl('research'),
          description: t('researchPage.seoDescription'),
        }}
      />

      <section id="research" className="section-shell research-page-hero">
        <p className="research-kicker">{t('researchPage.eyebrow')}</p>
        <h1>{t('researchPage.title')}</h1>
        <p className="research-page-hero__lead">{t('researchPage.description')}</p>
        <p className="research-page-hero__notice">{t('researchPage.notice')}</p>
      </section>

      <section className="section-shell research-page-section" aria-labelledby="research-agenda-title">
        <div className="research-section-heading">
          <p className="research-kicker">{t('researchPage.agenda.eyebrow')}</p>
          <h2 id="research-agenda-title">{t('researchPage.agenda.title')}</h2>
        </div>
        <div className="research-agenda-grid">
          {['observe', 'understand', 'support'].map((item, index) => (
            <article key={item} className="research-agenda-card">
              <span>0{index + 1}</span>
              <h3>{t(`researchPage.agenda.items.${item}.title`)}</h3>
              <p>{t(`researchPage.agenda.items.${item}.description`)}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section-shell research-page-section research-page-section--principles" aria-labelledby="research-principles-title">
        <div className="research-section-heading">
          <p className="research-kicker">{t('researchPage.principles.eyebrow')}</p>
          <h2 id="research-principles-title">{t('researchPage.principles.title')}</h2>
        </div>
        <div className="research-principles-grid">
          {['transparent', 'contextual', 'useful'].map((item) => (
            <article key={item}>
              <h3>{t(`researchPage.principles.items.${item}.title`)}</h3>
              <p>{t(`researchPage.principles.items.${item}.description`)}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section-shell research-page-section research-publications" aria-labelledby="research-publications-title">
        <div className="research-section-heading">
          <p className="research-kicker">{t('researchPage.publications.eyebrow')}</p>
          <h2 id="research-publications-title">{t('researchPage.publications.title')}</h2>
        </div>
        <a
          className="research-publication-reference"
          href="https://doi.org/10.1038/s44458-026-00117-8"
          target="_blank"
          rel="noreferrer"
        >
          {t('researchPage.publications.blueCarbonReference')}
        </a>
      </section>

      <section className="section-shell research-page-cta">
        <p>{t('researchPage.cta.description')}</p>
        <div>
          <Link to="/projects" className="research-button research-button--primary">
            {t('researchPage.cta.work')}
          </Link>
          <Link to="/blog" className="research-button research-button--secondary">
            {t('researchPage.cta.notes')}
          </Link>
        </div>
      </section>
    </MainLayout>
  )
}

export default ResearchPage
