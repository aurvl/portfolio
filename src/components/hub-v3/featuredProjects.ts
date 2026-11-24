// Choix des projets « à la une » du Hub.
// Le premier est le grand article, les quatre suivants forment la rangée.
import featuredData from '../../data/featured.json'
import { withBasePath } from '../../lib/site'
import type { Project } from '../../types/project'

export const FEATURED_ROW_SIZE = 4

// Projets épinglés en fin de la rangée « à la une », dans cet ordre ; le reste de la rangée se complète avec les plus récents.
export const PINNED_ROW_SLUGS = ['technological-employment-gender-inequalities']

export const DEFAULT_PROJECT_COVER = withBasePath('assets/projects/images/defaultprojectcover.png')

function byNewestFirst(projectA: Project, projectB: Project) {
  return new Date(projectB.date).getTime() - new Date(projectA.date).getTime()
}

type FeaturedText = Record<string, Partial<Record<'en' | 'fr', { title?: string; summary?: string }>>>

// Texte d'affichage choisi dans data/featured.json (hub.text[slug]) : remplace le titre et le chapô du projet sur sa carte
// « à la une », sans toucher à la fiche du projet (projects.json).
export function withFeaturedText<T extends { title: string; summary: string }>(slug: string, language: string, content: T): T {
  const text = (featuredData.hub.text as FeaturedText)[slug]?.[language.startsWith('fr') ? 'fr' : 'en']
  return { ...content, title: text?.title?.trim() || content.title, summary: text?.summary?.trim() || content.summary }
}

// Ordre choisi à la main dans data/featured.json (hub.lead = le grand, hub.row = la rangée, dans l'ordre). Les slugs
// inconnus ou hors du lot sont ignorés ; si le grand projet n'existe plus, on retombe sur le choix automatique ci-dessous.
function pickChosenProjects(projects: Project[]) {
  const bySlug = new Map(projects.map((project) => [project.slug, project]))
  const lead = bySlug.get(featuredData.hub.lead) ?? null
  if (!lead) return null
  const row = featuredData.hub.row
    .map((slug) => bySlug.get(slug))
    .filter((project): project is Project => Boolean(project) && project !== lead)
    .slice(0, FEATURED_ROW_SIZE)
  return { lead, row }
}

// `projects` : le lot où choisir (la page passe les projets d'économie appliquée). Les projets marqués `featured` passent
// en premier ; s'il n'y en a pas assez (aujourd'hui aucun n'est marqué), on complète avec les plus récents.
export function pickFeaturedProjects(projects: Project[]) {
  const chosen = pickChosenProjects(projects)
  if (chosen) return chosen

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
