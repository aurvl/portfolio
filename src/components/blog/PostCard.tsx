import { FaRegCalendarAlt } from 'react-icons/fa'
import { GoLinkExternal } from 'react-icons/go'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { formatPostDate } from '../../lib/getPost'
import { withBasePath } from '../../lib/site'
import type { BlogPostMeta } from '../../types/post'

const DEFAULT_POST_IMAGE = withBasePath('assets/blog/images/defaultblogpostcover.png')

type PostCardProps = {
  post: BlogPostMeta
}

function PostCard({ post }: PostCardProps) {
  const { t, i18n } = useTranslation()

  return (
    <Link
      to={`/blog/${post.slug}`}
      className="post-card flex h-full min-w-0 flex-col gap-2"
    >
      <img
        src={withBasePath(post.cover || DEFAULT_POST_IMAGE)}
        alt={post.title}
        loading="lazy"
        onError={(event) => {
          event.currentTarget.src = DEFAULT_POST_IMAGE
        }}
        className="mb-4 h-40 w-full rounded-[5px] object-cover"
      />
      <h3 className="text-2xl font-semibold underline transition-colors duration-200 ease-in-out hover:text-[var(--accent-blue)]">
        {post.title}
      </h3>
      <p className="flex-1">{post.summary}</p>
      <p className="flex items-center text-sm text-[var(--text-col)]/40">
        <FaRegCalendarAlt className="mr-2 inline" />
        {formatPostDate(post.date, i18n.language)} {'\u2022'}{' '}
        {t('blog.minRead', { count: post.readTime })}
      </p>
      <p className="text-[var(--accent-lgtpurple)] hover:underline">
        {t('blog.readMore')} <GoLinkExternal className="ml-1 inline" />
      </p>
    </Link>
  )
}

export default PostCard
