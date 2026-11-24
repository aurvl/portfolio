// État du menu compact (pilule « About ▾ » sur mobile et tablette) : la pilule elle-même s'agrandit en menu.
// Ouverture : la pilule s'agrandit (ressort, avec un petit rebond) et les entrées apparaissent une par une.
// Fermeture : les entrées disparaissent, PUIS le menu se rétracte jusqu'à reprendre sa forme de pilule.
// `expand` va de 0 (pilule) à 1 (menu ouvert) ; il peut dépasser 1 un instant à l'ouverture (rebond de ressort).
// À la fermeture, le retour en pilule est un trajet doux, sans rebond : la forme finale est exactement la pilule.
// Direction : le menu s'ouvre VERS LE BAS par défaut, et VERS LE HAUT seulement s'il n'y a pas assez de place sous la
// pilule dans la fenêtre. Elle est calculée UNIQUEMENT au moment de l'ouverture (jamais pendant le scroll : sur Safari iOS
// le JavaScript est suspendu pendant l'élan, le chevron se retournait en continu) et figée jusqu'à la fermeture.
// prefers-reduced-motion : pas de ressort ni de décalage, simple fondu des entrées.
import { useCallback, useEffect, useRef, useState } from 'react'
import { animate, useMotionValue, type AnimationPlaybackControls } from 'framer-motion'

// Durée pendant laquelle les entrées disparaissent avant que le menu ne se rétracte
const ENTRIES_OUT_MS = 230
// Durée du retour en pilule avant de retirer la liste de la page
const SHRINK_MS = 520
// Marge gardée entre le bas du menu ouvert et le bas de la fenêtre
const BOTTOM_MARGIN_PX = 12

// Place sous la pilule : assez pour la liste (hauteur `listHeight`) ? Sinon le menu s'ouvrira vers le haut.
function hasRoomBelow(pill: HTMLElement | null, listHeight: number) {
  if (!pill) return true
  const rect = pill.getBoundingClientRect()
  // Pilule masquée (ordinateur) : rien à mesurer, on garde la direction par défaut
  if (rect.height === 0) return true

  return document.documentElement.clientHeight - rect.bottom >= listHeight + BOTTOM_MARGIN_PX
}

export function useCompactMenu(reducedMotion: boolean) {
  const [isOpen, setIsOpen] = useState(false)
  // La liste reste dans la page tant que le menu n'a pas fini de se rétracter
  const [isListMounted, setIsListMounted] = useState(false)
  // Pilote le fondu des entrées (indépendamment de la taille du menu)
  const [showEntries, setShowEntries] = useState(false)
  // Vrai : le menu s'ouvre vers le haut (pas assez de place dessous)
  const [opensUp, setOpensUp] = useState(false)

  const expand = useMotionValue(0)
  const expandAnimation = useRef<AnimationPlaybackControls | null>(null)
  const isOpenRef = useRef(false)
  const timers = useRef<number[]>([])

  const clearTimers = useCallback(() => {
    timers.current.forEach((timer) => window.clearTimeout(timer))
    timers.current = []
  }, [])

  const open = useCallback(() => {
    clearTimers()
    isOpenRef.current = true
    setIsOpen(true)
    setIsListMounted(true)
    setShowEntries(true)

    expandAnimation.current?.stop()
    if (reducedMotion) expand.set(1)
    else expandAnimation.current = animate(expand, 1, { type: 'spring', stiffness: 240, damping: 13, mass: 0.9 })
  }, [clearTimers, expand, reducedMotion])

  const close = useCallback(() => {
    if (!isOpenRef.current) return

    clearTimers()
    isOpenRef.current = false
    setIsOpen(false)
    setShowEntries(false)

    // Étape 1 : les entrées disparaissent. Étape 2 : le menu se rétracte. Étape 3 : on retire la liste.
    const waitForEntries = reducedMotion ? 0 : ENTRIES_OUT_MS
    const waitForShrink = reducedMotion ? 0 : SHRINK_MS

    timers.current.push(
      window.setTimeout(() => {
        expandAnimation.current?.stop()
        if (reducedMotion) expand.set(0)
        else expandAnimation.current = animate(expand, 0, { duration: 0.4, ease: [0.4, 0, 0.2, 1] })
      }, waitForEntries),
      window.setTimeout(() => {
        setIsListMounted(false)
        // Refermé : retour à la direction par défaut (chevron vers le bas)
        setOpensUp(false)
      }, waitForEntries + waitForShrink),
    )
  }, [clearTimers, expand, reducedMotion])

  // À l'ouverture, on recalcule la direction une dernière fois avant de s'ouvrir
  const toggle = useCallback(
    (pill?: HTMLElement | null, listHeight = 0) => {
      if (isOpenRef.current) {
        close()
        return
      }
      if (pill) setOpensUp(!hasRoomBelow(pill, listHeight))
      open()
    },
    [close, open],
  )

  // Échap ferme le menu
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close()
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, close])

  useEffect(() => clearTimers, [clearTimers])

  return { isOpen, isListMounted, showEntries, opensUp, expand, toggle, close }
}

export type CompactMenuState = ReturnType<typeof useCompactMenu>
