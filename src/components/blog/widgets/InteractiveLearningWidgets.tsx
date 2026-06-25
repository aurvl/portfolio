import { useMemo, useState, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import './InteractiveLearningWidgets.css'

type Locale = 'fr' | 'en'

type SliderDefinition = {
  id: string
  label: string
  value: number
  min: number
  max: number
  step: number
  unit?: string
  onChange: (value: number) => void
}

const numberFormatter = new Intl.NumberFormat('en-US', {
  maximumFractionDigits: 1,
  minimumFractionDigits: 0,
})

const POWER_PLANT_WEIGHTS = {
  temperature: 3.2,
  hour: 1.5,
  weekday: 4,
  event: 12,
}

function formatNumber(value: number, digits = 1) {
  return value.toFixed(digits)
}

function useLocale(): Locale {
  const { i18n } = useTranslation()
  return i18n.language?.startsWith('fr') ? 'fr' : 'en'
}

function RangeControl({ slider }: { slider: SliderDefinition }) {
  const updateValue = (value: string) => {
    slider.onChange(Number(value))
  }

  return (
    <label className="interactive-widget__range" htmlFor={slider.id}>
      <span className="interactive-widget__range-top">
        <span>{slider.label}</span>
        <strong>
          {numberFormatter.format(slider.value)}
          {slider.unit ? ` ${slider.unit}` : ''}
        </strong>
      </span>
      <input
        id={slider.id}
        type="range"
        min={slider.min}
        max={slider.max}
        step={slider.step}
        value={slider.value}
        onChange={(event) => updateValue(event.currentTarget.value)}
        onInput={(event) => updateValue(event.currentTarget.value)}
      />
    </label>
  )
}

function WidgetShell({
  kicker,
  title,
  description,
  formula,
  children,
}: {
  kicker: string
  title: string
  description: string
  formula: string
  children: ReactNode
}) {
  return (
    <section className="interactive-widget" aria-label={title}>
      <div className="interactive-widget__intro">
        <span className="interactive-widget__kicker">{kicker}</span>
        <h3>{title}</h3>
        <p>{description}</p>
        <div className="interactive-widget__formula">{formula}</div>
      </div>
      {children}
    </section>
  )
}

function ContributionBar({
  label,
  value,
  max,
}: {
  label: string
  value: number
  max: number
}) {
  const width = Math.min(Math.abs(value) / max, 1) * 100
  const isPositive = value >= 0

  return (
    <div className="interactive-widget__contribution">
      <span>{label}</span>
      <div className="interactive-widget__bar-track" aria-hidden="true">
        <span
          className={`interactive-widget__bar interactive-widget__bar--${isPositive ? 'positive' : 'negative'}`}
          style={{ width: `${width}%` }}
        />
      </div>
      <strong>
        {isPositive ? '+' : ''}
        {formatNumber(value)} MW
      </strong>
    </div>
  )
}

export function PowerPlantPerceptronWidget() {
  const locale = useLocale()
  const [temperature, setTemperature] = useState(-8)
  const [hour, setHour] = useState(19)
  const [weekday, setWeekday] = useState(1)
  const [event, setEvent] = useState(1)
  const [bias, setBias] = useState(50)

  const labels = {
    fr: {
      kicker: 'Perceptron simple',
      title: 'La centrale électrique en mouvement',
      description:
        'Modifie les entrées et observe comment chaque variable contribue à la consommation prédite.',
      temp: 'Température',
      hour: 'Heure',
      weekday: 'Jour de semaine',
      event: 'Événement TV',
      bias: 'Biais',
      prediction: 'Consommation prédite',
      coldSignal: 'Froid',
      peakSignal: 'Pic horaire',
      matchSignal: 'Match',
      weekdaySignal: 'Semaine',
    },
    en: {
      kicker: 'Simple perceptron',
      title: 'The power plant in motion',
      description:
        'Move the inputs and see how each variable contributes to the predicted consumption.',
      temp: 'Temperature',
      hour: 'Hour',
      weekday: 'Weekday',
      event: 'TV event',
      bias: 'Bias',
      prediction: 'Predicted consumption',
      coldSignal: 'Cold',
      peakSignal: 'Peak hour',
      matchSignal: 'Match',
      weekdaySignal: 'Weekday',
    },
  }[locale]

  const contributions = useMemo(
    () => [
      {
        label: labels.temp,
        value: POWER_PLANT_WEIGHTS.temperature * temperature,
      },
      {
        label: labels.hour,
        value: POWER_PLANT_WEIGHTS.hour * hour,
      },
      {
        label: labels.weekday,
        value: POWER_PLANT_WEIGHTS.weekday * weekday,
      },
      {
        label: labels.event,
        value: POWER_PLANT_WEIGHTS.event * event,
      },
      {
        label: labels.bias,
        value: bias,
      },
    ],
    [bias, event, hour, labels.bias, labels.event, labels.hour, labels.temp, labels.weekday, temperature, weekday],
  )

  const prediction = contributions.reduce((sum, item) => sum + item.value, 0)
  const maxContribution = Math.max(...contributions.map((item) => Math.abs(item.value)), 1)

  const sliders: SliderDefinition[] = [
    {
      id: 'power-temperature',
      label: labels.temp,
      value: temperature,
      min: -15,
      max: 25,
      step: 1,
      unit: '°C',
      onChange: setTemperature,
    },
    {
      id: 'power-hour',
      label: labels.hour,
      value: hour,
      min: 0,
      max: 23,
      step: 1,
      unit: 'h',
      onChange: setHour,
    },
    {
      id: 'power-weekday',
      label: labels.weekday,
      value: weekday,
      min: 0,
      max: 1,
      step: 1,
      onChange: setWeekday,
    },
    {
      id: 'power-event',
      label: labels.event,
      value: event,
      min: 0,
      max: 1,
      step: 1,
      onChange: setEvent,
    },
    {
      id: 'power-bias',
      label: labels.bias,
      value: bias,
      min: 20,
      max: 80,
      step: 1,
      unit: 'MW',
      onChange: setBias,
    },
  ]

  return (
    <WidgetShell
      kicker={labels.kicker}
      title={labels.title}
      description={labels.description}
      formula="ŷ = w₁x₁ + w₂x₂ + w₃x₃ + w₄x₄ + b"
    >
      <div className="interactive-widget__power-grid">
        <div className="interactive-widget__meter" aria-live="polite">
          <span>{labels.prediction}</span>
          <strong>{formatNumber(prediction)} MW</strong>
          <div className="interactive-widget__gauge" aria-hidden="true">
            <span style={{ transform: `rotate(${Math.min(Math.max((prediction - 10) / 100, 0), 1) * 180 - 90}deg)` }} />
          </div>
          <div className="interactive-widget__signals">
            <span>{labels.coldSignal}</span>
            <span>{labels.peakSignal}</span>
            <span>{labels.weekdaySignal}</span>
            <span>{labels.matchSignal}</span>
          </div>
        </div>

        <div className="interactive-widget__contributions">
          {contributions.map((item) => (
            <ContributionBar
              key={item.label}
              label={item.label}
              value={item.value}
              max={maxContribution}
            />
          ))}
        </div>

        <div className="interactive-widget__controls">
          {sliders.map((slider) => (
            <RangeControl key={slider.id} slider={slider} />
          ))}
        </div>
      </div>
    </WidgetShell>
  )
}

function sigmoid(value: number) {
  return 1 / (1 + Math.exp(-value))
}

export function SigmoidActivationWidget() {
  const locale = useLocale()
  const [score, setScore] = useState(0)
  const probability = sigmoid(score)
  const pointX = ((score + 8) / 16) * 100
  const pointY = (1 - probability) * 100

  const labels = {
    fr: {
      kicker: 'Perceptron complet',
      title: 'Du score brut à la probabilité',
      description:
        'Déplace le score linéaire z : la sigmoïde compresse toute valeur entre 0 et 1.',
      score: 'Score z',
      probability: 'Probabilité',
      decision: 'Décision',
      delayed: 'retard probable',
      onTime: 'pas de retard probable',
      threshold: 'seuil 0.5',
    },
    en: {
      kicker: 'Complete perceptron',
      title: 'From raw score to probability',
      description:
        'Move the linear score z: the sigmoid compresses any value between 0 and 1.',
      score: 'Score z',
      probability: 'Probability',
      decision: 'Decision',
      delayed: 'delay likely',
      onTime: 'delay unlikely',
      threshold: '0.5 threshold',
    },
  }[locale]

  const path = Array.from({ length: 81 }, (_, index) => {
    const xValue = -8 + (16 * index) / 80
    const x = ((xValue + 8) / 16) * 100
    const y = (1 - sigmoid(xValue)) * 100
    return `${index === 0 ? 'M' : 'L'} ${x.toFixed(2)} ${y.toFixed(2)}`
  }).join(' ')

  return (
    <WidgetShell
      kicker={labels.kicker}
      title={labels.title}
      description={labels.description}
      formula="a = σ(z) = 1 / (1 + e⁻ᶻ)"
    >
      <div className="interactive-widget__sigmoid-grid">
        <div className="interactive-widget__chart" aria-hidden="true">
          <svg viewBox="0 0 100 100" preserveAspectRatio="none">
            <line x1="0" y1="50" x2="100" y2="50" className="interactive-widget__axis" />
            <line x1="50" y1="0" x2="50" y2="100" className="interactive-widget__axis" />
            <line x1="0" y1="50" x2="100" y2="50" className="interactive-widget__threshold" />
            <path d={path} className="interactive-widget__curve" />
            <circle cx={pointX} cy={pointY} r="2.8" className="interactive-widget__point" />
          </svg>
          <span className="interactive-widget__chart-label interactive-widget__chart-label--top">1</span>
          <span className="interactive-widget__chart-label interactive-widget__chart-label--mid">0.5</span>
          <span className="interactive-widget__chart-label interactive-widget__chart-label--bottom">0</span>
        </div>

        <div className="interactive-widget__probability" aria-live="polite">
          <span>{labels.probability}</span>
          <strong>{Math.round(probability * 100)}%</strong>
          <p>
            {labels.decision}: {probability >= 0.5 ? labels.delayed : labels.onTime}
          </p>
          <small>{labels.threshold}</small>
        </div>

        <div className="interactive-widget__controls">
          <RangeControl
            slider={{
              id: 'sigmoid-score',
              label: labels.score,
              value: score,
              min: -8,
              max: 8,
              step: 0.1,
              onChange: setScore,
            }}
          />
        </div>
      </div>
    </WidgetShell>
  )
}
