import fs from 'node:fs'
import path from 'node:path'
import matter from 'gray-matter'
import { homeEn } from '../src/data/home'
import { homepage } from '../src/data/homepage'
import enLocale from '../src/locales/en.json'

type SeriesEntry = {
  slug: string
  title: { en: string }
  description: { en: string }
}

type PostEntry = {
  slug: string
  date: string
  seriesSlug: string | null
  title: string
  summary: string
  cover: string
}

// Page statique d'une route : son <title>, sa description et, pour un article, son image et son type Open Graph.
type PageMeta = {
  title: string
  description: string
  image?: string
  type?: 'website' | 'article'
}

const SITE_NAME = 'Aurel Vehi'
const publicationsLabels = homepage.getPublicationsLabels('en')

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
const blogRedirectPath = path.join(publicDir, 'blog', 'index.html')
const distDir = path.join(rootDir, 'dist')
// Mode « --pages » : à lancer APRÈS « vite build ». Il écrit un vrai index.html par route du sitemap dans dist/.
const isPagesMode = process.argv.includes('--pages')
const legacyRedirects = [
  { fileName: 'home_fr.html', lang: 'fr' },
  { fileName: 'home_en.html', lang: 'en' },
]

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

// Les URLs hors accueil finissent par « / » : GitHub Pages sert dist/<route>/index.html à cette adresse et redirige
// « /projects » vers « /projects/ ». Sitemap, canonical et og:url (voir src/lib/site.ts) utilisent la même forme.
const sitemapEntries: Array<{
  path: string
  lastmod: string
  changefreq: string
  priority: string
  meta?: PageMeta
}> = [
  { path: '', lastmod: homeLastMod, changefreq: 'monthly', priority: '1.0' },
  // Le Hub regroupe projets ET articles : sa date est la plus récente des deux. /blog n'est plus une page
  // (elle redirige vers le Hub, voir public/blog/index.html), donc elle ne figure ni dans le sitemap ni parmi les pages statiques.
  {
    path: 'projects/',
    lastmod: homeLastMod,
    changefreq: 'weekly',
    priority: '0.9',
    meta: {
      title: `${homeEn.projectsPage.seoTitle} | ${SITE_NAME}`,
      description: homeEn.projectsPage.seoDescription,
    },
  },
  {
    path: 'publications/',
    lastmod: homeLastMod,
    changefreq: 'monthly',
    priority: '0.8',
    meta: {
      title: `${publicationsLabels.seoTitle} | ${SITE_NAME}`,
      description: publicationsLabels.seoDescription,
    },
  },
  {
    path: 'series/',
    lastmod: latestPostDate,
    changefreq: 'weekly',
    priority: '0.8',
    meta: {
      title: `${enLocale.blog.section.series.title} | ${SITE_NAME}`,
      description: enLocale.blog.section.series.subtitle,
    },
  },
  ...series.map((entry) => ({
    path: `series/${entry.slug}/`,
    lastmod:
      posts
        .filter((post) => post.seriesSlug === entry.slug)
        .map((post) => post.date)
        .sort()
        .at(-1) ?? latestPostDate,
    changefreq: 'monthly',
    priority: '0.7',
    meta: {
      title: `${entry.title.en} | ${SITE_NAME}`,
      description: entry.description.en,
    },
  })),
  ...posts.map((post) => ({
    path: `blog/${post.slug}/`,
    lastmod: post.date,
    changefreq: 'monthly',
    priority: '0.8',
    meta: {
      title: `${post.title} | ${SITE_NAME}`,
      description: post.summary,
      image: post.cover,
      type: 'article' as const,
    },
  })),
]

if (isPagesMode) {
  writeStaticPages()
  process.exit(0)
}

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
fs.mkdirSync(path.dirname(blogRedirectPath), { recursive: true })
fs.writeFileSync(blogRedirectPath, buildBlogRedirectHtml(siteUrl))

for (const redirect of legacyRedirects) {
  fs.writeFileSync(
    path.join(publicDir, redirect.fileName),
    buildLegacyRedirectHtml(siteUrl, redirect.lang)
  )
}

console.log(`Generated robots.txt, sitemap.xml, 404.html, the /blog redirect, and legacy redirects for ${siteUrl}`)

// Écrit dist/<route>/index.html pour chaque route du sitemap (copie de dist/index.html avec ses propres balises SEO),
// puis vérifie que chaque URL du sitemap correspond à un fichier réel. 404.html reste pour les pages inexistantes.
function writeStaticPages() {
  const templatePath = path.join(distDir, 'index.html')

  if (!fs.existsSync(templatePath)) {
    throw new Error('dist/index.html est introuvable : lancer « vite build » avant « generate-seo.ts --pages ».')
  }

  const template = fs.readFileSync(templatePath, 'utf-8')
  let pageCount = 0

  for (const entry of sitemapEntries) {
    if (!entry.meta) continue

    const canonicalUrl = new URL(entry.path, siteUrl).toString()
    const imageUrl = entry.meta.image
      ? new URL(entry.meta.image.replace(/^\/+/, ''), siteUrl).toString()
      : undefined
    const targetDir = path.join(distDir, entry.path)

    fs.mkdirSync(targetDir, { recursive: true })
    fs.writeFileSync(
      path.join(targetDir, 'index.html'),
      applyPageMeta(template, entry.meta, canonicalUrl, imageUrl)
    )
    pageCount += 1
  }

  const missing = readSitemapLocations().filter((location) => !fs.existsSync(distFileForUrl(location)))

  if (missing.length > 0) {
    throw new Error(`URLs du sitemap sans fichier dans dist/ :\n${missing.join('\n')}`)
  }

  console.log(`Generated ${pageCount} static pages; every sitemap URL has a file in dist/`)
}

