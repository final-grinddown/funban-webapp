"use client"
import { BackdropLoading } from "@/components/BackdropLoading"
import { DashboardLayout } from "@/components/DashboardLayout"
import { useWebSocketContext } from "@/context/WebSocketProvider"
import { BoardScreen } from "@/screens/BoardScreen"

export default function Board() {
  const { users } = useWebSocketContext()

  return (
    <DashboardLayout>
      {users.length === 0 ? <BackdropLoading isInDashboard={true} /> : <BoardScreen users={users} />}
    </DashboardLayout>
  )
}
