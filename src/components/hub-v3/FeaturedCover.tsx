// Colonne « couverture » du « à la une » : la série mise en avant (image, titre) et deux boutons.
import { useTranslation } from 'react-i18next'
import Button from '../ui/Button'
import { getLocalizedField } from '../../lib/utils'
import { withBasePath } from '../../lib/site'
import type { Series } from '../../types/series'

type FeaturedCoverProps = {
  series: Series
  eyebrow: string
  viewLabel: string
  subscribeLabel: string
}

function FeaturedCover({ series, eyebrow, viewLabel, subscribeLabel }: FeaturedCoverProps) {
  const { i18n } = useTranslation()
  const seriesHref = withBasePath(`series/${series.slug}`)

  return (
    <aside
      className="featured-cover"
      aria-label={eyebrow}
    >
      <div className="featured-cover__frame">
        <img
          className="featured-cover__image"
          src={withBasePath(series.cover)}
          alt=""
          loading="lazy"
        />

        <div className="featured-cover__caption">
          <p className="eyebrow featured-cover__eyebrow">{eyebrow}</p>
          <p className="featured-cover__title">{getLocalizedField(series.title, i18n.language)}</p>
        </div>
      </div>

      <div className="featured-cover__actions">
        <Button
          variant="line"
          href={seriesHref}
        >
          {viewLabel}
        </Button>
        <Button
          variant="solid"
          href={`${seriesHref}#subscribe`}
        >
          {subscribeLabel}
        </Button>
      </div>
    </aside>
  )
}

export default FeaturedCover
