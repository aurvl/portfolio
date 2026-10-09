import { BsGithub } from 'react-icons/bs'
import { FaLinkedinIn } from 'react-icons/fa'
import { FaThreads } from 'react-icons/fa6'
import { SOCIAL_LINKS } from '../../data/home'
import { useHomeContent } from '../../hooks/useHomeContent'
import { getResumeDownloadUrl, withBasePath } from '../../lib/site'
import Reveal from './Reveal'

const socials = [
  { label: 'LinkedIn', href: SOCIAL_LINKS.linkedin, icon: <FaLinkedinIn /> },
  { label: 'GitHub', href: SOCIAL_LINKS.github, icon: <BsGithub /> },
  { label: 'Threads', href: SOCIAL_LINKS.threads, icon: <FaThreads /> },
]

function ProfileSection() {
  const { content, lang } = useHomeContent()
  const { about } = content

  return (
    <div className="hv-wrap">
      <Reveal className="hv-about">
        <img
          className="hv-about__portrait"
          src={withBasePath('assets/images/hero-image.png')}
          alt={about.portraitAlt}
          loading="lazy"
        />
        <div>
          <h2 className="hv-h2">{about.title}</h2>
          <p className="hv-about__bio">{about.bio}</p>
          <ol className="hv-journey">
            {about.journey.map((step) => (
              <li
                key={step.what}
                className={`${step.current ? 'is-current' : ''} ${step.next ? 'is-next' : ''}`}
              >
                <span>{step.when}</span>
                <b>{step.what}</b>
              </li>
            ))}
          </ol>
          <div className="hv-tags">
            {about.principles.map((principle) => (
              <span key={principle} className="hv-tag">{principle}</span>
            ))}
          </div>
          <div className="hv-about__actions">
            <a className="hv-btn hv-btn--ghost hv-btn--sm" href={getResumeDownloadUrl(lang)} target="_blank" rel="noreferrer">
              {about.cv}
            </a>
            {socials.map((social) => (
              <a
                key={social.label}
                className="hv-icon-link"
                href={social.href}
                target="_blank"
                rel="noreferrer"
                aria-label={social.label}
                title={social.label}
              >
                {social.icon}
              </a>
            ))}
          </div>
        </div>
      </Reveal>
    </div>
  )
}

export default ProfileSection
