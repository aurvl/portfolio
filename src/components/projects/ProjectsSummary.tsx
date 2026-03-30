import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import * as echarts from 'echarts'
import { IoIosArrowDown } from 'react-icons/io'
import { IoHammerSharp, IoStarHalfOutline } from 'react-icons/io5'
import { GiBackwardTime } from 'react-icons/gi'
import { TbBrandReactNative } from 'react-icons/tb'
import { useTheme } from '../../app/theme-context'
import rawProjects from '../../data/projects.json'
import { withBasePath } from '../../lib/site'
import type { Project } from '../../types/project'

type SummaryMetricCardProps = {
  icon: React.ReactNode
  value: string
  label: string
}

type ActivityData = {
  data: [string, number][]
  source: 'github' | 'projects'
  title: string
  subtitle: string
  range: [string, string]
}

type CalendarDataItem =
  | [string, number]
  | {
      value: [string, number]
      itemStyle: {
        color: string
      }
    }

const projects = rawProjects as Project[]
const CHART_COLLAPSED_MAX_HEIGHT_CLASS = 'max-h-0 translate-y-[-8px] opacity-0'
const CHART_EXPANDED_MAX_HEIGHT_CLASS = 'max-h-[150px] md:max-h-[200px] lg:max-h-[250px] translate-y-0 opacity-100'
const CALENDAR_CELL_HEIGHT_LG = 19
const CALENDAR_CELL_HEIGHT_MD = 15
const CALENDAR_CELL_HEIGHT_SM = 7
const GITHUB_CONTRIBUTION_YEAR = '2026'

const CALENDAR_THEME_COLORS = {
  dark: {
    cellBorder: '#1d1f22',
    monthBorder: 'rgba(255, 255, 255, 0.18)',
    zeroDay: '#161b22',
    monthLabel: 'rgba(200, 198, 195, 0.75)',
    gradientStart: '#0e4429',
    gradientEnd: '#39d353',
  },
  light: {
    cellBorder: '#ffffff',
    monthBorder: 'rgba(15,60,50,0.2)',
    zeroDay: '#eef2f1',
    monthLabel: 'rgba(15,60,50,0.5)',
    gradientStart: '#c8e8e2',
    gradientEnd: '#0a6b62',
  },
} as const

function SummaryMetricCard({ icon, value, label }: SummaryMetricCardProps) {
  return (
    <article className="rounded-lg p-2 shadow-[var(--shadow-soft)] backdrop-blur-[var(--blur-strength)]">
      <div className="flex flex-col items-center justify-center group">
        <p className="text-3xl font-bold leading-none text-[var(--keyw-col-window)] 
        transition-all duration-300 group-hover:text-4xl">
          {value}
        </p>

        <div className="flex items-center justify-center gap-1">
          <div className="flex h-full shrink-0 items-center justify-center rounded-xl text-[var(--text2-col)]">
            {icon}
          </div>
          <p className="text-sm text-[var(--text2-col)]">{label}</p>
        </div>
      </div>
    </article>
  )
}

function formatDate(date: Date) {
  return echarts.time.format(date.getTime(), '{yyyy}-{MM}-{dd}', false)
}

function getProjectRange(projectList: Project[]) {
  if (projectList.length === 0) {
    const today = new Date()
    const end = new Date(today.getFullYear(), today.getMonth() + 1, 0)
    const start = new Date(end)

    start.setFullYear(start.getFullYear() - 1)
    start.setDate(1)

    return {
      start: formatDate(start),
      end: formatDate(end),
    }
  }

  const latestProjectDate = projectList
    .map((project) => new Date(project.date))
    .reduce((latest, date) => (date > latest ? date : latest), new Date(0))
  const end = new Date(latestProjectDate.getFullYear(), latestProjectDate.getMonth() + 1, 0)
  const start = new Date(end)

  start.setFullYear(start.getFullYear() - 1)
  start.setDate(1)

  return {
    start: formatDate(start),
    end: formatDate(end),
  }
}

function getGithubContributionRange() {
  return {
    start: `${GITHUB_CONTRIBUTION_YEAR}-01-01`,
    end: `${GITHUB_CONTRIBUTION_YEAR}-12-31`,
  }
}

function buildCalendarData(
  startDate: string,
  endDate: string,
  countsByDate: Map<string, number>
) {
  const start = +echarts.time.parse(startDate)
  const end = +echarts.time.parse(endDate)
  const dayTime = 3600 * 24 * 1000
  const data: [string, number][] = []

  for (let time = start; time <= end; time += dayTime) {
    const day = echarts.time.format(time, '{yyyy}-{MM}-{dd}', false)

    data.push([day, countsByDate.get(day) ?? 0])
  }

  return data
}

function buildProjectActivityData(): ActivityData {
  const countsByDate = new Map<string, number>()
  const range = getProjectRange(projects)

  projects.forEach((project) => {
    const day = formatDate(new Date(project.date))

    countsByDate.set(day, (countsByDate.get(day) ?? 0) + 1)
  })

  return {
    data: buildCalendarData(range.start, range.end, countsByDate),
    source: 'projects',
    title: 'Project activity over the last 12 months',
    subtitle: 'Based on my portfolio projects',
    range: [range.start, range.end],
  }
}

