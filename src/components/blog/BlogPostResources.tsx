import { FaGithub } from 'react-icons/fa'
import { LuCode, LuFileText } from 'react-icons/lu'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import rawBlogResources from '../../data/blog-resources.json'

type BlogResourceKey = 'code' | 'repo' | 'docs'

type BlogResourceItem = {
  key: BlogResourceKey
  href: string
}

type BlogPostResourcesProps = {
  postSlug: string
}

const BLOG_RESOURCE_ORDER: BlogResourceKey[] = ['code', 'repo', 'docs']
const EXPANDED_STEP = 52
const COLLAPSED_STEP = 10
const CIRCLE_SIZE = 48

const blogResources = rawBlogResources as Record<
  string,
  Partial<Record<BlogResourceKey, string>>
>

function BlogPostResources({ postSlug }: BlogPostResourcesProps) {
  const { t } = useTranslation()
  const [expanded, setExpanded] = useState(false)

  const items = useMemo(() => {
    const postResources = blogResources[postSlug]

    if (!postResources) {
      return []
    }

    return BLOG_RESOURCE_ORDER.flatMap((key) => {
      const href = postResources[key]

      if (!href) {
        return []
      }

      return [{ key, href }]
    })
  }, [postSlug])

  if (items.length === 0) {
    return null
  }

  if (items.length === 1) {
    const [item] = items

    return (
      <div className="mt-8 flex justify-end">
        <div className="flex flex-col items-end gap-2">
          <p className="text-[11px] uppercase tracking-[0.24em] text-[var(--text2-col)]">
            {t('blog.resources.title')}
          </p>
          <ResourceCircle
            item={item}
            label={t(`blog.resources.items.${item.key}`)}
          />
        </div>
      </div>
    )
  }

  const dockWidth = CIRCLE_SIZE + EXPANDED_STEP * (items.length - 1)

  return (
    <div className="mt-8 flex justify-end">
      <div className="flex flex-col items-end gap-2">
        <p className="text-[11px] uppercase tracking-[0.24em] text-[var(--text2-col)]">
          {t('blog.resources.title')}
        </p>

        <div
          className="relative h-12"
          style={{ width: `${dockWidth}px` }}
        >
          {items.map((item, index) => {
            const offset = expanded
              ? index * EXPANDED_STEP
              : index * COLLAPSED_STEP

            return (
              <ResourceCircle
                key={`${postSlug}-${item.key}`}
                item={item}
                label={t(`blog.resources.items.${item.key}`)}
                className="absolute right-0 top-0"
                style={{
                  transform: `translateX(-${offset}px)`,
                  zIndex: items.length - index,
                }}
                onClick={(event) => {
                  if (!expanded) {
                    event.preventDefault()
                    setExpanded(true)
                  }
                }}
              />
            )
          })}
        </div>
      </div>
    </div>
  )
}

type ResourceCircleProps = {
  item: BlogResourceItem
  label: string
  className?: string
  style?: React.CSSProperties
  onClick?: React.MouseEventHandler<HTMLAnchorElement>
}

function ResourceCircle({
  item,
  label,
  className = '',
  style,
  onClick,
}: ResourceCircleProps) {
  return (
    <a
      href={item.href}
      target="_blank"
      rel="noreferrer"
      aria-label={label}
      title={label}
      onClick={onClick}
      className={`flex h-12 w-12 items-center justify-center rounded-full border border-[var(--glass-border)]
      bg-[var(--glass-bg)]/90 text-[var(--text-col)] shadow-lg backdrop-blur-xl transition-transform duration-200
      ease-out hover:border-[var(--accent-lgtblue)] hover:text-[var(--accent-lgtblue)] ${className}`.trim()}
      style={style}
    >
      {item.key === 'code' ? (
        <LuCode size={18} />
      ) : item.key === 'repo' ? (
        <FaGithub size={18} />
      ) : (
        <LuFileText size={18} />
      )}
    </a>
  )
}

export default BlogPostResources
