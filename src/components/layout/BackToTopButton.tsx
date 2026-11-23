import { useEffect, useState } from 'react'
import { FaArrowUp } from 'react-icons/fa6'

function BackToTopButton() {
  const [isVisible, setIsVisible] = useState(false)
  // Le pied de page a son propre lien « Haut de page » : le bouton flottant s'efface quand le pied de page est à l'écran,
  // sinon il le chevaucherait
  const [isFooterInView, setIsFooterInView] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 320)
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  // IntersectionObserver : prévient quand le pied de page entre ou sort de la fenêtre
  useEffect(() => {
    const footer = document.querySelector('footer')
    if (!footer) return

    const observer = new IntersectionObserver(([entry]) => setIsFooterInView(entry.isIntersecting))
    observer.observe(footer)

    return () => observer.disconnect()
  }, [])

  const label =
    typeof document !== 'undefined' && document.documentElement.lang === 'fr'
      ? 'Retour en haut'
      : 'Back to top'

  return (
    <button
      type="button"
      className={`back-to-top-button rounded-full ${isVisible && !isFooterInView ? 'is-visible' : ''}`}
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label={label}
      title={label}
      tabIndex={isVisible && !isFooterInView ? 0 : -1}
    >
      <FaArrowUp aria-hidden="true" />
    </button>
  )
}

export default BackToTopButton
