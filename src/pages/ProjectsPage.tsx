import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate } from 'react-router-dom'
import { FiChevronRight } from 'react-icons/fi'
import MainLayout from '../components/layout/MainLayout'
import Seo from '../components/seo/Seo'
import Reveal from '../components/home-v2/Reveal'
import { SelectedWorkGrid } from '../components/home-v2/WorkSection'
import type { FilterOption } from '../components/ui/FilterField'
import ProjectFilters from '../components/projects/ProjectFilters'
import ProjectGrid from '../components/projects/ProjectGrid'
import ProjectWindow from '../components/projects/ProjectWindow'
import rawProjects from '../data/projects.json'
import { useHomeContent } from '../hooks/useHomeContent'
import { useSiteNav } from '../hooks/useSiteNav'
import { getDomainColor } from '../lib/domainColors'
import { PERSON_NAME, buildAbsoluteSiteUrl } from '../lib/site'
import { getLocalizedField, getProjectContent } from '../lib/utils'
import type { Project } from '../types/project'

const PAGE_SIZE = 9
const LOAD_MORE_STEP = 3
const projects = rawProjects as Project[]

// Projects carrying one of these domains are the applied-economics core of the catalogue;
// the rest (ML, NLP, scraping, BI...) is listed compactly as "other technical work".
const APPLIED_DOMAINS = new Set([
  'Applied Statistics',
  'Econometrics',
  'Economics',
  'Environmental Policy',
  'Experiment Design',
  'Fraud Analytics',
  'International Trade',
  'Labor Economics',
  'Macroeconomics',
  'Policy Analysis',
  'Quantitative Finance',
  'Spatial Econometrics',
  'Statistical Modeling',
  'Time Series Analysis',
  'Time Series Forecasting',
  'Trade Economics',
])

const isApplied = (project: Project) => project.taxonomy.domains.some((domain) => APPLIED_DOMAINS.has(domain))

const projectYears = projects.map((project) => new Date(project.date).getFullYear())
const FIRST_YEAR = Math.min(...projectYears)
const LAST_YEAR = Math.max(...projectYears)

type SortValue = 'date-desc' | 'date-asc' | 'title-asc' | 'title-desc'

