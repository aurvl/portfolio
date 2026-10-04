import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate } from 'react-router-dom'
import MainLayout from '../components/layout/MainLayout'
import Seo from '../components/seo/Seo'
import type { FilterOption } from '../components/ui/FilterField'
import ProjectFilters from '../components/projects/ProjectFilters'
import ProjectGrid from '../components/projects/ProjectGrid'
import ProjectsSummary from '../components/projects/ProjectsSummary'
import ProjectWindow from '../components/projects/ProjectWindow'
import rawProjects from '../data/projects.json'
import { PERSON_NAME, buildAbsoluteSiteUrl } from '../lib/site'
import { getAppLanguage, getLocalizedField, getProjectContent } from '../lib/utils'
import type { Project } from '../types/project'

const PAGE_SIZE = 9
const LOAD_MORE_STEP = 3
const projects = rawProjects as Project[]
const technicalLevelValues = ['1', '2', '3'] as const
type SortValue =
  | 'date-desc'
  | 'date-asc'
  | 'title-asc'
  | 'title-desc'
  | 'tech-desc'
  | 'tech-asc'

function ProjectsPage() {
  const { t, i18n } = useTranslation()
  const location = useLocation()
  const navigate = useNavigate()
  const [searchValue, setSearchValue] = useState('')
  const [selectedDomain, setSelectedDomain] = useState('')
  const [selectedTag, setSelectedTag] = useState('')
  const [selectedTool, setSelectedTool] = useState('')
  const [selectedTechnicalLevel, setSelectedTechnicalLevel] = useState('')
  const [selectedSort, setSelectedSort] = useState<SortValue>('date-desc')
  const [selectedYear, setSelectedYear] = useState('')
  const [visibleProjectsCount, setVisibleProjectsCount] = useState(PAGE_SIZE)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const language = getAppLanguage(i18n.language)

  const projectSections = [
    { id: 'home', label: t('nav.home'), href: '/' },
    { id: 'projects', label: t('nav.projects') },
    { id: 'blog', label: t('nav.blog'), href: '/blog' },
    { id: 'contact', label: t('nav.contact'), href: '/#contact-form' },
  ]

  const domainOptions: FilterOption[] = [
    { value: '', label: t('projects.catalog.filters.allDomains') },
    ...Array.from(new Set(projects.flatMap((project) => project.taxonomy.domains)))
      .sort((domainA, domainB) => domainA.localeCompare(domainB))
      .map((domain) => ({ value: domain, label: domain })),
  ]

  const tagOptions: FilterOption[] = [
    { value: '', label: t('projects.catalog.filters.allTags') },
    ...Array.from(
      new Set(projects.flatMap((project) => project.taxonomy.keywords[language]))
    )
      .sort((tagA, tagB) => tagA.localeCompare(tagB))
      .map((tag) => ({ value: tag, label: tag })),
  ]

  const toolOptions: FilterOption[] = [
    { value: '', label: t('projects.catalog.filters.allTools') },
    ...Array.from(new Set(projects.flatMap((project) => project.taxonomy.tools)))
      .sort((toolA, toolB) => toolA.localeCompare(toolB))
      .map((tool) => ({ value: tool, label: tool })),
  ]

  const technicalLevelOptions: FilterOption[] = [
    { value: '', label: t('projects.catalog.filters.allTechnicalLevels') },
    ...technicalLevelValues.map((level) => ({
      value: level,
      label: t('projects.catalog.filters.technicalLevelOption', { count: level }),
    })),
  ]

  const sortOptions: FilterOption[] = [
    { value: 'date-desc', label: t('projects.catalog.filters.sortNewest') },
    { value: 'date-asc', label: t('projects.catalog.filters.sortOldest') },
    { value: 'title-asc', label: t('projects.catalog.filters.sortTitleAsc') },
    { value: 'title-desc', label: t('projects.catalog.filters.sortTitleDesc') },
    { value: 'tech-desc', label: t('projects.catalog.filters.sortTechnicalDesc') },
    { value: 'tech-asc', label: t('projects.catalog.filters.sortTechnicalAsc') },
  ]

  const yearOptions: FilterOption[] = [
    { value: '', label: t('projects.catalog.filters.allYears') },
    ...Array.from(
      new Set(projects.map((project) => new Date(project.date).getFullYear().toString()))
    )
      .sort((yearA, yearB) => Number(yearB) - Number(yearA))
      .map((year) => ({ value: year, label: year })),
  ]

  const normalizedSearch = searchValue.trim().toLowerCase()
  const isSearchMode = normalizedSearch.length > 0

  const filteredProjects = projects
    .filter((project) => {
      const content = getProjectContent(project, i18n.language)
      const keywords = getLocalizedField(project.taxonomy.keywords, i18n.language)
      const searchableContent = [content.title, content.summary, ...keywords]
        .join(' ')
        .toLowerCase()

      const matchesSearch =
        normalizedSearch.length === 0 || searchableContent.includes(normalizedSearch)
      const matchesDomain =
        selectedDomain.length === 0 || project.taxonomy.domains.includes(selectedDomain)
      const matchesTag = selectedTag.length === 0 || keywords.includes(selectedTag)
      const matchesTool =
        selectedTool.length === 0 || project.taxonomy.tools.includes(selectedTool)
      const matchesTechnicalLevel =
        selectedTechnicalLevel.length === 0 ||
        project.technicalLevel === Number(selectedTechnicalLevel)
      const matchesYear =
        selectedYear.length === 0 ||
        new Date(project.date).getFullYear().toString() === selectedYear

      return (
        matchesSearch &&
        matchesDomain &&
        matchesTag &&
        matchesTool &&
        matchesTechnicalLevel &&
        matchesYear
      )
    })
    .sort((projectA, projectB) => {
      if (selectedSort === 'date-asc') {
        return new Date(projectA.date).getTime() - new Date(projectB.date).getTime()
      }

      if (selectedSort === 'title-asc') {
        return getProjectContent(projectA, i18n.language).title.localeCompare(
          getProjectContent(projectB, i18n.language).title
        )
      }

      if (selectedSort === 'title-desc') {
        return getProjectContent(projectB, i18n.language).title.localeCompare(
          getProjectContent(projectA, i18n.language).title
        )
      }

      if (selectedSort === 'tech-desc') {
        return projectB.technicalLevel - projectA.technicalLevel
      }

      if (selectedSort === 'tech-asc') {
        return projectA.technicalLevel - projectB.technicalLevel
      }

      return new Date(projectB.date).getTime() - new Date(projectA.date).getTime()
    })

  const visibleProjects = isSearchMode
    ? filteredProjects
    : filteredProjects.slice(0, visibleProjectsCount)
  const remainingProjectsCount = filteredProjects.length - visibleProjects.length

  useEffect(() => {
    queueMicrotask(() => {
      setVisibleProjectsCount(PAGE_SIZE)
    })
  }, [
    searchValue,
    selectedDomain,
    selectedTag,
    selectedTool,
    selectedTechnicalLevel,
    selectedSort,
    selectedYear,
    i18n.language,
  ])

  useEffect(() => {
    const projectSlug = new URLSearchParams(location.search).get('project')

    if (!projectSlug) {
      return
    }

    const targetProjectIndex = filteredProjects.findIndex(
      (project) => project.slug === projectSlug
    )

    if (targetProjectIndex === -1) {
      return
    }

    const targetProject = filteredProjects[targetProjectIndex]

    if (!targetProject) {
      return
    }

    if (visibleProjectsCount < targetProjectIndex + 1) {
      queueMicrotask(() => {
        setVisibleProjectsCount(targetProjectIndex + 1)
      })
      return
    }

    const timeoutId = window.setTimeout(() => {
      const targetCard = document.getElementById(`project-card-${targetProject.slug}`)

      targetCard?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      })

      setSelectedProject(targetProject)
    }, 0)

    return () => window.clearTimeout(timeoutId)
  }, [filteredProjects, location.search, visibleProjectsCount])

  function handleOpenProject(project: Project) {
    setSelectedProject(project)
  }

  function handleCloseProjectWindow() {
    setSelectedProject(null)

    const searchParams = new URLSearchParams(location.search)

    if (!searchParams.has('project')) {
      return
    }

    searchParams.delete('project')
    const nextSearch = searchParams.toString()

    navigate(
      {
        pathname: location.pathname,
        search: nextSearch ? `?${nextSearch}` : '',
      },
      { replace: true }
    )
  }

  return (
    <MainLayout sections={projectSections} className="home-v2">
      <Seo
        title={
          i18n.language === 'fr'
            ? `Projets data et economiques | ${PERSON_NAME}`
            : `Data and economics projects | ${PERSON_NAME}`
        }
        description={
          i18n.language === 'fr'
            ? 'Selection de projets data, econometrie, machine learning et analytics realises par Aurel De Vince.'
            : 'Selection of data, econometrics, machine learning, and analytics projects built by Aurel De Vince.'
        }
        path="projects"
        lang={i18n.language}
        image={buildAbsoluteSiteUrl('assets/projects/images/defaultprojectcover.png')}
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name:
            i18n.language === 'fr'
              ? 'Projets data et economiques'
              : 'Data and economics projects',
          url: buildAbsoluteSiteUrl('projects'),
          description:
            i18n.language === 'fr'
              ? 'Selection de projets data, econometrie, machine learning et analytics realises par Aurel De Vince.'
              : 'Selection of data, econometrics, machine learning, and analytics projects built by Aurel De Vince.',
        }}
      />
      <section className="hv-section projects-v2__summary">
        <div className="hv-wrap">
          <ProjectsSummary />
        </div>
      </section>

      <section id="projects" className="hv-section hv-section--tight scroll-mt-20">
        <div className="hv-wrap projects-v2__catalog">
        <ProjectFilters
          searchValue={searchValue}
          onSearchChange={setSearchValue}
          domainValue={selectedDomain}
          onDomainChange={setSelectedDomain}
          tagValue={selectedTag}
          onTagChange={setSelectedTag}
          toolValue={selectedTool}
          onToolChange={setSelectedTool}
          technicalLevelValue={selectedTechnicalLevel}
          onTechnicalLevelChange={setSelectedTechnicalLevel}
          sortValue={selectedSort}
          onSortChange={(value) => setSelectedSort(value as SortValue)}
          yearValue={selectedYear}
          onYearChange={setSelectedYear}
          domainOptions={domainOptions}
          tagOptions={tagOptions}
          toolOptions={toolOptions}
          technicalLevelOptions={technicalLevelOptions}
          sortOptions={sortOptions}
          yearOptions={yearOptions}
          resultsCount={filteredProjects.length}
          visibleCount={visibleProjects.length}
        />

        <ProjectWindow
          project={selectedProject}
          isOpen={selectedProject !== null}
          onClose={handleCloseProjectWindow}
        />

        {filteredProjects.length > 0 ? (
          <>
            <ProjectGrid
              projects={visibleProjects}
              onOpenProject={handleOpenProject}
            />

            {remainingProjectsCount > 0 && (
              <div className="flex justify-center">
                <button
                  type="button"
                  onClick={() =>
                    setVisibleProjectsCount(
                      (currentCount) => currentCount + LOAD_MORE_STEP
                    )
                  }
                  className="hv-btn hv-btn--ghost hv-btn--sm"
                >
                  {t('projects.catalog.loadMore', {
                    count: Math.min(LOAD_MORE_STEP, remainingProjectsCount),
                  })}
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="hv-card projects-v2__empty">
            <h3>
              {t('projects.catalog.empty.title')}
            </h3>
            <p>
              {t('projects.catalog.empty.description')}
            </p>
          </div>
        )}
        </div>
      </section>
    </MainLayout>
  )
}

export default ProjectsPage
