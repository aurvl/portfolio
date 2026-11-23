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
import { cn } from '../../lib/cn'
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
  // Hauteur de scroll sur laquelle se joue toute l'animation (hors scène) : toute la hauteur de la landing
  range: number
  // Vrai sur ordinateur : la landing est dans la scène collée à l'écran (useBambooScene), le bouton ne suit plus la page
  inScene: boolean
  // Écran Contact : le scroll où il commence à entrer (son haut touche le bas de la fenêtre), celui où il
  // remplit la fenêtre, la place de la navbar dans la page (emplacement vide en bas de l'écran) et la fenêtre
  hasContact: boolean
  contactFrom: number
  contactTo: number
  slotTop: number
  viewportWidth: number
  viewportHeight: number
}

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
const FLIGHT_ARC_PX = 90 // écart latéral maximal du bouton au milieu de la montée (ordinateur)

// Position d'un élément dans la page (px depuis le haut du document), lue dans la mise en page : elle ne dépend
// ni du scroll ni de la barre d'adresse du navigateur
function getDocumentTop(element: HTMLElement) {
  let top = 0
  let node: HTMLElement | null = element
  while (node) {
    top += node.offsetTop
    node = node.offsetParent as HTMLElement | null
  }

  return top
}

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
  // Progression 0 → 3 de la scène « entrer dans la forêt » (ordinateur : 0 → 1 Landing → About, 1 → 2 About →
  // Recherche, 2 → 3 Recherche → Contact) ; isSceneActive dit si elle s'applique
  sceneProgress: MotionValue<number>
  isSceneActive: boolean
}

