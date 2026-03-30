import type { AppLanguage } from './i18n'

export type LocalizedSkillField<T> = Record<AppLanguage, T>

export type SkillItem = {
  id: string
  slug: string
  icon: {
    src: string | null
    key?: 'openai' | 'copilot' | null
    alt: LocalizedSkillField<string>
  }
  content: {
    label: LocalizedSkillField<string>
    description: LocalizedSkillField<string>
  }
  tags: string[]
}

export type SkillCategory = {
  id: string
  label: LocalizedSkillField<string>
  description: LocalizedSkillField<string>
  items: SkillItem[]
}

export type SkillCatalog = {
  categories: SkillCategory[]
}
