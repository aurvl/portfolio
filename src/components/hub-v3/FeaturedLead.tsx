// Le grand article du « à la une » du Hub : bloc sombre (texte) à gauche, grande image à droite.
import { useTranslation } from 'react-i18next'
import { getLocalizedField, getProjectContent } from '../../lib/utils'
import { withBasePath } from '../../lib/site'
import type { Project } from '../../types/project'
import { DEFAULT_PROJECT_COVER, withFeaturedText } from './featuredProjects'

type FeaturedLeadProps = {
  project: Project
  label: string
  onOpenProject: (project: Project) => void
}

function FeaturedLead({ project, label, onOpenProject }: FeaturedLeadProps) {
  const { i18n } = useTranslation()
  const content = withFeaturedText(project.slug, i18n.language, getProjectContent(project, i18n.language))
  const domain = project.taxonomy.domains[0]

  return (
    <article className="featured-lead">
      <div className="featured-lead__text">
        <p className="eyebrow featured-lead__eyebrow">{[label, domain].filter(Boolean).join(' · ')}</p>

        <h2 className="featured-lead__title">
          {/* Lien étiré : le ::after du bouton couvre tout le bloc, donc un clic n'importe où ouvre le projet */}
          <button
            type="button"
            className="featured-lead__open"
            onClick={() => onOpenProject(project)}
          >
            {content.title}
          </button>
        </h2>

        <p className="featured-lead__summary">{content.summary}</p>
      </div>

      <img
        className="featured-lead__image"
        src={withBasePath(project.cover.src || 'assets/projects/images/defaultprojectcover.png')}
        alt={getLocalizedField(project.cover.alt, i18n.language)}
        loading="eager"
        onError={(event) => {
          event.currentTarget.src = DEFAULT_PROJECT_COVER
        }}
      />
    </article>
  )
}

export default FeaturedLead
