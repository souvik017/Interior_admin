import { motion } from 'framer-motion'
import { toneColor } from './tokens'

export function ProgressBar({ value, tone = 'primary' }) {
  const resolved = toneColor[tone] || toneColor.primary

  return (
    <div
      role="progressbar"
      aria-valuenow={Math.min(100, Math.max(0, value))}
      aria-valuemin={0}
      aria-valuemax={100}
      className="h-2 w-full overflow-hidden rounded-full bg-surface-3/60 border border-border/10 select-none"
    >
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${Math.min(100, value)}%` }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className={`h-full rounded-full ${resolved.bg} ${resolved.glow}`}
      />
    </div>
  )
}
