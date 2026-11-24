// Version mobile et tablette (touch, < 1024 px) de l'accueil : QUATRE ÉCRANS, quatre états d'une même scène fixe
// (« portes ») : Landing → About → Recherche → Contact.
//
// Un seul écran est affiché à la fois (les autres sont retirés de la page : classe scene-hidden), et il défile normalement
// s'il est plus haut que la fenêtre. La landing, elle, ne défile pas : elle est collée à l'écran (position: fixed) ; à l'état
// « about » c'est une couche posée tout en haut de la page, qui défile avec elle (au scroll 0 les deux positions se confondent).
//
// LA TRANSITION est DÉCLENCHÉE, jamais suivie (au doigt, une animation liée au scroll rampe et zigzague) :
//   - vers l'écran suivant : un geste vers le bas (doigt qui monte) ou la molette ALORS QUE la page est tout en bas au début
//     du geste ; une flèche du clavier ; « Learn more » sur la landing ; un onglet de la navbar ;
//   - vers l'écran précédent : un geste vers le haut ALORS QUE la page est tout en haut au début du geste (l'élan d'un
//     scroll qui arrive en haut ou en bas ne déclenche donc rien).
// Pendant ses 600 ms le scroll est bloqué (html.is-transitioning) : rien ne défile, donc rien ne se chevauche et Safari iOS
// peut afficher l'animation. Elle est jouée par le navigateur (WAAPI), pas par du JavaScript image par image.
//   - Landing ↔ About : animation de la landing (lib/morphPlayer) ; la progression 0 → 1, partagée avec la navbar
//     (MorphNavbar), est jouée en parallèle par framer-motion pour les états (onglets inertes, etc.).
//   - About ↔ Recherche ↔ Contact : fondu enchaîné. L'écran qui part est posé en couche fixe (position: fixed, à l'endroit
//     exact où il était à l'écran) et s'efface ; l'écran d'arrivée est déjà à sa place dans la page (scroll 0 en avant, tout
//     en bas en arrière) et apparaît, sa bannière se resserre et son cadre s'ouvre. Le Contact déclenche aussi le voyage de la
//     navbar vers le bas de la page (`contactProgress`, lu par MorphNavbar).
// GARDE : après chaque transition, plus rien n'est pris en compte pendant GUARD_MS, et un geste n'est valable que s'il a
// commencé APRÈS la fin de la transition (le doigt encore posé pendant l'élan ne rejoue rien).
//
// On n'anime que transform, opacity et clip-path. prefers-reduced-motion : fondu simple, ni zoom ni resserrement.
import { useCallback, useLayoutEffect, useRef } from 'react'
import { animate, useMotionValue, useScroll, type MotionValue } from 'framer-motion'
import { MORPH_DURATION_MS, morphEase, playMorph, registerMorphElement, stopMorph } from '../lib/morphPlayer'

type Scene = 'landing' | 'about' | 'research' | 'contact'

// L'ordre des portes : on passe de l'une à la suivante ou à la précédente
const SCENES: Scene[] = ['landing', 'about', 'research', 'contact']

// Identifiants de section (navbar, liens #…) → écran
const SCENE_BY_ID: Record<string, Scene> = {
  home: 'landing',
  about: 'about',
  research: 'research',
  'contact-form': 'contact',
  contact: 'contact',
}

