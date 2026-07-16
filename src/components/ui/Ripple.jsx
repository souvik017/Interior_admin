import { useState, useLayoutEffect } from 'react'

export function Ripple({ color = 'rgba(255, 255, 255, 0.2)', duration = 600 }) {
  const [rippleArray, setRippleArray] = useState([])

  useLayoutEffect(() => {
    let bounce = null
    if (rippleArray.length > 0) {
      bounce = setTimeout(() => {
        setRippleArray([])
      }, duration * 2)
    }
    return () => {
      if (bounce) clearTimeout(bounce)
    }
  }, [rippleArray.length, duration])

  const addRipple = (event) => {
    const rippleContainer = event.currentTarget.getBoundingClientRect()
    const size =
      rippleContainer.width > rippleContainer.height
        ? rippleContainer.width * 2
        : rippleContainer.height * 2
    const x = event.clientX - rippleContainer.left - size / 2
    const y = event.clientY - rippleContainer.top - size / 2
    const newRipple = {
      x,
      y,
      size,
    }

    setRippleArray((prevArray) => [...prevArray, newRipple])
  };

  return {
    addRipple,
    ripples: rippleArray.map((ripple, index) => {
      return (
        <span
          key={'ripple_' + index}
          style={{
            top: ripple.y,
            left: ripple.x,
            width: ripple.size,
            height: ripple.size,
            backgroundColor: color,
            animationDuration: `${duration}ms`,
          }}
          className="absolute rounded-full scale-0 animate-ripple pointer-events-none opacity-75"
        />
      )
    }),
  }
}
