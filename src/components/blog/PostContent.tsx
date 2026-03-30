import MdContentRenderer from '../ui/MarkdownRenderer'

type PostContentProps = {
  content: string
}

function PostContent({ content }: PostContentProps) {
  return (
    <article className="min-w-0 rounded-lg bg-[var(--glass-bg)]/5 p-6 backdrop-blur-xl md:p-8">
      <MdContentRenderer content={content} />
    </article>
  )
}

export default PostContent
