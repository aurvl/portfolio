import { Link } from 'react-router-dom'
import { FiChevronRight } from 'react-icons/fi'
import projectsData from '../../data/projects.json'
import type { WorkItem } from '../../data/home'
import { useHomeContent } from '../../hooks/useHomeContent'
import type { AppLanguage } from '../../types/i18n'
import { getDomainColor } from '../../lib/domainColors'
import type { Project } from '../../types/project'
import Reveal from './Reveal'

const projects = projectsData as Project[]
const projectsBySlug = new Map(projects.map((project) => [project.slug, project]))

// Same domain badge and keyword tags as the project catalogue cards.
function getTaxonomy(item: WorkItem, lang: AppLanguage) {
  const project = item.slug ? projectsBySlug.get(item.slug) : undefined
  return {
    domain: item.domain ?? project?.taxonomy.domains[0] ?? '',
    keywords: (item.keywords ?? project?.taxonomy.keywords[lang] ?? []).slice(0, 3),
  }
}

const projectHref = (slug: string) => `/projects?project=${encodeURIComponent(slug)}`

// Featured figure: distribution of claim fraud scores, the review threshold,
// one flagged claim and (dashed) the counterfactual version that falls below it.
const SCORE_BARS = [10, 18, 30, 44, 58, 66, 70, 64, 55, 46, 38, 31, 25, 20, 16, 13, 11, 9, 8, 7, 9, 12, 6]
const THRESHOLD_INDEX = 16
const FLAGGED_INDEX = 21
const COUNTERFACTUAL_INDEX = 13

function FraudSketch() {
  const { work } = useHomeContent().content
  const barWidth = 460 / SCORE_BARS.length
  const thresholdX = THRESHOLD_INDEX * barWidth

  return (
    <div className="hv-work__visual" aria-hidden="true">
      <div className="hv-work__visual-labels">
        <span>{work.sketchLabels[0]}</span>
        <span>{work.sketchLabels[1]}</span>
      </div>
      {/* Stretches to the free height of the featured card; strokes keep their width. */}
      <svg viewBox="0 0 460 96" preserveAspectRatio="none">
        <line x1="0" y1="95" x2="460" y2="95" stroke="var(--hv-line-2)" vectorEffect="non-scaling-stroke" />
        {SCORE_BARS.map((height, index) => {
          const isFlagged = index === FLAGGED_INDEX
          const isAbove = index >= THRESHOLD_INDEX
          return (
            <rect
              key={index}
              x={index * barWidth + 2}
              y={95 - height * 1.2}
              width={barWidth - 4}
              height={height * 1.2}
              rx="1"
              fill={isFlagged ? 'var(--hv-accent)' : isAbove ? 'var(--hv-t2)' : 'var(--hv-t3)'}
              opacity={isFlagged ? 1 : isAbove ? 0.75 : 0.55}
            />
          )
        })}
        <rect
          x={COUNTERFACTUAL_INDEX * barWidth + 2}
          y={95 - SCORE_BARS[FLAGGED_INDEX] * 1.2}
          width={barWidth - 4}
          height={SCORE_BARS[FLAGGED_INDEX] * 1.2}
          rx="1"
          fill="none"
          stroke="var(--hv-accent)"
          strokeDasharray="3 2"
          vectorEffect="non-scaling-stroke"
        />
        <line
          x1={thresholdX}
          y1="2"
          x2={thresholdX}
          y2="95"
          stroke="var(--hv-warn)"
          strokeWidth="1.5"
          strokeDasharray="4 3"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </div>
  )
}

function WorkCard({ item, featured }: { item: WorkItem; featured?: boolean }) {
  const { content, lang } = useHomeContent()
  const { work } = content
  const { domain, keywords } = getTaxonomy(item, lang)
  const body = (
    <>
      <div className="hv-work__top">
        <span className="project-domain" style={{ color: getDomainColor(domain) }}>
          {domain}
        </span>
        <span className={`hv-status ${item.state === 'done' ? 'hv-status--done' : 'hv-status--progress'}`}>
          {work.statusLabels[item.state]}
        </span>
      </div>
      <h3>{item.title}</h3>
      <div className="hv-work__tags">
        {keywords.map((keyword) => (
          <span
            key={keyword}
            className="rounded-[7px] bg-[var(--keyw-bg-col)] px-2 py-1 text-xs font-semibold uppercase text-[var(--keyw-col-window)]"
          >
            {keyword}
          </span>
        ))}
      </div>
      <p>{item.summary}</p>
      {featured && <FraudSketch />}
      {item.details && (
        <dl className="hv-work__details">
          {item.details.map((detail) => (
            <div key={detail.label}>
              <dt>{detail.label}</dt>
              <dd>{detail.value}</dd>
            </div>
          ))}
        </dl>
      )}
      <div className="hv-work__foot">
        <span>{item.tools}</span>
        {item.slug && <span className="hv-link">{work.viewProject} <FiChevronRight className="hv-arrow" aria-hidden="true" /></span>}
      </div>
    </>
  )

  const className = `hv-card hv-work__card ${featured ? 'hv-work__card--featured' : ''}`

  return item.slug ? (
    <Link to={projectHref(item.slug)} className={className}>
      {body}
    </Link>
  ) : (
    <article className={className}>{body}</article>
  )
}

// Flagship card + two smaller cards; also used at the top of /projects.
export function SelectedWorkGrid() {
  const { work } = useHomeContent().content
  const [featured, ...others] = work.items

  return (
    <Reveal className="hv-work">
      <WorkCard item={featured} featured />
      {others.map((item) => (
        <WorkCard key={item.title} item={item} />
      ))}
    </Reveal>
  )
}

function WorkSection() {
  const { work } = useHomeContent().content

  return (
    <div className="hv-wrap">
      <Reveal className="hv-intro">
        <h2 className="hv-h2">{work.title}</h2>
        <p>{work.intro}</p>
      </Reveal>
      <SelectedWorkGrid />
      <Reveal className="hv-related">
        <span className="hv-related__label">{work.relatedLabel}</span>
        {work.related.map((study) => (
          <Link key={study.slug} to={projectHref(study.slug)}>
            {study.title}
            <span>{study.detail}</span>
          </Link>
        ))}
      </Reveal>
      <div className="hv-center-action">
        <Link to="/projects" className="hv-btn hv-btn--ghost hv-btn--sm">
          {work.browseAll.replace('{count}', String(projects.length))} <FiChevronRight className="hv-arrow" aria-hidden="true" />
        </Link>
      </div>
    </div>
  )
}

export default WorkSection
