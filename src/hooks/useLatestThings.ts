// Les 3 cartes « Latest things » de l'accueil : un projet en cours, le papier de recherche le plus récent, puis le plus
// récent entre le dernier article de blog et le dernier projet terminé.
//   1. projet en cours : saisi à la main dans data/latest-things.json (premier élément à l'état « progress »)
//   2. papier : le plus récent de data/publications.json (champ `date`)
//   3. article ou projet terminé : le plus récent des deux, calculé automatiquement
// Les textes restent volontairement très courts (titre générique + quelques mots) : la carte est petite, surtout sur mobile.
import featuredData from '../data/featured.json'
import latestThingsData from '../data/latest-things.json'
import projectsData from '../data/projects.json'
import publicationsData from '../data/publications.json'
import { useTranslation } from 'react-i18next'
import type { AppLanguage } from '../types/i18n'
import type { Project } from '../types/project'
import { getLocalizedField, getProjectWindowRoute } from '../lib/utils'
import { useBlogIndex } from './useBlogIndex'

export type LatestThing = {
  // « progress » (projet en cours), « paper » (dernier papier) ou « recent » (dernier article ou projet terminé)
  kind: 'progress' | 'paper' | 'recent'
  id: string
  title: string
  description: string
  // « 2026-11-24 » ou, quand le jour n'est pas connu, « 2026-07 »
  date: string
  thumbnailSrc: string
  thumbnailAlt: string
  href: string
}

type CardOverrides = Partial<Record<'progress' | 'paper' | 'recent', Partial<Record<AppLanguage, { title?: string; description?: string }>>>>

type LatestThingsEntry = {
  state: 'progress' | 'prep' | 'done'
  title: string
  detail: string
  projectSlug?: string
  date?: string
}

// Photo de bambous allégée : vignette des cartes qui n'ont pas d'image propre (le papier de recherche)
const DEFAULT_THUMBNAIL = '/assets/images/bamboo-thumb.webp'

const projects = projectsData as Project[]
const entriesByLanguage = latestThingsData as Record<AppLanguage, LatestThingsEntry[]>

function toTime(date: string) {
  return new Date(date).getTime()
}

export function useLatestThings(lang: AppLanguage) {
  const { t } = useTranslation()
  const { index: posts } = useBlogIndex(lang)
  const items: LatestThing[] = []

  // 1. Projet en cours
  const inProgress = entriesByLanguage[lang].find((entry) => entry.state === 'progress')
  const inProgressProject = projects.find((project) => project.slug === inProgress?.projectSlug)

  if (inProgress) {
    items.push({
      kind: 'progress',
      id: `in-progress-${inProgress.projectSlug ?? inProgress.title}`,
      title: inProgress.title,
      description: inProgress.detail,
      date: inProgress.date ?? inProgressProject?.date ?? '',
      thumbnailSrc: inProgressProject?.cover.src ?? DEFAULT_THUMBNAIL,
      thumbnailAlt: inProgressProject ? getLocalizedField(inProgressProject.cover.alt, lang) : '',
      href: inProgressProject ? (getProjectWindowRoute(inProgressProject) ?? '/projects') : '/projects',
    })
  }

  // 2. Papier de recherche le plus récent
  const latestPaper = [...publicationsData].sort((a, b) => toTime(b.date) - toTime(a.date))[0]

  if (latestPaper) {
    items.push({
      kind: 'paper',
      id: `paper-${latestPaper.url}`,
      title: t('latest.lastPaper'),
      description: t('latest.paperKind'),
      date: latestPaper.date,
      thumbnailSrc: DEFAULT_THUMBNAIL,
      thumbnailAlt: '',
      href: '/publications',
    })
  }

  // 3. Le plus récent entre le dernier article de blog et le dernier projet terminé
  const latestPost = [...posts].sort((a, b) => toTime(b.date) - toTime(a.date))[0]
  const latestProject = projects
    .filter((project) => project.status === 'completed')
    .sort((a, b) => toTime(b.date) - toTime(a.date))[0]

  const projectIsNewer = latestProject && (!latestPost || toTime(latestProject.date) >= toTime(latestPost.date))

  if (projectIsNewer) {
    items.push({
      kind: 'recent',
      id: `project-${latestProject.slug}`,
      title: t('latest.lastProject'),
      // Premier domaine du projet (ex. « Econometrics »)
      description: latestProject.taxonomy.domains[0] ?? '',
      date: latestProject.date,
      thumbnailSrc: latestProject.cover.src,
      thumbnailAlt: getLocalizedField(latestProject.cover.alt, lang),
      href: getProjectWindowRoute(latestProject) ?? '/projects',
    })
  } else if (latestPost) {
    items.push({
      kind: 'recent',
      id: `post-${latestPost.slug}`,
      title: t('latest.lastPost'),
      description: t('latest.postKind'),
      date: latestPost.date,
      thumbnailSrc: latestPost.cover,
      thumbnailAlt: '',
      href: `/blog/${latestPost.slug}`,
    })
  }

  // Texte d'affichage choisi dans data/featured.json (`cards`) : remplace le titre et la description automatiques de la
  // carte (papier, dernier article ou projet), sans toucher aux données du papier, de l'article ou du projet.
  const overrides = featuredData.cards as CardOverrides
  for (const item of items) {
    const override = overrides[item.kind]?.[lang]
    if (override?.title?.trim()) item.title = override.title.trim()
    if (override?.description?.trim()) item.description = override.description.trim()
  }

  // Ordre des cartes choisi dans data/featured.json (`latest`) ; une carte absente de la liste passe à la fin
  const rank = (item: LatestThing) => {
    const position = (featuredData.latest as string[]).indexOf(item.kind)
    return position === -1 ? featuredData.latest.length : position
  }

  return items.sort((a, b) => rank(a) - rank(b))
}
