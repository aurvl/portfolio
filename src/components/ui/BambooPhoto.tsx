// Photo de bambous du site, en trois tailles (1200 / 1920 / 2400 px de large) : le navigateur choisit la plus
// légère qui reste nette sur l'écran (≈ 380 Ko sur mobile, ≈ 800 Ko sur ordinateur, 1,25 Mo seulement en très grand).
// Utilisée par toutes les bannières (landing, About, Publications, Contact) et par la scène de l'accueil.
// Le préchargement (index.html) liste les mêmes fichiers : si on change une taille, la changer aux deux endroits.
import { withBasePath } from '../../lib/site'

const BAMBOO_FILES = [
  { width: 1200, file: 'hero-bamboo-1200.webp' },
  { width: 1920, file: 'hero-bamboo-1920.webp' },
  { width: 2400, file: 'hero-bamboo.webp' },
]

const BAMBOO_SRC_SET = BAMBOO_FILES.map(
  ({ width, file }) => `${withBasePath(`assets/images/${file}`)} ${width}w`,
).join(', ')

const BAMBOO_FALLBACK_SRC = withBasePath('assets/images/hero-bamboo-1920.webp')

type BambooPhotoProps = {
  className?: string
  // « eager » pour la photo visible dès l'arrivée (landing), « lazy » pour les autres
  loading?: 'eager' | 'lazy'
  fetchPriority?: 'high' | 'low' | 'auto'
}

function BambooPhoto({ className, loading = 'lazy', fetchPriority }: BambooPhotoProps) {
  return (
    <img
      className={className}
      src={BAMBOO_FALLBACK_SRC}
      srcSet={BAMBOO_SRC_SET}
      // La photo occupe toute la largeur de la fenêtre
      sizes="100vw"
      alt=""
      loading={loading}
      fetchPriority={fetchPriority}
      decoding="async"
    />
  )
}

export default BambooPhoto
