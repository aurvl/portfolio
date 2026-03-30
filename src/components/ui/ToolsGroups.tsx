import { useTranslation } from 'react-i18next'
import { getAppLanguage } from '../../lib/utils'
import type { SkillCategory } from '../../types/skill'
import ToolCard from './ToolBox'

type ToolsGroupProps = {
  categories: SkillCategory[]
}

function ToolsGroups({ categories }: ToolsGroupProps) {
  const { i18n } = useTranslation()
  const language = getAppLanguage(i18n.language)

  return (
    <div className="flex w-full flex-col gap-6">
      {categories.map((category) => (
        <section key={category.id} className="flex flex-col gap-3">
          <div className="px-1">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--text2-col)]">
              {category.label[language]}
            </p>
            <p className="mt-1 text-sm text-[var(--text2-col)]">
              {category.description[language]}
            </p>
          </div>

          <div className="tools-grid justify-start">
            {category.items.map((tool) => (
              <ToolCard
                key={tool.id}
                iconSrc={tool.icon.src}
                iconKey={tool.icon.key}
                iconAlt={tool.icon.alt[language]}
                title={tool.content.label[language]}
                description={tool.content.description[language]}
                group={category.id}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}

export default ToolsGroups
