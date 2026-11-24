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
import { morphEase, registerMorphElement, type MorphFrame } from '../../lib/morphPlayer'
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
type Timeline = {
  travelStart: number // le voyage (montée + étirement) commence…
  travelEnd: number // …et se termine
  widenStart: number // l'élargissement en navbar n'arrive qu'à la fin
  learnFadeStart: number // le texte « Learn more » reste visible jusqu'ici…
  learnFadeEnd: number // …puis s'efface en fondu
  compactFadeStart: number // la pilule compacte (« About ▾ ») apparaît en fondu…
  compactFadeEnd: number // …jusqu'ici
}

// Ordinateur : la photo et le bouton voyagent ensemble, liés au scroll de la scène
const SCENE_TIMELINE: Timeline = {
  travelStart: 0,
  travelEnd: 0.65,
  widenStart: 0.72,
  learnFadeStart: 0.4,
  learnFadeEnd: 0.55,
  compactFadeStart: 0.82,
  compactFadeEnd: 0.97,
}

// Tactile : l'identité de la landing a disparu à 25 %, le bouton ne part qu'ensuite (il ne survole plus l'avatar) et arrive
// à 80 %. « Learn more » se change en « About » par un fondu croisé : un texte est toujours visible, la pilule n'est jamais vide.
const TOUCH_TIMELINE: Timeline = {
  travelStart: 0.2,
  travelEnd: 0.8,
  widenStart: 0.7,
  learnFadeStart: 0.35,
  learnFadeEnd: 0.6,
  compactFadeStart: 0.45,
  compactFadeEnd: 0.75,
}
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
const smooth = morphEase

// ---------- Formules du voyage ----------
// Fonctions pures, lues à la fois par les valeurs framer-motion (ordinateur, scroll) et par les animations WAAPI
// (version tactile, voir lib/morphPlayer) : les deux affichent exactement la même chose.

// Voyage du bouton (0 → 1 entre le début et la fin du voyage de la chronologie)
const getTravel = (value: number, timeline: Timeline) =>
  clamp01((value - timeline.travelStart) / (timeline.travelEnd - timeline.travelStart))

// Progression de l'élargissement (0 → 1 entre son début et la fin)
const getWiden = (value: number, timeline: Timeline) => clamp01((value - timeline.widenStart) / (1 - timeline.widenStart))

// Élargissement en navbar, avec un petit dépassement (rebond) : version tactile, sans ressort JavaScript
const getWidenOvershoot = (target: number) => {
  const overshoot = 1.4
  const shifted = target - 1

  return 1 + (overshoot + 1) * shifted ** 3 + overshoot * shifted ** 2
}

const getLearnOpacity = (value: number, timeline: Timeline) =>
  1 - clamp01((value - timeline.learnFadeStart) / (timeline.learnFadeEnd - timeline.learnFadeStart))
const getCompactOpacity = (value: number, timeline: Timeline) =>
  clamp01((value - timeline.compactFadeStart) / (timeline.compactFadeEnd - timeline.compactFadeStart))
const getTabOpacity = (value: number, rank: number) => clamp01((value - (TAB_START + rank * TAB_STAGGER)) / TAB_FADE)

// Place verticale (hors écran Contact) : le bouton remonte de sa place de départ jusqu'à sa place en haut
const getFlightTop = (current: Geometry, travel: number) =>
  Math.max(current.top1, lerp(current.top0, current.top1, smooth(travel)))

const getFlightWidth = (current: Geometry, travel: number, widen: number) =>
  lerp(current.width0, current.width1, widen) * (1 - 0.1 * Math.sin(travel * Math.PI))

// Pilule compacte (téléphone) : pas d'étirement, elle reste petite
const getFlightHeight = (current: Geometry, travel: number, widen: number) =>
  lerp(current.height0, current.height1, widen) * (1 + (current.isCompact ? 0 : 0.22 * Math.sin(travel * Math.PI)))

// Centre horizontal : suit le bord gauche en version compacte ; léger arc vers la droite sur grand écran (arcPx = 0 sans)
const getFlightCenterX = (current: Geometry, travel: number, width: number, arcPx: number) =>
  current.isCompact
    ? lerp(current.left0, current.left1, smooth(travel)) + width / 2
    : lerp(current.center0, current.center1, smooth(travel)) + Math.sin(travel * Math.PI) * arcPx

