// Scène « entrer dans la forêt » de l'accueil (ordinateur) : transition Landing → About liée au scroll.
//
// PRINCIPE. La page défile NORMALEMENT (molette, clavier, tactile : rien n'est détourné). La scène est un cadre
// `position: sticky` (scene.css) : tant qu'on traverse sa hauteur, il reste collé à l'écran et les bambous ne
// bougent pas. Ce hook lit seulement la progression du scroll dans la scène (p : 0 = landing, 1 = About) et en
// déduit, à chaque image, la position et l'opacité de chaque élément :
//   - la photo : la bannière se resserre (clip-path, pas la hauteur) pendant qu'elle zoome (transform) ;
//   - l'avatar, le nom, le poste et les réseaux DE LA LANDING glissent jusqu'à la place qu'ils ont dans l'About
//     (transform). Au départ ce sont donc exactement les éléments de la landing, sans aucune retouche : leur mise en
//     page (centrée, une ligne) n'est jamais modifiée. À la toute fin, l'en-tête de l'About prend le relais ;
//   - « Latest things » s'efface, le contenu de l'About apparaît (opacity).
// On n'anime que transform, opacity et clip-path : aucune mise en page n'est recalculée pendant le scroll.
// Les styles sont posés directement sur les éléments (sans re-rendre React) : c'est une valeur qui change à chaque image.
import { useLayoutEffect, type RefObject } from 'react'
import { useScroll, type MotionValue } from 'framer-motion'

// Le zoom des bambous à la fin de la transition : +16 % (on avance dans la forêt)
const ZOOM = 0.16

// Passage de relais entre l'identité de la landing et l'en-tête de l'About : fondu entre 92 % et 100 % du parcours
const HANDOVER_START = 0.92

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
  cut: number
  movers: Mover[]
}

function measureText(element: Element) {
  const range = document.createRange()
  range.selectNodeContents(element)

  return range.getBoundingClientRect()
}

