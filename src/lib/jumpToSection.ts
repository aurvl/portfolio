// Clic de navbar vers une section, sur ordinateur.
//
// Sur l'accueil la scène est liée au scroll : défiler jusqu'à la cible (même vite) fait passer à l'écran toutes les
// étapes intermédiaires de la scène, parfois en désordre (bouton « Learn more » à moitié transformé, contenu fantôme).
// À la place : un voile de la couleur de la page s'allume en fondu (~120 ms), on saute SANS défiler jusqu'à la cible
// pendant qu'il couvre tout, puis il s'éteint (~130 ms) sur l'état final de la section. Aucun état intermédiaire visible.
// Hors accueil (pas de scène) ou en mouvement réduit : comportement habituel.
const FADE_IN_MS = 120
const FADE_OUT_MS = 130

let activeVeil: HTMLElement | null = null

export function jumpToSection(sectionId: string) {
  const target = document.getElementById(sectionId)
  if (!target) return

  const isHome = Boolean(document.querySelector('.scene'))
  const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (!isHome) {
    target.scrollIntoView({ behavior: isReduced ? 'auto' : 'smooth', block: 'start' })
    return
  }
  // Déjà sur place, en mouvement réduit, ou un fondu est déjà en cours : saut direct
  if (isReduced || activeVeil || Math.abs(target.getBoundingClientRect().top) < 4 || typeof target.animate !== 'function') {
    target.scrollIntoView({ behavior: 'instant', block: 'start' })
    return
  }

  const veil = document.createElement('div')
  veil.setAttribute('aria-hidden', 'true')
  Object.assign(veil.style, {
    position: 'fixed',
    inset: '0',
    zIndex: '9999',
    background: 'var(--color-page)',
    opacity: '0',
    pointerEvents: 'none',
  })
  document.body.appendChild(veil)
  activeVeil = veil

  const fadeIn = veil.animate([{ opacity: 0 }, { opacity: 1 }], { duration: FADE_IN_MS, easing: 'ease-in', fill: 'forwards' })
  fadeIn.onfinish = () => {
    target.scrollIntoView({ behavior: 'instant', block: 'start' })
    // Deux images d'attente : la scène (liée au scroll) a le temps de se poser sur son état final avant de se révéler
    window.requestAnimationFrame(() =>
      window.requestAnimationFrame(() => {
        const fadeOut = veil.animate([{ opacity: 1 }, { opacity: 0 }], { duration: FADE_OUT_MS, easing: 'ease-out', fill: 'forwards' })
        fadeOut.onfinish = () => {
          veil.remove()
          activeVeil = null
        }
      }),
    )
  }
}
