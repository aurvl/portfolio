import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react'
import { useTranslation } from 'react-i18next'
import { FiCloudRain, FiExternalLink, FiRefreshCw } from 'react-icons/fi'
import { withBasePath } from '../../../lib/site'
import './ParisRainMlpWidget.css'

type Locale = 'fr' | 'en'
type AnimationPhase = 'idle' | 'loading' | 'inputs' | 'hidden' | 'output' | 'done' | 'error'

type DenseLayer = {
  weights: number[][]
  biases: number[]
  activation: 'relu' | 'sigmoid'
}

type ModelArtifact = {
  modelType: string
  location: {
    name: string
    timezone: string
  }
  task: {
    windowDays: number
    rainThresholdMm: number
  }
  dailyFeatures: string[]
  featureNames: string[]
  preprocessing: {
    mean: number[]
    scale: number[]
  }
  layers: DenseLayer[]
  calibration: {
    coefficient: number
    intercept: number
  }
  metrics: {
    test_calibrated: {
      roc_auc: number
      brier_score: number
    }
  }
}

type OpenMeteoDaily = {
  time: string[]
  temperature_2m_mean: number[]
  temperature_2m_min: number[]
  temperature_2m_max: number[]
  precipitation_sum: number[]
  precipitation_hours: number[]
  wind_speed_10m_max: number[]
  sunshine_duration: number[]
}

type OpenMeteoResponse = {
  daily?: OpenMeteoDaily
}

type WeatherDay = {
  date: string
  temperatureMean: number
  temperatureMin: number
  temperatureMax: number
  precipitation: number
  precipitationHours: number
  windSpeedMax: number
  sunshineHours: number
}

type PredictionResult = {
  history: WeatherDay[]
  targetDate: string
  probability: number
  hiddenActivations: number[]
  artifact: ModelArtifact
}

const MODEL_URL = 'assets/blog/models/paris-rain-mlp.json'
const MODEL_REPOSITORY = 'https://github.com/aurvl/paris-rain-mlp'
const CACHE_KEY = 'paris-rain-mlp-live-weather-v1'
const PARIS_TIMEZONE = 'Europe/Paris'

function sigmoid(value: number) {
  const clipped = Math.max(-500, Math.min(500, value))
  return 1 / (1 + Math.exp(-clipped))
}

function denseForward(inputs: number[], layer: DenseLayer) {
  return layer.biases.map((bias, outputIndex) => {
    const weightedSum = inputs.reduce(
      (sum, input, inputIndex) => sum + input * layer.weights[inputIndex][outputIndex],
      bias,
    )
    return layer.activation === 'sigmoid' ? sigmoid(weightedSum) : Math.max(0, weightedSum)
  })
}

function getParisDate() {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: PARIS_TIMEZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(new Date())
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]))
  return `${values.year}-${values.month}-${values.day}`
}

function addDays(isoDate: string, days: number) {
  const date = new Date(`${isoDate}T12:00:00Z`)
  date.setUTCDate(date.getUTCDate() + days)
  return date.toISOString().slice(0, 10)
}

function dayOfYear(isoDate: string) {
  const date = new Date(`${isoDate}T12:00:00Z`)
  const yearStart = Date.UTC(date.getUTCFullYear(), 0, 1)
  return Math.floor((date.getTime() - yearStart) / 86_400_000) + 1
}

function buildForecastUrl() {
  const params = new URLSearchParams({
    latitude: '48.8566',
    longitude: '2.3522',
    daily: [
      'temperature_2m_mean',
      'temperature_2m_min',
      'temperature_2m_max',
      'precipitation_sum',
      'precipitation_hours',
      'wind_speed_10m_max',
      'sunshine_duration',
    ].join(','),
    past_days: '7',
    forecast_days: '2',
    timezone: PARIS_TIMEZONE,
  })
  return `https://api.open-meteo.com/v1/forecast?${params.toString()}`
}

function parseWeatherDays(daily: OpenMeteoDaily, today: string) {
  const historyIndexes = daily.time
    .map((date, index) => ({ date, index }))
    .filter(({ date }) => date < today)
    .slice(-7)

  if (historyIndexes.length !== 7) {
    throw new Error('Seven completed weather days are not available.')
  }

  return historyIndexes.map(({ date, index }) => ({
    date,
    temperatureMean: daily.temperature_2m_mean[index],
    temperatureMin: daily.temperature_2m_min[index],
    temperatureMax: daily.temperature_2m_max[index],
    precipitation: daily.precipitation_sum[index],
    precipitationHours: daily.precipitation_hours[index],
    windSpeedMax: daily.wind_speed_10m_max[index],
    sunshineHours: daily.sunshine_duration[index] / 3600,
  }))
}

