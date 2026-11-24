// Lecteur des transitions en version tactile (iPhone, iPad).
//
// Pourquoi : sur Safari iOS, une animation écrite en JavaScript (valeurs posées à chaque image) n'est pas affichée
// pendant l'élan du doigt. Une animation WAAPI (`element.animate`) est confiée au navigateur, qui la joue lui-même, à
// son rythme : elle ne dépend plus de notre JavaScript une fois lancée.
//
// Fonctionnement : chaque élément animé s'inscrit avec une fonction qui dit « à la progression p (0 = départ,
// 1 = arrivée), voici mon style ». Au lancement, on échantillonne cette fonction (SAMPLE_COUNT images clés) et on confie le
// tout au navigateur. La même fonction sert aux animations framer-motion de l'ordinateur : une seule source de vérité.
//
// Deux canaux : « main » = Landing ↔ About (courbe douce), « contact » = voyage de la navbar vers le bas du Contact
// (temps linéaire : les formules de la navbar appliquent déjà leur propre courbe). Les bandeaux (Recherche, Contact)
// sont joués un par un avec `playTimed`.
export type MorphFrame = Record<string, string | number>

// Ce que reçoit un élément à chaque échantillon : la progression, le temps écoulé (0 → 1) et le sens du voyage
export type MorphSample = {
  progress: number
  time: number
  to: 0 | 1
}

type Sampler = (sample: MorphSample) => MorphFrame
export type MorphChannel = 'main' | 'contact'

const SAMPLE_COUNT = 24
export const MORPH_DURATION_MS = 600

// Départ et arrivée en douceur : la même courbe pilote framer-motion (progression) et les images clés
export const morphEase = (amount: number) => amount * amount * (3 - 2 * amount)

const channelEase: Record<MorphChannel, (amount: number) => number> = {
  main: morphEase,
  contact: (amount) => amount,
}
const players: Record<MorphChannel, Map<HTMLElement, Sampler>> = { main: new Map(), contact: new Map() }
const running: Record<MorphChannel, Animation[]> = { main: [], contact: [] }

const canAnimate = () => typeof Element !== 'undefined' && typeof Element.prototype.animate === 'function'

// Inscrit un élément ; renvoie la fonction qui le retire
export function registerMorphElement(element: HTMLElement, sampler: Sampler, channel: MorphChannel = 'main') {
  players[channel].set(element, sampler)

  return () => {
    players[channel].delete(element)
  }
}

// Arrête les animations en cours d'un canal. Les styles posés par framer-motion sont alors visibles : ils valent, à ce
// moment, exactement ce que l'animation vient d'afficher (même courbe, même durée).
export function stopMorph(channel: MorphChannel = 'main') {
  running[channel].forEach((animation) => animation.cancel())
  running[channel] = []
}

// Échantillonne un style (fonction de la progression) en images clés
function buildKeyframes(sampler: Sampler, from: number, to: 0 | 1, ease: (amount: number) => number) {
  const keyframes: Keyframe[] = []
  for (let index = 0; index <= SAMPLE_COUNT; index += 1) {
    const time = index / SAMPLE_COUNT
    const progress = from + (to - from) * ease(time)
    keyframes.push({ ...sampler({ progress, time, to }), offset: time })
  }

  return keyframes
}

// Joue la transition de `from` vers `to` sur un canal
export function playMorph(from: number, to: 0 | 1, channel: MorphChannel = 'main') {
  stopMorph(channel)
  if (!canAnimate()) return

  players[channel].forEach((sampler, element) => {
    const keyframes = buildKeyframes(sampler, from, to, channelEase[channel])
    const animation = element.animate(keyframes, { duration: MORPH_DURATION_MS, easing: 'linear', fill: 'forwards' })
    // Une fois jouée, on retire l'animation : le style en ligne (déjà identique) prend le relais sans saut
    animation.onfinish = () => animation.cancel()
    running[channel].push(animation)
  })
}

// Joue UN élément de `from` à `to` (bandeaux). L'appelant pose d'abord le style final en ligne : l'animation
// ne fait que le montrer en mouvement, puis se retire. Renvoie l'animation (à annuler si on rejoue avant la fin).
export function playTimed(
  element: HTMLElement,
  sampler: Sampler,
  from: number,
  to: 0 | 1,
  durationMs: number = MORPH_DURATION_MS,
): Animation | undefined {
  if (!canAnimate()) return undefined
  const keyframes = buildKeyframes(sampler, from, to, morphEase)
  const animation = element.animate(keyframes, { duration: durationMs, easing: 'linear', fill: 'forwards' })
  animation.onfinish = () => animation.cancel()

  return animation
}
