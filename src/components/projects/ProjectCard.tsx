import type { MouseEvent } from 'react'
import { GoLinkExternal } from "react-icons/go";
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { getLocalizedField, getProjectContent, getProjectWindowRoute } from '../../lib/utils'
import { getDomainColor } from '../../lib/domainColors'
import { withBasePath } from '../../lib/site'
import type { Project } from '../../types/project'

const DEFAULT_PROJECT_COVER = withBasePath('assets/projects/images/defaultprojectcover.png')

type ProjectCardProps = {
  project: Project
  onOpenProject?: (project: Project) => void
  cardId?: string
}

function ProjectCard({ project, onOpenProject, cardId }: ProjectCardProps) {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const content = getProjectContent(project, i18n.language)
  const coverAlt = getLocalizedField(project.cover.alt, i18n.language)
  const keywords = getLocalizedField(project.taxonomy.keywords, i18n.language)
  const primaryDomain = project.taxonomy.domains[0] ?? t('projects.fallbackDomain')
  const projectWindowRoute = getProjectWindowRoute(project)
  const isInteractive = Boolean(
    onOpenProject || projectWindowRoute || project.links.primary || project.links.readMore
  )

  function handleOpenProject() {
    if (onOpenProject) {
      onOpenProject(project)
      return
    }

    if (projectWindowRoute) {
      navigate(projectWindowRoute)
      return
    }

    if (project.links.primary) {
      window.open(project.links.primary, '_blank', 'noreferrer')
      return
    }

    if (project.links.readMore) {
      window.open(project.links.readMore, '_blank', 'noreferrer')
    }
  }

  function handleReadMore(event: MouseEvent<HTMLButtonElement>) {
    event.stopPropagation()

    if (onOpenProject) {
      onOpenProject(project)
      return
    }

    if (projectWindowRoute) {
      navigate(projectWindowRoute)
      return
    }

    if (project.links.readMore) {
      window.open(project.links.readMore, '_blank', 'noreferrer')
      return
    }

    if (project.links.primary) {
      window.open(project.links.primary, '_blank', 'noreferrer')
    }
  }

  return (
    <article
      id={cardId}
      role={isInteractive ? 'button' : undefined}
      tabIndex={isInteractive ? 0 : undefined}
      onClick={isInteractive ? handleOpenProject : undefined}
      onKeyDown={
        isInteractive
          ? (event) => {
              if (event.key !== 'Enter' && event.key !== ' ') {
                return
              }

              event.preventDefault()
              handleOpenProject()
            }
          : undefined
      }
      className={`flex min-w-0 w-full aspect-[4/5]
      ${isInteractive ? 'cursor-pointer' : 'cursor-default'} flex-col gap-2 rounded-lg border
      border-[var(--glass-border)] p-2 underline-none transition-all duration-200 ease-in-out
      hover:border-[var(--accent-lgtblue)] hover:bg-[var(--btn-sobre-col)]`}
    >
      <div className="flex flex-col gap-2">
        <div className="relative h-48 overflow-hidden">
          <img
            src={withBasePath(project.cover.src || DEFAULT_PROJECT_COVER)}
            alt={coverAlt}
            loading="lazy"
            onError={(event) => {
              event.currentTarget.src = DEFAULT_PROJECT_COVER
            }}
            className="block h-full w-full rounded-lg object-cover"
          />

          <span
            className="project-domain absolute left-3 top-3 z-10"
            style={{ color: getDomainColor(primaryDomain) }}
          >
            {primaryDomain}
          </span>
        </div>

        <h3 className="project-title mt-2 text-xl font-semibold transition-colors duration-200 ease-in-out hover:text-[var(--accent-blue)]">
          {content.title}
        </h3>

        <div className="flex flex-wrap gap-2">
          {keywords.slice(0, 3).map((keyword) => (
            <span
              key={keyword}
              className="rounded-[7px] bg-[var(--keyw-bg-col)] px-2 py-1 text-xs font-semibold uppercase text-[var(--keyw-col-window)]"
            >
              {keyword}
            </span>
          ))}
        </div>

        <p className="project-summary mt-2 line-clamp-10 border-t border-t-[var(--glass-border)] text-sm text-[var(--text2-col)] md:pt-2">
          {content.summary}
        </p>
      </div>

      <div className="mt-auto flex flex-col">
        <div className="flex items-center gap-4">
          <span className="font-semibold">{t('projects.technicalLevel')}:</span>

          <div className="flex text-lg tracking-[0.24em] text-[var(--accent-blue)]">
            {[1, 2, 3].map((star) => (
              <span
                key={star}
                className={
                  star <= project.technicalLevel
                    ? 'text-[var(--accent-blue)]'
                    : 'text-[var(--text2-col)]'
                }
              >
                {star <= project.technicalLevel ? '\u2605' : '\u2606'}
              </span>
            ))}
          </div>
        </div>

        <div className="flex justify-between">
          <span className="flex items-center text-sm text-[var(--text2-col)] capitalize">
            {new Date(project.date).toLocaleDateString(i18n.language, {
              month: 'short',
              year: '2-digit',
            })}
          </span>

          {(onOpenProject || projectWindowRoute || project.links.readMore) && (
            <button
              type="button"
              onClick={handleReadMore}
              className="flex items-center rounded-lg bg-[rgb(var(--domain-col-rgb)/0.2)]
              px-5 py-2 text-sm font-semibold text-[var(--text2-col)] no-underline
              transition-colors duration-200 ease-in-out hover:bg-[rgb(var(--domain-col-rgb)/0.7)]
              hover:text-[var(--text-col)]"
            >
              {t('projects.readMore')} <GoLinkExternal className="ml-1 inline" />
            </button>
          )}
        </div>
      </div>
    </article>
  )
}

export default ProjectCard
