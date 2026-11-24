// Logique commune des deux navbars (Navbar classique et MorphNavbar de l'accueil) :
// section active (IntersectionObserver), menu compact (useCompactMenu), rendu des entrées.
import { useEffect, useState, type ReactElement } from 'react'
import { Link, useLocation } from 'react-router-dom'
import type { NavbarSection } from '../components/layout/Navbar'
import { cn } from '../lib/cn'
import { useCompactMenu } from './useCompactMenu'

function scrollToSection(sectionId: string) {
  // Mobile et tablette : chaque écran (Accueil, About, Recherche, Contact) est une scène à part, on y va par une
  // transition au lieu de défiler (useBambooMobile)
  if (document.documentElement.dataset.scene) {
    window.dispatchEvent(new CustomEvent('scene:go', { detail: sectionId }))
    return
  }
  document.getElementById(sectionId)?.scrollIntoView({
    behavior: 'smooth',
    block: 'start',
  })
}

export function useNavbarModel(sections: NavbarSection[], reducedMotion: boolean) {
  const location = useLocation()
  const [activeSection, setActiveSection] = useState(sections[0]?.id ?? '')
  const menu = useCompactMenu(reducedMotion)

  const isHrefActive = (section: NavbarSection) => {
    if (section.download || !section.href) return false

    if (section.matchPaths?.some((path) => location.pathname.startsWith(path))) {
      return true
    }

    const [pathname, hash] = section.href.split('#')

    if (hash) {
      return location.pathname === pathname && location.hash === `#${hash}`
    }

    return location.pathname === section.href
  }

  const isActive = (section: NavbarSection) =>
    section.href ? isHrefActive(section) : activeSection === section.id

  // Suit la section visible à l'écran pour mettre en avant l'onglet correspondant.
  // L'observateur ne regarde qu'une bande au milieu de l'écran (marges négatives).
  useEffect(() => {
    const pageSections = sections
      .filter((section) => !section.href)
      .map((section) => document.getElementById(section.id))
      .filter((element): element is HTMLElement => element !== null)

    if (pageSections.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries.find((entry) => entry.isIntersecting)

        if (visibleEntry) {
          setActiveSection(visibleEntry.target.id)
        }
      },
      { root: null, rootMargin: '-35% 0px -45% 0px', threshold: 0.1 }
    )

    pageSections.forEach((element) => observer.observe(element))

    return () => observer.disconnect()
  }, [sections])

  const renderItem = (section: NavbarSection, linkClass: string): ReactElement => {
    const active = isActive(section)
    const className = cn(linkClass, active && 'is-active')
    const close = menu.close

    if (section.download && section.href) {
      return (
        <a className={className} href={section.href} download onClick={close}>
          {section.label}
        </a>
      )
    }

    if (section.href) {
      return (
        <Link
          className={className}
          to={section.href}
          aria-current={active ? 'page' : undefined}
          onClick={close}
        >
          {section.label}
        </Link>
      )
    }

    return (
      <button
        type="button"
        className={className}
        aria-current={active ? 'true' : undefined}
        onClick={() => {
          close()
          scrollToSection(section.id)
        }}
      >
        {section.label}
      </button>
    )
  }

  const currentLabel =
    sections.find((section) => !section.download && isActive(section))?.label ?? sections[0]?.label

  return { renderItem, currentLabel, menu }
}
