import { forwardRef, useId } from 'react'
import { Icon } from '../ui/Icon'

export const Select = forwardRef(
  (
    {
      label,
      error,
      children,
      className = '',
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
        <div className="relative">
          <select
            id={id}
            ref={ref}
            required={required}
            className={`
              w-full appearance-none rounded-2xl border pl-4 pr-10 py-3 text-sm font-medium outline-none transition-all duration-200
              ${
                error
                  ? 'border-danger/40 bg-danger/5 focus:border-danger focus:ring-4 focus:ring-danger/10'
                  : 'field-shell focus:border-primary/30 focus:ring-4 focus:ring-primary/10'
              }
              focus:bg-surface
              disabled:cursor-not-allowed disabled:opacity-50
              ${className}
            `}
            {...props}
          >
            {children}
          </select>
          <Icon
            name="expand_more"
            className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-muted"
          />
        </div>
        {error && (
          <p className="flex items-center gap-1 text-[11px] font-semibold text-danger">
            <Icon name="error" className="text-[14px]" />
            {error}
          </p>
        )}
      </div>
    )
  },
)

Select.displayName = 'Select'
