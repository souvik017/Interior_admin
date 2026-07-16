import { useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Icon } from '../ui/Icon'

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'

// Global stack of active overlays (drawers, dialogs) to manage Escape key closing topmost only
const activeOverlays = []

function registerOverlay(id, onClose) {
  activeOverlays.push({ id, onClose })
}

function unregisterOverlay(id) {
  const index = activeOverlays.findIndex((item) => item.id === id)
  if (index !== -1) {
    activeOverlays.splice(index, 1)
  }
}

function handleEscapeKey(event) {
  if (event.key === 'Escape' && activeOverlays.length > 0) {
    const topmost = activeOverlays[activeOverlays.length - 1]
    if (topmost && typeof topmost.onClose === 'function') {
      topmost.onClose()
    }
  }
}

if (typeof window !== 'undefined') {
  window.addEventListener('keydown', handleEscapeKey)
}

// Moves focus into the panel on open, traps Tab/Shift+Tab within it, and
// restores focus to whatever triggered the dialog on close.
function useFocusTrap(open, panelRef) {
  useEffect(() => {
    if (!open) return undefined

    const previouslyFocused = document.activeElement
    const panel = panelRef.current
    const focusFirst = () => {
      const focusable = panel?.querySelectorAll(FOCUSABLE_SELECTOR)
      if (focusable && focusable.length > 0) focusable[0].focus()
      else panel?.focus()
    }
    focusFirst()

    const handleKeyDown = (event) => {
      if (event.key !== 'Tab' || !panel) return
      const focusable = Array.from(panel.querySelectorAll(FOCUSABLE_SELECTOR))
      if (focusable.length === 0) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      if (previouslyFocused instanceof HTMLElement) previouslyFocused.focus()
    }
  }, [open, panelRef])
}

export function Dialog({
  open,
  onClose,
  title,
  children,
  size = 'md', // 'sm' | 'md' | 'lg' | 'xl'
  backdropBlur = true,
}) {
  const panelRef = useRef(null)
  useFocusTrap(open, panelRef)

  const idRef = useRef(null)
  if (!idRef.current) {
    idRef.current = Math.random().toString(36).substring(2, 9)
  }

  // Register in Escape key registry
  useEffect(() => {
    if (open) {
      registerOverlay(idRef.current, onClose)
    }
    return () => {
      unregisterOverlay(idRef.current)
    }
  }, [open, onClose])

  // Scroll locking
  useEffect(() => {
    if (!open) return undefined

    const originalOverflow = window.getComputedStyle(document.body).overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = originalOverflow
    }
  }, [open])

  const sizeStyles = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  }

  return (
    <AnimatePresence>
      {open && (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center p-4 overflow-y-auto"
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label={typeof title === 'string' ? title : undefined}
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`fixed inset-0 bg-navy/40 dark:bg-black/60 ${
              backdropBlur ? 'backdrop-blur-sm' : ''
            }`}
          />

          {/* Modal Container */}
          <motion.div
            ref={panelRef}
            tabIndex={-1}
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className={`relative z-10 w-full rounded-3xl border border-border bg-surface p-5 shadow-glow outline-none ${sizeStyles[size]} sm:p-6`}
          >
            <div className="flex items-start justify-between gap-4 border-b border-border/40 pb-4 mb-4">
              {title && (
                <h3 className="text-lg font-bold text-text tracking-tight sm:text-xl">
                  {title}
                </h3>
              )}
              <button
                onClick={onClose}
                className="rounded-full p-2 text-muted hover:bg-surface-2 hover:text-text transition-colors ml-auto"
                aria-label="Close dialog"
              >
                <Icon name="close" />
              </button>
            </div>
            <div className="min-w-0">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

export function Drawer({
  open,
  onClose,
  title,
  children,
  position = 'right', // 'left' | 'right'
  backdropBlur = true,
}) {
  const panelRef = useRef(null)
  useFocusTrap(open, panelRef)

  const idRef = useRef(null)
  if (!idRef.current) {
    idRef.current = Math.random().toString(36).substring(2, 9)
  }

  // Register in Escape key registry
  useEffect(() => {
    if (open) {
      registerOverlay(idRef.current, onClose)
    }
    return () => {
      unregisterOverlay(idRef.current)
    }
  }, [open, onClose])

  // Scroll locking
  useEffect(() => {
    if (!open) return undefined

    const originalOverflow = window.getComputedStyle(document.body).overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = originalOverflow
    }
  }, [open])

  const slideVariants = {
    left: {
      initial: { x: '-100%' },
      animate: { x: 0 },
      exit: { x: '-100%' },
    },
    right: {
      initial: { x: '100%' },
      animate: { x: 0 },
      exit: { x: '100%' },
    },
  }

  const drawerPositionStyles = {
    left: 'left-0 inset-y-0 border-r',
    right: 'right-0 inset-y-0 border-l',
  }

  return (
    <AnimatePresence>
      {open && (
        <div
          className="fixed inset-0 z-[60] overflow-hidden"
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label={typeof title === 'string' ? title : undefined}
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`fixed inset-0 bg-navy/40 dark:bg-black/60 ${
              backdropBlur ? 'backdrop-blur-sm' : ''
            }`}
          />

          {/* Drawer Box */}
          <motion.div
            ref={panelRef}
            tabIndex={-1}
            onClick={(e) => e.stopPropagation()}
            variants={slideVariants[position]}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ type: 'tween', duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className={`absolute z-10 flex h-full w-full max-w-sm flex-col bg-surface p-6 shadow-glow border-border outline-none ${drawerPositionStyles[position]}`}
          >
            <div className="flex items-center justify-between border-b border-border/40 pb-4 mb-5">
              {title && (
                <h3 className="text-lg font-bold text-text tracking-tight">
                  {title}
                </h3>
              )}
              <button
                onClick={onClose}
                className="rounded-full p-2 text-muted hover:bg-surface-2 hover:text-text transition"
                aria-label="Close drawer"
              >
                <Icon name="close" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto pr-1 min-w-0 scrollbar-thin">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
