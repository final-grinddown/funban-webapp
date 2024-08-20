"use client"
import { BackdropLoading } from "@/components/BackdropLoading"
import { DashboardLayout } from "@/components/DashboardLayout"
import { useWebSocketContext } from "@/context/WebSocketProvider"
import { SettingsScreen } from "@/screens/SettingsScreen"

export default function Settings() {
  const { users } = useWebSocketContext()

  return (
    <DashboardLayout>
      {users.length === 0 ? <BackdropLoading isInDashboard={true} /> : <SettingsScreen users={users} />}
    </DashboardLayout>
  )
}
