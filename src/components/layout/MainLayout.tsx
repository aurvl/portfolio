import type { ReactNode } from 'react'
import Navbar, { type NavbarCta, type NavbarSection } from './Navbar'
import Footer from './Footer'
import BackToTopButton from './BackToTopButton'
import CookieBanner from './CookieBanner'

type MainLayoutProps = {
  children: ReactNode
  sections: NavbarSection[]
  className?: string
  cta?: NavbarCta
}

function MainLayout({ children, sections, className, cta }: MainLayoutProps) {
  return (
    <div className={`min-h-screen bg-[var(--bg-color)] text-[var(--text-color)] ${className ?? ''}`}>
      <Navbar sections={sections} cta={cta} />
      <main>{children}</main>
      <Footer />
      <BackToTopButton />
      <CookieBanner />
    </div>
  )
}

export default MainLayout
