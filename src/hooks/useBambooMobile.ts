// Version mobile et tablette (touch, < 1024 px) de l'accueil : Landing et About sont DEUX ÉTATS d'une même scène fixe.
//
// État « landing » : la landing est collée à l'écran (position: fixed) et la page ne défile pas. État « about » : la landing
// est une couche posée tout en haut de la page (position: absolute) qui défile avec elle, et l'About est là, en place.
// Au scroll 0 les deux positions se confondent : le passage de l'une à l'autre ne se voit pas.
//
// LA TRANSITION est DÉCLENCHÉE, jamais suivie (au doigt, une animation liée au scroll rampe et zigzague) :
//   - Landing → About : un geste vers le bas (doigt qui monte), la molette, une flèche du clavier ou « Learn more » ;
//   - About → Landing : un geste vers le haut ALORS QUE la page est tout en haut au début du geste (l'élan d'un scroll
//     qui arrive en haut ne déclenche donc rien).
// Pendant ses 600 ms le scroll est bloqué (html.is-transitioning) : rien ne défile, donc rien ne se chevauche et Safari iOS
// peut afficher l'animation. Elle est jouée par le navigateur (WAAPI, lib/morphPlayer) ; la progression 0 → 1, partagée avec
// la navbar (MorphNavbar), est jouée en parallèle par framer-motion pour les états (onglets inertes, etc.).
// GARDE : après chaque transition, plus rien n'est pris en compte pendant GUARD_MS, et un geste n'est valable que s'il a
// commencé APRÈS la fin de la transition (le doigt encore posé pendant l'élan ne rejoue rien).
//
// AUTRES BANNIÈRES (Recherche, Contact) : liées à leur position dans la page (E4b, pas encore déclenchées). La bannière de
// l'About est celle de la landing (une seule photo), elle n'a plus de logique propre.
// On n'anime que transform, opacity et clip-path. prefers-reduced-motion : fondu simple, ni zoom ni resserrement.
import { useCallback, useLayoutEffect, useRef } from 'react'
import { animate, useMotionValue, useScroll, type MotionValue } from 'framer-motion'
import { MORPH_DURATION_MS, morphEase, playMorph, registerMorphElement, stopMorph } from '../lib/morphPlayer'

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

type Scene = 'landing' | 'about'

// Zoom de la photo de la landing une fois la transition jouée (même amplitude que sur ordinateur)
const LANDING_ZOOM_EXTRA = 0.16

const BANNERS: BannerSpec[] = [
  { frame: '.papers__banner', image: '.papers__banner-image', zoom: 1.3, clipSide: 'bottom', clipRatio: 0.6, clipMaxPx: 120 },
  { frame: '.contact__photo-frame', image: '.contact__photo', zoom: 1.45, clipSide: 'top', clipRatio: 0.1, clipMaxPx: 70, isPhotoViewportHigh: true },
]

// Découpage de la transition, en fraction de la progression (0 = landing, 1 = About)
const IDENTITY_FADE_END = 0.25 // l'identité et « Latest things » ont disparu avant que le bouton ne les croise
const ABOUT_FADE_START = 0.6 // l'About apparaît en place sur la fin

// Mouvement réduit : fondu simple, sans ressort
const FADE_MS = 250
// Distance minimale (px) d'un geste vertical pour le prendre pour une demande de transition
const GESTURE_PX = 28
// Après une transition, tout est ignoré pendant ce délai (ms)
const GUARD_MS = 500
// Molette : un nouveau geste = au moins 150 ms sans aucun événement (sinon c'est l'élan du précédent)
const WHEEL_GAP_MS = 150
const WHEEL_MIN_DELTA = 6

// Netteté : la photo fait 2400 × 1600 px. Au-delà de 1,45 fois cette taille en pixels d'écran elle devient floue ;
// on réduit alors le zoom de la bannière (jusqu'à zéro sur un écran très dense) pour ne jamais dépasser ce seuil.
const PHOTO_NATURAL_WIDTH = 2400
const PHOTO_RATIO = 1.5
const PHOTO_MAX_UPSCALE = 1.45

// À l'arrivée, la photo part de ce zoom en moins et rejoint son zoom final
const ZOOM_ARRIVAL_EXTRA = 0.14
const ZOOM_LEAVING_EXTRA = 0.1

// Ce qui est caché (inerte) tant qu'on est sur la landing : l'About et tout ce qui est dessous
const BELOW_LANDING_SELECTOR = '.about, .papers, .contact, [data-morph-slot], footer'

