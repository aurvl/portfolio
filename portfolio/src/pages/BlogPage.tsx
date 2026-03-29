import { useTranslation } from 'react-i18next'
import MainLayout from '../components/layout/MainLayout'
import LastBlogPosts from '../components/blog/LastBlogPosts'

function BlogPage() {
  const { t } = useTranslation()

  const blogSections = [
    { id: 'home', label: t('nav.home'), href: '/' },
    { id: 'projects', label: t('nav.projects'), href: '/projects' },
    { id: 'blog', label: t('nav.blog'), href: '/blog' },
    { id: 'contact', label: t('nav.contact'), href: '/#contact-form' },
  ]

  return (
    <MainLayout sections={blogSections}>
      <section id="blog" className="section-shell py-15 md:py-12">
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

        <LastBlogPosts />
      </section>
    </MainLayout>
  )
}

export default BlogPage