function MorphNavbar({ sections, reducedMotion, learnMoreLabel, onLearnMore, sceneProgress, isSceneActive }: MorphNavbarProps) {
  const { renderItem, currentLabel, menu } = useNavbarModel(sections, reducedMotion)

  // Les mesures vivent dans des « refs » : les transformations ci-dessous les lisent à chaque image,
  // sans faire re-rendre le composant. `tick` change à chaque nouvelle mesure pour forcer le recalcul.
  const geometry = useRef<Geometry | null>(null)
  const menuGeometry = useRef<MenuGeometry | null>(null)
  const remeasure = useRef<() => void>(() => {})
  const reducedRef = useRef(reducedMotion)
  const sceneActiveRef = useRef(isSceneActive)
  const rowRef = useRef<HTMLElement>(null)
  const tick = useMotionValue(0)
  const isReady = useMotionValue(0)
  const labelSize = useMotionValue(16)
  // Vrai tant que l'élément est un bouton : les onglets sont alors inertes (ni clic, ni tabulation)
  const [isCollapsed, setIsCollapsed] = useState(true)
  // Vrai quand le menu compact s'ouvre vers le haut (pas assez de place sous la pilule) : lu à chaque image par `top`
  const opensUpRef = useRef(false)
  useLayoutEffect(() => {
    opensUpRef.current = menu.opensUp
  }, [menu.opensUp])

  const { scrollY } = useScroll()

  // Ordre d'apparition des onglets : du CENTRE vers les bords, un par un. La navbar s'élargit des deux côtés
  // depuis le centre et son cadre coupe les bords : les onglets du milieu sont donc les premiers visibles.
  const middle = (sections.length - 1) / 2
  const appearanceOrder = sections
    .map((section, index) => ({ id: section.id, index }))
    .sort((a, b) => Math.abs(a.index - middle) - Math.abs(b.index - middle) || a.index - b.index)
    .map((entry) => entry.id)

  // PROGRESSION 0 → 1, liée au scroll, sans zone morte (le scroll-snap natif évite déjà les déclenchements par
  // erreur). Sur ordinateur, c'est celle de la scène (la même que la photo, donc tout voyage au même rythme) ;
  // sur mobile et tablette, c'est le scroll sur toute la hauteur de la landing.
  const progress = useTransform([tick, sceneProgress], ([, sceneValue]: number[]) => {
    if (!geometry.current) return 0
    // Ordinateur : progression de la scène (liée au scroll). Mobile et tablette : transition DÉCLENCHÉE, jouée dans
    // le temps (useBambooMobile) : le bouton ne suit plus le doigt, il fait tout son voyage d'un coup
    return clamp01(sceneValue)
  })

  // Phase 1 : le voyage (0 → 1 sur les 65 premiers % de la progression)
  const travel = useTransform(progress, (value) => (reducedRef.current ? 1 : clamp01(value / TRAVEL_END)))

  // Phase 2 : l'élargissement, à la fin seulement. useSpring lui donne un ressort : la valeur dépasse un peu 1
  // puis revient, ce qui crée le petit rebond de la navbar. Elle suit toujours le scroll (retour arrière compris).
  const widenTarget = useTransform(progress, (value) =>
    reducedRef.current ? 1 : clamp01((value - WIDEN_START) / (1 - WIDEN_START)),
  )
  const widen = useSpring(widenTarget, { stiffness: 220, damping: 11, mass: 0.9 })

  // VOYAGE VERS LE BAS (écran Contact), 0 → 1, lui aussi lié au scroll. Ordinateur : il se joue pendant la dernière
  // transition de la scène (la photo se rouvre), la navbar descend en même temps. Mobile et tablette : de l'instant où
  // le Contact commence à entrer dans la fenêtre jusqu'à ce qu'il la remplisse. La navbar se décroche du haut et descend
  // se poser sur son emplacement en bas, au milieu. Si on remonte, elle remonte. Sans animation : elle saute à mi-course.
  const contactTravel = useTransform([scrollY, tick, sceneProgress], ([scrollTop, , sceneValue]: number[]) => {
    const current = geometry.current
    if (!current?.hasContact) return 0
    const amount = current.inScene
      ? clamp01(sceneValue - 2)
      : clamp01((scrollTop - current.contactFrom) / Math.max(1, current.contactTo - current.contactFrom))
    return reducedRef.current ? (amount > 0.5 ? 1 : 0) : amount
  })

  // POSITION VERTICALE. Hors scène (mobile), le bouton n'est pas figé à l'écran : au départ il SUIT LA PAGE (il défile
  // avec la landing, comme s'il y était collé), sinon il resterait en place pendant que les « Latest things » glissent
  // dessous. Dans la scène (ordinateur), la landing est collée à l'écran : le bouton reste à sa place de départ.
  // Pendant le voyage, il remonte ensuite plus vite que la page jusqu'à sa place en haut ; max(…) l'empêche
  // de sortir de l'écran par le haut.
  //
  // Écran Contact : la position vise l'emplacement vide laissé en bas de la page (il défile avec elle), sans jamais
  // descendre sous le bas de la fenêtre. Menu compact ouvert VERS LE HAUT (pas assez de place dessous) : on remonte du
  // surplus de hauteur, pour que la pilule reste à sa place. Ouvert vers le bas (le cas normal) : rien à corriger.
  const top = useTransform(
    [travel, tick, scrollY, contactTravel, menu.expand],
    ([amount, , scrollTop, downAmount, expanded]: number[]) => {
      const current = geometry.current
      if (!current) return 0
      const followingPage = current.inScene ? current.top0 : current.top0 - scrollTop
      const topWhenUp = Math.max(current.top1, lerp(followingPage, current.top1, smooth(amount)))
      if (!current.hasContact || downAmount <= 0) return topWhenUp

      const lowestTop = current.viewportHeight - current.height1 - current.top1
      const topWhenDown = Math.max(current.top1, Math.min(current.slotTop - scrollTop, lowestTop))
      const menuExtra =
        current.isCompact && opensUpRef.current ? (current.menuHeight - current.height1) * Math.max(0, expanded) : 0

      return lerp(topWhenUp, topWhenDown, smooth(downAmount)) - menuExtra * downAmount
    },
  )

  // sin(travel × π) vaut 0 au départ et à l'arrivée, 1 au milieu du voyage : c'est l'étirement.
  // Au milieu du vol, le bouton est plus haut (+22 %) et un peu plus étroit (−10 %), comme un ballon qui s'étire.
  // `menu.expand` ajoute l'agrandissement en menu (mobile et tablette) : la pilule elle-même grandit.
  // Le voyage vers le bas (écran Contact) étire seulement la hauteur : rétrécir la largeur couperait les onglets,
  // qui sont déjà tous affichés à ce moment-là.
  const width = useTransform([travel, widen, menu.expand, tick], ([flight, spread, expanded]: number[]) => {
    const current = geometry.current
    if (!current) return 0
    const base = lerp(current.width0, current.width1, spread) * (1 - 0.1 * Math.sin(flight * Math.PI))
    const menuExtra = current.isCompact ? (current.menuWidth - current.width1) * Math.max(0, expanded) : 0
    return base + menuExtra
  })

  const height = useTransform([travel, widen, menu.expand, contactTravel, tick], ([flight, spread, expanded, downAmount]: number[]) => {
    const current = geometry.current
    if (!current) return 0
    // Mobile : pas d'étirement pendant la montée, le bouton ne déborde jamais sur le contenu sous lui
    const flightStretch = current.inScene ? 0.22 * Math.sin(flight * Math.PI) : 0
    const base =
      lerp(current.height0, current.height1, spread) *
      (1 + flightStretch) *
      (1 + 0.22 * Math.sin(downAmount * Math.PI))
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
  // Écran Contact, mobile et tablette : la pilule glisse de la gauche vers le milieu de la fenêtre.
  const centerX = useTransform([travel, width, contactTravel, tick], ([amount, currentWidth, downAmount]: number[]) => {
    const current = geometry.current
    if (!current) return 0
    if (current.isCompact) {
      const centerWhenUp = lerp(current.left0, current.left1, smooth(amount)) + currentWidth / 2
      return lerp(centerWhenUp, current.viewportWidth / 2, smooth(downAmount))
    }
    // Ordinateur : pendant la montée, le bouton fait un léger arc vers la droite (sin vaut 0 au départ et à l'arrivée,
    // 1 au milieu), pour contourner l'avatar de la landing qui glisse vers la gauche au même moment
    // (version tactile : pas d'arc, le bouton monte droit avec la page)
    const arc = reducedRef.current || !current.inScene ? 0 : Math.sin(amount * Math.PI) * FLIGHT_ARC_PX
    return lerp(current.center0, current.center1, smooth(amount)) + arc
  })

  // Petit balancement pendant le vol (quelques degrés au plus), pour le côté ludique ; nul au départ et à l'arrivée
  // (mobile : pas de balancement pendant la montée, seulement pendant la descente vers le Contact)
  const wobble = useTransform([travel, contactTravel, tick], ([flight, downAmount]: number[]) => {
    const flightWobble = geometry.current?.inScene ? Math.sin(flight * Math.PI * 2) : 0

    return (flightWobble + Math.sin(downAmount * Math.PI * 2)) * WOBBLE_DEGREES
  })

  // MOBILE ET TABLETTE : l'élément n'est plus `position: fixed` mais `position: sticky` dans un rail aussi haut que la
  // page (voir navbar.css). Pourquoi : sur iPhone, un élément fixe piloté par JavaScript ne suit pas la page pendant
  // l'élan du doigt (les événements de scroll arrivent en retard, surtout avec le scroll-snap) : le bouton traînait,
  // puis sautait. Avec `sticky`, c'est le navigateur qui le fait défiler AVEC la page, sans retard, puis le colle en
  // haut (1 rem). Le JavaScript ne pilote plus que la forme (largeur, hauteur, côté gauche), jamais la position verticale
  // de la montée. Le bouton reste donc sous le contenu de la landing : il ne le chevauche jamais.
  // marginTop = sa place de départ dans la page (le bouton d'origine) ; x = son bord gauche ; y = seulement la descente
  // vers l'écran Contact (de la position collée en haut jusqu'à l'emplacement du bas).
  const stickyStart = useTransform(tick, () => {
    const current = geometry.current
    if (!current) return 0

    return reducedRef.current ? current.top1 : Math.max(current.top1, current.top0)
  })
  const compactX = useTransform([centerX, width], ([center, currentWidth]: number[]) => center - currentWidth / 2)
  const compactY = useTransform(
    [contactTravel, tick, scrollY, menu.expand],
    ([downAmount, , scrollTop, expanded]: number[]) => {
      const current = geometry.current
      if (!current?.hasContact || downAmount <= 0) return 0

      // Mobile : la navbar part se loger tout en bas de la page, sur son emplacement (sous la photo du Contact), et
      // défile avec la page. Elle n'est plus clouée en bas de l'écran : elle ne gêne donc pas pendant qu'on lit ou
      // qu'on écrit dans le formulaire. Arrivé au bout, on la retrouve là, prête à repartir ailleurs.
      const topWhenDown = Math.max(current.top1, current.slotTop - scrollTop)
      const menuExtra = opensUpRef.current ? (current.menuHeight - current.height1) * Math.max(0, expanded) : 0

      return lerp(current.top1, topWhenDown, smooth(downAmount)) - menuExtra * downAmount - current.top1
    },
  )

  // Opacité de l'ensemble : invisible tant que les mesures ne sont pas prises ; en mode « sans animation »,
  // fondu simple entre 30 % et 70 % de la progression
  // `tick` change après chaque mesure : sans lui, l'opacité ne se recalculait pas quand `isReady` passait à 1
  const fade = useTransform([progress, isReady, tick], ([value, ready]: number[]) =>
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

    // Pilule compacte seulement quand il n'y a pas la place d'afficher tous les onglets (< 1024 px). Un iPad en paysage
    // (1180 px) a la place : il affiche la barre complète, même s'il est au doigt (version tactile de la scène).
    const isCompact = !window.matchMedia('(min-width: 1024px)').matches
    const rem = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16
    const pill = menuGeometry.current
    // offsetWidth / offsetHeight et non getBoundingClientRect : ce dernier inclut la rotation du balancement. Mesurée
    // en plein vol, la navbar paraîtrait 30 à 40 px plus haute et resterait gonflée une fois posée.
    const finalWidth = isCompact && pill ? pill.pillWidth : row.offsetWidth
    const finalHeight = isCompact && pill ? pill.pillHeight : row.offsetHeight
    const anchor = document.querySelector<HTMLElement>('[data-morph-anchor]')
    // Mobile : place de départ lue dans la MISE EN PAGE (offsetTop, indépendante du scroll). getBoundingClientRect +
    // scrollY se désaccordent sur iPhone quand la barre d'adresse se replie en plein scroll, et décalaient le bouton.
    // Le fantôme est posé en bas de la bannière, centré, décalé de la moitié de sa taille (voir landing.css).
    const start = anchor?.getBoundingClientRect()
    const anchorWidth = anchor?.offsetWidth ?? 0
    const anchorHeight = anchor?.offsetHeight ?? 0
    const layoutTop = anchor ? getDocumentTop(anchor) + anchorHeight / 2 : 0
    const landing = document.getElementById('home')
    // Dans la scène, la place de départ se mesure par rapport au cadre collé (il ne bouge pas à l'écran pendant la scène)
    const inScene = sceneActiveRef.current
    const stageTop = document.querySelector('.scene__stage')?.getBoundingClientRect().top ?? 0
    const viewportWidth = document.documentElement.clientWidth

    // Emplacement vide de la navbar en bas du Contact : on lui donne la hauteur de la navbar, pour que la page
    // ait exactement la même taille que si la navbar s'y trouvait
    const slot = document.querySelector<HTMLElement>('[data-morph-slot]')
    const contact = document.getElementById('contact-form')
    if (slot) slot.style.setProperty('--morph-slot-height', `${finalHeight}px`)
    const viewportHeight = document.documentElement.clientHeight
    const contactTop = contact ? contact.getBoundingClientRect().top + window.scrollY : 0

    const top1 = rem
    const center1 = isCompact ? rem + finalWidth / 2 : viewportWidth / 2

    geometry.current = {
      top0: start ? (inScene ? start.top - stageTop : layoutTop) : top1,
      center0: start ? (inScene ? start.left + start.width / 2 : viewportWidth / 2) : center1,
      left0: start ? (inScene ? start.left : (viewportWidth - anchorWidth) / 2) : rem,
      width0: start ? (inScene ? start.width : anchorWidth) : finalWidth,
      height0: start ? (inScene ? start.height : anchorHeight) : finalHeight,
      top1,
      center1,
      left1: rem,
      isCompact,
      width1: finalWidth,
      height1: finalHeight,
      menuWidth: pill?.menuWidth ?? finalWidth,
      menuHeight: pill?.menuHeight ?? finalHeight,
      range: Math.max(1, landing?.offsetHeight ?? window.innerHeight),
      inScene,
      hasContact: Boolean(slot && contact),
      contactFrom: contactTop - viewportHeight,
      contactTo: contactTop,
      slotTop: slot ? slot.getBoundingClientRect().top + window.scrollY : 0,
      viewportWidth,
      viewportHeight,
    }

    if (anchor) labelSize.set(parseFloat(getComputedStyle(anchor).fontSize) || 16)
    isReady.set(1)
    tick.set(tick.get() + 1)
  }, [isReady, labelSize, tick])

  useLayoutEffect(() => {
    reducedRef.current = reducedMotion
    sceneActiveRef.current = isSceneActive
    remeasure.current = measure

    measure()
    // Safari iOS change la hauteur de la fenêtre pendant le scroll (barre d'adresse qui se replie) : remesurer à ce
    // moment-là ferait sauter le bouton. Un simple changement de hauteur est donc remesuré seulement une fois le
    // scroll calmé ; un changement de largeur (rotation, redimensionnement) l'est tout de suite.
    let lastWidth = document.documentElement.clientWidth
    let settleTimer: number | undefined
    const handleResize = () => {
      const width = document.documentElement.clientWidth
      window.clearTimeout(settleTimer)
      if (width !== lastWidth) {
        lastWidth = width
        measure()
        return
      }
      settleTimer = window.setTimeout(measure, 250)
    }
    window.addEventListener('resize', handleResize)
    // Les polices peuvent changer la taille du bouton après le premier affichage
    void document.fonts?.ready.then(measure)

    const anchor = document.querySelector<HTMLElement>('[data-morph-anchor]')
    const observer = new ResizeObserver(measure)
    if (anchor) observer.observe(anchor)
    // Le Contact peut changer de hauteur (police, fenêtre) : on remesure
    const contactSection = document.getElementById('contact-form')
    if (contactSection) observer.observe(contactSection)
    // Sur ordinateur, la hauteur de la scène (liste de Recherche) décale l'emplacement de la navbar : on remesure
    const scene = document.querySelector('.scene')
    if (scene) observer.observe(scene)

    return () => {
      window.clearTimeout(settleTimer)
      window.removeEventListener('resize', handleResize)
      observer.disconnect()
    }
  }, [reducedMotion, isSceneActive, currentLabel, sections, measure])

  // CompactMenu nous envoie les tailles de la pilule et du menu : on les garde et on remesure le tout
  const handleMenuMeasured = useCallback((measured: MenuGeometry) => {
    menuGeometry.current = measured
    remeasure.current()
  }, [])

  const isStickyLayout = !isSceneActive
  const header = (
    <motion.header
      className={cn('site-nav site-nav--morph', isStickyLayout && 'site-nav--morph-sticky')}
      style={
        isStickyLayout
          ? { x: compactX, y: compactY, marginTop: stickyStart, width, height, rotate: wobble, opacity: fade, borderRadius }
          : { top, left: centerX, x: '-50%', width, height, rotate: wobble, opacity: fade, borderRadius }
      }
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

  return isStickyLayout ? <div className="site-nav-rail">{header}</div> : header
}

export default MorphNavbar
