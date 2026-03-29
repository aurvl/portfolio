import { useState, type FormEvent } from 'react'
import { useTranslation } from 'react-i18next'

function FormContactSection() {
  const { t, i18n } = useTranslation()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')

  const isEmailValid = email.includes('@')
  const isFormReady = email.trim() !== '' && message.trim() !== '' && isEmailValid

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    if (!isEmailValid) {
      event.preventDefault()
      window.alert(t('contact.validationAlert'))
    }
  }

  const getFormHint = () => {
    if (email.trim() === '') return t('contact.hints.emailRequired')
    if (!email.includes('@')) return t('contact.hints.emailInvalid')
    if (message.trim() === '') return t('contact.hints.messageRequired')
    return ''
  }

  const formHint = getFormHint()

  return (
    <section
      id="contact-form"
      className="section-shell flex flex-col items-center py-10 lg:py-24 lg:flex-row"
    >
      <div className="flex flex-col p-8 md:p-7 md:pb-0 lg:basis-3/5">
        <div className="mb-3 flex items-end justify-start gap-2">
          <div className="contact-label-cell flex">
            <p className="contact-label-text text-sm uppercase tracking-[0.24em] text-[var(--text2-col)]">
              {t('contact.eyebrow')}
            </p>
          </div>

          <div>
            <h1 className="text-4xl font-semibold tracking-tight md:text-7xl">
              {t('contact.title')}
            </h1>
            <p className="text-base leading-8 text-[var(--text2-col)]">
              {t('contact.description')}
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 p-8 w-full md:p-7 md:pt-0 lg:basis-2/5 md:w-[60%]">
        <form
          id="myForm"
          action="https://formspree.io/f/xgvewzqo"
          method="POST"
          target="_blank"
          onSubmit={handleSubmit}
          className="bdc flex flex-col gap-1 rounded-lg p-4 transition-colors duration-200 ease-in-out hover:border-[var(--accent-blue)] md:p-3"
        >
          <label htmlFor="name" className="font-semibold">
            {t('contact.name')}
          </label>
          <input
            id="name"
            type="text"
            name="name"
            autoComplete="name"
            placeholder={t('contact.namePlaceholder')}
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="bdc mb-3 rounded-lg border-[var(--glass-border)] bg-[var(--glass-bg)] p-2 text-[var(--accent-orange)] md:mb-5 md:p-2"
          />

          <label htmlFor="email" className="font-semibold">
            {t('contact.email')}
          </label>
          <input
            id="email"
            type="email"
            name="email"
            autoComplete="email" 
            placeholder={t('contact.emailPlaceholder')}
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="bdc mb-3 rounded-lg border-[var(--glass-border)] bg-[var(--glass-bg)] p-2 text-[var(--accent-orange)] md:mb-5 md:p-2"
            required
          />

          <label htmlFor="message" className="font-semibold">
            {t('contact.message')}
          </label>
          <textarea
            id="message"
            name="message"
            autoComplete="off"
            placeholder={t('contact.messagePlaceholder')}
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            required
            className="bdc mb-3 h-32 rounded-lg border-[var(--glass-border)] bg-[var(--glass-bg)] p-2 text-[var(--accent-orange)] md:mb-5 md:p-2"
          />

          <input
            type="hidden"
            name="_next"
            value={`https://formspree.io/thanks?language=${i18n.resolvedLanguage ?? 'en'}`}
          />

          {!isFormReady && (
            <p className="mb-3 text-sm text-[var(--text2-col)]">{formHint}</p>
          )}

          <button
            type="submit"
            disabled={!isFormReady}
            className={`rounded-lg px-4 py-3 transition-all duration-300 ${
              isFormReady
                ? 'bg-[var(--accent-blue)] text-[var(--text-col)] hover:scale-[1.02] hover:bg-[var(--accent-lgtblue)] hover:tracking-wide'
                : 'cursor-not-allowed bg-white/10 text-[var(--text2-col)]'
            }`}
          >
            {t('contact.submit')}
          </button>
        </form>
      </div>
    </section>
  )
}

export default FormContactSection
