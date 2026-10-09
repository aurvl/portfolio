const DEFAULT_SITE_URL = 'https://aurvl.github.io/portfolio/'
const DEFAULT_SITE_NAME = 'Aurel Vehi'
const DEFAULT_GA_MEASUREMENT_ID = 'G-3L7YJ0JHG5'
const DEFAULT_CLARITY_PROJECT_ID = 'w3rmpxth6k'
const DEFAULT_SOCIAL_IMAGE = 'assets/images/hero-image.png'

const ABSOLUTE_URL_PATTERN = /^(?:[a-z]+:)?\/\//i

export const SITE_NAME = DEFAULT_SITE_NAME
export const PERSON_NAME = 'Aurel Vehi'
export const PERSON_ROLE = 'Applied Economist and PhD Researcher'
export const PERSON_DESCRIPTION =
  'Aurel Vehi, applied economist and PhD researcher, turns fragmented economic data into comparable indicators, econometric analysis and decision support for firms, territories and institutions.'
export const PERSON_SAME_AS = [
  'https://github.com/aurvl',
  'https://www.linkedin.com/in/aurel-vehi/',
]

export function getSiteUrl() {
  const configuredSiteUrl = import.meta.env.VITE_SITE_URL || DEFAULT_SITE_URL
  return configuredSiteUrl.endsWith('/') ? configuredSiteUrl : `${configuredSiteUrl}/`
}

export function getGoogleAnalyticsMeasurementId() {
  return import.meta.env.VITE_GA_MEASUREMENT_ID || DEFAULT_GA_MEASUREMENT_ID
}

export function getClarityProjectId() {
  return import.meta.env.VITE_CLARITY_PROJECT_ID || DEFAULT_CLARITY_PROJECT_ID
}

export function getDefaultSocialImage() {
  return buildAbsoluteSiteUrl(DEFAULT_SOCIAL_IMAGE)
}

export function withBasePath(value: string) {
  if (!value) {
    return import.meta.env.BASE_URL
  }

  if (
    ABSOLUTE_URL_PATTERN.test(value) ||
    value.startsWith('#') ||
    value.startsWith('data:') ||
    value.startsWith('mailto:') ||
    value.startsWith('tel:')
  ) {
    return value
  }

  const basePath = import.meta.env.BASE_URL.endsWith('/')
    ? import.meta.env.BASE_URL
    : `${import.meta.env.BASE_URL}/`

  if (value.startsWith(basePath)) {
    return value
  }

  const normalizedValue = value.replace(/^\.\//, '').replace(/^\/+/, '')

  return `${basePath}${normalizedValue}`.replace(/\/{2,}/g, '/')
}

export function buildAbsoluteSiteUrl(path = '') {
  const normalizedPath = path.replace(/^\/+/, '')
  return new URL(normalizedPath, getSiteUrl()).toString()
}

export function buildCanonicalPath(path = '') {
  return buildAbsoluteSiteUrl(path)
}

export function getResumeDownloadUrl(language: string) {
  return withBasePath(language === 'fr' ? 'assets/downloads/resume-fr.pdf' : 'assets/downloads/resume-en.pdf')
}

export function normalizeLegacyProjectLink(projectSlug: string, href: string) {
  if (!href) {
    return href
  }

  if (href.includes('/pages/post.html')) {
    return buildAbsoluteSiteUrl(`projects?project=${encodeURIComponent(projectSlug)}`)
  }

  return href
}
