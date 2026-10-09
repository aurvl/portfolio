import { FiChevronRight } from 'react-icons/fi'
import { useHomeContent } from '../../hooks/useHomeContent'
import { withBasePath } from '../../lib/site'
import MethodGraph from './MethodGraph'
import Reveal from './Reveal'

type HomeHeroProps = {
  onNavigate: (sectionId: string) => void
}

function HomeHero({ onNavigate }: HomeHeroProps) {
  const { hero } = useHomeContent().content

  return (
    <div className="hv-hero">
      <div className="hv-wrap">
        <Reveal>
          <div className="hv-byline">
            <img src={withBasePath('assets/images/hero-image.png')} alt="" width={32} height={32} />
            <span>
              <b>{hero.role}</b> · {hero.affiliation}
            </span>
          </div>
          <h1 className="hv-h1">
            {hero.title[0]}
            <br />
            {hero.title[1]}
          </h1>
          <p className="hv-lead hv-hero__lead">{hero.lead}</p>
          <div className="hv-hero__actions">
            <button type="button" className="hv-btn hv-btn--primary" onClick={() => onNavigate('work')}>
              {hero.primaryCta} <FiChevronRight className="hv-arrow" aria-hidden="true" />
            </button>
            <button type="button" className="hv-btn hv-btn--ghost" onClick={() => onNavigate('contact-form')}>
              {hero.secondaryCta}
            </button>
          </div>
        </Reveal>
        <Reveal delay={0.15}>
          <MethodGraph />
        </Reveal>
      </div>
    </div>
  )
}

export default HomeHero
