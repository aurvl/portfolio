import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import LastBlogPosts from '../blog/LastBlogPosts'
import { useBlogIndex } from '../../hooks/useBlogIndex'

function RecentPosts() {
  const { t, i18n } = useTranslation()
  const { latest } = useBlogIndex(i18n.language)

  return (
    <section id="blog" className="section-shell py-15 md:py-17">
      <div className="flex flex-col p-8 md:p-7 md:pb-0">
        <p className="mb-3 text-sm uppercase tracking-[0.24em] text-[var(--text2-col)]">
          {t('blog.eyebrow')}
        </p>

        <h1 className="mb-4 text-4xl font-semibold tracking-tight md:text-5xl">
          {t('blog.title')}
        </h1>

        <p className="text-base leading-8 text-[var(--text2-col)]">
          {t('blog.description')}
        </p>
      </div>

      <div className="flex flex-col items-center">
        <div className="mt-2 flex align-top justify-center md:mt-0">
          <LastBlogPosts posts={latest} />
        </div>

        <Link
          to="/blog"
          className="btn btn-secondary border-class flex w-auto justify-center 
          rounded-[5px] p-3 font-semibold text-white md:p-2 sm:w-auto sm:min-w-[220px]"
        >
          {t('blog.viewAll')}
        </Link>
      </div>
    </section>
  )
}

export default RecentPosts
