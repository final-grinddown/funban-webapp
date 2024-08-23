import { useEffect, useState } from "react"
import CloseIcon from "@mui/icons-material/Close"
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, TextField } from "@mui/material"

interface Props {
  isOpen: boolean
  initialName: string
  onClose: () => void
  onSave: (newName: string) => void
}

export function NameEditModal({ isOpen, initialName, onClose, onSave }: Props) {
  const [name, setName] = useState(initialName)

  const handleSave = () => {
    onSave(name)
    onClose()
  }

  useEffect(() => {
    if (isOpen) {
      setName(initialName)
    }
  }, [initialName, isOpen])

  return (
    <Dialog open={isOpen} onClose={onClose} fullWidth={true}>
      <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
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
      <DialogContent>
        <TextField value={name} onChange={(e) => setName(e.target.value)} variant="outlined" size="small" fullWidth />
      </DialogContent>
      <DialogActions sx={{ px: 3 }}>
        <Button onClick={onClose} color="secondary" variant="contained">
          Cancel
        </Button>
        <Button onClick={handleSave} color="primary" variant="contained">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  )
}
