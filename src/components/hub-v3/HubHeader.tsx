// En-tête du Hub « Projets et articles » (page /projects) : bandeau de bambous fin, titre et pilule de recherche.
// Le bandeau est l'élément partagé `bamboo-banner` des transitions entre pages (styles/v3/page-transitions.css).
import { FiSearch } from 'react-icons/fi'
import BambooPhoto from '../ui/BambooPhoto'

type HubHeaderProps = {
  title: string
  searchLabel: string
}

function HubHeader({ title, searchLabel }: HubHeaderProps) {
  return (
    <header className="hub-header">
      <div className="hub-header__banner">
        <BambooPhoto className="hub-header__banner-image" />
      </div>

      <div className="hub-header__bar">
        <h1 className="hub-header__title">{title}</h1>

        {/* Pilule de recherche : visible mais inactive, elle ouvrira le SearchPanel à l'étape 11 du plan */}
        <button
          type="button"
          className="hub-header__search"
          disabled
        >
          <FiSearch aria-hidden="true" />
          {searchLabel}
        </button>
      </div>
    </header>
  )
}

export default HubHeader
