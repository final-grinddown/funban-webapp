"use client"
import { useSession } from "next-auth/react"
import { BackdropLoading } from "@/components/BackdropLoading"
import { DashboardLayout } from "@/components/DashboardLayout"
import { useWebSocketContext } from "@/context/WebSocketProvider"
import { BoardScreen } from "@/screens/BoardScreen"

export default function Board() {
  const { data } = useSession()
  const { users, notes } = useWebSocketContext()

  if (!data?.user?.email) {
    return <BackdropLoading />
  }

  return (
    <DashboardLayout userEmail={data.user.email}>
      {users.length === 0 && notes.length === 0 ? (
        <BackdropLoading isInDashboard={true} />
      ) : (
        <BoardScreen users={users} notes={notes} />
      )}
    </DashboardLayout>
  )
}
