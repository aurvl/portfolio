// TEMPORAIRE (diagnostic iOS, à supprimer) : encart en bas de l'écran, affiché seulement avec ?debug=1 dans l'adresse.
// Il montre ce que l'appareil exécute vraiment : critères de média, mouvement réduit, scroll, progression de la transition.
import { useEffect, useRef, useState } from 'react'
import type { MotionValue } from 'framer-motion'

type DebugOverlayProps = {
  isSceneActive: boolean
  reducedMotion: boolean
  progress: MotionValue<number>
}

function DebugOverlay({ isSceneActive, reducedMotion, progress }: DebugOverlayProps) {
  const [text, setText] = useState('')
  const counters = useRef({ scroll: 0, touchstart: 0, touchend: 0, maxProgress: 0, maxScroll: 0 })

  useEffect(() => {
    const onScroll = () => {
      counters.current.scroll += 1
    }
    const onTouchStart = () => {
      counters.current.touchstart += 1
    }
    const onTouchEnd = () => {
      counters.current.touchend += 1
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('touchstart', onTouchStart, { passive: true })
    window.addEventListener('touchend', onTouchEnd, { passive: true })

    const timer = window.setInterval(() => {
      const mq = (query: string) => (window.matchMedia(query).matches ? 'oui' : 'non')
      const header = document.querySelector('.site-nav--morph')?.getBoundingClientRect()
      const identity = document.querySelector<HTMLElement>('.landing-hero__content')
      const c = counters.current
      c.maxProgress = Math.max(c.maxProgress, progress.get())
      c.maxScroll = Math.max(c.maxScroll, window.scrollY)

      setText(
        [
          `${window.innerWidth}x${window.innerHeight} dpr${window.devicePixelRatio}`,
          `mode tactile (scène off): ${isSceneActive ? 'NON' : 'OUI'}`,
          `mouvement réduit (framer): ${reducedMotion ? 'OUI' : 'non'} / css: ${mq('(prefers-reduced-motion: reduce)')}`,
          `hover: ${mq('(hover: hover)')}  pointer fine: ${mq('(pointer: fine)')}  coarse: ${mq('(pointer: coarse)')}`,
          `scrollY: ${Math.round(window.scrollY)} (max ${Math.round(c.maxScroll)})`,
          `progression: ${progress.get().toFixed(2)} (max ${c.maxProgress.toFixed(2)})`,
          `bouton: top ${header ? Math.round(header.top) : '?'} w ${header ? Math.round(header.width) : '?'}`,
          `opacité identité: ${identity ? identity.style.opacity || '(vide)' : '?'}`,
          `événements scroll ${c.scroll}  touchstart ${c.touchstart}  touchend ${c.touchend}`,
          `snap: ${document.documentElement.classList.contains('snap-home') ? 'oui' : 'non'}`,
        ].join('\n'),
      )
    }, 150)

    return () => {
      window.clearInterval(timer)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchend', onTouchEnd)
    }
  }, [isSceneActive, reducedMotion, progress])

  return (
    <pre
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        zIndex: 9999,
        margin: 0,
        padding: '6px 8px',
        font: '11px/1.35 monospace',
        color: '#0f0',
        pointerEvents: 'none',
        background: 'rgba(0, 0, 0, 0.8)',
        whiteSpace: 'pre-wrap',
      }}
    >
      {text}
    </pre>
  )
}

export default DebugOverlay
