// Page /publications : la section Publications de l'accueil, seule sur sa page (navbar directe, sans morph).
// « Back to about » renvoie vers l'About de l'accueil.
import { useNavigate } from 'react-router-dom'
import MainLayout from '../components/layout/MainLayout'
import Seo from '../components/seo/Seo'
import PublicationsSection from '../components/home-v3/PublicationsSection'
import { placeholders } from '../data/placeholders'
import { useHomeContent } from '../hooks/useHomeContent'
import { useSiteNav } from '../hooks/useSiteNav'
import { PERSON_NAME, buildAbsoluteSiteUrl } from '../lib/site'

function PublicationsPage() {
  const { lang } = useHomeContent()
  const { pageSections } = useSiteNav()
  const navigate = useNavigate()
  const labels = placeholders.getPublicationsLabels(lang)

  return (
    <MainLayout
      sections={pageSections}
      className="home-v2"
      overlayNavbar
    >
      <Seo
        title={`${labels.seoTitle} | ${PERSON_NAME}`}
        description={labels.seoDescription}
        path="publications"
        lang={lang}
        image={buildAbsoluteSiteUrl('assets/images/hero-image.png')}
      />

      <PublicationsSection onBackToAbout={() => navigate({ pathname: '/', hash: '#about' })} />
    </MainLayout>
  )
}

export default PublicationsPage
