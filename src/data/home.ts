// Homepage V2 content. English lives here, French in home.fr.ts (same shape).
// Positioning and claims come from new_vision/; keep them defensible before publishing.

export const DOI_BLUE_CARBON = 'https://doi.org/10.1038/s44458-026-00117-8'

export const SOCIAL_LINKS = {
  linkedin: 'https://www.linkedin.com/in/aurel-vehi/',
  github: 'https://github.com/aurvl',
  threads: 'https://www.threads.com/@aur_rel_',
  email: 'aurelvehi@outlook.fr',
}

export type MethodStep = {
  title: string
  short: string
  summary: string
  statement: string
  questions: string[]
  output: string
  deliverable: string
  principle: [string, string]
  toolSlugs: string[]
}

export type WorkItem = {
  slug?: string
  // For items outside projects.json; catalogue projects use their own taxonomy.
  domain?: string
  keywords?: string[]
  state: 'progress' | 'done'
  title: string
  summary: string
  tools: string
  details?: { label: string; value: string }[]
}

export type NowItem = {
  state: 'progress' | 'prep'
  title: string
  detail: string
  href?: string
}

export type Evidence = { label: string; href: string }

export type HomeContent = {
  nav: { home: string; method: string; research: string; work: string; about: string; blog: string; contact: string; cta: string }
  hero: {
    role: string
    affiliation: string
    title: [string, string]
    lead: string
    primaryCta: string
    secondaryCta: string
  }
  methodGraph: {
    ariaLabel: string
    sources: { title: string; detail: string; partial?: boolean }[]
    toolSlugs: string[]
    labels: {
      sources: string
      heading: string
      subheading: string
      outputs: string
      indicators: string
      forecasts: string
      recommendations: string
      supports: string
      cannot: string
      dashboards: string
    }
    caption: string
  }
  stackLabel: string
  method: {
    title: string
    intro: string
    questionsLabel: string
    outputLabel: string
    swipeHint: string
    stepLabel: string
    goToStep: string
    tabsLabel: string
    steps: MethodStep[]
  }
  doctoralResearch: {
    eyebrow: string
    title: string
    intro: string
    question: string
    meta: { title: string; detail: string }[]
    mapLabel: string
    borderLabel: string
    dimensions: { title: string; detail: string; tone: 'blue' | 'green' | 'amber' | 'violet' }[]
  }
  publications: {
    title: string
    intro: string
    readArticle: string
    allPublications: string
    items: {
      kind: string
      status: string
      title: string
      authorsBefore: string
      me: string
      authorsAfter: string
      journal: string
      reference: string
      url: string
    }[]
  }
  work: {
    title: string
    intro: string
    statusLabels: { progress: string; done: string; prep: string }
    viewProject: string
    relatedLabel: string
    browseAll: string
    sketchLabels: [string, string]
    items: WorkItem[]
    related: { slug: string; title: string; detail: string }[]
  }
  nowBuilding: { title: string; updatedPrefix: string }
  help: {
    title: string
    intro: string
    evidenceLabel: string
    problems: { quote: string; answer: string; evidence: Evidence[] }[]
    formatsLabel: string
    formats: string[]
    cta: string
  }
  about: {
    title: string
    portraitAlt: string
    bio: string
    journey: { when: string; what: string; current?: boolean; next?: boolean }[]
    principles: string[]
    cv: string
  }
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
  }
  publicationsPage: {
    seoTitle: string
    seoDescription: string
    eyebrow: string
    title: string
    intro: string
    count: string
    viewLabel: string
    grid: string
    list: string
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
  nav: { home: 'Home', method: 'Method', research: 'Research', work: 'Work', about: 'About', blog: 'Blog', contact: 'Contact', cta: 'Get in touch' },

  hero: {
    role: 'Applied economist',
    affiliation: 'PhD researcher, ESTIA & University of Bordeaux',
    title: ['From fragmented data', 'to economic intelligence'],
    lead: 'I study how firms and territories innovate, become more sustainable and perform, and I build the data, indicators and econometric models needed to measure it.',
    primaryCta: 'Explore my work',
    secondaryCta: 'Get in touch',
  },

  methodGraph: {
    ariaLabel: 'Several data sources converge into my workflow and tools, which produce indicators, forecasts, recommendations and dashboards.',
    sources: [
      { title: 'Statistical offices', detail: 'Eurostat · INSEE · OECD' },
      { title: 'Company data', detail: 'CRM · ERP · accounts' },
      { title: 'Surveys', detail: 'firms · households', partial: true },
      { title: 'Markets & APIs', detail: 'prices · rates · flows' },
      { title: 'Documents', detail: 'PDF reports · filings', partial: true },
    ],
    toolSlugs: ['python', 'r', 'pandas', 'postgresql', 'scikit-learn', 'git', 'stata'],
    labels: {
      sources: 'FRAGMENTED DATA',
      heading: 'How I work',
      subheading: 'same method, any economic question',
      outputs: 'USEFUL FOR DECISIONS',
      indicators: 'Comparable indicators',
      forecasts: 'Forecasts & scenarios',
      recommendations: 'Recommendations',
      supports: '✓ what the data supports',
      cannot: '! what it cannot conclude',
      dashboards: 'Dashboards & reports',
    },
    caption: 'Many sources → one documented method → decisions',
  },

  stackLabel: 'Stack · tools serve the question, not the other way round',

  method: {
    title: 'One method, from question to decision',
    intro: 'The same discipline on every study, whatever the data or the client. Pick a step to see the questions I ask and what comes out of it.',
    questionsLabel: 'Questions I ask',
    outputLabel: 'What comes out',
    swipeHint: 'Swipe to see each step',
    stepLabel: 'Step',
    goToStep: 'Go to step',
    tabsLabel: 'Method steps',
    steps: [
      {
        title: 'Frame',
        short: 'Start from the problem, not the tool.',
        summary: 'Start from an economic or decision problem, not from a tool.',
        statement: 'Every study starts from an economic or decision problem: who is concerned, where, over which period, and what the analysis must inform.',
        questions: ['What decision or phenomenon must this inform?', 'Who is concerned, where, and over which period?', 'What is already known, and where is the gap?'],
        output: 'A central question, the mechanisms at play and testable hypotheses.',
        deliverable: 'question & hypotheses',
        principle: ['The question chooses the method.', 'Never the reverse.'],
        toolSlugs: [],
      },
      {
        title: 'Map the data',
        short: 'Know what each source really measures.',
        summary: 'Document sources, definitions, coverage and what is really comparable.',
        statement: 'Before any model, I document each source: definition, unit, coverage, missing values, and whether it is really comparable.',
        questions: ['What does each variable actually measure?', 'Is coverage comparable across units and over time?', 'Where is data missing, and why?'],
        output: 'A data dictionary and an availability / comparability matrix.',
        deliverable: 'data dictionary',
        principle: ['Comparability before sophistication.', 'An observed gap can be a measurement gap.'],
        toolSlugs: ['python', 'postgresql', 'vba'],
      },
      {
        title: 'Build',
        short: 'A pipeline anyone can rerun.',
        summary: 'Reproducible pipelines: clean, harmonise, version, keep raw data apart.',
        statement: 'Raw data → cleaning → harmonisation → checks → analytical dataset, in a pipeline that can be rerun and audited.',
        questions: ['Can someone rerun this from the raw data?', 'Which transformation lost information?', 'Is every join and exclusion documented?'],
        output: 'A reproducible, versioned analytical dataset with its documentation.',
        deliverable: 'analytical dataset',
        principle: ['Raw data stays separate.', 'Every transformation is a documented decision.'],
        toolSlugs: ['python', 'pandas', 'git', 'docker'],
      },
      {
        title: 'Model',
        short: 'The simplest defensible method.',
        summary: 'Indicators and models chosen by the question and the data structure.',
        statement: 'Indicators and models are chosen by the question and the structure of the data: regressions, panels, spatial or time-series methods, classification.',
        questions: ['Which indicator really represents the concept?', 'Which model fits the structure of the data?', 'Is this an association or a causal effect?'],
        output: 'Interpretable indicators and estimates.',
        deliverable: 'indicators & estimates',
        principle: ['Defensible simplicity.', 'A method I cannot explain has no place in the work.'],
        toolSlugs: ['r', 'stata', 'python', 'scikit-learn', 'julia'],
      },
      {
        title: 'Test',
        short: 'Check that results hold.',
        summary: 'Robustness, out-of-sample validation, uncertainty and limits.',
        statement: 'I test whether conclusions survive another specification, period, definition or sub-sample, and I validate forecasts out of sample.',
        questions: ['Does the result survive another specification?', 'How uncertain is it?', 'Was the forecast validated out of sample?'],
        output: 'Robustness checks and documented limits.',
        deliverable: 'robustness report',
        principle: ['Uncertainty stays visible.', 'No number is more certain than its data.'],
        toolSlugs: ['r', 'python', 'scikit-learn'],
      },
      {
        title: 'Deliver',
        short: 'Make results usable.',
        summary: 'Interpret economically and deliver in a format people use.',
        statement: 'Results are turned into economic answers and delivered in the format people actually use: report, summary, dashboard, reproducible code.',
        questions: ['What does it mean, for whom, under which conditions?', 'What does it not allow us to conclude?', 'Which format will people actually use?'],
        output: 'Report, executive summary, visualisations, dashboard, code repository.',
        deliverable: 'report · dashboard · code',
        principle: ['Recommendations proportional to evidence.', 'Useful without being prescriptive.'],
        toolSlugs: ['power-bi', 'tableau', 'react', 'fastapi'],
      },
    ],
  },

  doctoralResearch: {
    eyebrow: 'Doctoral research',
    title: 'How firms transform across a border',
    intro: 'My PhD studies how firms transform across the Nouvelle-Aquitaine, Euskadi and Navarre Euroregion, at ESTIA Recherche and the University of Bordeaux. It is one field where I apply my method, at doctoral depth.',
    question: 'How can firm-level transformations in innovation, sustainability, economic performance and territorial embeddedness be measured and modelled to better understand regional dynamics?',
    meta: [
      { title: 'PhD, 2026–2029', detail: 'Applied economics' },
      { title: 'ESTIA Recherche · Univ. Bordeaux', detail: 'Cross-border Euroregion' },
    ],
    mapLabel: 'The Euskadi–Navarre–Nouvelle-Aquitaine Euroregion',
    borderLabel: 'FR / ES border',
    dimensions: [
      { title: 'Innovation', detail: 'New products, processes and practices', tone: 'blue' },
      { title: 'Sustainability', detail: 'Environmental practices and transition', tone: 'green' },
      { title: 'Performance & resilience', detail: 'Activity, productivity and growth', tone: 'amber' },
      { title: 'Territorial anchoring', detail: 'Local and cross-border networks', tone: 'violet' },
    ],
  },

  publications: {
    title: 'Publications',
    intro: 'Peer-reviewed research I have co-authored.',
    readArticle: 'Read the article (DOI)',
    allPublications: 'All publications',
    items: [
      {
        kind: 'Peer-reviewed article',
        status: 'Published · 2026',
        title: 'Global assessment shows blue carbon wealth dominated by ocean processes and unevenly distributed across countries',
        authorsBefore: 'Hilmi, N., ',
        me: 'Vehi, L.A.D.V.',
        authorsAfter: ', Treskova, M. et al.',
        journal: 'Communications Sustainability',
        reference: '1, 114 (2026)',
        url: DOI_BLUE_CARBON,
      },
    ],
  },

  work: {
    title: 'Selected work',
    intro: 'Applied studies and systems built on real data: infrastructure, decision support and econometric depth.',
    statusLabels: { progress: 'In progress', done: 'Completed', prep: 'In preparation' },
    viewProject: 'View project',
    relatedLabel: 'Related studies',
    browseAll: 'Browse all {count} projects',
    sketchLabels: ['Claim fraud scores', 'review threshold'],
    items: [
      {
        slug: 'insurance-claim-fraud-counterfactual-simulator',
        state: 'done',
        title: 'Insurance Fraud & Counterfactual Decision Support',
        summary: 'An end-to-end workflow that consolidates heterogeneous claim files, scores fraud risk and explains each decision with counterfactual scenarios.',
        tools: 'PostgreSQL · XGBoost · FastAPI',
        details: [
          { label: 'Problem', value: 'Claim files arrive as CRM JSON, PDFs and images, scattered across systems.' },
          { label: 'Consequence', value: 'Fraud teams review suspicious claims by hand and struggle to justify decisions.' },
          { label: 'Solution', value: 'One PostgreSQL base, a tuned fraud score and counterfactual explanations.' },
          { label: 'Output', value: 'A decision-support tool for claims and fraud teams' },
        ],
      },
      {
        slug: 'bayesian-linear-regression-econometrics',
        state: 'done',
        title: 'Bayesian Econometrics, from scratch',
        summary: 'OLS, Ridge, Bayesian regression and Empirical Bayes implemented from first principles on economic data, to make shrinkage and parameter uncertainty visible.',
        tools: 'NumPy · SciPy',
      },
      {
        slug: 'technological-employment-gender-inequalities',
        state: 'done',
        title: 'Technology jobs & gender inequality',
        summary: 'Spatial econometrics study of how technology employment and STEM qualifications shape female unemployment across European regions, locally and between neighbours.',
        tools: 'Spatial data · Econometrics',
      },
    ],
    related: [
      { slug: 'environmental-attention-index-pta', title: 'Environmental Attention Index', detail: 'Composite indicator · trade agreements' },
      { slug: 'belgian-trade-time-series', title: 'Belgian trade, 1995–2023', detail: 'Time series · 10-quarter forecast' },
      { slug: 'phillips-curve-europe-policy', title: 'Phillips curve in Europe', detail: 'Econometrics · policy analysis' },
    ],
  },

  nowBuilding: { title: 'Now building', updatedPrefix: 'Updated' },

  help: {
    title: 'Where I can help',
    intro: 'For companies, SMEs and institutions working with economic data. Each problem below links to work where I have done it.',
    evidenceLabel: 'Evidence:',
    problems: [
      {
        quote: 'Our data sits in sources that don’t match.',
        answer: 'Source mapping, harmonisation rules and documented, reproducible data pipelines.',
        evidence: [{ label: 'Doctoral research', href: '#research' }, { label: 'Insurance case', href: '/projects?project=insurance-claim-fraud-counterfactual-simulator' }],
      },
      {
        quote: 'We need an indicator we can defend.',
        answer: 'Indicator design, benchmarking, weighting choices and sensitivity analysis.',
        evidence: [{ label: 'EAI index', href: '/projects?project=environmental-attention-index-pta' }, { label: 'Blue carbon paper', href: DOI_BLUE_CARBON }],
      },
      {
        quote: 'We need to know what really drives the numbers.',
        answer: 'Econometric analysis that is careful about what is association and what is cause.',
        evidence: [{ label: 'Spatial study', href: '/projects?project=technological-employment-gender-inequalities' }, { label: 'Bayesian econometrics', href: '/projects?project=bayesian-linear-regression-econometrics' }],
      },
      {
        quote: 'We want to anticipate, not just report.',
        answer: 'Forecasts validated out of sample, with uncertainty shown, and scenario-based decision support.',
        evidence: [{ label: 'Trade forecasting', href: '/projects?project=belgian-trade-time-series' }, { label: 'Insurance case', href: '/projects?project=insurance-claim-fraud-counterfactual-simulator' }],
      },
    ],
    formatsLabel: 'Formats:',
    formats: ['Short studies', 'Methodological reviews', 'Indicator & data prototypes'],
    cta: 'Discuss a project',
  },

  about: {
    title: 'About',
    portraitAlt: 'Portrait of Aurel Vehi',
    bio: 'Applied economist trained in econometrics and data science. I turn complex, imperfect economic data into knowledge organisations can use.',
    journey: [
      { when: 'Background', what: 'Economics, econometrics & data science' },
      { when: '2024–2025', what: 'Data research & econometrics roles, Monaco' },
      { when: '2026', what: 'First peer-reviewed publication' },
      { when: '2026–2029', what: 'PhD in applied economics', current: true },
      { when: 'Next', what: 'Economic intelligence systems', next: true },
    ],
    principles: ['Problem before tool', 'Comparability before sophistication', 'Uncertainty stays visible', 'Human-led research'],
    cv: 'Download CV',
  },

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
  },

  publicationsPage: {
    seoTitle: 'Publications',
    seoDescription: 'Peer-reviewed publications co-authored by Aurel Vehi.',
    eyebrow: 'Publications',
    title: 'Publications',
    intro: 'Peer-reviewed research I have co-authored.',
    count: '{count} publication(s)',
    viewLabel: 'Display',
    grid: 'Grid',
    list: 'List',
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
