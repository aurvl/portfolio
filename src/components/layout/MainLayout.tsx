import type { MouseEvent, ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import Navbar, { type NavbarSection } from './Navbar'
import Footer from './Footer'
import BackToTopButton from './BackToTopButton'
import CookieBanner from './CookieBanner'
import UtilityPill from '../ui/UtilityPill'
import { cn } from '../../lib/cn'

type MainLayoutProps = {
  children: ReactNode
  sections: NavbarSection[]
  className?: string
  // 'bottom' : la navbar termine la page (écran Contact) au lieu d'être fixée en haut.
  navPlacement?: 'top' | 'bottom'
  // true : le contenu passe sous la navbar (hero plein écran). Sinon on réserve sa hauteur.
  overlayNavbar?: boolean
  // true : pas de navbar du tout (landing : elle n'apparaît qu'après le morph de l'étape 6).
  hideNavbar?: boolean
  // Remplace la navbar par défaut (accueil : MorphNavbar, le bouton « Learn more » qui se transforme en navbar).
  navbar?: ReactNode
}

function MainLayout({
  children,
  sections,
  className,
  navPlacement = 'top',
  overlayNavbar = false,
  hideNavbar = false,
  navbar,
}: MainLayoutProps) {
  const { t } = useTranslation()
  const reserveNavbarSpace = navPlacement === 'top' && !overlayNavbar && !hideNavbar

  // Lien d'évitement : invisible tant qu'il n'a pas le focus, il envoie directement au contenu. Un simple href="#..."
  // serait intercepté par le routeur de l'accueil, d'où le clic géré à la main.
  const skipToContent = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault()
    document.getElementById('main-content')?.focus()
  }

  return (
    <div className={cn('min-h-screen bg-[var(--bg-color)] text-[var(--text-color)]', className)}>
      <a
        href="#main-content"
        className="skip-link"
        onClick={skipToContent}
      >
        {t('navbar.skipToContent')}
      </a>
      {navPlacement === 'top' && !hideNavbar ? (navbar ?? <Navbar sections={sections} placement="top" />) : null}
      <div className="site-utility">
        <UtilityPill />
      </div>
      <main
        id="main-content"
        tabIndex={-1}
        className={cn(reserveNavbarSpace && 'site-main--below-navbar')}
      >
        {children}
      </main>
      {navPlacement === 'bottom' && !hideNavbar ? <Navbar sections={sections} placement="bottom" /> : null}
      <Footer />
      <BackToTopButton />
      <CookieBanner />
    </div>
  )
}

export default MainLayout
