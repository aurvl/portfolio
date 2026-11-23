// « Pour aller plus loin » (mobile et tablette) : deux boutons « Research → » et « Projects → », puis un lien
// souligné vers le contact. Termine la section About sur les écrans de moins de 1024 px.
// « Research » a un effet de rideau bleu au survol (exception assumée du style éditorial, voir BRIEF §2).
import { LuArrowRight } from 'react-icons/lu'
import { Link } from 'react-router-dom'
import { cn } from '../../lib/cn'
import Button from '../ui/Button'

export type NextDoor = {
  to: string
  title: string
  // 'curtain' = contour bleu avec rideau bleu qui se déploie ; sinon contour de la couleur du texte
  style?: 'curtain'
}

type NextDoorsProps = {
  title: string
  doors: NextDoor[]
  contactLabel: string
  onContact: () => void
  className?: string
}

function NextDoors({ title, doors, contactLabel, onContact, className }: NextDoorsProps) {
  return (
    <section className={cn('next-doors', className)}>
      <h3 className="eyebrow">{title}</h3>

      <ul className="next-doors__list">
        {doors.map((door) => (
          <li key={door.to}>
            <Link
              className={cn('next-doors__door', door.style === 'curtain' && 'next-doors__door--curtain')}
              to={door.to}
            >
              <span>{door.title}</span>
              <LuArrowRight
                className="next-doors__door-arrow"
                aria-hidden="true"
              />
            </Link>
          </li>
        ))}
      </ul>

      <div className="next-doors__contact">
        <Button
          variant="link"
          onClick={onContact}
          icon={<LuArrowRight />}
        >
          {contactLabel}
        </Button>
      </div>
    </section>
  )
}

export default NextDoors
