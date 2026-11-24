// DONNÉES FICTIVES — design v3, branche redesign/researcher-friendly uniquement.
// Rien ici n'est vrai : noms, parcours, projets et publications servent à valider le visuel.
// Interdit de merger sur master tant que ce fichier existe (PLAN.md, étape 16).
// Pour rebrancher les vraies données, changer seulement la source importée par les composants.
import type { AppLanguage } from '../types/i18n'
import type { LocalizedField } from '../types/project'
import publicationsData from './publications.json'

export const IS_PLACEHOLDER_DATA = true

// ---------------------------------------------------------------- Profil

export type PlaceholderProfile = {
  firstNames: string
  lastName: string
  role: string
  affiliation: string
  avatarSrc: string | null
  avatarAlt: string
  resumeLabel: string
}

const profile: LocalizedField<PlaceholderProfile> = {
  en: {
    firstNames: 'Aurel',
    lastName: 'VEHI',
    role: 'Applied economist · PhD researcher',
    affiliation: 'ESTIA & University of Bordeaux',
    avatarSrc: '/assets/images/hero-image.png',
    avatarAlt: 'Portrait of Aurel Vehi',
    resumeLabel: 'View my Resume',
  },
  fr: {
    firstNames: 'Aurel',
    lastName: 'VEHI',
    role: 'Économiste appliqué · Doctorant',
    affiliation: 'ESTIA & Université de Bordeaux',
    avatarSrc: '/assets/images/hero-image.png',
    avatarAlt: 'Portrait d’Aurel Vehi',
    resumeLabel: 'Voir mon CV',
  },
}

// ---------------------------------------------------------------- Parcours (timeline)

// Une étape du parcours : année (ou « Next »), texte, et un repère pour l'étape en cours ou à venir.
export type PlaceholderTimelineStep = {
  when: string
  what: string
  current?: boolean
  next?: boolean
}

const timeline: LocalizedField<PlaceholderTimelineStep[]> = {
  en: [
    { when: 'Background', what: 'Economics, econometrics & data science' },
    { when: '2024–2025', what: 'Data research & econometrics roles, Monaco' },
    { when: '2026', what: 'First peer-reviewed publication' },
    { when: '2026–2029', what: 'PhD in applied economics', current: true },
    { when: 'Next', what: '…', next: true },
  ],
  fr: [
    { when: 'Formation', what: 'Économie, économétrie et science des données' },
    { when: '2024–2025', what: 'Postes en recherche de données et économétrie, Monaco' },
    { when: '2026', what: 'Première publication évaluée par les pairs' },
    { when: '2026–2029', what: 'Doctorat en économie appliquée', current: true },
    { when: 'Ensuite', what: '…', next: true },
  ],
}

// ---------------------------------------------------------------- Textes de l'About

export type PlaceholderAboutSection = {
  heading: string
  body: string
}

const aboutSections: LocalizedField<PlaceholderAboutSection[]> = {
  en: [
    {
      heading: 'What I work on',
      body: 'My doctoral research is about the transformation and maturity of firms, and how the two together explain adaptation, innovation, performance and sustainability. I am building an analytical framework to observe, measure and explain these dynamics in their territorial and cross-border contexts, within the European OISE project (Nouvelle-Aquitaine–Euskadi–Navarre Euroregion).',
    },
    {
      heading: 'How I work',
      body: 'I start by making the subject my own, exploring the disciplines it touches to understand its foundations, mechanisms and stakes. From there I build a conceptual framework that structures the phenomena and their relationships, then a quantitative representation, using statistics, econometrics and data science to measure, explain the dynamics and, where possible, anticipate how they evolve.',
    },
    {
      heading: 'Beyond research',
      body: 'I am particularly fascinated by how the human mind can grasp the complexity of the real world with very few means: that is what draws me to mathematics and, in my field, to modeling and measuring economic phenomena from data. These data are traces of far more complex phenomena; using them means understanding the underlying mechanisms better and trying to anticipate how they evolve.',
    },
  ],
  fr: [
    {
      heading: 'Sur quoi je travaille',
      body: 'Mes recherches doctorales portent sur la transformation et la maturité des entreprises, et sur la façon dont elles s’articulent pour expliquer l’adaptation, l’innovation, la performance et la durabilité. Je développe un cadre analytique pour observer, mesurer et expliquer ces dynamiques dans leurs contextes territoriaux et transfrontaliers, dans le cadre du projet européen OISE (Eurorégion Nouvelle-Aquitaine–Euskadi–Navarre).',
    },
    {
      heading: 'Ma façon de travailler',
      body: 'Je commence par m’approprier le sujet en explorant les disciplines qui le touchent, pour en comprendre les fondements, les mécanismes et les enjeux. J’en tire un cadre conceptuel qui structure les phénomènes et leurs relations, puis une représentation quantitative, avec la statistique, l’économétrie et la science des données : mesurer, expliquer les dynamiques et, quand c’est possible, anticiper leur évolution.',
    },
    {
      heading: 'Au-delà de la recherche',
      body: 'Je suis particulièrement fasciné par la capacité de l’esprit humain à saisir la complexité du réel avec très peu de moyens : c’est ce qui m’attire dans les mathématiques et, dans mon domaine, dans la modélisation et la mesure des phénomènes économiques à partir des données. Ces données sont les traces de phénomènes bien plus complexes ; les exploiter, c’est mieux comprendre les mécanismes sous-jacents et tenter d’en anticiper l’évolution.',
    },
  ],
}

