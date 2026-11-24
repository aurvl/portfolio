import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate } from 'react-router-dom'
import { FiChevronRight } from 'react-icons/fi'
import MainLayout from '../components/layout/MainLayout'
import Seo from '../components/seo/Seo'
import Button from '../components/ui/Button'
import FeaturedHub from '../components/hub-v3/FeaturedHub'
import HubHeader from '../components/hub-v3/HubHeader'
import { pickFeaturedProjects } from '../components/hub-v3/featuredProjects'
import type { FilterOption } from '../components/ui/FilterField'
import SearchPanel from '../components/hub-v3/SearchPanel'
import ProjectGrid from '../components/projects/ProjectGrid'
import ProjectWindow from '../components/projects/ProjectWindow'
import rawProjects from '../data/projects.json'
import rawSeries from '../data/series.json'
import { useHomeContent } from '../hooks/useHomeContent'
import { useSiteNav } from '../hooks/useSiteNav'
import { PERSON_NAME, buildAbsoluteSiteUrl } from '../lib/site'
import { getLocalizedField, getProjectContent } from '../lib/utils'
import type { Project } from '../types/project'
import type { Series } from '../types/series'

const PAGE_SIZE = 9
const LOAD_MORE_STEP = 3
const projects = rawProjects as Project[]
const featuredSeries = (rawSeries as Series[]).find((item) => item.featured) ?? null

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

type SortValue = 'date-desc' | 'date-asc' | 'title-asc' | 'title-desc'

