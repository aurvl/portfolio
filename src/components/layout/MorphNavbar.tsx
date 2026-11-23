// Navbar de l'accueil : le bouton « Learn more » de la landing VOYAGE et devient la navbar.
// C'est UN SEUL élément fixe (un <header>) dont la position, la taille et le contenu suivent le scroll :
//   - bouton « Learn more » au repos (même place, même taille que le bouton d'origine) ;
//   - il monte vers le haut en s'étirant (et en se balançant très légèrement) ;
//   - puis il s'élargit en navbar avec un petit rebond ; les onglets apparaissent un par un ;
//   - sur mobile et tablette, il va en haut à gauche et devient la pilule compacte « About ▾ »,
//     qui s'agrandit elle-même en menu (CompactMenu).
// Animation LIÉE AU SCROLL : si on remonte, elle revient en arrière.
// Avec prefers-reduced-motion : aucun déplacement, la navbar apparaît simplement en fondu.
// Exception assumée du style éditorial (design/BRIEF.md §2).
import { useCallback, useLayoutEffect, useRef, useState, type ReactNode } from 'react'
import {
  motion,
  useMotionValue,
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from 'framer-motion'
import { useNavbarModel } from '../../hooks/useNavbarModel'
import CompactMenu, { MENU_RADIUS, type MenuGeometry } from './CompactMenu'
import type { NavbarSection } from './Navbar'

// Mesures prises dans la page (en px, par rapport à la fenêtre au scroll 0) : départ = le bouton d'origine,
// arrivée = la navbar (ordinateur) ou la pilule compacte (mobile et tablette).
type Geometry = {
  top0: number
  center0: number
  left0: number
  width0: number
  height0: number
  top1: number
  center1: number
  left1: number
  isCompact: boolean
  width1: number
  height1: number
  // Taille du menu compact ouvert (mobile et tablette)
  menuWidth: number
  menuHeight: number
  // Hauteur de scroll sur laquelle se joue toute l'animation : toute la hauteur de la landing
  range: number
}

// ZONE MORTE : rien ne bouge pendant les premiers 12 % du scroll de la landing. Un petit mouvement
// de trackpad ne déclenche donc rien ; l'animation se déroule ensuite sur les 88 % restants.
const DEAD_ZONE = 0.12

// Découpage de l'animation, en fraction de la progression (0 = bouton, 1 = navbar finie).
// Les effets sont échelonnés : le texte reste, le bouton voyage, et seulement à la fin il s'élargit.
const LEARN_FADE_START = 0.4 // le texte « Learn more » reste visible jusqu'à 40 %…
const LEARN_FADE_END = 0.55 // …puis s'efface en fondu
const TRAVEL_END = 0.65 // le voyage (montée + étirement) occupe les 65 premiers %
const WIDEN_START = 0.72 // l'élargissement en navbar n'arrive qu'à la fin
const TAB_START = 0.78 // premier onglet
const TAB_STAGGER = 0.028 // décalage entre deux onglets
const TAB_FADE = 0.08 // durée d'apparition d'un onglet
const WOBBLE_DEGREES = 2.5 // inclinaison maximale pendant le vol : très légère

const clamp01 = (value: number) => Math.min(1, Math.max(0, value))
const lerp = (from: number, to: number, amount: number) => from + (to - from) * amount
// Départ et arrivée en douceur (la vitesse est nulle aux deux bouts)
const smooth = (amount: number) => amount * amount * (3 - 2 * amount)

type MorphTabProps = {
  // Rang d'apparition (0 = premier à apparaître)
  rank: number
  progress: MotionValue<number>
  reducedMotion: boolean
  children: ReactNode
}

// Un onglet : apparaît en fondu en remontant légèrement, avec un petit décalage selon son rang
function MorphTab({ rank, progress, reducedMotion, children }: MorphTabProps) {
  const start = TAB_START + rank * TAB_STAGGER
  const opacity = useTransform(progress, (value) =>
    reducedMotion ? 1 : clamp01((value - start) / TAB_FADE),
  )
  const offsetY = useTransform(opacity, (value) => (reducedMotion ? 0 : (1 - value) * 10))

  return <motion.li style={{ opacity, y: offsetY }}>{children}</motion.li>
}

type MorphNavbarProps = {
  sections: NavbarSection[]
  reducedMotion: boolean
  learnMoreLabel: string
  onLearnMore: () => void
}

function MorphNavbar({ sections, reducedMotion, learnMoreLabel, onLearnMore }: MorphNavbarProps) {
  const { renderItem, currentLabel, menu } = useNavbarModel(sections, reducedMotion)

  // Les mesures vivent dans des « refs » : les transformations ci-dessous les lisent à chaque image,
  // sans faire re-rendre le composant. `tick` change à chaque nouvelle mesure pour forcer le recalcul.
  const geometry = useRef<Geometry | null>(null)
  const menuGeometry = useRef<MenuGeometry | null>(null)
  const remeasure = useRef<() => void>(() => {})
  const reducedRef = useRef(reducedMotion)
  const rowRef = useRef<HTMLElement>(null)
  const tick = useMotionValue(0)
  const isReady = useMotionValue(0)
  const labelSize = useMotionValue(16)
  // Vrai tant que l'élément est un bouton : les onglets sont alors inertes (ni clic, ni tabulation)
  const [isCollapsed, setIsCollapsed] = useState(true)

  const { scrollY } = useScroll()

  // Ordre d'apparition des onglets : du CENTRE vers les bords, un par un. La navbar s'élargit des deux côtés
  // depuis le centre et son cadre coupe les bords : les onglets du milieu sont donc les premiers visibles.
  const middle = (sections.length - 1) / 2
  const appearanceOrder = sections
    .map((section, index) => ({ id: section.id, index }))
    .sort((a, b) => Math.abs(a.index - middle) - Math.abs(b.index - middle) || a.index - b.index)
    .map((entry) => entry.id)

  // PROGRESSION 0 → 1, liée au scroll. Deux changements par rapport à avant : (1) elle se mesure sur TOUTE la
  // hauteur de la landing (et non plus sur les premiers pixels) ; (2) elle ne démarre qu'après la zone morte de 12 %.
  const progress = useTransform([scrollY, tick], ([scrollTop]: number[]) => {
    const current = geometry.current
    if (!current) return 0
    const landingProgress = clamp01(scrollTop / current.range)
    return clamp01((landingProgress - DEAD_ZONE) / (1 - DEAD_ZONE))
  })

  // Phase 1 : le voyage (0 → 1 sur les 65 premiers % de la progression)
  const travel = useTransform(progress, (value) => (reducedRef.current ? 1 : clamp01(value / TRAVEL_END)))

  // Phase 2 : l'élargissement, à la fin seulement. useSpring lui donne un ressort : la valeur dépasse un peu 1
  // puis revient, ce qui crée le petit rebond de la navbar. Elle suit toujours le scroll (retour arrière compris).
  const widenTarget = useTransform(progress, (value) =>
    reducedRef.current ? 1 : clamp01((value - WIDEN_START) / (1 - WIDEN_START)),
  )
  const widen = useSpring(widenTarget, { stiffness: 220, damping: 11, mass: 0.9 })

  // POSITION VERTICALE. Le bouton n'est pas figé à l'écran : au départ il SUIT LA PAGE (il défile avec la landing,
  // comme s'il y était collé), sinon il resterait en place pendant que les « Latest things » glissent dessous.
  // Pendant le voyage, il remonte ensuite plus vite que la page jusqu'à sa place en haut ; max(…) l'empêche
  // de sortir de l'écran par le haut.
  const top = useTransform([travel, tick, scrollY], ([amount, , scrollTop]: number[]) => {
    const current = geometry.current
    if (!current) return 0
    const followingPage = current.top0 - scrollTop
    return Math.max(current.top1, lerp(followingPage, current.top1, smooth(amount)))
  })

  // sin(travel × π) vaut 0 au départ et à l'arrivée, 1 au milieu du voyage : c'est l'étirement.
  // Au milieu du vol, le bouton est plus haut (+22 %) et un peu plus étroit (−10 %), comme un ballon qui s'étire.
  // `menu.expand` ajoute l'agrandissement en menu (mobile et tablette) : la pilule elle-même grandit.
  const width = useTransform([travel, widen, menu.expand, tick], ([flight, spread, expanded]: number[]) => {
    const current = geometry.current
    if (!current) return 0
    const base = lerp(current.width0, current.width1, spread) * (1 - 0.1 * Math.sin(flight * Math.PI))
    const menuExtra = current.isCompact ? (current.menuWidth - current.width1) * Math.max(0, expanded) : 0
    return base + menuExtra
  })

  const height = useTransform([travel, widen, menu.expand, tick], ([flight, spread, expanded]: number[]) => {
    const current = geometry.current
    if (!current) return 0
    const base = lerp(current.height0, current.height1, spread) * (1 + 0.22 * Math.sin(flight * Math.PI))
    const menuExtra = current.isCompact ? (current.menuHeight - current.height1) * Math.max(0, expanded) : 0
    return base + menuExtra
  })

  // Coins : toujours une pilule (demi-hauteur) ; en mobile, ils s'adaptent au menu ouvert (rayon du menu)
  const borderRadius = useTransform([height, menu.expand, tick], ([currentHeight, expanded]: number[]) => {
    const current = geometry.current
    const pillRadius = currentHeight / 2
    if (!current?.isCompact || expanded <= 0) return pillRadius
    const openRadius = lerp(current.height1 / 2, MENU_RADIUS, clamp01(expanded))
    return Math.min(pillRadius, openRadius)
  })

  // Centre horizontal. Ordinateur : ne bouge pas (la navbar reste centrée, elle s'élargit des deux côtés).
  // Mobile et tablette : on suit le BORD GAUCHE (de celui du bouton jusqu'à la marge de 1 rem) puis on en déduit
  // le centre avec la largeur du moment, pour que le bouton ne dépasse jamais de l'écran pendant qu'il se rétrécit.
  const centerX = useTransform([travel, width, tick], ([amount, currentWidth]: number[]) => {
    const current = geometry.current
    if (!current) return 0
    if (current.isCompact) return lerp(current.left0, current.left1, smooth(amount)) + currentWidth / 2
    return lerp(current.center0, current.center1, smooth(amount))
  })

  // Petit balancement pendant le vol (quelques degrés au plus), pour le côté ludique ; nul au départ et à l'arrivée
  const wobble = useTransform(travel, (flight) => Math.sin(flight * Math.PI * 2) * WOBBLE_DEGREES)

  // Opacité de l'ensemble : invisible tant que les mesures ne sont pas prises ; en mode « sans animation »,
  // fondu simple entre 30 % et 70 % de la progression
  const fade = useTransform([progress, isReady], ([value, ready]: number[]) =>
    ready * (reducedRef.current ? clamp01((value - 0.3) / 0.4) : 1),
  )

  // Le texte « Learn more » reste visible jusqu'à 40 % du parcours, puis s'efface en fondu
  const learnOpacity = useTransform(progress, [LEARN_FADE_START, LEARN_FADE_END], [1, 0])
  const compactOpacity = useTransform(progress, (value) =>
    reducedRef.current ? 1 : clamp01((value - 0.82) / 0.15),
  )

  useMotionValueEvent(progress, 'change', (value) => setIsCollapsed(value < LEARN_FADE_START))

  // Mesure le bouton d'origine (« fantôme » invisible de la landing) et la taille finale de la navbar.
  // Les tailles de la pilule et du menu compact sont mesurées par CompactMenu (menuGeometry).
  const measure = useCallback(() => {
    const row = rowRef.current
    if (!row) return

    const isCompact = window.matchMedia('(max-width: 1023.98px)').matches
    const rem = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16
    const pill = menuGeometry.current
    const rowRect = row.getBoundingClientRect()
    const finalWidth = isCompact && pill ? pill.pillWidth : rowRect.width
    const finalHeight = isCompact && pill ? pill.pillHeight : rowRect.height
    const anchor = document.querySelector<HTMLElement>('[data-morph-anchor]')
    const start = anchor?.getBoundingClientRect()
    const landing = document.getElementById('home')
    const viewportWidth = document.documentElement.clientWidth

    const top1 = rem
    const center1 = isCompact ? rem + finalWidth / 2 : viewportWidth / 2

    geometry.current = {
      top0: start ? start.top + window.scrollY : top1,
      center0: start ? start.left + start.width / 2 : center1,
      left0: start ? start.left : rem,
      width0: start ? start.width : finalWidth,
      height0: start ? start.height : finalHeight,
      top1,
      center1,
      left1: rem,
      isCompact,
      width1: finalWidth,
      height1: finalHeight,
      menuWidth: pill?.menuWidth ?? finalWidth,
      menuHeight: pill?.menuHeight ?? finalHeight,
      range: Math.max(1, landing?.offsetHeight ?? window.innerHeight),
    }

    if (anchor) labelSize.set(parseFloat(getComputedStyle(anchor).fontSize) || 16)
    isReady.set(1)
    tick.set(tick.get() + 1)
  }, [isReady, labelSize, tick])

  useLayoutEffect(() => {
    reducedRef.current = reducedMotion
    remeasure.current = measure

    measure()
    window.addEventListener('resize', measure)
    // Les polices peuvent changer la taille du bouton après le premier affichage
    void document.fonts?.ready.then(measure)

    const anchor = document.querySelector<HTMLElement>('[data-morph-anchor]')
    const observer = anchor ? new ResizeObserver(measure) : null
    if (anchor) observer?.observe(anchor)

    return () => {
      window.removeEventListener('resize', measure)
      observer?.disconnect()
    }
  }, [reducedMotion, currentLabel, sections, measure])

  // CompactMenu nous envoie les tailles de la pilule et du menu : on les garde et on remesure le tout
  const handleMenuMeasured = useCallback((measured: MenuGeometry) => {
    menuGeometry.current = measured
    remeasure.current()
  }, [])

  return (
    <motion.header
      className="site-nav site-nav--morph"
      style={{ top, left: centerX, x: '-50%', width, height, rotate: wobble, opacity: fade, borderRadius }}
    >
      <div className="site-nav__clip">
        {reducedMotion ? null : (
          <motion.button
            type="button"
            className="site-nav__learn"
            style={{ opacity: learnOpacity, fontSize: labelSize }}
            tabIndex={isCollapsed ? 0 : -1}
            aria-hidden={!isCollapsed}
            onClick={onLearnMore}
          >
            {learnMoreLabel}
          </motion.button>
        )}

        <nav
          ref={rowRef}
          className="site-nav__morph-row"
          aria-label="Main"
          inert={isCollapsed}
        >
          <ul className="site-nav__list">
            {sections.map((section) => (
              <MorphTab
                key={section.id}
                rank={appearanceOrder.indexOf(section.id)}
                progress={progress}
                reducedMotion={reducedMotion}
              >
                {renderItem(section, 'site-nav__link')}
              </MorphTab>
            ))}
          </ul>
        </nav>
      </div>

      <CompactMenu
        sections={sections}
        renderItem={renderItem}
        currentLabel={currentLabel}
        menu={menu}
        reducedMotion={reducedMotion}
        isSelfSized={false}
        onMeasured={handleMenuMeasured}
        inert={isCollapsed}
        style={{ opacity: compactOpacity }}
      />
    </motion.header>
  )
}

export default MorphNavbar
