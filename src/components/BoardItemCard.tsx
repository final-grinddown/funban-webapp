import { SyntheticEvent, useState } from "react"
import DeleteIcon from "@mui/icons-material/Delete"
import EditIcon from "@mui/icons-material/Edit"
import EditNoteIcon from "@mui/icons-material/EditNote"
import FileCopyIcon from "@mui/icons-material/FileCopy"
import {
  Avatar,
  Card,
  CardContent,
  CardHeader,
  Divider,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material"
import { alpha, useTheme } from "@mui/material/styles"
import { createCloneNote } from "@/app/api/websocket"
import { useWebSocketContext } from "@/context/WebSocketProvider"
import { availableColors } from "@/utils/constants"
import { matchColorName } from "@/utils/helpers"
import { INote } from "@/utils/interfaces"
import { DeleteNoteModal } from "./DeleteNoteModal"
import { EditNoteModal } from "./EditNoteModal"

interface Props extends INote {
  isEditable: boolean
  avatarUrl?: string
}

export function BoardItemCard({ text, name, color, state, updated, created, avatarUrl, id, isEditable }: Props) {
  const { sendMessage } = useWebSocketContext()
  const theme = useTheme()
  const matchedColor = matchColorName(color, availableColors) || "#000000"
  const avatarInitial = name.charAt(0).toUpperCase()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const openMenu = Boolean(anchorEl)
  const contrastColor = theme.palette.getContrastText(matchedColor)
  const dateToShow = updated
    ? `Updated at ${new Date(updated).toLocaleString()}`
    : `Created at ${new Date(created).toLocaleString()}`

  const handleOpenMenu = (event: SyntheticEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleCloseMenu = () => {
    setAnchorEl(null)
  }

  const handleEditOpenModal = () => {
    setIsEditModalOpen(true)
    handleCloseMenu()
  }

  const handleEditCloseModal = () => {
    setIsEditModalOpen(false)
  }

  const handleDeleteOpenModal = () => {
    setIsDeleteModalOpen(true)
    handleCloseMenu()
  }

  const handleDeleteCloseModal = () => {
    setIsDeleteModalOpen(false)
  }

  const handleCloneNote = () => {
    const message = createCloneNote(id.toString())
    sendMessage(message)
    handleCloseMenu()
  }

  return (
    <>
      <Card elevation={4} sx={{ m: 2 }}>
        <CardHeader
          avatar={<Avatar src={avatarUrl}>{!avatarUrl && avatarInitial}</Avatar>}
          title={
            <Typography
              variant="h6"
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                color: alpha(contrastColor, 0.85),
              }}
            >
              {name}
            </Typography>
          }
          subheader={
            <Typography variant="body2" sx={{ color: alpha(contrastColor, 0.7) }}>
              {dateToShow}
            </Typography>
          }
          action={
            isEditable && (
              <>
                <IconButton
                  sx={{ color: contrastColor, border: `2px solid ${alpha(contrastColor, 0.75)}` }}
                  onClick={handleOpenMenu}
                  aria-controls={openMenu ? "basic-menu" : undefined}
                  aria-haspopup="true"
                  aria-expanded={openMenu ? "true" : undefined}
                >
                  <EditNoteIcon />
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  open={openMenu}
                  onClose={handleCloseMenu}
                  MenuListProps={{
                    "aria-labelledby": "open edit note menu",
                  }}
                >
                  <MenuItem onClick={handleEditOpenModal}>
                    <ListItemIcon>
                      <EditIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Edit note</ListItemText>
                  </MenuItem>
                  <MenuItem onClick={handleCloneNote}>
                    <ListItemIcon>
                      <FileCopyIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Clone note</ListItemText>
                  </MenuItem>
                  <Divider />
                  <MenuItem onClick={handleDeleteOpenModal}>
                    <ListItemIcon>
                      <DeleteIcon fontSize="small" color="error" />
                    </ListItemIcon>
                    <ListItemText sx={{ color: theme.palette.error.main }}>Delete note</ListItemText>
                  </MenuItem>
                </Menu>
              </>
            )
          }
          sx={{ bgcolor: alpha(matchedColor, 0.75) }}
        />
        <CardContent sx={{ p: 2 }}>
          <Typography variant="body1" sx={{ whiteSpace: "pre-line" }}>
            {text}
          </Typography>
        </CardContent>
      </Card>

      {isEditable && (
        <>
          <EditNoteModal
            isOpen={isEditModalOpen}
            noteId={id}
            noteState={state}
            noteText={text}
            onClose={handleEditCloseModal}
          />

          <DeleteNoteModal isOpen={isDeleteModalOpen} noteId={id} onClose={handleDeleteCloseModal} />
        </>
      )}
    </>
  )
}
