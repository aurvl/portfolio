// Navbar « pilule » bleue du design v3, centrée en haut de l'écran (ou en bas de page sur Contact).
// Sur mobile et tablette : une pilule compacte qui s'agrandit en menu avec les mêmes entrées (CompactMenu).
// Sur l'accueil, c'est MorphNavbar (même logique, via useNavbarModel) qui la remplace.
import { useReducedMotion } from 'framer-motion'
import { useNavbarModel } from '../../hooks/useNavbarModel'
import { cn } from '../../lib/cn'
import CompactMenu from './CompactMenu'

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

function Navbar({ sections, placement = 'top' }: NavbarProps) {
  const reducedMotion = useReducedMotion() ?? false
  const { renderItem, currentLabel, menu } = useNavbarModel(sections, reducedMotion)

  return (
    <header className={cn('site-nav', placement === 'bottom' && 'site-nav--bottom')}>
      <nav className="site-nav__pill" aria-label="Main">
        <ul className="site-nav__list">
          {sections.map((section) => (
            <li key={section.id}>{renderItem(section, 'site-nav__link')}</li>
          ))}
        </ul>
      </nav>

      <CompactMenu
        sections={sections}
        renderItem={renderItem}
        currentLabel={currentLabel}
        menu={menu}
        reducedMotion={reducedMotion}
        isSelfSized
      />
    </header>
  )
}

export default Navbar
