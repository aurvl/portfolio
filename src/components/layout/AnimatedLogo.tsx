import { useTheme } from '../../app/theme-context'
import { withBasePath } from '../../lib/site'

// Logo test: AV monogram (white bars on the dark theme, black bars on the light theme) next to the name.
function AnimatedLogo() {
  const { theme } = useTheme()
  const mark = theme === 'light' ? '/assets/images/logos/av-light.svg' : '/assets/images/logos/av-dark.svg'

  return (
    <span className="navbar-mark">
      <img src={withBasePath(mark)} alt="" width={20} height={20} />
      <span className="navbar-mark__name">Aurel Vehi</span>
    </span>
  )
}

export default AnimatedLogo
