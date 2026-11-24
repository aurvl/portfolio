// Texte replié sur mobile : 2 lignes de résumé et un bouton « Lire la suite » qui déplie le reste.
// Le texte complet reste dans la page : seul l'affichage est limité (line-clamp dans about.css).
// Utilisé seulement sur mobile ; l'ordinateur affiche les blocs en entier.
import { useId, useState } from 'react'
import { LuChevronDown } from 'react-icons/lu'
import { cn } from '../../lib/cn'

type CollapsibleProps = {
  heading: string
  text: string
  readMoreLabel: string
  readLessLabel: string
  className?: string
}

function Collapsible({ heading, text, readMoreLabel, readLessLabel, className }: CollapsibleProps) {
  const [isOpen, setIsOpen] = useState(false)
  const textId = useId()

  return (
    <div className={cn('collapsible', isOpen && 'is-open', className)}>
      <h3 className="collapsible__heading">{heading}</h3>
      <p
        id={textId}
        className="collapsible__text"
      >
        {text}
      </p>
      <button
        type="button"
        className="collapsible__toggle"
        aria-expanded={isOpen}
        aria-controls={textId}
        onClick={() => setIsOpen((open) => !open)}
      >
        {isOpen ? readLessLabel : readMoreLabel}
        <LuChevronDown
          className="collapsible__chevron"
          aria-hidden="true"
        />
      </button>
    </div>
  )
}

export default Collapsible
