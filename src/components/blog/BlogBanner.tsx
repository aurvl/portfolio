// Bandeau de bambous fin en haut des pages Série et Article. C'est l'élément partagé `bamboo-banner` des transitions
// entre pages (styles/v3/page-transitions.css) : il se déplace d'une page à l'autre au lieu de disparaître.
import BambooPhoto from '../ui/BambooPhoto'

function BlogBanner() {
  return (
    <div className="blog-banner">
      <BambooPhoto className="blog-banner__image" />
    </div>
  )
}

export default BlogBanner
