// Menu compact de la navbar (mobile et tablette) : la pilule « About ▾ » s'agrandit ELLE-MÊME en menu.
// UN SEUL élément qui change de forme : sa largeur, sa hauteur et son rayon de coins suivent `menu.expand`
// (0 = pilule, 1 = menu ouvert, avec un petit rebond de ressort). Les entrées apparaissent une par une.
// Utilisé par Navbar (la pilule porte alors son propre fond) et par MorphNavbar (le fond est celui de la
// navbar qui voyage : la taille y est pilotée par MorphNavbar, avec les mêmes mesures).
import { useEffect, useLayoutEffect, useRef, type ReactElement } from 'react'
import { motion, useMotionValue, useTransform, type MotionStyle } from 'framer-motion'
import { LuChevronDown } from 'react-icons/lu'
import type { CompactMenuState } from '../../hooks/useCompactMenu'
import { cn } from '../../lib/cn'
import type { NavbarSection } from './Navbar'

// Rayon des coins du menu ouvert (1,25 rem, comme les anciens panneaux)
export const MENU_RADIUS = 20

// Tailles mesurées : la pilule fermée, et le menu ouvert (pilule + liste)
export type MenuGeometry = {
  pillWidth: number
  pillHeight: number
  menuWidth: number
  menuHeight: number
}

const lerp = (from: number, to: number, amount: number) => from + (to - from) * amount
const clamp01 = (value: number) => Math.min(1, Math.max(0, value))

type CompactMenuProps = {
  sections: NavbarSection[]
  renderItem: (section: NavbarSection, linkClass: string) => ReactElement
  currentLabel: string
  menu: CompactMenuState
  reducedMotion: boolean
  // true : cet élément porte son propre fond et sa taille (Navbar). false : le fond et la taille viennent
  // de la navbar qui l'entoure (MorphNavbar).
  isSelfSized: boolean
  // Appelé après chaque mesure : MorphNavbar y récupère les tailles de la pilule et du menu
  onMeasured?: (geometry: MenuGeometry) => void
  // Rend le menu inerte (ni clic, ni tabulation), par exemple tant que la navbar est encore un bouton
  inert?: boolean
  style?: MotionStyle
}

function CompactMenu({
  sections,
  renderItem,
  currentLabel,
  menu,
  reducedMotion,
  isSelfSized,
  onMeasured,
  inert,
  style,
}: CompactMenuProps) {
  const pillProbeRef = useRef<HTMLSpanElement>(null)
  const listProbeRef = useRef<HTMLUListElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const geometry = useRef<MenuGeometry | null>(null)
  // Change à chaque mesure, pour recalculer les tailles ci-dessous
  const tick = useMotionValue(0)

  // Mesure deux copies invisibles : la pilule fermée et la liste ouverte, à leur taille naturelle.
  useLayoutEffect(() => {
    const measure = () => {
      // offsetWidth / offsetHeight : ils ignorent la rotation de la navbar qui voyage (voir MorphNavbar)
      const pill = pillProbeRef.current
      const list = listProbeRef.current
      if (!pill || !list) return

      const measured = {
        pillWidth: pill.offsetWidth,
        pillHeight: pill.offsetHeight,
        menuWidth: Math.max(pill.offsetWidth, list.offsetWidth),
        menuHeight: pill.offsetHeight + list.offsetHeight,
      }
      geometry.current = measured
      tick.set(tick.get() + 1)
      onMeasured?.(measured)
    }

    measure()
    window.addEventListener('resize', measure)
    void document.fonts?.ready.then(measure)

    return () => window.removeEventListener('resize', measure)
  }, [currentLabel, sections, tick, onMeasured])

  // Direction d'ouverture : tant que le menu est fermé, on recalcule (au défilement et au redimensionnement, une fois par
  // image au plus) s'il reste assez de place sous la pilule ; la chevron l'annonce. Elle est figée une fois ouvert.
  const { isListMounted, updateDirection } = menu
  useEffect(() => {
    if (isListMounted) return

    let frame = 0
    const check = () => {
      frame = 0
      const current = geometry.current
      updateDirection(buttonRef.current, current ? current.menuHeight - current.pillHeight : 0)
    }
    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(check)
    }

    check()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)

    return () => {
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      if (frame) window.cancelAnimationFrame(frame)
    }
  }, [isListMounted, updateDirection])

  // Taille de la pilule qui devient menu (Navbar seulement). Tant que rien n'est mesuré : taille automatique.
  const width = useTransform([menu.expand, tick], ([amount]: number[]) => {
    const current = geometry.current
    // max(0, …) : le ressort peut passer un instant sous 0 en se refermant, mais jamais sous la taille de la pilule
    return current ? lerp(current.pillWidth, current.menuWidth, Math.max(0, amount)) : 'auto'
  })

  const height = useTransform([menu.expand, tick], ([amount]: number[]) => {
    const current = geometry.current
    return current ? lerp(current.pillHeight, current.menuHeight, Math.max(0, amount)) : 'auto'
  })

  // Les coins s'adaptent : de la demi-hauteur (pilule) au rayon du menu
  const borderRadius = useTransform([menu.expand, tick], ([amount]: number[]) => {
    const current = geometry.current
    return current ? lerp(current.pillHeight / 2, MENU_RADIUS, clamp01(amount)) : 999
  })

  const sizeStyle: MotionStyle = isSelfSized ? { width, height, borderRadius } : {}

  return (
    <motion.div
      className={cn('site-nav__compact', isSelfSized && 'is-self-sized', menu.opensUp && 'opens-up')}
      style={{ ...sizeStyle, ...style }}
      inert={inert}
    >
      <button
        type="button"
        ref={buttonRef}
        className="site-nav__menu-button"
        aria-expanded={menu.isOpen}
        aria-controls="site-nav-panel"
        onClick={() => {
          const current = geometry.current
          menu.toggle(buttonRef.current, current ? current.menuHeight - current.pillHeight : 0)
        }}
      >
        {currentLabel}
        <LuChevronDown
          className={cn('site-nav__chevron', menu.isOpen && 'is-open')}
          aria-hidden="true"
        />
      </button>

      {menu.isListMounted ? (
        <ul id="site-nav-panel" className="site-nav__panel">
          {sections.map((section, index) => {
            const lastIndex = sections.length - 1

            return (
              <motion.li
                key={section.id}
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: menu.showEntries ? 1 : 0, y: menu.showEntries ? 0 : -6 }}
                // Ouverture : un par un, du haut vers le bas, après le début de l'agrandissement.
                // Fermeture : un par un, du bas vers le haut, avant que le menu ne se rétracte.
                transition={{
                  duration: reducedMotion ? 0.15 : 0.18,
                  delay: reducedMotion
                    ? 0
                    : menu.showEntries
                      ? 0.1 + index * 0.05
                      : (lastIndex - index) * 0.03,
                }}
              >
                {renderItem(section, 'site-nav__panel-link')}
              </motion.li>
            )
          })}
        </ul>
      ) : null}

      {/* Copies invisibles, uniquement pour mesurer : la pilule fermée et la liste ouverte */}
      <span
        ref={pillProbeRef}
        className="site-nav__menu-button site-nav__probe"
        aria-hidden="true"
      >
        {currentLabel}
        <LuChevronDown aria-hidden="true" />
      </span>
      <ul
        ref={listProbeRef}
        className="site-nav__panel site-nav__probe"
        aria-hidden="true"
      >
        {sections.map((section) => (
          <li key={section.id}>
            <span className="site-nav__panel-link">{section.label}</span>
          </li>
        ))}
      </ul>
    </motion.div>
  )
}

export default CompactMenu
