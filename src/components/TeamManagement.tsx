import { useState } from "react"
import ChangeCircleIcon from "@mui/icons-material/ChangeCircle"
import CloseIcon from "@mui/icons-material/Close"
import DeleteIcon from "@mui/icons-material/Delete"
import EditIcon from "@mui/icons-material/Edit"
import {
  Box,
  Button,
  Card,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  RadioGroup,
  TextField,
  Typography,
  useTheme,
} from "@mui/material"
import {
  amber,
  blue,
  blueGrey,
  brown,
  cyan,
  deepOrange,
  deepPurple,
  green,
  grey,
  indigo,
  lightBlue,
  lightGreen,
  lime,
  orange,
  pink,
  purple,
  red,
  teal,
  yellow,
} from "@mui/material/colors"
import { IUser } from "@/utils/interfaces"

interface Props {
  users: IUser[]
}

const availableColors = [
  { name: "Red", value: red[500] },
  { name: "Pink", value: pink[500] },
  { name: "Purple", value: purple[500] },
  { name: "Deep Purple", value: deepPurple[500] },
  { name: "Indigo", value: indigo[500] },
  { name: "Blue", value: blue[500] },
  { name: "Light Blue", value: lightBlue[500] },
  { name: "Cyan", value: cyan[500] },
  { name: "Teal", value: teal[500] },
  { name: "Green", value: green[500] },
  { name: "Light Green", value: lightGreen[500] },
  { name: "Lime", value: lime[500] },
  { name: "Yellow", value: yellow[500] },
  { name: "Amber", value: amber[500] },
  { name: "Orange", value: orange[500] },
  { name: "Deep Orange", value: deepOrange[500] },
  { name: "Brown", value: brown[500] },
  { name: "Grey", value: grey[500] },
  { name: "Blue Grey", value: blueGrey[500] },
  { name: "Black", value: "#000000" },
]

