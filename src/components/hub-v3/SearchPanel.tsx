// Bloc noir de recherche du Hub (page /projects) : il apparaît au clic sur « Search a project », au-dessus de la grille.
// Champ, domaine, bouton Search, recherche avancée (tag, année, tri) et liens rapides par thème.
// Les filtres s'appliquent en direct : le bouton Search ramène simplement la vue sur les résultats.
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FiSearch, FiX } from 'react-icons/fi'
import type { FilterOption } from '../ui/FilterField'

export type SearchPanelLabels = {
  searchButton: string
  advancedSearch: string
  quickLinksTitle: string
  closeSearch: string
  resetFilters: string
}

type SearchPanelProps = {
  labels: SearchPanelLabels
  searchValue: string
  onSearchChange: (value: string) => void
  domainValue: string
  onDomainChange: (value: string) => void
  tagValue: string
  onTagChange: (value: string) => void
  yearValue: string
  onYearChange: (value: string) => void
  sortValue: string
  onSortChange: (value: string) => void
  domainOptions: FilterOption[]
  tagOptions: FilterOption[]
  yearOptions: FilterOption[]
  sortOptions: FilterOption[]
  quickDomains: string[]
  resultsCount: number
  visibleCount: number
  // Augmente à chaque clic sur « Search a project » : le bloc défile alors jusqu'à lui et met le champ en focus
  focusSignal: number
  onClose: () => void
  onShowResults: () => void
}

function SearchPanel({
  labels,
  searchValue,
  onSearchChange,
  domainValue,
  onDomainChange,
  tagValue,
  onTagChange,
  yearValue,
  onYearChange,
  sortValue,
  onSortChange,
  domainOptions,
  tagOptions,
  yearOptions,
  sortOptions,
  quickDomains,
  resultsCount,
  visibleCount,
  focusSignal,
  onClose,
  onShowResults,
}: SearchPanelProps) {
  const { t } = useTranslation()
  const panelRef = useRef<HTMLElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)
  // Un tag reçu par l'URL (?tag=) ouvre directement la recherche avancée : le filtre reste visible et modifiable
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(tagValue.length > 0)

  useEffect(() => {
    if (focusSignal === 0) return

    // Pas de défilement animé pour qui a demandé moins de mouvement
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    panelRef.current?.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'start' })
    searchInputRef.current?.focus({ preventScroll: true })
  }, [focusSignal])

  const hasActiveFilter =
    searchValue.length > 0 || domainValue.length > 0 || tagValue.length > 0 || yearValue.length > 0

  function handleReset() {
    onSearchChange('')
    onDomainChange('')
    onTagChange('')
    onYearChange('')
    onSortChange('date-desc')
  }

  return (
    <section
      ref={panelRef}
      id="hub-search"
      className="search-panel"
      aria-label={labels.searchButton}
    >
      <button
        type="button"
        className="search-panel__close"
        onClick={onClose}
        aria-label={labels.closeSearch}
      >
        <FiX aria-hidden="true" />
      </button>

      <form
        className="search-panel__form"
        role="search"
        onSubmit={(event) => {
          event.preventDefault()
          onShowResults()
        }}
      >
        <div className="search-panel__row">
          <label className="search-panel__field search-panel__field--grow">
            <span className="search-panel__label">{t('projects.catalog.filters.search')}</span>
            <input
              ref={searchInputRef}
              type="search"
              className="search-panel__input"
              value={searchValue}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder={t('projects.catalog.filters.searchPlaceholder')}
            />
          </label>

          <label className="search-panel__field">
            <span className="search-panel__label">{t('projects.catalog.filters.domain')}</span>
            <select
              className="search-panel__input"
              value={domainValue}
              onChange={(event) => onDomainChange(event.target.value)}
            >
              {domainOptions.map((option) => (
                <option
                  key={option.value}
                  value={option.value}
                >
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <button
            type="submit"
            className="search-panel__submit"
          >
            <FiSearch aria-hidden="true" />
            {labels.searchButton}
          </button>
        </div>

        <button
          type="button"
          className="search-panel__link"
          aria-expanded={isAdvancedOpen}
          aria-controls="hub-search-advanced"
          onClick={() => setIsAdvancedOpen((isOpen) => !isOpen)}
        >
          {labels.advancedSearch}
        </button>

        {isAdvancedOpen && (
          <div
            id="hub-search-advanced"
            className="search-panel__row"
          >
            <label className="search-panel__field">
              <span className="search-panel__label">{t('projects.catalog.filters.tag')}</span>
              <select
                className="search-panel__input"
                value={tagValue}
                onChange={(event) => onTagChange(event.target.value)}
              >
                {tagOptions.map((option) => (
                  <option
                    key={option.value}
                    value={option.value}
                  >
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="search-panel__field">
              <span className="search-panel__label">{t('projects.catalog.filters.year')}</span>
              <select
                className="search-panel__input"
                value={yearValue}
                onChange={(event) => onYearChange(event.target.value)}
              >
                {yearOptions.map((option) => (
                  <option
                    key={option.value}
                    value={option.value}
                  >
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="search-panel__field">
              <span className="search-panel__label">{t('projects.catalog.filters.sortBy')}</span>
              <select
                className="search-panel__input"
                value={sortValue}
                onChange={(event) => onSortChange(event.target.value)}
              >
                {sortOptions.map((option) => (
                  <option
                    key={option.value}
                    value={option.value}
                  >
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
          </div>
        )}
      </form>

      <div className="search-panel__quick">
        <p className="search-panel__quick-title">{labels.quickLinksTitle}</p>

        <ul className="search-panel__quick-list">
          {quickDomains.map((domain) => (
            <li key={domain}>
              <button
                type="button"
                className="search-panel__link"
                aria-pressed={domainValue === domain}
                onClick={() => {
                  onDomainChange(domainValue === domain ? '' : domain)
                  onShowResults()
                }}
              >
                {domain}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <p
        className="search-panel__status"
        aria-live="polite"
      >
        {t('projects.catalog.resultsCount', { count: resultsCount })} ·{' '}
        {t('projects.catalog.showingCount', { visible: visibleCount, total: resultsCount })}
        {hasActiveFilter && (
          <>
            {' · '}
            <button
              type="button"
              className="search-panel__link"
              onClick={handleReset}
            >
              {labels.resetFilters}
            </button>
          </>
        )}
      </p>
    </section>
  )
}

export default SearchPanel
