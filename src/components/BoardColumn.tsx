import { DragEvent, useRef, useState } from "react"
import AddIcon from "@mui/icons-material/Add"
import MoreVertIcon from "@mui/icons-material/MoreVert"
import { Box, IconButton, List, Typography, Menu, MenuItem, ListItemText, ListItemIcon } from "@mui/material"
import { useTheme } from "@mui/material/styles"
import { useWebSocketContext } from "@/context/WebSocketProvider"
import { INote } from "@/utils/interfaces"
import { AddNewNoteModal } from "./AddNewNoteModal"
import { BoardItemCard } from "./BoardItemCard"
import { DragAndDropPlaceholder } from "./DragAndDropPlaceholder"

interface Props {
  title: string
  items: INote[]
  state: INote["state"]
  isEditable: boolean
  hoveredColumn: string | null
  setHoveredColumn: (columnId: string | null) => void
  onDragStart: (event: DragEvent<HTMLDivElement>, itemId: string) => void
  onDrop: (event: DragEvent<HTMLDivElement>, columnId: string, index: number) => void
  onDragEnd: () => void
  selectedUserId: number
}

export function BoardColumn({
  title,
  items,
  state,
  isEditable,
  hoveredColumn,
  setHoveredColumn,
  onDragStart,
  onDragEnd,
  onDrop,
  selectedUserId,
}: Props) {
  const { users } = useWebSocketContext()
  const theme = useTheme()
  const [draggedOverIndex, setDraggedOverIndex] = useState<number | null>(null)
  const lastHoveredRef = useRef<string | null>(null)
  const [isDraggingOver, setIsDraggingOver] = useState(false)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const openMenu = Boolean(anchorEl)
  const [isAddNewNoteModalOpen, setIsAddNewNoteModalOpen] = useState(false)
  const [newNoteDefaultValues, setNewNoteDefaultValues] = useState({ state: "", ownerId: "" })

  const handleOpenMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleCloseMenu = () => {
    setAnchorEl(null)
  }

  const handleOpenAddNewNoteModal = () => {
    handleCloseMenu()
    setNewNoteDefaultValues({ state: state, ownerId: String(selectedUserId) })
    setIsAddNewNoteModalOpen(true)
  }
  const handleCloseAddNewNoteModal = () => {
    setIsAddNewNoteModalOpen(false)
    setNewNoteDefaultValues({ state: "", ownerId: "" })
  }

  // Calculate the position based on Y-coordinate
  const handleDragOver = (event: DragEvent<HTMLDivElement>, index: number, element: HTMLElement) => {
    event.preventDefault()

    if (lastHoveredRef.current !== title) {
      lastHoveredRef.current = title
      setHoveredColumn(title)
    }

    const boundingRect = element.getBoundingClientRect()
    const midpoint = (boundingRect.top + boundingRect.bottom) / 2

    if (event.clientY < midpoint) {
      // If mouse is above the midpoint of the card, show placeholder before the card
      if (draggedOverIndex !== index) {
        setDraggedOverIndex(index)
      }
    } else {
      // If mouse is below the midpoint, show placeholder after the card
      if (draggedOverIndex !== index + 1) {
        setDraggedOverIndex(index + 1)
      }
    }
  }

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault()

    if (draggedOverIndex === null) {
      setDraggedOverIndex(0) // If the column is empty, drop the item at index 0
    }

    onDrop(event, title, draggedOverIndex ?? 0)

    setDraggedOverIndex(null)
    setIsDraggingOver(false)
    lastHoveredRef.current = null
    setHoveredColumn(null)
  }

  const handleDragLeave = (event: DragEvent<HTMLDivElement>) => {
    const relatedTarget = event.relatedTarget as HTMLElement

    if (relatedTarget && event.currentTarget.contains(relatedTarget)) {
      return
    }

    setDraggedOverIndex(null)
    setIsDraggingOver(false)
    lastHoveredRef.current = null
    setHoveredColumn(null)
  }

  const handleDragEnter = (event: DragEvent<HTMLDivElement>) => {
    setIsDraggingOver(true)
  }

  return (
    <Box
      bgcolor="background.paper"
      width="100%"
      minWidth={300}
      onDrop={handleDrop}
      onDragLeave={handleDragLeave}
      onDragEnter={handleDragEnter}
      onDragOver={(event) => event.preventDefault()} // Allow dragging over empty columns
      sx={{
        border: hoveredColumn === title ? "2px dashed #1976d2" : "2px solid transparent",
        transition: "border 0.3s ease",
        borderRadius: 2,
      }}
    >
      <Box
        p={2}
        bgcolor="primary.main"
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        sx={{ borderTopLeftRadius: 4, borderTopRightRadius: 4 }}
      >
        <Typography variant="h2">{title}</Typography>
        <IconButton
          onClick={handleOpenMenu}
          aria-controls={openMenu ? "basic-column-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={openMenu ? "true" : undefined}
          sx={{ borderRadius: "50%", padding: 1, border: `2px solid ${theme.palette.text.primary}` }}
        >
          <MoreVertIcon />
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          open={openMenu}
          onClose={handleCloseMenu}
          MenuListProps={{
            "aria-labelledby": "open edit note menu",
          }}
        >
          <MenuItem onClick={handleOpenAddNewNoteModal}>
            <ListItemIcon>
              <AddIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Add new note</ListItemText>
          </MenuItem>
        </Menu>
      </Box>
      <List>
        {items.length === 0 && isDraggingOver && (
          <DragAndDropPlaceholder onDragOver={(event) => event.preventDefault()} />
        )}

        {items.map((item, index) => (
          <div key={item.id} onDragOver={(event) => handleDragOver(event, index, event.currentTarget)}>
            {draggedOverIndex === index && (
              <DragAndDropPlaceholder onDragOver={(event) => event.preventDefault()} onDrop={handleDrop} />
            )}
            <BoardItemCard {...item} isEditable={isEditable} onDragStart={onDragStart} onDragEnd={onDragEnd} />
          </div>
        ))}

        {draggedOverIndex === items.length && (
          <DragAndDropPlaceholder onDragOver={(event) => event.preventDefault()} onDrop={handleDrop} />
        )}
      </List>

      <AddNewNoteModal
        isOpen={isAddNewNoteModalOpen}
        onClose={handleCloseAddNewNoteModal}
        users={users}
        defaultValues={newNoteDefaultValues}
      />
    </Box>
  )
}
