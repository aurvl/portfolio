import { useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'

type SegmentedTabItem = {
  id: string
  label: string
  content: ReactNode
}

type SegmentedTabsProps = {
  tabs: SegmentedTabItem[]
  defaultTabId?: string
}

function SegmentedTabs({ tabs, defaultTabId }: SegmentedTabsProps) {
  const { t } = useTranslation()
  const initialTabId = defaultTabId ?? tabs[0]?.id ?? ''
  const [activeTabId, setActiveTabId] = useState(initialTabId)
  const [indicatorStyle, setIndicatorStyle] = useState({
    width: 0,
    height: 0,
    left: 0,
    top: 0,
    opacity: 0,
  })

  const containerRef = useRef<HTMLDivElement | null>(null)
  const buttonRefs = useRef<Record<string, HTMLButtonElement | null>>({})

  const activeTab = tabs.find((tab) => tab.id === activeTabId)

  useEffect(() => {
    const container = containerRef.current
    const activeButton = buttonRefs.current[activeTabId]

    if (!container || !activeButton) return

    const containerRect = container.getBoundingClientRect()
    const buttonRect = activeButton.getBoundingClientRect()

    setIndicatorStyle({
      width: buttonRect.width,
      height: buttonRect.height,
      left: buttonRect.left - containerRect.left,
      top: buttonRect.top - containerRect.top,
      opacity: 1,
    })
  }, [activeTabId, tabs])

  useEffect(() => {
    const handleResize = () => {
      const container = containerRef.current
      const activeButton = buttonRefs.current[activeTabId]

      if (!container || !activeButton) return

      const containerRect = container.getBoundingClientRect()
      const buttonRect = activeButton.getBoundingClientRect()

      setIndicatorStyle({
        width: buttonRect.width,
        height: buttonRect.height,
        left: buttonRect.left - containerRect.left,
        top: buttonRect.top - containerRect.top,
        opacity: 1,
      })
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [activeTabId])

  const handleKeyDown = (currentIndex: number, event: React.KeyboardEvent<HTMLButtonElement>) => {
    const isLeft = event.key === 'ArrowLeft' || event.key === 'ArrowUp'
    const isRight = event.key === 'ArrowRight' || event.key === 'ArrowDown'
    const isActivate = event.key === 'Enter' || event.key === ' '

    if (!isLeft && !isRight && !isActivate) return

    event.preventDefault()

    let nextIndex = currentIndex

    if (isLeft) {
      nextIndex = (currentIndex - 1 + tabs.length) % tabs.length
    }

    if (isRight) {
      nextIndex = (currentIndex + 1) % tabs.length
    }

    const nextTab = tabs[nextIndex]
    if (!nextTab) return

    setActiveTabId(nextTab.id)
    buttonRefs.current[nextTab.id]?.focus()
  }

  return (
    <div className="seg-tabs">
      <div
        ref={containerRef}
        className="seg-tabs__controls"
        role="tablist"
        aria-label={t('a11y.segmentedTabs')}
      >
        <span
          className="seg-tabs__indicator"
          aria-hidden="true"
          style={{
            width: `${indicatorStyle.width}px`,
            height: `${indicatorStyle.height}px`,
            transform: `translate(${indicatorStyle.left}px, ${indicatorStyle.top}px)`,
            opacity: indicatorStyle.opacity,
          }}
        />

        {tabs.map((tab, index) => {
          const isActive = tab.id === activeTabId

          return (
            <button
              key={tab.id}
              ref={(element) => {
                buttonRefs.current[tab.id] = element
              }}
              type="button"
              role="tab"
              aria-selected={isActive}
              className={`seg-tabs__button ${isActive ? 'is-active' : ''}`}
              onClick={() => setActiveTabId(tab.id)}
              onKeyDown={(event) => handleKeyDown(index, event)}
            >
              {tab.label}
            </button>
          )
        })}
      </div>

      <div className="seg-tabs__panel" role="tabpanel">
        {activeTab?.content}
      </div>
    </div>
  )
}

export default SegmentedTabs
