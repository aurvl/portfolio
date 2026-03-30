import type { LocalizedField } from './project'

export type Series = {
  id: string
  slug: string
  featured: boolean
  title: LocalizedField<string>
  description: LocalizedField<string>
  cover: string
}
