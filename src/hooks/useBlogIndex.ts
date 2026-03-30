import { useEffect, useMemo, useState } from 'react'
import { getAppLanguage } from '../lib/utils'
import { withBasePath } from '../lib/site'
import type { BlogPostMeta } from '../types/post'

let blogIndexCache: BlogPostMeta[] | null = null
let blogIndexPromise: Promise<BlogPostMeta[]> | null = null

async function loadBlogIndex() {
  if (blogIndexCache) {
    return blogIndexCache
  }

  if (!blogIndexPromise) {
    blogIndexPromise = fetch(withBasePath('blog-index.json'))
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Unable to load blog index: ${response.status}`)
        }

        return response.json() as Promise<BlogPostMeta[]>
      })
      .then((payload) => {
        blogIndexCache = payload
        return payload
      })
  }

  return blogIndexPromise
}

export function useBlogIndex(lang: string) {
  const [allPosts, setAllPosts] = useState<BlogPostMeta[]>(blogIndexCache ?? [])
  const [isLoading, setIsLoading] = useState(blogIndexCache === null)
  const [error, setError] = useState<string | null>(null)
  const language = getAppLanguage(lang)

  useEffect(() => {
    let isCancelled = false

    loadBlogIndex()
      .then((posts) => {
        if (isCancelled) {
          return
        }

        setAllPosts(posts)
        setIsLoading(false)
      })
      .catch((loadError) => {
        if (isCancelled) {
          return
        }

        setError(loadError instanceof Error ? loadError.message : 'Unknown error')
        setIsLoading(false)
      })

    return () => {
      isCancelled = true
    }
  }, [])

  const index = useMemo(
    () => allPosts.filter((post) => post.lang === language),
    [allPosts, language]
  )

  const latest = useMemo(() => {
    return [...index]
      .sort((postA, postB) => new Date(postB.date).getTime() - new Date(postA.date).getTime())
      .slice(0, 3)
  }, [index])

  const tags = useMemo(
    () =>
      Array.from(new Set(index.flatMap((post) => post.tags)))
        .sort((tagA, tagB) => tagA.localeCompare(tagB)),
    [index]
  )

  return {
    index,
    allPosts,
    latest,
    tags,
    isLoading,
    error,
  }
}
