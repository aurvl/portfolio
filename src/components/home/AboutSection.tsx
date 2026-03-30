import { useTranslation } from 'react-i18next'
import { getResumeDownloadUrl, withBasePath } from '../../lib/site'

function AboutSection() {
  const { t, i18n } = useTranslation()

  return (
    <section id="about" className="section-shell lg:py-24 md:py-0 pb-20 md:pb-25">
      <div className="flex flex-col p-8 md:p-12 lg:flex-row gap-rersponsive">
        <div className="about-img flex basis-2/5 flex-col items-center justify-center">
          <p className="mb-3 text-right text-sm uppercase tracking-[0.24em] text-[var(--text2-col)]">
            {t('about.eyebrow')}
          </p>

          <img
            className="w-full object-cover"
            src={withBasePath('assets/images/about-image.png')}
            alt={t('about.imageAlt')}
          />
        </div>

        <div className="about-content basis-3/5 border-t-[1px] border-[var(--glass-border)] flex items-center">
          <p className="max-w-2xl text-base leading-8 text-[var(--text2-col)] text-center md:text-left">
            {t('about.description1')}
            <br />
            {t('about.description2')}
            <br />
            {t('about.description3')}
          </p>
        </div>
      </div>
      <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
        <a
          href="#contact-form"
          className="button-shadow btn btn-primary border-class flex justify-center 
          rounded-[5px] bg-[#3784d8] w-[60%] md:w-auto
          px-8 py-3 font-semibold text-white md:p-3 sm:w-auto sm:min-w-[220px]"
        >
          {t('about.contact')}
        </a>
        <a
          href={getResumeDownloadUrl(i18n.resolvedLanguage ?? i18n.language)}
          download={i18n.resolvedLanguage === 'fr' ? 'AurelVehi_CV_FR.pdf' : 'AurelVehi_CV_EN.pdf'}
          className="button-shadow btn btn-secondary border-class flex justify-center 
          rounded-[5px] w-[60%] md:w-auto
          px-8 py-3 font-semibold text-white md:p-3 sm:w-auto sm:min-w-[220px]"
        >
          {t('about.resume')}
        </a>
      </div>
    </section>
  )
}

export default AboutSection
