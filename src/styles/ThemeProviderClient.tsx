"use client"
import { ReactNode, useEffect, useState } from "react"
import { CssBaseline, ThemeProvider } from "@mui/material"
import { Theme } from "@mui/system"
import { darkTheme, lightTheme } from "@/styles/theme"
import { useThemeStore } from "@/utils/store"
import { TThemeMode } from "@/utils/types"

const themeMap: Record<Exclude<TThemeMode, "system">, Theme> = {
  light: lightTheme,
  dark: darkTheme,
}

const getSystemTheme = () => (window.matchMedia("(prefers-color-scheme: dark)").matches ? darkTheme : lightTheme)

export const ThemeProviderClient = ({ children }: { children: ReactNode }) => {
  const { mode, initializeTheme } = useThemeStore()
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    initializeTheme()
    setIsMounted(true)
  }, [initializeTheme])

  const theme = mode === "system" ? getSystemTheme() : themeMap[mode]

  if (!isMounted) {
    return <div style={{ visibility: "hidden", height: "100vh" }}>{children}</div>
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  )
}
