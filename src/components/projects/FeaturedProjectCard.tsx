import type { MouseEvent } from 'react'
import { GoLinkExternal } from "react-icons/go";
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { getLocalizedField, getProjectContent, getProjectWindowRoute } from '../../lib/utils'
import { getDomainColor } from '../../lib/domainColors'
import { withBasePath } from '../../lib/site'
import type { Project } from '../../types/project'

type FeaturedProjectCardProps = {
  project: Project
}

const DEFAULT_PROJECT_COVER = withBasePath('assets/projects/images/defaultprojectcover.png')

function FeaturedProjectCard({ project }: FeaturedProjectCardProps) {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const content = getProjectContent(project, i18n.language)
  const coverAlt = getLocalizedField(project.cover.alt, i18n.language)
  const keywords = getLocalizedField(project.taxonomy.keywords, i18n.language)
  const primaryDomain = project.taxonomy.domains[0] ?? t('projects.fallbackDomain')
  const projectWindowRoute = getProjectWindowRoute(project)
  const isInteractive = Boolean(
    projectWindowRoute || project.links.primary || project.links.readMore
  )

  function handleOpenProject() {
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
      className="mx-8 flex cursor-pointer flex-col gap-3 rounded-lg border border-[var(--glass-border)] 
      p-6 underline-none transition-colors duration-200 ease-in-out hover:border-[var(--accent-lgtblue)] 
      hover:bg-[var(--btn-sobre-col)] md:mx-12 md:flex-row md:p-2"
    >
      <div className="featured-project-card__image basis-2/5 w-full">
        <img
          src={withBasePath(project.cover.src || DEFAULT_PROJECT_COVER)}
          alt={coverAlt}
          onError={(event) => {
            event.currentTarget.src = DEFAULT_PROJECT_COVER
          }}
          className="h-full w-full rounded-lg object-cover"
        />
      </div>

      <div className="basis-3/5 flex w-full flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="project-domain" style={{ color: getDomainColor(primaryDomain) }}>
            {primaryDomain}
          </span>

          <span className="flex items-center text-sm text-[var(--text2-col)]">
            {new Date(project.date).toLocaleDateString(i18n.language, {
              month: 'short',
              year: '2-digit',
            })}
          </span>
        </div>

        <h3 className="project-title text-3xl font-semibold transition-colors duration-200 ease-in-out hover:text-[var(--accent-blue)]">
          {content.title}
        </h3>

        <div className="flex gap-2">
          {keywords.slice(0, 3).map((keyword) => (
            <span
              key={keyword}
              className="rounded-[7px] bg-[var(--keyw-bg-col)] px-2 py-1 text-xs font-semibold uppercase text-[var(--keyw-col)]"
            >
              {keyword}
            </span>
          ))}
        </div>

        <p className="project-summary">{content.summary}</p>

        <div className="mt-auto flex items-center justify-between">
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

          {(projectWindowRoute || project.links.readMore) && (
            <button
              type="button"
              onClick={handleReadMore}
              className="flex items-center cursor-pointer rounded-lg bg-[rgb(var(--domain-col-rgb)/0.2)] 
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

export default FeaturedProjectCard
