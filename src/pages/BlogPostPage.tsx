// Page d'un article (/blog/:slug) : bandeau de bambous, en-tête éditorial (titre serif), corps de l'article
// (PostContent : markdown, formules, widgets, inchangé), sommaire, précédent / suivant et abonnement.
// Styles : styles/v3/blog.css.
import { useEffect, useMemo, useState } from 'react'
import { FiArrowLeft, FiArrowRight } from 'react-icons/fi'
import { useTranslation } from 'react-i18next'
import { Link, useParams } from 'react-router-dom'
import MainLayout from '../components/layout/MainLayout'
import { useSiteNav } from '../hooks/useSiteNav'
import BlogBanner from '../components/blog/BlogBanner'
import PostContent from '../components/blog/PostContent'
import BlogSubscribeSection from '../components/blog/BlogSubscribeSection'
import Seo from '../components/seo/Seo'
import { getPost, formatPostDate } from '../lib/getPost'
import { getImageDimensions } from '../lib/imageMetadata'
import { cn } from '../lib/cn'
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

  const { pageSections: blogSections } = useSiteNav()

  const post = useMemo(
    () => index.find((item) => item.slug === slug) ?? null,
    [index, slug]
  )
  const coverDimensions = getImageDimensions(post?.cover)

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
  const postSeriesSlug = post?.seriesSlug ?? null
  const navigationPosts = useMemo(() => {
    if (!postSeriesSlug) {
      return index
    }

    return [...index]
      .filter((item) => item.seriesSlug === postSeriesSlug)
      .sort((postA, postB) => {
        const dateDiff = new Date(postA.date).getTime() - new Date(postB.date).getTime()

        if (dateDiff !== 0) {
          return dateDiff
        }

        return postA.slug.localeCompare(postB.slug)
      })
  }, [index, postSeriesSlug])
  const currentPostIndex = post
    ? navigationPosts.findIndex((item) => item.slug === post.slug)
    : -1
  const previousPost = currentPostIndex >= 0 ? navigationPosts[currentPostIndex - 1] ?? null : null
  const nextPost = currentPostIndex >= 0 ? navigationPosts[currentPostIndex + 1] ?? null : null

  if (!slug || (!post && !isIndexLoading)) {
    return (
      <MainLayout
        sections={blogSections}
        className="home-v2"
        overlayNavbar
      >
        <div className="blog-page">
          <BlogBanner />

          <div className="blog-page__wrap">
            <div className="blog-page__empty">
              <h1>{t('blog.postNotFound.title')}</h1>
              <p>{t('blog.postNotFound.description')}</p>
              <Link
                to="/projects#blog"
                className="blog-page__link"
              >
                <FiArrowLeft aria-hidden="true" />
                {t('blog.backToBlog')}
              </Link>
            </div>
          </div>
        </div>
      </MainLayout>
    )
  }

  if (!post) {
    return null
  }

  const tocHeadings = post.headings.filter((heading) => heading.depth <= 2)

  return (
    <MainLayout
      sections={blogSections}
      className="home-v2"
      overlayNavbar
    >
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

      <div className="blog-page blog-article">
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

            {post.seriesSlug && (
              <Link
                to={`/series/${post.seriesSlug}`}
                className="blog-page__link"
              >
                {t('blog.backToSeries')}
                <FiArrowRight aria-hidden="true" />
              </Link>
            )}
          </div>

          <header className="blog-page__head">
            <p className="article-head__tags">{post.tags.join(' · ')}</p>
            <h1 className="blog-page__title">{post.title}</h1>
            <p className="blog-page__lead">{post.summary}</p>
            <p className="blog-page__meta tabular">
              {formatPostDate(post.date, i18n.language)} · {t('blog.minRead', { count: post.readTime })}
            </p>

            <img
              src={withBasePath(post.cover)}
              alt={post.title}
              width={coverDimensions?.width}
              height={coverDimensions?.height}
              className="article-head__cover"
            />
          </header>

          <div className="article-layout">
            <div className="article-body">
              {isContentLoading || isIndexLoading ? (
                <div className="article-state">{t('blog.loading')}</div>
              ) : content ? (
                <PostContent content={content} postSlug={post.slug} />
              ) : (
                <div className="article-state">{t('blog.postNotFound.description')}</div>
              )}

              <nav
                className="article-pager"
                aria-label={t('blog.navigation.previous') + ' / ' + t('blog.navigation.next')}
              >
                {previousPost ? (
                  <Link
                    to={`/blog/${previousPost.slug}`}
                    className="article-pager__item article-pager__item--previous"
                  >
                    <span className="article-pager__label">
                      <FiArrowLeft aria-hidden="true" />
                      {t('blog.navigation.previous')}
                    </span>
                    <span className="article-pager__title">{previousPost.title}</span>
                  </Link>
                ) : (
                  <div />
                )}

                {nextPost ? (
                  <Link
                    to={`/blog/${nextPost.slug}`}
                    className="article-pager__item article-pager__item--next"
                  >
                    <span className="article-pager__label">
                      {t('blog.navigation.next')}
                      <FiArrowRight aria-hidden="true" />
                    </span>
                    <span className="article-pager__title">{nextPost.title}</span>
                  </Link>
                ) : (
                  <div />
                )}
              </nav>

              <BlogSubscribeSection
                contextType="post"
                contextTitle={post.title}
                contextSlug={post.slug}
              />
            </div>

            <aside className="article-toc">
              <p className="article-toc__title">{t('blog.summaryTitle')}</p>

              <nav className="article-toc__list">
                {tocHeadings.map((heading) => (
                  <a
                    key={heading.id}
                    href={`#${heading.id}`}
                    className={cn(
                      'article-toc__link',
                      heading.depth === 2 && 'article-toc__link--sub',
                      activeHeading === heading.id && 'is-active',
                    )}
                  >
                    {heading.depth === 1 ? heading.text.toUpperCase() : heading.text}
                  </a>
                ))}
              </nav>
            </aside>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}

export default BlogPostPage
