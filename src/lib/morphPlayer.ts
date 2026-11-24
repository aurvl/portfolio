// Lecteur de la transition Landing → About en version tactile (iPhone, iPad).
//
// Pourquoi : sur Safari iOS, une animation écrite en JavaScript (valeurs posées à chaque image) n'est pas affichée
// pendant l'élan du doigt. Une animation WAAPI (`element.animate`) est confiée au navigateur, qui la joue lui-même, à
// son rythme : elle ne dépend plus de notre JavaScript une fois lancée.
//
// Fonctionnement : chaque élément animé s'inscrit avec une fonction qui dit « à la progression p (0 = landing,
// 1 = About), voici mon style ». Au lancement, on échantillonne cette fonction (SAMPLE_COUNT images clés) et on confie le
// tout au navigateur. La même fonction sert aux animations framer-motion de l'ordinateur : une seule source de vérité.
export type MorphFrame = Record<string, string | number>

// Ce que reçoit un élément à chaque échantillon : la progression, le temps écoulé (0 → 1) et le sens du voyage
export type MorphSample = {
  progress: number
  time: number
  to: 0 | 1
}

type Sampler = (sample: MorphSample) => MorphFrame

const SAMPLE_COUNT = 24
export const MORPH_DURATION_MS = 600

const players = new Map<HTMLElement, Sampler>()
let running: Animation[] = []

// Départ et arrivée en douceur : la même courbe pilote framer-motion (progression) et les images clés
export const morphEase = (amount: number) => amount * amount * (3 - 2 * amount)

// Inscrit un élément ; renvoie la fonction qui le retire
export function registerMorphElement(element: HTMLElement, sampler: Sampler) {
  players.set(element, sampler)

  return () => {
    players.delete(element)
  }
}

// Arrête les animations en cours. Les styles posés par framer-motion sont alors visibles : ils valent, à ce moment,
// exactement ce que l'animation vient d'afficher (même courbe, même durée).
export function stopMorph() {
  running.forEach((animation) => animation.cancel())
  running = []
}

// Joue la transition de `from` vers `to`
export function playMorph(from: number, to: 0 | 1) {
  stopMorph()
  if (typeof Element === 'undefined' || typeof Element.prototype.animate !== 'function') return

  players.forEach((sampler, element) => {
    const keyframes: Keyframe[] = []
    for (let index = 0; index <= SAMPLE_COUNT; index += 1) {
      const time = index / SAMPLE_COUNT
      const progress = from + (to - from) * morphEase(time)
      keyframes.push({ ...sampler({ progress, time, to }), offset: time })
    }

    const animation = element.animate(keyframes, { duration: MORPH_DURATION_MS, easing: 'linear', fill: 'forwards' })
    // Une fois jouée, on retire l'animation : le style en ligne (déjà identique) prend le relais sans saut
    animation.onfinish = () => animation.cancel()
    running.push(animation)
  })
}
