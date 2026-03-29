import { useTranslation } from 'react-i18next'
import { GoLinkExternal } from "react-icons/go";
import { FaRegCalendarAlt } from "react-icons/fa";

const DEFAULT_POST_IMAGE = '/assets/blog/images/defaultblogpostcover.png'

type PostCardProps = {
  title: string
  imgs: string
  summary: string
  date: string
  readTime: string
  link: string
}

function PostCard({ title, imgs, summary, date, readTime, link }: PostCardProps) {
  const { t } = useTranslation()

  return (
    <a href={link} className="post-card flex h-full w-0.33 flex-col gap-2">
      <img
        src={imgs || DEFAULT_POST_IMAGE}
        alt={title}
        onError={(event) => {
          event.currentTarget.src = DEFAULT_POST_IMAGE
        }}
        className="mb-4 h-40 w-full rounded-[5px] object-cover"
      />
      <h3 className="text-2xl font-semibold underline transition-colors duration-200 ease-in-out hover:text-[var(--accent-blue)]">
        {title}
      </h3>
      <p className="flex-1">{summary}</p>
      <p className='flex items-center text-sm text-[var(--text-col)]/40'>
        <FaRegCalendarAlt className="mr-2 inline" /> {date} {'\u2022'} {t('blog.minRead', { count: Number(readTime) })}
      </p>
      <p className='text-[var(--accent-lgtpurple)] hover:underline'>
        {t('blog.readMore')} <GoLinkExternal className="ml-1 inline" />
      </p>
    </a>
  )
}

export default PostCard
