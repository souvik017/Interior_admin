import { forwardRef, useId } from 'react'
import { Icon } from '../ui/Icon'

export const Input = forwardRef(
  (
    {
      label,
      error,
      icon,
      className = '',
      type = 'text',
      required = false,
      ...props
    },
    ref,
  ) => {
    const defaultId = useId()
    const id = props.id || defaultId

    return (
      <div className="w-full space-y-1.5">
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
          {icon && (
            <Icon
              name={icon}
              className={`absolute left-3.5 top-1/2 -translate-y-1/2 text-muted transition-colors ${
                error ? 'text-danger/70' : ''
              }`}
            />
          )}
          <input
            id={id}
            ref={ref}
            type={type}
            required={required}
            className={`
              w-full rounded-2xl border py-3 text-sm font-medium outline-none transition-all duration-200
              ${icon ? 'pl-11' : 'pl-4'}
              pr-4
              ${
                error
                  ? 'border-danger/40 bg-danger/5 focus:border-danger focus:ring-4 focus:ring-danger/10'
                  : 'field-shell focus:border-primary/30 focus:ring-4 focus:ring-primary/10'
              }
              focus:bg-surface
              placeholder:text-muted/50
              disabled:cursor-not-allowed disabled:opacity-50
              ${className}
            `}
            {...props}
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

Input.displayName = 'Input'
