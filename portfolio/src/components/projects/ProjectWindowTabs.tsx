import { useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { ProjectWindowTabId } from '../../types/project-window'

type ProjectWindowTabsProps = {
  activeTab: ProjectWindowTabId
  onTabChange: (tab: ProjectWindowTabId) => void
  showLinksTab?: boolean
}

function ProjectWindowTabs({
  activeTab,
  onTabChange,
  showLinksTab = true,
}: ProjectWindowTabsProps) {
  const { t, i18n } = useTranslation()
  const [indicatorStyle, setIndicatorStyle] = useState({
    width: 0,
    left: 0,
  })

  const tabsRef = useRef<HTMLDivElement | null>(null)
  const buttonRefs = useRef<Record<string, HTMLButtonElement | null>>({})
  const tabs = useMemo<{ id: ProjectWindowTabId; label: string }[]>(
    () => [
      { id: 'overview', label: t('projects.window.tabs.overview') },
      { id: 'method', label: t('projects.window.tabs.method') },
      { id: 'value', label: t('projects.window.tabs.value') },
      ...(showLinksTab
        ? [{ id: 'links' as ProjectWindowTabId, label: t('projects.window.tabs.links') }]
        : []),
    ],
    [showLinksTab, t]
  )

  useEffect(() => {
    const container = tabsRef.current
    const activeButton = buttonRefs.current[activeTab]

    if (!container || !activeButton) return

    const containerRect = container.getBoundingClientRect()
    const buttonRect = activeButton.getBoundingClientRect()

    setIndicatorStyle({
      width: buttonRect.width,
      left: buttonRect.left - containerRect.left,
    })
  }, [activeTab, i18n.language, tabs])

  useEffect(() => {
    const handleResize = () => {
      const container = tabsRef.current
      const activeButton = buttonRefs.current[activeTab]

      if (!container || !activeButton) return

      const containerRect = container.getBoundingClientRect()
      const buttonRect = activeButton.getBoundingClientRect()

      setIndicatorStyle({
        width: buttonRect.width,
        left: buttonRect.left - containerRect.left,
      })
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [activeTab, i18n.language])

  return (
    <div ref={tabsRef} className="project-window-tabs rounded-lg">
      <span
        className="project-window-tabs-indicator rounded-lg"
        style={{
          width: `${indicatorStyle.width}px`,
          transform: `translateX(${indicatorStyle.left}px)`,
        }}
      />

      {tabs.map((tab) => {
        const isActive = tab.id === activeTab

        return (
          <button
            key={tab.id}
            ref={(element) => {
              buttonRefs.current[tab.id] = element
            }}
            type="button"
            onClick={() => onTabChange(tab.id)}
            className={`project-window-tab ${isActive ? 'is-active' : ''} rounded-lg`}
          >
            {tab.label}
          </button>
        )
      })}
    </div>
  )
}

export default ProjectWindowTabs
