import type { BlogPostMeta } from '../../types/post'
import PostCard from './PostCard'

type PostGridProps = {
  posts: BlogPostMeta[]
}

function PostGrid({ posts }: PostGridProps) {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
      {posts.map((post) => (
        <PostCard key={`${post.slug}-${post.lang}`} post={post} />
      ))}
    </div>
  )
}

export default PostGrid
