import type { PostHeading } from '../types/post'

const postFiles = import.meta.glob('/src/content/posts/*.md', {
  query: '?raw',
  import: 'default',
})

export function stripFrontmatter(raw: string) {
  return raw.replace(/^---[\s\S]+?---\s*/, '').trim()
}

export function createHeadingId(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function extractMarkdownHeadings(content: string): PostHeading[] {
  const headings: PostHeading[] = []
  let isInsideCodeFence = false

  for (const rawLine of content.split('\n')) {
    const trimmedLine = rawLine.trim()

    if (/^```/.test(trimmedLine)) {
      isInsideCodeFence = !isInsideCodeFence
      continue
    }

    if (isInsideCodeFence) {
      continue
    }

    const match = /^(#{1,3})\s+(.+?)\s*$/.exec(trimmedLine)

    if (!match) {
      continue
    }

    const text = match[2].replace(/[`*_]/g, '').trim()

    if (!text) {
      continue
    }

    headings.push({
      depth: match[1].length,
      text,
      id: createHeadingId(text),
    })
  }

  return headings
}

export function formatPostDate(date: string, language: string) {
  return new Date(date).toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export async function getPost(slug: string, lang: string) {
  const key = `/src/content/posts/${slug}.${lang}.md`
  const loader = postFiles[key]

  if (!loader) {
    return null
  }

  const raw = await (loader() as Promise<string>)

  return stripFrontmatter(raw)
}
