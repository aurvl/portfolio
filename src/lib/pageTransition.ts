// Transitions ENTRE les pages (View Transitions natives). LA fonction de navigation entre pages : `navigateToPage(to)`.
// Les liens (`<a>`, `<Link>`) y passent automatiquement via components/routing/PageTransitions ; le code qui navigue par
// programme appelle navigateToPage au lieu de `navigate`.
//
// Sens : aller plus loin dans le site (accueil < Projets, Blog, Publications < article, série) = zoom avant ; revenir =
// zoom arrière. Le sens est posé sur <html> (data-vt) avant la transition, lu par page-transitions.css.
// Sans View Transitions (navigateur ancien) : navigation normale. Mouvement réduit : fondu (géré en CSS).
import { preloadPageFor } from '../app/pages'

type NavigateFunction = (to: string) => void

let navigateRoute: NavigateFunction | null = null
let resolveCommit: (() => void) | null = null

// Posé par PageTransitions (dans le routeur)
export function registerRouterNavigate(navigate: NavigateFunction | null) {
  navigateRoute = navigate
}

// Appelé par PageTransitions quand la nouvelle page est affichée : la View Transition peut prendre sa photo « arrivée ».
// Renvoie vrai si une transition attendait.
export function notifyPageCommitted() {
  const resolve = resolveCommit
  resolveCommit = null
  resolve?.()

  return Boolean(resolve)
}

// Profondeur d'une route : 0 accueil, 1 pages de premier niveau, 2 articles et séries
export function getRouteDepth(pathname: string) {
  const path = pathname.replace(/^\/+|\/+$/g, '')
  if (path === '') return 0

  return /^(blog|series)\/.+/.test(path) ? 2 : 1
}

// Chemin du routeur (sans le préfixe du site, ex. /portfolio) à partir d'un chemin de la page
export function stripBase(pathname: string) {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '')

  return base && pathname.startsWith(base) ? pathname.slice(base.length) || '/' : pathname
}

type ViewTransitionDocument = Document & {
  startViewTransition?: (update: () => Promise<void>) => { finished: Promise<void> }
}

export function navigateToPage(to: string) {
  const navigate = navigateRoute
  if (!navigate) return

  const doc = document as ViewTransitionDocument
  if (typeof doc.startViewTransition !== 'function') {
    navigate(to)
    return
  }

  const target = new URL(to, window.location.origin)
  const direction = getRouteDepth(target.pathname) >= getRouteDepth(stripBase(window.location.pathname)) ? 'forward' : 'back'
  const root = document.documentElement

  // On charge la page d'arrivée AVANT : elle s'affiche alors sans écran d'attente
  void preloadPageFor(target.pathname).then(() => {
    root.dataset.vt = direction
    const transition = doc.startViewTransition!(
      () =>
        new Promise<void>((resolve) => {
          resolveCommit = resolve
          navigate(to)
          // Garde-fou : si la page n'annonce rien, on ne bloque jamais la navigation
          window.setTimeout(() => notifyPageCommitted(), 1200)
        }),
    )
    const clear = () => {
      delete root.dataset.vt
    }
    transition.finished.then(clear, clear)
  })
}
