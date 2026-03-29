import { TbBrandOpenai } from 'react-icons/tb'
import { VscCopilot } from 'react-icons/vsc'

type ToolCardProps = {
  iconSrc: string | null
  iconKey?: 'openai' | 'copilot' | null
  iconAlt: string
  title: string
  description: string
  group?: string
}

function ToolCard({ iconSrc, iconKey, iconAlt, title, description, group }: ToolCardProps) {
  return (
    <div className="tool-card" data-group={group}>
      {iconKey === 'openai' ? (
        <TbBrandOpenai aria-hidden="true" className="tool-card__svg-icon" />
      ) : iconKey === 'copilot' ? (
        <span className="tool-card__svg-shell tool-card__svg-shell--copilot" aria-hidden="true">
          <VscCopilot className="tool-card__svg-icon" />
        </span>
      ) : (
        iconSrc && <img src={iconSrc} alt={iconAlt} className="tool-card__icon box-border" />
      )}
      <span className="tool-tooltip">
        <strong>{title}</strong>
        <br />
        {description}
      </span>
    </div>
  )
}

export default ToolCard
