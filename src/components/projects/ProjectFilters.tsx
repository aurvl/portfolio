import { useTranslation } from 'react-i18next'
import type { FilterOption } from '../ui/FilterField'
import FilterField from '../ui/FilterField'
import SearchField from './SearchField'

type ProjectFiltersProps = {
  searchValue: string
  onSearchChange: (value: string) => void
  domainValue: string
  onDomainChange: (value: string) => void
  tagValue: string
  onTagChange: (value: string) => void
  sortValue: string
  onSortChange: (value: string) => void
  yearValue: string
  onYearChange: (value: string) => void
  domainOptions: FilterOption[]
  tagOptions: FilterOption[]
  sortOptions: FilterOption[]
  yearOptions: FilterOption[]
  resultsCount: number
  visibleCount: number
}

function ProjectFilters({
  searchValue,
  onSearchChange,
  domainValue,
  onDomainChange,
  tagValue,
  onTagChange,
  sortValue,
  onSortChange,
  yearValue,
  onYearChange,
  domainOptions,
  tagOptions,
  sortOptions,
  yearOptions,
  resultsCount,
  visibleCount,
}: ProjectFiltersProps) {
  const { t } = useTranslation()

  return (
    <div className="projects-v2__filters flex min-w-0 flex-col gap-4">
      <div className="flex min-w-0 w-full flex-wrap items-end justify-start gap-4">
        <SearchField
          label={t('projects.catalog.filters.search')}
          placeholder={t('projects.catalog.filters.searchPlaceholder')}
          value={searchValue}
          onChange={onSearchChange}
        />
        <FilterField
          title={t('projects.catalog.filters.domain')}
          options={domainOptions}
          value={domainValue}
          onChange={onDomainChange}
        />
        <FilterField
          title={t('projects.catalog.filters.tag')}
          options={tagOptions}
          value={tagValue}
          onChange={onTagChange}
        />
        <FilterField
          title={t('projects.catalog.filters.year')}
          options={yearOptions}
          value={yearValue}
          onChange={onYearChange}
        />
        <FilterField
          title={t('projects.catalog.filters.sortBy')}
          options={sortOptions}
          value={sortValue}
          onChange={onSortChange}
        />
      </div>

      <p className="projects-v2__showing text-sm">
        <span className="projects-v2__count">{t('projects.catalog.resultsCount', { count: resultsCount })}</span>{' '}
        {t('projects.catalog.showingCount', { visible: visibleCount, total: resultsCount })}
      </p>
    </div>
  )
}

export default ProjectFilters
