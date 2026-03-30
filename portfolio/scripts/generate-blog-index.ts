import fs from 'node:fs'
import path from 'node:path'
import matter from 'gray-matter'

type PostIndexItem = {
  slug: string
  seriesSlug: string | null
  lang: 'en' | 'fr'
  title: string
  summary: string
  date: string
  tags: string[]
  cover: string
  featured: boolean
  readTime: number
  headings: Array<{
    depth: number
    text: string
    id: string
  }>
}

const DEFAULT_COVER = '/assets/blog/images/defaultblogpostcover.png'
const postsDir = path.join(process.cwd(), 'src/content/posts')
const outputPath = path.join(process.cwd(), 'public/blog-index.json')
const seriesPath = path.join(process.cwd(), 'src/data/series.json')

type SeriesEntry = {
  slug: string
  cover: string
}

const seriesCoverBySlug = new Map<string, string>(
  (fs.existsSync(seriesPath) ? (JSON.parse(fs.readFileSync(seriesPath, 'utf-8')) as SeriesEntry[]) : [])
    .filter((entry) => typeof entry.slug === 'string' && typeof entry.cover === 'string')
    .map((entry) => [entry.slug, entry.cover])
)

function createHeadingId(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function extractHeadings(content: string) {
  const headings: Array<{ depth: number; text: string; id: string }> = []
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

function estimateReadTime(content: string) {
  const words = content.trim().split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.ceil(words / 200))
}

const files = fs.readdirSync(postsDir).filter((file) => file.endsWith('.md'))

const index: PostIndexItem[] = files
  .map((file) => {
    const raw = fs.readFileSync(path.join(postsDir, file), 'utf-8')
    const { data, content } = matter(raw)
    const slugFromFile = file.replace(/\.(en|fr)\.md$/, '')
    const langFromFile: 'fr' | 'en' = file.endsWith('.fr.md') ? 'fr' : 'en'

    return {
      slug: String(data.slug ?? slugFromFile),
      seriesSlug:
        typeof data.seriesSlug === 'string' && data.seriesSlug.trim().length > 0
          ? data.seriesSlug
          : null,
      lang: data.lang === 'fr' ? 'fr' : langFromFile,
      title: String(data.title ?? slugFromFile),
      summary: String(data.summary ?? '').trim(),
      date: String(data.date ?? new Date().toISOString().slice(0, 10)),
      tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
      cover:
        (typeof data.seriesSlug === 'string' &&
        data.seriesSlug.trim().length > 0 &&
        seriesCoverBySlug.get(data.seriesSlug.trim())) ||
        (typeof data.cover === 'string' && data.cover.trim().length > 0
          ? data.cover
          : DEFAULT_COVER),
      featured: Boolean(data.featured),
      readTime: estimateReadTime(content),
      headings: extractHeadings(content),
    }
  })
  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

fs.writeFileSync(outputPath, JSON.stringify(index, null, 2))

console.log(`Indexed ${index.length} blog posts`)
