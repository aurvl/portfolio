// Bloc « Latest things » sous la bannière : 3 entrées séparées par un filet (titre, description, date, vignette).
// Apparaît sur la page d'accueil, juste sous LandingHero (design/screens/01-accueil-landing.png).
// Mobile et tablette (< 900 px) : les entrées forment un carrousel horizontal (défilement natif avec scroll-snap, voir
// landing.css) ; la carte suivante dépasse un peu, et des points indiquent la carte affichée.
import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { placeholders } from '../../data/placeholders'
import { useHomeContent } from '../../hooks/useHomeContent'
import { cn } from '../../lib/cn'
import { withBasePath } from '../../lib/site'

function LatestThings() {
  const { lang, content } = useHomeContent()
  const labels = placeholders.getLandingLabels(lang)
  const items = placeholders.getLatestThings(lang)
  const listRef = useRef<HTMLUListElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)

  // Le point actif suit la carte la plus proche du bord gauche ; en bout de course, c'est la dernière
  const handleListScroll = () => {
    const list = listRef.current
    if (!list) return

    const startOffset = parseFloat(getComputedStyle(list).paddingLeft) || 0
    const cards = Array.from(list.children) as HTMLElement[]
    const isAtEnd = list.scrollLeft + list.clientWidth >= list.scrollWidth - 2
    let nearest = 0
    cards.forEach((card, index) => {
      const distance = Math.abs(card.offsetLeft - startOffset - list.scrollLeft)
      const nearestDistance = Math.abs(cards[nearest].offsetLeft - startOffset - list.scrollLeft)
      if (distance < nearestDistance) nearest = index
    })

    setActiveIndex(isAtEnd ? cards.length - 1 : nearest)
  }

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

      <ul
        ref={listRef}
        className="latest-things__list"
        onScroll={handleListScroll}
      >
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

      {/* Points indicateurs (mobile seulement) : décoratifs, les cartes restent des liens atteignables au clavier */}
      <div
        className="latest-things__dots"
        aria-hidden="true"
      >
        {items.map((item, index) => (
          <span
            key={item.id}
            className={cn('latest-things__dot', index === activeIndex && 'is-active')}
          />
        ))}
      </div>
    </section>
  )
}

export default LatestThings
