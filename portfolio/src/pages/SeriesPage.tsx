import { FiArrowLeft } from 'react-icons/fi'
import { useTranslation } from 'react-i18next'
import { Link, useParams } from 'react-router-dom'
import MainLayout from '../components/layout/MainLayout'
import PostGrid from '../components/blog/PostGrid'
import BlogSubscribeSection from '../components/blog/BlogSubscribeSection'
import series from '../data/series.json'
import { useBlogIndex } from '../hooks/useBlogIndex'
import { getLocalizedField } from '../lib/utils'
import type { BlogPostMeta } from '../types/post'
import type { Series } from '../types/series'

const blogSeries = series as Series[]

function chunkPosts(posts: BlogPostMeta[], size: number) {
  const chunks: BlogPostMeta[][] = []

  for (let index = 0; index < posts.length; index += size) {
    chunks.push(posts.slice(index, index + size))
  }

  return chunks
}

function SeriesPage() {
  const { t, i18n } = useTranslation()
  const { seriesSlug } = useParams()
  const { index } = useBlogIndex(i18n.language)
  const currentSeries = blogSeries.find((item) => item.slug === seriesSlug) ?? null
  const seriesPosts = index.filter((post) => post.seriesSlug === seriesSlug)
  const rows = chunkPosts(seriesPosts, 3)

  const sections = [
    { id: 'home', label: t('nav.home'), href: '/' },
    { id: 'blog', label: t('nav.blog'), href: '/blog' },
    { id: 'contact', label: t('nav.contact'), href: '/#contact-form' },
  ]

  return (
    <MainLayout sections={sections}>
      <section className="section-shell py-15 md:py-12">
        <div className="mb-8">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 rounded-lg border border-[var(--glass-border)] bg-[var(--glass-bg)] px-4 py-2 text-sm font-semibold text-[var(--text-col)] backdrop-blur-xl transition-colors duration-200 hover:border-[var(--accent-lgtblue)]"
          >
            <FiArrowLeft />
            {t('blog.backToBlog')}
          </Link>
        </div>

        <div className="p-6 backdrop-blur-xl md:p-8">
          <h1 className="text-4xl font-semibold tracking-tight bg-gradient-to-r from-[var(--accent-lgtblue)] to-[#ff8c42] bg-clip-text text-transparent inline-block">
            {currentSeries
              ? getLocalizedField(currentSeries.title, i18n.language)
              : t('blog.series.fallbackTitle')}
          </h1>
        </div>

        <div className="mt-8 space-y-8">
          {rows.length > 0 ? (
            rows.map((row, rowIndex) => (
              <div key={`series-row-${rowIndex}`} className="space-y-8">
                <PostGrid posts={row} />
                {rowIndex < rows.length - 1 && (
                  <div className="mx-auto h-px w-[80%] bg-[var(--glass-border)]" />
                )}
              </div>
            ))
          ) : (
            <div className="rounded-[22px] border border-[var(--glass-border)] bg-[var(--glass-bg)]/65 px-6 py-10 text-center">
              <h2 className="text-xl font-semibold text-[var(--text-col)]">
                {t('blog.catalog.empty.title')}
              </h2>
              <p className="mt-3 text-[var(--text2-col)]">
                {t('blog.catalog.empty.description')}
              </p>
            </div>
          )}
        </div>

        <BlogSubscribeSection
          contextType="series"
          contextTitle={
            currentSeries
              ? getLocalizedField(currentSeries.title, i18n.language)
              : t('blog.series.fallbackTitle')
          }
          contextSlug={seriesSlug ?? 'series'}
        />
      </section>
    </MainLayout>
  )
}

export default SeriesPage
