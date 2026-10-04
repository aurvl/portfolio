import { Link } from 'react-router-dom'
import { FiChevronRight } from 'react-icons/fi'
import { useHomeContent } from '../../hooks/useHomeContent'
import Reveal from './Reveal'

function EuroregionMap() {
  const { doctoralResearch } = useHomeContent().content

  return (
    <svg viewBox="0 0 420 250" role="img" aria-label={doctoralResearch.mapLabel}>
      <path d="M60 30 C 160 10, 300 20, 360 60 C 390 90, 380 130, 330 150 C 260 160, 200 150, 150 160 C 110 168, 70 140, 55 110 C 45 80, 40 45, 60 30Z" fill="var(--hv-t1)" fillOpacity=".16" stroke="var(--hv-t1)" strokeWidth="1.5" />
      <path d="M55 165 C 90 160, 130 170, 160 180 C 170 200, 150 228, 110 232 C 75 234, 45 215, 40 192 C 38 178, 44 168, 55 165Z" fill="var(--hv-t2)" fillOpacity=".2" stroke="var(--hv-t2)" strokeWidth="1.5" />
      <path d="M165 178 C 200 166, 250 168, 280 182 C 295 205, 270 236, 225 240 C 190 242, 165 225, 160 205 C 158 192, 160 184, 165 178Z" fill="var(--hv-t3)" fillOpacity=".35" stroke="var(--hv-t2)" strokeWidth="1.5" />
      <path d="M40 162 C 120 158, 220 160, 300 172" fill="none" stroke="var(--hv-ink)" strokeOpacity=".35" strokeDasharray="5 5" />
      <g className="hv-map-label">
        <text x="170" y="90">Nouvelle-Aquitaine</text>
        <text x="62" y="204">Euskadi</text>
        <text x="196" y="212">Navarre</text>
      </g>
      <text x="306" y="168" className="hv-graph-mono">{doctoralResearch.borderLabel}</text>
    </svg>
  )
}

function DoctoralResearchSection() {
  const { doctoralResearch } = useHomeContent().content

  return (
    <div className="hv-wrap">
      <Reveal className="hv-research">
        <div>
          <p className="hv-eyebrow">{doctoralResearch.eyebrow}</p>
          <h2 className="hv-h2">{doctoralResearch.title}</h2>
          <p className="hv-research__intro">{doctoralResearch.intro}</p>
          <p className="hv-research__question">{doctoralResearch.question}</p>
          <div className="hv-research__meta">
            {doctoralResearch.meta.map((item) => (
              <div key={item.title}>
                <b>{item.title}</b>
                {item.detail}
              </div>
            ))}
          </div>
          <Link to="/research" className="hv-btn hv-btn--primary hv-btn--sm hv-research__programme">
            {doctoralResearch.programmeLink} <FiChevronRight className="hv-arrow" aria-hidden="true" />
          </Link>
        </div>
        <div className="hv-research__visual">
          <EuroregionMap />
          <div className="hv-dims">
            {doctoralResearch.dimensions.map((dimension) => (
              <div key={dimension.title} className={`hv-dim hv-dim--${dimension.tone}`}>
                <b>{dimension.title}</b>
                <span>{dimension.detail}</span>
              </div>
            ))}
          </div>
        </div>
      </Reveal>
    </div>
  )
}

export default DoctoralResearchSection
