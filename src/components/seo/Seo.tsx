import { useEffect } from 'react'
import {
  PERSON_NAME,
  SITE_NAME,
  buildCanonicalPath,
  getDefaultSocialImage,
} from '../../lib/site'

type SeoProps = {
  title: string
  description: string
  path?: string
  image?: string
  type?: 'website' | 'article'
  lang?: string
  robots?: string
  publishedTime?: string
  jsonLd?: Record<string, unknown> | Array<Record<string, unknown>>
}

function Seo({
  title,
  description,
  path = '',
  image,
  type = 'website',
  lang = 'en',
  robots = 'index,follow',
  publishedTime,
  jsonLd,
}: SeoProps) {
  useEffect(() => {
    const canonicalUrl = buildCanonicalPath(path)
    const imageUrl = image ?? getDefaultSocialImage()
    const fullTitle = title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`

    document.title = fullTitle
    document.documentElement.lang = lang === 'fr' ? 'fr' : 'en'

    upsertMetaTag('name', 'description', description)
    upsertMetaTag('name', 'author', PERSON_NAME)
    upsertMetaTag('name', 'robots', robots)
    upsertMetaTag('name', 'twitter:card', 'summary_large_image')
    upsertMetaTag('name', 'twitter:title', fullTitle)
    upsertMetaTag('name', 'twitter:description', description)
    upsertMetaTag('name', 'twitter:image', imageUrl)
    upsertMetaTag('property', 'og:site_name', SITE_NAME)
    upsertMetaTag('property', 'og:type', type)
    upsertMetaTag('property', 'og:title', fullTitle)
    upsertMetaTag('property', 'og:description', description)
    upsertMetaTag('property', 'og:url', canonicalUrl)
    upsertMetaTag('property', 'og:image', imageUrl)

    if (publishedTime) {
      upsertMetaTag('property', 'article:published_time', publishedTime)
    }

    upsertCanonicalLink(canonicalUrl)
    upsertJsonLd('app-jsonld', jsonLd)
  }, [description, image, jsonLd, lang, path, publishedTime, robots, title, type])

  return null
}

function upsertMetaTag(attribute: 'name' | 'property', key: string, value: string) {
  let element = document.head.querySelector<HTMLMetaElement>(`meta[${attribute}="${key}"]`)

  if (!element) {
    element = document.createElement('meta')
    element.setAttribute(attribute, key)
    document.head.appendChild(element)
  }

  element.content = value
}

function upsertCanonicalLink(href: string) {
  let element = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')

  if (!element) {
    element = document.createElement('link')
    element.rel = 'canonical'
    document.head.appendChild(element)
  }

  element.href = href
}

function upsertJsonLd(
  elementId: string,
  payload: Record<string, unknown> | Array<Record<string, unknown>> | undefined
) {
  const existing = document.getElementById(elementId)

  if (!payload) {
    existing?.remove()
    return
  }

  const script =
    existing instanceof HTMLScriptElement ? existing : document.createElement('script')

  script.id = elementId
  script.type = 'application/ld+json'
  script.text = JSON.stringify(payload)

  if (!existing) {
    document.head.appendChild(script)
  }
}

export default Seo
