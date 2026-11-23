// Parcours vertical : une ligne fine, un point par étape, l'étape en cours en bleu.
// Apparaît dans la colonne de gauche de la section About (design/screens/02-about.png).
import type { PlaceholderTimelineStep } from '../../data/placeholders'
import { cn } from '../../lib/cn'

type TimelineProps = {
  steps: PlaceholderTimelineStep[]
  label: string
  className?: string
}

function Timeline({ steps, label, className }: TimelineProps) {
  return (
    <ol
      className={cn('timeline', className)}
      aria-label={label}
    >
      {steps.map((step) => (
        <li
          key={`${step.when}-${step.what}`}
          className={cn(
            'timeline__step',
            step.current && 'is-current',
            step.next && 'is-next',
          )}
          aria-current={step.current ? 'step' : undefined}
        >
          <span className="timeline__when">{step.when}</span>
          <span className="timeline__what">{step.what}</span>
        </li>
      ))}
    </ol>
  )
}

export default Timeline
