import type { BlogPostMeta } from '../../types/post'
import PostGrid from './PostGrid'

export type LastBlogPostsProps = {
  posts: BlogPostMeta[]
}

const LastBlogPosts = ({ posts }: LastBlogPostsProps) => {
  return (
    <div className="px-8 pb-16 md:px-7">
      <PostGrid posts={posts} />
    </div>
  )
}

export default LastBlogPosts
