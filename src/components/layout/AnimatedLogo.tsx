import { useEffect, useState } from 'react'
import { useTheme } from '../../app/theme-context'
import { getImageDimensions } from '../../lib/imageMetadata'
import { withBasePath } from '../../lib/site'

const darkLogos = [
  '/assets/images/logos/logo1.png',
  '/assets/images/logos/logo2.png',
  '/assets/images/logos/logo3.png',
  '/assets/images/logos/logo4.png',
]

const lightLogos = [
  '/assets/images/logos/logo1li.png',
  '/assets/images/logos/logo2li.png',
  '/assets/images/logos/logo3li.png',
  '/assets/images/logos/logo4li.png',
]

function AnimatedLogo() {
  const { theme } = useTheme()
  const [currentLogoIndex, setCurrentLogoIndex] = useState(0)
  const logos = theme === 'light' ? lightLogos : darkLogos
  const currentLogo = logos[currentLogoIndex] ?? darkLogos[0]
  const currentLogoDimensions = getImageDimensions(currentLogo)

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setCurrentLogoIndex((previousIndex) => (previousIndex + 1) % logos.length)
    }, 30000)

    return () => {
      window.clearInterval(intervalId)
    }
  }, [logos.length])

  return (
    <div className="flex h-10 w-32 items-center justify-center">
      <img
        src={withBasePath(currentLogo)}
        alt="Aurel De Vince logo"
        width={currentLogoDimensions?.width}
        height={currentLogoDimensions?.height}
        className="navbar-logo"
      />
    </div>
  )
}

export default AnimatedLogo
