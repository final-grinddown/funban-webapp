import { useEffect } from "react"
import CloseIcon from "@mui/icons-material/Close"
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, TextField } from "@mui/material"
import { Controller, useForm } from "react-hook-form"

interface Props {
  isOpen: boolean
  initialName: string
  existingNames: string[]
  onClose: () => void
  onSave: (newName: string) => void
}

interface FormInputs {
  name: string
}

export function NameEditModal({ isOpen, initialName, existingNames, onClose, onSave }: Props) {
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors, isValid },
  } = useForm<FormInputs>({
    defaultValues: { name: initialName },
    mode: "onChange",
  })

  const onSubmit = (data: FormInputs) => {
    onSave(data.name)
    onClose()
  }

  useEffect(() => {
    if (isOpen) {
      setValue("name", initialName)
    }
  }, [initialName, isOpen, setValue])

  return (
    <Dialog open={isOpen} onClose={onClose} fullWidth={true}>
      <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", pb: 0 }}>
        Edit Name
        <IconButton
          aria-label="close"
          edge="end"
          onClick={onClose}
          sx={{
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ height: { xs: "100px", sm: "80px" } }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Controller
            name="name"
            control={control}
            rules={{
              required: "Name is required.",
              maxLength: { value: 20, message: "Name cannot exceed 20 characters." },
              validate: {
                noLeadingSpaces: (value) => !/^\s/.test(value) || "Name cannot start with a space.",
                uniqueName: (value) =>
                  !existingNames.filter((name) => name !== initialName).includes(value) ||
                  "Name already exists. Please choose a different name.",
              },
            }}
            render={({ field, fieldState: { error } }) => (
              <TextField
                {...field}
                label="Name"
                variant="outlined"
                size="small"
                fullWidth={true}
                error={!!error}
                helperText={error ? error.message : ""}
                sx={{ mt: 2 }}
              />
            )}
          />
        </form>
      </DialogContent>
      <DialogActions sx={{ px: 3 }}>
        <Button onClick={onClose} color="secondary" variant="contained">
          Cancel
        </Button>
        <Button onClick={handleSubmit(onSubmit)} color="primary" variant="contained" disabled={!isValid}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  )
}
