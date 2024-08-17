import { ReactNode } from "react"
import { AppRouterCacheProvider } from "@mui/material-nextjs/v13-appRouter"
import type { Metadata } from "next"
import Provider from "@/app/_provider"

export const metadata: Metadata = {
  title: "Funban",
  description: "Kanban board status tool",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode
}>) {
  return (
    <html lang="en">
      <body>
        <AppRouterCacheProvider options={{ enableCssLayer: true }}>
          <Provider>{children}</Provider>
        </AppRouterCacheProvider>
      </body>
    </html>
  )
}
