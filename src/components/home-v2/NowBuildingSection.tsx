import { FiChevronRight } from 'react-icons/fi'
import { nowBuildingItems } from '../../data/nowBuilding'
import { useHomeContent } from '../../hooks/useHomeContent'
import Reveal from './Reveal'

function NowBuildingSection() {
  const { content, lang } = useHomeContent()
  const { nowBuilding, work, blog } = content
  const updatedAt = new Intl.DateTimeFormat(blog.dateLocale, { month: 'long', year: 'numeric' }).format(
    new Date(__NOW_BUILDING_UPDATED_AT__)
  )

  return (
    <div className="hv-wrap">
      <Reveal className="hv-row-head">
        <h2 className="hv-h2">{nowBuilding.title}</h2>
        <span className="hv-muted">{nowBuilding.updatedPrefix} {updatedAt}</span>
      </Reveal>
      <Reveal className="hv-list">
        {nowBuildingItems[lang].map((item) => {
          const content = (
            <>
              <span className={`hv-status ${item.state === 'progress' ? 'hv-status--progress' : 'hv-status--prep'}`}>
                {work.statusLabels[item.state]}
              </span>
              <b>{item.title}</b>
              <span className="hv-list__detail">{item.detail}</span>
              <span className="hv-list__arrow" aria-hidden="true">{item.href && <FiChevronRight className="hv-arrow" />}</span>
            </>
          )

          return item.href ? (
            <a key={item.title} href={item.href} className="hv-list__row">
              {content}
            </a>
          ) : (
            <div key={item.title} className="hv-list__row">
              {content}
            </div>
          )
        })}
      </Reveal>
    </div>
  )
}

export default NowBuildingSection
