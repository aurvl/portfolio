import { useTranslation } from 'react-i18next'
import SearchField from '../projects/SearchField'
import FilterField, { type FilterOption } from '../ui/FilterField'

type BlogFiltersProps = {
  searchValue: string
  onSearchChange: (value: string) => void
  tagValue: string
  onTagChange: (value: string) => void
  tagOptions: FilterOption[]
}

function BlogFilters({
  searchValue,
  onSearchChange,
  tagValue,
  onTagChange,
  tagOptions,
}: BlogFiltersProps) {
  const { t } = useTranslation()

  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-end">
      <SearchField
        label={t('blog.catalog.filters.search.name')}
        placeholder={t('blog.catalog.filters.search.placeholder')}
        value={searchValue}
        onChange={onSearchChange}
      />

      <FilterField
        title={t('blog.catalog.filters.tags.name')}
        options={tagOptions}
        value={tagValue}
        onChange={onTagChange}
      />
    </div>
  )
}

export default BlogFilters
