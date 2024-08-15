import { create } from "zustand"
import { TThemeMode } from "@/utils/types"
import { getStoredTheme, removeStoredTheme, setStoredTheme } from "@/utils/storage"

interface IThemeState {
  mode: TThemeMode
  setMode: (mode: TThemeMode) => void
  initializeTheme: () => void
}

export const useThemeStore = create<IThemeState>((set) => ({
  mode: "light",
  setMode: (mode) =>
    set(() => {
      if (mode === "system") {
        removeStoredTheme()
      } else {
        setStoredTheme(mode)
      }

      return { mode }
    }),
  initializeTheme: () => {
    const storedTheme = getStoredTheme()
    const prefersDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches
    const mode: TThemeMode | "system" = storedTheme || (prefersDarkMode ? "dark" : "light")
    set({ mode: storedTheme ? storedTheme : "system" })
    document.documentElement.style.setProperty(
      "color-scheme",
      mode === "system" ? (prefersDarkMode ? "dark" : "light") : mode,
    )
  },
}))
