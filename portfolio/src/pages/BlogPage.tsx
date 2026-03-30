import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import MainLayout from '../components/layout/MainLayout'
import LastBlogPosts from '../components/blog/LastBlogPosts'
import BlogFilters from '../components/blog/BlogFilters'
import BlogSeriesCard from '../components/blog/BlogSeriesCard'
import PostGrid from '../components/blog/PostGrid'
import series from '../data/series.json'
import { useBlogIndex } from '../hooks/useBlogIndex'
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
    <MainLayout sections={blogSections}>
      <section id="blog" className="section-shell py-15 md:py-12">
        <div className="flex flex-col p-8 md:p-7 md:pb-0">
          <p className="mb-3 text-sm uppercase tracking-[0.24em] text-[var(--text2-col)]">
            {t('blog.section.featured.title')}
          </p>

          <h1 className="mb-4 text-4xl font-semibold tracking-tight md:text-5xl">
            {t('blog.section.featured.subtitle')}
          </h1>
        </div>

        <LastBlogPosts posts={latest} />

        <span className="block w-full border-b border-[var(--glass-border)]"></span>

        <div className="flex flex-col gap-10 px-8 py-20 md:px-7">
          <div>
            <p className="mb-3 text-sm uppercase tracking-[0.24em] text-[var(--text2-col)]">
              {t('blog.section.series.title')}
            </p>

            <h2 className="mb-4 text-4xl font-semibold tracking-tight md:max-w-[55%] md:text-5xl">
              {t('blog.section.series.subtitle')}
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
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

        <span className="block w-full border-b border-[var(--glass-border)]"></span>

        <div className="flex flex-col gap-8 p-8 pb-20 md:p-7 md:pb-24">
          <div>
            <p className="mb-3 text-sm uppercase tracking-[0.24em] text-[var(--text2-col)]">
              {t('blog.section.search.title')}
            </p>

            <h2 className="mb-4 text-4xl font-semibold tracking-tight md:max-w-[55%] md:text-5xl">
              {t('blog.section.search.subtitle')}
            </h2>
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
            <div className="rounded-[18px] border border-[var(--glass-border)] bg-[var(--glass-bg)]/65 px-6 py-10 text-center text-[var(--text2-col)]">
              {t('blog.loading')}
            </div>
          ) : error ? (
            <div className="rounded-[18px] border border-[var(--glass-border)] bg-[var(--glass-bg)]/65 px-6 py-10 text-center text-[var(--text2-col)]">
              {error}
            </div>
          ) : filteredPosts.length > 0 ? (
            <>
              <p className="text-sm text-[var(--text2-col)]">
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
                    className="btn btn-primary border-class rounded-[8px] bg-[#3784d8] px-6 py-3 font-semibold text-white hover:bg-[#2c6abf]"
                  >
                    {t('blog.catalog.loadMore', {
                      count: Math.min(LOAD_MORE_STEP, remainingPostsCount),
                    })}
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="rounded-[18px] border border-[var(--glass-border)] bg-[var(--glass-bg)]/65 px-6 py-10 text-center">
              <h3 className="text-xl font-semibold text-[var(--text-col)]">
                {t('blog.catalog.empty.title')}
              </h3>
              <p className="mt-3 text-[var(--text2-col)]">
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
