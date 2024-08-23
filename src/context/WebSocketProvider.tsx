"use client"

import { createContext, ReactNode, useContext, useEffect, useRef, useState } from "react"
import { useSession } from "next-auth/react"
import { IExtendedSession, IUser } from "@/utils/interfaces"

interface WebSocketContextType {
  users: IUser[]
  sendMessage: (message: string) => void
  connectionStatus: string
}

const WS_URL = process.env.NEXT_PUBLIC_WS_URL

const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined)

export function WebSocketProvider({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession()
  const [users, setUsers] = useState<IUser[]>([])
  const [socketUrl, setSocketUrl] = useState<string | null>(null)
  const socketRef = useRef<WebSocket | null>(null)

  useEffect(() => {
    if (status === "authenticated" && session) {
      console.log("Session authenticated, setting WebSocket URL")
      const extendedSession = session as IExtendedSession
      if (extendedSession?.accessToken) {
        setSocketUrl(`${WS_URL}?token=${extendedSession.accessToken}`)
      }
    } else {
      console.log("Session not authenticated or no session found, closing WebSocket if open")
      if (socketRef.current) {
        socketRef.current.close()
        socketRef.current = null
      }
      setSocketUrl(null)
      setUsers([])
    }
  }, [session, status])

  useEffect(() => {
    if (socketUrl) {
      console.log("Initializing WebSocket connection...")
      socketRef.current = new WebSocket(socketUrl)

      socketRef.current.onopen = () => {
        console.log("WebSocket connection opened")
      }

      socketRef.current.onmessage = (event) => {
        console.log("WebSocket message received...")
        const msg = JSON.parse(event.data)

        if (msg.type === "Patch") {
          msg.ops.forEach((op: any) => {
            switch (op.type) {
              case "UserAdded":
                setUsers((prevUsers) => [...prevUsers, op.user])
                break
              case "UserNameUpdated":
                setUsers((prevUsers) =>
                  prevUsers.map((user) => (user.id === op.id ? { ...user, name: op.name } : user)),
                )
                break
              case "UserColorUpdated":
                setUsers((prevUsers) =>
                  prevUsers.map((user) => (user.id === op.id ? { ...user, color: op.color } : user)),
                )
                break
              case "UserRemoved":
                setUsers((prevUsers) => prevUsers.filter((user) => user.id !== op.id))
                break
              default:
                console.error("Unknown operation", op)
                break
            }
          })
        } else if (msg.type === "Users") {
          setUsers(msg.items)
        }
      }

      socketRef.current.onclose = (event) => {
        console.log("WebSocket connection closed", event)
      }

      socketRef.current.onerror = (error) => {
        console.error("WebSocket error", error)
      }

      return () => {
        console.log("Cleaning up WebSocket connection")
        socketRef.current?.close()
      }
    }
  }, [socketUrl])

  function sendMessage(message: string) {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(message)
    } else {
      console.error("WebSocket is not open. Unable to send message.")
    }
  }

  function getConnectionStatus(): string {
    if (!socketRef.current) return "Uninstantiated"
    switch (socketRef.current.readyState) {
      case WebSocket.CONNECTING:
        return "Connecting"
      case WebSocket.OPEN:
        return "Open"
      case WebSocket.CLOSING:
        return "Closing"
      case WebSocket.CLOSED:
        return "Closed"
      default:
        return "Unknown"
    }
  }

  return (
    <WebSocketContext.Provider value={{ users, sendMessage, connectionStatus: getConnectionStatus() }}>
      {children}
    </WebSocketContext.Provider>
  )
}

export function useWebSocketContext() {
  const context = useContext(WebSocketContext)
  if (context === undefined) {
    throw new Error("useWebSocketContext must be used within a WebSocketProvider")
  }
  return context
}
