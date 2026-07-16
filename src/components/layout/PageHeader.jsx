import { Breadcrumbs } from '../navigation/Breadcrumbs'

export function PageHeader({ eyebrow, title, description, actions, crumbs = [] }) {
  return (
    <div className="mb-8 rounded-[2rem] border border-border/70 bg-surface/80 p-5 shadow-soft backdrop-blur-xl sm:p-7">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between select-none">
        <div className="min-w-0">
          <Breadcrumbs crumbs={crumbs} />
          {eyebrow && (
            <p className="mt-2 text-[10px] font-bold uppercase tracking-[0.24em] text-primary">
              {eyebrow}
            </p>
          )}
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-text sm:text-4xl">
            {title}
          </h1>
          {description && (
            <p className="mt-2 max-w-3xl text-sm font-semibold leading-relaxed text-muted">
              {description}
            </p>
          )}
        </div>
        {actions && (
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            {actions}
          </div>
        )}
      </div>
    </div>
  )
}
