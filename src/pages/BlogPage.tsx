import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import MainLayout from '../components/layout/MainLayout'
import Seo from '../components/seo/Seo'
import LastBlogPosts from '../components/blog/LastBlogPosts'
import BlogFilters from '../components/blog/BlogFilters'
import BlogSeriesCard from '../components/blog/BlogSeriesCard'
import PostGrid from '../components/blog/PostGrid'
import series from '../data/series.json'
import { useBlogIndex } from '../hooks/useBlogIndex'
import { PERSON_NAME, buildAbsoluteSiteUrl } from '../lib/site'
import { getLocalizedField } from '../lib/utils'
import type { Series } from '../types/series'

const blogSeries = series as Series[]
const PAGE_SIZE = 9
const LOAD_MORE_STEP = 3

function BlogPage() {
  const { t, i18n } = useTranslation()
  const { index, latest, tags, isLoading, error } = useBlogIndex(i18n.language)
  const [searchValue, setSearchValue] = useState('')
  const [selectedTag, setSelectedTag] = useState('')
  const [visiblePostsCount, setVisiblePostsCount] = useState(PAGE_SIZE)

  const blogSections = [
    { id: 'home', label: t('nav.home'), href: '/' },
    { id: 'projects', label: t('nav.projects'), href: '/projects' },
    { id: 'blog', label: t('nav.blog') },
    { id: 'contact', label: t('nav.contact'), href: '/#contact-form' },
  ]

  const normalizedSearch = searchValue.trim().toLowerCase()
  const isSearchMode = normalizedSearch.length > 0
  const featuredSeries = blogSeries.filter((item) => item.featured)

  const filteredPosts = useMemo(() => {
    return index.filter((post) => {
      const matchesSearch =
        normalizedSearch.length === 0 ||
        [post.title, post.summary, ...post.tags].join(' ').toLowerCase().includes(normalizedSearch)
      const matchesTag = selectedTag.length === 0 || post.tags.includes(selectedTag)

      return matchesSearch && matchesTag
    })
  }, [index, normalizedSearch, selectedTag])

  const visiblePosts = isSearchMode
    ? filteredPosts
    : filteredPosts.slice(0, visiblePostsCount)
  const remainingPostsCount = filteredPosts.length - visiblePosts.length
  const tagOptions = [
    { value: '', label: t('blog.catalog.filters.tags.all') },
    ...tags.map((tag) => ({ value: tag, label: tag })),
  ]

  return (
    <MainLayout sections={blogSections} className="home-v2">
      <Seo
        title={
          i18n.language === 'fr'
            ? `Blog data, economie et methodes | ${PERSON_NAME}`
            : `Blog on data, economics, and methods | ${PERSON_NAME}`
        }
        description={
          i18n.language === 'fr'
            ? 'Articles d Aurel De Vince sur la data analyse, l econometrie, la modelisation et la prise de decision.'
            : 'Articles by Aurel De Vince on data analysis, econometrics, modeling, and decision-making.'
        }
        path="blog"
        lang={i18n.language}
        image={buildAbsoluteSiteUrl('assets/blog/images/blog6.jpg')}
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'Blog',
          name:
            i18n.language === 'fr'
              ? 'Blog data, economie et methodes'
              : 'Blog on data, economics, and methods',
          url: buildAbsoluteSiteUrl('blog'),
          description:
            i18n.language === 'fr'
              ? 'Articles d Aurel De Vince sur la data analyse, l econometrie, la modelisation et la prise de decision.'
              : 'Articles by Aurel De Vince on data analysis, econometrics, modeling, and decision-making.',
        }}
      />
      <section id="blog" className="hv-section blog-v2__first">
        <div className="hv-wrap blog-v2__block">
          <div className="blog-v2__head">
            <p className="hv-eyebrow">{t('blog.section.featured.title')}</p>
            <h1 className="hv-h2">{t('blog.section.featured.subtitle')}</h1>
          </div>

          <LastBlogPosts posts={latest} />
        </div>
      </section>

      <section className="hv-section">
        <div className="hv-wrap blog-v2__block">
          <div className="blog-v2__head">
            <p className="hv-eyebrow">{t('blog.section.series.title')}</p>
            <h2 className="hv-h2">{t('blog.section.series.subtitle')}</h2>
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {featuredSeries.map((featuredSeriesItem) => {
              const localizedTitle = getLocalizedField(featuredSeriesItem.title, i18n.language)
              const localizedDescription = getLocalizedField(
                featuredSeriesItem.description,
                i18n.language
              )
              const postCount = index.filter(
                (post) => post.seriesSlug === featuredSeriesItem.slug
              ).length

              return (
                <BlogSeriesCard
                  key={featuredSeriesItem.id}
                  title={localizedTitle}
                  link={`/series/${featuredSeriesItem.slug}`}
                  imgs={featuredSeriesItem.cover}
                  summary={localizedDescription}
                  contentNumb={postCount}
                />
              )
            })}
          </div>
        </div>
      </section>

      <section className="hv-section">
        <div className="hv-wrap blog-v2__block">
          <div className="blog-v2__head">
            <p className="hv-eyebrow">{t('blog.section.search.title')}</p>
            <h2 className="hv-h2">{t('blog.section.search.subtitle')}</h2>
          </div>

          <BlogFilters
            searchValue={searchValue}
            onSearchChange={(value) => {
              setSearchValue(value)
              setVisiblePostsCount(PAGE_SIZE)
            }}
            tagValue={selectedTag}
            onTagChange={(value) => {
              setSelectedTag(value)
              setVisiblePostsCount(PAGE_SIZE)
            }}
            tagOptions={tagOptions}
          />

          {isLoading ? (
            <div className="hv-card blog-v2__state">
              {t('blog.loading')}
            </div>
          ) : error ? (
            <div className="hv-card blog-v2__state">
              {error}
            </div>
          ) : filteredPosts.length > 0 ? (
            <>
              <p className="blog-v2__showing">
                {t('blog.catalog.showingCount', {
                  visible: visiblePosts.length,
                  total: filteredPosts.length,
                })}
              </p>

              <PostGrid posts={visiblePosts} />

              {remainingPostsCount > 0 && (
                <div className="flex justify-center">
                  <button
                    type="button"
                    onClick={() =>
                      setVisiblePostsCount((currentCount) => currentCount + LOAD_MORE_STEP)
                    }
                    className="hv-btn hv-btn--ghost hv-btn--sm"
                  >
                    {t('blog.catalog.loadMore', {
                      count: Math.min(LOAD_MORE_STEP, remainingPostsCount),
                    })}
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="hv-card blog-v2__state">
              <h3>
                {t('blog.catalog.empty.title')}
              </h3>
              <p>
                {t('blog.catalog.empty.description')}
              </p>
            </div>
          )}
        </div>
      </section>
    </MainLayout>
  )
}

export default BlogPage
