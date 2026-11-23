// Version mobile et tablette (< 1024 px) de la scène « entrer dans la forêt » de l'accueil.
//
// Ici il n'y a pas de scène collée à l'écran : Landing, About, Recherche et Contact sont des sections normales, l'une
// sous l'autre, chacune avec sa propre bannière de bambous.
//
// LANDING ↔ ABOUT : la transition est DÉCLENCHÉE, pas suivie. Au doigt, une animation liée à chaque pixel de scroll
// rampe, zigzague et reste coincée à mi-chemin. Ici il n'existe que deux états, « landing » (0) et « about » (1) :
//   - dès que le scroll dépasse TRIGGER_PX, la transition complète se joue seule en ~600 ms (ressort, léger rebond) :
//     le bouton voyage jusqu'à la pilule, l'identité de la landing s'efface, les bambous zooment et la bannière
//     se resserre. Au même moment la page défile en douceur jusqu'à l'About (scroll natif, rien n'est bloqué) ;
//   - quand on revient tout en haut, la même transition se joue à l'envers ;
//   - si le doigt s'arrête entre les deux, la page termine d'elle-même le mouvement (calage au repos).
// La valeur 0 → 1 jouée dans le temps (`progress`) est partagée avec la navbar (MorphNavbar).
//
// AUTRES BANNIÈRES (About, Recherche, Contact) : liées à leur position dans la page (distance lue avec `useScroll`) :
//   - ZOOM : la photo zoome à mesure qu'on avance dans la page (×1,16 → ×1,30 → ×1,45) ;
//   - BANNIÈRE : quand elle arrive, elle s'ouvre (le cadre passe de resserré à sa pleine taille).
// On n'anime que transform, opacity et clip-path (jamais une hauteur). Les valeurs sont posées directement sur les
// éléments, sans re-rendre React.
//
// prefers-reduced-motion : ni zoom, ni resserrement, ni défilement animé ; seulement des fondus simples.
import { useLayoutEffect } from 'react'
import { animate, useMotionValue, useScroll, type MotionValue } from 'framer-motion'

type BannerSpec = {
  // Le cadre (clip-path, opacité) et la photo qu'il contient (zoom)
  frame: string
  image: string
  // Zoom de la photo quand la bannière est bien en place
  zoom: number
  // Côté par lequel le cadre s'ouvre à l'arrivée : le texte de la section ne doit jamais se retrouver rogné
  clipSide: 'top' | 'bottom'
  // Part de la hauteur du cadre rognée au départ (0 à 1), en plus d'un maximum en px pour ne pas toucher au texte
  clipRatio: number
  clipMaxPx: number
  // Vrai si la photo est collée à l'écran (hauteur de la fenêtre) au lieu de remplir tout le cadre (Contact)
  isPhotoViewportHigh?: boolean
}

// La landing (index 0) est pilotée par la transition déclenchée ; les trois autres par leur position dans la page
const LANDING_BANNER = {
  frame: '.landing-hero__photo',
  image: '.landing-hero__background',
  // Zoom et resserrement de la landing une fois la transition jouée (la même amplitude que l'ancienne version)
  zoomExtra: 0.16,
  clipMaxPx: 52,
}

const BANNERS: BannerSpec[] = [
  { frame: '.about__banner', image: '.about__banner-image', zoom: 1.16, clipSide: 'bottom', clipRatio: 0.6, clipMaxPx: 120 },
  { frame: '.papers__banner', image: '.papers__banner-image', zoom: 1.3, clipSide: 'bottom', clipRatio: 0.6, clipMaxPx: 120 },
  { frame: '.contact__photo-frame', image: '.contact__photo', zoom: 1.45, clipSide: 'top', clipRatio: 0.1, clipMaxPx: 70, isPhotoViewportHigh: true },
]

// Seuil de déclenchement : au-delà de ce scroll (en px), la transition se joue
const TRIGGER_PX = 40
// Durée et rebond du ressort de la transition
const SPRING = { type: 'spring', duration: 0.6, bounce: 0.15 } as const
// Mouvement réduit : fondu simple, sans ressort
const FADE = { duration: 0.25, ease: 'linear' } as const
// Attente (ms) sans aucun scroll avant de terminer le mouvement à la place du doigt
const SETTLE_DELAY_MS = 140