function buildFeatureVector(history: WeatherDay[], targetDate: string, artifact: ModelArtifact) {
  const values = new Map<string, number>()
  history.forEach((day, index) => {
    const lag = history.length - index
    values.set(`temperature_2m_mean_lag_${lag}`, day.temperatureMean)
    values.set(`temperature_2m_min_lag_${lag}`, day.temperatureMin)
    values.set(`temperature_2m_max_lag_${lag}`, day.temperatureMax)
    values.set(`precipitation_sum_lag_${lag}`, day.precipitation)
    values.set(`precipitation_hours_lag_${lag}`, day.precipitationHours)
    values.set(`wind_speed_10m_max_lag_${lag}`, day.windSpeedMax)
    values.set(`sunshine_duration_lag_${lag}`, day.sunshineHours)
  })

  const angle = (2 * Math.PI * dayOfYear(targetDate)) / 365.25
  values.set('target_day_sin', Math.sin(angle))
  values.set('target_day_cos', Math.cos(angle))

  return artifact.featureNames.map((featureName) => {
    const value = values.get(featureName)
    if (value === undefined || !Number.isFinite(value)) {
      throw new Error(`Missing live feature: ${featureName}`)
    }
    return value
  })
}

function runInference(features: number[], artifact: ModelArtifact) {
  let activations = features.map(
    (value, index) => (value - artifact.preprocessing.mean[index]) / artifact.preprocessing.scale[index],
  )
  let hiddenActivations: number[] = []

  artifact.layers.forEach((layer, index) => {
    activations = denseForward(activations, layer)
    if (index === 0) {
      hiddenActivations = [...activations]
    }
  })

  const rawProbability = Math.min(1 - 1e-7, Math.max(1e-7, activations[0]))
  const logit = Math.log(rawProbability / (1 - rawProbability))
  const probability = sigmoid(
    artifact.calibration.coefficient * logit + artifact.calibration.intercept,
  )
  return { probability, hiddenActivations }
}

async function loadLivePrediction(): Promise<PredictionResult> {
  const today = getParisDate()
  const cached = sessionStorage.getItem(CACHE_KEY)
  let weatherResponse: OpenMeteoResponse | null = null

  if (cached) {
    try {
      const parsed = JSON.parse(cached) as { date: string; payload: OpenMeteoResponse }
      if (parsed.date === today) {
        weatherResponse = parsed.payload
      }
    } catch {
      sessionStorage.removeItem(CACHE_KEY)
    }
  }

  const [artifactResponse, fetchedWeather] = await Promise.all([
    fetch(withBasePath(MODEL_URL)),
    weatherResponse
      ? Promise.resolve(null)
      : fetch(buildForecastUrl()).then(async (response) => {
          if (!response.ok) {
            throw new Error(`Open-Meteo returned ${response.status}.`)
          }
          return (await response.json()) as OpenMeteoResponse
        }),
  ])

  if (!artifactResponse.ok) {
    throw new Error(`Model artifact returned ${artifactResponse.status}.`)
  }

  const artifact = (await artifactResponse.json()) as ModelArtifact
  const payload = weatherResponse ?? fetchedWeather
  if (!payload?.daily) {
    throw new Error('Open-Meteo daily data is unavailable.')
  }

  if (!weatherResponse) {
    sessionStorage.setItem(CACHE_KEY, JSON.stringify({ date: today, payload }))
  }

  const history = parseWeatherDays(payload.daily, today)
  const targetDate = addDays(today, 1)
  const features = buildFeatureVector(history, targetDate, artifact)
  const inference = runInference(features, artifact)
  return { history, targetDate, artifact, ...inference }
}

function phaseReached(current: AnimationPhase, target: AnimationPhase) {
  const order: AnimationPhase[] = ['idle', 'loading', 'inputs', 'hidden', 'output', 'done']
  return order.indexOf(current) >= order.indexOf(target)
}

