import { useEffect, useState } from "react"
import CloseIcon from "@mui/icons-material/Close"
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material"
import { Controller, useForm } from "react-hook-form"
import { createUpdateNote, createUpdateNoteReorder, createUpdateNoteText } from "@/app/api/websocket"
import { useWebSocketContext } from "@/context/WebSocketProvider"
import { INote } from "@/utils/interfaces"

interface Props {
  isOpen: boolean
  noteId: INote["id"]
  noteState: INote["state"]
  noteText: INote["text"]
  onClose: () => void
}

interface FormInputs {
  text: string
  state: string
}

export function EditNoteModal({ isOpen, noteId, noteState, noteText, onClose }: Props) {
  const { sendMessage, isLoading } = useWebSocketContext()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<FormInputs>({
    defaultValues: { text: noteText, state: noteState },
    mode: "onChange",
  })

  const onSubmit = (data: FormInputs) => {
    const hasTextChanged = data.text !== noteText
    const hasStateChanged = data.state !== noteState
    setIsSubmitting(true)

    if (hasTextChanged && hasStateChanged) {
      const combinedMessage = createUpdateNote(noteId.toString(), data.text, data.state)
      sendMessage(combinedMessage)
    } else if (hasTextChanged) {
      const message = createUpdateNoteText(noteId.toString(), data.text)
      sendMessage(message)
    } else if (hasStateChanged) {
      const message = createUpdateNoteReorder(noteId.toString(), data.state)
      sendMessage(message)
    }
  }

  useEffect(() => {
    if (isOpen && !isLoading) {
      reset({ text: noteText, state: noteState })

      if (isSubmitting) {
        setIsSubmitting(false)
      }
    }
  }, [isLoading, isOpen, isSubmitting, noteState, noteText, reset])

  useEffect(() => {
    if (isSubmitting && !isLoading) {
      onClose()
    }
  }, [isLoading, isSubmitting, onClose])

  return (
    <Dialog open={isOpen} onClose={onClose} fullWidth>
      <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", pb: 0 }}>
        Edit Note
        <IconButton edge="end" color="inherit" onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Controller
            name="state"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth sx={{ mt: 2 }}>
                <InputLabel id="state-label">State</InputLabel>
                <Select {...field} labelId="state-label" label="State">
                  <MenuItem value="notes">Notes</MenuItem>
                  <MenuItem value="todo">To Do</MenuItem>
                  <MenuItem value="in_progress">In Progress</MenuItem>
                  <MenuItem value="done">Done</MenuItem>
                </Select>
              </FormControl>
            )}
          />
          <Controller
            name="text"
            control={control}
            rules={{ required: "Text is required" }}
            render={({ field }) => (
              <TextField
                {...field}
                label="Note Text"
                multiline
                minRows={4}
                variant="outlined"
                fullWidth={true}
                sx={{ my: 2 }}
                error={!!errors.text}
                helperText={errors.text ? errors.text.message : ""}
              />
            )}
          />
        </form>
      </DialogContent>
      <DialogActions sx={{ px: 3, alignItems: "stretch" }}>
        <Button onClick={onClose} color="secondary" variant="contained">
          Cancel
        </Button>
        <Button
          onClick={handleSubmit(onSubmit)}
          color="primary"
          variant="contained"
          disabled={isSubmitting || !isDirty}
          sx={{ width: "72px" }}
        >
          {isSubmitting ? <CircularProgress size={20} /> : "Save"}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
