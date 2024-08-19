import { useCallback, useEffect, useRef, useState } from "react"
import { useSession } from "next-auth/react"
import { IExtendedSession } from "@/utils/interfaces"

const MAX_RETRIES = 5
const RETRY_DELAY = 5000

export const useWebSocket = () => {
  const { data: session, status } = useSession()
  const [ws, setWs] = useState<WebSocket | null>(null)
  const [heartbeatMessage, setHeartbeatMessage] = useState<string | null>(null)
  const hasConnectedRef = useRef(false)
  const retryCountRef = useRef(0)

  const connectWebSocket = useCallback((url: string) => {
    const websocketClient = new WebSocket(url)

    websocketClient.onopen = () => {
      console.log("Connected to the WebSocket server")
      setWs(websocketClient)
      hasConnectedRef.current = true
      retryCountRef.current = 0
    }

    websocketClient.onclose = (event) => {
      console.log("Disconnected from the WebSocket server", event)
      setWs(null)
      hasConnectedRef.current = false

      if (retryCountRef.current < MAX_RETRIES) {
        retryCountRef.current += 1
        setTimeout(() => {
          console.log(`Reconnecting attempt ${retryCountRef.current}...`)
          connectWebSocket(url)
        }, RETRY_DELAY)
      }
    }

    websocketClient.onmessage = (event) => {
      const data = JSON.parse(event.data)
      console.log("Received message from server:", data)

      if (data.type === "heartbeat") {
        setHeartbeatMessage(data.message)
      }
    }

    websocketClient.onerror = (error) => {
      console.error("WebSocket error observed:", error)
    }

    return websocketClient
  }, [])

  useEffect(() => {
    const serverUrl = process.env.NEXT_PUBLIC_WS_URL

    if (!serverUrl) {
      console.error("WebSocket server URL is not defined")
      return
    }

    if (status === "authenticated" && session && !hasConnectedRef.current) {
      const extendedSession = session as IExtendedSession

      if (!extendedSession?.accessToken) {
        console.error("Access token is not available in the session")
        return
      }

      console.log("Attempting to connect to WebSocket server...")
      const websocketUrl = `${serverUrl}?token=${extendedSession.accessToken}`
      connectWebSocket(websocketUrl)
    }
  }, [session, status, connectWebSocket])

  return { ws, heartbeatMessage }
}
