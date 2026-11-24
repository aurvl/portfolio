// « Pour aller plus loin » (mobile et tablette) : deux grandes cartes d'invitation, « Recherche » et « Projets », puis un lien
// souligné vers le contact. Termine la section About sur les écrans de moins de 1024 px.
// Chaque carte : une photo sous un voile coloré (bleu pour la recherche, noir pour les projets), un titre serif, le nombre
// d'éléments derrière la porte et une flèche en pastille. Elles « sautent » (animation about-hop dans about.css) pour
// attirer le doigt.
import { LuArrowRight } from 'react-icons/lu'
import { Link } from 'react-router-dom'
import { cn } from '../../lib/cn'
import { withBasePath } from '../../lib/site'
import Button from '../ui/Button'

export type NextDoor = {
  to: string
  title: string
  // Petite ligne sous le titre, ex. « 26 projets »
  meta: string
  // Photo de fond (décorative : le titre dit déjà où mène la carte)
  image: string
  // Couleur du voile posé sur la photo
  tone: 'brand' | 'night'
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
              className={cn('next-doors__door', `next-doors__door--${door.tone}`)}
              to={door.to}
            >
              <img
                className="next-doors__door-image"
                src={withBasePath(door.image)}
                alt=""
                loading="lazy"
                decoding="async"
              />

              <span className="next-doors__door-arrow">
                <LuArrowRight aria-hidden="true" />
              </span>

              <span className="next-doors__door-text">
                <span className="next-doors__door-title">{door.title}</span>
                <span className="next-doors__door-meta">{door.meta}</span>
              </span>
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
