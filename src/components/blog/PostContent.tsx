import { memo } from 'react'
import MdContentRenderer from '../ui/MarkdownRenderer'
import BlogPostResources from './BlogPostResources'
import { blogWidgetRegistry } from './widgets/blogWidgetRegistry'

type PostContentProps = {
  content: string
  postSlug: string
}

function PostContent({ content, postSlug }: PostContentProps) {
  return (
    <article className="min-w-0 rounded-lg bg-[var(--glass-bg)]/5 p-6 backdrop-blur-xl md:p-8">
      <MdContentRenderer content={content} widgets={blogWidgetRegistry} />
      <BlogPostResources postSlug={postSlug} />
    </article>
  )
}

export default memo(PostContent)
