import { createContext, useContext, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Icon } from '../ui/Icon'

const ToastContext = createContext(undefined)

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const addToast = (message, tone = 'success', duration = 3000) => {
    const id = Date.now().toString()
    setToasts((prev) => [...prev, { id, message, tone }])
    setTimeout(() => {
      removeToast(id)
    }, duration)
  }

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }

  return (
    <ToastContext.Provider value={{ showToast: addToast }}>
      {children}
      {/* Toast container floating at top-right corner */}
      <div className="fixed right-4 top-4 z-[100] flex flex-col gap-2 max-w-sm w-[calc(100vw-2rem)]">
        <AnimatePresence>
          {toasts.map((toast) => {
            const toneMap = {
              success: 'bg-emerald-500 text-white border-emerald-600',
              danger: 'bg-rose-500 text-white border-rose-600',
              warning: 'bg-amber-500 text-white border-amber-600',
              info: 'bg-navy text-white border-navy-deep',
            }
            const iconMap = {
              success: 'check_circle',
              danger: 'error',
              warning: 'warning',
              info: 'info',
            }

            return (
              <motion.div
                key={toast.id}
                layout
                initial={{ opacity: 0, y: -20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className={`
                  flex items-center gap-3 rounded-2xl border px-4 py-3 shadow-lg backdrop-blur-md font-semibold text-xs sm:text-sm
                  ${toneMap[toast.tone] || toneMap.success}
                `}
              >
                <Icon name={iconMap[toast.tone] || 'check_circle'} className="text-lg shrink-0" />
                <span className="flex-1 select-none">{toast.message}</span>
                <button
                  onClick={() => removeToast(toast.id)}
                  className="rounded-full p-1 hover:bg-white/10 shrink-0"
                >
                  <Icon name="close" className="text-base" />
                </button>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}
