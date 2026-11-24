// Textes de page encore pilotés ici : navigation, date du blog, page Projets / Hub et formulaire de contact.
// L'anglais est ici, le français dans home.fr.ts (même forme). Le texte de l'accueil v3 vit dans placeholders.ts.

export const SOCIAL_LINKS = {
  linkedin: 'https://www.linkedin.com/in/aurel-vehi/',
  github: 'https://github.com/aurvl',
  threads: 'https://www.threads.com/@aur_rel_',
  email: 'aurelvehi@outlook.fr',
  orcid: 'https://orcid.org/0009-0006-2676-2400',
  researchgate: 'https://www.researchgate.net/profile/Aurel-Vehi',
}

export type HomeContent = {
  nav: { home: string; projectsBlog: string; cv: string; method: string; research: string; work: string; about: string; blog: string; contact: string; cta: string }

  blog: { title: string; allPosts: string; loading: string; minRead: string; dateLocale: string }

  projectsPage: {
    seoTitle: string
    seoDescription: string
    eyebrow: string
    title: string
    intro: string
    summary: string
    selectedTitle: string
    appliedTitle: string
    appliedIntro: string
    otherTitle: string
    otherIntro: string
    open: string
    hub: {
      title: string
      searchLabel: string
      featuredLabel: string
      coverEyebrow: string
      viewSeries: string
      subscribe: string
      blogLabel: string
      blogTitle: string
      blogSeries: string
      allProjectsLabel: string
      searchButton: string
      advancedSearch: string
      quickLinksTitle: string
      closeSearch: string
      resetFilters: string
    }
  }

  contact: {
    title: string
    lead: string
    routes: { audience: string; title: string; detail: string; subject: string; tone: 'research' | 'project' | 'hiring' }[]
    subjects: string[]
    fields: {
      name: string
      email: string
      subject: string
      message: string
      namePlaceholder: string
      emailPlaceholder: string
      messagePlaceholder: string
    }
    hints: { emailRequired: string; emailInvalid: string; messageRequired: string }
    directEmail: string
    submit: string
  }
}

export const homeEn: HomeContent = {
  nav: { home: 'Home', projectsBlog: 'Projects & Blog', cv: 'CV', method: 'Method', research: 'Research', work: 'Work', about: 'About', blog: 'Blog', contact: 'Contact', cta: 'Get in touch' },

  blog: { title: 'Blog posts', allPosts: 'All posts', loading: 'Loading posts…', minRead: 'min read', dateLocale: 'en-GB' },

  projectsPage: {
    seoTitle: 'Work: applied studies and systems',
    seoDescription: 'Applied studies and decision-support systems by Aurel Vehi: econometrics, indicators, forecasting and data infrastructure on real economic data.',
    eyebrow: 'Work',
    title: 'Applied studies and systems, built on real data',
    intro: 'Each project starts from an economic or decision problem and follows the same method: map the data, build, model, test and deliver something people can use.',
    summary: '{count} projects · {from}–{to}',
    selectedTitle: 'Selected work',
    appliedTitle: 'Applied economics & decision support',
    appliedIntro: 'Econometrics, indicators, forecasting and decision-support studies.',
    otherTitle: 'Other technical work',
    otherIntro: 'Machine learning, NLP, data collection and engineering projects that sharpened the toolkit.',
    open: 'Open',
    hub: {
      title: 'Project & Blog posts',
      searchLabel: 'Search a project',
      featuredLabel: 'Featured',
      coverEyebrow: 'Featured series',
      viewSeries: 'View the series',
      subscribe: 'Subscribe',
      blogLabel: 'Latest articles',
      blogTitle: 'Blog',
      blogSeries: 'Browse the series',
      allProjectsLabel: 'All projects',
      searchButton: 'Search',
      advancedSearch: 'Advanced search',
      quickLinksTitle: 'Browse by theme',
      closeSearch: 'Close search',
      resetFilters: 'Reset filters',
    },
  },

  contact: {
    title: 'Let’s make economic data useful',
    lead: 'Researchers, organisations, recruiters: start where it fits you.',
    routes: [
      { audience: 'Researchers', title: 'Research collaboration', detail: 'Comparability, indicators, regional innovation, econometrics.', subject: 'A research collaboration', tone: 'research' },
      { audience: 'Organisations', title: 'Discuss a project', detail: 'A data, indicator or analysis problem you want to scope.', subject: 'A project or mission', tone: 'project' },
      { audience: 'Recruiters', title: 'Hiring & opportunities', detail: 'Profile and CV.', subject: 'An opportunity', tone: 'hiring' },
    ],
    subjects: ['A research collaboration', 'A project or mission', 'An opportunity', 'Something else'],
    fields: {
      name: 'Name',
      email: 'Email',
      subject: 'I’m writing about',
      message: 'Message',
      namePlaceholder: 'Jane Doe',
      emailPlaceholder: 'jane@company.com',
      messagePlaceholder: 'A few lines about your question or project…',
    },
    hints: {
      emailRequired: 'Please enter your email address.',
      emailInvalid: 'Your email address must contain an @ symbol.',
      messageRequired: 'Please write a message.',
    },
    directEmail: 'Or email me directly:',
    submit: 'Send message',
  },
}
