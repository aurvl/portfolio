import { useEffect, useState } from 'react'
import { FaArrowUp } from 'react-icons/fa6'

function BackToTopButton() {
  const [isVisible, setIsVisible] = useState(false)

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

  const label =
    typeof document !== 'undefined' && document.documentElement.lang === 'fr'
      ? 'Retour en haut'
      : 'Back to top'

  return (
    <button
      type="button"
      className={`back-to-top-button rounded-full ${isVisible ? 'is-visible' : ''}`}
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label={label}
      title={label}
    >
      <FaArrowUp aria-hidden="true" />
    </button>
  )
}

export default BackToTopButton
