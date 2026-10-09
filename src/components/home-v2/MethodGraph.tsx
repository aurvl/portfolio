import type { CSSProperties } from 'react'
import { useReducedMotion } from 'framer-motion'
import { useHomeContent } from '../../hooks/useHomeContent'
import { getToolIcons } from '../../lib/toolIcons'

const SOURCE_Y = [40, 118, 196, 274, 352]
const OUTPUT_Y = [70, 180, 290, 370]

// Several data sources converge into the workflow, which produces decision-ready outputs.
function MethodGraph() {
  const reduceMotion = useReducedMotion()
  const { methodGraph, method } = useHomeContent().content
  const methodSteps = method.steps
  const { labels } = methodGraph
  const tools = getToolIcons(methodGraph.toolSlugs)

  return (
    <div className="hv-graph-panel">
      <svg
        className="hv-graph"
        viewBox="0 0 1100 420"
        role="img"
        aria-label={methodGraph.ariaLabel}
      >
        <g fill="none" stroke="var(--hv-line-3)" strokeWidth="1.4">
          {SOURCE_Y.map((y, index) => (
            <path key={`in-${y}`} id={`hv-in-${index}`} d={`M220 ${y + 27} C 300 ${y + 27}, 320 210, 390 210`} />
          ))}
          {OUTPUT_Y.map((y, index) => (
            <path key={`out-${y}`} id={`hv-out-${index}`} d={`M720 210 C 790 210, 800 ${y}, 870 ${y}`} />
          ))}
        </g>

        {!reduceMotion && (
          <g fill="var(--hv-accent)">
            {SOURCE_Y.map((y, index) => (
              <circle key={`pin-${y}`} r="3.5">
                <animateMotion dur={`${2.6 + index * 0.35}s`} begin={`${index * 0.5}s`} repeatCount="indefinite">
                  <mpath href={`#hv-in-${index}`} />
                </animateMotion>
              </circle>
            ))}
            {OUTPUT_Y.map((y, index) => (
              <circle key={`pout-${y}`} r="3.5">
                <animateMotion dur={`${2.2 + index * 0.3}s`} begin={`${1.2 + index * 0.4}s`} repeatCount="indefinite">
                  <mpath href={`#hv-out-${index}`} />
                </animateMotion>
              </circle>
            ))}
          </g>
        )}

        <text x="10" y="22" className="hv-graph-label">{labels.sources}</text>
        {methodGraph.sources.map((source, index) => (
          <g key={source.title} transform={`translate(10,${SOURCE_Y[index]})`}>
            <rect
              width="210"
              height="54"
              rx="3"
              fill="var(--hv-surface)"
              stroke="var(--hv-line-2)"
              strokeDasharray={source.partial ? '4 3' : undefined}
            />
            <text x="16" y="23" className="hv-graph-title">{source.title}</text>
            <text x="16" y="41" className="hv-graph-mono">{source.detail}</text>
          </g>
        ))}

        <g transform="translate(390,40)">
          <rect width="330" height="340" rx="3" fill="var(--hv-surface)" stroke="var(--hv-accent)" strokeWidth="1.5" />
          <text x="18" y="34" className="hv-graph-heading">{labels.heading}</text>
          <text x="18" y="54" className="hv-graph-mono">{labels.subheading}</text>
          {methodSteps.map((step, index) => {
            const y = 92 + index * 30
            return (
              <g key={step.title}>
                <rect
                  x="18"
                  y={y - 17}
                  width="294"
                  height="24"
                  rx="3"
                  className="hv-graph-row"
                  style={{ '--hv-delay': `${index * 1.5}s` } as CSSProperties}
                />
                <text x="30" y={y} className="hv-graph-mono hv-graph-mono--accent">{`0${index + 1}`}</text>
                <text x="62" y={y} className="hv-graph-step">{step.title}</text>
              </g>
            )
          })}
          {tools.map((tool, index) => (
            <g key={tool.slug}>
              <rect x={18 + index * 42} y="282" width="34" height="34" rx="3" fill="var(--hv-surface-2)" stroke="var(--hv-line)" />
              <image href={tool.src} x={24 + index * 42} y="288" width="22" height="22">
                <title>{tool.label}</title>
              </image>
            </g>
          ))}
        </g>

        <text x="870" y="22" className="hv-graph-label">{labels.outputs}</text>
        <g transform="translate(870,30)">
          <rect width="220" height="80" rx="3" fill="var(--hv-surface)" stroke="var(--hv-line-2)" />
          <text x="14" y="24" className="hv-graph-title">{labels.indicators}</text>
          <rect x="14" y="38" width="150" height="7" rx="2" fill="var(--hv-t1)" />
          <rect x="14" y="50" width="112" height="7" rx="2" fill="var(--hv-t2)" />
          <rect x="14" y="62" width="82" height="7" rx="2" fill="var(--hv-t3)" />
        </g>
        <g transform="translate(870,140)">
          <rect width="220" height="80" rx="3" fill="var(--hv-surface)" stroke="var(--hv-line-2)" />
          <text x="14" y="24" className="hv-graph-title">{labels.forecasts}</text>
          <path d="M14 66 C 40 60, 60 52, 90 56 S 130 40, 150 44" fill="none" stroke="var(--hv-t1)" strokeWidth="2" />
          <path d="M150 44 L 206 30 L 206 54 Z" fill="var(--hv-accent-soft)" />
          <path d="M150 44 L 206 42" stroke="var(--hv-accent)" strokeDasharray="3 3" />
        </g>
        <g transform="translate(870,250)">
          <rect width="220" height="80" rx="3" fill="var(--hv-surface)" stroke="var(--hv-ink)" strokeWidth="1.2" />
          <text x="14" y="24" className="hv-graph-title">{labels.recommendations}</text>
          <text x="14" y="46" className="hv-graph-small">{labels.supports}</text>
          <text x="14" y="64" className="hv-graph-small">{labels.cannot}</text>
        </g>
        <g transform="translate(870,340)">
          <rect width="220" height="60" rx="3" fill="var(--hv-surface)" stroke="var(--hv-line-2)" />
          <text x="14" y="24" className="hv-graph-title">{labels.dashboards}</text>
          <g fill="var(--hv-surface-3)">
            <rect x="14" y="36" width="56" height="14" rx="2" />
            <rect x="76" y="36" width="56" height="14" rx="2" />
            <rect x="138" y="36" width="68" height="14" rx="2" />
          </g>
        </g>
      </svg>
      <div className="hv-graph-caption">
        <span>{methodGraph.caption}</span>
      </div>
    </div>
  )
}

export default MethodGraph
