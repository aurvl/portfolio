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
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="cert-card"
    >
      <img src={image} alt={imageAlt} className="cert-card__image" />

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