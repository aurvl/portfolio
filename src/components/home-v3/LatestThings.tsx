// Bloc « Latest things » sous la bannière : 3 entrées séparées par un filet (titre, description, date, vignette).
// Apparaît sur la page d'accueil, juste sous LandingHero (design/screens/01-accueil-landing.png).
import { Link } from 'react-router-dom'
import { placeholders } from '../../data/placeholders'
import { useHomeContent } from '../../hooks/useHomeContent'
import { withBasePath } from '../../lib/site'

function LatestThings() {
  const { lang, content } = useHomeContent()
  const labels = placeholders.getLandingLabels(lang)
  const items = placeholders.getLatestThings(lang)

  return (
    <section
      className="latest-things"
      aria-labelledby="latest-things-title"
    >
      <h2
        id="latest-things-title"
        className="eyebrow latest-things__title"
      >
        {labels.latestThings}
      </h2>

      <ul className="latest-things__list">
        {items.map((item) => (
          <li key={item.id}>
            <Link
              className="latest-card"
              to={item.href}
            >
              <div className="latest-card__text">
                <h3 className="latest-card__title">{item.title}</h3>
                <p className="latest-card__description">{item.description}</p>
                <time
                  className="latest-card__date tabular"
                  dateTime={item.date}
                >
                  {new Date(item.date).toLocaleDateString(content.blog.dateLocale, {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </time>
              </div>
              <img
                className="latest-card__thumbnail"
                src={withBasePath(item.thumbnailSrc)}
                alt={item.thumbnailAlt}
                loading="lazy"
                decoding="async"
              />
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}

export default LatestThings