function readSitemapLocations() {
  const sitemap = fs.readFileSync(path.join(distDir, 'sitemap.xml'), 'utf-8')

  return [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1])
}

function distFileForUrl(location: string) {
  const relativePath = location.slice(siteUrl.length)
  const fileName = relativePath === '' || relativePath.endsWith('/') ? 'index.html' : ''

  return path.join(distDir, relativePath, fileName)
}

function applyPageMeta(template: string, meta: PageMeta, canonicalUrl: string, imageUrl?: string) {
  const title = escapeHtml(meta.title)
  const description = escapeHtml(meta.description)
  let html = template

  html = replaceOnce(html, /<title>[^<]*<\/title>/, `<title>${title}</title>`)
  html = replaceOnce(html, /(<meta\s+name="description"\s+content=")[^"]*(")/, `$1${description}$2`)
  html = replaceOnce(html, /(<link\s+rel="canonical"\s+href=")[^"]*(")/, `$1${canonicalUrl}$2`)
  html = replaceOnce(html, /(<meta\s+property="og:title"\s+content=")[^"]*(")/, `$1${title}$2`)
  html = replaceOnce(html, /(<meta\s+property="og:description"\s+content=")[^"]*(")/, `$1${description}$2`)
  html = replaceOnce(html, /(<meta\s+property="og:url"\s+content=")[^"]*(")/, `$1${canonicalUrl}$2`)
  html = replaceOnce(html, /(<meta\s+property="og:type"\s+content=")[^"]*(")/, `$1${meta.type ?? 'website'}$2`)

  if (imageUrl) {
    html = replaceOnce(html, /(<meta\s+property="og:image"\s+content=")[^"]*(")/, `$1${imageUrl}$2`)
  }

  const twitterTags = [
    `<meta name="twitter:title" content="${title}" />`,
    `<meta name="twitter:description" content="${description}" />`,
  ].join('\n    ')

  return html.replace('</head>', `  ${twitterTags}\n  </head>`)
}

function replaceOnce(source: string, pattern: RegExp, replacement: string) {
  if (!pattern.test(source)) {
    throw new Error(`Balise introuvable dans dist/index.html : ${pattern}`)
  }

  // Fonction de remplacement : un « $ » dans un titre ne doit pas être lu comme un motif spécial
  return source.replace(pattern, (...groups) => replacement.replace(/\$(\d)/g, (_, index) => groups[Number(index)] ?? ''))
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

function loadPosts() {
  const fileNames = fs
    .readdirSync(postsDir)
    .filter((fileName) => fileName.endsWith('.md'))

  const deduped = new Map<string, PostEntry>()
  const englishSlugs = new Set<string>()

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

    const isEnglish = data.lang === 'en' || fileName.endsWith('.en.md')
    const entry: PostEntry = {
      slug,
      date,
      seriesSlug,
      title: String(data.title ?? slug),
      summary: String(data.summary ?? ''),
      cover: String(data.cover ?? ''),
    }

    // Une seule entrée par article. La version anglaise (celle des pages statiques) l'emporte ; sinon la plus récente.
    const existing = deduped.get(slug)
    const keepExisting = existing && (englishSlugs.has(slug) || (!isEnglish && existing.date >= date))

    if (!keepExisting) {
      deduped.set(slug, entry)
    }

    if (isEnglish) {
      englishSlugs.add(slug)
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

function buildLegacyRedirectHtml(currentSiteUrl: string, lang: string) {
  const targetUrl = new URL('.', currentSiteUrl).toString()

  return `<!doctype html>
<html lang="${lang}">
  <head>
    <meta charset="UTF-8" />
    <meta name="robots" content="noindex,follow" />
    <link rel="canonical" href="${targetUrl}" />
    <meta http-equiv="refresh" content="0; url=${targetUrl}" />
    <title>Redirecting...</title>
    <script>
      (function() {
        var targetUrl = ${JSON.stringify(targetUrl)};
        window.location.replace(targetUrl + window.location.search + window.location.hash);
      })();
    </script>
  </head>
  <body>
    <p>This page moved to <a href="${targetUrl}">${targetUrl}</a>.</p>
  </body>
</html>
`
}

// /blog n'existe plus comme page : cette page statique répond en 200 et renvoie vers le bloc « Derniers articles » du Hub.
// Le renvoi est calculé depuis l'adresse courante (pas depuis siteUrl), donc il marche aussi en local ;
// `canonical` + `noindex` disent aux moteurs de recherche que la page de référence est /projects.
function buildBlogRedirectHtml(currentSiteUrl: string) {
  const canonicalUrl = new URL('projects', currentSiteUrl).toString()

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="robots" content="noindex,follow" />
    <link rel="canonical" href="${canonicalUrl}" />
    <title>Redirecting...</title>
    <script>
      (function() {
        var target = window.location.pathname.replace(/blog[/]?$/, 'projects');
        window.location.replace(target + window.location.search + '#blog');
      })();
    </script>
  </head>
  <body>
    <p>The blog moved to <a href="${canonicalUrl}#blog">${canonicalUrl}#blog</a>.</p>
  </body>
</html>
`
}
