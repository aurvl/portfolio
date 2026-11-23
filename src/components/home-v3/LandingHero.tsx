// Haut de la page d'accueil : bannière bambous, avatar, nom, poste, réseaux et bouton « En savoir plus ».
// Premier écran du site (design/screens/01-accueil-landing.png).
import { placeholders } from '../../data/placeholders'
import { useHomeContent } from '../../hooks/useHomeContent'
import { withBasePath } from '../../lib/site'
import Avatar from '../ui/Avatar'
import Button from '../ui/Button'
import SocialIcons from '../ui/SocialIcons'

type LandingHeroProps = {
  onLearnMore: () => void
  // true : le vrai bouton est celui de MorphNavbar (il voyage jusqu'à la navbar) ; ici on ne garde qu'un
  // « fantôme » invisible, à la même place et à la même taille, pour que MorphNavbar sache d'où partir.
  isButtonInNavbar?: boolean
}

function LandingHero({ onLearnMore, isButtonInNavbar = false }: LandingHeroProps) {
  const { lang } = useHomeContent()
  const profile = placeholders.getProfile(lang)
  const labels = placeholders.getLandingLabels(lang)

  return (
    <header className="landing-hero">
      <img
        className="landing-hero__background"
        src={withBasePath('assets/images/hero-bamboo.webp')}
        alt=""
        fetchPriority="high"
        decoding="async"
      />
      <div className="landing-hero__content">
        <Avatar
          className="landing-hero__avatar"
          src={profile.avatarSrc ? withBasePath(profile.avatarSrc) : null}
          alt={profile.avatarAlt}
        />
        <h1 className="landing-hero__name">
          {profile.firstNames} {profile.lastName}
        </h1>
        <p className="landing-hero__role">{profile.role}</p>
        <SocialIcons className="landing-hero__social" />
      </div>

      {isButtonInNavbar ? (
        <span
          className="btn btn--primary landing-hero__cta landing-hero__cta--ghost"
          aria-hidden="true"
          data-morph-anchor
        >
          {labels.learnMore}
        </span>
      ) : (
        <Button
          className="landing-hero__cta"
          onClick={onLearnMore}
        >
          {labels.learnMore}
        </Button>
      )}
    </header>
  )
}

export default LandingHero
