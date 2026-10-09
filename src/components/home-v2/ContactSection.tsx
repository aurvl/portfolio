import { useState, type FormEvent } from 'react'
import { FiChevronRight } from 'react-icons/fi'
import { SOCIAL_LINKS } from '../../data/home'
import { useHomeContent } from '../../hooks/useHomeContent'
import Reveal from './Reveal'

function ContactSection() {
  const { content, lang } = useHomeContent()
  const { contact } = content
  const [routeIndex, setRouteIndex] = useState(0)
  const [subjectIndex, setSubjectIndex] = useState(0)
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
    if (!isFormReady) {
      event.preventDefault()
    }
  }

  const selectRoute = (index: number) => {
    setRouteIndex(index)
    setSubjectIndex(index)
  }

  return (
    <div className="hv-wrap">
      <div className="hv-contact">
        <Reveal>
          <h2 className="hv-h2 hv-contact__title">{contact.title}</h2>
          <p className="hv-lead hv-contact__lead">{contact.lead}</p>
          <div className="hv-routes">
            {contact.routes.map((route, index) => (
              <button
                key={route.title}
                type="button"
                className={`hv-card hv-route hv-route--${route.tone} ${index === routeIndex ? 'is-active' : ''}`}
                aria-pressed={index === routeIndex}
                onClick={() => selectRoute(index)}
              >
                <span className="hv-route__audience">{route.audience}</span>
                <b>{route.title}</b>
                <span className="hv-route__detail">{route.detail}</span>
                <FiChevronRight className="hv-arrow hv-route__arrow" aria-hidden="true" />
              </button>
            ))}
          </div>
        </Reveal>

        <Reveal>
          <form
            className="hv-card hv-form"
            action="https://formspree.io/f/xgvewzqo"
            method="POST"
            target="_blank"
            onSubmit={handleSubmit}
          >
            <label className="hv-field">
              {contact.fields.name}
              <input type="text" name="name" autoComplete="name" placeholder={contact.fields.namePlaceholder} value={name} onChange={(event) => setName(event.target.value)} />
            </label>
            <label className="hv-field">
              {contact.fields.email}
              <input type="email" name="email" autoComplete="email" placeholder={contact.fields.emailPlaceholder} required value={email} onChange={(event) => setEmail(event.target.value)} />
            </label>
            <label className="hv-field">
              {contact.fields.subject}
              <select
                name="subject"
                value={contact.subjects[subjectIndex]}
                onChange={(event) => setSubjectIndex(contact.subjects.indexOf(event.target.value))}
              >
                {contact.subjects.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
            </label>
            <label className="hv-field">
              {contact.fields.message}
              <textarea name="message" placeholder={contact.fields.messagePlaceholder} required value={message} onChange={(event) => setMessage(event.target.value)} />
            </label>
            <input type="hidden" name="_next" value={`https://formspree.io/thanks?language=${lang}`} />
            {!isFormReady && <p className="hv-form__hint">{hint}</p>}
            <p className="hv-form__direct">
              {contact.directEmail} <a className="hv-link" href={`mailto:${SOCIAL_LINKS.email}`}>{SOCIAL_LINKS.email}</a>
            </p>
            <button type="submit" className="hv-btn hv-btn--primary" disabled={!isFormReady}>
              {contact.submit}
            </button>
          </form>
        </Reveal>
      </div>
    </div>
  )
}

export default ContactSection
