import { useId } from 'react'
import { motion } from 'framer-motion'
import { Icon } from '../ui/Icon'

export function Tabs({ tabs = [], activeTab, onChange, className = '', variant = 'capsule' }) {
  const instanceId = useId()

  return (
    <div
      className={`inline-flex rounded-full p-1 select-none ${
        variant === 'capsule' ? 'border border-border bg-surface shadow-sm' : ''
      } ${className}`}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            className={`
              relative inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-bold transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40
              ${
                isActive
                  ? 'text-on-primary'
                  : variant === 'capsule'
                    ? 'text-muted hover:text-text'
                    : 'text-muted hover:text-text hover:bg-surface-2/60'
              }
            `}
          >
            {isActive && variant === 'capsule' && (
              <motion.span
                layoutId={`tabs-active-${instanceId}`}
                transition={{ type: 'spring', duration: 0.5, bounce: 0.2 }}
                className="absolute inset-0 rounded-full bg-primary"
              />
            )}
            {isActive && variant !== 'capsule' && (
              <motion.span
                layoutId={`tabs-active-underline-${instanceId}`}
                transition={{ type: 'spring', duration: 0.5, bounce: 0.2 }}
                className="absolute inset-0 rounded-full bg-primary/10"
              />
            )}
            {tab.icon && <Icon name={tab.icon} className="relative z-10 text-[16px]" />}
            <span className="relative z-10">{tab.label}</span>
          </button>
        )
      })}
    </div>
  )
}
