import { forwardRef, useId, useState } from 'react'
import { Icon } from '../ui/Icon'

export const Checkbox = forwardRef(
  (
    {
      label,
      description,
      className = '',
      checked,
      defaultChecked,
      onChange,
      ...props
    },
    ref,
  ) => {
    const defaultId = useId()
    const id = props.id || defaultId
    const isControlled = checked !== undefined
    const [internalChecked, setInternalChecked] = useState(defaultChecked ?? false)
    const isChecked = isControlled ? checked : internalChecked

    const handleChange = (event) => {
      if (!isControlled) setInternalChecked(event.target.checked)
      onChange?.(event)
    }

    return (
      <div className="relative flex items-start gap-3 select-none">
        <div className="flex h-5 items-center">
          <label
            htmlFor={id}
            className={`
              relative flex h-4.5 w-4.5 shrink-0 cursor-pointer items-center justify-center rounded-md border transition-all duration-150
              ${
                isChecked
                  ? 'border-primary bg-primary text-on-primary'
                  : 'border-border bg-surface hover:border-primary/50'
              }
              ${className}
            `}
          >
            <input
              id={id}
              ref={ref}
              type="checkbox"
              checked={isControlled ? checked : undefined}
              defaultChecked={isControlled ? undefined : defaultChecked}
              onChange={handleChange}
              className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
              {...props}
            />
            <Icon
              name="check"
              filled
              className={`text-[13px] leading-none transition-all duration-150 ${
                isChecked ? 'scale-100 opacity-100' : 'scale-50 opacity-0'
              }`}
            />
          </label>
        </div>
        {(label || description) && (
          <div className="text-xs sm:text-sm leading-6">
            {label && (
              <label htmlFor={id} className="font-semibold text-text cursor-pointer">
                {label}
              </label>
            )}
            {description && (
              <p className="text-[11px] sm:text-xs text-muted font-medium mt-0.5">{description}</p>
            )}
          </div>
        )}
      </div>
    )
  },
)

Checkbox.displayName = 'Checkbox'
