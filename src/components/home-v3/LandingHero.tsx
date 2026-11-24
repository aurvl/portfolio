// Haut de la page d'accueil : bannière bambous, avatar, nom, poste, réseaux et bouton « En savoir plus ».
// Premier écran du site (design/screens/01-accueil-landing.png).
import { homepage } from '../../data/homepage'
import { useHomeContent } from '../../hooks/useHomeContent'
import { withBasePath } from '../../lib/site'
import Avatar from '../ui/Avatar'
import BambooPhoto from '../ui/BambooPhoto'
import Button from '../ui/Button'
import SocialIcons from '../ui/SocialIcons'

type LandingHeroProps = {
  onLearnMore: () => void
  // true : le vrai bouton est celui de MorphNavbar (il voyage jusqu'à la navbar) ; ici on ne garde qu'un
  // « fantôme » invisible, à la même place et à la même taille, pour que MorphNavbar sache d'où partir.
  isButtonInNavbar?: boolean
  // true (ordinateur) : la photo vient de la scène de l'accueil (HomePage). L'identité (avatar, nom, poste, réseaux)
  // reste ici, intacte, et c'est elle qui glisse jusqu'à sa place dans l'About (useBambooScene).
  inScene?: boolean
}

function LandingHero({ onLearnMore, isButtonInNavbar = false, inScene = false }: LandingHeroProps) {
  const { lang } = useHomeContent()
  const profile = homepage.getProfile(lang)
  const labels = homepage.getLandingLabels(lang)

  return (
    <header className="landing-hero">
      {inScene ? null : (
        <div className="landing-hero__photo">
          <BambooPhoto
            className="landing-hero__background"
            loading="eager"
            fetchPriority="high"
          />
        </div>
      )}
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
