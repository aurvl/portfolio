import { useHomeContent } from '../../hooks/useHomeContent'
import Reveal from './Reveal'
import euroregionMap from '../../data/euroregion-map.json'

// Real boundaries: Eurostat GISCO NUTS 2024 (regenerate with scripts/build_euroregion_map.py).
const REGIONS = [
  { id: 'FRI', name: 'Nouvelle-Aquitaine', tone: 'var(--hv-t1)', opacity: 0.16 },
  { id: 'ES21', name: 'Euskadi', tone: 'var(--hv-t2)', opacity: 0.24 },
  { id: 'ES22', name: 'Navarre', tone: 'var(--hv-t2)', opacity: 0.4 },
] as const

function EuroregionMap() {
  const { doctoralResearch } = useHomeContent().content
  const { width, height, regions, context, border, labels } = euroregionMap as unknown as {
    width: number
    height: number
    regions: Record<string, string>
    context: string[]
    border: string
    labels: Record<string, [number, number]>
  }

  return (
    <figure className="hv-map">
      <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label={doctoralResearch.mapLabel}>
        <defs>
          <clipPath id="hv-map-frame">
            <rect width={width} height={height} />
          </clipPath>
        </defs>
        <g clipPath="url(#hv-map-frame)">
          {context.map((d, index) => (
            <path key={index} d={d} className="hv-map__context" />
          ))}
          {REGIONS.map((region) => (
            <path key={region.id} d={regions[region.id]} fill={region.tone} fillOpacity={region.opacity} stroke={region.tone} strokeWidth="1.2" strokeLinejoin="round" />
          ))}
          <path d={border} className="hv-map__border" />
        </g>
        <g className="hv-map-label">
          {REGIONS.map((region) => (
            <text key={region.id} x={labels[region.id][0]} y={labels[region.id][1]} textAnchor="middle">
              {region.name}
            </text>
          ))}
        </g>
        <text x={labels.border[0]} y={labels.border[1]} textAnchor="middle" className="hv-graph-mono hv-map__border-label">
          {doctoralResearch.borderLabel}
        </text>
      </svg>
      <figcaption className="hv-map__source">Eurostat GISCO, NUTS 2024 · © EuroGeographics</figcaption>
    </figure>
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
