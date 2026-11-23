// Navbar « pilule » bleue du design v3, centrée en haut de l'écran (ou en bas de page sur Contact).
// Sur mobile : un bouton compact qui ouvre un petit panneau avec les mêmes entrées.
import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { LuChevronDown } from 'react-icons/lu'
import { cn } from '../../lib/cn'

export type NavbarSection = {
  id: string
  label: string
  // Page ou lien : sans `href`, l'entrée fait défiler vers la section de la page courante.
  href?: string
  // Lien de téléchargement direct (ex. le CV), jamais « actif ».
  download?: boolean
  // Chemins pour lesquels l'entrée est active (ex. /projects et /blog).
  matchPaths?: string[]
}

type NavbarProps = {
  sections: NavbarSection[]
  placement?: 'top' | 'bottom'
}

function scrollToSection(sectionId: string) {
  document.getElementById(sectionId)?.scrollIntoView({
    behavior: 'smooth',
    block: 'start',
  })
}

function Navbar({ sections, placement = 'top' }: NavbarProps) {
  const location = useLocation()
  const [activeSection, setActiveSection] = useState(sections[0]?.id ?? '')
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

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

  useEffect(() => {
    if (!isMobileMenuOpen) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMobileMenuOpen(false)
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isMobileMenuOpen])

  const renderItem = (section: NavbarSection, linkClass: string) => {
    const active = isActive(section)
    const className = cn(linkClass, active && 'is-active')
    const close = () => setIsMobileMenuOpen(false)

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

  return (
    <header className={cn('site-nav', placement === 'bottom' && 'site-nav--bottom')}>
      <nav className="site-nav__pill" aria-label="Main">
        <ul className="site-nav__list">
          {sections.map((section) => (
            <li key={section.id}>{renderItem(section, 'site-nav__link')}</li>
          ))}
        </ul>
      </nav>

      <div className="site-nav__compact">
        <button
          type="button"
          className="site-nav__menu-button"
          aria-expanded={isMobileMenuOpen}
          aria-controls="site-nav-panel"
          onClick={() => setIsMobileMenuOpen((open) => !open)}
        >
          {currentLabel}
          <LuChevronDown
            className={cn('site-nav__chevron', isMobileMenuOpen && 'is-open')}
            aria-hidden="true"
          />
        </button>

        {isMobileMenuOpen ? (
          <ul id="site-nav-panel" className="site-nav__panel">
            {sections.map((section) => (
              <li key={section.id}>{renderItem(section, 'site-nav__panel-link')}</li>
            ))}
          </ul>
        ) : null}
      </div>
    </header>
  )
}

export default Navbar
