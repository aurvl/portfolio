import domainColors from '../data/domain.json'

const DOMAIN_COLOR_MAP = domainColors as Record<string, string>
const DEFAULT_DOMAIN_COLOR = DOMAIN_COLOR_MAP.__default ?? '#9e9d9d'

export function getDomainColor(domain?: string | null) {
  if (!domain) {
    return DEFAULT_DOMAIN_COLOR
  }

  return DOMAIN_COLOR_MAP[domain.trim()] ?? DEFAULT_DOMAIN_COLOR
}
