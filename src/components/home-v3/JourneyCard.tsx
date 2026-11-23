// Bloc « Mon parcours » (mobile et tablette) : frise horizontale cliquable, descriptif de l'étape choisie
// juste dessous (avec une pointe sous le point), puis bouton CV (le même qu'en version ordinateur).
// Remplace la frise verticale de la colonne de gauche sur les écrans de moins de 1024 px (section About).
// Clavier : flèches gauche/droite (+ Début/Fin) changent d'étape. ARIA : tablist / tab / tabpanel.
import { useId, useRef, useState, type CSSProperties, type KeyboardEvent } from 'react'
import type { PlaceholderTimelineStep } from '../../data/placeholders'
import { cn } from '../../lib/cn'
import Button from '../ui/Button'
import ResumeIcon from '../ui/ResumeIcon'

type JourneyCardProps = {
  title: string
  steps: PlaceholderTimelineStep[]
  currentPlace: string
  resumeLabel: string
  resumeHref: string
  className?: string
}

function JourneyCard({
  title,
  steps,
  currentPlace,
  resumeLabel,
  resumeHref,
  className,
}: JourneyCardProps) {
  const baseId = useId()
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([])

  // L'étape « en cours » (2026) est sélectionnée par défaut
  const defaultIndex = Math.max(
    0,
    steps.findIndex((step) => step.current),
  )
  const [selectedIndex, setSelectedIndex] = useState(defaultIndex)
  const selectedStep = steps[selectedIndex]

  function selectStep(index: number) {
    setSelectedIndex(index)
    tabRefs.current[index]?.focus()
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const lastIndex = steps.length - 1
    const nextIndexByKey: Record<string, number> = {
      ArrowRight: Math.min(selectedIndex + 1, lastIndex),
      ArrowLeft: Math.max(selectedIndex - 1, 0),
      Home: 0,
      End: lastIndex,
    }
    const nextIndex = nextIndexByKey[event.key]

    if (nextIndex === undefined) return

    event.preventDefault()
    selectStep(nextIndex)
  }

  // Valeurs réellement dynamiques, donc passées en variables CSS : nombre d'étapes et position de la pointe
  // (centre de la colonne de l'étape choisie, en % de la largeur de la frise).
  const timelineStyle = {
    '--step-count': steps.length,
    '--caret-position': `${((selectedIndex + 0.5) / steps.length) * 100}%`,
  } as CSSProperties

  return (
    <section className={cn('journey', className)}>
      <h3 className="eyebrow">{title}</h3>

      <div
        className="journey__timeline"
        style={timelineStyle}
      >
        <div
          className="journey__strip"
          role="tablist"
          aria-label={title}
          onKeyDown={handleKeyDown}
        >
          {steps.map((step, index) => {
            const isSelected = index === selectedIndex

            return (
              <button
                key={`${step.when}-${step.what}`}
                ref={(element) => {
                  tabRefs.current[index] = element
                }}
                id={`${baseId}-tab-${index}`}
                type="button"
                role="tab"
                className={cn(
                  'journey__tab',
                  step.current && 'is-current',
                  isSelected && 'is-selected',
                  step.next && 'is-next',
                )}
                aria-selected={isSelected}
                aria-controls={`${baseId}-panel`}
                tabIndex={isSelected ? 0 : -1}
                onClick={() => setSelectedIndex(index)}
              >
                <span className="journey__dot" />
                <span className="journey__year tabular">{step.when}</span>
              </button>
            )
          })}
        </div>

        <div
          id={`${baseId}-panel`}
          className="journey__panel"
          role="tabpanel"
          aria-labelledby={`${baseId}-tab-${selectedIndex}`}
        >
          <p className="journey__what">{selectedStep.what}</p>
          <p className="journey__place tabular">{selectedStep.current ? currentPlace : selectedStep.when}</p>
        </div>
      </div>

      <div className="journey__resume">
        <Button
          variant="solid"
          href={resumeHref}
          download
          icon={<ResumeIcon />}
        >
          {resumeLabel}
        </Button>
      </div>
    </section>
  )
}

export default JourneyCard