export function TeamManagement({ users }: Props) {
  const theme = useTheme()
  const [editingNameId, setEditingNameId] = useState<string | null>(null)
  const [editingColorId, setEditingColorId] = useState<string | null>(null)
  const [currentName, setCurrentName] = useState<string>("")
  const [currentColor, setCurrentColor] = useState<string>("")

  const handleEditNameClick = (id: number, name: string) => {
    setEditingNameId(id.toString())
    setCurrentName(name)
    setEditingColorId(null) // Ensure only one field is being edited
  }

  const handleEditColorClick = (id: number, color: string) => {
    const matchedColor = availableColors.find((c) => c.name.toLowerCase() === color.toLowerCase())?.name || color

    setEditingColorId(id.toString())
    setCurrentColor(matchedColor) // Store the color name instead of its value
    setEditingNameId(null) // Ensure only one field is being edited
  }

  const handleSaveClick = () => {
    // Placeholder for save action, just reset the editing state
    setEditingNameId(null)
    setEditingColorId(null)
  }

  const handleCancelClick = () => {
    // Reset the editing state without saving
    setEditingNameId(null)
    setEditingColorId(null)
  }

  const handleDeleteClick = (id: number) => {
    console.log(`User with ID ${id} deleted.`)
  }

  return (
    <Grid container spacing={2}>
      {users.map(({ id, name, color }) => (
        <Grid key={id} item xs={12} sm={6} md={4} xl={3}>
          <Card variant="elevation" sx={{ padding: 2 }}>
            <Box>
              <Typography variant="h6" component="p" color={theme.palette.text.primary} gutterBottom={false}>
                Name:
              </Typography>
              <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                <Typography variant="body1" component="p" color={theme.palette.text.primary} sx={{ flexGrow: 1 }}>
                  {name}
                </Typography>
                <IconButton onClick={() => handleEditNameClick(id, name)} color="default">
                  <EditIcon />
                </IconButton>
              </Box>

              <Typography variant="h6" component="p" color={theme.palette.text.primary} gutterBottom={false}>
                Color:
              </Typography>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Typography variant="body1" component="p" textTransform="capitalize" color={theme.palette.text.primary}>
                  {color}
                </Typography>
                <Box display="flex" alignItems="center" flexGrow={1}>
                  <Box
                    width={24}
                    height={24}
                    bgcolor={availableColors.find((c) => c.name.toLowerCase() === color)?.value ?? color}
                    borderRadius="50%"
                    ml={1}
                  />
                </Box>
                <IconButton onClick={() => handleEditColorClick(id, color)} color="default">
                  <ChangeCircleIcon />
                </IconButton>
              </Box>
            </Box>
            <Box display="flex" justifyContent="flex-end" mt={2}>
              <Button variant="outlined" color="error" startIcon={<DeleteIcon />} onClick={() => handleDeleteClick(id)}>
                Delete team member
              </Button>
            </Box>
          </Card>

          {/* Name Edit Modal */}
          <Dialog open={editingNameId === String(id)} onClose={handleCancelClick} fullWidth={true}>
            <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              Edit Name
              <IconButton
                aria-label="close"
                edge="end"
                onClick={handleCancelClick}
                sx={{
                  color: (theme) => theme.palette.grey[500],
                }}
              >
                <CloseIcon />
              </IconButton>
            </DialogTitle>
            <DialogContent>
              <TextField
                value={currentName}
                onChange={(e) => setCurrentName(e.target.value)}
                variant="outlined"
                size="small"
                fullWidth
              />
            </DialogContent>
            <DialogActions sx={{ px: 3 }}>
              <Button onClick={handleCancelClick} color="secondary" variant="contained">
                Cancel
              </Button>
              <Button onClick={handleSaveClick} color="primary" variant="contained">
                Save
              </Button>
            </DialogActions>
          </Dialog>

          {/* Color Edit Modal */}
          <Dialog open={editingColorId === String(id)} onClose={handleCancelClick} fullWidth={true}>
            <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              Edit Color
              <IconButton
                aria-label="close"
                edge="end"
                onClick={handleCancelClick}
                sx={{
                  color: (theme) => theme.palette.grey[500],
                }}
              >
                <CloseIcon />
              </IconButton>
            </DialogTitle>
            <DialogContent>
              <Box display="flex" gap={1} alignItems="center" mb={1}>
                <Typography variant="h6" component="p" color={theme.palette.text.primary} gutterBottom={false}>
                  Current color:
                </Typography>
                <Typography variant="h6" component="p" fontWeight="normal">
                  {currentColor}
                </Typography>
              </Box>
              <RadioGroup value={currentColor} onChange={(e) => setCurrentColor(e.target.value)}>
                <Grid container spacing={2}>
                  {availableColors.map(({ name, value }) => (
                    <Grid item xs={6} sm={4} md={3} lg={3} key={name}>
                      <Box
                        component="div"
                        width="100%"
                        height={60}
                        bgcolor={value}
                        border="2px solid rgba(0, 0, 0, 0.12)"
                        borderRadius={2}
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                        sx={{
                          cursor: "pointer",
                          opacity: name === currentColor ? 1 : 0.25, // Dim the color if not selected
                          transition: "opacity 0.3s", // Smooth transition for opacity
                          "&:hover": {
                            opacity: 1, // Restore full opacity on hover
                          },
                        }}
                        onClick={() => setCurrentColor(name)} // Click to select color
                      />
                    </Grid>
                  ))}
                </Grid>
              </RadioGroup>
            </DialogContent>
            <DialogActions sx={{ px: 3 }}>
              <Button onClick={handleCancelClick} color="secondary" variant="contained">
                Cancel
              </Button>
              <Button onClick={handleSaveClick} color="primary" variant="contained">
                Save
              </Button>
            </DialogActions>
          </Dialog>
        </Grid>
      ))}
    </Grid>
  )
}
