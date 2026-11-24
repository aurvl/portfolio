// Branche les transitions de page (lib/pageTransition) sur le routeur : donne la fonction `navigate` à la fonction centrale,
// annonce quand la nouvelle page est affichée, et intercepte les clics sur tous les liens internes (navbar, boutons, pied
// de page, cartes) pour les faire passer par navigateToPage. Aucun lien n'a rien de spécial à faire.
import { useEffect, useLayoutEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { navigateToPage, notifyPageCommitted, registerRouterNavigate, stripBase } from '../../lib/pageTransition'

function PageTransitions() {
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    registerRouterNavigate((to) => navigate(to))

    return () => registerRouterNavigate(null)
  }, [navigate])

  // Page affichée : si une transition attend, on la libère (et la page arrive en haut, sans saut après coup)
  useLayoutEffect(() => {
    if (notifyPageCommitted() && !location.hash) window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }, [location.key, location.hash])

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
      const anchor = (event.target as Element | null)?.closest<HTMLAnchorElement>('a[href]')
      if (!anchor || anchor.target === '_blank' || anchor.hasAttribute('download')) return

      const url = new URL(anchor.href, window.location.href)
      if (url.origin !== window.location.origin) return
      if (!url.pathname.startsWith(import.meta.env.BASE_URL.replace(/\/$/, ''))) return
      // Même page : les liens vers une section de l'accueil sont pris par navigateToSection, le reste par le routeur
      if (url.pathname === window.location.pathname) return

      event.preventDefault()
      navigateToPage(`${stripBase(url.pathname)}${url.search}${url.hash}`)
    }

    window.addEventListener('click', handleClick, true)

    return () => window.removeEventListener('click', handleClick, true)
  }, [])

  return null
}

export default PageTransitions
