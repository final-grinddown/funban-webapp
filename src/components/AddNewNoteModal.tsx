import { useEffect, useRef, useState } from "react"
import CloseIcon from "@mui/icons-material/Close"
import {
  Button,
  Checkbox,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material"
import { Controller, useForm } from "react-hook-form"
import { createNewNote } from "@/app/api/websocket"
import { useWebSocketContext } from "@/context/WebSocketProvider"
import { handleKeyDownSubmit } from "@/utils/helpers"
import { IUser } from "@/utils/interfaces"

interface Props {
  users: IUser[]
  isOpen: boolean
  onClose: () => void
  defaultValues?: {
    state: string
    ownerId: string
  }
}

interface FormInputs {
  text: string
  state: string
  owner: string
  saveAndCreateNext: boolean
}

export function AddNewNoteModal({ users, isOpen, onClose, defaultValues }: Props) {
  const { sendMessage, isLoading } = useWebSocketContext()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const textAreaRef = useRef<HTMLInputElement>(null)

  const {
    control,
    handleSubmit,
    reset,
    setFocus,
    watch,
    formState: { errors, isDirty, isValid },
  } = useForm<FormInputs>({
    defaultValues: {
      text: "",
      state: "",
      owner: "",
      saveAndCreateNext: false,
    },
    mode: "onChange",
  })

  const isSaveAndCreateNext = watch("saveAndCreateNext")

  const onSubmit = (data: FormInputs) => {
    const message = createNewNote(data.owner, data.text, data.state)
    sendMessage(message)
    setIsSubmitting(true)

    if (data.saveAndCreateNext) {
      reset({ text: "", state: data.state, owner: data.owner, saveAndCreateNext: data.saveAndCreateNext })

      setTimeout(() => {
        if (textAreaRef.current) {
          textAreaRef.current.focus()
        }
      }, 0)
    }
  }

  // Reset form with defaultValues when modal is opened
  useEffect(() => {
    if (isOpen && defaultValues?.state && defaultValues?.ownerId) {
      reset({
        state: defaultValues?.state,
        owner: defaultValues?.ownerId,
      })
    }
  }, [isOpen, reset, defaultValues])

  useEffect(() => {
    if (isOpen && !isLoading) {
      if (!isSaveAndCreateNext && isSubmitting) {
        reset({ text: "", state: "", owner: "", saveAndCreateNext: false })
        onClose()
      }

      setIsSubmitting(false)
    }
  }, [isLoading, isOpen, isSaveAndCreateNext, isSubmitting, onClose, reset, setFocus])

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
                sx={{ mt: 2 }}
                error={!!errors.text}
                helperText={errors.text ? errors.text.message : ""}
                inputRef={textAreaRef}
                onKeyDown={(event) => handleKeyDownSubmit(event, handleSubmit, onSubmit, !isDirty || !isValid)}
              />
            )}
          />
          <Controller
            name="saveAndCreateNext"
            control={control}
            render={({ field }) => (
              <FormControlLabel sx={{ mt: 1 }} control={<Checkbox {...field} />} label="Save and Create Next" />
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
