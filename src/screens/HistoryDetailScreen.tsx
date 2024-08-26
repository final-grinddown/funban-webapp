"use client"
import { useMemo } from "react"
import { Alert, AlertTitle, Box, Typography } from "@mui/material"
import { useQuery } from "@tanstack/react-query"
import { signOut, useSession } from "next-auth/react"
import { BackdropLoading } from "@/components/BackdropLoading"
import { Board } from "@/components/Board"
import { normalizeNotes } from "@/utils/helpers"
import { IExtendedSession, IHistoryItem } from "@/utils/interfaces"
import { removeStoredUserEmail } from "@/utils/storage"

const API_URL = process.env.NEXT_PUBLIC_API_URL

const fetchHistoryItem = async (id: string, accessToken?: string): Promise<IHistoryItem> => {
  if (!accessToken) {
    throw new Error("No access token available")
  }

  const response = await fetch(`${API_URL}/history/${id}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })

  if (response.status === 401) {
    signOut()
    removeStoredUserEmail()
  } else if (response.status === 403) {
    throw new Error("Forbidden: You do not have access to this resource.")
  } else if (response.status === 404) {
    throw new Error("Not Found: The requested resource could not be found.")
  } else if (!response.ok) {
    throw new Error("An unexpected error occurred. Please try again later.")
  }

  return response.json()
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
