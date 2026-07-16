import { Icon } from './Icon'

export function EmptyState({ icon = 'inbox', title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-border/80 bg-surface/40 p-8 text-center backdrop-blur-sm">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-surface-2 text-muted/65 shadow-inner">
        <Icon name={icon} className="text-2xl" />
      </div>
      <h3 className="mt-4 text-base font-bold text-text tracking-tight">{title}</h3>
      <p className="mt-1.5 max-w-xs text-xs text-muted leading-relaxed">{description}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}
