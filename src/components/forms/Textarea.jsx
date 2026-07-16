import { forwardRef, useId } from 'react'

export const Textarea = forwardRef(
  (
    {
      label,
      error,
      className = '',
      rows = 5,
      required = false,
      ...props
    },
    ref,
  ) => {
    const defaultId = useId()
    const id = props.id || defaultId

    return (
      <div className="space-y-1.5 w-full">
        {label && (
          <label
            htmlFor={id}
            className="block text-[11px] font-bold uppercase tracking-[0.24em] text-muted"
          >
            {label}
            {required && <span className="text-danger ml-1">*</span>}
          </label>
        )}
        <textarea
          id={id}
          ref={ref}
          rows={rows}
          required={required}
          className={`
            w-full rounded-2xl border bg-surface-2/50 px-4 py-3 text-sm font-semibold outline-none transition-all duration-200
            ${
              error
                ? 'border-danger/40 focus:border-danger focus:ring-4 focus:ring-danger/10'
                : 'border-border/80 focus:border-primary/30 focus:ring-4 focus:ring-primary/10'
            }
            focus:bg-surface
            placeholder:text-muted/50 placeholder:font-normal
            disabled:cursor-not-allowed disabled:opacity-50
            ${className}
          `}
          {...props}
        />
        {error && (
          <p className="flex items-center gap-1 text-[11px] font-semibold text-danger">
            {error}
          </p>
        )}
      </div>
    )
  },
)

Textarea.displayName = 'Textarea'
