import { createContext, useContext, useEffect, useState } from 'react'
import { applyTheme, defaultThemeId } from './colors'

const ThemeContext = createContext(undefined)

export function ThemeProvider({ children }) {
  const [themeMode, setThemeMode] = useState(() => {
    if (typeof window === 'undefined') return 'system'
    return window.localStorage.getItem('interior-admin-theme-mode') ?? 'system'
  })

  // Track sub-theme (atelier or sandstone for light)
  const [lightSubTheme, setLightSubTheme] = useState(() => {
    if (typeof window === 'undefined') return 'atelier'
    return window.localStorage.getItem('interior-admin-light-subtheme') ?? 'atelier'
  })

  const [activeTheme, setActiveTheme] = useState(defaultThemeId)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

    const handleSystemThemeChange = () => {
      if (themeMode === 'system') {
        const isDark = mediaQuery.matches
        const nextTheme = isDark ? 'noir' : lightSubTheme
        setActiveTheme(nextTheme)
        applyTheme(nextTheme)
      }
    }

    if (themeMode === 'system') {
      handleSystemThemeChange()
    } else if (themeMode === 'dark') {
      setActiveTheme('noir')
      applyTheme('noir')
    } else {
      setActiveTheme(lightSubTheme)
      applyTheme(lightSubTheme)
    }

    mediaQuery.addEventListener('change', handleSystemThemeChange)
    return () => mediaQuery.removeEventListener('change', handleSystemThemeChange)
  }, [themeMode, lightSubTheme])

  const selectThemeMode = (mode) => {
    setThemeMode(mode)
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('interior-admin-theme-mode', mode)
    }
  }

  const selectLightSubTheme = (subTheme) => {
    setLightSubTheme(subTheme)
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('interior-admin-light-subtheme', subTheme)
    }
  }

  return (
    <ThemeContext.Provider
      value={{
        themeMode,
        lightSubTheme,
        activeTheme,
        setThemeMode: selectThemeMode,
        setLightSubTheme: selectLightSubTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
