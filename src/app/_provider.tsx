"use client"
import { ReactNode, useEffect, useState } from "react"
import { CssBaseline, ThemeProvider } from "@mui/material"
import { AppRouterCacheProvider } from "@mui/material-nextjs/v13-appRouter"
import { Theme } from "@mui/system"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { darkTheme, lightTheme } from "@/styles/theme"
import { useThemeStore } from "@/utils/store"
import { TThemeMode } from "@/utils/types"

interface Props {
  children: ReactNode
}

const themeMap: Record<Exclude<TThemeMode, "system">, Theme> = {
  light: lightTheme,
  dark: darkTheme,
}

const getSystemTheme = () => (window.matchMedia("(prefers-color-scheme: dark)").matches ? darkTheme : lightTheme)

export default function Provider({ children }: Props) {
  const queryClient = new QueryClient()
  const { mode, initializeTheme } = useThemeStore()
  const [isMounted, setIsMounted] = useState(false)
  const theme = mode === "system" ? getSystemTheme() : themeMap[mode]

  useEffect(() => {
    initializeTheme()
    setIsMounted(true)
  }, [initializeTheme])

  if (!isMounted) {
    return <div style={{ visibility: "hidden", height: "100vh" }}>{children}</div>
  }

  return (
    <QueryClientProvider client={queryClient}>
      <AppRouterCacheProvider options={{ enableCssLayer: true }}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          {children}
        </ThemeProvider>
        <ReactQueryDevtools buttonPosition="bottom-left" />
      </AppRouterCacheProvider>
    </QueryClientProvider>
  )
}
