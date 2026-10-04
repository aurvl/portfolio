import { useEffect, useRef, useState, type ReactNode } from 'react'
import { motion } from 'framer-motion'
import { FaLinkedin } from 'react-icons/fa'
import { FaThreads } from 'react-icons/fa6'
import { BsDiscord, BsGithub } from 'react-icons/bs'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { withBasePath } from '../../lib/site'
import { getImageDimensions } from '../../lib/imageMetadata'

type FloatingLink = {
  id: number
  label: ReactNode
  ariaLabel: string
  href: string
  color: string
  iconColor: string
  top: string
  left: string
}

type ParticlePosition = {
  x: number
  y: number
}

const HERO_IMAGE = 'assets/images/hero-image.png'
const ICON_SIZE = 48

const floatingLinks: FloatingLink[] = [
  {
    id: 1,
    label: <FaLinkedin size={23} />,
    ariaLabel: 'LinkedIn',
    href: 'https://www.linkedin.com/in/aurel-vehi/',
    color: '#0071B3',
    iconColor: '#ffffff',
    top: '37%',
    left: '-18%',
  },
  {
    id: 2,
    label: <BsGithub size={23} />,
    ariaLabel: 'GitHub',
    href: 'https://github.com/aurvl',
    color: '#ffffff',
    iconColor: '#0e1928',
    top: '84%',
    left: '4%',
  },
  {
    id: 3,
    label: <BsDiscord size={23} />,
    ariaLabel: 'Discord',
    href: 'https://discord.gg/7CgCeVsv',
    color: '#545FE8',
    iconColor: '#ffffff',
    top: '-4%',
    left: '80%',
  },
  {
    id: 4,
    label: <FaThreads size={23} />,
    ariaLabel: 'Threads',
    href: 'https://www.threads.com/@aur_rel_?igshid=NTc4MTIwNjQ2YQ==',
    color: '#111111',
    iconColor: '#ffffff',
    top: '79%',
    left: '78%',
  },
]

function HeroSection() {
  const { t } = useTranslation()
  const heroImageDimensions = getImageDimensions(HERO_IMAGE)
  const dragAreaRef = useRef<HTMLDivElement | null>(null)
  const mobileAreaRef = useRef<HTMLDivElement | null>(null)
  const [isSmallScreen, setIsSmallScreen] = useState(false)
  const [positions, setPositions] = useState<Record<number, ParticlePosition>>({
    1: { x: 20, y: 30 },
    2: { x: 120, y: 140 },
    3: { x: 200, y: 70 },
    4: { x: 80, y: 180 },
  })

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 767px)')
    const updateScreenSize = () => setIsSmallScreen(mediaQuery.matches)

    updateScreenSize()
    mediaQuery.addEventListener('change', updateScreenSize)

    return () => mediaQuery.removeEventListener('change', updateScreenSize)
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
      3: { x: maxX * 0.78, y: maxY * 0.12 },
      4: { x: maxX * 0.28, y: maxY * 0.78 },
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

      setPositions((previousPositions) => {
        const nextPositions: Record<number, ParticlePosition> = {}

        for (const link of floatingLinks) {
          const current = previousPositions[link.id] ?? { x: 0, y: 0 }
          const x = Math.max(0, Math.min(current.x + (Math.random() - 0.5) * 24, maxX))
          const y = Math.max(0, Math.min(current.y + (Math.random() - 0.5) * 24, maxY))

          nextPositions[link.id] = { x, y }
        }

        return nextPositions
      })
    }, 260)

    return () => window.clearInterval(interval)
  }, [isSmallScreen])

  return (
    <section className="section-shell research-hero scroll-mt-20" aria-labelledby="hero-title">
      <div className="research-hero__copy">
        <motion.h1
          id="hero-title"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {t('hero.title')}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.08 }}
          className="research-hero__role"
        >
          {t('hero.subtitle')}
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.16 }}
          className="research-hero__description"
        >
          {t('hero.description')}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.24 }}
          className="research-hero__actions"
        >
          <Link to="/research" className="research-button research-button--primary">
            {t('hero.ctaResearch')}
          </Link>
          <a href="#selected-work" className="research-button research-button--secondary">
            {t('hero.ctaProjects')}
          </a>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.65, delay: 0.12 }}
        ref={mobileAreaRef}
        className="research-hero__portrait-stage"
      >
        <div ref={dragAreaRef} className="research-hero__portrait-frame research-hero__portrait-frame--round">
          <img
            src={withBasePath(HERO_IMAGE)}
            alt={t('hero.title')}
            width={heroImageDimensions?.width}
            height={heroImageDimensions?.height}
          />
          {!isSmallScreen && floatingLinks.map((link) => (
            <motion.a
              key={link.id}
              href={link.href}
              target="_blank"
              rel="noreferrer"
              aria-label={link.ariaLabel}
              drag
              dragConstraints={dragAreaRef}
              dragElastic={0.08}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.94 }}
              className="research-social-link"
              style={{
                top: link.top,
                left: link.left,
                backgroundColor: link.color,
                color: link.iconColor,
              }}
            >
              {link.label}
            </motion.a>
          ))}
        </div>

        {isSmallScreen && floatingLinks.map((link) => (
          <motion.a
            key={link.id}
            href={link.href}
            target="_blank"
            rel="noreferrer"
            aria-label={link.ariaLabel}
            animate={{
              x: positions[link.id]?.x ?? 0,
              y: positions[link.id]?.y ?? 0,
            }}
            transition={{ duration: 0.28, ease: 'linear' }}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.94 }}
            className="research-social-link research-social-link--mobile"
            style={{ backgroundColor: link.color, color: link.iconColor }}
          >
            {link.label}
          </motion.a>
        ))}
      </motion.div>
    </section>
  )
}

export default HeroSection
