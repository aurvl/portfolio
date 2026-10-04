import { Link } from 'react-router-dom'
import type { Evidence } from '../../data/home'
import { useHomeContent } from '../../hooks/useHomeContent'
import Reveal from './Reveal'

type HelpSectionProps = {
  onNavigate: (sectionId: string) => void
}

function EvidenceLink({ evidence }: { evidence: Evidence }) {
  if (evidence.href.startsWith('/')) {
    return <Link to={evidence.href}>{evidence.label}</Link>
  }

  const isExternal = evidence.href.startsWith('http')

  return (
    <a href={evidence.href} target={isExternal ? '_blank' : undefined} rel={isExternal ? 'noreferrer' : undefined}>
      {evidence.label}
    </a>
  )
}

function HelpSection({ onNavigate }: HelpSectionProps) {
  const { help } = useHomeContent().content

  return (
    <div className="hv-wrap">
      <Reveal className="hv-intro">
        <h2 className="hv-h2">{help.title}</h2>
        <p>{help.intro}</p>
      </Reveal>

      <Reveal className="hv-help">
        {help.problems.map((problem) => (
          <div key={problem.quote} className="hv-card hv-help__card">
            <q>{problem.quote}</q>
            <p>{problem.answer}</p>
            <div className="hv-help__evidence">
              {help.evidenceLabel}{' '}
              {problem.evidence.map((evidence, index) => (
                <span key={evidence.label}>
                  {index > 0 && ' · '}
                  <EvidenceLink evidence={evidence} />
                </span>
              ))}
            </div>
          </div>
        ))}
      </Reveal>

      <div className="hv-help__foot">
        <div className="hv-help__formats">
          <span>{help.formatsLabel}</span>
          {help.formats.map((format) => (
            <span key={format} className="hv-tag">{format}</span>
          ))}
        </div>
        <div className="hv-help__cta">
          <button type="button" className="hv-btn hv-btn--primary hv-btn--sm" onClick={() => onNavigate('contact-form')}>
            {help.cta}
          </button>
        </div>
      </div>
    </div>
  )
}

export default HelpSection
