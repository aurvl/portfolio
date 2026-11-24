// Une ligne d'article (numéro facultatif, titre serif, chapô, date, mots-clés). Utilisée par la liste de la série et
// par les résultats de recherche de la page Série. Styles : styles/v3/blog.css (.series-list__*).
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { formatPostDate } from '../../lib/getPost'
import { cn } from '../../lib/cn'
import type { BlogPostMeta } from '../../types/post'

type PostRowProps = {
  post: BlogPostMeta
  // Numéro d'ordre de lecture dans la série ; sans numéro (résultats de recherche), la ligne n'a pas de colonne de numéro
  number?: number
}

function PostRow({ post, number }: PostRowProps) {
  const { t, i18n } = useTranslation()

  return (
    <li className={cn('series-list__item', number === undefined && 'series-list__item--plain')}>
      {number !== undefined ? (
        <span
          className="series-list__number tabular"
          aria-hidden="true"
        >
          {String(number).padStart(2, '0')}
        </span>
      ) : null}

      <div>
        <h2 className="series-list__title">
          {/* Lien étiré : le ::after couvre toute la ligne (voir blog.css) */}
          <Link
            to={`/blog/${post.slug}`}
            className="series-list__link"
          >
            {post.title}
          </Link>
        </h2>
        <p className="series-list__summary">{post.summary}</p>
        <p className="series-list__meta tabular">
          {formatPostDate(post.date, i18n.language)} · {t('blog.minRead', { count: post.readTime })}
        </p>
        {post.tags.length > 0 ? (
          <ul className="series-list__tags">
            {post.tags.slice(0, 3).map((tag) => (
              <li key={tag}>{tag}</li>
            ))}
          </ul>
        ) : null}
      </div>
    </li>
  )
}

export default PostRow
