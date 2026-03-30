import { useEffect, useMemo, useState } from 'react'
import type { CSSProperties } from 'react'
import { FiArrowLeft, FiArrowRight } from 'react-icons/fi'
import { useTranslation } from 'react-i18next'
import { Link, useParams } from 'react-router-dom'
import MainLayout from '../components/layout/MainLayout'
import PostContent from '../components/blog/PostContent'
import BlogSubscribeSection from '../components/blog/BlogSubscribeSection'
import Seo from '../components/seo/Seo'
import { getPost, formatPostDate } from '../lib/getPost'
import { useBlogIndex } from '../hooks/useBlogIndex'
import { PERSON_NAME, PERSON_SAME_AS, buildAbsoluteSiteUrl, withBasePath } from '../lib/site'

function useActiveHeadingIds(headingIds: string[]) {
  const [activeHeading, setActiveHeading] = useState(headingIds[0] ?? '')

  useEffect(() => {
    if (headingIds.length === 0) {
      return
    }

    const elements = headingIds
      .map((id) => document.getElementById(id))
      .filter((element): element is HTMLElement => element !== null)

    if (elements.length === 0) {
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries
          .filter((entry) => entry.isIntersecting)
          .sort((entryA, entryB) => entryA.boundingClientRect.top - entryB.boundingClientRect.top)[0]

        if (visibleEntry?.target.id) {
          setActiveHeading(visibleEntry.target.id)
        }
      },
      {
        rootMargin: '-20% 0px -60% 0px',
        threshold: [0.1, 0.6, 1],
      }
    )

    elements.forEach((element) => observer.observe(element))

    return () => {
      elements.forEach((element) => observer.unobserve(element))
      observer.disconnect()
    }
  }, [headingIds])

  return activeHeading || headingIds[0] || ''
}