async function loadGithubUsername() {
  const envUsername = import.meta.env.VITE_GITHUB_USERNAME?.trim()

  if (envUsername) {
    return envUsername
  }

  const response = await fetch(withBasePath('.username'))

  if (!response.ok) {
    throw new Error(`Unable to load GitHub username: ${response.status}`)
  }

  return response.text()
}

async function buildGithubActivityData(username: string): Promise<ActivityData | null> {
  const range = getGithubContributionRange()
  const response = await fetch(
    `https://github-contributions-api.jogruber.de/v4/${username}?y=${GITHUB_CONTRIBUTION_YEAR}`
  )

  if (!response.ok) {
    throw new Error(`GitHub contributions API request failed with status ${response.status}`)
  }

  const payload = (await response.json()) as {
    contributions?: Array<{
      date: string
      count: number
      level: number
    }>
  }

  const countsByDate = new Map<string, number>()

  payload.contributions?.forEach((entry) => {
    countsByDate.set(entry.date, entry.count ?? entry.level ?? 0)
  })

  return {
    data: buildCalendarData(range.start, range.end, countsByDate),
    source: 'github',
    title: 'GitHub activity in 2026',
    subtitle: 'Based on my public GitHub contributions',
    range: [range.start, range.end],
  }
}

function ProjectActivityChart() {
  const { t } = useTranslation()
  const chartRef = useRef<HTMLDivElement | null>(null)
  const [isCollapsed, setIsCollapsed] = useState(true)
  const [activityData, setActivityData] = useState<ActivityData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [calendarCellHeight, setCalendarCellHeight] = useState(CALENDAR_CELL_HEIGHT_LG)
  const [showCalendarDayLabels, setShowCalendarDayLabels] = useState(true)
  const { theme } = useTheme()
  const activityTitle =
    activityData?.source === 'github'
      ? t('projects.catalog.summary.activity.githubTitle', {
          year: GITHUB_CONTRIBUTION_YEAR,
        })
      : t('projects.catalog.summary.activity.projectsTitle')
  const activitySubtitle =
    activityData?.source === 'github'
      ? t('projects.catalog.summary.activity.githubSubtitle')
      : t('projects.catalog.summary.activity.projectsSubtitle')

  useEffect(() => {
    let cancelled = false

    const loadActivity = async () => {
      try {
        const githubUsername = (await loadGithubUsername()).trim()

        if (githubUsername) {
          const githubActivity = await buildGithubActivityData(githubUsername)

          if (githubActivity && !cancelled) {
            setActivityData(githubActivity)
            setIsLoading(false)
            return
          }
        }
      } catch {
        // Fallback below.
      }

      if (!cancelled) {
        setActivityData(buildProjectActivityData())
        setIsLoading(false)
      }
    }

    void loadActivity()

    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    const updateCalendarCellHeight = () => {
      const width = window.innerWidth

      setShowCalendarDayLabels(width >= 500)

      if (width < 500) {
        setCalendarCellHeight(CALENDAR_CELL_HEIGHT_SM)
        return
      }

      if (width < 850) {
        setCalendarCellHeight(CALENDAR_CELL_HEIGHT_MD)
        return
      }

      setCalendarCellHeight(CALENDAR_CELL_HEIGHT_LG)
    }

    updateCalendarCellHeight()
    window.addEventListener('resize', updateCalendarCellHeight)

    return () => {
      window.removeEventListener('resize', updateCalendarCellHeight)
    }
  }, [])

  useEffect(() => {
    if (isLoading || !activityData || !chartRef.current) return

    const chart = echarts.init(chartRef.current)
    const rootStyles = getComputedStyle(document.documentElement)
    const textColor = rootStyles.getPropertyValue('--text2-col').trim() || '#9e9d9d'
    const calendarThemeColors = CALENDAR_THEME_COLORS[theme]
    const calendarCellBorderColor = calendarThemeColors.cellBorder
    const calendarMonthBorderColor = calendarThemeColors.monthBorder
    const calendarZeroDayColor = calendarThemeColors.zeroDay
    const calendarMonthLabelColor = calendarThemeColors.monthLabel
    const calendarGradientStart = calendarThemeColors.gradientStart
    const calendarGradientEnd = calendarThemeColors.gradientEnd
    const maxActivityValue = Math.max(...activityData.data.map((item) => item[1]), 1)
    const chartData: CalendarDataItem[] = activityData.data.map((item) =>
      item[1] === 0
        ? {
            value: item,
            itemStyle: {
              color: calendarZeroDayColor,
            },
          }
        : item
    )

    chart.setOption({
      tooltip: {
        formatter: (params: { value: [string, number] }) =>
          `${params.value[0]}: ${params.value[1]} event${params.value[1] === 1 ? '' : 's'}`,
      },
      visualMap: {
        show: false,
        dimension: 1,
        min: 1,
        max: maxActivityValue,
        inRange: {
          color: [calendarGradientStart, calendarGradientEnd],
        },
      },
      calendar: {
        top: 34,
        left: 24,
        right: 24,
        cellSize: [calendarCellHeight, calendarCellHeight],
        range: activityData.range,
        itemStyle: {
          borderWidth: 0,
          borderColor: calendarCellBorderColor,
        },
        splitLine: {
          show: true,
          lineStyle: {
            color: calendarMonthBorderColor,
            width: 1,
          },
        },
        yearLabel: { show: false },
        dayLabel: {
          show: showCalendarDayLabels,
          color: textColor,
          fontSize: 11,
        },
        monthLabel: {
          show: true,
          color: calendarMonthLabelColor,
          fontSize: 12,
          margin: 18,
        },
      },
      series: {
        type: 'heatmap',
        coordinateSystem: 'calendar',
        itemStyle: {
          borderColor: calendarCellBorderColor,
          borderRadius: 2,
          borderWidth: 2,
        },
        data: chartData,
      },
    })

    const resizeObserver = new ResizeObserver(() => {
      chart.resize()
    })

    resizeObserver.observe(chartRef.current)

    return () => {
      resizeObserver.disconnect()
      chart.dispose()
    }
  }, [activityData, calendarCellHeight, isLoading, showCalendarDayLabels, theme])

  return (
    <section className="mt-8 min-w-0 overflow-x-hidden">
      <button
        type="button"
        onClick={() => setIsCollapsed((current) => !current)}
        className="flex w-full items-center justify-between gap-4 text-left"
        aria-expanded={!isCollapsed}
        aria-controls="project-activity-chart"
      >
        <div className="min-w-0">
          <p className="text-lg font-semibold text-[var(--text-col)]">
            {activityTitle}
          </p>
          <p className="text-sm text-[var(--text2-col)]">
            {activitySubtitle}
          </p>
        </div>

        <IoIosArrowDown
          size={20}
          className={`shrink-0 transition-transform duration-200 ${
            isCollapsed ? '' : 'rotate-180'
          }`}
        />
      </button>

      <div
        id="project-activity-chart"
        className={`overflow-hidden transition-all duration-300 ease-out motion-reduce:transition-none ${
          isCollapsed ? CHART_COLLAPSED_MAX_HEIGHT_CLASS : CHART_EXPANDED_MAX_HEIGHT_CLASS
        }`}
      >
        <div className="mt-2 min-w-0 overflow-hidden">
          {isLoading ? (
            <div className="flex min-h-[260px] items-center justify-center text-[var(--text2-col)]">
              {t('projects.catalog.summary.activity.loading')}
            </div>
          ) : (
            <div ref={chartRef} className="h-[720px] min-w-0 w-full max-w-full overflow-hidden" />
          )}
        </div>
      </div>
    </section>
  )
}

