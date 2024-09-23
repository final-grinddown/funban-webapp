import { fetchWithAuth } from "@/app/api/fetchWithAuth"
import { base64EncodeUnicode } from "@/utils/helpers"
import { IHistoryItem, ISnapshotData } from "@/utils/interfaces"

const API_URL = process.env.NEXT_PUBLIC_API_URL

export const fetchHistory = async (accessToken?: string): Promise<IHistoryItem[]> => {
  return fetchWithAuth<IHistoryItem[]>(`${API_URL}/history`, accessToken)
}

export const fetchHistoryItem = async (id: string, accessToken?: string): Promise<IHistoryItem> => {
  return fetchWithAuth<IHistoryItem>(`${API_URL}/history/browser/${id}`, accessToken)
}

export const fetchHistoryItemLast = async (accessToken?: string): Promise<IHistoryItem> => {
  return fetchWithAuth<IHistoryItem>(`${API_URL}/history/browser`, accessToken)
}

export const postSnapshot = async (data: ISnapshotData, accessToken?: string): Promise<void> => {
  const encodedSnapshot = base64EncodeUnicode(JSON.stringify(data.notes))

  return fetchWithAuth<void>(`${API_URL}/history`, accessToken, {
    method: "POST",
    body: {
      label: data.label,
      snapshot: encodedSnapshot,
    },
  })
}
