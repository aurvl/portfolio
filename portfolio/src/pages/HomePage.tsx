import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation } from 'react-router-dom'
import MainLayout from "../components/layout/MainLayout"
import HeroSection from "../components/home/HeroSection"
import AboutSection from "../components/home/AboutSection"
import SkillsSection from "../components/home/SkillsSection"
import FeaturedProjects from "../components/home/FeaturedProjects"
import RecentPosts from "../components/home/RecentPosts"
import FormContactSection from "../components/home/FormContactSection"

function HomePage() {
  const { t } = useTranslation()
  const location = useLocation()
  const homeSections = [
    { id: 'home', label: t('nav.home') },
    { id: 'about', label: t('nav.about') },
    { id: 'skills', label: t('nav.skills') },
    { id: 'featured-projects', label: t('nav.projects') },
    { id: 'recent-posts', label: t('nav.blog') },
    { id: 'contact-form', label: t('nav.contact'), hidden: true },
  ]

  useEffect(() => {
    if (!location.hash) return

    const targetId = location.hash.slice(1)
    const target = document.getElementById(targetId)

    if (!target) return

    const timeoutId = window.setTimeout(() => {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      })
    }, 0)

    return () => window.clearTimeout(timeoutId)
  }, [location.hash])

  return (
    <MainLayout sections={homeSections}>
      <section id="home">
        <HeroSection />
      </section>

      <section id="about">
        <AboutSection />
      </section>

      <section id="skills">
        <SkillsSection />
      </section>

      <section id="featured-projects">
        <FeaturedProjects />
      </section>

      <section id="recent-posts">
        <RecentPosts />
      </section>

      <section id="contact-form">
        <FormContactSection />
      </section>
      
    </MainLayout>
  )
}

export default HomePage
