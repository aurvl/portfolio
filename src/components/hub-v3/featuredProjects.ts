// Choix des projets « à la une » du Hub.
// Le premier est le grand article, les quatre suivants forment la rangée.
import { withBasePath } from '../../lib/site'
import type { Project } from '../../types/project'

export const FEATURED_ROW_SIZE = 4

// Projets épinglés en fin de la rangée « à la une », dans cet ordre ; le reste de la rangée se complète avec les plus récents.
export const PINNED_ROW_SLUGS = ['technological-employment-gender-inequalities']

export const DEFAULT_PROJECT_COVER = withBasePath('assets/projects/images/defaultprojectcover.png')

function byNewestFirst(projectA: Project, projectB: Project) {
  return new Date(projectB.date).getTime() - new Date(projectA.date).getTime()
}

// `projects` : le lot où choisir (la page passe les projets d'économie appliquée). Les projets marqués `featured` passent
// en premier ; s'il n'y en a pas assez (aujourd'hui aucun n'est marqué), on complète avec les plus récents.
export function pickFeaturedProjects(projects: Project[]) {
  const flagged = projects.filter((project) => project.featured).sort(byNewestFirst)
  const others = projects.filter((project) => !project.featured).sort(byNewestFirst)
  const ordered = [...flagged, ...others]
  const lead = ordered[0] ?? null
  const pinned = PINNED_ROW_SLUGS
    .map((slug) => ordered.find((project) => project.slug === slug))
    .filter((project): project is Project => Boolean(project) && project !== lead)
  const rowSize = FEATURED_ROW_SIZE - pinned.length
  const rest = ordered.filter((project) => project !== lead && !pinned.includes(project)).slice(0, rowSize)

  return {
    lead,
    row: [...rest, ...pinned],
  }
}
