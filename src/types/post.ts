import type { AppLanguage } from './i18n'

export type PostHeading = {
  depth: number
  text: string
  id: string
}

export type BlogPostMeta = {
  slug: string
  seriesSlug: string | null
  lang: AppLanguage
  title: string
  summary: string
  date: string
  tags: string[]
  cover: string
  featured: boolean
  readTime: number
  headings: PostHeading[]
}

export type BlogPost = BlogPostMeta & {
  content: string
}