function ProjectsSummary() {
  const { t } = useTranslation()
  const numberOfProjects = projects.length
  const numberOfTools = Array.from(
    new Set(projects.flatMap((project) => project.taxonomy.tools))
  ).length
  const averageTechnicalLevel =
    numberOfProjects === 0
      ? 0
      : projects.reduce((sum, project) => sum + project.technicalLevel, 0) / numberOfProjects
  const lastThreeMonthsProjects = projects.filter((project) => {
    const projectDate = new Date(project.date)
    const now = new Date()
    const threeMonthsAgo = new Date(now)

    threeMonthsAgo.setMonth(now.getMonth() - 3)

    return projectDate >= threeMonthsAgo && projectDate <= now
  }).length

  return (
    <div className="min-w-0 overflow-x-hidden">
      <div>
        <h2 className="mb-4 text-3xl font-bold">
          {t('projects.catalog.summary.title')}
        </h2>
        <p className="text-[var(--text2-col)]">
          {t('projects.catalog.summary.description')}
        </p>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4 max-w-4xl mx-auto">
        <SummaryMetricCard
          icon={<IoHammerSharp size={24} />}
          value={numberOfProjects.toString()}
          label={t('projects.catalog.summary.metrics.projectsLabel')}
        />
        <SummaryMetricCard
          icon={<TbBrandReactNative size={24} />}
          value={numberOfTools.toString()}
          label={t('projects.catalog.summary.metrics.toolsLabel')}
        />
        <SummaryMetricCard
          icon={<IoStarHalfOutline size={24} />}
          value={`${averageTechnicalLevel.toFixed(1)} / 3`}
          label={t('projects.catalog.summary.metrics.averageTechnicalLevelLabel')}
        />
        <SummaryMetricCard
          icon={<GiBackwardTime size={24} />}
          value={lastThreeMonthsProjects.toString()}
          label={t('projects.catalog.summary.metrics.lastThreeMonthsLabel')}
        />
      </div>

      <ProjectActivityChart />
    </div>
  )
}

export default ProjectsSummary
