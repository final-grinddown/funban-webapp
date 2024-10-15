import { DragEvent, SyntheticEvent, useEffect, useState } from "react"
import DeleteIcon from "@mui/icons-material/Delete"
import EditIcon from "@mui/icons-material/Edit"
import EditNoteIcon from "@mui/icons-material/EditNote"
import FileCopyIcon from "@mui/icons-material/FileCopy"
import {
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Divider,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material"
import { alpha, useTheme } from "@mui/material/styles"
import { format, formatDistanceToNow } from "date-fns"
import { createCloneNote } from "@/app/api/websocket"
import { useWebSocketContext } from "@/context/WebSocketProvider"
import { availableColors } from "@/utils/constants"
import { matchColorName } from "@/utils/helpers"
import { INote } from "@/utils/interfaces"
import { useFocusStateStore } from "@/utils/store"
import { DeleteNoteModal } from "./DeleteNoteModal"
import { EditNoteModal } from "./EditNoteModal"

const HEADER_CONFIG_KEY = "funban-header-config"

interface Props extends INote {
  isEditable: boolean
  onDragStart: (event: DragEvent<HTMLDivElement>, itemId: string) => void
  onDragEnd: () => void
}

export function BoardItemCard({
  text,
  name,
  color,
  state,
  updated,
  created,
  id,
  isEditable,
  onDragStart,
  onDragEnd,
}: Props) {
  const { sendMessage, isLoading } = useWebSocketContext()
  const { isFocus, currentUser } = useFocusStateStore()
  const theme = useTheme()
  const matchedColor = matchColorName(color, availableColors) || "#000000"
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [textFocus, setTextFocus] = useState(false)
  const openMenu = Boolean(anchorEl)
  const contrastColor = theme.palette.getContrastText(matchedColor)
  const updatedDate = format(new Date(updated), "dd/MM/yyyy, HH:mm")
  const createdDate = format(new Date(created), "dd/MM/yyyy, HH:mm")
  const updatedRelative = formatDistanceToNow(new Date(updated), { addSuffix: true })
  const createdRelative = formatDistanceToNow(new Date(created), { addSuffix: true })
  const dateToShow =
    updated && updated !== created
      ? `Updated at ${isEditable ? updatedRelative : updatedDate}`
      : `Created at ${isEditable ? createdRelative : createdDate}`
  const headerConfig = localStorage.getItem(HEADER_CONFIG_KEY) || "updated_only"

  const handleOpenMenu = (event: SyntheticEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)

    if (isSubmitting) {
      setIsSubmitting(false)
    }
  }

  const handleCloseMenu = () => {
    setAnchorEl(null)
  }

  const handleEditOpenModal = () => {
    setIsEditModalOpen(true)
    handleCloseMenu()
  }

  const handleEditDoubleClickOpenModal = () => {
    setTextFocus(true)
    setIsEditModalOpen(true)
    handleCloseMenu()
  }

  const handleClearTextFocus = () => {
    setTextFocus(false)
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
    setIsSubmitting(true)
  }

  const handleDragStart = (event: DragEvent<HTMLDivElement>) => {
    onDragStart(event, id.toString())
    event.currentTarget.style.cursor = "grabbing"
    setIsDragging(true)
    event.dataTransfer.effectAllowed = "move"
  }

  const handleDragEnd = (event: DragEvent<HTMLDivElement>) => {
    onDragEnd()
    event.currentTarget.style.cursor = "grab"
    setIsDragging(false)
  }

  useEffect(() => {
    if (isSubmitting && !isLoading) {
      handleCloseMenu()
    }
  }, [isLoading, isSubmitting])

  return (
    <>
      <Card
        draggable={isEditable}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        elevation={4}
        sx={{
          m: 2,
          opacity: isFocus && name !== currentUser ? 0.05 : 1,
          transition: "opacity 0.25s ease-out",
          cursor: isEditable ? "grab" : "default",
        }}
      >
        <CardHeader
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
            <>
              {headerConfig === "updated_only" && (
                <Typography variant="body2" sx={{ color: alpha(contrastColor, 0.7) }}>
                  {dateToShow}
                </Typography>
              )}
              {headerConfig === "created_updated" && (
                <>
                  <Typography variant="body2" sx={{ color: alpha(contrastColor, 0.7) }}>
                    {isEditable ? `Created ${createdRelative}` : `Created at ${createdDate}`}
                  </Typography>
                  {updated && (
                    <Typography variant="body2" sx={{ color: alpha(contrastColor, 0.7) }}>
                      Updated at {updated !== created ? (isEditable ? updatedRelative : updatedDate) : "N/A"}
                    </Typography>
                  )}
                </>
              )}
            </>
          }
          action={
            isEditable &&
            (!isFocus || (isFocus && name === currentUser)) && (
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
                    {isSubmitting ? (
                      <CircularProgress size={24} sx={{ mx: "auto" }} />
                    ) : (
                      <>
                        <ListItemIcon>
                          <FileCopyIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText>Clone note</ListItemText>
                      </>
                    )}
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
          sx={{
            bgcolor: alpha(matchedColor, 0.75),
          }}
        />
        <CardContent
          sx={{
            p: 2,
            position: "relative",
            transition: "background-color 0.3s ease-in-out",
            "&:hover": {
              cursor: isEditable && !isDragging ? "context-menu" : "default",
              bgcolor: isEditable && !isDragging ? alpha(theme.palette.primary.light, 0.15) : null,
              animation: isEditable && !isDragging ? "pulsate 1.5s ease-in-out infinite" : null, // Apply pulsating effect
            },
            "@keyframes pulsate": {
              "0%": { backgroundColor: alpha(theme.palette.primary.light, 0.15) },
              "50%": { backgroundColor: alpha(theme.palette.primary.light, 0.25) },
              "100%": { backgroundColor: alpha(theme.palette.primary.light, 0.15) },
            },
          }}
          onDoubleClick={handleEditDoubleClickOpenModal}
        >
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
            hasTextFocus={textFocus}
            clearTextFocus={handleClearTextFocus}
          />

          <DeleteNoteModal isOpen={isDeleteModalOpen} noteId={id} onClose={handleDeleteCloseModal} />
        </>
      )}
    </>
  )
}
