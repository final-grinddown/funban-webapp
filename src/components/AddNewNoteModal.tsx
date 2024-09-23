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
import { createNewNote } from "@/app/api/websocket"
import { useWebSocketContext } from "@/context/WebSocketProvider"
import { IUser } from "@/utils/interfaces"

interface Props {
  users: IUser[]
  isOpen: boolean
  onClose: () => void
}

interface FormInputs {
  text: string
  state: string
  owner: string
}

export function AddNewNoteModal({ users, isOpen, onClose }: Props) {
  const { sendMessage, isLoading } = useWebSocketContext()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isDirty, isValid },
  } = useForm<FormInputs>({
    defaultValues: { text: "", state: "", owner: "" },
    mode: "onChange",
  })

  const onSubmit = (data: FormInputs) => {
    const message = createNewNote(data.owner, data.text, data.state)
    sendMessage(message)
    setIsSubmitting(true)
  }

  useEffect(() => {
    if (isOpen && !isLoading) {
      reset({ text: "", state: "", owner: "" })

      if (isSubmitting) {
        setIsSubmitting(false)
      }
    }
  }, [isLoading, isOpen, isSubmitting, reset])

  useEffect(() => {
    if (isSubmitting && !isLoading) {
      onClose()
    }
  }, [isLoading, isSubmitting, onClose])

  return (
    <Dialog open={isOpen} onClose={onClose} fullWidth>
      <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", pb: 0 }}>
        Add New Note
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
            name="owner"
            control={control}
            rules={{ required: "Owner is required" }}
            render={({ field }) => (
              <FormControl fullWidth sx={{ mt: 2 }}>
                <InputLabel id="owner-label">Note Owner</InputLabel>
                <Select {...field} labelId="owner-label" label="Note Owner" error={!!errors.owner}>
                  {users.map((user) => (
                    <MenuItem key={user.id} value={user.id.toString()}>
                      {user.name}
                    </MenuItem>
                  ))}
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
          disabled={isSubmitting || !isDirty || !isValid}
          sx={{ width: "92px" }}
        >
          {isSubmitting ? <CircularProgress size={20} /> : "Create"}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
