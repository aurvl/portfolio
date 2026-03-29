import { useEffect, useRef, useState } from 'react'
import rawProjects from '../../data/projects.json'
import type { Project } from '../../types/project'
import { useTranslation } from 'react-i18next'
import FeaturedProjectCard from '../projects/FeaturedProjectCard'
import ProjectCard from '../projects/ProjectCard'
import RecentProjectCard from '../projects/RecentProjectCard'

const projects = rawProjects as Project[]

function FeaturedProjects() {
  const { t } = useTranslation()
  const [isSmallScreen, setIsSmallScreen] = useState(false)
  const [activeRecentIndex, setActiveRecentIndex] = useState(0)
  const recentCarouselRef = useRef<HTMLDivElement | null>(null)
  const completedProjects = projects.filter(
    (project) => project.status === 'completed'
  )

  const featuredProject =
    completedProjects.find((project) => project.featured === true) ?? null

  const recentProjects = [...completedProjects]
    .sort((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime()
    })
    .slice(0, 3)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 450px)')

    const updateScreenSize = (event?: MediaQueryListEvent) => {
      setIsSmallScreen(event ? event.matches : mediaQuery.matches)
    }

    updateScreenSize()
    mediaQuery.addEventListener('change', updateScreenSize)

    return () => {
      mediaQuery.removeEventListener('change', updateScreenSize)
    }
  }, [])

  useEffect(() => {
    if (!isSmallScreen) {
      setActiveRecentIndex(0)
    }
  }, [isSmallScreen])

  const handleRecentProjectsScroll = () => {
    const container = recentCarouselRef.current

    if (!container) return

    const slides = Array.from(
      container.querySelectorAll<HTMLElement>('[data-carousel-item="true"]')
    )

    if (slides.length === 0) return

    const containerLeft = container.getBoundingClientRect().left

    const closestSlideIndex = slides.reduce((closestIndex, slide, index) => {
      const closestSlide = slides[closestIndex]

      if (!closestSlide) return index

      const currentDistance = Math.abs(slide.getBoundingClientRect().left - containerLeft)
      const closestDistance = Math.abs(
        closestSlide.getBoundingClientRect().left - containerLeft
      )

      return currentDistance < closestDistance ? index : closestIndex
    }, 0)

    setActiveRecentIndex(closestSlideIndex)
  }

  return (
    <section id="projects" className="section-shell py-15 md:py-12">
      <div className="last-projects-section my-8 flex flex-col">
        <div className="py-4 md:py-4 flex flex-col items-center justify-center">
          <p className="mb-3 text-sm uppercase tracking-[0.24em] text-[var(--text2-col)]">
            {t('projects.eyebrow')}
          </p>

          <h1 className="mb-4 text-4xl font-semibold tracking-tight md:text-6xl">
            {t('projects.title')}
          </h1>
        </div>

        <div className='flex w-full flex-col gap-2 items-center'>
          {featuredProject ? (
            isSmallScreen ? (
              <div className="w-full px-4">
                <ProjectCard project={featuredProject} />
              </div>
            ) : (
              <FeaturedProjectCard project={featuredProject} />
            )
          ) : (
            isSmallScreen ? (
              <div className="flex w-full flex-col gap-4">
                <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-[var(--glass-border)] bg-[var(--glass-bg)] px-4 py-2">
                  {recentProjects.map((project, index) => (
                    <span
                      key={project.id}
                      className={`h-2.5 w-2.5 rounded-full transition-colors duration-200 ${
                        index === activeRecentIndex
                          ? 'bg-[var(--accent-blue)]'
                          : 'bg-[var(--text2-col)] opacity-40'
                      }`}
                    />
                  ))}
                </div>

                <div
                  ref={recentCarouselRef}
                  className="flex w-full snap-x snap-mandatory overflow-x-auto scroll-smooth [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                  onScroll={handleRecentProjectsScroll}
                >
                  {recentProjects.map((project) => (
                    <div
                      key={project.id}
                      data-carousel-item="true"
                      className="w-full shrink-0 snap-start px-4"
                    >
                      <RecentProjectCard project={project} />
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex flex-wrap gap-4">
                {recentProjects.map((project) => (
                  <RecentProjectCard key={project.id} project={project} />
                ))}
              </div>
            )
          )}

          <a href="/projects"
            className="btn btn-primary border-class mt-6 flex w-auto justify-center rounded-[5px] 
            bg-[#3784d8] p-3 font-semibold text-white md:p-3 sm:w-auto sm:min-w-[220px]
            ">
            {t('projects.viewAll')}
          </a>
        </div>
      </div>
    </section>
  )
}

export default FeaturedProjects
