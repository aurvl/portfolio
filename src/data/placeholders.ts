// DONNÉES FICTIVES — design v3, branche redesign/researcher-friendly uniquement.
// Rien ici n'est vrai : noms, parcours, projets et publications servent à valider le visuel.
// Interdit de merger sur master tant que ce fichier existe (PLAN.md, étape 16).
// Pour rebrancher les vraies données, changer seulement la source importée par les composants.
import type { AppLanguage } from '../types/i18n'
import type { LocalizedField, Project } from '../types/project'
import type publicationsData from './publications.json'

export const IS_PLACEHOLDER_DATA = true

// ---------------------------------------------------------------- Profil

export type PlaceholderProfile = {
  firstNames: string
  lastName: string
  role: string
  affiliation: string
  tagline: string
  avatarSrc: string | null
  avatarAlt: string
  resumeLabel: string
}

const profile: LocalizedField<PlaceholderProfile> = {
  en: {
    firstNames: 'Firstname Middlename',
    lastName: 'LASTNAME',
    role: 'Placeholder role · Researcher in applied economics',
    affiliation: 'Placeholder institution, Placeholder city',
    tagline: 'A short sentence, written for the placeholder profile, that says what this person works on.',
    avatarSrc: '/assets/images/hero-image.png',
    avatarAlt: 'Portrait',
    resumeLabel: 'View my Resume',
  },
  fr: {
    firstNames: 'Prénom Deuxième-prénom',
    lastName: 'NOM',
    role: 'Poste fictif · Chercheur en économie appliquée',
    affiliation: 'Institution fictive, Ville fictive',
    tagline: 'Une courte phrase, écrite pour le profil fictif, qui dit sur quoi travaille cette personne.',
    avatarSrc: '/assets/images/hero-image.png',
    avatarAlt: 'Portrait',
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
    { when: '2018', what: 'Placeholder bachelor in economics' },
    { when: '2020', what: 'Placeholder master in quantitative methods' },
    { when: '2022', what: 'Placeholder research assistant position' },
    { when: '2024', what: 'Placeholder first article submitted' },
    { when: '2026', what: 'Placeholder doctoral research', current: true },
    { when: 'Next', what: 'Placeholder next step', next: true },
  ],
  fr: [
    { when: '2018', what: 'Licence d’économie fictive' },
    { when: '2020', what: 'Master de méthodes quantitatives fictif' },
    { when: '2022', what: 'Poste d’assistant de recherche fictif' },
    { when: '2024', what: 'Premier article fictif soumis' },
    { when: '2026', what: 'Recherche doctorale fictive', current: true },
    { when: 'Ensuite', what: 'Prochaine étape fictive', next: true },
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
      body: 'This paragraph is a placeholder. It has the length of three or four real lines, so the layout can be judged: line spacing, column width and the way the serif heading sits above the text.',
    },
    {
      heading: 'How I work',
      body: 'Another placeholder paragraph. It explains, in plain words, a method and a way of working. Nothing here describes a real person, a real project or a real result.',
    },
    {
      heading: 'Beyond research',
      body: 'A last placeholder paragraph, a little more personal in tone, to check how the page reads from top to bottom before the real texts replace it.',
    },
  ],
  fr: [
    {
      heading: 'Sur quoi je travaille',
      body: 'Ce paragraphe est fictif. Il a la longueur de trois ou quatre vraies lignes, pour juger la mise en page : interligne, largeur de colonne et place du titre serif au-dessus du texte.',
    },
    {
      heading: 'Ma façon de travailler',
      body: 'Un autre paragraphe fictif. Il explique, avec des mots simples, une méthode et une manière de travailler. Rien ici ne décrit une vraie personne, un vrai projet ou un vrai résultat.',
    },
    {
      heading: 'Au-delà de la recherche',
      body: 'Un dernier paragraphe fictif, au ton un peu plus personnel, pour vérifier la lecture de la page de haut en bas avant que les vrais textes ne le remplacent.',
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
    hook: 'Placeholder researcher in applied economics, who measures one fictional thing and explains it simply.',
    workingOn: 'I work on',
    journeyTitle: 'My journey',
    downloadResume: 'View my Resume',
    journeyPlace: 'Placeholder University, 2026–',
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
    hook: 'Chercheur fictif en économie appliquée, qui mesure une chose fictive et l’explique simplement.',
    workingOn: 'Je travaille sur',
    journeyTitle: 'Mon parcours',
    downloadResume: 'Voir mon CV',
    journeyPlace: 'Université fictive, 2026–',
    readMore: 'Lire la suite',
    readLess: 'Réduire',
    nextTitle: 'Pour aller plus loin',
    papersDoor: 'Recherche',
    projectsDoor: 'Projets',
    contactLink: 'Une question ? Me contacter',
  },
}

