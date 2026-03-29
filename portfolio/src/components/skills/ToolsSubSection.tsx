import { useTranslation } from 'react-i18next'
import rawSkills from '../../data/skills.json'
import type { SkillCatalog } from '../../types/skill'
import SegmentedTabs from '../ui/SegmentedTabs'
import ToolsGroups from '../ui/ToolsGroups'

const skillsCatalog = rawSkills as SkillCatalog

const groupedCategories = {
  dataTools: skillsCatalog.categories.filter((category) =>
    ['data', 'data-platforms'].includes(category.id)
  ),
  webTools: skillsCatalog.categories.filter((category) =>
    ['frontend-apps', 'analytics-tools'].includes(category.id)
  ),
}

function ToolsSubSection() {
  const { t } = useTranslation()

  return (
    <SegmentedTabs
      tabs={[
        {
          id: 'data-tools',
          label: t('skills.tabs.dataTools'),
          content: <ToolsGroups categories={groupedCategories.dataTools} />,
        },
        {
          id: 'web-tools',
          label: t('skills.tabs.webTools'),
          content: <ToolsGroups categories={groupedCategories.webTools} />,
        },
      ]}
    />
  )
}

export default ToolsSubSection
