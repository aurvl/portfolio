import { useHomeContent } from '../../hooks/useHomeContent'
import { toolIcons } from '../../lib/toolIcons'

// Tool logos scroll continuously; the list is duplicated so the loop is seamless.
function StackMarquee() {
  const { stackLabel } = useHomeContent().content
  const loop = [...toolIcons, ...toolIcons]

  return (
    <div className="hv-stack">
      <p className="hv-stack__label">{stackLabel}</p>
      <div className="hv-marquee">
        <div className="hv-marquee__track">
          {loop.map((tool, index) => (
            <span key={`${tool.slug}-${index}`} className="hv-tool" aria-hidden={index >= toolIcons.length}>
              <img src={tool.src} alt="" loading="lazy" />
              {tool.label}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

export default StackMarquee