// Position verticale de l'en-tête. Hors écran Contact (downAmount = 0) : le voyage du bouton vers le haut. Écran Contact :
// la barre part se loger sur son emplacement en bas de la page. Ordinateur : elle se pose au bas de la fenêtre. Version
// tactile : elle suit son emplacement, qui défile avec la page. Menu compact ouvert VERS LE HAUT : on remonte du surplus.
const getHeaderTop = (
  current: Geometry,
  travelAmount: number,
  scrollTop: number,
  downAmount: number,
  expanded: number,
  opensUp: boolean,
) => {
  const topWhenUp = getFlightTop(current, travelAmount)
  if (!current.hasContact || downAmount <= 0) return topWhenUp

  const lowestTop = current.viewportHeight - current.height1 - current.top1
  const topWhenDown = current.inScene
    ? Math.max(current.top1, Math.min(current.slotTop - scrollTop, lowestTop))
    : Math.max(current.top1, current.slotTop - scrollTop)
  const menuExtra = current.isCompact && opensUp ? (current.menuHeight - current.height1) * Math.max(0, expanded) : 0

  return lerp(topWhenUp, topWhenDown, smooth(downAmount)) - menuExtra * downAmount
}

// Centre horizontal : version compacte, la pilule glisse de la gauche vers le milieu de la fenêtre sur l'écran Contact
const getHeaderCenterX = (current: Geometry, travelAmount: number, width: number, downAmount: number, arcPx: number) => {
  const centerWhenUp = getFlightCenterX(current, travelAmount, width, arcPx)

  return current.isCompact ? lerp(centerWhenUp, current.viewportWidth / 2, smooth(downAmount)) : centerWhenUp
}

// Étirement de la hauteur pendant le voyage vers le bas
const getHeaderHeight = (current: Geometry, travelAmount: number, widenAmount: number, downAmount: number) =>
  getFlightHeight(current, travelAmount, widenAmount) * (1 + 0.22 * Math.sin(downAmount * Math.PI))

const getHeaderWobble = (travelAmount: number, downAmount: number) =>
  (Math.sin(travelAmount * Math.PI * 2) + Math.sin(downAmount * Math.PI * 2)) * WOBBLE_DEGREES

type MorphTabProps = {
  // Rang d'apparition (0 = premier à apparaître)
  rank: number
  progress: MotionValue<number>
  reducedMotion: boolean
  // Vrai en version tactile : l'apparition est alors aussi jouée par une animation WAAPI (lib/morphPlayer)
  isPlayedByBrowser: boolean
  children: ReactNode
}

// Un onglet : apparaît en fondu en remontant légèrement, avec un petit décalage selon son rang
function MorphTab({ rank, progress, reducedMotion, isPlayedByBrowser, children }: MorphTabProps) {
  const itemRef = useRef<HTMLLIElement>(null)
  const opacity = useTransform(progress, (value) => (reducedMotion ? 1 : getTabOpacity(value, rank)))
  const offsetY = useTransform(opacity, (value) => (reducedMotion ? 0 : (1 - value) * 10))

  useLayoutEffect(() => {
    const item = itemRef.current
    if (!item || !isPlayedByBrowser) return

    return registerMorphElement(item, ({ progress: value }) => {
      const amount = getTabOpacity(value, rank)

      return { opacity: amount, transform: `translateY(${(1 - amount) * 10}px)` }
    })
  }, [isPlayedByBrowser, rank])

  return (
    <motion.li
      ref={itemRef}
      style={{ opacity, y: offsetY }}
    >
      {children}
    </motion.li>
  )
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
  // Version tactile : voyage vers le bas du Contact (0 → 1), DÉCLENCHÉ à l'arrivée du bandeau Contact (useBambooMobile)
  contactProgress?: MotionValue<number>
}

