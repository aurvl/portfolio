import type { HomeContent } from './home'

// French homepage content, same shape as homeEn in home.ts.
export const homeFr: HomeContent = {
  nav: { home: 'Accueil', projectsBlog: 'Projets & Blog', cv: 'CV', method: 'Méthode', research: 'Recherche', work: 'Travaux', about: 'Profil', blog: 'Blog', contact: 'Contact', cta: 'Me contacter' },

  blog: { title: 'Articles de blog', allPosts: 'Tous les articles', loading: 'Chargement des articles…', minRead: 'min de lecture', dateLocale: 'fr-FR' },

  projectsPage: {
    seoTitle: 'Travaux : études appliquées et systèmes',
    seoDescription: 'Études appliquées et systèmes d’aide à la décision par Aurel Vehi : économétrie, indicateurs, prévision et infrastructures de données sur des données économiques réelles.',
    eyebrow: 'Travaux',
    title: 'Études appliquées et systèmes, construits sur des données réelles',
    intro: 'Chaque projet part d’un problème économique ou décisionnel et suit la même méthode : cartographier les données, construire, modéliser, tester et livrer quelque chose d’utilisable.',
    summary: '{count} projets · {from}–{to}',
    selectedTitle: 'Travaux choisis',
    appliedTitle: 'Économie appliquée & aide à la décision',
    appliedIntro: 'Études d’économétrie, d’indicateurs, de prévision et d’aide à la décision.',
    otherTitle: 'Autres travaux techniques',
    otherIntro: 'Projets de machine learning, NLP, collecte et ingénierie de données qui ont affûté la boîte à outils.',
    open: 'Ouvrir',
    hub: {
      title: 'Projets et articles',
      searchLabel: 'Rechercher un projet',
      featuredLabel: 'À la une',
      coverEyebrow: 'Série à la une',
      viewSeries: 'Voir la série',
      subscribe: 'S’abonner',
      blogLabel: 'Derniers articles du blog',
      blogTitle: 'Blog',
      blogSeries: 'Voir les séries',
      allProjectsLabel: 'Tous les projets',
      searchButton: 'Rechercher',
      advancedSearch: 'Recherche avancée',
      quickLinksTitle: 'Parcourir par thème',
      closeSearch: 'Fermer la recherche',
      resetFilters: 'Réinitialiser les filtres',
    },
  },

  contact: {
    title: 'Rendons les données économiques utiles',
    lead: 'Chercheurs, organisations, recruteurs : commencez là où cela vous correspond.',
    routes: [
      { audience: 'Chercheurs', title: 'Collaboration de recherche', detail: 'Comparabilité, indicateurs, innovation régionale, économétrie.', subject: 'Une collaboration de recherche', tone: 'research' },
      { audience: 'Organisations', title: 'Discuter d’un projet', detail: 'Un problème de données, d’indicateur ou d’analyse à cadrer.', subject: 'Un projet ou une mission', tone: 'project' },
      { audience: 'Recruteurs', title: 'Recrutement & opportunités', detail: 'Profil et CV.', subject: 'Une opportunité', tone: 'hiring' },
    ],
    subjects: ['Une collaboration de recherche', 'Un projet ou une mission', 'Une opportunité', 'Autre chose'],
    fields: {
      name: 'Nom',
      email: 'E-mail',
      subject: 'Je vous écris pour',
      message: 'Message',
      namePlaceholder: 'Jeanne Dupont',
      emailPlaceholder: 'jeanne@entreprise.fr',
      messagePlaceholder: 'Quelques lignes sur votre question ou votre projet…',
    },
    hints: {
      emailRequired: 'Veuillez saisir votre adresse e-mail.',
      emailInvalid: 'Votre adresse e-mail doit contenir un @.',
      messageRequired: 'Veuillez écrire un message.',
    },
    directEmail: 'Ou écrivez-moi directement :',
    submit: 'Envoyer le message',
  },
}
