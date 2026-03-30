import { useTranslation } from 'react-i18next'
import ExpCertSubSection from '../skills/ExpCertSubSection'
import ToolsSubSection from '../skills/ToolsSubSection'

function SkillsSection() {
  const { t } = useTranslation()

  return (
    <section id="skills" className="bdctb flex w-full flex-col items-center py-15 md:py-12 xl:px-30 lg:px-10 md:px-0 px-7">
      <div className="w-full xl:px-12 md:p-12 md:pb-2 lg:px-2">
        <p className="mb-3 text-sm uppercase tracking-[0.24em] text-[var(--text2-col)]">
          {t('skills.eyebrow')}
        </p>

        <h1 className="mb-4 text-4xl font-semibold tracking-tight md:text-5xl">
          {t('skills.title')}
        </h1>

        <p className="text-base leading-8 text-[var(--text2-col)]">
          {t('skills.description')}
        </p>
      </div>

      <div className="flex w-full flex-col gap-8 md:p-12 md:pt-0 lg:flex-row lg:justify-between lg:gap-10 lg:px-2 xl:px-12">
        <ExpCertSubSection />
        <ToolsSubSection />
      </div>
    </section>
  )
}

export default SkillsSection
