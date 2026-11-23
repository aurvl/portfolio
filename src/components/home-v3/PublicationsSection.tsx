// Troisième écran : la liste des articles de recherche (page d'accueil, id « research », et page /publications).
// Référence : design/screens/03-publications.png. Même bannière et mêmes ronds sociaux que l'About ;
// à gauche le bouton « Back to about », à droite le titre et les articles, séparés par des filets fins.
// Sur ordinateur (scène de l'accueil, `inScene`), la bannière est la photo de la scène (ici, seulement la place
// qu'elle occupe) et les ronds sociaux sont dans PapersChrome, collé sous la bande pendant que la liste défile.
import { FiArrowUp, FiArrowUpRight } from 'react-icons/fi'
import { placeholders } from '../../data/placeholders'
import { useHomeContent } from '../../hooks/useHomeContent'
import { cn } from '../../lib/cn'
import BambooPhoto from '../ui/BambooPhoto'
import Button from '../ui/Button'
import SocialIcons from '../ui/SocialIcons'

type PublicationsSectionProps = {
  // Remonte vers l'About (scroll fluide sur l'accueil, navigation vers /#about depuis la page)
  onBackToAbout: () => void
  // true (ordinateur, accueil) : la photo et les ronds sociaux viennent de la scène, l'ancre « research » est posée par elle
  inScene?: boolean
}

// Ronds sociaux à cheval sur le bord de la bande de photo, avec une bande de la couleur de la page dessous : la liste,
// qui défile sous la bande, disparaît derrière eux. Posé dans le cadre de la scène (HomePage), il ne défile pas.
export function PapersChrome() {
  return (
    <div className="papers-chrome">
      <div className="papers-chrome__strip" />
      <SocialIcons className="papers-chrome__social" />
    </div>
  )
}

function PublicationsSection({ onBackToAbout, inScene = false }: PublicationsSectionProps) {
  const { lang } = useHomeContent()
  const labels = placeholders.getPublicationsLabels(lang)
  const publications = placeholders.getPublications(lang)

  return (
    <section
      id={inScene ? undefined : 'research'}
      className={cn('papers', inScene && 'papers--in-scene')}
      aria-labelledby="papers-title"
    >
      <div className="papers__banner">
        {inScene ? null : <BambooPhoto className="papers__banner-image" />}
      </div>

      <div className="papers__grid">
        {inScene ? null : <SocialIcons className="papers__social" />}

        <div className="papers__side">
          <Button
            variant="line"
            className="papers__back"
            onClick={onBackToAbout}
            icon={<FiArrowUp />}
          >
            {labels.backToAbout}
          </Button>
        </div>

        <div className="papers__main">
          <p className="eyebrow">{labels.eyebrow}</p>
          <h2
            id="papers-title"
            className="papers__title"
          >
            {labels.title}
          </h2>
          <p className="papers__intro">{labels.intro}</p>

          <ul className="papers__list">
            {publications.map((paper) => (
              <li
                key={paper.url}
                className="papers__item"
              >
                <p className="eyebrow papers__meta">
                  {paper.kind}
                  <span className="tabular"> · {paper.status}</span>
                </p>
                <h3 className="papers__item-title">{paper.title}</h3>
                <p className="papers__cite">
                  {paper.authorsBefore}
                  <strong>{paper.me}</strong>
                  {paper.authorsAfter} <em>{paper.journal}</em> <span className="tabular">{paper.reference}</span>
                </p>
                <Button
                  variant="link"
                  className="papers__link"
                  href={paper.url}
                  target="_blank"
                  rel="noreferrer"
                  icon={<FiArrowUpRight />}
                >
                  {labels.viewPaper}
                </Button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}

export default PublicationsSection