// Netteté : la photo fait 2400 × 1600 px. Au-delà de 1,45 fois cette taille en pixels d'écran elle devient floue ;
// on réduit alors le zoom de la bannière (jusqu'à zéro sur un écran très dense) pour ne jamais dépasser ce seuil.
const PHOTO_NATURAL_WIDTH = 2400
const PHOTO_RATIO = 1.5
const PHOTO_MAX_UPSCALE = 1.45

// À l'arrivée, la photo part de ce zoom en moins et rejoint son zoom final
const ZOOM_ARRIVAL_EXTRA = 0.14
const ZOOM_LEAVING_EXTRA = 0.1

const clamp01 = (value: number) => Math.min(1, Math.max(0, value))
// Départ et arrivée en douceur (vitesse nulle aux deux bouts)
const smooth = (amount: number) => amount * amount * (3 - 2 * amount)

export function useBambooMobile(isActive: boolean, reducedMotion: boolean): MotionValue<number> {
  const { scrollY } = useScroll()
  // 0 = landing, 1 = About ; jouée dans le temps, jamais liée directement au scroll
  const progress = useMotionValue(0)

  useLayoutEffect(() => {
    if (!isActive) return

    const banners = BANNERS.map((spec) => ({
      spec,
      frame: document.querySelector<HTMLElement>(spec.frame),
      image: document.querySelector<HTMLElement>(spec.image),
    })).filter((banner): banner is typeof banner & { frame: HTMLElement; image: HTMLElement } =>
      Boolean(banner.frame && banner.image),
    )

    const landingFrame = document.querySelector<HTMLElement>(LANDING_BANNER.frame)
    const landingImage = document.querySelector<HTMLElement>(LANDING_BANNER.image)
    const landingIdentity = document.querySelector<HTMLElement>('.landing-hero__content')
    let isLandingInert: boolean | null = null
    const latestThings = document.querySelector<HTMLElement>('.latest-things')
    let isLatestInert: boolean | null = null

    // LANDING : tout vient de `progress` (jouée dans le temps). L'identité (avatar, nom, poste, réseaux) s'efface sur
    // la première moitié de la transition, avant que l'en-tête de l'About n'entre à l'écran : jamais deux fois le
    // même visage. Les bambous zooment et la bannière se resserre par le bas (sauf mouvement réduit).
    const applyLanding = (value: number) => {
      const amount = clamp01(value)

      if (landingIdentity) {
        landingIdentity.style.opacity = String(1 - clamp01(amount / 0.5))
        const shouldBeInert = amount > 0.5
        if (shouldBeInert !== isLandingInert) {
          landingIdentity.inert = shouldBeInert
          isLandingInert = shouldBeInert
        }
      }
      // « Latest things » s'efface sur les 40 premiers % : le bouton qui vole vers le haut ne passe jamais sur une carte
      if (latestThings) {
        latestThings.style.opacity = String(1 - clamp01(amount / 0.4))
        const shouldBeInert = amount > 0.4
        if (shouldBeInert !== isLatestInert) {
          latestThings.inert = shouldBeInert
          isLatestInert = shouldBeInert
        }
      }
      if (reducedMotion || !landingFrame || !landingImage) return

      landingImage.style.transform = `scale(${1 + LANDING_BANNER.zoomExtra * value})`
      landingFrame.style.clipPath = `inset(0 0 ${LANDING_BANNER.clipMaxPx * amount}px 0)`
    }

    // AUTRES BANNIÈRES : liées à leur position dans la page
    const applyBanners = () => {
      const viewHeight = window.innerHeight

      banners.forEach(({ spec, frame, image }) => {
        const rect = frame.getBoundingClientRect()
        // Arrivée : 0 quand le haut de la bannière entre par le bas de l'écran, 1 quand il atteint 15 % du haut
        const arrival = smooth(clamp01((viewHeight - rect.top) / (viewHeight * 0.85)))
        // Départ : 0 tant que la bannière est en place, 1 quand elle est entièrement sortie par le haut
        const leaving = clamp01(-rect.top / Math.max(rect.height, 1))

        if (reducedMotion) {
          frame.style.opacity = String(arrival)
          return
        }

        // Largeur réellement affichée de la photo (object-fit: cover : elle remplit la largeur ou la hauteur du cadre)
        const photoHeight = spec.isPhotoViewportHigh ? viewHeight : rect.height
        const shownWidth = Math.max(rect.width, photoHeight * PHOTO_RATIO) * (window.devicePixelRatio || 1)
        const allowedZoom = (PHOTO_MAX_UPSCALE * PHOTO_NATURAL_WIDTH) / shownWidth
        const sharpness = clamp01((allowedZoom - 1) / (spec.zoom - 1))

        const nominalZoom = spec.zoom - (1 - arrival) * ZOOM_ARRIVAL_EXTRA + leaving * ZOOM_LEAVING_EXTRA
        image.style.transform = `scale(${1 + (nominalZoom - 1) * sharpness})`

        const clipPx = Math.min(spec.clipMaxPx, rect.height * spec.clipRatio) * (1 - arrival)
        frame.style.clipPath = spec.clipSide === 'top' ? `inset(${clipPx}px 0 0 0)` : `inset(0 0 ${clipPx}px 0)`
      })
    }

    // LA TRANSITION DÉCLENCHÉE
    let target: 0 | 1 = window.scrollY > TRIGGER_PX ? 1 : 0
    let isTouching = false
    let settleTimer: number | undefined
    let playback: ReturnType<typeof animate> | undefined

    // Début de la page About (où la landing se termine), lu dans la mise en page
    const getAboutTop = () => {
      const about = document.getElementById('about')

      return about ? about.getBoundingClientRect().top + window.scrollY : Infinity
    }

    // Défilement en douceur (scroll natif : on ne bloque jamais le doigt ni la molette). Mouvement réduit : direct.
    const glideTo = (top: number) => {
      if (Math.abs(window.scrollY - top) < 8) return
      window.scrollTo({ top, behavior: reducedMotion ? 'auto' : 'smooth' })
    }

    const play = (next: 0 | 1) => {
      target = next
      playback?.stop()
      playback = animate(progress, next, reducedMotion ? FADE : SPRING)
    }

    // Au repos (plus aucun scroll, doigt levé) : pas d'état intermédiaire possible. Dans la zone de la landing,
    // on termine le mouvement à la place du doigt, vers l'About ou vers le haut selon le côté le plus proche.
    const settle = () => {
      if (isTouching) return

      const aboutTop = getAboutTop()
      const y = window.scrollY
      if (y >= aboutTop - 8) return

      if (y > aboutTop / 2) {
        if (target !== 1) play(1)
        glideTo(aboutTop)
      } else if (y > TRIGGER_PX) {
        play(0)
        glideTo(0)
      }
    }

    const scheduleSettle = () => {
      window.clearTimeout(settleTimer)
      settleTimer = window.setTimeout(settle, SETTLE_DELAY_MS)
    }

    const handleScroll = () => {
      const y = window.scrollY

      // Déclenchement : un petit mouvement vers le bas lance toute la transition et le défilement jusqu'à l'About ;
      // le retour tout en haut lance la transition inverse
      if (target === 0 && y > TRIGGER_PX) {
        play(1)
        glideTo(getAboutTop())
      } else if (target === 1 && y < TRIGGER_PX) {
        play(0)
      }

      applyBanners()
      scheduleSettle()
    }

    const handleTouchStart = () => {
      isTouching = true
    }
    const handleTouchEnd = () => {
      isTouching = false
      scheduleSettle()
    }

    progress.set(target)
    applyLanding(target)
    applyBanners()

    const stopListening = scrollY.on('change', handleScroll)
    const stopProgress = progress.on('change', applyLanding)
    window.addEventListener('resize', applyBanners)
    window.addEventListener('touchstart', handleTouchStart, { passive: true })
    window.addEventListener('touchend', handleTouchEnd, { passive: true })
    window.addEventListener('touchcancel', handleTouchEnd, { passive: true })

    return () => {
      window.clearTimeout(settleTimer)
      playback?.stop()
      stopListening()
      stopProgress()
      window.removeEventListener('resize', applyBanners)
      window.removeEventListener('touchstart', handleTouchStart)
      window.removeEventListener('touchend', handleTouchEnd)
      window.removeEventListener('touchcancel', handleTouchEnd)
      progress.set(0)
      ;[landingFrame, ...banners.map(({ frame }) => frame)].forEach((frame) => {
        if (!frame) return
        frame.style.clipPath = ''
        frame.style.opacity = ''
      })
      ;[landingImage, ...banners.map(({ image }) => image)].forEach((image) => {
        if (image) image.style.transform = ''
      })
      if (landingIdentity) {
        landingIdentity.style.opacity = ''
        landingIdentity.inert = false
      }
      if (latestThings) {
        latestThings.style.opacity = ''
        latestThings.inert = false
      }
    }
  }, [isActive, reducedMotion, scrollY, progress])

  return progress
}
