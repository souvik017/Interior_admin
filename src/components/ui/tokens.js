// Centralized design tokens: the single source of truth for tone colors,
// typography scale, and button variants consumed across the ui/ kit.
// Change a value here and every component using that token updates together.

export const tones = ['primary', 'secondary', 'tertiary', 'success', 'warning', 'danger', 'muted']

export const toneColor = {
  primary: { text: 'text-primary', bg: 'bg-primary', soft: 'bg-primary/10', border: 'border-primary/20', glow: 'shadow-[0_0_8px_rgba(var(--color-primary),0.4)]' },
  secondary: { text: 'text-secondary', bg: 'bg-secondary', soft: 'bg-secondary/10', border: 'border-secondary/20', glow: '' },
  tertiary: { text: 'text-tertiary', bg: 'bg-tertiary', soft: 'bg-tertiary/10', border: 'border-tertiary/20', glow: '' },
  success: { text: 'text-emerald-600', bg: 'bg-emerald-500', soft: 'bg-emerald-500/10', border: 'border-emerald-500/20', glow: 'shadow-[0_0_8px_rgba(16,185,129,0.4)]' },
  warning: { text: 'text-amber-600', bg: 'bg-amber-500', soft: 'bg-amber-500/10', border: 'border-amber-500/20', glow: 'shadow-[0_0_8px_rgba(245,158,11,0.4)]' },
  danger: { text: 'text-rose-600', bg: 'bg-rose-500', soft: 'bg-rose-500/10', border: 'border-rose-500/20', glow: 'shadow-[0_0_8px_rgba(239,68,68,0.4)]' },
  muted: { text: 'text-muted', bg: 'bg-surface-2', soft: 'bg-surface-2', border: 'border-border', glow: '' },
}

export function toneClasses(tone = 'primary', parts = ['soft', 'text', 'border']) {
  const resolved = toneColor[tone] || toneColor.primary
  return parts.map((part) => resolved[part]).filter(Boolean).join(' ')
}

// Typography scale: Display / Heading / Subheading / Body / Caption
export const typography = {
  display: 'text-4xl sm:text-5xl font-extrabold tracking-tight',
  heading: 'text-2xl sm:text-3xl font-extrabold tracking-tight',
  subheading: 'text-lg sm:text-xl font-bold tracking-tight',
  body: 'text-sm font-semibold leading-relaxed',
  caption: 'text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em]',
}

export const buttonVariants = {
  primary:
    'bg-primary text-on-primary shadow-[0_12px_30px_-12px_rgba(var(--color-primary),0.45)] hover:bg-primary-soft hover:shadow-[0_18px_38px_-12px_rgba(var(--color-primary),0.45)] focus-visible:ring-primary',
  secondary:
    'bg-surface-2 text-text hover:bg-surface-3 focus-visible:ring-secondary',
  outline:
    'border border-border/70 bg-surface/80 text-text hover:bg-surface-2 hover:border-primary/25 focus-visible:ring-primary',
  danger:
    'bg-danger text-on-primary shadow-[0_12px_30px_-12px_rgba(186,26,26,0.45)] hover:opacity-95 focus-visible:ring-danger',
  ghost:
    'text-text hover:bg-surface-2 focus-visible:ring-primary',
}

export const buttonSizes = {
  sm: 'px-3.5 py-1.5 text-xs rounded-xl gap-1.5 min-h-[36px]',
  md: 'px-5 py-2.5 text-sm rounded-2xl gap-2 min-h-[44px]',
  lg: 'px-6 py-3.5 text-base rounded-2xl gap-2.5 min-h-[52px]',
}
