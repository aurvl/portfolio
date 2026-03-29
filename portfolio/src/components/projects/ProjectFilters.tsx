import { useTranslation } from 'react-i18next'
import type { FilterOption } from './FilterField'
import FilterField from './FilterField'
import SearchField from './SearchField'

type ProjectFiltersProps = {
  searchValue: string
  onSearchChange: (value: string) => void
  domainValue: string
  onDomainChange: (value: string) => void
  tagValue: string
  onTagChange: (value: string) => void
  toolValue: string
  onToolChange: (value: string) => void
  technicalLevelValue: string
  onTechnicalLevelChange: (value: string) => void
  sortValue: string
  onSortChange: (value: string) => void
  yearValue: string
  onYearChange: (value: string) => void
  domainOptions: FilterOption[]
  tagOptions: FilterOption[]
  toolOptions: FilterOption[]
  technicalLevelOptions: FilterOption[]
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
//   toolValue,
//   onToolChange,
  technicalLevelValue,
  onTechnicalLevelChange,
  sortValue,
  onSortChange,
  yearValue,
  onYearChange,
  domainOptions,
  tagOptions,
//   toolOptions,
  technicalLevelOptions,
  sortOptions,
  yearOptions,
  resultsCount,
  visibleCount,
}: ProjectFiltersProps) {
  const { t } = useTranslation()

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-start gap-6">
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
          title={t('projects.catalog.filters.technicalLevel')}
          options={technicalLevelOptions}
          value={technicalLevelValue}
          onChange={onTechnicalLevelChange}
        />
      </div>

      <div className="flex flex-wrap items-end justify-start gap-6">
        <FilterField
          title={t('projects.catalog.filters.sortBy')}
          options={sortOptions}
          value={sortValue}
          onChange={onSortChange}
        />
        <FilterField
          title={t('projects.catalog.filters.year')}
          options={yearOptions}
          value={yearValue}
          onChange={onYearChange}
        />

        <div className="flex flex-col gap-2">
          <p
            className="m-auto rounded-lg bg-[var(--fields-bg-col)] px-4 py-2 text-sm font-bold
            uppercase text-[var(--accent-lgtblue)]"
          >
            {t('projects.catalog.resultsCount', { count: resultsCount })}
          </p>
          <p className="text-sm text-[var(--text2-col)]">
            {t('projects.catalog.showingCount', { visible: visibleCount, total: resultsCount })}
          </p>
        </div>
      </div>

      <span className="my-5 block w-full border-b border-[var(--glass-border)]"></span>
    </div>
  )
}

export default ProjectFilters
