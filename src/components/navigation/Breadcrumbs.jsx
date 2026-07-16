import { motion } from 'framer-motion'
import { Icon } from '../ui/Icon'

export function Breadcrumbs({ crumbs = [] }) {
  if (crumbs.length === 0) return null

  return (
    <motion.nav
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="mb-3 flex flex-wrap items-center gap-2 text-xs font-bold uppercase tracking-[0.24em] text-muted select-none"
    >
      {crumbs.map((crumb, index) => {
        const isLast = index === crumbs.length - 1
        return (
          <div key={crumb} className="flex items-center">
            <span
              className={
                isLast
                  ? 'text-primary'
                  : 'text-muted transition-colors duration-150 hover:text-text'
              }
            >
              {crumb}
            </span>
            {!isLast && (
              <Icon name="chevron_right" className="mx-1.5 text-[14px] text-muted/50" />
            )}
          </div>
        )
      })}
    </motion.nav>
  )
}
