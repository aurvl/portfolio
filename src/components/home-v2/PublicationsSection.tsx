import { Link } from 'react-router-dom'
import { FiChevronRight, FiExternalLink } from 'react-icons/fi'
import type { HomeContent } from '../../data/home'
import { useHomeContent } from '../../hooks/useHomeContent'
import Reveal from './Reveal'

type Publication = HomeContent['publications']['items'][number]

export function PublicationCard({ item, readArticle }: { item: Publication; readArticle: string }) {
  return (
    <a className="hv-card hv-pub" href={item.url} target="_blank" rel="noreferrer">
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
        {readArticle} <FiExternalLink className="hv-arrow" aria-hidden="true" />
      </span>
    </a>
  )
}

function PublicationsSection() {
  const { publications } = useHomeContent().content

  return (
    <div className="hv-wrap">
      <Reveal className="hv-row-head">
        <div>
          <h2 className="hv-h2">{publications.title}</h2>
          <p className="hv-row-head__intro">{publications.intro}</p>
        </div>
        <Link to="/publications" className="hv-link">
          {publications.allPublications} <FiChevronRight className="hv-arrow" aria-hidden="true" />
        </Link>
      </Reveal>
      <Reveal className="hv-pubs">
        {publications.items.map((item) => (
          <PublicationCard key={item.url} item={item} readArticle={publications.readArticle} />
        ))}
      </Reveal>
    </div>
  )
}

export default PublicationsSection