function MorphNavbar({
  sections,
  reducedMotion,
  learnMoreLabel,
  onLearnMore,
  sceneProgress,
  isSceneActive,
  contactProgress,
}: MorphNavbarProps) {
  const { renderItem, currentLabel, menu } = useNavbarModel(sections, reducedMotion)

  // Les mesures vivent dans des « refs » : les transformations ci-dessous les lisent à chaque image,
  // sans faire re-rendre le composant. `tick` change à chaque nouvelle mesure pour forcer le recalcul.
  const geometry = useRef<Geometry | null>(null)
  const menuGeometry = useRef<MenuGeometry | null>(null)
  const remeasure = useRef<() => void>(() => {})
  const reducedRef = useRef(reducedMotion)
  const sceneActiveRef = useRef(isSceneActive)
  // Chronologie du voyage : celle de la scène sur ordinateur, la tactile ailleurs
  const getTimeline = () => (sceneActiveRef.current ? SCENE_TIMELINE : TOUCH_TIMELINE)
  const rowRef = useRef<HTMLElement>(null)
  const headerRef = useRef<HTMLElement>(null)
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
  const travel = useTransform(progress, (value) => (reducedRef.current ? 1 : getTravel(value, getTimeline())))

  // Phase 2 : l'élargissement, à la fin seulement. Ordinateur : useSpring lui donne un ressort, la valeur dépasse un
  // peu 1 puis revient (petit rebond), et elle suit toujours le scroll (retour arrière compris). Version tactile : même
  // rebond, mais par une courbe fixe (getWidenOvershoot), pour que l'animation WAAPI affiche exactement la même chose.
  const widenTarget = useTransform(progress, (value) =>
    reducedRef.current ? 1 : getWiden(value, getTimeline()),
  )
  const widenSpring = useSpring(widenTarget, { stiffness: 220, damping: 11, mass: 0.9 })
  // Ordinateur, en remontant (la cible diminue) : PAS de ressort. Son rebond ferait passer la barre sous la taille du
  // bouton et osciller (bouton à moitié transformé qui flotte) ; on suit donc la cible telle quelle et on cale le ressort
  // dessus, pour qu'il reparte proprement à la prochaine descente.
  const lastWidenTarget = useRef(0)
  const widen = useTransform([widenSpring, widenTarget, tick], ([spring, target]: number[]) => {
    if (geometry.current && !geometry.current.inScene) return getWidenOvershoot(target)
    const isGoingBack = target < lastWidenTarget.current
    lastWidenTarget.current = target
    if (!isGoingBack) return spring
    widenSpring.jump(target)

    return target
  })

  // VOYAGE VERS LE BAS (écran Contact), 0 → 1, lui aussi lié au scroll. Ordinateur : il se joue pendant la dernière
  // transition de la scène (la photo se rouvre), la navbar descend en même temps. Mobile et tablette : de l'instant où
  // le Contact commence à entrer dans la fenêtre jusqu'à ce qu'il la remplisse. La navbar se décroche du haut et descend
  // se poser sur son emplacement en bas, au milieu. Si on remonte, elle remonte. Sans animation : elle saute à mi-course.
  const idleContact = useMotionValue(0)
  const contactSource = contactProgress ?? idleContact
  const contactTravel = useTransform([tick, sceneProgress, contactSource], ([, sceneValue, triggered]: number[]) => {
    const current = geometry.current
    if (!current?.hasContact) return 0
    // Ordinateur : lié à la scène. Version tactile : joué dans le temps à l'arrivée du bandeau Contact
    const amount = current.inScene ? clamp01(sceneValue - 2) : clamp01(triggered)
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
      // Version tactile : le voyage est joué dans le temps (progression 0 → 1 en 0,6 s) et non par le scroll.
      // Une fois posée sur l'emplacement du Contact (downAmount = 1), la pilule est POSÉE dans la page (classe is-docked :
      // position absolute) : son top est celui de l'emplacement dans la page, sans aucun calcul lié au scroll, et c'est le
      // navigateur qui la fait défiler avec la page.
      const isDockedNow = !current.inScene && downAmount >= 1
      return getHeaderTop(current, amount, isDockedNow ? 0 : scrollTop, downAmount, expanded, opensUpRef.current)
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
    const base = getFlightWidth(current, flight, spread)
    const menuExtra = current.isCompact ? (current.menuWidth - current.width1) * Math.max(0, expanded) : 0
    return base + menuExtra
  })

  const height = useTransform([travel, widen, menu.expand, contactTravel, tick], ([flight, spread, expanded, downAmount]: number[]) => {
    const current = geometry.current
    if (!current) return 0
    const base = getHeaderHeight(current, flight, spread, downAmount)
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
    // Grand écran : pendant la montée, le bouton fait un léger arc vers la droite (sin vaut 0 au départ et à l'arrivée,
    // 1 au milieu), pour contourner l'avatar de la landing qui glisse vers la gauche au même moment
    return getHeaderCenterX(current, amount, currentWidth, downAmount, reducedRef.current ? 0 : FLIGHT_ARC_PX)
  })

  // Petit balancement pendant le vol (quelques degrés au plus), pour le côté ludique ; nul au départ et à l'arrivée
  const wobble = useTransform([travel, contactTravel, tick], ([flight, downAmount]: number[]) =>
    getHeaderWobble(flight, downAmount),
  )

  // Opacité de l'ensemble : invisible tant que les mesures ne sont pas prises ; en mode « sans animation »,
  // fondu simple entre 30 % et 70 % de la progression
  // `tick` change après chaque mesure : sans lui, l'opacité ne se recalculait pas quand `isReady` passait à 1
  const fade = useTransform([progress, isReady, tick], ([value, ready]: number[]) =>
    ready * (reducedRef.current ? clamp01((value - 0.3) / 0.4) : 1),
  )

  // Le texte « Learn more » reste visible jusqu'à 40 % du parcours, puis s'efface en fondu
  const learnOpacity = useTransform(progress, (value) => getLearnOpacity(value, getTimeline()))
  const compactOpacity = useTransform(progress, (value) => (reducedRef.current ? 1 : getCompactOpacity(value, getTimeline())))

  useMotionValueEvent(progress, 'change', (value) => setIsCollapsed(value < getTimeline().learnFadeStart))
  // Vrai (version tactile) quand la pilule est posée sur son emplacement dans la page, en bas du Contact
  const [isDocked, setIsDocked] = useState(false)
  useMotionValueEvent(contactTravel, 'change', (value) => setIsDocked(!sceneActiveRef.current && value >= 1))

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
    // Version tactile : l'écran affiché change (About, Recherche, Contact) et les positions de la page avec lui
    window.addEventListener('scene:measure', measure)
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
      window.removeEventListener('scene:measure', measure)
      observer.disconnect()
    }
  }, [reducedMotion, isSceneActive, currentLabel, sections, measure])

  // VERSION TACTILE : pendant la transition, l'écran affiche des animations WAAPI jouées par le navigateur (lib/morphPlayer),
  // pas nos valeurs JavaScript (Safari iOS ne les affiche pas pendant l'élan du doigt). Chaque élément donne son style à une
  // progression donnée, avec les mêmes formules que ci-dessus ; le menu est fermé et l'écran Contact loin : ni l'un ni l'autre
  // n'entre en jeu.
  useLayoutEffect(() => {
    const header = headerRef.current
    if (!header || reducedMotion || isSceneActive) return

    const unregisters = [
      registerMorphElement(header, ({ progress: value }) => {
        const current = geometry.current
        if (!current) return {} as MorphFrame
        const travelAmount = getTravel(value, TOUCH_TIMELINE)
        const widenAmount = getWidenOvershoot(getWiden(value, TOUCH_TIMELINE))
        const width = getFlightWidth(current, travelAmount, widenAmount)
        const height = getFlightHeight(current, travelAmount, widenAmount)
        const wobbleDegrees = Math.sin(travelAmount * Math.PI * 2) * WOBBLE_DEGREES

        return {
          top: `${getFlightTop(current, travelAmount)}px`,
          left: `${getFlightCenterX(current, travelAmount, width, FLIGHT_ARC_PX)}px`,
          width: `${width}px`,
          height: `${height}px`,
          borderRadius: `${height / 2}px`,
          transform: `translateX(-50%) rotate(${wobbleDegrees}deg)`,
        }
      }),
    ]

    // Voyage vers le bas du Contact (canal « contact », temps linéaire : getHeader* appliquent déjà leur courbe). La navbar
    // est alors déjà arrivée (voyage et élargissement finis) ; la page peut encore glisser, on vise donc la place où
    // elle se sera arrêtée (le Contact remplit la fenêtre, au plus le bas de la page).
    unregisters.push(
      registerMorphElement(
        header,
        ({ progress: down }) => {
          const current = geometry.current
          if (!current) return {} as MorphFrame
          // L'écran Contact est une scène à part (useBambooMobile) : on y arrive en haut de la page, scroll 0
          const scrollTop = window.scrollY
          const width = getFlightWidth(current, 1, 1)
          const height = getHeaderHeight(current, 1, 1, down)

          return {
            top: `${getHeaderTop(current, 1, scrollTop, down, 0, false)}px`,
            left: `${getHeaderCenterX(current, 1, width, down, FLIGHT_ARC_PX)}px`,
            width: `${width}px`,
            height: `${height}px`,
            borderRadius: `${height / 2}px`,
            transform: `translateX(-50%) rotate(${getHeaderWobble(1, down)}deg)`,
          }
        },
        'contact',
      ),
    )

    const learnButton = header.querySelector<HTMLElement>('.site-nav__learn')
    if (learnButton) {
      unregisters.push(registerMorphElement(learnButton, ({ progress: value }) => ({ opacity: getLearnOpacity(value, TOUCH_TIMELINE) })))
    }
    const compact = header.querySelector<HTMLElement>('.site-nav__compact')
    if (compact) {
      unregisters.push(registerMorphElement(compact, ({ progress: value }) => ({ opacity: getCompactOpacity(value, TOUCH_TIMELINE) })))
    }

    return () => unregisters.forEach((unregister) => unregister())
  }, [reducedMotion, isSceneActive])

  // CompactMenu nous envoie les tailles de la pilule et du menu : on les garde et on remesure le tout
  const handleMenuMeasured = useCallback((measured: MenuGeometry) => {
    menuGeometry.current = measured
    remeasure.current()
  }, [])

  return (
    <motion.header
      ref={headerRef}
      className={isDocked ? 'site-nav site-nav--morph is-docked' : 'site-nav site-nav--morph'}
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
                isPlayedByBrowser={!reducedMotion && !isSceneActive}
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
