import type { NavbarCta, NavbarSection } from '../components/layout/Navbar'
import { useHomeContent } from './useHomeContent'

// One menu for the whole site. On the homepage the items scroll to sections;
// elsewhere they link back to the homepage sections or to the Work and Blog pages.
export function useSiteNav() {
  const { nav } = useHomeContent().content

  const homeSections: NavbarSection[] = [
    { id: 'home', label: nav.home, hidden: true },
    { id: 'approach', label: nav.method },
    { id: 'research', label: nav.research },
    { id: 'work', label: nav.work },
    { id: 'about', label: nav.about },
    { id: 'blog-posts', label: nav.blog },
    { id: 'contact-form', label: nav.contact, hidden: true },
  ]

  const pageSections: NavbarSection[] = [
    { id: 'home', label: nav.home, href: '/', hidden: true },
    { id: 'approach', label: nav.method, href: '/#approach' },
    { id: 'research', label: nav.research, href: '/#research' },
    { id: 'work', label: nav.work, href: '/projects' },
    { id: 'about', label: nav.about, href: '/#about' },
    { id: 'blog', label: nav.blog, href: '/blog' },
  ]

  const homeCta: NavbarCta = { label: nav.cta, targetId: 'contact-form' }
  const pageCta: NavbarCta = { label: nav.cta, href: '/#contact-form' }

  return { homeSections, pageSections, homeCta, pageCta }
}
