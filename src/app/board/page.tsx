"use client"
import { useSession } from "next-auth/react"
import { DashboardLayout } from "@/components/DashboardLayout"
import { BoardScreen } from "@/screens/BoardScreen"

export default function Board() {
  return (
    <DashboardLayout>
      <BoardScreen />
    </DashboardLayout>
  )
}
