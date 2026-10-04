import nowBuildingData from './now-building.json'
import type { NowItem } from './home'
import type { AppLanguage } from '../types/i18n'

// "Now building" items live in now-building.json (edited with the Portfolio Manager).
// The "Updated <month year>" label is computed at build time from that file's history.
export const nowBuildingItems = nowBuildingData as Record<AppLanguage, NowItem[]>
