// « À la une » du Hub (page /projects) : un grand projet, une rangée de quatre et la colonne de la série mise en avant.
// Composition inspirée d'une revue scientifique ; le contenu vient de projects.json et series.json.
import type { Project } from '../../types/project'
import type { Series } from '../../types/series'
import FeaturedCover from './FeaturedCover'
import FeaturedLead from './FeaturedLead'
import FeaturedStory from './FeaturedStory'

type FeaturedHubProps = {
  lead: Project | null
  row: Project[]
  series: Series | null
  labels: {
    featuredLabel: string
    coverEyebrow: string
    viewSeries: string
    subscribe: string
  }
  onOpenProject: (project: Project) => void
}

function FeaturedHub({ lead, row, series, labels, onOpenProject }: FeaturedHubProps) {
  if (!lead) return null

  return (
    <section
      className="featured-hub"
      aria-label={labels.featuredLabel}
    >
      <FeaturedLead
        project={lead}
        label={labels.featuredLabel}
        onOpenProject={onOpenProject}
      />

      <div className="featured-hub__row">
        {row.map((project) => (
          <FeaturedStory
            key={project.id}
            project={project}
            onOpenProject={onOpenProject}
          />
        ))}
      </div>

      {series ? (
        <FeaturedCover
          series={series}
          eyebrow={labels.coverEyebrow}
          viewLabel={labels.viewSeries}
          subscribeLabel={labels.subscribe}
        />
      ) : null}
    </section>
  )
}

export default FeaturedHub
