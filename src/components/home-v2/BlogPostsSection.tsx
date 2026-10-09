import { Link } from 'react-router-dom'
import { FiChevronRight } from 'react-icons/fi'
import { useBlogIndex } from '../../hooks/useBlogIndex'
import { useHomeContent } from '../../hooks/useHomeContent'
import seriesData from '../../data/series.json'
import type { Series } from '../../types/series'
import Reveal from './Reveal'

const seriesBySlug = new Map((seriesData as Series[]).map((series) => [series.slug, series]))

function BlogPostsSection() {
  const { content, lang } = useHomeContent()
  const { blog } = content
  const { latest, isLoading } = useBlogIndex(lang)
  const dateFormatter = new Intl.DateTimeFormat(blog.dateLocale, { day: 'numeric', month: 'short', year: 'numeric' })

  return (
    <div className="hv-wrap">
      <Reveal className="hv-row-head">
        <h2 className="hv-h2">{blog.title}</h2>
        <Link to="/blog" className="hv-link">
          {blog.allPosts} <FiChevronRight className="hv-arrow" aria-hidden="true" />
        </Link>
      </Reveal>
      <Reveal className="hv-posts">
        {isLoading && <p className="hv-muted">{blog.loading}</p>}
        {latest.map((post) => (
          <Link key={post.slug} to={`/blog/${post.slug}`} className="hv-posts__row">
            <time className="hv-posts__date" dateTime={post.date}>{dateFormatter.format(new Date(post.date))}</time>
            <b>{post.title}</b>
            <span className="hv-posts__series">
              {post.seriesSlug ? seriesBySlug.get(post.seriesSlug)?.title[lang] : null}
            </span>
            <span className="hv-posts__time">{post.readTime} {blog.minRead}</span>
          </Link>
        ))}
      </Reveal>
    </div>
  )
}

export default BlogPostsSection
