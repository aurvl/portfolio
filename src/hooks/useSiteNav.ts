import type { NavbarSection } from '../components/layout/Navbar'
import { getResumeDownloadUrl } from '../lib/site'
import { useHomeContent } from './useHomeContent'

// Un seul menu pour tout le site : Accueil / À propos / Recherche / Projets & Blog / CV / Contact.
// Sur l'accueil, les entrées défilent vers les sections ; ailleurs, elles renvoient vers l'accueil
// ou vers les pages Projets & Blog. « CV » est toujours un lien direct vers le PDF.
export function useSiteNav() {
  const { content, lang } = useHomeContent()
  const { nav } = content
  const resumeUrl = getResumeDownloadUrl(lang)

  const homeSections: NavbarSection[] = [
    { id: 'home', label: nav.home },
    { id: 'about', label: nav.about },
    { id: 'research', label: nav.research },
    { id: 'projects', label: nav.projectsBlog, href: '/projects', matchPaths: ['/projects', '/blog', '/series'] },
    { id: 'cv', label: nav.cv, href: resumeUrl, download: true },
    { id: 'contact-form', label: nav.contact },
  ]

  const pageSections: NavbarSection[] = [
    { id: 'home', label: nav.home, href: '/' },
    { id: 'about', label: nav.about, href: '/#about' },
    { id: 'research', label: nav.research, href: '/#research' },
    { id: 'projects', label: nav.projectsBlog, href: '/projects', matchPaths: ['/projects', '/blog', '/series'] },
    { id: 'cv', label: nav.cv, href: resumeUrl, download: true },
    { id: 'contact-form', label: nav.contact, href: '/#contact-form' },
  ]

  return { homeSections, pageSections }
}
