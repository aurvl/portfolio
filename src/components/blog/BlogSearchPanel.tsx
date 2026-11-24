// Recherche dans TOUS les articles, en tête des pages Séries (/series et /series/:slug).
// Au repos : seulement la pilule « Rechercher un article » (comme « Search a project » du Hub). Au clic, le formulaire
// se déplie en dessous. Pendant une recherche, les résultats remplacent le contenu de la page (`children`).
import { useMemo, useState, type ReactNode } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { FiSearch } from 'react-icons/fi'
import { useTranslation } from 'react-i18next'
import { useBlogIndex } from '../../hooks/useBlogIndex'
import BlogSearch from './BlogSearch'
import PostRow from './PostRow'

type BlogSearchPanelProps = {
  children: ReactNode
}

function BlogSearchPanel({ children }: BlogSearchPanelProps) {
  const { t, i18n } = useTranslation()
  const reducedMotion = useReducedMotion() ?? false
  const { index, tags } = useBlogIndex(i18n.language)
  const [isOpen, setIsOpen] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const [selectedTag, setSelectedTag] = useState('')

  const normalizedSearch = searchValue.trim().toLowerCase()
  const isSearching = normalizedSearch.length > 0 || selectedTag.length > 0

  // La recherche porte sur tous les articles, quelle que soit leur série, du plus récent au plus ancien
  const results = useMemo(
    () =>
      [...index]
        .filter((post) => {
          const matchesSearch =
            normalizedSearch.length === 0 ||
            [post.title, post.summary, ...post.tags].join(' ').toLowerCase().includes(normalizedSearch)
          const matchesTag = selectedTag.length === 0 || post.tags.includes(selectedTag)

          return matchesSearch && matchesTag
        })
        .sort((postA, postB) => new Date(postB.date).getTime() - new Date(postA.date).getTime()),
    [index, normalizedSearch, selectedTag],
  )

  // Refermer le formulaire remet la recherche à zéro : sinon la page resterait filtrée sans rien l'indiquer
  function handleClose() {
    setIsOpen(false)
    setSearchValue('')
    setSelectedTag('')
  }

  return (
    <>
      {!isOpen ? (
        <div className="blog-search-bar">
          {/* Même pilule que « Search a project » du Hub (classe .hub-header__search, hub.css) */}
          <button
            type="button"
            className="hub-header__search"
            aria-expanded={false}
            aria-controls="blog-search"
            onClick={() => setIsOpen(true)}
          >
            <FiSearch aria-hidden="true" />
            {t('blog.series.searchButton')}
          </button>
        </div>
      ) : null}

      {/* Dépliage : la hauteur passe de 0 à sa taille réelle (framer-motion) ; sans animation si mouvement réduit */}
      <AnimatePresence initial={false}>
        {isOpen ? (
          <motion.div
            id="blog-search"
            key="blog-search"
            className="blog-search-reveal"
            initial={reducedMotion ? false : { height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={reducedMotion ? { opacity: 0 } : { height: 0, opacity: 0 }}
            transition={{ duration: reducedMotion ? 0 : 0.22, ease: 'easeOut' }}
          >
            <BlogSearch
              searchValue={searchValue}
              onSearchChange={setSearchValue}
              tagValue={selectedTag}
              onTagChange={setSelectedTag}
              tags={tags}
              onClose={handleClose}
            />
          </motion.div>
        ) : null}
      </AnimatePresence>

      {isOpen && isSearching ? (
        <section aria-live="polite">
          <p className="blog-page__results-title eyebrow">
            {t('blog.series.results')} ·{' '}
            {t('blog.catalog.showingCount', { visible: results.length, total: results.length })}
          </p>

          {results.length > 0 ? (
            <ol className="series-list">
              {results.map((post) => (
                <PostRow
                  key={post.slug}
                  post={post}
                />
              ))}
            </ol>
          ) : (
            <div className="blog-page__empty">
              <h2>{t('blog.catalog.empty.title')}</h2>
              <p>{t('blog.catalog.empty.description')}</p>
            </div>
          )}
        </section>
      ) : (
        children
      )}
    </>
  )
}

export default BlogSearchPanel
