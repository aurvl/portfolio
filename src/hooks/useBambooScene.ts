// Scène « entrer dans la forêt » de l'accueil (ordinateur) : quatre écrans reliés par la même photo de bambous.
//
// PRINCIPE. La page défile NORMALEMENT (molette, clavier, tactile : rien n'est détourné). La scène est un cadre
// `position: sticky` (scene.css) : tant qu'on traverse sa hauteur, il reste collé à l'écran et la photo ne bouge pas.
// Ce hook lit seulement la distance de scroll et en déduit une PROGRESSION `P` de 0 à 3 :
//   0 → 1  Landing → About       (la bannière se resserre, la photo zoome, l'identité glisse à sa place d'About)
//   1 → 2  About → Recherche     (la bannière se resserre encore, la photo zoome encore ; l'About s'efface, la
//                                 Recherche apparaît)
//   2      Recherche, défilement LIBRE (la liste défile normalement sous la bande de photo)
//   2 → 3  Recherche → Contact   (la photo se rouvre presque jusqu'en bas en zoomant : on « entre » dans la forêt ;
//                                 la Recherche s'efface, l'identité et le formulaire apparaissent)
// À chaque image, il pose la forme de la photo (clip-path + transform) et l'opacité des contenus. On n'anime que
// transform, opacity et clip-path : aucune mise en page n'est recalculée pendant le scroll. Les styles sont posés
// directement sur les éléments (sans re-rendre React) : ce sont des valeurs qui changent à chaque image.
//
// LA PHOTO. Une seule <img>, dans un cadre de la hauteur de l'écran ; clip-path ne montre que la bande du haut
// (de 0 à `edge` px). L'image reste centrée sur la bande visible et zoome autour de ce centre.
//
// LA RECHERCHE. Sa liste est plus haute que l'écran et doit défiler normalement. Pendant les transitions on la fixe à
// l'écran (`position: fixed`, classes is-pinned-*) ; entre les deux elle est un bloc ordinaire qui défile avec la page.
// Le passage de l'un à l'autre est sans saut : à cet instant précis, les deux positions coïncident.
import { useLayoutEffect, type RefObject } from 'react'
import { useMotionValue, useScroll, type MotionValue } from 'framer-motion'

// Zoom de la photo à chaque écran, en plus de 1 : Landing, About, Recherche, Contact (on avance dans la forêt)
const ZOOM_STEPS = [0, 0.16, 0.3, 0.45]

// Netteté : la photo fait 2400 px de large. Au-delà de 1,3 fois cette taille en pixels d'écran, elle devient floue ;
// on réduit alors l'amplitude du zoom pour ne jamais dépasser ce seuil.
const PHOTO_NATURAL_WIDTH = 2400
const PHOTO_MAX_UPSCALE = 1.3

// Hauteur de la bannière de la landing, en fraction de la fenêtre (la même valeur est dans landing.css)
const LANDING_BANNER_RATIO = 0.625

// Passage de relais entre l'identité de la landing et l'en-tête de l'About : fondu entre 92 % et 100 % du parcours
const HANDOVER_START = 0.92

// Déplacement vertical des contenus qui apparaissent ou disparaissent (en px) : ils glissent en même temps qu'ils fondent
const ABOUT_SHIFT_PX = 70
const RESEARCH_SHIFT_PX = 60
const CONTACT_SHIFT_PX = 50

const clamp01 = (value: number) => Math.min(1, Math.max(0, value))
const lerp = (from: number, to: number, amount: number) => from + (to - from) * amount
// Départ et arrivée en douceur (vitesse nulle aux deux bouts)
const smooth = (amount: number) => amount * amount * (3 - 2 * amount)

// Éléments de l'identité qui glissent. `from` = l'élément de la landing (c'est lui qui bouge), `to` = sa place dans l'About.
//   - box : on compare les boîtes ; text : on compare le texte lui-même (le nom de l'About est une boîte pleine largeur
//     alignée à gauche, alors que celui de la landing est centré) ;
//   - scale : width = rapport des largeurs (avatar), font = rapport des tailles de police (nom), none = aucun.
type MoverSpec = {
  from: string
  to: string
  measure: 'box' | 'text'
  scale: 'width' | 'font' | 'none'
  // Le poste est blanc sur la photo (landing) puis sombre sur le fond de la page (About)
  recolor?: boolean
}

