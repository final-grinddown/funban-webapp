"use client"
import { useSession } from "next-auth/react"
import { BackdropLoading } from "@/components/BackdropLoading"
import { DashboardLayout } from "@/components/DashboardLayout"

export default function HistoryItem({ params }: { params: { id: string } }) {
  const { data } = useSession()

  if (!data?.user?.email) {
    return <BackdropLoading />
  }

  return (
    <DashboardLayout userEmail={data.user.email}>
      <div>TODO: HISTORY ITEM {params.id}</div>
    </DashboardLayout>
  )
}
