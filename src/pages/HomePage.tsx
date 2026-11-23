import { useEffect, useRef } from 'react'
import { useReducedMotion } from 'framer-motion'
import { useLocation, useNavigate } from 'react-router-dom'
import { placeholders } from '../data/placeholders'
import { useBambooMobile } from '../hooks/useBambooMobile'
import { useBambooScene } from '../hooks/useBambooScene'
import { useHomeContent } from '../hooks/useHomeContent'
import { useMediaQuery } from '../hooks/useMediaQuery'
import { useSiteNav } from '../hooks/useSiteNav'
import MainLayout from '../components/layout/MainLayout'
import MorphNavbar from '../components/layout/MorphNavbar'
import Seo from '../components/seo/Seo'
import BambooPhoto from '../components/ui/BambooPhoto'
import LandingHero from '../components/home-v3/LandingHero'
import LatestThings from '../components/home-v3/LatestThings'
import AboutSection from '../components/home-v3/AboutSection'
import PublicationsSection, { PapersChrome } from '../components/home-v3/PublicationsSection'
import ContactSection, { ContactNavSlot } from '../components/home-v3/ContactSection'
import {
  PERSON_DESCRIPTION,
  PERSON_NAME,
  PERSON_ROLE,
  PERSON_SAME_AS,
  SITE_NAME,
  buildAbsoluteSiteUrl,
} from '../lib/site'


// Passe à l'écran suivant : un écran de hauteur de fenêtre plus bas que la landing.
function scrollToNextScreen() {
  window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })
}

function scrollToSection(sectionId: string) {
  document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

function HomePage() {
  const location = useLocation()
  const navigate = useNavigate()
  const { lang } = useHomeContent()
  const { homeSections } = useSiteNav()
  // prefers-reduced-motion : pas de voyage du bouton, la navbar apparaît seulement en fondu (voir MorphNavbar)
  const reducedMotion = useReducedMotion() ?? false
  const learnMoreLabel = placeholders.getLandingLabels(lang).learnMore

  // La scène « entrer dans la forêt » n'existe que sur ordinateur (≥ 1024 px). sceneProgress (0 = landing, 1 = About,
  // 2 = Recherche, 3 = Contact) sert aussi à la navbar, pour que « Learn more » voyage au même rythme que la photo.
  // « Ordinateur » = écran large ET souris / trackpad (hover + pointeur précis). Un iPad en paysage (1180 px, mais au doigt)
  // n'en fait pas partie : il garde la version tactile (sections normales, transition déclenchée), car une animation liée
  // à chaque pixel de scroll rampe et saute au doigt. La même condition est dans les @media des CSS (scene.css, etc.).
  const isSceneActive = useMediaQuery('(min-width: 1024px) and (hover: hover) and (pointer: fine)')
  const sceneRef = useRef<HTMLDivElement>(null)
  const sceneProgress = useBambooScene(sceneRef, isSceneActive, reducedMotion)
  // Sous 1024 px : sections normales ; la transition Landing → About est DÉCLENCHÉE (jouée dans le temps, 0 → 1) au lieu
  // d'être liée au scroll, et chaque bannière zoome / s'ouvre selon sa position
  const mobileProgress = useBambooMobile(!isSceneActive, reducedMotion)

  // Scroll-snap sur la page entière : la molette s'arrête sur chaque écran (landing, puis suite).
  // La classe est posée sur <html> (seul élément qui peut porter le snap de la page) et retirée en partant.
  useEffect(() => {
    document.documentElement.classList.add('snap-home')

    return () => document.documentElement.classList.remove('snap-home')
  }, [])

  useEffect(() => {
    if (!location.hash) return

    const timeoutId = window.setTimeout(() => scrollToSection(location.hash.slice(1)), 0)

    return () => window.clearTimeout(timeoutId)
  }, [location.hash])

  return (
    <MainLayout
      sections={homeSections}
      className="home-v2"
      overlayNavbar
      navbar={
        <MorphNavbar
          sections={homeSections}
          reducedMotion={reducedMotion}
          learnMoreLabel={learnMoreLabel}
          onLearnMore={scrollToNextScreen}
          sceneProgress={isSceneActive ? sceneProgress : mobileProgress}
          isSceneActive={isSceneActive}
        />
      }
    >
      <Seo
        title={`${PERSON_NAME} | ${PERSON_ROLE}`}
        description={PERSON_DESCRIPTION}
        lang={lang}
        image={buildAbsoluteSiteUrl('assets/images/hero-image.png')}
        jsonLd={[
          {
            '@context': 'https://schema.org',
            '@type': 'Person',
            name: PERSON_NAME,
            url: buildAbsoluteSiteUrl(),
            jobTitle: PERSON_ROLE,
            description: PERSON_DESCRIPTION,
            sameAs: PERSON_SAME_AS,
          },
          {
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            name: SITE_NAME,
            url: buildAbsoluteSiteUrl(),
          },
        ]}
      />

      {/* Scène (ordinateur) : landing, About, Recherche et Contact sont les quatre écrans d'une même scène, sur une
          photo commune. Le cadre collé à l'écran porte la photo, la landing et l'About ; la liste de Recherche défile
          sous lui ; le Contact est une seconde couche collée. Sous 1024 px : des sections normales (scene.css). */}
      <div
        ref={sceneRef}
        className="scene"
      >
        <div className="scene__stage">
          {isSceneActive ? (
            <div className="scene__photo">
              <BambooPhoto
                className="scene__photo-image"
                loading="eager"
                fetchPriority="high"
                sizes="145vw"
              />
            </div>
          ) : null}

          <section
            id={isSceneActive ? undefined : 'home'}
            className="landing"
          >
            <LandingHero
              onLearnMore={scrollToNextScreen}
              isButtonInNavbar={!reducedMotion}
              inScene={isSceneActive}
            />
            <LatestThings />
          </section>

          <AboutSection
            inScene={isSceneActive}
            onExploreWork={() => navigate('/projects')}
            onGetInTouch={() => scrollToSection('contact-form')}
            onViewPapers={() => scrollToSection('research')}
          />

          {isSceneActive ? <PapersChrome /> : null}
        </div>

        {isSceneActive ? (
          <>
            {/* Distance de scroll des deux premières transitions (Landing → About, About → Recherche) */}
            <div className="scene__spacer" />

            {/* La liste de Recherche : ordinaire dans la page, fixée à l'écran pendant les transitions (useBambooScene).
                Ce bloc garde sa place dans la page (hauteur posée en JS) et porte l'ancre #research. */}
            <div
              id="research"
              className="papers-track"
            >
              <PublicationsSection inScene />
            </div>

            <ContactSection inScene />

            {/* Distance de scroll de la dernière transition (Recherche → Contact) */}
            <div className="scene__spacer" />

            {/* Ancres et points d'arrêt du scroll : #home = début de la scène, #about = fin de la 1re transition,
                #research = le bloc ci-dessus, #contact-form = fin de la dernière transition */}
            <div
              id="home"
              className="scene__zone scene__zone--home"
            />
            <div
              id="about"
              className="scene__zone scene__zone--about"
            />
            <div
              id="contact-form"
              className="scene__zone scene__zone--contact"
            />
          </>
        ) : null}
      </div>

      {isSceneActive ? null : (
        <>
          <PublicationsSection />
          <ContactSection />
        </>
      )}

      <ContactNavSlot inScene={isSceneActive} />
    </MainLayout>
  )
}

export default HomePage
