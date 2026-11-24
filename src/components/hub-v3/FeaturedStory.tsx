// Un article de la rangée « à la une » du Hub : image, titre serif souligné, chapô.
import { useTranslation } from 'react-i18next'
import { getLocalizedField, getProjectContent } from '../../lib/utils'
import { withBasePath } from '../../lib/site'
import type { Project } from '../../types/project'
import { DEFAULT_PROJECT_COVER, withFeaturedText } from './featuredProjects'

type FeaturedStoryProps = {
  project: Project
  onOpenProject: (project: Project) => void
}

function FeaturedStory({ project, onOpenProject }: FeaturedStoryProps) {
  const { i18n } = useTranslation()
  const content = withFeaturedText(project.slug, i18n.language, getProjectContent(project, i18n.language))

  return (
    <article className="featured-story">
      <img
        className="featured-story__image"
        src={withBasePath(project.cover.src || 'assets/projects/images/defaultprojectcover.png')}
        alt={getLocalizedField(project.cover.alt, i18n.language)}
        loading="lazy"
        onError={(event) => {
          event.currentTarget.src = DEFAULT_PROJECT_COVER
        }}
      />

      <h3 className="featured-story__title">
        {/* Lien étiré : le ::after du bouton couvre toute la carte */}
        <button
          type="button"
          className="featured-story__open"
          onClick={() => onOpenProject(project)}
        >
          {content.title}
        </button>
      </h3>

      <p className="featured-story__summary">{content.summary}</p>
    </article>
  )
}

export default FeaturedStory
