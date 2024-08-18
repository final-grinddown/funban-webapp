"use client"
import { redirect } from "next/navigation"
import { useEffect } from "react"
import { Backdrop, CircularProgress } from "@mui/material"
import { useRouter } from "next/navigation"
import { ERoutes } from "@/utils/enums"

export default function Landing() {
  const router = useRouter()

  useEffect(() => {
    router.replace(ERoutes.Board)
  }, [router])

  return (
    <Backdrop sx={{ color: "#fff", zIndex: 1000 }} open={true}>
      <CircularProgress color="primary" />
    </Backdrop>
  )
}
