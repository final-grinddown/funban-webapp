"use client"
import { createContext, ReactNode, useCallback, useContext, useEffect, useRef, useState } from "react"
import { Alert, Snackbar } from "@mui/material"
import { useSession } from "next-auth/react"
import { IExtendedSession, INote, IUser } from "@/utils/interfaces"

interface WebSocketContextType {
  users: IUser[]
  notes: INote[]
  sendMessage: (message: string) => void
  connectionStatus: string
}

const WS_URL = process.env.NEXT_PUBLIC_WS_URL

const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined)

export function WebSocketProvider({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession()
  const [users, setUsers] = useState<IUser[]>([])
  const [notes, setNotes] = useState<INote[]>([])
  const [socketUrl, setSocketUrl] = useState<string | null>(null)
  const socketRef = useRef<WebSocket | null>(null)
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState<string>("")

  useEffect(() => {
    if (status === "authenticated" && session) {
      const extendedSession = session as IExtendedSession
      if (extendedSession?.accessToken) {
        setSocketUrl(`${WS_URL}?token=${extendedSession.accessToken}`)
      }
    } else {
      if (socketRef.current) {
        socketRef.current.close()
        socketRef.current = null
      }
      setSocketUrl(null)
      setUsers([])
      setNotes([])
    }
  }, [session, status])

  const handlePatchMessage = useCallback(
    (msg: any) => {
      msg.ops.forEach((op: any) => {
        switch (op.type) {
          case "UserAdded":
            setUsers((prevUsers) => [...prevUsers, op.user])
            setSnackbarMessage("User added successfully!")
            setSnackbarOpen(true)
            break
          case "UserNameUpdated":
            setUsers((prevUsers) => prevUsers.map((user) => (user.id === op.id ? { ...user, name: op.name } : user)))
            setNotes((prevNotes) =>
              prevNotes.map((note) => (note.owner_id === op.id ? { ...note, name: op.name } : note)),
            )
            setSnackbarMessage("User name updated successfully!")
            setSnackbarOpen(true)
            break
          case "UserColorUpdated":
            setUsers((prevUsers) => prevUsers.map((user) => (user.id === op.id ? { ...user, color: op.color } : user)))
            setNotes((prevNotes) =>
              prevNotes.map((note) => (note.owner_id === op.id ? { ...note, color: op.color } : note)),
            )
            setSnackbarMessage("User color updated successfully!")
            setSnackbarOpen(true)
            break
          case "UserRemoved":
            setUsers((prevUsers) => prevUsers.filter((user) => user.id !== op.id))
            setNotes((prevNotes) => prevNotes.filter((note) => note.owner_id !== op.id))
            setSnackbarMessage("User removed successfully!")
            setSnackbarOpen(true)
            break
          case "NoteTextUpdated":
            setNotes((prevNotes) =>
              prevNotes.map((note) =>
                note.id === op.id ? { ...note, text: op.text, updated: new Date().toISOString() } : note,
              ),
            )
            setSnackbarMessage("Note text updated successfully!")
            setSnackbarOpen(true)
            break
          default:
            console.error("Unknown operation", op)
            break
        }
      })
    },
    [setUsers, setNotes, setSnackbarMessage, setSnackbarOpen],
  )

  const connectWebSocket = useCallback(() => {
    socketRef.current = new WebSocket(socketUrl!)

    socketRef.current.onopen = () => {
      console.log("WebSocket connection opened")
    }

    socketRef.current.onmessage = (event) => {
      console.log("WebSocket message received...", event.data)
      const msg = JSON.parse(event.data)

      if (msg.type === "Patch") {
        handlePatchMessage(msg)
      } else if (msg.type === "Users") {
        setUsers(msg.items)
      } else if (msg.type === "Notes") {
        setNotes(msg.items)
      }
    }

    socketRef.current.onclose = (event) => {
      console.log("WebSocket connection closed", event)

      setTimeout(() => {
        console.log(`Reconnecting WebSocket...`)
        connectWebSocket() // Attempt to reconnect
      }, 1000)
    }

    socketRef.current.onerror = (error) => {
      console.error("WebSocket error", error)
    }
  }, [socketUrl, handlePatchMessage])

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

  function handleSnackbarClose() {
    setSnackbarOpen(false)
  }

  useEffect(() => {
    if (socketUrl) {
      connectWebSocket()
    }
  }, [socketUrl, connectWebSocket])

  return (
    <WebSocketContext.Provider value={{ users, notes, sendMessage, connectionStatus: getConnectionStatus() }}>
      {children}
      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity="success" variant="filled" sx={{ width: "100%" }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
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
