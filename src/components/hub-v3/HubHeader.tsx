// En-tête du Hub « Projets et articles » (page /projects) : bandeau de bambous fin, titre et pilule de recherche.
// Le bandeau est l'élément partagé `bamboo-banner` des transitions entre pages (styles/v3/page-transitions.css).
import { FiSearch } from 'react-icons/fi'
import BambooPhoto from '../ui/BambooPhoto'

type HubHeaderProps = {
  title: string
  searchLabel: string
  onOpenSearch: () => void
}

function HubHeader({ title, searchLabel, onOpenSearch }: HubHeaderProps) {
  return (
    <header className="hub-header">
      <div className="hub-header__banner">
        <BambooPhoto className="hub-header__banner-image" />
      </div>

      <div className="hub-header__bar">
        <h1 className="hub-header__title">{title}</h1>

        <button
          type="button"
          className="hub-header__search"
          aria-controls="hub-search"
          onClick={onOpenSearch}
        >
          <FiSearch aria-hidden="true" />
          {searchLabel}
        </button>
      </div>
    </header>
  )
}

export default HubHeader
