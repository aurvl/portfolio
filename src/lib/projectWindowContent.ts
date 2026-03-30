import type { ProjectWindowSections } from '../types/project-window'
import { getAppLanguage } from './utils'

type ProjectWindowContentEntry = {
  sections: ProjectWindowSections
}

const EMPTY_SECTIONS: ProjectWindowSections = {
  overview: '',
  method: '',
  value: '',
}

const rawProjectWindows = import.meta.glob('../content/project-windows/*.md', {
  eager: true,
  import: 'default',
  query: '?raw',
}) as Record<string, string>

const projectWindowContentMap = Object.entries(rawProjectWindows).reduce<
  Record<string, ProjectWindowContentEntry>
>((accumulator, [filePath, rawContent]) => {
  const match = filePath.match(/\/([^/]+)\.(en|fr)\.md$/)

  if (!match) {
    return accumulator
  }

  const [, slug, language] = match

  accumulator[`${slug}.${language}`] = {
    sections: parseProjectWindowMarkdown(rawContent),
  }

  return accumulator
}, {})

export function getProjectWindowSections(
  slug: string,
  language: string
): ProjectWindowSections {
  const appLanguage = getAppLanguage(language)

  return (
    projectWindowContentMap[`${slug}.${appLanguage}`]?.sections ??
    projectWindowContentMap[`${slug}.en`]?.sections ??
    EMPTY_SECTIONS
  )
}

function parseProjectWindowMarkdown(markdown: string): ProjectWindowSections {
  const content = stripFrontmatter(markdown).trim()

  if (!content) {
    return EMPTY_SECTIONS
  }

  const matches = Array.from(content.matchAll(/^#{1,2}\s+(Overview|Method|Value)\s*$/gm))

  if (matches.length === 0) {
    return EMPTY_SECTIONS
  }

  const sections = { ...EMPTY_SECTIONS }

  for (const [index, match] of matches.entries()) {
    const heading = match[1]?.toLowerCase() as keyof ProjectWindowSections | undefined
    const startIndex = (match.index ?? 0) + match[0].length
    const endIndex = matches[index + 1]?.index ?? content.length

    if (!heading) {
      continue
    }

    sections[heading] = content.slice(startIndex, endIndex).trim()
  }

  return sections
}

function stripFrontmatter(markdown: string): string {
  const normalized = markdown.replace(/\r\n/g, '\n')

  if (!normalized.startsWith('---\n')) {
    return normalized
  }

  const frontmatterEndIndex = normalized.indexOf('\n---\n', 4)

  if (frontmatterEndIndex === -1) {
    return normalized
  }

  return normalized.slice(frontmatterEndIndex + 5)
}