// ---------------------------------------------------------------- Thèmes « Je travaille sur »

// Une pastille ouvre /projects?tag=<thème> : le filtre existant compare ce texte, tel quel, aux mots-clés des projets.
// Ces thèmes sont donc des mots-clés qui existent dans les projets fictifs ci-dessous ET dans les projets actuels
// du hub (le hub lit encore projects.json jusqu'à l'étape 10), pour que le filtre renvoie des résultats.
// Les mots-clés réels français n'ont pas d'accents (« prevision ») : on garde la même écriture.
// À remplacer par les vrais thèmes du propriétaire au moment du vrai contenu (étape 16).
const themes: LocalizedField<string[]> = {
  en: ['regression', 'forecasting', 'classification', 'visualization'],
  fr: ['regression', 'prevision', 'classification', 'visualisation'],
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

// ---------------------------------------------------------------- Latest things

export type LatestThing = {
  id: string
  title: string
  description: string
  date: string
  thumbnailSrc: string
  thumbnailAlt: string
  href: string
}

const latestThings: LocalizedField<LatestThing[]> = {
  en: [
    {
      id: 'latest-1',
      title: 'Project update',
      description: 'A two-line description of a fictional update, long enough to test how the card wraps next to its thumbnail.',
      date: '2026-09-12',
      thumbnailSrc: '/assets/projects/images/bayesian-linear-regression-econometrics-cover.jpg',
      thumbnailAlt: 'Placeholder thumbnail',
      href: '/projects',
    },
    {
      id: 'latest-2',
      title: 'New blog post',
      description: 'A fictional blog post summary, written to show how a longer description is cut on the card.',
      date: '2026-08-03',
      thumbnailSrc: '/assets/blog/images/blog6.jpg',
      thumbnailAlt: 'Placeholder thumbnail',
      href: '/projects#blog',
    },
    {
      id: 'latest-3',
      title: 'Research note',
      description: 'A fictional note about work in progress, with a short description and a date.',
      date: '2026-06-21',
      thumbnailSrc: '/assets/images/hero-bamboo-1200.webp',
      thumbnailAlt: 'Placeholder thumbnail',
      href: '/publications',
    },
  ],
  fr: [
    {
      id: 'latest-1',
      title: 'Mise à jour projet',
      description: 'Une description de deux lignes pour une mise à jour fictive, assez longue pour tester le retour à la ligne à côté de la vignette.',
      date: '2026-09-12',
      thumbnailSrc: '/assets/projects/images/bayesian-linear-regression-econometrics-cover.jpg',
      thumbnailAlt: 'Vignette fictive',
      href: '/projects',
    },
    {
      id: 'latest-2',
      title: 'Nouvel article',
      description: 'Un résumé d’article fictif, écrit pour voir comment une description plus longue est coupée sur la carte.',
      date: '2026-08-03',
      thumbnailSrc: '/assets/blog/images/blog6.jpg',
      thumbnailAlt: 'Vignette fictive',
      href: '/projects#blog',
    },
    {
      id: 'latest-3',
      title: 'Note de recherche',
      description: 'Une note fictive sur un travail en cours, avec une courte description et une date.',
      date: '2026-06-21',
      thumbnailSrc: '/assets/images/hero-bamboo-1200.webp',
      thumbnailAlt: 'Vignette fictive',
      href: '/publications',
    },
  ],
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
    intro: 'Placeholder introduction: a few lines to say what the papers below have in common.',
    backToAbout: 'Back to about',
    viewPaper: 'View paper',
    seoTitle: 'Research papers',
    seoDescription: 'Placeholder description of the research papers page.',
  },
  fr: {
    eyebrow: 'Recherche',
    title: 'Mes articles de recherche',
    intro: 'Introduction fictive : quelques lignes pour dire ce que les articles ci-dessous ont en commun.',
    backToAbout: 'Retour à À propos',
    viewPaper: 'Voir l’article',
    seoTitle: 'Articles de recherche',
    seoDescription: 'Description fictive de la page des articles de recherche.',
  },
}

// ---------------------------------------------------------------- Publications

// Même forme que src/data/publications.json (kind et status existent en EN et FR).
export type PlaceholderPublication = (typeof publicationsData)[number]

