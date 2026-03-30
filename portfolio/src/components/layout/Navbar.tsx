import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import AnimatedLogo from './AnimatedLogo'
import LanguageSwitcher from '../ui/LanguageSwitcher'
import ThemeToggle from '../ui/ThemeToggle'

export type NavbarSection = {
  id: string
  label: string
  href?: string
  hidden?: boolean
}

type NavbarProps = {
  sections: NavbarSection[]
}

function Navbar({ sections }: NavbarProps) {
  const location = useLocation()
  const [activeSection, setActiveSection] = useState(
    sections.find((section) => section.hidden !== true && section.href === undefined)?.id ??
      sections.find((section) => section.hidden !== true)?.id ??
      ''
  )
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId)

    if (section) {
      section.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      })
    }
  }

  const handleSectionClick = (section: NavbarSection) => {
    setIsMobileMenuOpen(false)

    if (!section.href) {
      scrollToSection(section.id)
    }
  }

  const isHrefActive = (href: string) => {
    if (href === '/') {
      return location.pathname === '/'
    }

    const [pathname, hash] = href.split('#')

    if (hash) {
      return location.pathname === pathname && location.hash === `#${hash}`
    }

    return location.pathname === href
  }

  useEffect(() => {
    if (sections.length === 0) return

    const pageSections = sections
      .map((item) => document.getElementById(item.id))
      .filter((section): section is HTMLElement => section !== null)

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries.find((entry) => entry.isIntersecting)

        if (visibleEntry) {
          setActiveSection(visibleEntry.target.id)
        }
      },
      {
        root: null,
        rootMargin: '-35% 0px -45% 0px',
        threshold: 0.1,
      }
    )

    pageSections.forEach((section) => observer.observe(section))

    return () => {
      pageSections.forEach((section) => observer.unobserve(section))
    }
  }, [sections])

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 450px)')

    const handleViewportChange = (event: MediaQueryListEvent) => {
      if (!event.matches) {
        setIsMobileMenuOpen(false)
      }
    }

    mediaQuery.addEventListener('change', handleViewportChange)

    return () => {
      mediaQuery.removeEventListener('change', handleViewportChange)
    }
  }, [])

  useEffect(() => {
    if (!isMobileMenuOpen) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMobileMenuOpen(false)
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isMobileMenuOpen])

  const firstSection = sections[0]

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--glass-border)] bg-[var(--glass-bg-strong)] backdrop-blur-xl">
      <div className="navbar-shell relative flex h-20 items-center justify-between">
        {firstSection?.href ? (
          <Link to={firstSection.href} className="navbar-brand" onClick={() => setIsMobileMenuOpen(false)}>
            <AnimatedLogo />
          </Link>
        ) : (
          <button
            type="button"
            onClick={() => firstSection && scrollToSection(firstSection.id)}
            className="navbar-brand"
          >
            <AnimatedLogo />
          </button>
        )}

        <nav className="hidden h-full items-center gap-8 md:flex">
          {sections
            .filter((section) => section.hidden !== true)
            .map((section) =>
            section.href ? (
              <Link
                key={section.id}
                to={section.href}
                onClick={() => setIsMobileMenuOpen(false)}
                aria-current={isHrefActive(section.href) ? 'page' : undefined}
                className={`nav-title-text nav-link-animated ${
                  isHrefActive(section.href) ? 'active' : ''
                }`}
              >
                {section.label}
              </Link>
            ) : (
              <button
                key={section.id}
                type="button"
                onClick={() => handleSectionClick(section)}
                className={`nav-title-text nav-link-animated ${
                  activeSection === section.id ? 'active' : ''
                }`}
              >
                {section.label}
              </button>
            )
          )}
        </nav>

        <div className="flex items-center gap-3">
          <button
            type="button"
            aria-label={isMobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-navigation-menu"
            className={`navbar-mobile-toggle border-class toggle-btn ${
              isMobileMenuOpen ? 'is-open' : ''
            }`}
            onClick={() => setIsMobileMenuOpen((currentState) => !currentState)}
          >
            <span className="navbar-mobile-toggle__line" aria-hidden="true" />
            <span className="navbar-mobile-toggle__line" aria-hidden="true" />
            <span className="navbar-mobile-toggle__line" aria-hidden="true" />
          </button>
          <LanguageSwitcher />
          <ThemeToggle />
        </div>

        <div
          id="mobile-navigation-menu"
          className={`navbar-mobile-panel-shell ${isMobileMenuOpen ? 'is-open' : ''}`}
        >
          <nav
            className="navbar-mobile-panel glass-panel-strong"
            aria-label="Mobile navigation"
          >
          {sections
            .filter((section) => section.hidden !== true)
            .map((section) =>
              section.href ? (
                <Link
                  key={section.id}
                  to={section.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  aria-current={isHrefActive(section.href) ? 'page' : undefined}
                  className={`navbar-mobile-link ${isHrefActive(section.href) ? 'active' : ''}`}
                >
                  {section.label}
                </Link>
              ) : (
                <button
                  key={section.id}
                  type="button"
                  onClick={() => handleSectionClick(section)}
                  className={`navbar-mobile-link ${
                    activeSection === section.id ? 'active' : ''
                  }`}
                >
                  {section.label}
                </button>
              )
            )}
          </nav>
        </div>
      </div>
    </header>
  )
}

export default Navbar
