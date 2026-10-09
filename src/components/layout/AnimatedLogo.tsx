import { withBasePath } from '../../lib/site'

// Glowing curve logo (from the owner's Figma file), the same in both themes, next to the name.
function AnimatedLogo() {
  return (
    <span className="navbar-mark">
      <img src={withBasePath('/assets/images/logos/logo-glow.svg')} alt="" width={33} height={20} />
      <span className="navbar-mark__name">Aurel Vehi</span>
    </span>
  )
}

export default AnimatedLogo
