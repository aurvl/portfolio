import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useHomeContent } from '../hooks/useHomeContent'
import MainLayout from '../components/layout/MainLayout'
import Seo from '../components/seo/Seo'
import HomeHero from '../components/home-v2/HomeHero'
import StackMarquee from '../components/home-v2/StackMarquee'
import MethodSection from '../components/home-v2/MethodSection'
import DoctoralResearchSection from '../components/home-v2/DoctoralResearchSection'
import PublicationsSection from '../components/home-v2/PublicationsSection'
import WorkSection from '../components/home-v2/WorkSection'
import NowBuildingSection from '../components/home-v2/NowBuildingSection'
import HelpSection from '../components/home-v2/HelpSection'
import ProfileSection from '../components/home-v2/ProfileSection'
import BlogPostsSection from '../components/home-v2/BlogPostsSection'
import ContactSection from '../components/home-v2/ContactSection'
import {
  PERSON_DESCRIPTION,
  PERSON_NAME,
  PERSON_ROLE,
  PERSON_SAME_AS,
  buildAbsoluteSiteUrl,
} from '../lib/site'


function scrollToSection(sectionId: string) {
  document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

function HomePage() {
  const location = useLocation()
  const [activeStep, setActiveStep] = useState(0)
  const { content, lang } = useHomeContent()
  const { nav } = content
  const homeSections = [
    { id: 'home', label: 'Home', hidden: true },
    { id: 'approach', label: nav.method },
    { id: 'research', label: nav.research },
    { id: 'work', label: nav.work },
    { id: 'about', label: nav.about },
    { id: 'blog-posts', label: nav.blog },
    { id: 'contact-form', label: nav.contact, hidden: true },
  ]

  useEffect(() => {
    if (!location.hash) return

    const timeoutId = window.setTimeout(() => scrollToSection(location.hash.slice(1)), 0)

    return () => window.clearTimeout(timeoutId)
  }, [location.hash])

  return (
    <MainLayout
      sections={homeSections}
      className="home-v2"
      cta={{ label: nav.cta, targetId: 'contact-form' }}
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
            name: 'Aurel De Vince Portfolio',
            url: buildAbsoluteSiteUrl(),
          },
        ]}
      />

      <section id="home">
        <HomeHero onNavigate={scrollToSection} />
      </section>

      <StackMarquee />

      <section id="approach" className="hv-section hv-section--pattern">
        <MethodSection activeStep={activeStep} onSelectStep={setActiveStep} />
      </section>

      <section id="research" className="hv-section">
        <DoctoralResearchSection />
      </section>

      <section id="publications" className="hv-section hv-section--tight">
        <PublicationsSection />
      </section>

      <section id="work" className="hv-section">
        <WorkSection />
      </section>

      <section id="now" className="hv-section hv-section--tight hv-section--pattern hv-section--pattern-left">
        <NowBuildingSection />
      </section>

      <section id="help" className="hv-section">
        <HelpSection onNavigate={scrollToSection} />
      </section>

      <section id="about" className="hv-section">
        <ProfileSection />
      </section>

      <section id="blog-posts" className="hv-section hv-section--tight">
        <BlogPostsSection />
      </section>

      <section id="contact-form" className="hv-section hv-section--contact">
        <ContactSection />
      </section>
    </MainLayout>
  )
}

export default HomePage