const MOVERS: MoverSpec[] = [
  { from: '.landing-hero__avatar', to: '.about__avatar', measure: 'box', scale: 'width' },
  { from: '.landing-hero__name', to: '.about__name', measure: 'text', scale: 'font' },
  { from: '.landing-hero__role', to: '.about__role', measure: 'text', scale: 'none', recolor: true },
  { from: '.landing-hero__social', to: '.about__social', measure: 'box', scale: 'none' },
]

type Mover = {
  element: HTMLElement
  // Décalage et échelle à l'arrivée (progression = 1)
  endX: number
  endY: number
  endScale: number
  recolor: boolean
}

type Measures = {
  // Hauteur de la fenêtre (= du cadre) et de la liste de Recherche
  stageHeight: number
  researchHeight: number
  // Position de la scène dans la page
  sceneTop: number
  // Bas de la bande de photo à chaque écran (px depuis le haut) : Landing, About, Recherche, Contact
  edges: number[]
  // Zoom de la photo à chaque écran (après plafonnement pour la netteté)
  zooms: number[]
  movers: Mover[]
}

type PinMode = 'start' | 'flow' | 'end'

function measureText(element: Element) {
  const range = document.createRange()
  range.selectNodeContents(element)

  return range.getBoundingClientRect()
}

// Amplitude du zoom : 1 = celle voulue ; moins si la photo risquerait d'être floue sur cet écran
function getZoomScale(stageWidth: number) {
  const deviceWidth = stageWidth * (window.devicePixelRatio || 1)
  const allowedExtra = (PHOTO_MAX_UPSCALE * PHOTO_NATURAL_WIDTH) / deviceWidth - 1

  return clamp01(allowedExtra / ZOOM_STEPS[ZOOM_STEPS.length - 1])
}

// Valeur au point `progress` (0 à 3) d'une suite de quatre valeurs, une par écran, avec départ et arrivée en douceur
function valueAt(progress: number, values: number[], ease: (amount: number) => number) {
  if (progress <= 1) return lerp(values[0], values[1], ease(clamp01(progress)))
  if (progress <= 2) return lerp(values[1], values[2], ease(clamp01(progress - 1)))

  return lerp(values[2], values[3], ease(clamp01(progress - 2)))
}

