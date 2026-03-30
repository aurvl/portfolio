import { useTranslation } from 'react-i18next'
import ExpList from './ExpList'
import CertList from './CertifList'
import SegmentedTabs from '../ui/SegmentedTabs'

function ExpCertSubSection() {
  const { t } = useTranslation()

  return (
      <SegmentedTabs
        tabs={[
          {
            id: 'exp',
            label: t('skills.tabs.experience'),
            content: <ExpList />,
          },
          {
            id: 'cert',
            label: t('skills.tabs.certifications'),
            content: <CertList />,
          },
        ]}
      />
  )
}

export default ExpCertSubSection
