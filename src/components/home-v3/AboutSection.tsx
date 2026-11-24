// Deuxième écran de l'accueil : bannière bambous, avatar, parcours, textes, boutons et « View my papers ».
// Référence : design/screens/02-about.png (ordinateur) et design/BRIEF.md § « Stratégie mobile » (< 1024 px).
// Les éléments `about__mobile-only` et `about__desktop-only` ne s'affichent que d'un côté du seuil de 1024 px.
import { Link } from 'react-router-dom'
import { FiArrowDown, FiArrowRight } from 'react-icons/fi'
import { placeholders } from '../../data/placeholders'
import { useHomeContent } from '../../hooks/useHomeContent'
import { getResumeDownloadUrl, withBasePath } from '../../lib/site'
import Avatar from '../ui/Avatar'
import BambooPhoto from '../ui/BambooPhoto'
import Button from '../ui/Button'
import Collapsible from '../ui/Collapsible'
import ResumeIcon from '../ui/ResumeIcon'
import SocialIcons from '../ui/SocialIcons'
import JourneyCard from './JourneyCard'
import NextDoors from './NextDoors'
import Timeline from './Timeline'

type AboutSectionProps = {
  onExploreWork: () => void
  onGetInTouch: () => void
  onViewPapers: () => void
  // true (ordinateur) : la photo vient de la scène de l'accueil (HomePage) et l'ancre « about » est posée par elle ;
  // l'avatar, le nom, le poste et les réseaux sont ceux qui glissent depuis la landing (useBambooScene).
  inScene?: boolean
  // true (mobile et tablette) : la bannière de l'About est celle de la landing (une seule photo, voir useBambooMobile) ;
  // ici il ne reste qu'un espace vide à sa hauteur
  isPhotoShared?: boolean
}

function AboutSection({ onExploreWork, onGetInTouch, onViewPapers, inScene = false, isPhotoShared = false }: AboutSectionProps) {
  const { lang } = useHomeContent()
  const profile = placeholders.getProfile(lang)
  const labels = placeholders.getAboutLabels(lang)
  const sections = placeholders.getAboutSections(lang)
  const timeline = placeholders.getTimeline(lang)
  const themes = placeholders.getThemes(lang)
  const resumeUrl = getResumeDownloadUrl(lang)

  // Sur mobile, le premier bloc de texte est remplacé par les pastilles « Je travaille sur »
  const [, ...collapsibleSections] = sections

  return (
    <section
      id={inScene ? undefined : 'about'}
      className="about"
      aria-labelledby="about-title"
    >
      <div className="about__banner">
        {inScene || isPhotoShared ? null : <BambooPhoto className="about__banner-image" />}
      </div>

      <div className="about__grid">
        {/* En-tête identique sur tous les formats : avatar à gauche, nom et poste à sa droite,
            sous le bord de la bannière. Seule la mise en page change (about.css). */}
        <header className="about__header">
          <Avatar
            className="about__avatar"
            src={profile.avatarSrc ? withBasePath(profile.avatarSrc) : null}
            alt={profile.avatarAlt}
          />
          <div className="about__identity">
            <div className="about__identity-text">
              {/* Simple paragraphe (et non un titre) : le nom est déjà le <h1> de la landing, un second titre le répéterait.
                  Il garde l'id pour nommer la section au lecteur d'écran. */}
              <p
                id="about-title"
                className="about__name"
              >
                {profile.firstNames} {profile.lastName}
              </p>
              <p className="about__role">{profile.role}</p>
            </div>
            <SocialIcons className="about__social about__desktop-only" />
          </div>
        </header>

        <aside className="about__side about__desktop-only">
          <Timeline
            className="about__timeline"
            steps={timeline}
            label={labels.timelineLabel}
          />
          <Button
            variant="solid"
            className="about__resume"
            href={resumeUrl}
            download
            icon={<ResumeIcon />}
          >
            {labels.downloadResume}
          </Button>
        </aside>

        <div className="about__main">
          <p className="about__hook about__mobile-only">{labels.hook}</p>

          <h3 className="about__title about__desktop-only">{labels.title}</h3>

          <div className="about__themes about__mobile-only">
            <h3 className="eyebrow">{labels.workingOn}</h3>
            <ul className="about__theme-list">
              {themes.map((theme) => (
                <li key={theme}>
                  <Link
                    className="about__theme"
                    to={{ pathname: '/projects', search: `?tag=${encodeURIComponent(theme)}` }}
                  >
                    {theme}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Ordinateur : les trois blocs de texte en entier */}
          {sections.map((section) => (
            <div
              key={section.heading}
              className="about__block about__desktop-only"
            >
              <h3 className="about__heading">{section.heading}</h3>
              <p className="about__text">{section.body}</p>
            </div>
          ))}

          {/* Mobile : blocs repliés sur 2 lignes, dépliables ; le texte reste dans la page */}
          {collapsibleSections.map((section) => (
            <Collapsible
              key={section.heading}
              className="about__block about__mobile-only"
              heading={section.heading}
              text={section.body}
              readMoreLabel={labels.readMore}
              readLessLabel={labels.readLess}
            />
          ))}

          <JourneyCard
            className="about__mobile-only"
            title={labels.journeyTitle}
            steps={timeline}
            currentPlace={labels.journeyPlace}
            resumeLabel={labels.downloadResume}
            resumeHref={resumeUrl}
          />

          <div className="about__actions about__desktop-only">
            <Button
              variant="link"
              onClick={onExploreWork}
              icon={<FiArrowRight />}
            >
              {labels.exploreWork}
            </Button>
            <Button
              variant="link"
              onClick={onGetInTouch}
              icon={<FiArrowRight />}
            >
              {labels.getInTouch}
            </Button>
          </div>

          <NextDoors
            className="about__mobile-only"
            title={labels.nextTitle}
            doors={[
              { to: '/publications', title: labels.papersDoor, style: 'curtain' },
              { to: '/projects', title: labels.projectsDoor },
            ]}
            contactLabel={labels.contactLink}
            onContact={onGetInTouch}
          />
        </div>
      </div>

      <Button
        variant="solid"
        className="about__papers about__desktop-only"
        onClick={onViewPapers}
        icon={<FiArrowDown />}
      >
        {labels.viewPapers}
      </Button>
    </section>
  )
}

export default AboutSection
