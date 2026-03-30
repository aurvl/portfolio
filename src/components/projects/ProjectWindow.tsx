import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { IoIosClose } from 'react-icons/io'
import { getProjectWindowSections } from '../../lib/projectWindowContent'
import { getLocalizedField, getProjectContent } from '../../lib/utils'
import { normalizeLegacyProjectLink, withBasePath } from '../../lib/site'
import type { Project } from '../../types/project'
import type { ProjectWindowTabId } from '../../types/project-window'
import ProjectWindowAccessGate from './ProjectWindowAccessGate'
import ProjectWindowSection from './ProjectWindowSection'
import ProjectWindowTabs from './ProjectWindowTabs'

type ProjectWindowProps = {
  project: Project | null
  isOpen: boolean
  onClose: () => void
}

type ProjectLinkItem = {
  href: string
  label: string
}

const TOTAL_TECH_LEVEL = 3

function ProjectWindow({ project, isOpen, onClose }: ProjectWindowProps) {
  const { t, i18n } = useTranslation()
  const [activeTab, setActiveTab] = useState<ProjectWindowTabId>('overview')
  const [isSmallScreen, setIsSmallScreen] = useState(false)

  useEffect(() => {
    if (!isOpen) {
      return
    }

    const timeoutId = window.setTimeout(() => {
      setActiveTab('overview')
    }, 0)

    return () => window.clearTimeout(timeoutId)
  }, [isOpen, project?.id, i18n.language])

  useEffect(() => {
    if (!isOpen) {
      return
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  useEffect(() => {
    if (!isOpen) {
      return
    }

    const previousBodyOverflow = document.body.style.overflow
    const previousHtmlOverflow = document.documentElement.style.overflow

    document.body.style.overflow = 'hidden'
    document.documentElement.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = previousBodyOverflow
      document.documentElement.style.overflow = previousHtmlOverflow
    }
  }, [isOpen])

  useEffect(() => {
    const updateViewportState = () => {
      setIsSmallScreen(window.innerWidth < 640)
    }

    updateViewportState()
    window.addEventListener('resize', updateViewportState)

    return () => {
      window.removeEventListener('resize', updateViewportState)
    }
  }, [])

  const content = useMemo(
    () => (project ? getProjectContent(project, i18n.language) : null),
    [project, i18n.language]
  )
  const keywords = useMemo(
    () =>
      project
        ? getLocalizedField(project.taxonomy.keywords, i18n.language)
        : [],
    [project, i18n.language]
  )
  const sections = useMemo(
    () =>
      project
        ? getProjectWindowSections(
            project.window?.contentSlug ?? project.slug,
            i18n.language
          )
        : {
            overview: '',
            method: '',
            value: '',
          },
    [project, i18n.language]
  )
  const links = useMemo(
    () => (project ? buildProjectLinkItems(project, t) : []),
    [project, t]
  )
  const showLinksTab = !isSmallScreen
  const isLockedAccess = Boolean(project?.window?.access && project.window.access !== 'public')
  const shouldShowAccessGate = isLockedAccess || links.length === 0

  useEffect(() => {
    if (showLinksTab || activeTab !== 'links') {
      return
    }

    const timeoutId = window.setTimeout(() => {
      setActiveTab('value')
    }, 0)

    return () => window.clearTimeout(timeoutId)
  }, [activeTab, showLinksTab])

  const activeSectionContent =
    activeTab === 'overview'
      ? sections.overview
      : activeTab === 'method'
        ? sections.method
        : sections.value

  const renderAccessSection = () => {
    if (!project || !content) {
      return null
    }

    if (shouldShowAccessGate) {
      return (
        <ProjectWindowAccessGate
          projectSlug={project.slug}
          projectTitle={content.title}
        />
      )
    }

    return (
      <section className="project-win-sect flex w-full flex-col gap-4">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--text2-col)]">
          {t('projects.window.tabs.links')}
        </p>
        <div className="flex flex-wrap gap-3">
          {links.map((link) => (
            <a
              key={`${link.label}-${link.href}`}
              href={link.href}
              target="_blank"
              rel="noreferrer"
              className="rounded-lg border border-[var(--glass-border)] px-4 py-2 text-[var(--text-col)] transition-colors duration-200 hover:bg-[var(--btn-sobre-col)]"
            >
              {link.label}
            </a>
          ))}
        </div>
      </section>
    )
  }

  return (
    <AnimatePresence>
      {isOpen && project && content && (
        <div className="fixed inset-0 z-[999]">
          <motion.button
            type="button"
            aria-label={t('projects.window.close')}
            className="absolute inset-0 bg-black/70"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
          />

          <div className="pointer-events-none absolute inset-0 flex items-end justify-center overflow-x-hidden px-4 py-6 md:items-center md:py-8">
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="project-window-title"
              initial={{ opacity: 0, y: 80 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 80 }}
              transition={{ duration: 0.28, ease: 'easeOut' }}
              className="pointer-events-auto relative flex max-h-[calc(100vh-3rem)] min-w-0 w-full max-w-5xl flex-col overflow-hidden rounded-[5px]
              border border-[var(--glass-border)] bg-[var(--win-bg)] shadow-2xl"
            >
              <div className="min-w-0 overflow-x-hidden overflow-y-auto px-4 pb-6 pt-0 md:px-6">
                <div className="sticky top-0 z-20 -mx-4 mb-4 flex justify-end bg-[var(--bg-color)]/95 px-4 py-3 backdrop-blur md:-mx-6 md:px-6">
                  <button
                    type="button"
                    onClick={onClose}
                    aria-label={t('projects.window.close')}
                    className="flex h-6 w-6 items-center justify-center rounded-full border border-[var(--glass-border)]
                    bg-[var(--glass-bg)] text-[var(--text-col)] transition-colors duration-200
                    hover:bg-[var(--accent-red)] hover:text-white focus:outline-none focus:ring-2
                    focus:ring-[var(--accent-red)] focus:ring-offset-2"
                  >
                    <IoIosClose size={28} />
                  </button>
                </div>

                <div className="flex min-w-0 flex-col gap-6">
                  <div className="flex flex-col gap-6 rounded-lg bg-[var(--bg2-color)] p-4 md:items-center">
                    <div className="flex min-w-0 flex-col items-center text-center">
                      <h2
                        id="project-window-title"
                        className="text-3xl font-semibold md:text-4xl"
                      >
                        {content.title}
                      </h2>

                      <div className="mt-4 flex flex-wrap justify-center gap-2">
                        {keywords.slice(0, 4).map((keyword) => (
                          <span
                            key={keyword}
                            className="rounded-lg border border-[var(--glass-border)] bg-[var(--pjtwintab)] px-3 py-1 text-sm text-[var(--keyw-col-window)]"
                          >
                            {keyword}
                          </span>
                        ))}
                      </div>

                      <div className="mt-4 flex items-center gap-2 text-[var(--text2-col)]">
                        <span>{t('projects.technicalLevel')}:</span>
                        <span className="tracking-[0.2em] text-[var(--accent-blue)]">
                          {Array.from({ length: TOTAL_TECH_LEVEL }, (_, index) =>
                            index < project.technicalLevel ? '\u2605' : '\u2606'
                          ).join('')}
                        </span>
                      </div>

                      <p className="mt-6 max-w-3xl text-base leading-8 text-[var(--text2-col)]">
                        {content.description}
                      </p>
                    </div>

                    <div className="w-full md:w-[85%]">
                      <img
                        src={withBasePath(project.cover.src)}
                        alt={getLocalizedField(project.cover.alt, i18n.language)}
                        className="h-auto w-full rounded-lg object-cover"
                      />
                    </div>
                  </div>

                  <div className="flex min-w-0 w-full justify-center">
                    <ProjectWindowTabs
                      activeTab={activeTab}
                      onTabChange={setActiveTab}
                      showLinksTab={showLinksTab}
                    />
                  </div>

                  <div className="flex min-w-0 flex-col gap-6 p-1 md:p-3">
                    {activeTab === 'links' && showLinksTab ? (
                      renderAccessSection()
                    ) : activeSectionContent ? (
                      <>
                        <ProjectWindowSection content={activeSectionContent} />
                        {isSmallScreen && activeTab === 'value' && renderAccessSection()}
                      </>
                    ) : (
                      <>
                        <p className="text-[var(--text2-col)]">
                          {t('projects.window.emptySection')}
                        </p>
                        {isSmallScreen && activeTab === 'value' && renderAccessSection()}
                      </>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  )
}

function buildProjectLinkItems(
  project: Project,
  t: (key: string) => string
): ProjectLinkItem[] {
  const seen = new Set<string>()
  const linkCandidates: Array<ProjectLinkItem | null> = [
    project.links.live
      ? {
          href: normalizeLegacyProjectLink(project.slug, project.links.live),
          label: t('projects.window.links.live'),
        }
      : null,
    project.links.github
      ? {
          href: normalizeLegacyProjectLink(project.slug, project.links.github),
          label: t('projects.window.links.github'),
        }
      : null,
    project.links.readMore
      ? {
          href: normalizeLegacyProjectLink(project.slug, project.links.readMore),
          label: t('projects.window.links.readMore'),
        }
      : null,
    project.links.primary
      ? {
          href: normalizeLegacyProjectLink(project.slug, project.links.primary),
          label: t('projects.window.links.primary'),
        }
      : null,
  ]

  return linkCandidates.filter((link): link is ProjectLinkItem => {
    if (!link || seen.has(link.href)) {
      return false
    }

    seen.add(link.href)
    return true
  })
}

export default ProjectWindow