export function useBambooScene(
  sceneRef: RefObject<HTMLElement | null>,
  isActive: boolean,
  reducedMotion: boolean,
): MotionValue<number> {
  const { scrollY } = useScroll()
  // La progression 0 → 3, partagée avec la navbar (MorphNavbar)
  const progress = useMotionValue(0)

  useLayoutEffect(() => {
    const scene = sceneRef.current
    if (!isActive || !scene) return

    const find = <T extends HTMLElement>(selector: string) => scene.querySelector<T>(selector)
    const stage = find('.scene__stage')
    const photo = find('.scene__photo')
    const photoImage = find('.scene__photo img')
    const aboutBanner = find('.about__banner')
    const landingIdentity = find('.landing-hero__content')
    const aboutHeader = find('.about__header')
    const latest = find('.latest-things')
    const revealed = ['.about__side', '.about__main', '.about__papers']
      .map((selector) => find(selector))
      .filter((element): element is HTMLElement => element !== null)
    const researchTrack = find('.papers-track')
    const research = find('.papers')
    const researchBanner = find('.papers__banner')
    const researchChrome = find('.papers-chrome')
    const contact = find('.contact')
    if (!stage || !photo || !photoImage || !researchTrack || !research || !researchBanner || !contact) return

    let measures: Measures | null = null
    // Évite de réécrire `inert`, les classes et la couleur quand rien n'a changé
    let isLatestInert: boolean | null = null
    let areRevealedInert: boolean | null = null
    let isHandedOver: boolean | null = null
    let isAboutHeaderInert: boolean | null = null
    let isResearchInert: boolean | null = null
    let isContactInert: boolean | null = null
    let pinMode: PinMode | null = null
    let roleColor = ''

    const measure = () => {
      // On enlève les décalages le temps de mesurer : la place de départ, c'est celle de la mise en page normale
      MOVERS.forEach((spec) => {
        const source = find(spec.from)
        if (source) source.style.transform = ''
      })

      const movers: Mover[] = []
      MOVERS.forEach((spec) => {
        const source = find(spec.from)
        const target = find(spec.to)
        if (!source || !target) return

        const box = source.getBoundingClientRect()
        const sourceContent = spec.measure === 'text' ? measureText(source) : box
        const targetContent = spec.measure === 'text' ? measureText(target) : target.getBoundingClientRect()

        let endScale = 1
        if (spec.scale === 'width') endScale = targetContent.width / sourceContent.width
        if (spec.scale === 'font') {
          endScale = parseFloat(getComputedStyle(target).fontSize) / parseFloat(getComputedStyle(source).fontSize)
        }

        // La transformation s'applique depuis le coin haut-gauche de l'élément (transform-origin) : on en déduit le
        // décalage qui amène le coin haut-gauche de son contenu sur celui de l'About
        movers.push({
          element: source,
          endScale,
          endX: targetContent.left - box.left - endScale * (sourceContent.left - box.left),
          endY: targetContent.top - box.top - endScale * (sourceContent.top - box.top),
          recolor: Boolean(spec.recolor),
        })
      })

      const stageHeight = stage.offsetHeight
      const researchHeight = research.offsetHeight
      // La liste de Recherche peut être fixée à l'écran (hors de la page) : sa place dans la page est tenue par ce bloc
      researchTrack.style.height = `${researchHeight}px`
      // Le Contact garde un espace vide sous la photo : c'est le bas de la photo qui s'arrête là
      const contactGap = parseFloat(getComputedStyle(contact).paddingBottom) || 0
      const zoomScale = getZoomScale(stage.clientWidth)

      measures = {
        stageHeight,
        researchHeight,
        sceneTop: scene.getBoundingClientRect().top + window.scrollY,
        edges: [
          stageHeight * LANDING_BANNER_RATIO,
          aboutBanner?.offsetHeight ?? 0,
          researchBanner.offsetHeight,
          stageHeight - contactGap,
        ],
        zooms: ZOOM_STEPS.map((step) => 1 + step * zoomScale),
        movers,
      }
    }

    // Distance de scroll → progression 0 à 3. Une hauteur de fenêtre (H) par transition ; entre la 2ᵉ et la 3ᵉ,
    // la liste de Recherche défile librement sur sa propre hauteur.
    const readProgress = (current: Measures) => {
      const { stageHeight: height, researchHeight: listHeight } = current
      const scrolled = window.scrollY - current.sceneTop
      const listEnd = height + listHeight

      if (scrolled <= 2 * height) return Math.max(0, scrolled / height)
      if (scrolled <= listEnd) return 2

      return Math.min(3, 2 + (scrolled - listEnd) / height)
    }

    const setInert = (element: HTMLElement | null, value: boolean) => {
      if (element) element.inert = value
    }

    const apply = () => {
      if (!measures) return

      const current = measures
      const scrolled = window.scrollY - current.sceneTop
      const sceneProgress = readProgress(current)
      progress.set(sceneProgress)

      const landingToAbout = clamp01(sceneProgress)
      const aboutToResearch = clamp01(sceneProgress - 1)
      const researchToContact = clamp01(sceneProgress - 2)

      // Avec « mouvement réduit » : aucun glissement ni zoom, tout bascule d'un coup à mi-parcours ; seuls les fondus
      // (opacité) restent progressifs
      const ease = (amount: number) => (reducedMotion ? (amount > 0.5 ? 1 : 0) : smooth(amount))
      const eased = ease(landingToAbout)

      // LA PHOTO : clip-path montre la bande du haut (jusqu'à `edge`), le zoom part du centre de cette bande.
      // L'image est plus haute que la bande : on la décale pour que son centre reste au centre de la bande.
      const edge = valueAt(sceneProgress, current.edges, ease)
      const zoom = reducedMotion ? 1 : valueAt(sceneProgress, current.zooms, ease)
      photo.style.clipPath = `inset(0 0 ${current.stageHeight - edge}px 0)`
      photoImage.style.transform = `translate3d(0, ${edge / 2 - current.stageHeight / 2}px, 0) scale(${zoom})`

      current.movers.forEach((mover) => {
        mover.element.style.transform =
          `translate3d(${mover.endX * eased}px, ${mover.endY * eased}px, 0) ` +
          `scale(${lerp(1, mover.endScale, eased)})`

        if (mover.recolor) {
          // color-mix : blanc sur la photo → couleur du texte sur le fond de la page. Le poste ne passe sous le bord
          // de la bannière qu'en fin de parcours : le changement se fait entre 78 % et 92 %
          const toInk = clamp01((landingToAbout - 0.78) / 0.14)
          const color = `color-mix(in srgb, var(--color-ink) ${toInk * 100}%, #ffffff)`
          if (color !== roleColor) {
            mover.element.style.color = color
            roleColor = color
          }
        }
      })

      // LANDING → ABOUT. Passage de relais : à l'arrivée, les éléments de la landing sont exactement sur ceux de
      // l'About ; on les remplace par l'en-tête de l'About (qui reprend sa propre mise en page : retour à la ligne,
      // liens cliquables). Avant, l'en-tête de l'About est invisible et inerte (pas de doublon pour les lecteurs d'écran).
      const handover = reducedMotion
        ? landingToAbout > 0.5
          ? 1
          : 0
        : clamp01((landingToAbout - HANDOVER_START) / (1 - HANDOVER_START))
      const hasHandedOver = handover > 0.5

      // ABOUT → RECHERCHE. L'About s'efface sur la première moitié, en glissant vers le haut (les deux fondus se
      // chevauchent un peu : jamais d'écran vide au milieu).
      const aboutOut = clamp01(aboutToResearch / 0.55)
      const aboutShift = reducedMotion ? 0 : -aboutOut * ABOUT_SHIFT_PX
      const aboutVisible = 1 - aboutOut

      if (landingIdentity) landingIdentity.style.opacity = String(1 - handover)
      if (aboutHeader) {
        aboutHeader.style.opacity = String(handover * aboutVisible)
        aboutHeader.style.transform = aboutShift === 0 ? '' : `translate3d(0, ${aboutShift}px, 0)`
      }
      if (hasHandedOver !== isHandedOver) {
        setInert(landingIdentity, hasHandedOver)
        isHandedOver = hasHandedOver
      }
      const shouldHeaderBeInert = !hasHandedOver || aboutOut > 0.5
      if (shouldHeaderBeInert !== isAboutHeaderInert) {
        setInert(aboutHeader, shouldHeaderBeInert)
        isAboutHeaderInert = shouldHeaderBeInert
      }

      // « Latest things » s'efface sur les 40 premiers % et descend un peu
      const latestOpacity = 1 - clamp01(landingToAbout / 0.4)
      if (latest) {
        latest.style.opacity = String(latestOpacity)
        latest.style.transform = `translate3d(0, ${(1 - latestOpacity) * 24}px, 0)`
        const shouldBeInert = latestOpacity < 0.9
        if (shouldBeInert !== isLatestInert) {
          latest.inert = shouldBeInert
          isLatestInert = shouldBeInert
        }
      }

      // Le contenu de l'About apparaît entre 35 % et 85 % de la première transition, en remontant un peu : il commence
      // avant la fin de « Latest things » (pas de creux au milieu). Il reste inerte (ni clic ni tabulation) tant qu'il
      // n'est pas visible, et le redevient quand il s'efface vers la Recherche.
      const revealIn = clamp01((landingToAbout - 0.35) / 0.5)
      const aboutOpacity = revealIn * aboutVisible
      const shouldBeInert = aboutOpacity < 0.9
      revealed.forEach((element) => {
        element.style.opacity = String(aboutOpacity)
        element.style.transform = `translate3d(0, ${(1 - revealIn) * 20 + aboutShift}px, 0)`
        if (shouldBeInert !== areRevealedInert) element.inert = shouldBeInert
      })
      areRevealedInert = shouldBeInert
      if (aboutBanner) aboutBanner.style.opacity = String(aboutOpacity)

      // RECHERCHE. Elle apparaît sur la seconde moitié de la transition About → Recherche (en montant), et s'efface
      // sur le premier tiers de la transition vers le Contact (en continuant vers le haut).
      const researchIn = clamp01((aboutToResearch - 0.35) / 0.65)
      const researchOut = clamp01(researchToContact / 0.35)
      const researchOpacity = researchIn * (1 - researchOut)
      const researchShift = reducedMotion
        ? 0
        : (1 - researchIn) * RESEARCH_SHIFT_PX - researchOut * RESEARCH_SHIFT_PX
      const researchTransform = researchShift === 0 ? '' : `translate3d(0, ${researchShift}px, 0)`
      const isResearchHidden = researchOpacity <= 0.001
      ;[research, researchChrome].forEach((element) => {
        if (!element) return
        element.style.opacity = String(researchOpacity)
        element.style.transform = researchTransform
        // 'visible' explicite : le CSS de départ les cache (avant que le script ne tourne)
        element.style.visibility = isResearchHidden ? 'hidden' : 'visible'
      })
      const shouldResearchBeInert = researchOpacity < 0.9
      if (shouldResearchBeInert !== isResearchInert) {
        setInert(research, shouldResearchBeInert)
        setInert(researchChrome, shouldResearchBeInert)
        isResearchInert = shouldResearchBeInert
      }

      // La liste de Recherche : fixée à l'écran avant et après son défilement libre, ordinaire entre les deux.
      // Fixée en haut tant que son haut n'a pas atteint le haut de la fenêtre ; fixée en bas une fois son bas atteint.
      const nextPinMode: PinMode =
        scrolled < 2 * current.stageHeight ? 'start' : scrolled <= current.stageHeight + current.researchHeight ? 'flow' : 'end'
      if (nextPinMode !== pinMode) {
        research.classList.toggle('is-pinned-start', nextPinMode === 'start')
        research.classList.toggle('is-pinned-end', nextPinMode === 'end')
        research.style.setProperty('--papers-pin-end', `${current.stageHeight - current.researchHeight}px`)
        pinMode = nextPinMode
      }

      // CONTACT. L'identité et le formulaire apparaissent sur la fin de la transition, en remontant.
      const contactIn = clamp01((researchToContact - 0.55) / 0.45)
      const contactShift = reducedMotion ? 0 : (1 - contactIn) * CONTACT_SHIFT_PX
      contact.style.opacity = String(contactIn)
      contact.style.transform = contactShift === 0 ? '' : `translate3d(0, ${contactShift}px, 0)`
      contact.style.visibility = contactIn <= 0.001 ? 'hidden' : 'visible'
      const shouldContactBeInert = contactIn < 0.9
      if (shouldContactBeInert !== isContactInert) {
        setInert(contact, shouldContactBeInert)
        isContactInert = shouldContactBeInert
      }
    }

    const refresh = () => {
      measure()
      apply()
    }

    refresh()
    const stopListening = scrollY.on('change', apply)
    window.addEventListener('resize', refresh)
    // Les polices changent la taille des textes après le premier affichage ; la liste de Recherche peut changer de hauteur
    void document.fonts?.ready.then(refresh)
    const observer = new ResizeObserver(refresh)
    observer.observe(research)

    return () => {
      stopListening()
      observer.disconnect()
      window.removeEventListener('resize', refresh)
      photo.style.clipPath = ''
      photoImage.style.transform = ''
      researchTrack.style.height = ''
      research.classList.remove('is-pinned-start', 'is-pinned-end')
      research.style.removeProperty('--papers-pin-end')
      ;[
        ...MOVERS.map((spec) => find(spec.from)),
        landingIdentity,
        aboutHeader,
        latest,
        aboutBanner,
        research,
        researchChrome,
        contact,
        ...revealed,
      ].forEach((element) => {
        if (!element) return
        element.style.transform = ''
        element.style.opacity = ''
        element.style.color = ''
        element.style.visibility = ''
        element.inert = false
      })
    }
  }, [isActive, reducedMotion, sceneRef, scrollY, progress])

  return progress
}
