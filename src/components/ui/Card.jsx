import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Icon } from './Icon'
import { toneClasses } from './tokens'
import { Ripple } from './Ripple'
import { Area, AreaChart, ResponsiveContainer } from 'recharts'

export function Card({
  children,
  className = '',
  hoverLift = true,
  glass = false,
  onClick,
  ...props
}) {
  const isClickable = typeof onClick === 'function'
  const { addRipple, ripples } = Ripple({ color: 'rgba(0, 0, 0, 0.06)' })

  const baseStyle =
    'relative overflow-hidden rounded-[1.75rem] border border-border/70 bg-surface/90 p-5 shadow-soft transition-all duration-300 sm:p-6'
  const glassStyle =
    'bg-glass/85 border border-white/20 backdrop-blur-xl shadow-[0_18px_60px_rgba(15,23,42,0.08)]'
  const hoverStyle = isClickable || hoverLift
    ? 'hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] hover:border-border/100'
    : ''
  const cursorStyle = isClickable
    ? 'cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40'
    : ''

  const clickableProps = isClickable
    ? {
        role: 'button',
        tabIndex: 0,
        onPointerDown: addRipple,
        onKeyDown: (event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault()
            onClick(event)
          }
        },
      }
    : {}

  return (
    <motion.div
      onClick={onClick}
      {...clickableProps}
      className={`
        ${baseStyle}
        ${glass ? glassStyle : ''}
        ${hoverStyle}
        ${cursorStyle}
        ${className}
      `}
      {...props}
    >
      {children}
      {isClickable && <span className="absolute inset-0 pointer-events-none z-0">{ripples}</span>}
    </motion.div>
  )
}

export function SectionCard({
  title,
  subtitle,
  action,
  children,
  className = '',
  footer,
  ...props
}) {
  return (
    <Card className={`flex flex-col gap-4 sm:gap-5 ${className}`} {...props}>
      {(title || subtitle || action) && (
        <div className="flex flex-wrap items-start justify-between gap-3 border-b border-border/40 pb-4">
          <div className="min-w-0">
            {subtitle && (
              <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-muted sm:text-[11px] sm:tracking-[0.28em]">
                {subtitle}
              </p>
            )}
            {title && (
              <h2 className="mt-1 text-lg font-bold text-text sm:text-xl tracking-tight">
                {title}
              </h2>
            )}
          </div>
          {action && <div className="shrink-0 flex items-center">{action}</div>}
        </div>
      )}
      <div className="flex-1 min-w-0">{children}</div>
      {footer && <div className="border-t border-border/40 pt-4 mt-auto">{footer}</div>}
    </Card>
  )
}

// Sparkline graph for KPI cards
function MiniSparkline({ trend = 'up', data }) {
  const defaultData =
    trend === 'up'
      ? [{ v: 30 }, { v: 45 }, { v: 35 }, { v: 60 }, { v: 55 }, { v: 80 }]
      : trend === 'down'
      ? [{ v: 80 }, { v: 65 }, { v: 75 }, { v: 50 }, { v: 55 }, { v: 30 }]
      : [{ v: 50 }, { v: 52 }, { v: 48 }, { v: 51 }, { v: 49 }, { v: 50 }]

  const chartData = data || defaultData
  const strokeColor =
    trend === 'up'
      ? 'rgb(16, 185, 129)' // success emerald
      : trend === 'down'
      ? 'rgb(239, 68, 68)' // danger rose
      : 'rgb(100, 116, 139)' // neutral slate

  const fillColor =
    trend === 'up'
      ? 'rgba(16, 185, 129, 0.1)'
      : trend === 'down'
      ? 'rgba(239, 68, 68, 0.1)'
      : 'rgba(100, 116, 139, 0.1)'

  return (
    <div className="h-10 w-20 sm:w-24 shrink-0">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 2, right: 2, left: 2, bottom: 2 }}>
          <defs>
            <linearGradient id={`grad-${trend}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={strokeColor} stopOpacity={0.25} />
              <stop offset="100%" stopColor={fillColor} stopOpacity={0.0} />
            </linearGradient>
          </defs>
          <Area
            type="monotone"
            dataKey="v"
            stroke={strokeColor}
            strokeWidth={2}
            fill={`url(#grad-${trend})`}
            dot={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

export function KpiCard({ label, value, delta, note, icon, tone = 'primary', onClick }) {
  const [hovered, setHovered] = useState(false)

  // Parse details
  const isPercent = delta?.includes('%')
  const isNegative = delta?.startsWith('-') || tone === 'danger'
  const isPositive = delta?.startsWith('+') || tone === 'success' || tone === 'primary'

  const trend = isNegative ? 'down' : isPositive && isPercent ? 'up' : 'neutral'

  // Hover analysis preview points
  const breakdown = [
    { name: 'Week 1', val: Math.round(parseFloat(value) * 0.2 || 12) },
    { name: 'Week 2', val: Math.round(parseFloat(value) * 0.23 || 15) },
    { name: 'Week 3', val: Math.round(parseFloat(value) * 0.27 || 18) },
    { name: 'Week 4', val: Math.round(parseFloat(value) * 0.3 || 20) },
  ]

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative"
    >
      <Card className="flex min-w-0 flex-col gap-3" hoverLift onClick={onClick}>
        <div className="flex items-start justify-between gap-2">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted sm:text-xs">
            {label}
          </p>
          {icon && (
            <span className={`flex h-8 w-8 items-center justify-center rounded-xl border ${toneClasses(tone)}`}>
              <Icon name={icon} className="text-lg" />
            </span>
          )}
        </div>

        <div className="flex items-baseline justify-between mt-2 gap-4">
          <h3 className="text-2xl font-bold tracking-tight text-text sm:text-3xl">
            {value}
          </h3>
          <MiniSparkline trend={trend} />
        </div>

        <div className="mt-2 flex items-center justify-between border-t border-border/30 pt-3">
          <div className="flex items-center gap-1">
            {delta && (
              <span
                className={`inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-[10px] font-bold sm:text-[11px] ${
                  trend === 'up'
                    ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/15'
                    : trend === 'down'
                    ? 'bg-rose-500/10 text-rose-600 border border-rose-500/15'
                    : 'bg-surface-3 text-muted'
                }`}
              >
                <Icon name={trend === 'up' ? 'arrow_upward' : trend === 'down' ? 'arrow_downward' : 'remove'} className="text-[12px]" />
                {delta}
              </span>
            )}
            {note && <span className="text-[11px] font-medium text-muted ml-1.5">{note}</span>}
          </div>
          <Icon name="analytics" className="text-muted/40 text-sm hover:text-primary transition-colors cursor-help" />
        </div>
      </Card>

      {/* Hover Analytics Preview Popover */}
      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute left-0 right-0 top-[102%] z-30 pointer-events-none rounded-2xl border border-border bg-surface p-4 shadow-xl backdrop-blur-md"
          >
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted mb-2">
              Weekly Analysis Breakdown
            </p>
            <div className="space-y-1.5">
              {breakdown.map((row) => (
                <div key={row.name} className="flex justify-between text-xs font-semibold text-text">
                  <span className="text-muted">{row.name}</span>
                  <span>
                    {value.toString().startsWith('$') ? `$${row.val}` : row.val}
                    {value.toString().endsWith('%') ? '%' : ''}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
