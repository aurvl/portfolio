import { useEffect, useRef, useState, type ReactNode } from 'react'
import { motion } from 'framer-motion'
import { FaLinkedin } from 'react-icons/fa'
import { BsDiscord, BsGithub } from 'react-icons/bs'
import { GiGraduateCap } from 'react-icons/gi'
import { IoHammerSharp } from 'react-icons/io5'
import { TbBrandReactNative } from 'react-icons/tb'
import { useTranslation } from 'react-i18next'
import StatBox from '../ui/StatBox'
import projects from '../../data/projects.json'
import skillsCatalog from '../../data/skills.json'
import type { Project } from '../../types/project'
import type { SkillCatalog } from '../../types/skill'

type FloatingLink = {
  id: number
  label: ReactNode
  href: string
  color: string
  top: string
  left: string
}

type ParticlePosition = {
  x: number
  y: number
}

const floatingLinks: FloatingLink[] = [
  {
    id: 1,
    label: <FaLinkedin size={24} color="#ffffff" />,
    href: 'https://www.linkedin.com/in/aurel-vehi/',
    color: '#0071B3',
    top: '37%',
    left: '-19%',
  },
  {
    id: 2,
    label: <BsGithub size={24} color="#000000" />,
    href: 'https://github.com/aurvl',
    color: '#ffffff',
    top: '88%',
    left: '5%',
  },
  {
    id: 3,
    label: <BsDiscord size={24} color="#ffffff" />,
    href: 'https://discord.gg/7CgCeVsv',
    color: '#545FE8',
    top: '79%',
    left: '78%',
  },
]

const typedProjects = projects as Project[]
const typedSkillsCatalog = skillsCatalog as SkillCatalog
const projectsCount = typedProjects.length
const skillsCount = typedSkillsCatalog.categories.reduce(
  (total, category) => total + category.items.length,
  0
)

const ICON_SIZE = 48

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(value, max))
}

function HeroSection() {
  const { t } = useTranslation()

  const dragAreaRef = useRef<HTMLDivElement | null>(null)
  const mobileAreaRef = useRef<HTMLDivElement | null>(null)

  const [isSmallScreen, setIsSmallScreen] = useState(false)
  const [positions, setPositions] = useState<Record<number, ParticlePosition>>({
    1: { x: 20, y: 30 },
    2: { x: 120, y: 140 },
    3: { x: 200, y: 70 },
  })

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 767px)')

    const updateScreen = (event?: MediaQueryList | MediaQueryListEvent) => {
      setIsSmallScreen(event ? event.matches : mediaQuery.matches)
    }

    updateScreen(mediaQuery)
    mediaQuery.addEventListener('change', updateScreen)

    return () => {
      mediaQuery.removeEventListener('change', updateScreen)
    }
  }, [])

  useEffect(() => {
    if (!isSmallScreen) return

    const element = mobileAreaRef.current
    if (!element) return

    const rect = element.getBoundingClientRect()
    const maxX = Math.max(0, rect.width - ICON_SIZE)
    const maxY = Math.max(0, rect.height - ICON_SIZE)

    setPositions({
      1: { x: maxX * 0.15, y: maxY * 0.25 },
      2: { x: maxX * 0.55, y: maxY * 0.7 },
      3: { x: maxX * 0.78, y: maxY * 0.35 },
    })
  }, [isSmallScreen])

  useEffect(() => {
    if (!isSmallScreen) return

    const interval = window.setInterval(() => {
      const element = mobileAreaRef.current
      if (!element) return

      const rect = element.getBoundingClientRect()
      const maxX = Math.max(0, rect.width - ICON_SIZE)
      const maxY = Math.max(0, rect.height - ICON_SIZE)

      setPositions((prev) => {
        const next: Record<number, ParticlePosition> = {}

        for (const link of floatingLinks) {
          const current = prev[link.id] ?? { x: 0, y: 0 }

          const dx = (Math.random() - 0.5) * 24
          const dy = (Math.random() - 0.5) * 24

          next[link.id] = {
            x: clamp(current.x + dx, 0, maxX),
            y: clamp(current.y + dy, 0, maxY),
          }
        }

        return next
      })
    }, 260)

    return () => {
      window.clearInterval(interval)
    }
  }, [isSmallScreen])

  return (
    <section id="home" className="section-shell flex flex-wrap items-center py-16 md:py-24 scroll-mt-[80px]">
      <div className="lg:basis-4/5 p-8 md:p-8 md:basis-2/3">
        <p className="mb-3 text-sm uppercase tracking-[0.24em] text-[var(--text2-col)]">
          {t('hero.eyebrow')}
        </p>

        <h1 className="mb-4 text-4xl font-semibold tracking-tight md:text-6xl">
          {t('hero.title')}
        </h1>

        <h2 className="mb-4 text-xl font-semibold tracking-tight md:text-4xl">
          {t('hero.subtitle')}
        </h2>

        <p className="max-w-2xl text-base leading-8 text-[var(--text2-col)]">
          {t('hero.description')}
        </p>
      </div>

      <div
        ref={mobileAreaRef}
        className="lg:basis-1/5 p-8 md:p-2 md:basis-1/3 relative min-h-[260px]"
      >
        <div ref={dragAreaRef} className="relative mx-auto flex items-center justify-center">
          <img
            src="/assets/images/hero-image.png"
            alt={t('hero.title')}
            className="h-full w-full rounded-full object-cover"
          />

          {!isSmallScreen &&
            floatingLinks.map((link) => (
              <motion.a
                key={link.id}
                href={link.href}
                drag
                dragConstraints={dragAreaRef}
                dragElastic={0.08}
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.96 }}
                className="absolute flex h-12 w-12 items-center justify-center rounded-lg border border-[var(--glass-border)] text-lg font-semibold text-white shadow-lg"
                style={{
                  top: link.top,
                  left: link.left,
                  backgroundColor: link.color,
                }}
              >
                {link.label}
              </motion.a>
            ))}
        </div>

        {isSmallScreen &&
          floatingLinks.map((link) => (
            <motion.a
              key={link.id}
              href={link.href}
              animate={{
                x: positions[link.id]?.x ?? 0,
                y: positions[link.id]?.y ?? 0,
              }}
              transition={{
                duration: 0.28,
                ease: 'linear',
              }}
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.96 }}
              className="absolute top-0 left-0 flex h-12 w-12 items-center justify-center rounded-lg border border-[var(--glass-border)] text-lg font-semibold text-white shadow-lg"
              style={{
                backgroundColor: link.color,
              }}
            >
              {link.label}
            </motion.a>
          ))}
      </div>

      <div className="flex flex-col items-center justify-center w-full justify-center gap-6 p-10 lg:flex-row">
        <StatBox
          icon={<GiGraduateCap size={24} />}
          text={t('hero.stats.profile')}
        />
        <StatBox
          icon={<IoHammerSharp size={24} />}
          text={t('hero.stats.projects', { count: projectsCount })}
        />
        <StatBox
          icon={<TbBrandReactNative size={24} />}
          text={t('hero.stats.skills', { count: skillsCount })}
        />
      </div>
    </section>
  )
}

export default HeroSection