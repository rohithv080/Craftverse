import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const THEME_STORAGE_KEY = 'kaithiran-theme'

export const themes = {
  light: 'light',
  sand: 'sand',
  cocoa: 'cocoa',
}

const ThemeContext = createContext({
  theme: themes.light,
  setTheme: () => {},
  cycleTheme: () => {},
})

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(themes.light)

  useEffect(() => {
    const saved = window.localStorage.getItem(THEME_STORAGE_KEY)
    if (saved && Object.values(themes).includes(saved)) setThemeState(saved)
  }, [])

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    window.localStorage.setItem(THEME_STORAGE_KEY, theme)
  }, [theme])

  const setTheme = (next) => {
    if (Object.values(themes).includes(next)) setThemeState(next)
  }

  const cycleTheme = () => {
    const order = [themes.light, themes.sand, themes.cocoa]
    const idx = order.indexOf(theme)
    const next = order[(idx + 1) % order.length]
    setThemeState(next)
  }

  const value = useMemo(() => ({ theme, setTheme, cycleTheme }), [theme])

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  )
}

export function useTheme() {
  return useContext(ThemeContext)
}


