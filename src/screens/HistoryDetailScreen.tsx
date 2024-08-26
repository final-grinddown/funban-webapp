"use client"
import { useMemo } from "react"
import { Alert, AlertTitle, Box, Typography } from "@mui/material"
import { useQuery } from "@tanstack/react-query"
import { useSession } from "next-auth/react"
import { fetchWithAuth } from "@/app/api/fetchWrapper"
import { BackdropLoading } from "@/components/BackdropLoading"
import { Board } from "@/components/Board"
import { normalizeNotes } from "@/utils/helpers"
import { IExtendedSession, IHistoryItem } from "@/utils/interfaces"

const API_URL = process.env.NEXT_PUBLIC_API_URL

const fetchHistoryItem = async (id: string, accessToken?: string): Promise<IHistoryItem> => {
  return fetchWithAuth<IHistoryItem>(`${API_URL}/history/${id}`, accessToken)
}

export function HistoryDetailScreen({ id }: { id: string }) {
  const { data: session } = useSession() as { data: IExtendedSession }

  const { data, isLoading, error } = useQuery<IHistoryItem>({
    queryKey: ["historyItem", id],
    queryFn: () => fetchHistoryItem(id, session?.accessToken),
    enabled: !!session?.accessToken,
  })

  const notes = useMemo(() => {
    if (!data?.snapshot) return []

    const parsedSnapshot = JSON.parse(data.snapshot)

    return normalizeNotes(parsedSnapshot)
  }, [data?.snapshot])

  if (isLoading) {
    return <BackdropLoading isInDashboard={true} />
  }

  if (error instanceof Error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        <AlertTitle>Error</AlertTitle>
        {error.message}
      </Alert>
    )
  }

  return (
    <Box>
      <Typography variant="h1" component="h1">
        History Detail for ID: {id}
      </Typography>
      <Board notes={notes} isEditable={false} />
    </Box>
  )
}
