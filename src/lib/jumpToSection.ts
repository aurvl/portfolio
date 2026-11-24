// Clic vers une section, sur ordinateur (appelé par navigateToSection).
//
// Sur l'accueil la scène est liée au scroll : pour que l'animation « morph » se joue, on fait défiler la page nous-mêmes,
// d'un mouvement continu (départ et arrivée en douceur) dont la durée grandit avec la distance : une transition voisine
// prend ~0,9 s, trois transitions ~2 s. La scène passe ainsi par ses vraies étapes, dans le bon ordre, dans les deux sens.
// Le calage automatique de la page (scroll-snap) est coupé le temps du mouvement (classe is-auto-scrolling, voir scene.css),
// et un geste de l'utilisateur (molette, doigt, clavier) l'interrompt aussitôt.
// En mouvement réduit : saut direct. Hors accueil (pas de scène) : défilement doux habituel.
const MIN_DURATION_MS = 800
const MAX_DURATION_MS = 2200
// Durée ajoutée par écran parcouru (une hauteur de fenêtre)
const MS_PER_SCREEN = 550

const easeInOut = (amount: number) => amount * amount * (3 - 2 * amount)

let stopCurrent: (() => void) | null = null

export function jumpToSection(sectionId: string) {
  const target = document.getElementById(sectionId)
  if (!target) return

  const isHome = Boolean(document.querySelector('.scene'))
  const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (!isHome) {
    target.scrollIntoView({ behavior: isReduced ? 'auto' : 'smooth', block: 'start' })
    return
  }
  if (isReduced) {
    target.scrollIntoView({ behavior: 'instant', block: 'start' })
    return
  }

  stopCurrent?.()
  const root = document.documentElement
  const from = window.scrollY
  const to = Math.max(0, Math.min(target.getBoundingClientRect().top + from, root.scrollHeight - window.innerHeight))
  const distance = Math.abs(to - from)
  if (distance < 2) return

  const screens = distance / Math.max(1, window.innerHeight)
  const duration = Math.min(MAX_DURATION_MS, MIN_DURATION_MS + (screens - 1) * MS_PER_SCREEN)
  const startTime = performance.now()
  let frame = 0

  const stop = () => {
    window.cancelAnimationFrame(frame)
    root.classList.remove('is-auto-scrolling')
    window.removeEventListener('wheel', stop)
    window.removeEventListener('touchstart', stop)
    window.removeEventListener('keydown', stop)
    if (stopCurrent === stop) stopCurrent = null
  }
  const step = (now: number) => {
    const amount = Math.min(1, (now - startTime) / Math.max(1, duration))
    window.scrollTo({ top: from + (to - from) * easeInOut(amount), behavior: 'instant' })
    if (amount < 1) frame = window.requestAnimationFrame(step)
    else stop()
  }

  root.classList.add('is-auto-scrolling')
  window.addEventListener('wheel', stop, { passive: true })
  window.addEventListener('touchstart', stop, { passive: true })
  window.addEventListener('keydown', stop)
  stopCurrent = stop
  frame = window.requestAnimationFrame(step)
}
