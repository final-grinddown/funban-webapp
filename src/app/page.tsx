// src/app/page.tsx
import { redirect } from "next/navigation"
import { ERoutes } from "@/utils/enums"

// TODO: Implement authentication
const isAuthenticated = true

export default function Landing() {
  if (isAuthenticated) {
    redirect(ERoutes.Board)
  } else {
    redirect(ERoutes.SignIn)
  }
}