// ---------------------------------------------------------------- Libellés de l'About

export type PlaceholderAboutLabels = {
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

const aboutLabels: LocalizedField<PlaceholderAboutLabels> = {
  en: {
    title: 'About Me',
    exploreWork: 'Explore my Work',
    getInTouch: 'Get in touch',
    viewPapers: 'View my papers',
    timelineLabel: 'Career timeline',
    hook: 'Applied economist who models complex economic phenomena to explain them simply.',
    workingOn: 'I work on',
    journeyTitle: 'My journey',
    downloadResume: 'View my Resume',
    journeyPlace: 'ESTIA & University of Bordeaux',
    readMore: 'Read more',
    readLess: 'Read less',
    nextTitle: 'Go further',
    papersDoor: 'Research',
    projectsDoor: 'Projects',
    contactLink: 'A question? Get in touch',
  },
  fr: {
    title: 'À propos',
    exploreWork: 'Découvrir mes travaux',
    getInTouch: 'Me contacter',
    viewPapers: 'Voir mes articles',
    timelineLabel: 'Parcours',
    hook: 'Économiste appliqué, je modélise des phénomènes économiques complexes pour les expliquer simplement.',
    workingOn: 'Je travaille sur',
    journeyTitle: 'Mon parcours',
    downloadResume: 'Voir mon CV',
    journeyPlace: 'ESTIA & Université de Bordeaux',
    readMore: 'Lire la suite',
    readLess: 'Réduire',
    nextTitle: 'Pour aller plus loin',
    papersDoor: 'Recherche',
    projectsDoor: 'Projets',
    contactLink: 'Une question ? Me contacter',
  },
}

// ---------------------------------------------------------------- Thèmes « Je travaille sur »

// Une pastille avec `tag` ouvre /projects?tag=<tag> : le filtre du Hub compare ce mot, tel quel, aux mots-clés des projets
// (anglais ou français selon la langue). Sans `tag`, la pastille est une simple étiquette, non cliquable : aucun projet
// ne porte ce mot-clé (firm transformations = la thèse, ecosystem value = l'article Blue Carbon).
// Les mots-clés français n'ont pas d'accents (« series-temporelles ») : on garde la même écriture.
export type PlaceholderTheme = {
  label: string
  tag?: string
}

const themes: LocalizedField<PlaceholderTheme[]> = {
  en: [
    { label: 'Firm transformations' },
    { label: 'Indicators', tag: 'index' },
    { label: 'Ecosystem value' },
    { label: 'Time series', tag: 'time-series' },
  ],
  fr: [
    { label: 'Transformations des entreprises' },
    { label: 'Indicateurs', tag: 'indice' },
    { label: 'Valeur des écosystèmes' },
    { label: 'Séries temporelles', tag: 'series-temporelles' },
  ],
}

// ---------------------------------------------------------------- Libellés de la landing

export type PlaceholderLandingLabels = {
  learnMore: string
  latestThings: string
}

const landingLabels: LocalizedField<PlaceholderLandingLabels> = {
  en: { learnMore: 'Learn more', latestThings: 'Latest things' },
  fr: { learnMore: 'En savoir plus', latestThings: 'Dernières nouveautés' },
}

// ---------------------------------------------------------------- Libellés de la section Publications

export type PlaceholderPublicationsLabels = {
  eyebrow: string
  title: string
  intro: string
  backToAbout: string
  viewPaper: string
  seoTitle: string
  seoDescription: string
}

const publicationsLabels: LocalizedField<PlaceholderPublicationsLabels> = {
  en: {
    eyebrow: 'Research',
    title: 'My research papers',
    intro: 'Topics I have worked on and published about: blue carbon and the value of natural capital.',
    backToAbout: 'Back to about',
    viewPaper: 'View paper',
    seoTitle: 'Research papers',
    seoDescription: 'Peer-reviewed publications co-authored by Aurel Vehi.',
  },
  fr: {
    eyebrow: 'Recherche',
    title: 'Mes articles de recherche',
    intro: 'Les sujets sur lesquels j’ai travaillé et publié : le carbone bleu et la valeur du capital naturel.',
    backToAbout: 'Retour à À propos',
    viewPaper: 'Voir l’article',
    seoTitle: 'Articles de recherche',
    seoDescription: 'Publications évaluées par les pairs co-écrites par Aurel Vehi.',
  },
}

// ---------------------------------------------------------------- Accès par langue

export const placeholders = {
  getProfile: (lang: AppLanguage) => profile[lang],
  getTimeline: (lang: AppLanguage) => timeline[lang],
  getAboutSections: (lang: AppLanguage) => aboutSections[lang],
  getAboutLabels: (lang: AppLanguage) => aboutLabels[lang],
  getThemes: (lang: AppLanguage) => themes[lang],
  getLandingLabels: (lang: AppLanguage) => landingLabels[lang],
  getPublicationsLabels: (lang: AppLanguage) => publicationsLabels[lang],
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
