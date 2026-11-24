// LA fonction de navigation vers une section de l'accueil (Accueil, About, Recherche, Contact). Tout lien ou bouton qui
// mène à une section passe par ici ; rien d'autre ne doit appeler scrollIntoView / scrollTo pour cela.
//   - mobile et tablette : transition de la scène fixe (événement `scene:go`, écouté par useBambooMobile) ;
//   - ordinateur : fondu vers l'état final de la section (jumpToSection) ;
//   - hors accueil : défilement doux habituel (jumpToSection).
// Les liens `<a>` / `<Link>` vers `/#about`, `#research`… sont interceptés automatiquement par useSectionLinks (monté sur
// l'accueil) : un nouveau lien de ce genre n'a rien à faire de spécial.
import { useEffect } from 'react'
import { jumpToSection } from './jumpToSection'

// Identifiants des sections de l'accueil
export const HOME_SECTION_IDS = ['home', 'about', 'research', 'contact-form'] as const

export function navigateToSection(sectionId: string) {
  if (document.documentElement.dataset.scene) {
    window.dispatchEvent(new CustomEvent('scene:go', { detail: sectionId }))
    return
  }
  jumpToSection(sectionId)
}

// Sur l'accueil : un clic sur un lien interne qui vise une section de cette même page passe par navigateToSection au lieu de
// la navigation du routeur (qui sauterait brutalement à l'ancre). Capture : on passe avant le gestionnaire du routeur.
export function useSectionLinks() {
  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
      const anchor = (event.target as Element | null)?.closest<HTMLAnchorElement>('a[href]')
      if (!anchor || anchor.target === '_blank' || anchor.hasAttribute('download')) return

      const url = new URL(anchor.href, window.location.href)
      const isSamePage = url.origin === window.location.origin && url.pathname === window.location.pathname
      const sectionId = url.hash.slice(1)
      if (!isSamePage || !(HOME_SECTION_IDS as readonly string[]).includes(sectionId)) return

      event.preventDefault()
      navigateToSection(sectionId)
    }

    window.addEventListener('click', handleClick, true)

    return () => window.removeEventListener('click', handleClick, true)
  }, [])
}
