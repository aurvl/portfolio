// Bloc « Derniers articles du blog » du Hub (page /projects), juste après « À la une ».
// Un grand article avec image, quatre autres en texte seul (deux colonnes de deux lignes), et un lien vers la vue Séries. Ancre : #blog (cible de /blog).
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { formatPostDate } from '../../lib/getPost'
import { withBasePath } from '../../lib/site'
import Button from '../ui/Button'
import type { BlogPostMeta } from '../../types/post'

type BlogLatestProps = {
  posts: BlogPostMeta[]
  labels: {
    blogLabel: string
    blogTitle: string
    blogSeries: string
  }
}

const DEFAULT_POST_IMAGE = 'assets/blog/images/defaultblogpostcover.png'

function BlogLatest({ posts, labels }: BlogLatestProps) {
  const { t, i18n } = useTranslation()
  const [lead, ...others] = posts

  return (
    <section
      id="blog"
      className="blog-latest"
      aria-labelledby="blog-latest-title"
    >
      <div className="blog-latest__head">
        <div>
          <p className="eyebrow">{labels.blogLabel}</p>
          <h2
            id="blog-latest-title"
            className="hub__section-title"
          >
            {labels.blogTitle}
          </h2>
        </div>

        <Button
          variant="link"
          href={withBasePath('series')}
        >
          {labels.blogSeries}
        </Button>
      </div>

      {lead ? (
        <div className="blog-latest__grid">
          <article className="blog-latest__item blog-latest__item--lead">
            <img
              className="blog-latest__image"
              src={withBasePath(lead.cover || DEFAULT_POST_IMAGE)}
              alt=""
              loading="lazy"
              onError={(event) => {
                event.currentTarget.src = withBasePath(DEFAULT_POST_IMAGE)
              }}
            />
            <PostText
              post={lead}
              language={i18n.language}
              readTime={t('blog.minRead', { count: lead.readTime })}
            />
          </article>

          {others.map((post) => (
            <article
              key={post.slug}
              className="blog-latest__item"
            >
              <PostText
                post={post}
                language={i18n.language}
                readTime={t('blog.minRead', { count: post.readTime })}
              />
            </article>
          ))}
        </div>
      ) : null}
    </section>
  )
}

type PostTextProps = {
  post: BlogPostMeta
  language: string
  readTime: string
}

// Date, titre serif (lien étiré sur toute la zone), chapô et mots-clés d'un article
function PostText({ post, language, readTime }: PostTextProps) {
  return (
    <div className="blog-latest__text">
      <p className="blog-latest__meta tabular">
        {formatPostDate(post.date, language)} · {readTime}
      </p>

      <h3 className="blog-latest__title">
        {/* Lien étiré : le ::after du lien couvre toute la zone de l'article (voir hub.css) */}
        <Link
          to={`/blog/${post.slug}`}
          className="blog-latest__link"
        >
          {post.title}
        </Link>
      </h3>

      <p className="blog-latest__summary">{post.summary}</p>

      <ul className="blog-latest__tags">
        {post.tags.slice(0, 3).map((tag) => (
          <li key={tag}>{tag}</li>
        ))}
      </ul>
    </div>
  )
}

export default BlogLatest
