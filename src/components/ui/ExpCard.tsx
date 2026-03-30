import { withBasePath } from '../../lib/site'

type ExpCardProps = {
  image: string
  imageAlt: string
  tooltip: string
  title: string
  period: string
  contractType: string
  location: string
}

function ExpCard({
  image,
  imageAlt,
  tooltip,
  title,
  period,
  contractType,
  location,
}: ExpCardProps) {
  return (
    <article className="exp-card">
      <div className="exp-card__image-wrapper">
        <img src={withBasePath(image)} alt={imageAlt} className="exp-card__image" />
        <span className="exp-card__tooltip">{tooltip}</span>
      </div>

      <div>
        <h3 className="exp-card__title">{title}</h3>

        <p className="exp-card__meta text-sm">
          {period} <span className="exp-card__dot">•</span>{' '}
          <strong>{contractType}</strong>
          <br />
          {location}
        </p>
      </div>
    </article>
  )
}

export default ExpCard