function BlogPostPage() {
  const { t, i18n } = useTranslation()
  const { slug } = useParams()
  const { index, isLoading: isIndexLoading } = useBlogIndex(i18n.language)
  const [content, setContent] = useState<string | null>(null)
  const [isContentLoading, setIsContentLoading] = useState(true)

  const blogSections = [
    { id: 'home', label: t('nav.home'), href: '/' },
    { id: 'blog', label: t('nav.blog'), href: '/blog' },
    { id: 'contact', label: t('nav.contact'), href: '/#contact-form' },
  ]

  const post = useMemo(
    () => index.find((item) => item.slug === slug) ?? null,
    [index, slug]
  )

  useEffect(() => {
    let isCancelled = false

    if (!slug) {
      return
    }

    Promise.resolve()
      .then(() => {
        if (isCancelled) {
          return null
        }

        setIsContentLoading(true)
        setContent(null)

        return getPost(slug, i18n.language === 'fr' ? 'fr' : 'en')
      })
      .then((nextContent) => {
        if (isCancelled) {
          return
        }

        setContent(nextContent)
        setIsContentLoading(false)
      })
      .catch(() => {
        if (isCancelled) {
          return
        }

        setContent(null)
        setIsContentLoading(false)
      })

    return () => {
      isCancelled = true
    }
  }, [i18n.language, slug])

  const activeHeading = useActiveHeadingIds(post?.headings.map((heading) => heading.id) ?? [])
  const currentPostIndex = post
    ? index.findIndex((item) => item.slug === post.slug)
    : -1
  const previousPost = currentPostIndex >= 0 ? index[currentPostIndex - 1] ?? null : null
  const nextPost = currentPostIndex >= 0 ? index[currentPostIndex + 1] ?? null : null

  if (!slug || (!post && !isIndexLoading)) {
    return (
      <MainLayout sections={blogSections}>
        <section className="section-shell py-15 md:py-12">
          <div className="rounded-[24px] border border-[var(--glass-border)] bg-[var(--glass-bg)]/70 px-8 py-12 text-center backdrop-blur-xl">
            <h1 className="text-3xl font-semibold text-[var(--text-col)]">
              {t('blog.postNotFound.title')}
            </h1>
            <p className="mt-4 text-[var(--text2-col)]">
              {t('blog.postNotFound.description')}
            </p>
            <Link
              to="/blog"
              className="mt-8 inline-flex items-center gap-2 rounded-full border border-[var(--glass-border)] bg-[var(--glass-bg)] px-5 py-3 text-sm font-semibold text-[var(--text-col)] backdrop-blur-xl"
            >
              <FiArrowLeft />
              {t('blog.backToBlog')}
            </Link>
          </div>
        </section>
      </MainLayout>
    )
  }

  if (!post) {
    return null
  }

  const tocHeadings = post.headings.filter((heading) => heading.depth <= 2)
  const blogPostThemeStyle = {
    '--text-col': 'var(--blogpost-text-col)',
    '--text2-col': 'var(--blogpost-text2-col)',
  } as CSSProperties

  return (
    <MainLayout sections={blogSections}>
      <Seo
        title={post.title}
        description={post.summary}
        path={`blog/${post.slug}`}
        type="article"
        lang={i18n.language}
        image={buildAbsoluteSiteUrl(post.cover)}
        publishedTime={post.date}
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: post.title,
          description: post.summary,
          datePublished: post.date,
          dateModified: post.date,
          image: [buildAbsoluteSiteUrl(post.cover)],
          author: {
            '@type': 'Person',
            name: PERSON_NAME,
            sameAs: PERSON_SAME_AS,
          },
          mainEntityOfPage: buildAbsoluteSiteUrl(`blog/${post.slug}`),
        }}
      />
      <section
        className="blogpage-shell py-15 md:py-12 md:pl-30"
        style={blogPostThemeStyle}
      >
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 rounded-lg border border-[var(--glass-border)] bg-[var(--glass-bg)] px-4 py-2 text-sm font-semibold text-[var(--text-col)] backdrop-blur-xl transition-colors duration-200 hover:border-[var(--accent-lgtblue)]"
          >
            <FiArrowLeft />
            {t('blog.backToBlog')}
          </Link>

          {post.seriesSlug && (
            <Link
              to={`/series/${post.seriesSlug}`}
              className="inline-flex items-center gap-2 rounded-lg border border-[var(--glass-border)] btn-primary px-4 py-2 text-sm font-semibold text-[var(--text-col)] backdrop-blur-xl transition-colors duration-200 hover:border-[var(--accent-lgtblue)]"
            >
              {t('blog.backToSeries')}
            </Link>
          )}
        </div>
          
        <div className="grid xl:grid-cols-[minmax(0,1fr)_240px]">
          <div className="min-w-0">
            <div className="overflow-hidden rounded-lg border border-[var(--glass-border)] bg-[var(--glass-bg)]/70 backdrop-blur-xl">
              <img
                src={withBasePath(post.cover)}
                alt={post.title}
                className="h-[260px] w-full object-cover md:h-[360px]"
              />

              <div className="flex flex-col gap-5 p-6 md:p-8">
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-[var(--glass-border)] px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-[var(--keyw-col-window)]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <h1 className="text-4xl font-semibold tracking-tight text-[var(--text-col)] md:text-5xl">
                  {post.title}
                </h1>

                <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-[var(--text2-col)]">
                  <span>{formatPostDate(post.date, i18n.language)}</span>
                  <span>{t('blog.minRead', { count: post.readTime })}</span>
                </div>

                <p className="max-w-3xl text-base leading-8 text-[var(--text2-col)]">
                  {post.summary}
                </p>
              </div>
            </div>

            <div className="mt-8">
              {isContentLoading || isIndexLoading ? (
                <div className="rounded-lg border border-[var(--glass-border)] bg-[var(--glass-bg)]/65 px-6 py-10 text-center text-[var(--text2-col)] backdrop-blur-xl">
                  {t('blog.loading')}
                </div>
              ) : content ? (
                <PostContent content={content} />
              ) : (
                <div className="rounded-lg border border-[var(--glass-border)] bg-[var(--glass-bg)]/65 px-6 py-10 text-center text-[var(--text2-col)] backdrop-blur-xl">
                  {t('blog.postNotFound.description')}
                </div>
              )}
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-2">
              {previousPost ? (
                <Link
                  to={`/blog/${previousPost.slug}`}
                  className="group rounded-lg p-5 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-[var(--accent-lgtblue)]"
                >
                  <p className="mb-3 inline-flex items-center gap-2 text-sm font-semibold text-[var(--accent-lgtpurple)] group-hover:text-[var(--accent-lgtblue)]">
                    <FiArrowLeft />
                    {t('blog.navigation.previous')}
                  </p>
                  <p className="text-lg font-semibold text-[var(--text-col)]">
                    {previousPost.title}
                  </p>
                </Link>
              ) : <div />}

              {nextPost ? (
                <Link
                  to={`/blog/${nextPost.slug}`}
                  className="group rounded-[22px] p-5 text-right backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-[var(--accent-lgtblue)]"
                >
                  <p className="mb-3 inline-flex items-center gap-2 text-sm font-semibold text-[var(--accent-lgtpurple)] group-hover:text-[var(--accent-lgtblue)]">
                    {t('blog.navigation.next')}
                    <FiArrowRight />
                  </p>
                  <p className="text-lg font-semibold text-[var(--text-col)]">
                    {nextPost.title}
                  </p>
                </Link>
              ) : <div />}
            </div>

            <BlogSubscribeSection
              contextType="post"
              contextTitle={post.title}
              contextSlug={post.slug}
            />
          </div>

          <aside className="xl:sticky bdc xl:top-24 xl:self-start xl:justify-self-end">
            <div className="w-full max-w-[220px] pt-1">
              <p className="mb-3 text-[11px] uppercase tracking-[0.24em] text-[var(--text2-col)]">
                {t('blog.summaryTitle')}
              </p>

              <nav className="flex flex-col gap-1">
                {tocHeadings.map((heading) => (
                  <a
                    key={heading.id}
                    href={`#${heading.id}`}
                    className={`border-l px-3 py-1 text-xs leading-5 transition-colors duration-200 ${
                      activeHeading === heading.id
                        ? 'border-[var(--accent-lgtblue)] text-[var(--text-col)]'
                        : 'border-transparent text-[var(--text2-col)] hover:text-[var(--text-col)]'
                    }`}
                    style={{
                      marginLeft: heading.depth === 2 ? '0.45rem' : '0',
                    }}
                  >
                    {heading.depth === 1 ? heading.text.toUpperCase() : heading.text}
                  </a>
                ))}
              </nav>
            </div>
          </aside>
        </div>
      </section>
    </MainLayout>
  )
}

export default BlogPostPage
