// Les pages du site, chargées à la demande. `preloadPageFor(chemin)` les charge AVANT une transition de page : une fois chargée,
// la page s'affiche tout de suite (sans écran « Loading… »), donc l'image « arrivée » de la View Transition est la vraie page.
import { lazy, type ComponentType } from 'react'
import { matchPath } from 'react-router-dom'

type PageModule = { default: ComponentType }

function createPage(load: () => Promise<PageModule>) {
  let Loaded: ComponentType | null = null
  const Lazy = lazy(() =>
    load().then((module) => {
      Loaded = module.default
      return module
    }),
  )
  const Page = () => (Loaded ? <Loaded /> : <Lazy />)
  const preload = () =>
    load().then((module) => {
      Loaded = module.default
    })

  return { Page, preload }
}

export const homePage = createPage(() => import('../pages/HomePage'))
export const blogPage = createPage(() => import('../pages/BlogPage'))
export const blogPostPage = createPage(() => import('../pages/BlogPostPage'))
export const seriesPage = createPage(() => import('../pages/SeriesPage'))
export const projectsPage = createPage(() => import('../pages/ProjectsPage'))
export const publicationsPage = createPage(() => import('../pages/PublicationsPage'))

const PRELOADERS: Array<{ path: string; preload: () => Promise<void> }> = [
  { path: '/', preload: homePage.preload },
  { path: '/blog', preload: blogPage.preload },
  { path: '/blog/:slug', preload: blogPostPage.preload },
  { path: '/series/:seriesSlug', preload: seriesPage.preload },
  { path: '/projects', preload: projectsPage.preload },
  { path: '/publications', preload: publicationsPage.preload },
]

// Charge la page qui correspond à ce chemin (sans le préfixe du site) ; ne rejette jamais
export function preloadPageFor(pathname: string): Promise<void> {
  const route = PRELOADERS.find(({ path }) => matchPath({ path, end: true }, pathname))

  return (route?.preload() ?? Promise.resolve()).catch(() => undefined)
}
