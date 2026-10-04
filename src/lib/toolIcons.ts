import skillsCatalog from '../data/skills.json'
import type { SkillCatalog } from '../types/skill'
import { withBasePath } from './site'

export type ToolIcon = {
  slug: string
  label: string
  src: string
}

const catalog = skillsCatalog as SkillCatalog

export const toolIcons: ToolIcon[] = catalog.categories.flatMap((category) =>
  category.items.flatMap((item) => {
    const src = item.icon.src

    if (!src) return []

    return [{
      slug: item.slug,
      label: item.content.label.en,
      src: src.startsWith('http') ? src : withBasePath(src),
    }]
  })
)

const toolIconsBySlug = new Map(toolIcons.map((tool) => [tool.slug, tool]))

export function getToolIcons(slugs: string[]) {
  return slugs
    .map((slug) => toolIconsBySlug.get(slug))
    .filter((tool): tool is ToolIcon => tool !== undefined)
}
