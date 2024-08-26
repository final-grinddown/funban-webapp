import { fetchWithAuth } from "@/app/api/fetchWrapper"
import { IHistoryItem } from "@/utils/interfaces"

const API_URL = process.env.NEXT_PUBLIC_API_URL

export const fetchHistory = async (accessToken?: string): Promise<IHistoryItem[]> => {
  return fetchWithAuth<IHistoryItem[]>(`${API_URL}/history`, accessToken)
}

export const fetchHistoryItem = async (id: string, accessToken?: string): Promise<IHistoryItem> => {
  return fetchWithAuth<IHistoryItem>(`${API_URL}/history/${id}`, accessToken)
}
