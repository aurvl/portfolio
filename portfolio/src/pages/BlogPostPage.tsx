import { useTranslation } from 'react-i18next'
import { Link, useParams } from 'react-router-dom'
import MainLayout from '../components/layout/MainLayout'

function BlogPostPage() {
  const { t } = useTranslation()
  const { slug } = useParams()

  const blogSections = [
    { id: 'home', label: t('nav.home'), href: '/' },
    { id: 'blog', label: t('nav.blog'), href: '/blog' },
    { id: 'contact', label: t('nav.contact'), href: '/#contact-form' },
  ]

  const formattedSlug = slug?.replace(/-/g, ' ') ?? t('blog.title')

  return (
    <MainLayout sections={blogSections}>
      <section className="section-shell py-15 md:py-12">
        <div className="max-w-3xl px-8 md:px-7">
          <p className="mb-3 text-sm uppercase tracking-[0.24em] text-[var(--text2-col)]">
            {t('blog.eyebrow')}
          </p>

          <h1 className="mb-4 text-4xl font-semibold tracking-tight md:text-5xl">
            {formattedSlug}
          </h1>

          <p className="text-base leading-8 text-[var(--text2-col)]">
            This article page is available in the blog list, but the dedicated content
            view is not wired yet.
          </p>

          <Link
            to="/blog"
            className="btn btn-secondary border-class mt-8 inline-flex rounded-[5px] p-3 font-semibold text-white"
          >
            {t('blog.viewAll')}
          </Link>
        </div>
      </section>
    </MainLayout>
  )
}

export default BlogPostPage
