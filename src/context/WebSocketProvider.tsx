"use client"

import React, { createContext, ReactNode, useContext, useEffect, useRef, useState } from "react"
import { useSession } from "next-auth/react"
import { IExtendedSession, IUser } from "@/utils/interfaces"

interface WebSocketContextType {
  users: IUser[]
  notes: any[]
  sendMessage: (message: string) => void
  connectionStatus: string
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined)

export function WebSocketProvider({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession()
  const [notes, setNotes] = useState<any[]>([])
  const [users, setUsers] = useState<IUser[]>([])
  const [socketUrl, setSocketUrl] = useState<string | null>(null)
  const socketRef = useRef<WebSocket | null>(null)

  useEffect(() => {
    if (status === "authenticated" && session) {
      console.log("Session authenticated, setting WebSocket URL")
      const extendedSession = session as IExtendedSession
      if (extendedSession?.accessToken) {
        setSocketUrl(`${process.env.NEXT_PUBLIC_WS_URL}?token=${extendedSession.accessToken}`)
      }
    } else {
      // If session is not authenticated or session doesn't exist, close the WebSocket connection
      console.log("Session not authenticated or no session found, closing WebSocket if open")
      if (socketRef.current) {
        socketRef.current.close()
        socketRef.current = null // Ensure the socket is cleared
      }
      setSocketUrl(null)
      setUsers([])
      setNotes([])
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
              case "NoteAdded":
                // Handle NoteAdded
                break
              case "NoteTextUpdated":
                // Handle NoteTextUpdated
                break
              case "NoteOrderChanged":
                // Handle NoteOrderChanged
                break
              case "NoteRemoved":
                // Handle NoteRemoved
                break
              case "UserAdded":
                setUsers((prevUsers) => [...prevUsers, op.user])
                break
              case "UserNameUpdated":
                // Handle UserNameUpdated
                break
              case "UserColorUpdated":
                // Handle UserColorUpdated
                break
              case "UserRemoved":
                // Handle UserRemoved
                break
              default:
                console.error("Unknown operation", op)
                break
            }
          })
        } else if (msg.type === "Notes") {
          setNotes(msg.items)
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
    <WebSocketContext.Provider value={{ users, notes, sendMessage, connectionStatus: getConnectionStatus() }}>
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
