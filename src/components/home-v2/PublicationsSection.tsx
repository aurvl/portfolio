import { FiExternalLink } from 'react-icons/fi'
import { useHomeContent } from '../../hooks/useHomeContent'
import Reveal from './Reveal'

function PublicationsSection() {
  const { publications } = useHomeContent().content

  return (
    <div className="hv-wrap">
      <Reveal className="hv-row-head">
        <div>
          <h2 className="hv-h2">{publications.title}</h2>
          <p className="hv-row-head__intro">{publications.intro}</p>
        </div>
      </Reveal>
      <Reveal className="hv-pubs">
        {publications.items.map((item) => (
          <a key={item.url} className="hv-card hv-pub" href={item.url} target="_blank" rel="noreferrer">
            <div className="hv-work__top">
              <span className="hv-pub__kind">{item.kind}</span>
              <span className="hv-status hv-status--done">{item.status}</span>
            </div>
            <h3>{item.title}</h3>
            <p className="hv-pub__cite">
              {item.authorsBefore}
              <b>{item.me}</b>
              {item.authorsAfter} <i>{item.journal}</i> {item.reference}
            </p>
            <span className="hv-link">
              {publications.readArticle} <FiExternalLink className="hv-arrow" aria-hidden="true" />
            </span>
          </a>
        ))}
      </Reveal>
    </div>
  )
}

export default PublicationsSection
