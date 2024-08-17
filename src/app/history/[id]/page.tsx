import { DashboardLayout } from "@/components/DashboardLayout"

export default function HistoryItem({ params }: { params: { id: string } }) {
  return (
    <DashboardLayout>
      <div>TODO: HISTORY ITEM {params.id}</div>
    </DashboardLayout>
  )
}
