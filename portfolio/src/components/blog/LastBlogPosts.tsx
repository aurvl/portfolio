import { useTranslation } from 'react-i18next'
import PostCard from './PostCard'

function LastBlogPosts() {
  const { t } = useTranslation()

  return (
    <div className="grid grid-cols-1 gap-8 p-8 md:grid-cols-2 md:p-12 lg:grid-cols-3">
      <PostCard
        title={t('blog.posts.reactHooks.title')}
        imgs=""
        summary={t('blog.posts.reactHooks.summary')}
        date="June 10, 2024"
        readTime="5"
        link="/blog/understanding-react-hooks"
      />
      <PostCard
        title={t('blog.posts.gridFlex.title')}
        imgs=""
        summary={t('blog.posts.gridFlex.summary')}
        date="June 5, 2024"
        readTime="7"
        link="/blog/css-grid-vs-flexbox"
      />
      <PostCard
        title={t('blog.posts.jsPerf.title')}
        imgs=""
        summary={t('blog.posts.jsPerf.summary')}
        date="June 1, 2024"
        readTime="6"
        link="/blog/javascript-performance-tips"
      />
    </div>
  )
}

export default LastBlogPosts
