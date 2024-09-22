import { create } from "zustand"
import { getStoredTheme, removeStoredTheme, setStoredTheme } from "@/utils/storage"
import { TThemeMode } from "@/utils/types"

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

interface IFocusState {
  isFocus: boolean
  currentUser: string
  setIsFocus: (focus: boolean) => void
  setCurrentUser: (user: string) => void
}

export const useFocusStateStore = create<IFocusState>((set) => ({
  isFocus: false,
  currentUser: "",
  setIsFocus: (focus) => set({ isFocus: focus }),
  setCurrentUser: (user) => set({ currentUser: user }),
}))