function ProjectsPage() {
  const { t, i18n } = useTranslation()
  const { content, lang } = useHomeContent()
  const page = content.projectsPage
  const location = useLocation()
  const navigate = useNavigate()
  const [searchValue, setSearchValue] = useState('')
  const [selectedDomain, setSelectedDomain] = useState('')
  const [selectedTag, setSelectedTag] = useState('')
  const [selectedSort, setSelectedSort] = useState<SortValue>('date-desc')
  const [selectedYear, setSelectedYear] = useState('')
  const [visibleProjectsCount, setVisibleProjectsCount] = useState(PAGE_SIZE)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const { pageSections, pageCta } = useSiteNav()

  const domainOptions: FilterOption[] = [
    { value: '', label: t('projects.catalog.filters.allDomains') },
    ...Array.from(new Set(projects.flatMap((project) => project.taxonomy.domains)))
      .sort((domainA, domainB) => domainA.localeCompare(domainB))
      .map((domain) => ({ value: domain, label: domain })),
  ]

  const tagOptions: FilterOption[] = [
    { value: '', label: t('projects.catalog.filters.allTags') },
    ...Array.from(new Set(projects.flatMap((project) => project.taxonomy.keywords[lang])))
      .sort((tagA, tagB) => tagA.localeCompare(tagB))
      .map((tag) => ({ value: tag, label: tag })),
  ]

  const sortOptions: FilterOption[] = [
    { value: 'date-desc', label: t('projects.catalog.filters.sortNewest') },
    { value: 'date-asc', label: t('projects.catalog.filters.sortOldest') },
    { value: 'title-asc', label: t('projects.catalog.filters.sortTitleAsc') },
    { value: 'title-desc', label: t('projects.catalog.filters.sortTitleDesc') },
  ]

  const yearOptions: FilterOption[] = [
    { value: '', label: t('projects.catalog.filters.allYears') },
    ...Array.from(new Set(projectYears.map(String)))
      .sort((yearA, yearB) => Number(yearB) - Number(yearA))
      .map((year) => ({ value: year, label: year })),
  ]

  const normalizedSearch = searchValue.trim().toLowerCase()
  const isSearchMode = normalizedSearch.length > 0

  const filteredProjects = projects
    .filter((project) => {
      const projectContent = getProjectContent(project, i18n.language)
      const keywords = getLocalizedField(project.taxonomy.keywords, i18n.language)
      const searchableContent = [projectContent.title, projectContent.summary, ...keywords].join(' ').toLowerCase()

      return (
        (normalizedSearch.length === 0 || searchableContent.includes(normalizedSearch)) &&
        (selectedDomain.length === 0 || project.taxonomy.domains.includes(selectedDomain)) &&
        (selectedTag.length === 0 || keywords.includes(selectedTag)) &&
        (selectedYear.length === 0 || new Date(project.date).getFullYear().toString() === selectedYear)
      )
    })
    .sort((projectA, projectB) => {
      if (selectedSort === 'date-asc') {
        return new Date(projectA.date).getTime() - new Date(projectB.date).getTime()
      }

      if (selectedSort === 'title-asc' || selectedSort === 'title-desc') {
        const order = getProjectContent(projectA, i18n.language).title.localeCompare(
          getProjectContent(projectB, i18n.language).title
        )
        return selectedSort === 'title-asc' ? order : -order
      }

      return new Date(projectB.date).getTime() - new Date(projectA.date).getTime()
    })

  const appliedProjects = filteredProjects.filter(isApplied)
  const otherProjects = filteredProjects.filter((project) => !isApplied(project))
  const visibleApplied = isSearchMode ? appliedProjects : appliedProjects.slice(0, visibleProjectsCount)
  const remainingAppliedCount = appliedProjects.length - visibleApplied.length

  useEffect(() => {
    queueMicrotask(() => {
      setVisibleProjectsCount(PAGE_SIZE)
    })
  }, [searchValue, selectedDomain, selectedTag, selectedSort, selectedYear, i18n.language])

  // Deep link (?project=slug): reveal the project, scroll to it and open its window.
  useEffect(() => {
    const projectSlug = new URLSearchParams(location.search).get('project')

    if (!projectSlug) return

    const appliedIndex = appliedProjects.findIndex((project) => project.slug === projectSlug)
    const targetProject = filteredProjects.find((project) => project.slug === projectSlug)

    if (!targetProject) return

    if (appliedIndex !== -1 && visibleProjectsCount < appliedIndex + 1) {
      queueMicrotask(() => {
        setVisibleProjectsCount(appliedIndex + 1)
      })
      return
    }

    const timeoutId = window.setTimeout(() => {
      const target =
        document.getElementById(`project-card-${targetProject.slug}`) ??
        document.getElementById(`project-row-${targetProject.slug}`)

      target?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      setSelectedProject(targetProject)
    }, 0)

    return () => window.clearTimeout(timeoutId)
  }, [appliedProjects, filteredProjects, location.search, visibleProjectsCount])

  function handleCloseProjectWindow() {
    setSelectedProject(null)

    const searchParams = new URLSearchParams(location.search)

    if (!searchParams.has('project')) return

    searchParams.delete('project')
    const nextSearch = searchParams.toString()

    navigate({ pathname: location.pathname, search: nextSearch ? `?${nextSearch}` : '' }, { replace: true })
  }

  return (
    <MainLayout sections={pageSections} className="home-v2" cta={pageCta}>
      <Seo
        title={`${page.seoTitle} | ${PERSON_NAME}`}
        description={page.seoDescription}
        path="projects"
        lang={lang}
        image={buildAbsoluteSiteUrl('assets/projects/images/defaultprojectcover.png')}
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: page.seoTitle,
          url: buildAbsoluteSiteUrl('projects'),
          description: page.seoDescription,
        }}
      />

      <section className="hv-section projects-v2__summary">
        <div className="hv-wrap">
          <Reveal className="projects-v2__intro">
            <p className="hv-eyebrow">{page.eyebrow}</p>
            <h1 className="hv-h2">{page.title}</h1>
            <p>{page.intro}</p>
            <p className="projects-v2__facts">
              {page.summary
                .replace('{count}', String(projects.length))
                .replace('{from}', String(FIRST_YEAR))
                .replace('{to}', String(LAST_YEAR))}
            </p>
          </Reveal>
        </div>
      </section>

      <section className="hv-section hv-section--tight">
        <div className="hv-wrap">
          <h2 className="projects-v2__section-title">{page.selectedTitle}</h2>
          <SelectedWorkGrid />
        </div>
      </section>

      <section id="projects" className="hv-section hv-section--tight scroll-mt-20">
        <div className="hv-wrap projects-v2__catalog">
          <div>
            <h2 className="projects-v2__section-title">{page.appliedTitle}</h2>
            <p className="projects-v2__section-intro">{page.appliedIntro}</p>
          </div>

          <ProjectFilters
            searchValue={searchValue}
            onSearchChange={setSearchValue}
            domainValue={selectedDomain}
            onDomainChange={setSelectedDomain}
            tagValue={selectedTag}
            onTagChange={setSelectedTag}
            sortValue={selectedSort}
            onSortChange={(value) => setSelectedSort(value as SortValue)}
            yearValue={selectedYear}
            onYearChange={setSelectedYear}
            domainOptions={domainOptions}
            tagOptions={tagOptions}
            sortOptions={sortOptions}
            yearOptions={yearOptions}
            resultsCount={filteredProjects.length}
            visibleCount={visibleApplied.length + otherProjects.length}
          />

          <ProjectWindow project={selectedProject} isOpen={selectedProject !== null} onClose={handleCloseProjectWindow} />

          {filteredProjects.length === 0 ? (
            <div className="hv-card projects-v2__empty">
              <h3>{t('projects.catalog.empty.title')}</h3>
              <p>{t('projects.catalog.empty.description')}</p>
            </div>
          ) : (
            <>
              {appliedProjects.length > 0 && <ProjectGrid projects={visibleApplied} onOpenProject={setSelectedProject} />}

              {remainingAppliedCount > 0 && (
                <div className="flex justify-center">
                  <button
                    type="button"
                    onClick={() => setVisibleProjectsCount((currentCount) => currentCount + LOAD_MORE_STEP)}
                    className="hv-btn hv-btn--ghost hv-btn--sm"
                  >
                    {t('projects.catalog.loadMore', { count: Math.min(LOAD_MORE_STEP, remainingAppliedCount) })}
                  </button>
                </div>
              )}

              {otherProjects.length > 0 && (
                <div className="projects-v2__other">
                  <h2 className="projects-v2__section-title">{page.otherTitle}</h2>
                  <p className="projects-v2__section-intro">{page.otherIntro}</p>
                  <div className="projects-v2__rows">
                    {otherProjects.map((project) => {
                      const domain = project.taxonomy.domains[0] ?? ''
                      return (
                        <button
                          key={project.id}
                          id={`project-row-${project.slug}`}
                          type="button"
                          className="projects-v2__row"
                          onClick={() => setSelectedProject(project)}
                        >
                          <span className="projects-v2__row-year">{new Date(project.date).getFullYear()}</span>
                          <b>{getProjectContent(project, i18n.language).title}</b>
                          <span className="project-domain" style={{ color: getDomainColor(domain) }}>
                            {domain}
                          </span>
                          <span className="hv-link projects-v2__row-open">
                            {page.open} <FiChevronRight className="hv-arrow" aria-hidden="true" />
                          </span>
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </MainLayout>
  )
}

export default ProjectsPage
