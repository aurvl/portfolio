// Troisième écran : la liste des articles de recherche (page d'accueil, id « research », et page /publications).
// Référence : design/screens/03-publications.png. Même bannière et mêmes ronds sociaux que l'About ;
// à gauche le bouton « Back to about », à droite le titre et les articles, séparés par des filets fins.
import { FiArrowUp, FiArrowUpRight } from 'react-icons/fi'
import { placeholders } from '../../data/placeholders'
import { useHomeContent } from '../../hooks/useHomeContent'
import { withBasePath } from '../../lib/site'
import Button from '../ui/Button'
import SocialIcons from '../ui/SocialIcons'

type PublicationsSectionProps = {
  // Remonte vers l'About (scroll fluide sur l'accueil, navigation vers /#about depuis la page)
  onBackToAbout: () => void
}

function PublicationsSection({ onBackToAbout }: PublicationsSectionProps) {
  const { lang } = useHomeContent()
  const labels = placeholders.getPublicationsLabels(lang)
  const publications = placeholders.getPublications(lang)

  return (
    <section
      id="research"
      className="papers"
      aria-labelledby="papers-title"
    >
      <div className="papers__banner">
        <img
          className="papers__banner-image"
          src={withBasePath('assets/images/hero-bamboo.webp')}
          alt=""
          loading="lazy"
          decoding="async"
        />
      </div>

      <div className="papers__grid">
        <SocialIcons className="papers__social" />

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
