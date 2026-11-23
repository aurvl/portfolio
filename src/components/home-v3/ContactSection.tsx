// Dernier écran de l'accueil : photo bambous plein écran, identité, formulaire de contact et navbar en bas.
// Référence : design/screens/05-contact.png. L'envoi passe par Formspree, comme avant (même adresse, mêmes champs).
// La photo s'arrête net ; juste dessous, un emplacement vide : la navbar de l'accueil (MorphNavbar) s'y décroche du
// haut et vient se poser À CHEVAL sur le bord bas de la photo (le bord passe par le milieu de la pilule).
import { useState, type FormEvent } from 'react'
import { FiSend } from 'react-icons/fi'
import { SOCIAL_LINKS } from '../../data/home'
import { placeholders } from '../../data/placeholders'
import { useHomeContent } from '../../hooks/useHomeContent'
import { withBasePath } from '../../lib/site'
import Avatar from '../ui/Avatar'
import BambooPhoto from '../ui/BambooPhoto'
import Button from '../ui/Button'
import SocialIcons from '../ui/SocialIcons'

function ContactSection() {
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
    <>
      <section
        id="contact-form"
        className="contact"
        aria-labelledby="contact-title"
      >
        <BambooPhoto className="contact__photo" />

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

      {/* Emplacement VIDE : la navbar qui voyage (MorphNavbar) vient s'y poser. Il remonte de la moitié de sa hauteur
          sur la photo (contact.css) ; MorphNavbar le mesure grâce à data-morph-slot et lui donne sa hauteur. */}
      <div className="contact__nav">
        <div data-morph-slot />
      </div>
    </>
  )
}

export default ContactSection
