import { useEffect, useState } from "react"
import CloseIcon from "@mui/icons-material/Close"
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
} from "@mui/material"
import { createDeleteNote } from "@/app/api/websocket"
import { useWebSocketContext } from "@/context/WebSocketProvider"
import { INote } from "@/utils/interfaces"

interface Props {
  isOpen: boolean
  noteId: INote["id"]
  onClose: () => void
}

export function DeleteNoteModal({ isOpen, noteId, onClose }: Props) {
  const { sendMessage, isLoading } = useWebSocketContext()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleDelete = () => {
    const message = createDeleteNote(noteId.toString())
    sendMessage(message)
    setIsSubmitting(true)
  }

  useEffect(() => {
    if (isSubmitting && !isLoading) {
      // onClose()
    }
  }, [isLoading, isSubmitting, onClose])

  return (
    <Dialog open={isOpen} onClose={onClose} fullWidth>
      <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", pb: 0 }}>
        Delete Note
        <IconButton edge="end" color="inherit" onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Typography variant="body1" color="textPrimary">
          Are you sure you want to delete this note?
        </Typography>
      </DialogContent>
      <DialogActions sx={{ px: 3, alignItems: "stretch" }}>
        <Button onClick={onClose} color="secondary" variant="contained">
          Cancel
        </Button>
        <Button onClick={handleDelete} color="error" variant="contained" disabled={isSubmitting} sx={{ width: "90px" }}>
          {isSubmitting ? <CircularProgress size={20} /> : "Delete"}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
