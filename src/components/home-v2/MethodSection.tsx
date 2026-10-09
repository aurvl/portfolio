import { useRef, useState } from 'react'
import type { MethodStep } from '../../data/home'
import { useHomeContent } from '../../hooks/useHomeContent'
import Reveal from './Reveal'

type MethodSectionProps = {
  activeStep: number
  onSelectStep: (index: number) => void
}

function StepDetails({ step }: { step: MethodStep }) {
  const { method } = useHomeContent().content

  return (
    <>
      <p className="hv-method__statement">{step.statement}</p>
      <div className="hv-method__cards">
        <div className="hv-card hv-method__card">
          <div className="hv-kicker">{method.questionsLabel}</div>
          <ul className="hv-questions">
            {step.questions.map((question) => (
              <li key={question}>{question}</li>
            ))}
          </ul>
        </div>
        <div className="hv-card hv-method__card">
          <div className="hv-kicker">{method.outputLabel}</div>
          <p className="hv-method__output">{step.output}</p>
        </div>
      </div>
      <div className="hv-method__principle">
        <b>{step.principle[0]}</b>
        <span>{step.principle[1]}</span>
      </div>
    </>
  )
}

// Tablet and mobile: one swipeable card per step, so readers never scroll back up to switch steps.
function MethodCarousel() {
  const { method } = useHomeContent().content
  const methodSteps = method.steps
  const trackRef = useRef<HTMLDivElement | null>(null)
  const [current, setCurrent] = useState(0)

  const handleScroll = () => {
    const track = trackRef.current
    const firstCard = track?.firstElementChild as HTMLElement | null

    if (!track || !firstCard) return

    const step = firstCard.offsetWidth + parseFloat(getComputedStyle(track).columnGap || '0')
    setCurrent(Math.min(methodSteps.length - 1, Math.round(track.scrollLeft / step)))
  }

  const goTo = (index: number) => {
    const card = trackRef.current?.children[index] as HTMLElement | undefined
    card?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' })
  }

  return (
    <div className="hv-method-carousel">
      <div className="hv-method-carousel__track" ref={trackRef} onScroll={handleScroll}>
        {methodSteps.map((step, index) => (
          <article key={step.title} className="hv-method-carousel__card" aria-label={`${method.stepLabel} ${index + 1}: ${step.title}`}>
            <header className="hv-method-carousel__head">
              <span className="hv-method__num">{`0${index + 1}`}</span>
              <div>
                <b>{step.title}</b>
                <span>{step.short}</span>
              </div>
            </header>
            <StepDetails step={step} />
          </article>
        ))}
      </div>
      <div className="hv-method-carousel__nav">
        <div className="hv-method-carousel__dots">
          {methodSteps.map((step, index) => (
            <button
              key={step.title}
              type="button"
              aria-label={`${method.goToStep} ${index + 1}: ${step.title}`}
              aria-current={index === current ? 'step' : undefined}
              className={index === current ? 'is-active' : ''}
              onClick={() => goTo(index)}
            />
          ))}
        </div>
        <span className="hv-method-carousel__hint">{method.swipeHint}</span>
      </div>
    </div>
  )
}

function MethodSection({ activeStep, onSelectStep }: MethodSectionProps) {
  const { method } = useHomeContent().content
  const methodSteps = method.steps
  const step = methodSteps[activeStep]

  return (
    <div className="hv-wrap">
      <Reveal className="hv-intro">
        <h2 className="hv-h2">{method.title}</h2>
        <p>{method.intro}</p>
      </Reveal>
      <Reveal className="hv-method">
        <div className="hv-method__steps" role="tablist" aria-label={method.tabsLabel}>
          {methodSteps.map((item, index) => (
            <button
              key={item.title}
              type="button"
              role="tab"
              aria-selected={index === activeStep}
              className={`hv-method__step ${index === activeStep ? 'is-active' : ''}`}
              onClick={() => onSelectStep(index)}
            >
              <span className="hv-method__num">{`0${index + 1}`}</span>
              <span className="hv-method__title">{item.title}</span>
              <span className="hv-method__short">{item.short}</span>
            </button>
          ))}
        </div>
        <div className="hv-method__panel" role="tabpanel">
          <div className="hv-progress" aria-hidden="true">
            {methodSteps.map((item, index) => (
              <span key={item.title} className={index <= activeStep ? 'is-on' : ''} />
            ))}
          </div>
          <StepDetails step={step} />
        </div>
      </Reveal>
      <MethodCarousel />
    </div>
  )
}

export default MethodSection
