import type { NowItem } from './home'
import type { AppLanguage } from '../types/i18n'

// "Now building" items. The "Updated <month year>" label is computed at build time
// from the last change to this file (see vite.config.ts), so just edit the list.
export const nowBuildingItems: Record<AppLanguage, NowItem[]> = {
  en: [
    { state: 'progress', title: 'FMarketMonitor', detail: 'The monitoring layer of an economic intelligence system on U.S. markets.' },
    { state: 'prep', title: 'AI adoption in European firms', detail: 'Applied study on Eurostat ICT data: who adopts AI, and why gaps persist.' },
  ],
  fr: [
    { state: 'progress', title: 'FMarketMonitor', detail: 'La couche de suivi d’un système d’intelligence économique sur les marchés américains.' },
    { state: 'prep', title: 'Adoption de l’IA dans les entreprises européennes', detail: 'Étude appliquée sur les données Eurostat TIC : qui adopte l’IA, et pourquoi les écarts persistent.' },
  ],
}
