// Carte projet du Hub (grille de /projects), style éditorial : image avec étiquette de domaine, titre serif,
// mots-clés en petites majuscules, filet, description, date et lien « Read more ». Styles : styles/v3/hub.css.
import type { MouseEvent } from 'react'
import { GoLinkExternal } from 'react-icons/go'
import { useTranslation } from 'react-i18next'
import Button from '../ui/Button'
import { cn } from '../../lib/cn'
import { navigateToPage } from '../../lib/pageTransition'
import { getLocalizedField, getProjectContent, getProjectWindowRoute } from '../../lib/utils'
import { getImageDimensions } from '../../lib/imageMetadata'
import { withBasePath } from '../../lib/site'
import { DEFAULT_PROJECT_COVER } from '../hub-v3/featuredProjects'
import type { Project } from '../../types/project'

type ProjectCardProps = {
  project: Project
  onOpenProject?: (project: Project) => void
  cardId?: string
}

function ProjectCard({ project, onOpenProject, cardId }: ProjectCardProps) {
  const { t, i18n } = useTranslation()
  const content = getProjectContent(project, i18n.language)
  const coverAlt = getLocalizedField(project.cover.alt, i18n.language)
  const keywords = getLocalizedField(project.taxonomy.keywords, i18n.language)
  const primaryDomain = project.taxonomy.domains[0] ?? t('projects.fallbackDomain')
  const projectWindowRoute = getProjectWindowRoute(project)
  const imageSource = project.cover.src || 'assets/projects/images/defaultprojectcover.png'
  const imageDimensions = getImageDimensions(imageSource)
  const hasReadMore = Boolean(onOpenProject || projectWindowRoute || project.links.readMore)
  const isInteractive = Boolean(hasReadMore || project.links.primary)

  function handleOpenProject() {
    if (onOpenProject) {
      onOpenProject(project)
      return
    }

    if (projectWindowRoute) {
      navigateToPage(projectWindowRoute)
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
    // Le clic sur « Read more » ne doit pas être compté deux fois par la carte entière
    event.stopPropagation()

    if (onOpenProject) {
      onOpenProject(project)
      return
    }

    if (projectWindowRoute) {
      navigateToPage(projectWindowRoute)
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
      className={cn('hub-card', isInteractive && 'hub-card--interactive')}
    >
      <div className="hub-card__media">
        <img
          src={withBasePath(imageSource)}
          alt={coverAlt}
          width={imageDimensions?.width}
          height={imageDimensions?.height}
          loading="lazy"
          onError={(event) => {
            event.currentTarget.src = DEFAULT_PROJECT_COVER
          }}
          className="hub-card__cover"
        />

        <span className="hub-card__domain">{primaryDomain}</span>
      </div>

      <h3 className="hub-card__title">{content.title}</h3>

      <ul className="hub-card__tags">
        {keywords.slice(0, 3).map((keyword) => (
          <li key={keyword}>{keyword}</li>
        ))}
      </ul>

      <p className="hub-card__summary">{content.summary}</p>

      <div className="hub-card__footer">
        <span className="hub-card__date tabular">
          {new Date(project.date).toLocaleDateString(i18n.language, {
            month: 'short',
            year: '2-digit',
          })}
        </span>

        {hasReadMore ? (
          <Button
            variant="link"
            icon={<GoLinkExternal />}
            onClick={handleReadMore}
          >
            {t('projects.readMore')}
          </Button>
        ) : null}
      </div>
    </article>
  )
}

export default ProjectCard
