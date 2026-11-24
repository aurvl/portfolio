// Formulaire de recherche dans TOUS les articles du blog (pas seulement la série affichée) : un champ texte
// (titre, résumé, mots-clés) et un filtre par tag. Il se déplie quand on clique sur la pilule de BlogSearchPanel ;
// l'état est tenu par le panneau. Styles : styles/v3/blog.css.
import { useEffect, useId, useRef } from 'react'
import { FiSearch, FiX } from 'react-icons/fi'
import { useTranslation } from 'react-i18next'

type BlogSearchProps = {
  searchValue: string
  onSearchChange: (value: string) => void
  tagValue: string
  onTagChange: (value: string) => void
  tags: string[]
  onClose: () => void
}

function BlogSearch({ searchValue, onSearchChange, tagValue, onTagChange, tags, onClose }: BlogSearchProps) {
  const { t } = useTranslation()
  const searchId = useId()
  const tagId = useId()
  const inputRef = useRef<HTMLInputElement>(null)

  // Le formulaire n'existe qu'une fois déplié : à son apparition on met le champ en focus pour taper tout de suite
  useEffect(() => {
    inputRef.current?.focus({ preventScroll: true })
  }, [])

  return (
    <form
      className="blog-search"
      role="search"
      aria-label={t('blog.series.searchTitle')}
      onSubmit={(event) => event.preventDefault()}
    >
      <div className="blog-search__head">
        <p className="eyebrow">{t('blog.series.searchTitle')}</p>

        <button
          type="button"
          className="blog-search__close"
          onClick={onClose}
        >
          {t('blog.series.closeSearch')}
          <FiX aria-hidden="true" />
        </button>
      </div>

      <div className="blog-search__row">
        <div className="blog-search__field blog-search__field--grow">
          <label
            htmlFor={searchId}
            className="blog-search__label"
          >
            {t('blog.catalog.filters.search.name')}
          </label>
          <div className="blog-search__input-wrap">
            <FiSearch aria-hidden="true" />
            <input
              id={searchId}
              type="search"
              className="blog-search__input"
              value={searchValue}
              placeholder={t('blog.catalog.filters.search.placeholder')}
              onChange={(event) => onSearchChange(event.target.value)}
              ref={inputRef}
            />
          </div>
        </div>

        <div className="blog-search__field">
          <label
            htmlFor={tagId}
            className="blog-search__label"
          >
            {t('blog.catalog.filters.tags.name')}
          </label>
          <select
            id={tagId}
            className="blog-search__select"
            value={tagValue}
            onChange={(event) => onTagChange(event.target.value)}
          >
            <option value="">{t('blog.catalog.filters.tags.all')}</option>
            {tags.map((tag) => (
              <option
                key={tag}
                value={tag}
              >
                {tag}
              </option>
            ))}
          </select>
        </div>
      </div>
    </form>
  )
}

export default BlogSearch