type BannerSpec = {
  // Le cadre (clip-path) et la photo qu'il contient (zoom)
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

// Une bannière avec ses mesures (netteté de la photo, rognage maximal du cadre)
type Banner = {
  spec: BannerSpec
  frame: HTMLElement
  image: HTMLElement
  clipPx: number
  sharpness: number
}

const BANNER_SPECS: Partial<Record<Scene, BannerSpec>> = {
  research: { frame: '.papers__banner', image: '.papers__banner-image', zoom: 1.3, clipSide: 'bottom', clipRatio: 0.6, clipMaxPx: 120 },
  contact: { frame: '.contact__photo-frame', image: '.contact__photo', zoom: 1.45, clipSide: 'top', clipRatio: 0.1, clipMaxPx: 70, isPhotoViewportHigh: true },
}

// Zoom de la photo de la landing une fois la transition jouée (même amplitude que sur ordinateur)
const LANDING_ZOOM_EXTRA = 0.16

// Découpage de la transition Landing ↔ About, en fraction de la progression (0 = landing, 1 = About)
const IDENTITY_FADE_END = 0.25 // l'identité et « Latest things » ont disparu avant que le bouton ne les croise
const ABOUT_FADE_START = 0.6 // l'About apparaît en place sur la fin

// Fondu enchaîné About ↔ Recherche ↔ Contact : l'écran qui part a disparu à 70 %, celui qui arrive apparaît dès 25 %
const LEAVING_FADE_END = 0.7
const ARRIVING_FADE_START = 0.25
const SAMPLE_COUNT = 24

// Mouvement réduit : fondu simple, sans ressort
const FADE_MS = 250
// Distance minimale (px) d'un geste vertical pour le prendre pour une demande de transition
const GESTURE_PX = 28
// Après une transition, tout est ignoré pendant ce délai (ms)
const GUARD_MS = 500
// Molette : un nouveau geste = au moins 150 ms sans aucun événement (sinon c'est l'élan du précédent)
const WHEEL_GAP_MS = 150
const WHEEL_MIN_DELTA = 6
// « Tout en bas » / « tout en haut » de la page, à quelques pixels près (barre d'adresse Safari, arrondis)
const EDGE_PX = 4

// Netteté : la photo fait 2400 × 1600 px. Au-delà de 1,45 fois cette taille en pixels d'écran elle devient floue ;
// on réduit alors le zoom de la bannière (jusqu'à zéro sur un écran très dense) pour ne jamais dépasser ce seuil.
const PHOTO_NATURAL_WIDTH = 2400
const PHOTO_RATIO = 1.5
const PHOTO_MAX_UPSCALE = 1.45

// À l'arrivée, la photo part de ce zoom en moins et rejoint son zoom final
const ZOOM_ARRIVAL_EXTRA = 0.14

// Ce qui est caché (inerte) tant qu'on est sur la landing : l'About et tout ce qui est dessous
const BELOW_LANDING_SELECTOR = '.about, .papers, .contact, [data-morph-slot], footer'

const clamp01 = (value: number) => Math.min(1, Math.max(0, value))

export function useBambooMobile(
  isActive: boolean,
  reducedMotion: boolean,
): { progress: MotionValue<number>; contactProgress: MotionValue<number>; goToAbout: () => void } {
  const { scrollY } = useScroll()
  // 0 = landing, 1 = About (et au-delà) ; jouée dans le temps, jamais liée directement au scroll
  const progress = useMotionValue(0)
  // 0 = navbar en haut, 1 = navbar posée en bas du Contact ; jouée dans le temps avec la transition vers le Contact
  const contactProgress = useMotionValue(0)
  // Demande de transition vers l'About, appelée par « Learn more » (HomePage) ; posée par l'effet ci-dessous
  const requestAbout = useRef<() => void>(() => {})
  const goToAbout = useCallback(() => requestAbout.current(), [])

  useLayoutEffect(() => {
    if (!isActive) return

    const root = document.documentElement
    const find = (selector: string) => document.querySelector<HTMLElement>(selector)

    // ---------- LES ÉCRANS ----------
    const landingFrame = find('.landing-hero__photo')
    const landingImage = find('.landing-hero__background')
    const landingIdentity = find('.landing-hero__content')
    const latestThings = find('.latest-things')
    const aboutSection = find('.about')
    const aboutBanner = find('.about__banner')

    // Ce que chaque écran affiche (la landing et l'About vont ensemble : l'About est posée sur la photo de la landing)
    const compact = (elements: Array<HTMLElement | null>) => elements.filter((element): element is HTMLElement => Boolean(element))
    const screens: Record<Scene, HTMLElement[]> = {
      landing: compact([find('.landing'), aboutSection]),
      about: compact([find('.landing'), aboutSection]),
      research: compact([find('.papers')]),
      contact: compact([find('.contact')]),
    }
    // Ce qui ne vit qu'avec le Contact : l'emplacement de la navbar et le pied de page
    const contactExtras = compact([find('.contact__nav'), find('footer.site-footer')])
    const allElements = Array.from(new Set([...Object.values(screens).flat(), ...contactExtras]))

    // Affiche l'écran courant (et, pendant une transition, l'écran qui part) ; tout le reste est retiré de la page
    const applyVisibility = (current: Scene, leaving?: Scene) => {
      const visible = new Set<HTMLElement>(screens[current])
      if (current === 'contact') contactExtras.forEach((element) => visible.add(element))
      if (leaving) screens[leaving].forEach((element) => visible.add(element))
      allElements.forEach((element) => element.classList.toggle('scene-hidden', !visible.has(element)))
    }

    // ---------- LANDING ↔ ABOUT ----------
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

    let isLandingInert: boolean | null = null
    let isLatestInert: boolean | null = null

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

    // ---------- LES BANNIÈRES (Recherche, Contact) ----------
    const banners: Partial<Record<Scene, Banner>> = {}
    ;(Object.keys(BANNER_SPECS) as Scene[]).forEach((name) => {
      const spec = BANNER_SPECS[name]
      const frame = spec ? find(spec.frame) : null
      const image = spec ? find(spec.image) : null
      if (spec && frame && image) banners[name] = { spec, frame, image, clipPx: 0, sharpness: 1 }
    })

    // Mesures qui ne changent qu'avec la taille de la fenêtre : rognage maximal du cadre et netteté de la photo.
    // À prendre quand la bannière est affichée (retirée de la page, elle n'a pas de taille).
    const measureBanner = (banner: Banner) => {
      const rect = banner.frame.getBoundingClientRect()
      if (rect.width === 0) return
      // Largeur réellement affichée de la photo (object-fit: cover : elle remplit la largeur ou la hauteur du cadre)
      const photoHeight = banner.spec.isPhotoViewportHigh ? window.innerHeight : rect.height
      const shownWidth = Math.max(rect.width, photoHeight * PHOTO_RATIO) * (window.devicePixelRatio || 1)
      const allowedZoom = (PHOTO_MAX_UPSCALE * PHOTO_NATURAL_WIDTH) / shownWidth
      banner.sharpness = clamp01((allowedZoom - 1) / (banner.spec.zoom - 1))
      banner.clipPx = Math.min(banner.spec.clipMaxPx, rect.height * banner.spec.clipRatio)
    }

    // Styles d'une bannière à une progression donnée (0 = à l'arrivée, 1 = en place) : fonctions pures
    const bannerTransform = (banner: Banner, value: number) => {
      const zoom = banner.spec.zoom - (1 - value) * ZOOM_ARRIVAL_EXTRA

      return `scale(${1 + (zoom - 1) * banner.sharpness})`
    }
    const bannerClipPath = (banner: Banner, value: number) => {
      const clip = banner.clipPx * (1 - value)

      return banner.spec.clipSide === 'top' ? `inset(${clip}px 0 0 0)` : `inset(0 0 ${clip}px 0)`
    }

    // Les bannières au repos : en place (zoom final, cadre ouvert)
    const restBanners = () => {
      Object.values(banners).forEach((banner) => {
        measureBanner(banner)
        if (reducedMotion) return
        banner.image.style.transform = bannerTransform(banner, 1)
        banner.frame.style.clipPath = bannerClipPath(banner, 1)
      })
    }

    // ---------- L'ÉTAT ET LES TRANSITIONS ----------
    // Démarrage : un lien direct (#about, #research, #contact-form…) ou une page déjà défilée commence sur l'écran
    // demandé, sans animation
    const hash = window.location.hash
    const startScene: Scene =
      hash && hash !== '#home' ? (SCENE_BY_ID[hash.slice(1)] ?? 'about') : window.scrollY > 4 ? 'about' : 'landing'
    let scene: Scene = startScene
    let isPlaying = false
    let lastEndedAt = -Infinity
    let finishTimer: number | undefined
    let playback: ReturnType<typeof animate> | undefined
    let contactPlayback: ReturnType<typeof animate> | undefined
    // Transition About / Recherche / Contact en cours : écran qui part et animations à retirer à la fin
    let leavingScene: Scene | null = null
    let sectionAnimations: Animation[] = []

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

    // La navbar remesure les positions de la page (emplacement sous le Contact, etc.) quand l'écran affiché change
    const announceLayout = () => window.dispatchEvent(new Event('scene:measure'))

    // Voyage de la navbar vers le bas du Contact (ou retour en haut), joué dans le temps comme les transitions
    const playContact = (to: 0 | 1) => {
      const from = contactProgress.get()
      contactPlayback?.stop()
      contactPlayback = animate(contactProgress, to, {
        duration: (reducedMotion ? FADE_MS : MORPH_DURATION_MS) / 1000,
        ease: 'linear',
      })
      if (!reducedMotion) playMorph(from, to, 'contact')
    }

    // Bascule sans animation (démarrage, lien direct, retour de navigation avec un scroll restauré)
    const commit = (next: Scene) => {
      setScene(next)
      applyVisibility(next)
      progress.set(next === 'landing' ? 0 : 1)
      applyLanding(next === 'landing' ? 0 : 1)
      contactPlayback?.stop()
      stopMorph('contact')
      contactProgress.set(next === 'contact' ? 1 : 0)
      setBelowInert(next === 'landing')
      restBanners()
      announceLayout()
    }

    // Destination lointaine passant par la landing : la transition suivante démarre à la fin de la précédente
    let pendingTarget: Scene | null = null
    const runPending = () => {
      const target = pendingTarget
      pendingTarget = null
      if (!target || target === scene) return
      window.setTimeout(() => {
        if (isPlaying) return
        if (scene === 'about' && target === 'landing') window.scrollTo({ top: 0, behavior: 'instant' })
        request(target, true)
      }, 0)
    }

    // Fin de la transition Landing ↔ About
    const finish = () => {
      stopMorph()
      progress.set(scene === 'about' ? 1 : 0)
      applyLanding(scene === 'about' ? 1 : 0)
      root.classList.remove('is-transitioning')
      setBelowInert(scene === 'landing')
      isPlaying = false
      lastEndedAt = performance.now()
      runPending()
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

    // Joue un style (fonction de la progression 0 → 1) sur un élément : images clés confiées au navigateur
    const playSampled = (element: HTMLElement, frameAt: (value: number) => Keyframe) => {
      if (typeof element.animate !== 'function') return
      const keyframes: Keyframe[] = []
      for (let index = 0; index <= SAMPLE_COUNT; index += 1) {
        const time = index / SAMPLE_COUNT
        keyframes.push({ ...frameAt(reducedMotion ? time : morphEase(time)), offset: time })
      }
      // fill: both : le premier état est affiché dès le lancement et le dernier jusqu'à ce qu'on retire l'animation
      sectionAnimations.push(
        element.animate(keyframes, { duration: reducedMotion ? FADE_MS : MORPH_DURATION_MS, easing: 'linear', fill: 'both' }),
      )
    }

    const finishSection = () => {
      const previous = leavingScene
      leavingScene = null
      sectionAnimations.forEach((animation) => animation.cancel())
      sectionAnimations = []
      // Dans le même passage : l'écran qui partait quitte la page, aucun clignotement
      if (previous) {
        screens[previous].forEach((element) => {
          element.classList.remove('is-leaving')
          element.style.top = ''
        })
      }
      applyVisibility(scene)
      root.classList.remove('is-transitioning')
      isPlaying = false
      lastEndedAt = performance.now()
      announceLayout()
      runPending()
    }

    // About ↔ Recherche ↔ Contact. L'écran d'arrivée est déjà à sa place dans la page ; l'écran qui part est une couche
    // fixe, posée exactement où il était, qui s'efface par-dessus.
    const startSectionTransition = (next: Scene) => {
      const previous = scene
      const isForward = SCENES.indexOf(next) > SCENES.indexOf(previous)
      const startScroll = window.scrollY
      isPlaying = true
      leavingScene = previous

      // top négatif = le scroll qu'avait l'écran : il ne bouge pas d'un pixel à l'écran
      screens[previous].forEach((element) => {
        element.classList.add('is-leaving')
        element.style.top = `${-startScroll}px`
      })
      setScene(next)
      applyVisibility(next, previous)
      setBelowInert(false)

      // La page d'arrivée se lit depuis le haut en avant, depuis le bas en arrière ; on le fixe avant de bloquer le scroll
      const maxScroll = Math.max(0, root.scrollHeight - window.innerHeight)
      window.scrollTo({ top: isForward ? 0 : maxScroll, behavior: 'instant' })
      root.classList.add('is-transitioning')

      // Le Contact change l'emplacement de la navbar : on remesure avant de la faire voyager
      const arrivingBanner = banners[next]
      if (arrivingBanner) measureBanner(arrivingBanner)
      if (next === 'contact') announceLayout()

      screens[previous].forEach((element) => playSampled(element, (value) => ({ opacity: 1 - clamp01(value / LEAVING_FADE_END) })))
      screens[next].forEach((element) =>
        playSampled(element, (value) => ({ opacity: clamp01((value - ARRIVING_FADE_START) / (1 - ARRIVING_FADE_START)) })),
      )
      if (arrivingBanner && !reducedMotion) {
        arrivingBanner.image.style.transform = bannerTransform(arrivingBanner, 1)
        arrivingBanner.frame.style.clipPath = bannerClipPath(arrivingBanner, 1)
        playSampled(arrivingBanner.frame, (value) => ({ clipPath: bannerClipPath(arrivingBanner, value) }))
        playSampled(arrivingBanner.image, (value) => ({ transform: bannerTransform(arrivingBanner, value) }))
      }
      if (next === 'contact') playContact(1)
      if (previous === 'contact') playContact(0)

      window.clearTimeout(finishTimer)
      finishTimer = window.setTimeout(finishSection, (reducedMotion ? FADE_MS : MORPH_DURATION_MS) + 30)
    }

    const isGuarded = () => performance.now() - lastEndedAt < GUARD_MS
    const indexOfScene = (value: Scene) => SCENES.indexOf(value)
    const previousScene = (): Scene | null => SCENES[indexOfScene(scene) - 1] ?? null
    const nextScene = (): Scene | null => SCENES[indexOfScene(scene) + 1] ?? null

    // Demande de transition vers l'écran voisin `next` ; refusée pendant une transition, pendant la garde ou si on y est déjà
    const request = (next: Scene, shouldIgnoreGuard = false) => {
      if (isPlaying || next === scene) return
      if (!shouldIgnoreGuard && isGuarded()) return
      if (next === 'landing' || scene === 'landing') startTransition(next)
      else startSectionTransition(next)
    }
    requestAbout.current = () => request('about', true)

    // Aller à un écran, toujours par une transition : directe entre About, Recherche et Contact (même à distance) ; en
    // deux temps quand la landing est de la partie (Landing → About, puis About → destination)
    const goTo = (target: Scene) => {
      if (isPlaying || target === scene) return
      if (scene === 'about' && target === 'landing') window.scrollTo({ top: 0, behavior: 'instant' })
      const isViaAbout = (scene === 'landing' && target !== 'about') || (target === 'landing' && scene !== 'about')
      if (isViaAbout) pendingTarget = target
      request(isViaAbout ? 'about' : target, true)
    }

    // ---------- LES GESTES ----------
    const getMaxScroll = () => Math.max(0, root.scrollHeight - window.innerHeight)
    const isAtTop = () => window.scrollY <= EDGE_PX
    const isAtBottom = () => window.scrollY >= getMaxScroll() - EDGE_PX

    type Touch = { x: number; y: number; isIgnored: boolean; isAtTop: boolean; isAtBottom: boolean; axis: 'x' | 'y' | null }
    let touch: Touch | null = null

    const handleTouchStart = (event: TouchEvent) => {
      const point = event.touches[0]
      touch = {
        x: point.clientX,
        y: point.clientY,
        // Un doigt posé pendant une transition ou pendant la garde ne déclenche jamais rien, même s'il bouge longtemps
        isIgnored: isPlaying || isGuarded(),
        isAtTop: isAtTop(),
        isAtBottom: isAtBottom(),
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
        return
      }

      const previous = previousScene()
      const next = nextScene()
      if (touch.isAtTop && isAtTop() && deltaY > 0 && previous) {
        // Tout en haut de l'écran, doigt qui descend : écran précédent (et pas de rebond de Safari)
        if (event.cancelable) event.preventDefault()
        if (!touch.isIgnored && deltaY >= GESTURE_PX) request(previous)
      } else if (touch.isAtBottom && isAtBottom() && deltaY < 0 && next) {
        // Tout en bas de l'écran, doigt qui monte : écran suivant
        if (event.cancelable) event.preventDefault()
        if (!touch.isIgnored && deltaY <= -GESTURE_PX) request(next)
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
        return
      }

      // Au bord de l'écran, hors de l'élan d'un scroll qui vient d'y arriver
      const isSettled = now - lastScrollAt > WHEEL_GAP_MS
      const previous = previousScene()
      const next = nextScene()
      if (isAtTop() && event.deltaY < 0 && previous && isSettled) {
        if (event.cancelable) event.preventDefault()
        if (isNewGesture && !isGuarded() && event.deltaY < -WHEEL_MIN_DELTA) request(previous)
      } else if (isAtBottom() && event.deltaY > 0 && next && isSettled) {
        if (event.cancelable) event.preventDefault()
        if (isNewGesture && !isGuarded() && event.deltaY > WHEEL_MIN_DELTA) request(next)
      }
    }

    // Clavier : flèche bas, Page bas ou Espace (hors bouton, lien, champ) = écran suivant sur la landing et en bas d'un
    // écran ; flèche haut ou Page haut en haut d'un écran = écran précédent
    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null
      const isField = Boolean(target?.closest('a, button, input, textarea, select, [contenteditable="true"]'))
      const isDown = event.key === 'ArrowDown' || event.key === 'PageDown' || (event.key === ' ' && !isField)
      const isUp = event.key === 'ArrowUp' || event.key === 'PageUp'
      if (isPlaying) return
      if (isDown && (scene === 'landing' || isAtBottom()) && nextScene()) {
        event.preventDefault()
        request(nextScene() as Scene)
      } else if (isUp && scene !== 'landing' && isAtTop() && previousScene() && !isField) {
        event.preventDefault()
        request(previousScene() as Scene)
      }
    }

    // Navbar ou bouton : aller à un écran (événement `scene:go`, l'identifiant de la section en détail)
    const handleGo = (event: Event) => {
      const target = SCENE_BY_ID[String((event as CustomEvent<string>).detail)]
      if (target) goTo(target)
    }

    const handleScroll = () => {
      lastScrollAt = performance.now()
      // Scroll restauré par le navigateur après coup (retour de navigation) : on est donc sur l'About
      if (scene === 'landing' && !isPlaying && window.scrollY > 4) commit('about')
    }

    const handleResize = () => {
      measure()
      applyLanding(progress.get())
      restBanners()
    }

    measure()
    commit(scene)

    const stopListening = scrollY.on('change', handleScroll)
    const stopProgress = progress.on('change', applyLanding)
    window.addEventListener('resize', handleResize)
    window.addEventListener('touchstart', handleTouchStart, { passive: true })
    window.addEventListener('touchmove', handleTouchMove, { passive: false })
    window.addEventListener('touchend', handleTouchEnd, { passive: true })
    window.addEventListener('touchcancel', handleTouchEnd, { passive: true })
    window.addEventListener('wheel', handleWheel, { passive: false })
    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('scene:go', handleGo)

    return () => {
      window.clearTimeout(finishTimer)
      playback?.stop()
      contactPlayback?.stop()
      stopMorph()
      stopMorph('contact')
      sectionAnimations.forEach((animation) => animation.cancel())
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
      window.removeEventListener('scene:go', handleGo)
      root.classList.remove('is-transitioning')
      delete root.dataset.scene
      setBelowInert(false)
      progress.set(0)
      contactProgress.set(0)
      allElements.forEach((element) => {
        element.classList.remove('scene-hidden', 'is-leaving')
        element.style.top = ''
      })
      ;[landingFrame, ...Object.values(banners).map(({ frame }) => frame)].forEach((frame) => {
        if (frame) frame.style.clipPath = ''
      })
      ;[landingImage, ...Object.values(banners).map(({ image }) => image)].forEach((image) => {
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
  }, [isActive, reducedMotion, scrollY, progress, contactProgress])

  return { progress, contactProgress, goToAbout }
}
