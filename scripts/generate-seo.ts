import fs from 'node:fs'
import path from 'node:path'
import matter from 'gray-matter'

type SeriesEntry = {
  slug: string
}

type PostEntry = {
  slug: string
  date: string
  seriesSlug: string | null
}

const DEFAULT_SITE_URL = 'https://aurvl.github.io/portfolio/'
const rootDir = process.cwd()
const envValues = loadDotEnv(path.join(rootDir, '.env'))
const siteUrl = (process.env.VITE_SITE_URL || envValues.VITE_SITE_URL || DEFAULT_SITE_URL).replace(
  /\/?$/,
  '/'
)
const publicDir = path.join(rootDir, 'public')
const postsDir = path.join(rootDir, 'src/content/posts')
const projectsPath = path.join(rootDir, 'src/data/projects.json')
const seriesPath = path.join(rootDir, 'src/data/series.json')
const robotsPath = path.join(publicDir, 'robots.txt')
const sitemapPath = path.join(publicDir, 'sitemap.xml')
const spaFallbackPath = path.join(publicDir, '404.html')

const posts = loadPosts()
const projects = loadProjects()
const series = loadSeries()
const latestProjectDate = projects
  .map((project) => project.date)
  .filter(Boolean)
  .sort()
  .at(-1) ?? today()
const latestPostDate = posts
  .map((post) => post.date)
  .filter(Boolean)
  .sort()
  .at(-1) ?? today()
const homeLastMod = latestProjectDate > latestPostDate ? latestProjectDate : latestPostDate

const sitemapEntries = [
  { path: '', lastmod: homeLastMod, changefreq: 'monthly', priority: '1.0' },
  { path: 'projects', lastmod: latestProjectDate, changefreq: 'weekly', priority: '0.9' },
  { path: 'blog', lastmod: latestPostDate, changefreq: 'weekly', priority: '0.9' },
  ...series.map((entry) => ({
    path: `series/${entry.slug}`,
    lastmod:
      posts
        .filter((post) => post.seriesSlug === entry.slug)
        .map((post) => post.date)
        .sort()
        .at(-1) ?? latestPostDate,
    changefreq: 'monthly',
    priority: '0.7',
  })),
  ...posts.map((post) => ({
    path: `blog/${post.slug}`,
    lastmod: post.date,
    changefreq: 'monthly',
    priority: '0.8',
  })),
]

fs.mkdirSync(publicDir, { recursive: true })
fs.writeFileSync(
  robotsPath,
  `User-agent: *\nAllow: /\nSitemap: ${new URL('sitemap.xml', siteUrl).toString()}\n`
)
fs.writeFileSync(
  sitemapPath,
  [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...sitemapEntries.map(
      (entry) => `  <url>
    <loc>${new URL(entry.path, siteUrl).toString()}</loc>
    <lastmod>${entry.lastmod}</lastmod>
    <changefreq>${entry.changefreq}</changefreq>
    <priority>${entry.priority}</priority>
  </url>`
    ),
    '</urlset>',
    '',
  ].join('\n')
)
fs.writeFileSync(spaFallbackPath, buildSpaFallbackHtml(siteUrl))

console.log(`Generated robots.txt, sitemap.xml, and 404.html for ${siteUrl}`)

function loadPosts() {
  const fileNames = fs
    .readdirSync(postsDir)
    .filter((fileName) => fileName.endsWith('.md'))

  const deduped = new Map<string, PostEntry>()

  for (const fileName of fileNames) {
    const filePath = path.join(postsDir, fileName)
    const raw = fs.readFileSync(filePath, 'utf-8')
    const { data } = matter(raw)
    const slug = String(data.slug ?? fileName.replace(/\.(en|fr)\.md$/, ''))
    const date = normalizeDateValue(data.date)
    const seriesSlug =
      typeof data.seriesSlug === 'string' && data.seriesSlug.trim().length > 0
        ? data.seriesSlug.trim()
        : null

    const existing = deduped.get(slug)

    if (!existing || existing.date < date) {
      deduped.set(slug, {
        slug,
        date,
        seriesSlug,
      })
    }
  }

  return [...deduped.values()]
}

function loadProjects() {
  const projects = JSON.parse(fs.readFileSync(projectsPath, 'utf-8')) as Array<{ date?: string }>

  return projects.map((project) => ({
    ...project,
    date: normalizeDateValue(project.date),
  }))
}

function loadSeries() {
  return JSON.parse(fs.readFileSync(seriesPath, 'utf-8')) as SeriesEntry[]
}

function today() {
  return new Date().toISOString().slice(0, 10)
}

function normalizeDateValue(value: unknown) {
  if (value instanceof Date) {
    return value.toISOString().slice(0, 10)
  }

  const rawValue = String(value ?? '').trim()

  if (!rawValue) {
    return today()
  }

  const parsedValue = new Date(rawValue)

  if (Number.isNaN(parsedValue.getTime())) {
    return today()
  }

  return parsedValue.toISOString().slice(0, 10)
}

function loadDotEnv(filePath: string) {
  if (!fs.existsSync(filePath)) {
    return {} as Record<string, string>
  }

  return fs
    .readFileSync(filePath, 'utf-8')
    .split(/\r?\n/)
    .reduce<Record<string, string>>((accumulator, line) => {
      const trimmedLine = line.trim()

      if (!trimmedLine || trimmedLine.startsWith('#')) {
        return accumulator
      }

      const separatorIndex = trimmedLine.indexOf('=')

      if (separatorIndex === -1) {
        return accumulator
      }

      const key = trimmedLine.slice(0, separatorIndex).trim()
      const value = trimmedLine.slice(separatorIndex + 1).trim()

      if (key) {
        accumulator[key] = value
      }

      return accumulator
    }, {})
}

function buildSpaFallbackHtml(currentSiteUrl: string) {
  const pathname = new URL(currentSiteUrl).pathname
  const pathSegmentsToKeep = pathname.split('/').filter(Boolean).length

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Redirecting...</title>
    <script>
      (function() {
        var pathSegmentsToKeep = ${pathSegmentsToKeep};
        var locationData = window.location;
        var redirectPath =
          locationData.protocol +
          '//' +
          locationData.hostname +
          (locationData.port ? ':' + locationData.port : '') +
          locationData.pathname
            .split('/')
            .slice(0, 1 + pathSegmentsToKeep)
            .join('/') +
          '/?/' +
          locationData.pathname
            .slice(1)
            .split('/')
            .slice(pathSegmentsToKeep)
            .join('/')
            .replace(/&/g, '~and~') +
          (locationData.search
            ? '&' + locationData.search.slice(1).replace(/&/g, '~and~')
            : '') +
          locationData.hash;

        locationData.replace(redirectPath);
      })();
    </script>
  </head>
  <body></body>
</html>
`
}
