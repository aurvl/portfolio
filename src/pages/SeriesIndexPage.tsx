// Page « Toutes les séries » (/series) : bandeau de bambous, recherche dans tous les articles EN TÊTE, puis la liste de
// toutes les séries (image, titre serif, description, nombre d'articles). Styles : styles/v3/blog.css.
import { FiArrowLeft } from 'react-icons/fi'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import MainLayout from '../components/layout/MainLayout'
import { useSiteNav } from '../hooks/useSiteNav'
import BlogBanner from '../components/blog/BlogBanner'
import BlogSearchPanel from '../components/blog/BlogSearchPanel'
import Seo from '../components/seo/Seo'
import series from '../data/series.json'
import { useBlogIndex } from '../hooks/useBlogIndex'
import { PERSON_NAME, buildAbsoluteSiteUrl, withBasePath } from '../lib/site'
import { getLocalizedField } from '../lib/utils'
import type { Series } from '../types/series'

const allSeries = series as Series[]

function SeriesIndexPage() {
  const { t, i18n } = useTranslation()
  const { index } = useBlogIndex(i18n.language)
  const { pageSections: sections } = useSiteNav()

  const pageTitle = t('blog.section.series.title')
  const pageDescription = t('blog.section.series.subtitle')

  return (
    <MainLayout
      sections={sections}
      className="home-v2"
      overlayNavbar
    >
      <Seo
        title={`${pageTitle} | ${PERSON_NAME}`}
        description={pageDescription}
        path="series"
        lang={i18n.language}
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: pageTitle,
          url: buildAbsoluteSiteUrl('series'),
          description: pageDescription,
        }}
      />

      <div className="blog-page">
        <BlogBanner />

        <div className="blog-page__wrap">
          <div className="blog-page__nav">
            <Link
              to="/projects#blog"
              className="blog-page__link"
            >
              <FiArrowLeft aria-hidden="true" />
              {t('blog.backToBlog')}
            </Link>
          </div>

          <BlogSearchPanel>
            <header className="blog-page__head">
              <p className="eyebrow">{t('blog.series.eyebrow')}</p>
              <h1 className="blog-page__title">{pageTitle}</h1>
              <p className="blog-page__lead">{pageDescription}</p>
            </header>

            <ul className="series-index">
              {allSeries.map((item) => {
                const title = getLocalizedField(item.title, i18n.language)
                const postCount = index.filter((post) => post.seriesSlug === item.slug).length

                return (
                  <li
                    key={item.id}
                    className="series-index__item"
                  >
                    <img
                      className="series-index__image"
                      src={withBasePath(item.cover)}
                      alt=""
                      loading="lazy"
                    />

                    <div>
                      <h2 className="series-list__title">
                        {/* Lien étiré : le ::after couvre toute la ligne (voir blog.css) */}
                        <Link
                          to={`/series/${item.slug}`}
                          className="series-list__link"
                        >
                          {title}
                        </Link>
                      </h2>
                      <p className="series-list__summary">{getLocalizedField(item.description, i18n.language)}</p>
                      <p className="series-list__meta tabular">{t('blog.series.count', { count: postCount })}</p>
                    </div>
                  </li>
                )
              })}
            </ul>
          </BlogSearchPanel>
        </div>
      </div>
    </MainLayout>
  )
}

export default SeriesIndexPage