export function useBambooScene(
  sceneRef: RefObject<HTMLElement | null>,
  isActive: boolean,
  reducedMotion: boolean,
): MotionValue<number> {
  // 0 quand le haut de la scène touche le haut de la fenêtre, 1 quand son bas touche le bas de la fenêtre
  const { scrollYProgress } = useScroll({ target: sceneRef, offset: ['start start', 'end end'] })

  useLayoutEffect(() => {
    const scene = sceneRef.current
    if (!isActive || !scene) return

    const find = <T extends HTMLElement>(selector: string) => scene.querySelector<T>(selector)
    const photo = find('.scene__photo')
    const photoImage = find('.scene__photo img')
    const aboutBanner = find('.about__banner')
    const landingIdentity = find('.landing-hero__content')
    const aboutHeader = find('.about__header')
    const latest = find('.latest-things')
    const revealed = ['.about__side', '.about__main', '.about__papers']
      .map((selector) => find(selector))
      .filter((element): element is HTMLElement => element !== null)
    if (!photo || !photoImage) return

    let measures: Measures | null = null
    // Évite de réécrire `inert` et la couleur quand rien n'a changé
    let isLatestInert: boolean | null = null
    let areRevealedInert: boolean | null = null
    let isHandedOver: boolean | null = null
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

      measures = { cut: Math.max(0, photo.offsetHeight - (aboutBanner?.offsetHeight ?? 0)), movers }
    }

    const apply = (progress: number) => {
      if (!measures) return

      // Avec « mouvement réduit » : aucun glissement ni zoom, tout bascule d'un coup à mi-parcours ; seuls les fondus
      // (opacité) restent progressifs
      const eased = reducedMotion ? (progress > 0.5 ? 1 : 0) : smooth(progress)

      // La bannière : clip-path rogne le bas de la photo (la hauteur de la photo ne change jamais). La photo remonte
      // de la moitié du rognage pour que le centre de l'image reste dans le cadre, et zoome.
      photo.style.clipPath = `inset(0 0 ${measures.cut * eased}px 0)`
      photoImage.style.transform = reducedMotion
        ? ''
        : `translate3d(0, ${-measures.cut * eased * 0.5}px, 0) scale(${1 + ZOOM * eased})`

      measures.movers.forEach((mover) => {
        mover.element.style.transform =
          `translate3d(${mover.endX * eased}px, ${mover.endY * eased}px, 0) ` +
          `scale(${lerp(1, mover.endScale, eased)})`

        if (mover.recolor) {
          // color-mix : blanc sur la photo → couleur du texte sur le fond de la page. Le poste ne passe sous le bord
          // de la bannière qu'en fin de parcours : le changement se fait entre 78 % et 92 %
          const toInk = clamp01((progress - 0.78) / 0.14)
          const color = `color-mix(in srgb, var(--color-ink) ${toInk * 100}%, #ffffff)`
          if (color !== roleColor) {
            mover.element.style.color = color
            roleColor = color
          }
        }
      })

      // Passage de relais : à l'arrivée, les éléments de la landing sont exactement sur ceux de l'About ; on les
      // remplace par l'en-tête de l'About (qui reprend sa propre mise en page : retour à la ligne, liens cliquables).
      // Avant, l'en-tête de l'About est invisible et inerte (pas de doublon pour les lecteurs d'écran).
      const handover = reducedMotion ? (progress > 0.5 ? 1 : 0) : clamp01((progress - HANDOVER_START) / (1 - HANDOVER_START))
      const hasHandedOver = handover > 0.5
      if (landingIdentity) landingIdentity.style.opacity = String(1 - handover)
      if (aboutHeader) aboutHeader.style.opacity = String(handover)
      if (hasHandedOver !== isHandedOver) {
        if (landingIdentity) landingIdentity.inert = hasHandedOver
        if (aboutHeader) aboutHeader.inert = !hasHandedOver
        isHandedOver = hasHandedOver
      }

      // « Latest things » s'efface sur les 40 premiers % et descend un peu
      const latestOpacity = 1 - clamp01(progress / 0.4)
      if (latest) {
        latest.style.opacity = String(latestOpacity)
        latest.style.transform = `translate3d(0, ${(1 - latestOpacity) * 24}px, 0)`
        const shouldBeInert = latestOpacity < 0.9
        if (shouldBeInert !== isLatestInert) {
          latest.inert = shouldBeInert
          isLatestInert = shouldBeInert
        }
      }

      // Le contenu de l'About apparaît entre 35 % et 85 %, en remontant un peu : il commence avant la fin de
      // « Latest things » (pas de creux au milieu). Il reste inerte (ni clic ni tabulation) tant qu'il n'est pas visible.
      const revealOpacity = clamp01((progress - 0.35) / 0.5)
      const shouldBeInert = revealOpacity < 0.9
      revealed.forEach((element) => {
        element.style.opacity = String(revealOpacity)
        element.style.transform = `translate3d(0, ${(1 - revealOpacity) * 20}px, 0)`
        if (shouldBeInert !== areRevealedInert) element.inert = shouldBeInert
      })
      areRevealedInert = shouldBeInert
      if (aboutBanner) aboutBanner.style.opacity = String(revealOpacity)
    }

    const refresh = () => {
      measure()
      apply(scrollYProgress.get())
    }

    refresh()
    const stopListening = scrollYProgress.on('change', apply)
    window.addEventListener('resize', refresh)
    // Les polices changent la taille des textes après le premier affichage
    void document.fonts?.ready.then(refresh)

    return () => {
      stopListening()
      window.removeEventListener('resize', refresh)
      photo.style.clipPath = ''
      photoImage.style.transform = ''
      ;[
        ...MOVERS.map((spec) => find(spec.from)),
        landingIdentity,
        aboutHeader,
        latest,
        aboutBanner,
        ...revealed,
      ].forEach((element) => {
        if (!element) return
        element.style.transform = ''
        element.style.opacity = ''
        element.style.color = ''
        element.inert = false
      })
    }
  }, [isActive, reducedMotion, sceneRef, scrollYProgress])

  return scrollYProgress
}