export function ParisRainMlpWidget() {
  const { i18n } = useTranslation()
  const locale: Locale = i18n.language?.startsWith('fr') ? 'fr' : 'en'
  const rootRef = useRef<HTMLElement>(null)
  const timersRef = useRef<number[]>([])
  const [isVisible, setIsVisible] = useState(false)
  const [attempt, setAttempt] = useState(0)
  const [phase, setPhase] = useState<AnimationPhase>('idle')
  const [result, setResult] = useState<PredictionResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  const labels = useMemo(
    () =>
      ({
        fr: {
          kicker: 'MLP en conditions réelles',
          title: 'Pleuvra-t-il demain à Paris ?',
          description:
            'Sept jours météo traversent un réseau 51 → 8 → 1 entraîné sur 2015–2022.',
          loading: 'Récupération des sept derniers jours et chargement du modèle…',
          inputs: '7 jours',
          features: '51 entrées',
          hidden: '8 neurones cachés',
          output: 'Probabilité',
          probability: 'Probabilité de pluie significative',
          tomorrow: 'pour le',
          threshold: 'Pluie significative : au moins 1 mm',
          replay: "Rejouer l'animation",
          retry: 'Réessayer',
          unavailable: 'La prédiction live est momentanément indisponible.',
          source: 'Données live Open-Meteo',
          model: 'Projet et modèle',
          metric: 'ROC-AUC test 2025',
          educational: 'Démonstration pédagogique, pas une prévision météo officielle.',
          rain: 'pluie',
          dry: 'sec',
        },
        en: {
          kicker: 'MLP in real conditions',
          title: 'Will it rain tomorrow in Paris?',
          description: 'Seven weather days flow through a 51 → 8 → 1 network trained on 2015–2022.',
          loading: 'Fetching the latest seven days and loading the model…',
          inputs: '7 days',
          features: '51 inputs',
          hidden: '8 hidden neurons',
          output: 'Probability',
          probability: 'Probability of meaningful rain',
          tomorrow: 'for',
          threshold: 'Meaningful rain: at least 1 mm',
          replay: 'Replay animation',
          retry: 'Try again',
          unavailable: 'The live prediction is temporarily unavailable.',
          source: 'Live Open-Meteo data',
          model: 'Project and model',
          metric: '2025 test ROC-AUC',
          educational: 'Educational demonstration, not an official weather forecast.',
          rain: 'rain',
          dry: 'dry',
        },
      })[locale],
    [locale],
  )

  const clearTimers = () => {
    timersRef.current.forEach((timer) => window.clearTimeout(timer))
    timersRef.current = []
  }

  const playAnimation = () => {
    clearTimers()
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reducedMotion) {
      setPhase('done')
      return
    }
    setPhase('inputs')
    timersRef.current = [
      window.setTimeout(() => setPhase('hidden'), 700),
      window.setTimeout(() => setPhase('output'), 1_450),
      window.setTimeout(() => setPhase('done'), 2_150),
    ]
  }

  useEffect(() => {
    const node = rootRef.current
    if (!node || isVisible) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { rootMargin: '120px', threshold: 0.1 },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [isVisible])

  useEffect(() => {
    if (!isVisible) return
    let cancelled = false
    clearTimers()
    setPhase('loading')
    setError(null)

    loadLivePrediction()
      .then((prediction) => {
        if (cancelled) return
        setResult(prediction)
        playAnimation()
      })
      .catch((reason: unknown) => {
        if (cancelled) return
        console.error('Paris rain MLP prediction failed', reason)
        setError(reason instanceof Error ? reason.message : String(reason))
        setPhase('error')
      })

    return () => {
      cancelled = true
      clearTimers()
    }
    // attempt intentionally restarts the complete live pipeline.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [attempt, isVisible])

  const dateFormatter = useMemo(
    () =>
      new Intl.DateTimeFormat(locale === 'fr' ? 'fr-FR' : 'en-GB', {
        day: '2-digit',
        month: 'short',
        timeZone: PARIS_TIMEZONE,
      }),
    [locale],
  )

  const formatDate = (value: string) => dateFormatter.format(new Date(`${value}T12:00:00Z`))
  const probabilityPercent = result ? Math.round(result.probability * 100) : 0
  const rainy = probabilityPercent >= 50

  return (
    <section
      ref={rootRef}
      className="interactive-widget rain-mlp-widget"
      data-phase={phase}
      aria-label={labels.title}
    >
      <div className="interactive-widget__intro rain-mlp-widget__intro">
        <span className="interactive-widget__kicker">{labels.kicker}</span>
        <h3>{labels.title}</h3>
        <p>{labels.description}</p>
        <div className="interactive-widget__formula">X₇ → ReLU(W₁X + b₁) → σ(W₂H + b₂)</div>
      </div>

      {phase === 'loading' && (
        <div className="rain-mlp-widget__state" role="status">
          <span className="rain-mlp-widget__loader" aria-hidden="true" />
          <p>{labels.loading}</p>
        </div>
      )}

      {phase === 'error' && (
        <div className="rain-mlp-widget__state rain-mlp-widget__state--error" role="alert">
          <FiCloudRain aria-hidden="true" />
          <p>{labels.unavailable}</p>
          {error && <small>{error}</small>}
          <button type="button" onClick={() => setAttempt((value) => value + 1)}>
            <FiRefreshCw aria-hidden="true" /> {labels.retry}
          </button>
        </div>
      )}

      {result && phase !== 'loading' && phase !== 'error' && (
        <div className="rain-mlp-widget__body">
          <div className="rain-mlp-widget__days" aria-label={labels.inputs}>
            {result.history.map((day) => (
              <article className="rain-mlp-widget__day" key={day.date}>
                <span>{formatDate(day.date)}</span>
                <strong>{Math.round(day.temperatureMean)}°</strong>
                <small>{day.precipitation.toFixed(1)} mm</small>
              </article>
            ))}
          </div>

          <div className="rain-mlp-widget__network" aria-label="51 → 8 → 1">
            <div className="rain-mlp-widget__network-column rain-mlp-widget__network-column--input">
              <strong>{labels.features}</strong>
              <div className="rain-mlp-widget__nodes">
                {Array.from({ length: 7 }, (_, index) => (
                  <span key={`input-${index}`} style={{ '--node-delay': `${index * 60}ms` } as CSSProperties} />
                ))}
              </div>
            </div>
            <div className="rain-mlp-widget__flow" aria-hidden="true"><span /></div>
            <div className="rain-mlp-widget__network-column rain-mlp-widget__network-column--hidden">
              <strong>{labels.hidden}</strong>
              <div className="rain-mlp-widget__nodes">
                {result.hiddenActivations.map((activation, index) => (
                  <span
                    key={`hidden-${index}`}
                    style={{
                      '--node-delay': `${index * 70}ms`,
                      '--node-energy': Math.max(0.18, Math.min(1, activation / 3)),
                    } as CSSProperties}
                  />
                ))}
              </div>
            </div>
            <div className="rain-mlp-widget__flow rain-mlp-widget__flow--output" aria-hidden="true"><span /></div>
            <div className="rain-mlp-widget__network-column rain-mlp-widget__network-column--output">
              <strong>{labels.output}</strong>
              <span className="rain-mlp-widget__output-node"><FiCloudRain aria-hidden="true" /></span>
            </div>
          </div>

          <div className="rain-mlp-widget__result" aria-live="polite">
            <div>
              <span>{labels.probability}</span>
              <strong>{probabilityPercent}%</strong>
              <p>{labels.tomorrow} {formatDate(result.targetDate)} · {rainy ? labels.rain : labels.dry}</p>
            </div>
            <div className="rain-mlp-widget__probability-track" aria-hidden="true">
              <span style={{ width: phaseReached(phase, 'output') ? `${probabilityPercent}%` : '0%' }} />
            </div>
            <small>{labels.threshold}</small>
          </div>

          <div className="rain-mlp-widget__actions">
            <button type="button" onClick={playAnimation}>
              <FiRefreshCw aria-hidden="true" /> {labels.replay}
            </button>
            <a href={MODEL_REPOSITORY} target="_blank" rel="noreferrer">
              {labels.model} <FiExternalLink aria-hidden="true" />
            </a>
          </div>

          <footer className="rain-mlp-widget__footer">
            <span>{labels.source}</span>
            <span>{labels.metric} {result.artifact.metrics.test_calibrated.roc_auc.toFixed(3)}</span>
            <span>{labels.educational}</span>
          </footer>
        </div>
      )}
    </section>
  )
}
