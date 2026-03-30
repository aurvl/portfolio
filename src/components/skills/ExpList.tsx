import { useTranslation } from 'react-i18next'
import ExpCard from '../ui/ExpCard'

const experiences = [
  {
    key: 'ecos',
    image: '/assets/images/companies/eco.jpg',
    imageAlt: 'Laboratoire ECOSEAS',
    tooltip: 'Laboratoire ECOSEAS - Centre Scientifique de Monaco',
  },
  {
    key: 'csm',
    image: '/assets/images/companies/csm-logo.png',
    imageAlt: 'Centre Scientifique de Monaco',
    tooltip: 'Centre Scientifique de Monaco',
  },
  {
    key: 'fsTutor',
    image: '/assets/images/companies/fsn.jpg',
    imageAlt: 'Family Sphere',
    tooltip: 'Family Sphere',
  },
  {
    key: 'fsFinance',
    image: '/assets/images/companies/fsn.jpg',
    imageAlt: 'Family Sphere',
    tooltip: 'Family Sphere',
  },
]

function ExpList() {
  const { t } = useTranslation()

  return (
    <div className="flex flex-col justify-center align-center gap-8">
      <div className="exp-list">
        {experiences.map((experience) => (
          <ExpCard
            key={experience.key}
            image={experience.image}
            imageAlt={experience.imageAlt}
            tooltip={experience.tooltip}
            title={t(`skills.experience.${experience.key}.title`)}
            period={t(`skills.experience.${experience.key}.period`)}
            contractType={t(`skills.experience.${experience.key}.contractType`)}
            location={t(`skills.experience.${experience.key}.location`)}
          />
        ))}
      </div>
    </div>
  )
}

export default ExpList
