import { GoLinkExternal } from 'react-icons/go'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

const DEFAULT_POST_IMAGE = '/assets/blog/images/defaultblogpostcover.png'

type BlogSeriesCardProps = {
  title: string
  link: string
  imgs: string
  summary: string
  contentNumb: number
}

function BlogSeriesCard({ title, link, imgs, summary, contentNumb }: BlogSeriesCardProps) {
  const { t } = useTranslation()

  return (
    <Link
      to={link}
      className="flex h-full min-w-0 flex-col overflow-hidden rounded-xl bdc border-2 bg-[var(--series-bg)] group transition-colors duration-300 hover:border-[var(--keyw-col-window)] hover:bg-[var(--series-bg)]"
    >
      <div className="overflow-hidden">
        <img
          src={imgs || DEFAULT_POST_IMAGE}
          alt={title}
          loading="lazy"
          onError={(event) => {
            event.currentTarget.src = DEFAULT_POST_IMAGE
          }}
          className="aspect-[6/3] w-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
      </div>

      <div className="flex flex-1 flex-col border-t-2 border-[var(--glass-border)] p-5 transition-all duration-300">
        <h3 className="mb-2 text-2xl font-semibold tracking-tight transition-colors duration-300 group-hover:text-[var(--text-col)]">
          {title}
        </h3>

        <p className="mb-2 flex-1 transition-colors duration-300 group-hover:text-[var(--text-col)]">
          {summary}
        </p>

        <div className="flex items-center justify-between gap-3">
          <p className="text-[var(--accent-lgtpurple)]">
            {t('blog.series.readMore')} <GoLinkExternal className="ml-1 inline" />
          </p>
          <p className="text-[var(--text2-col)]">
            {t('blog.series.postCount', { count: contentNumb })}
          </p>
        </div>
      </div>
    </Link>
  )
}

export default BlogSeriesCard
