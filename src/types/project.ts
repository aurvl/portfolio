import type { AppLanguage } from './i18n'

export type LocalizedField<T> = Record<AppLanguage, T>

export type ProjectContent = {
  title: string
  summary: string
  description: string
}

export type Project = {
  id: string
  slug: string
  status: 'completed' | 'in-progress' | 'archived' | 'planned' | null
  date: string
  featured: boolean
  window?: {
    enabled: boolean
    contentSlug: string
    access: string
  }
  technicalLevel: 1 | 2 | 3
  cover: {
    src: string
    alt: LocalizedField<string>
  }
  links: {
    primary: string | null
    readMore: string | null
    github: string | null
    live: string | null
  }
  taxonomy: {
    domains: string[]
    tools: string[]
    keywords: LocalizedField<string[]>
  }
  content: LocalizedField<ProjectContent>
}
