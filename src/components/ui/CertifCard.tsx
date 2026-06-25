import { getImageDimensions } from '../../lib/imageMetadata'
import { withBasePath } from '../../lib/site'

type CertCardProps = {
  href: string
  image: string
  imageAlt: string
  title: string
  credentialId?: string
  issuedText: string
}

function CertCard({
  href,
  image,
  imageAlt,
  title,
  credentialId,
  issuedText,
}: CertCardProps) {
  const imageDimensions = getImageDimensions(image)

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="cert-card"
    >
      <img
        src={withBasePath(image)}
        alt={imageAlt}
        width={imageDimensions?.width}
        height={imageDimensions?.height}
        loading="lazy"
        className="cert-card__image"
      />

      <div className="text-sm">
        <h3 className="cert-card__title">
          {title}
          {credentialId && (
            <>
              <br />
              <span className="cert-card__id">{credentialId}</span>
            </>
          )}
        </h3>

        <p className="cert-card__meta">{issuedText}</p>
      </div>
    </a>
  )
}

export default CertCard
