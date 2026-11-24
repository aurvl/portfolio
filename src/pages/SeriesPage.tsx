// Page d'une série d'articles (/series/:slug) : bandeau de bambous, recherche dans tous les articles EN TÊTE, puis titre
// serif et liste numérotée des articles de la série dans l'ordre de lecture, puis l'abonnement. Styles : styles/v3/blog.css.
import { FiArrowLeft, FiArrowRight } from 'react-icons/fi'
import { useTranslation } from 'react-i18next'
import { Link, useParams } from 'react-router-dom'
import MainLayout from '../components/layout/MainLayout'
import { useSiteNav } from '../hooks/useSiteNav'
import BlogBanner from '../components/blog/BlogBanner'
import BlogSearchPanel from '../components/blog/BlogSearchPanel'
import PostRow from '../components/blog/PostRow'
import BlogSubscribeSection from '../components/blog/BlogSubscribeSection'
import Seo from '../components/seo/Seo'
import series from '../data/series.json'
import { useBlogIndex } from '../hooks/useBlogIndex'
import { PERSON_NAME, buildAbsoluteSiteUrl, withBasePath } from '../lib/site'
import { getLocalizedField } from '../lib/utils'
import type { Series } from '../types/series'

const blogSeries = series as Series[]

function SeriesPage() {
  const { t, i18n } = useTranslation()
  const { seriesSlug } = useParams()
  const { index } = useBlogIndex(i18n.language)
  const currentSeries = blogSeries.find((item) => item.slug === seriesSlug) ?? null
  const seriesPosts = [...index]
    .filter((post) => post.seriesSlug === seriesSlug)
    .sort((postA, postB) => {
      const dateDiff = new Date(postA.date).getTime() - new Date(postB.date).getTime()

      if (dateDiff !== 0) {
        return dateDiff
      }

      return postA.slug.localeCompare(postB.slug)
    })

  const { pageSections: sections } = useSiteNav()

  const seriesTitle = currentSeries
    ? getLocalizedField(currentSeries.title, i18n.language)
    : t('blog.series.fallbackTitle')
  const seriesDescription = currentSeries
    ? getLocalizedField(currentSeries.description, i18n.language)
    : t('blog.catalog.empty.description')

  return (
    <MainLayout
      sections={sections}
      className="home-v2"
      overlayNavbar
    >
      <Seo
        title={`${seriesTitle} | ${PERSON_NAME}`}
        description={seriesDescription}
        path={seriesSlug ? `series/${seriesSlug}` : 'projects'}
        lang={i18n.language}
        image={currentSeries ? buildAbsoluteSiteUrl(currentSeries.cover) : undefined}
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: seriesTitle,
          url: buildAbsoluteSiteUrl(seriesSlug ? `series/${seriesSlug}` : 'projects'),
          description: seriesDescription,
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

            <Link
              to="/series"
              className="blog-page__link"
            >
              {t('blog.series.all')}
              <FiArrowRight aria-hidden="true" />
            </Link>
          </div>

          <BlogSearchPanel>
            <header className={currentSeries ? 'blog-page__head blog-page__head--with-cover' : 'blog-page__head'}>
              <div>
                <p className="eyebrow">{t('blog.series.eyebrow')}</p>
                <h1 className="blog-page__title">{seriesTitle}</h1>
                {currentSeries ? <p className="blog-page__lead">{seriesDescription}</p> : null}
                <p className="blog-page__meta tabular">{t('blog.series.count', { count: seriesPosts.length })}</p>
              </div>

              {currentSeries ? (
                <img
                  className="blog-page__cover"
                  src={withBasePath(currentSeries.cover)}
                  alt=""
                />
              ) : null}
            </header>

            {seriesPosts.length > 0 ? (
              <ol className="series-list">
                {seriesPosts.map((post, postIndex) => (
                  <PostRow
                    key={post.slug}
                    post={post}
                    number={postIndex + 1}
                  />
                ))}
              </ol>
            ) : (
              <div className="blog-page__empty">
                <h2>{t('blog.catalog.empty.title')}</h2>
                <p>{t('blog.catalog.empty.description')}</p>
              </div>
            )}
          </BlogSearchPanel>

          <BlogSubscribeSection
            contextType="series"
            contextTitle={seriesTitle}
            contextSlug={seriesSlug ?? 'series'}
          />
        </div>
      </div>
    </MainLayout>
  )
}

export default SeriesPage