function ProjectsPage() {
  const { t, i18n } = useTranslation()
  const { content, lang } = useHomeContent()
  const page = content.projectsPage
  const { lead: leadProject, row: featuredRow } = pickFeaturedProjects(projects.filter(isApplied))
  const location = useLocation()
  const navigate = useNavigate()
  const [searchValue, setSearchValue] = useState('')
  const [selectedDomain, setSelectedDomain] = useState('')
  // ?tag=<mot-clé> : arrivée depuis une pastille « Je travaille sur » de l'About, filtre déjà appliqué
  const [selectedTag, setSelectedTag] = useState(() => new URLSearchParams(location.search).get('tag') ?? '')
  const [selectedSort, setSelectedSort] = useState<SortValue>('date-desc')
  const [selectedYear, setSelectedYear] = useState('')
  const [visibleProjectsCount, setVisibleProjectsCount] = useState(PAGE_SIZE)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  // Le bloc de recherche est caché tant qu'on n'a pas cliqué sur « Search a project » ; ?tag= l'ouvre d'office
  const [isSearchOpen, setIsSearchOpen] = useState(selectedTag.length > 0)
  const [searchFocusSignal, setSearchFocusSignal] = useState(0)
  const { pageSections } = useSiteNav()

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

  // Liens rapides : les 5 domaines les plus fournis du catalogue (pas de liste écrite à la main)
  const domainCounts = new Map<string, number>()
  projects.forEach((project) =>
    project.taxonomy.domains.forEach((domain) => domainCounts.set(domain, (domainCounts.get(domain) ?? 0) + 1))
  )
  const quickDomains = Array.from(domainCounts.entries())
    .sort(([domainA, countA], [domainB, countB]) => countB - countA || domainA.localeCompare(domainB))
    .slice(0, 5)
    .map(([domain]) => domain)

  const normalizedSearch =searchValue.trim().toLowerCase()
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

  function handleOpenSearch() {
    setIsSearchOpen(true)
    setSearchFocusSignal((signal) => signal + 1)
  }

  // Fermer le bloc remet aussi les filtres à zéro : sinon la grille resterait filtrée sans que rien ne l'indique
  function handleCloseSearch() {
    setIsSearchOpen(false)
    setSearchValue('')
    setSelectedDomain('')
    setSelectedTag('')
    setSelectedYear('')
    setSelectedSort('date-desc')
  }

  function handleShowResults() {
    document.getElementById('hub-results')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  function handleCloseProjectWindow() {
    setSelectedProject(null)

    const searchParams = new URLSearchParams(location.search)

    if (!searchParams.has('project')) return

    searchParams.delete('project')
    const nextSearch = searchParams.toString()

    navigate({ pathname: location.pathname, search: nextSearch ? `?${nextSearch}` : '' }, { replace: true })
  }

  return (
    <MainLayout
      sections={pageSections}
      className="home-v2"
      overlayNavbar
    >
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

      <div className="hub">
        <HubHeader
          title={page.hub.title}
          searchLabel={page.hub.searchLabel}
          onOpenSearch={handleOpenSearch}
        />

        <div className="hub__content">
          <FeaturedHub
            lead={leadProject}
            row={featuredRow}
            series={featuredSeries}
            labels={page.hub}
            onOpenProject={setSelectedProject}
          />

          <section
            id="projects"
            className="hub__catalog"
            aria-labelledby="hub-catalog-title"
          >
            {isSearchOpen && (
              <SearchPanel
                labels={page.hub}
                searchValue={searchValue}
                onSearchChange={setSearchValue}
                domainValue={selectedDomain}
                onDomainChange={setSelectedDomain}
                tagValue={selectedTag}
                onTagChange={setSelectedTag}
                yearValue={selectedYear}
                onYearChange={setSelectedYear}
                sortValue={selectedSort}
                onSortChange={(value) => setSelectedSort(value as SortValue)}
                domainOptions={domainOptions}
                tagOptions={tagOptions}
                yearOptions={yearOptions}
                sortOptions={sortOptions}
                quickDomains={quickDomains}
                resultsCount={filteredProjects.length}
                visibleCount={visibleApplied.length + otherProjects.length}
                focusSignal={searchFocusSignal}
                onClose={handleCloseSearch}
                onShowResults={handleShowResults}
              />
            )}

            <div id="hub-results">
              <p className="eyebrow">{page.hub.allProjectsLabel}</p>
              <h2
                id="hub-catalog-title"
                className="hub__section-title"
              >
                {page.appliedTitle}
              </h2>
              <p className="hub__section-intro">{page.appliedIntro}</p>
            </div>

            <ProjectWindow project={selectedProject} isOpen={selectedProject !== null} onClose={handleCloseProjectWindow} />

            {filteredProjects.length === 0 ? (
              <div className="hub__empty">
                <h3>{t('projects.catalog.empty.title')}</h3>
                <p>{t('projects.catalog.empty.description')}</p>
              </div>
            ) : (
              <>
                {appliedProjects.length > 0 && <ProjectGrid projects={visibleApplied} onOpenProject={setSelectedProject} />}

                {remainingAppliedCount > 0 && (
                  <div className="hub__more">
                    <Button
                      variant="line"
                      onClick={() => setVisibleProjectsCount((currentCount) => currentCount + LOAD_MORE_STEP)}
                    >
                      {t('projects.catalog.loadMore', { count: Math.min(LOAD_MORE_STEP, remainingAppliedCount) })}
                    </Button>
                  </div>
                )}

                {otherProjects.length > 0 && (
                  <div className="hub__other">
                    <h2 className="hub__section-title">{page.otherTitle}</h2>
                    <p className="hub__section-intro">{page.otherIntro}</p>

                    <ul className="hub-rows">
                      {otherProjects.map((project) => (
                        <li key={project.id}>
                          <button
                            id={`project-row-${project.slug}`}
                            type="button"
                            className="hub-rows__item"
                            onClick={() => setSelectedProject(project)}
                          >
                            <span className="hub-rows__year tabular">{new Date(project.date).getFullYear()}</span>
                            <span className="hub-rows__title">{getProjectContent(project, i18n.language).title}</span>
                            <span className="hub-rows__domain">{project.taxonomy.domains[0] ?? ''}</span>
                            <span className="hub-rows__open">
                              {page.open} <FiChevronRight aria-hidden="true" />
                            </span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </>
            )}
          </section>
        </div>
      </div>
    </MainLayout>
  )
}

export default ProjectsPage
