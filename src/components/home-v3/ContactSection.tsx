// Dernier écran de l'accueil : photo bambous plein écran, identité, formulaire de contact et navbar en bas.
// Référence : design/screens/05-contact.png. L'envoi passe par Formspree, comme avant (même adresse, mêmes champs).
// La photo s'arrête net ; juste dessous, un emplacement vide (ContactNavSlot) : la navbar de l'accueil (MorphNavbar)
// s'y décroche du haut et vient se poser À CHEVAL sur le bord bas de la photo (le bord passe par le milieu de la pilule).
// Sur ordinateur (scène de l'accueil, `inScene`), la photo est celle de la scène : cette section n'est plus que
// l'identité et le formulaire, dans une couche collée à l'écran qui apparaît à la fin de la transition (scene.css).
import { useState, type FormEvent } from 'react'
import { FiSend } from 'react-icons/fi'
import { SOCIAL_LINKS } from '../../data/home'
import { placeholders } from '../../data/placeholders'
import { useHomeContent } from '../../hooks/useHomeContent'
import { cn } from '../../lib/cn'
import { withBasePath } from '../../lib/site'
import Avatar from '../ui/Avatar'
import BambooPhoto from '../ui/BambooPhoto'
import Button from '../ui/Button'
import SocialIcons from '../ui/SocialIcons'

type ContactSectionProps = {
  // true (ordinateur, accueil) : la photo vient de la scène, l'ancre « contact-form » est posée par elle
  inScene?: boolean
}

// Emplacement VIDE de la navbar qui voyage (MorphNavbar), sous la photo. Il remonte de la moitié de sa hauteur (plus
// l'espace laissé sous la photo dans la scène) : le bord bas de la photo passe par le milieu de la pilule.
// MorphNavbar le mesure grâce à data-morph-slot et lui donne sa hauteur.
export function ContactNavSlot({ inScene = false }: ContactSectionProps) {
  return (
    <div className={cn('contact__nav', inScene && 'contact__nav--in-scene')}>
      <div data-morph-slot />
    </div>
  )
}

function ContactSection({ inScene = false }: ContactSectionProps) {
  const { content, lang } = useHomeContent()
  const { contact, nav } = content
  const profile = placeholders.getProfile(lang)
  const [subject, setSubject] = useState(contact.subjects[0])
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')

  const isEmailValid = email.includes('@')
  const isFormReady = email.trim() !== '' && message.trim() !== '' && isEmailValid

  const hint =
    email.trim() === ''
      ? contact.hints.emailRequired
      : !isEmailValid
        ? contact.hints.emailInvalid
        : message.trim() === ''
          ? contact.hints.messageRequired
          : ''

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    if (!isFormReady) event.preventDefault()
  }

  return (
    <section
      id={inScene ? undefined : 'contact-form'}
      className={cn('contact', inScene && 'contact--in-scene')}
      aria-labelledby="contact-title"
    >
      {inScene ? null : (
        <div className="contact__photo-frame">
          {/* sizes : la photo est collée à l'écran, de la hauteur de la fenêtre ; avec « cover » sa largeur vaut 1,5 fois
              cette hauteur. Sans cette indication le navigateur prendrait le plus petit fichier (flou). */}
          <BambooPhoto
            className="contact__photo"
            sizes="150vh"
          />
        </div>
      )}

      <div className="contact__content">
        <header className="contact__identity">
          <Avatar
            className="contact__avatar"
            src={profile.avatarSrc ? withBasePath(profile.avatarSrc) : null}
            alt={profile.avatarAlt}
          />
          <div className="contact__who">
            <p className="contact__name">
              {profile.firstNames} {profile.lastName}
            </p>
            <p className="contact__role">{profile.role}</p>
            <SocialIcons className="contact__social" />
          </div>
        </header>

        <form
          className="contact__form"
          action="https://formspree.io/f/xgvewzqo"
          method="POST"
          target="_blank"
          onSubmit={handleSubmit}
        >
          <div className="contact__heading">
            <p className="eyebrow">{nav.contact}</p>
            <h2
              id="contact-title"
              className="contact__title"
            >
              {contact.title}
            </h2>
          </div>

          <label className="contact__field">
            {contact.fields.name}
            <input
              type="text"
              name="name"
              autoComplete="name"
              placeholder={contact.fields.namePlaceholder}
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
          </label>

          <label className="contact__field">
            {contact.fields.email}
            <input
              type="email"
              name="email"
              autoComplete="email"
              placeholder={contact.fields.emailPlaceholder}
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </label>

          <label className="contact__field">
            {contact.fields.subject}
            <select
              name="subject"
              value={subject}
              onChange={(event) => setSubject(event.target.value)}
            >
              {contact.subjects.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
          </label>

          <label className="contact__field contact__field--message">
            {contact.fields.message}
            <textarea
              name="message"
              placeholder={contact.fields.messagePlaceholder}
              required
              value={message}
              onChange={(event) => setMessage(event.target.value)}
            />
          </label>

          <input
            type="hidden"
            name="_next"
            value={`https://formspree.io/thanks?language=${lang}`}
          />

          <div className="contact__footer">
            <p className="contact__note">
              {isFormReady ? (
                <>
                  {contact.directEmail}{' '}
                  <a href={`mailto:${SOCIAL_LINKS.email}`}>{SOCIAL_LINKS.email}</a>
                </>
              ) : (
                hint
              )}
            </p>
            <Button
              variant="solid"
              className="contact__submit"
              type="submit"
              disabled={!isFormReady}
              icon={<FiSend />}
            >
              {contact.submit}
            </Button>
          </div>
        </form>
      </div>
    </section>
  )
}

export default ContactSection