const publications: PlaceholderPublication[] = [
  {
    title: 'A placeholder article on measuring regional differences with comparable indicators',
    authorsBefore: 'Doe, J., ',
    me: 'Lastname, F.M.',
    authorsAfter: ', Roe, R. et al.',
    journal: 'Journal of Placeholder Studies',
    reference: '12, 345 (2026)',
    url: 'https://example.org/placeholder-1',
    kind: { en: 'Placeholder · Peer-reviewed article', fr: 'Fictif · Article évalué par les pairs' },
    status: { en: 'Published · 2026', fr: 'Publié · 2026' },
  },
  {
    title: 'A second placeholder paper about forecasting with imperfect data',
    authorsBefore: '',
    me: 'Lastname, F.M.',
    authorsAfter: ' and Doe, J.',
    journal: 'Placeholder Review of Applied Economics',
    reference: '8, 67 (2025)',
    url: 'https://example.org/placeholder-2',
    kind: { en: 'Placeholder · Working paper', fr: 'Fictif · Document de travail' },
    status: { en: 'In review · 2025', fr: 'En relecture · 2025' },
  },
  {
    title: 'A third placeholder paper, still in preparation, on firms and territories',
    authorsBefore: '',
    me: 'Lastname, F.M.',
    authorsAfter: '',
    journal: 'Placeholder journal',
    reference: 'Forthcoming',
    url: 'https://example.org/placeholder-3',
    kind: { en: 'Placeholder · Thesis chapter', fr: 'Fictif · Chapitre de thèse' },
    status: { en: 'In preparation', fr: 'En préparation' },
  },
]

// ---------------------------------------------------------------- Projets

// Type existant `Project` : les composants de carte actuels peuvent les afficher tels quels.
// Les images de couverture réutilisent des fichiers déjà présents dans public/.
// themeIndexes : positions dans `themes` (0 = régression, 1 = prévision, 2 = classification, 3 = visualisation)
function buildPlaceholderProject(
  index: number,
  coverSrc: string,
  domains: string[],
  themeIndexes: number[],
): Project {
  return {
    id: `PLACEHOLDER-${index}`,
    slug: `placeholder-project-${index}`,
    status: 'completed',
    date: `2026-0${index}-15`,
    featured: index <= 2,
    technicalLevel: 2,
    cover: {
      src: coverSrc,
      alt: { en: 'Placeholder cover image', fr: 'Image de couverture fictive' },
    },
    links: { primary: null, readMore: null, github: null, live: null },
    taxonomy: {
      domains,
      tools: ['Python', 'R'],
      keywords: {
        en: ['placeholder', ...themeIndexes.map((themeIndex) => themes.en[themeIndex])],
        fr: ['fictif', ...themeIndexes.map((themeIndex) => themes.fr[themeIndex])],
      },
    },
    content: {
      en: {
        title: `Placeholder project number ${index}`,
        summary: 'A short summary with the length of two lines, to see how the card handles it under the title and the tags.',
        description: 'A longer placeholder description. It is only here to fill the project window. No real result is described.',
      },
      fr: {
        title: `Projet fictif numéro ${index}`,
        summary: 'Un court résumé de la longueur de deux lignes, pour voir comment la carte le gère sous le titre et les tags.',
        description: 'Une description fictive plus longue. Elle sert seulement à remplir la fenêtre du projet. Aucun vrai résultat n’est décrit.',
      },
    },
  }
}

const projects: Project[] = [
  buildPlaceholderProject(1, '/assets/projects/images/bayesian-linear-regression-econometrics-cover.jpg', ['Econometrics'], [0]),
  buildPlaceholderProject(2, '/assets/blog/images/blog6.jpg', ['Economic Intelligence'], [1, 2]),
  buildPlaceholderProject(3, '/assets/images/hero-bamboo-1200.webp', ['Data Engineering'], [2]),
  buildPlaceholderProject(4, '/assets/projects/images/bayesian-linear-regression-econometrics-cover.jpg', ['Applied Statistics'], [0, 1]),
  buildPlaceholderProject(5, '/assets/blog/images/blog6.jpg', ['Data Visualization'], [3]),
  buildPlaceholderProject(6, '/assets/images/hero-bamboo-1200.webp', ['Econometrics', 'Classification'], [0, 3]),
]

// ---------------------------------------------------------------- Accès par langue

export const placeholders = {
  getProfile: (lang: AppLanguage) => profile[lang],
  getTimeline: (lang: AppLanguage) => timeline[lang],
  getAboutSections: (lang: AppLanguage) => aboutSections[lang],
  getAboutLabels: (lang: AppLanguage) => aboutLabels[lang],
  getThemes: (lang: AppLanguage) => themes[lang],
  getLandingLabels: (lang: AppLanguage) => landingLabels[lang],
  getLatestThings: (lang: AppLanguage) => latestThings[lang],
  getPublicationsLabels: (lang: AppLanguage) => publicationsLabels[lang],
  getPublications: (lang: AppLanguage) =>
    publications.map(({ kind, status, ...entry }) => ({
      ...entry,
      kind: kind[lang],
      status: status[lang],
    })),
  projects,
}