const clamp01 = (value: number) => Math.min(1, Math.max(0, value))
const smooth = morphEase

export function useBambooMobile(
  isActive: boolean,
  reducedMotion: boolean,
): { progress: MotionValue<number>; goToAbout: () => void } {
  const { scrollY } = useScroll()
  // 0 = landing, 1 = About ; jouée dans le temps, jamais liée directement au scroll
  const progress = useMotionValue(0)
  // Demande de transition vers l'About, appelée par « Learn more » (HomePage) ; posée par l'effet ci-dessous
  const requestAbout = useRef<() => void>(() => {})
  const goToAbout = useCallback(() => requestAbout.current(), [])

  useLayoutEffect(() => {
    if (!isActive) return

    const root = document.documentElement

    const banners = BANNERS.map((spec) => ({
      spec,
      frame: document.querySelector<HTMLElement>(spec.frame),
      image: document.querySelector<HTMLElement>(spec.image),
    })).filter((banner): banner is typeof banner & { frame: HTMLElement; image: HTMLElement } =>
      Boolean(banner.frame && banner.image),
    )

    const landingFrame = document.querySelector<HTMLElement>('.landing-hero__photo')
    const landingImage = document.querySelector<HTMLElement>('.landing-hero__background')
    const landingIdentity = document.querySelector<HTMLElement>('.landing-hero__content')
    const latestThings = document.querySelector<HTMLElement>('.latest-things')
    const aboutSection = document.querySelector<HTMLElement>('.about')
    const aboutBanner = document.querySelector<HTMLElement>('.about__banner')
    let isLandingInert: boolean | null = null
    let isLatestInert: boolean | null = null

    // Hauteur dont la bannière de la landing se resserre : elle finit à la hauteur de la bannière de l'About
    let clipPx = 0
    const measure = () => {
      clipPx = Math.max(0, (landingFrame?.offsetHeight ?? 0) - (aboutBanner?.offsetHeight ?? 0))
    }

    // Les styles de chaque élément à une progression donnée : fonctions pures, lues à la fois par les styles en ligne
    // (applyLanding) et par les animations WAAPI (morphPlayer), pour que les deux affichent exactement la même chose.
    const identityOpacity = (value: number) => 1 - clamp01(value / IDENTITY_FADE_END)
    const aboutOpacity = (value: number) => clamp01((value - ABOUT_FADE_START) / (1 - ABOUT_FADE_START))
    const imageTransform = (value: number) => `scale(${1 + LANDING_ZOOM_EXTRA * value})`
    const frameClipPath = (value: number) => `inset(0 0 ${clipPx * clamp01(value)}px 0)`

    const applyLanding = (value: number) => {
      const amount = clamp01(value)

      if (landingIdentity) {
        landingIdentity.style.opacity = String(identityOpacity(amount))
        const shouldBeInert = amount > IDENTITY_FADE_END
        if (shouldBeInert !== isLandingInert) {
          landingIdentity.inert = shouldBeInert
          isLandingInert = shouldBeInert
        }
      }
      if (latestThings) {
        latestThings.style.opacity = String(identityOpacity(amount))
        const shouldBeInert = amount > IDENTITY_FADE_END
        if (shouldBeInert !== isLatestInert) {
          latestThings.inert = shouldBeInert
          isLatestInert = shouldBeInert
        }
      }
      if (aboutSection) aboutSection.style.opacity = String(aboutOpacity(amount))
      if (reducedMotion || !landingFrame || !landingImage) return

      landingImage.style.transform = imageTransform(value)
      landingFrame.style.clipPath = frameClipPath(amount)
    }

    // Inscription auprès du lecteur WAAPI (pas en mouvement réduit : simple fondu, voir `startTransition`)
    const unregisterPlayers: Array<() => void> = []
    if (!reducedMotion) {
      const register = (element: HTMLElement | null, sampler: Parameters<typeof registerMorphElement>[1]) => {
        if (element) unregisterPlayers.push(registerMorphElement(element, sampler))
      }
      register(landingIdentity, ({ progress: value }) => ({ opacity: identityOpacity(value) }))
      register(latestThings, ({ progress: value }) => ({ opacity: identityOpacity(value) }))
      register(aboutSection, ({ progress: value }) => ({ opacity: aboutOpacity(value) }))
      register(landingImage, ({ progress: value }) => ({ transform: imageTransform(value) }))
      register(landingFrame, ({ progress: value }) => ({ clipPath: frameClipPath(value) }))
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

        const clipPxOfBanner = Math.min(spec.clipMaxPx, rect.height * spec.clipRatio) * (1 - arrival)
        frame.style.clipPath = spec.clipSide === 'top' ? `inset(${clipPxOfBanner}px 0 0 0)` : `inset(0 0 ${clipPxOfBanner}px 0)`
      })
    }

    // ---------- L'ÉTAT ET LA TRANSITION ----------
    // Démarrage : un lien direct (#about, #contact-form…) ou une page déjà défilée commence sur l'About, sans animation
    const hash = window.location.hash
    let scene: Scene = (hash && hash !== '#home') || window.scrollY > 4 ? 'about' : 'landing'
    let isPlaying = false
    let lastEndedAt = -Infinity
    let finishTimer: number | undefined
    let playback: ReturnType<typeof animate> | undefined

    // Sur la landing, l'About et tout ce qui suit sont inertes (ni tabulation, ni lecteur d'écran)
    const setBelowInert = (isInert: boolean) => {
      document.querySelectorAll<HTMLElement>(BELOW_LANDING_SELECTOR).forEach((element) => {
        element.inert = isInert
      })
    }

    const setScene = (next: Scene) => {
      scene = next
      root.dataset.scene = next
    }

    // Bascule sans animation (démarrage, retour de navigation avec un scroll restauré)
    const commit = (next: Scene) => {
      setScene(next)
      progress.set(next === 'about' ? 1 : 0)
      applyLanding(next === 'about' ? 1 : 0)
      setBelowInert(next === 'landing')
    }

    const finish = () => {
      stopMorph()
      progress.set(scene === 'about' ? 1 : 0)
      applyLanding(scene === 'about' ? 1 : 0)
      root.classList.remove('is-transitioning')
      setBelowInert(scene === 'landing')
      isPlaying = false
      lastEndedAt = performance.now()
    }

    const startTransition = (next: Scene) => {
      isPlaying = true
      measure()
      root.classList.add('is-transitioning')
      setScene(next)
      setBelowInert(false)

      const to = next === 'about' ? 1 : 0
      const from = 1 - to
      playback?.stop()
      progress.set(from)
      if (reducedMotion) {
        playback = animate(progress, to, { duration: FADE_MS / 1000, ease: 'linear' })
      } else {
        // La progression (états, onglets inertes…) reste jouée par framer-motion, sur la même courbe et la même durée que
        // les animations WAAPI, qui sont, elles, ce que l'écran affiche pendant la transition
        playback = animate(progress, to, { duration: MORPH_DURATION_MS / 1000, ease: morphEase })
        playMorph(from, to)
      }
      window.clearTimeout(finishTimer)
      finishTimer = window.setTimeout(finish, (reducedMotion ? FADE_MS : MORPH_DURATION_MS) + 30)
    }

    const isGuarded = () => performance.now() - lastEndedAt < GUARD_MS

    // Demande de transition vers `next` ; refusée pendant une transition, pendant la garde ou si on y est déjà
    const request = (next: Scene, shouldIgnoreGuard = false) => {
      if (isPlaying || next === scene) return
      if (!shouldIgnoreGuard && isGuarded()) return
      startTransition(next)
    }
    requestAbout.current = () => request('about')

    // ---------- LES GESTES ----------
    type Touch = { x: number; y: number; isIgnored: boolean; isAtTop: boolean; axis: 'x' | 'y' | null }
    let touch: Touch | null = null

    const handleTouchStart = (event: TouchEvent) => {
      const point = event.touches[0]
      touch = {
        x: point.clientX,
        y: point.clientY,
        // Un doigt posé pendant une transition ou pendant la garde ne déclenche jamais rien, même s'il bouge longtemps
        isIgnored: isPlaying || isGuarded(),
        isAtTop: window.scrollY <= 1,
        axis: null,
      }
    }

    const handleTouchMove = (event: TouchEvent) => {
      // Pendant la transition, rien ne défile
      if (isPlaying) {
        if (event.cancelable) event.preventDefault()
        return
      }
      const point = event.touches[0]
      if (!touch || !point) return

      const deltaX = point.clientX - touch.x
      const deltaY = point.clientY - touch.y
      // Le sens du geste est décidé une fois pour toutes dès qu'il a un peu bougé : un glissement horizontal (carrousel
      // « Latest things ») n'est jamais touché
      if (touch.axis === null) {
        if (Math.hypot(deltaX, deltaY) < 8) return
        touch.axis = Math.abs(deltaY) > Math.abs(deltaX) ? 'y' : 'x'
      }
      if (touch.axis !== 'y') return

      if (scene === 'landing') {
        // Sur la landing la page ne défile pas : on empêche aussi l'effet de rebond de Safari
        if (event.cancelable) event.preventDefault()
        if (!touch.isIgnored && deltaY <= -GESTURE_PX) request('about')
      } else if (touch.isAtTop && window.scrollY <= 1 && deltaY > 0) {
        // Tout en haut de l'About, doigt qui descend : retour à la landing (et pas de rebond de Safari)
        if (event.cancelable) event.preventDefault()
        if (!touch.isIgnored && deltaY >= GESTURE_PX) request('landing')
      }
    }

    const handleTouchEnd = () => {
      touch = null
    }

    let lastWheelAt = -Infinity
    let lastScrollAt = -Infinity
    const handleWheel = (event: WheelEvent) => {
      const now = performance.now()
      const isNewGesture = now - lastWheelAt > WHEEL_GAP_MS
      lastWheelAt = now
      if (isPlaying) {
        if (event.cancelable) event.preventDefault()
        return
      }

      if (scene === 'landing') {
        if (event.cancelable) event.preventDefault()
        if (isNewGesture && !isGuarded() && event.deltaY > WHEEL_MIN_DELTA) request('about')
      } else if (window.scrollY <= 1 && event.deltaY < 0 && now - lastScrollAt > WHEEL_GAP_MS) {
        if (event.cancelable) event.preventDefault()
        if (isNewGesture && !isGuarded() && event.deltaY < -WHEEL_MIN_DELTA) request('landing')
      }
    }

    // Clavier : flèche bas, Page bas ou Espace (hors bouton, lien, champ) sur la landing = aller à l'About
    const handleKeyDown = (event: KeyboardEvent) => {
      if (scene !== 'landing') return
      const target = event.target as HTMLElement | null
      const isField = Boolean(target?.closest('a, button, input, textarea, select, [contenteditable="true"]'))
      const isDown = event.key === 'ArrowDown' || event.key === 'PageDown' || (event.key === ' ' && !isField)
      if (!isDown) return
      event.preventDefault()
      request('about')
    }

    // « Accueil » de la navbar : on remonte tout en haut, puis la transition joue à l'envers
    const handleGoLanding = () => {
      if (scene !== 'about') return
      window.scrollTo({ top: 0, behavior: 'instant' })
      request('landing', true)
    }

    const handleScroll = () => {
      lastScrollAt = performance.now()
      // Scroll restauré par le navigateur après coup (retour de navigation) : on est donc sur l'About
      if (scene === 'landing' && !isPlaying && window.scrollY > 4) commit('about')
      applyBanners()
    }

    const handleResize = () => {
      measure()
      applyLanding(progress.get())
      applyBanners()
    }

    measure()
    commit(scene)
    applyBanners()

    const stopListening = scrollY.on('change', handleScroll)
    const stopProgress = progress.on('change', applyLanding)
    window.addEventListener('resize', handleResize)
    window.addEventListener('touchstart', handleTouchStart, { passive: true })
    window.addEventListener('touchmove', handleTouchMove, { passive: false })
    window.addEventListener('touchend', handleTouchEnd, { passive: true })
    window.addEventListener('touchcancel', handleTouchEnd, { passive: true })
    window.addEventListener('wheel', handleWheel, { passive: false })
    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('scene:go-landing', handleGoLanding)

    return () => {
      window.clearTimeout(finishTimer)
      playback?.stop()
      stopMorph()
      unregisterPlayers.forEach((unregister) => unregister())
      requestAbout.current = () => {}
      stopListening()
      stopProgress()
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('touchstart', handleTouchStart)
      window.removeEventListener('touchmove', handleTouchMove)
      window.removeEventListener('touchend', handleTouchEnd)
      window.removeEventListener('touchcancel', handleTouchEnd)
      window.removeEventListener('wheel', handleWheel)
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('scene:go-landing', handleGoLanding)
      root.classList.remove('is-transitioning')
      delete root.dataset.scene
      setBelowInert(false)
      progress.set(0)
      ;[landingFrame, ...banners.map(({ frame }) => frame)].forEach((frame) => {
        if (!frame) return
        frame.style.clipPath = ''
        frame.style.opacity = ''
      })
      ;[landingImage, ...banners.map(({ image }) => image)].forEach((image) => {
        if (image) image.style.transform = ''
      })
      if (aboutSection) aboutSection.style.opacity = ''
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

  return { progress, goToAbout }
}
