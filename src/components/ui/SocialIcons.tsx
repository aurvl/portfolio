// Rangée de ronds bleus vers les réseaux (LinkedIn, GitHub, Threads, ORCID, ResearchGate, email).
// Apparaît à droite sous la bannière de la section About.
import type { ReactNode } from 'react'
import { BsGithub } from 'react-icons/bs'
import { FaLinkedinIn, FaThreads } from 'react-icons/fa6'
import { MdOutlineEmail } from 'react-icons/md'
import { SiOrcid, SiResearchgate } from 'react-icons/si'
import { SOCIAL_LINKS } from '../../data/home'
import { cn } from '../../lib/cn'

type SocialLink = {
  label: string
  href: string
  icon: ReactNode
  external: boolean
}

const SOCIAL_ITEMS: SocialLink[] = [
  { label: 'LinkedIn', href: SOCIAL_LINKS.linkedin, icon: <FaLinkedinIn />, external: true },
  { label: 'GitHub', href: SOCIAL_LINKS.github, icon: <BsGithub />, external: true },
  { label: 'Threads', href: SOCIAL_LINKS.threads, icon: <FaThreads />, external: true },
  { label: 'ORCID', href: SOCIAL_LINKS.orcid, icon: <SiOrcid />, external: true },
  { label: 'ResearchGate', href: SOCIAL_LINKS.researchgate, icon: <SiResearchgate />, external: true },
  { label: 'Email', href: `mailto:${SOCIAL_LINKS.email}`, icon: <MdOutlineEmail />, external: false },
]

type SocialIconsProps = {
  className?: string
}

function SocialIcons({ className }: SocialIconsProps) {
  return (
    <ul className={cn('social-icons', className)}>
      {SOCIAL_ITEMS.map((item) => (
        <li key={item.label}>
          <a
            className="social-icons__link"
            href={item.href}
            aria-label={item.label}
            title={item.label}
            {...(item.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
          >
            {item.icon}
          </a>
        </li>
      ))}
    </ul>
  )
}

export default SocialIcons
