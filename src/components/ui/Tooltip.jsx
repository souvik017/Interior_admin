import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export function Tooltip({ children, content, position = 'right', delay = 200 }) {
  const [active, setActive] = useState(false)
  let timeout

  const showTip = () => {
    timeout = setTimeout(() => {
      setActive(true)
    }, delay)
  }

  const hideTip = () => {
    clearInterval(timeout)
    setActive(false)
  }

  const positionStyles = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  }

  return (
    <div
      className="relative flex items-center"
      onMouseEnter={showTip}
      onMouseLeave={hideTip}
      onFocus={showTip}
      onBlur={hideTip}
    >
      {children}
      <AnimatePresence>
        {active && content && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.12 }}
            role="tooltip"
            className={`absolute z-50 pointer-events-none rounded-xl bg-text px-3 py-1.5 text-xs font-semibold text-surface shadow-md ${positionStyles[position]}`}
          >
            <div className="relative text-center whitespace-nowrap">
              {content}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
