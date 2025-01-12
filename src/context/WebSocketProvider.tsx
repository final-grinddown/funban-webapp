"use client"
import { createContext, ReactNode, useCallback, useContext, useEffect, useRef, useState } from "react"
import { Alert, Snackbar } from "@mui/material"
import { useSession } from "next-auth/react"
import { clearApp } from "@/app/api/auth/clearApp"
import { IExtendedSession, INote, IUser } from "@/utils/interfaces"

interface WebSocketContextType {
  users: IUser[]
  notes: INote[]
  sendMessage: (message: string) => void
  connectionStatus: string
  isLoading: boolean
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
  const [isLoading, setIsLoading] = useState(false)
  const lastUUIDRef = useRef<string | null>(null)

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
      let textUpdated = false
      let orderUpdated = false

      msg.ops.forEach((op: any) => {
        switch (op.type) {
          case "UserAdded":
            setUsers((prevUsers) => [...prevUsers, op.user])
            setSnackbarMessage("User added successfully!")
            break
          case "UserNameUpdated":
            setUsers((prevUsers) => prevUsers.map((user) => (user.id === op.id ? { ...user, name: op.name } : user)))
            setNotes((prevNotes) =>
              prevNotes.map((note) => (note.owner_id === op.id ? { ...note, name: op.name } : note)),
            )
            setSnackbarMessage("User name updated successfully!")
            break
          case "UserColorUpdated":
            setUsers((prevUsers) => prevUsers.map((user) => (user.id === op.id ? { ...user, color: op.color } : user)))
            setNotes((prevNotes) =>
              prevNotes.map((note) => (note.owner_id === op.id ? { ...note, color: op.color } : note)),
            )
            setSnackbarMessage("User color updated successfully!")
            break
          case "UserRemoved":
            setUsers((prevUsers) => prevUsers.filter((user) => user.id !== op.id))
            setNotes((prevNotes) => prevNotes.filter((note) => note.owner_id !== op.id))
            setSnackbarMessage("User removed successfully!")
            break
          case "NoteTextUpdated":
            textUpdated = true
            setNotes((prevNotes) =>
              prevNotes.map((note) =>
                note.id === op.id ? { ...note, text: op.text, updated: new Date().toISOString() } : note,
              ),
            )
            break
          case "NoteOrderChanged":
            orderUpdated = true
            setNotes((prevNotes) =>
              prevNotes.map((note) =>
                note.id === op.id
                  ? {
                      ...note,
                      state: op.state,
                      predecessor_id: op.predecessor_id,
                      updated: new Date().toISOString(),
                    }
                  : note,
              ),
            )
            break
          case "NoteRemoved":
            setNotes((prevNotes) => prevNotes.filter((note) => note.id !== op.id))
            setSnackbarMessage("Note removed successfully!")
            break
          case "NoteAdded":
            setNotes((prevNotes) => [...prevNotes, op.note])
            setSnackbarMessage("Note added successfully!")
            break
          case "ActionFinished":
            if (op.uuid === lastUUIDRef.current) {
              setSnackbarOpen(true)
              setIsLoading(false)
            }
            break
          default:
            console.error("Unknown operation", op)
            break
        }
      })

      if (textUpdated && orderUpdated) {
        setSnackbarMessage("Note text and status changed successfully!")
      } else if (textUpdated) {
        setSnackbarMessage("Note text updated successfully!")
      } else if (orderUpdated) {
        setSnackbarMessage("Note status changed successfully!")
      }
    },

    [setUsers, setNotes, setSnackbarMessage, setSnackbarOpen],
  )

  const connectWebSocket = useCallback(() => {
    socketRef.current = new WebSocket(socketUrl!)

    socketRef.current.onmessage = (event) => {
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
      setTimeout(() => {
        connectWebSocket() // Attempt to reconnect
      }, 1000)
    }

    socketRef.current.onerror = (error) => {
      clearApp()
    }
  }, [socketUrl, handlePatchMessage])

  function sendMessage(message: string) {
    const uuid = crypto.randomUUID()

    try {
      const parsedMessage = JSON.parse(message)

      if (typeof parsedMessage === "object" && parsedMessage !== null) {
        parsedMessage.uuid = uuid
      }

      const messageWithUUID = JSON.stringify(parsedMessage)

      lastUUIDRef.current = uuid

      if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
        socketRef.current.send(messageWithUUID)
        setIsLoading(true)
      } else {
        console.error("WebSocket is not open. Unable to send message.")
      }
    } catch (error) {
      console.error("Failed to parse the message or append UUID:", error)
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
    <WebSocketContext.Provider
      value={{ users, notes, sendMessage, connectionStatus: getConnectionStatus(), isLoading }}
    >
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
