import { forwardRef } from 'react'
import { motion } from 'framer-motion'
import { Ripple } from './Ripple'
import { Icon } from './Icon'
import { buttonSizes, buttonVariants } from './tokens'

export const Button = forwardRef(
  (
    {
      children,
      className = '',
      variant = 'primary', // 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost'
      size = 'md', // 'sm' | 'md' | 'lg'
      icon,
      iconRight,
      loading = false,
      disabled = false,
      onClick,
      ...props
    },
    ref,
  ) => {
    const { addRipple, ripples } = Ripple({
      color: variant === 'primary' ? 'rgba(255, 255, 255, 0.25)' : 'rgba(0, 0, 0, 0.08)',
    })

    const handlePointerDown = (event) => {
      if (!disabled && !loading) {
        addRipple(event)
      }
    }

    const handleClick = (event) => {
      if (disabled || loading) {
        event.preventDefault()
        return
      }
      if (onClick) onClick(event)
    }

    const baseStyle =
      'relative overflow-hidden inline-flex items-center justify-center font-semibold tracking-[0.02em] transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background'

    const disabledStyles = 'cursor-not-allowed opacity-50 shadow-none hover:shadow-none'

    return (
      <motion.button
        ref={ref}
        type="button"
        onPointerDown={handlePointerDown}
        onClick={handleClick}
        disabled={disabled || loading}
        whileHover={!disabled && !loading ? { y: -1, scale: 1.01 } : undefined}
        whileTap={!disabled && !loading ? { scale: 0.97 } : undefined}
        className={`
          ${baseStyle}
          ${buttonSizes[size]}
          ${buttonVariants[variant]}
          ${disabled || loading ? disabledStyles : ''}
          ${className}
        `}
        {...props}
      >
        {/* Ripples container */}
        <span className="absolute inset-0 pointer-events-none z-0">{ripples}</span>

        {/* Loading Spinner */}
        {loading && (
          <span className="relative z-10 mr-1.5 flex h-4 w-4 shrink-0 animate-spin items-center justify-center rounded-full border-2 border-current border-t-transparent" />
        )}

        {/* Icon Left */}
        {!loading && icon && (
          <Icon name={icon} className="relative z-10 text-[18px] sm:text-[20px]" />
        )}

        {/* Button Content */}
        <span className="relative z-10 select-none">{children}</span>

        {/* Icon Right */}
        {!loading && iconRight && (
          <Icon name={iconRight} className="relative z-10 text-[18px] sm:text-[20px]" />
        )}
      </motion.button>
    )
  },
)

Button.displayName = 'Button'
