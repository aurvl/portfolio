import { useState } from 'react'
import { FiExternalLink, FiGrid, FiList } from 'react-icons/fi'
import MainLayout from '../components/layout/MainLayout'
import Seo from '../components/seo/Seo'
import { PublicationCard } from '../components/home-v2/PublicationsSection'
import Reveal from '../components/home-v2/Reveal'
import { useHomeContent } from '../hooks/useHomeContent'
import { useSiteNav } from '../hooks/useSiteNav'
import { PERSON_NAME, buildAbsoluteSiteUrl } from '../lib/site'

type ViewMode = 'grid' | 'list'

const VIEW_STORAGE_KEY = 'publications-view'

// Remembered per visitor; falls back to the grid when storage is unavailable.
function readStoredView(): ViewMode {
  try {
    return window.localStorage.getItem(VIEW_STORAGE_KEY) === 'list' ? 'list' : 'grid'
  } catch {
    return 'grid'
  }
}

function PublicationsPage() {
  const { content, lang } = useHomeContent()
  const { publications, publicationsPage: page } = content
  const { pageSections, pageCta } = useSiteNav()
  const [view, setView] = useState<ViewMode>(readStoredView)

  const changeView = (nextView: ViewMode) => {
    setView(nextView)
    try {
      window.localStorage.setItem(VIEW_STORAGE_KEY, nextView)
    } catch {
      // Storage blocked: the choice only lasts for this visit.
    }
  }

  return (
    <MainLayout sections={pageSections} className="home-v2" cta={pageCta}>
      <Seo
        title={`${page.seoTitle} | ${PERSON_NAME}`}
        description={page.seoDescription}
        path="publications"
        lang={lang}
        image={buildAbsoluteSiteUrl('assets/images/hero-image.png')}
      />

      <section className="hv-section publications-v2">
        <div className="hv-wrap">
          <Reveal className="publications-v2__head">
            <div>
              <p className="hv-eyebrow">{page.eyebrow}</p>
              <h1 className="hv-h2">{page.title}</h1>
              <p className="publications-v2__intro">{page.intro}</p>
            </div>
            <div className="publications-v2__tools">
              <span className="publications-v2__count">
                {page.count.replace('{count}', String(publications.items.length))}
              </span>
              <div className="publications-v2__toggle" role="group" aria-label={page.viewLabel}>
                <button type="button" aria-pressed={view === 'grid'} onClick={() => changeView('grid')}>
                  <FiGrid aria-hidden="true" /> {page.grid}
                </button>
                <button type="button" aria-pressed={view === 'list'} onClick={() => changeView('list')}>
                  <FiList aria-hidden="true" /> {page.list}
                </button>
              </div>
            </div>
          </Reveal>

          {view === 'grid' ? (
            <Reveal className="hv-pubs">
              {publications.items.map((item) => (
                <PublicationCard key={item.url} item={item} readArticle={publications.readArticle} />
              ))}
            </Reveal>
          ) : (
            <Reveal className="publications-v2__list">
              {publications.items.map((item) => (
                <a key={item.url} className="publications-v2__row" href={item.url} target="_blank" rel="noreferrer">
                  <span className="publications-v2__year">{item.reference.match(/\((\d{4})\)/)?.[1] ?? ''}</span>
                  <span className="publications-v2__main">
                    <b>{item.title}</b>
                    <span className="hv-pub__cite">
                      {item.authorsBefore}
                      <b>{item.me}</b>
                      {item.authorsAfter} <i>{item.journal}</i> {item.reference}
                    </span>
                  </span>
                  <FiExternalLink className="hv-arrow publications-v2__open" aria-hidden="true" />
                </a>
              ))}
            </Reveal>
          )}
        </div>
      </section>
    </MainLayout>
  )
}

export default PublicationsPage
