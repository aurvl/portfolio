// Contenu de l'accueil v3 et des pages Publications, en français et en anglais (même forme) : profil, parcours,
// textes de l'À propos, libellés, thèmes « Je travaille sur », publications. Les textes vivent dans homepage.json
// (`{ en, fr }`, édité par Portfolio Manager) ; ce fichier ne garde que les types et l'accès par langue.
// Les composants lisent tout par `homepage`. Le texte du Hub, de la navigation et du contact est dans home.ts / home.fr.ts.
import type { AppLanguage } from '../types/i18n'
import homepageData from './homepage.json'
import publicationsData from './publications.json'

// ---------------------------------------------------------------- Types

export type HomepageProfile = {
  firstNames: string
  lastName: string
  role: string
  affiliation: string
  avatarSrc: string | null
  avatarAlt: string
  resumeLabel: string
}

// Une étape du parcours : année (ou « Next »), texte, et un repère pour l'étape en cours ou à venir.
export type TimelineStep = {
  when: string
  what: string
  current?: boolean
  next?: boolean
}

export type HomepageAboutSection = {
  heading: string
  body: string
}

export type HomepageAboutLabels = {
  title: string
  exploreWork: string
  getInTouch: string
  viewPapers: string
  timelineLabel: string
  // Version mobile (< 1024 px)
  hook: string
  workingOn: string
  journeyTitle: string
  downloadResume: string
  journeyPlace: string
  readMore: string
  readLess: string
  nextTitle: string
  papersDoor: string
  projectsDoor: string
  contactLink: string
}

// Une pastille avec `tag` ouvre /projects?tag=<tag> : le filtre du Hub compare ce mot, tel quel, aux mots-clés des projets
// (anglais ou français selon la langue). Sans `tag`, la pastille est une simple étiquette, non cliquable : aucun projet
// ne porte ce mot-clé (firm transformations = la thèse, ecosystem value = l'article Blue Carbon).
// Les mots-clés français n'ont pas d'accents (« series-temporelles ») : on garde la même écriture.
export type HomepageTheme = {
  label: string
  tag?: string
}

export type HomepageLandingLabels = {
  learnMore: string
  latestThings: string
}

export type HomepagePublicationsLabels = {
  eyebrow: string
  title: string
  intro: string
  backToAbout: string
  viewPaper: string
  seoTitle: string
  seoDescription: string
}

// Forme d'une langue dans homepage.json
type HomepageLanguageData = {
  profile: HomepageProfile
  timeline: TimelineStep[]
  aboutSections: HomepageAboutSection[]
  aboutLabels: HomepageAboutLabels
  themes: HomepageTheme[]
  landingLabels: HomepageLandingLabels
  publicationsLabels: HomepagePublicationsLabels
}

// `satisfies` : le build échoue si le JSON n'a pas la forme attendue, dans les deux langues.
const data = homepageData satisfies Record<AppLanguage, HomepageLanguageData>

// ---------------------------------------------------------------- Accès par langue

export const homepage = {
  getProfile: (lang: AppLanguage): HomepageProfile => data[lang].profile,
  getTimeline: (lang: AppLanguage): TimelineStep[] => data[lang].timeline,
  getAboutSections: (lang: AppLanguage): HomepageAboutSection[] => data[lang].aboutSections,
  getAboutLabels: (lang: AppLanguage): HomepageAboutLabels => data[lang].aboutLabels,
  getThemes: (lang: AppLanguage): HomepageTheme[] => data[lang].themes,
  getLandingLabels: (lang: AppLanguage): HomepageLandingLabels => data[lang].landingLabels,
  getPublicationsLabels: (lang: AppLanguage): HomepagePublicationsLabels => data[lang].publicationsLabels,
  // Les vraies publications (src/data/publications.json), les plus récentes d'abord
  getPublications: (lang: AppLanguage) =>
    [...publicationsData]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .map(({ kind, status, ...entry }) => ({
        ...entry,
        kind: kind[lang],
        status: status[lang],
      })),
}
