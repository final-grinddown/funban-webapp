import { TThemeMode } from "@/utils/types"
import { isThemeMode } from "./helpers"

const THEME_KEY = "theme"

export const getStoredTheme = (): TThemeMode | null => {
  const storedTheme = window.localStorage.getItem(THEME_KEY)

  return isThemeMode(storedTheme) ? storedTheme : null
}

export const setStoredTheme = (mode: TThemeMode): void => {
  window.localStorage.setItem(THEME_KEY, mode)
  document.documentElement.style.setProperty("color-scheme", mode)
}

export const removeStoredTheme = (): void => {
  window.localStorage.removeItem(THEME_KEY)
  const prefersDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches
  const systemMode = prefersDarkMode ? "dark" : "light"
  document.documentElement.style.setProperty("color-scheme", systemMode)
}
