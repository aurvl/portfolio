import { useTranslation } from 'react-i18next'
import CertCard from '../ui/CertifCard'

function CertList() {
  const { t } = useTranslation()

  const certifications = [
    {
      href: 'https://www.datacamp.com/certificate/PDA0018574982789',
      image: '/assets/images/certifications/datacampinc_logo.jpg',
      imageAlt: 'DataCamp',
      title: 'Python Data Associate',
      credentialId: t('skills.certifications.credentialId', {
        id: 'PDA0018574982789',
      }),
      issuedText: t('skills.certifications.issuedExpires', {
        issued: 'Jan 2026',
        expires: 'Jan 2028',
      }),
    },
    {
      href: 'https://www.datacamp.com/certificate/SQA0010675463388',
      image: '/assets/images/certifications/datacampinc_logo.jpg',
      imageAlt: 'DataCamp',
      title: 'SQL Associate',
      credentialId: t('skills.certifications.credentialId', {
        id: 'SQA0010675463388',
      }),
      issuedText: t('skills.certifications.issuedExpires', {
        issued: 'Jan 2026',
        expires: 'Jan 2028',
      }),
    },
    {
      href: 'https://openbadgefactory.com/v1/assertion/e6fc9dcc549b9b9f4ab73df5ab9bb77f052dfa44',
      image: '/assets/images/certifications/ct1.png',
      imageAlt: t('skills.certifications.introStatsR'),
      title: t('skills.certifications.introStatsR'),
      issuedText: t('skills.certifications.issued', { date: 'Oct 2024' }),
    },
    {
      href: '#',
      image: '/assets/images/certifications/ct2.png',
      imageAlt: t('skills.certifications.pix'),
      title: t('skills.certifications.pix'),
      credentialId: t('skills.certifications.verificationCode', {
        code: 'P-MB9CBR3X',
      }),
      issuedText: t('skills.certifications.issued', { date: 'Mar 2023' }),
    },
  ]

  return (
    <div className="cert-list">
      {certifications.map((certification) => (
        <CertCard
          key={`${certification.title}-${certification.issuedText}`}
          {...certification}
        />
      ))}
    </div>
  )
}

export default CertList
