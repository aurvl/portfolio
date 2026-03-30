import type { ReactNode } from 'react'
import Navbar, { type NavbarSection } from './Navbar'
import Footer from './Footer'

type MainLayoutProps = {
  children: ReactNode
  sections: NavbarSection[]
}

function MainLayout({ children, sections }: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-[var(--bg-color)] text-[var(--text-color)]">
      <Navbar sections={sections} />
      <main>{children}</main>
      <Footer />
    </div>
  )
}

export default MainLayout