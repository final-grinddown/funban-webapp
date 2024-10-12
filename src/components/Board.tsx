import { DragEvent, useMemo, useRef } from "react"
import { Box, Divider, Stack } from "@mui/material"
import { createUpdateNoteReorder } from "@/app/api/websocket"
import { BackdropLoading } from "@/components/BackdropLoading"
import { useWebSocketContext } from "@/context/WebSocketProvider"
import { INote } from "@/utils/interfaces"
import { BoardColumn } from "./BoardColumn"

interface Props {
  notes: INote[]
  isEditable: boolean
}

export function Board({ notes, isEditable }: Props) {
  const { sendMessage, isLoading } = useWebSocketContext()
  const draggingItemIdRef = useRef<string | null>(null)
  const lastHoveredColumnRef = useRef<string | null>(null)

  const columns = useMemo(
    () => [
      {
        title: "NOTES",
        items: notes.filter((note) => note.state === "notes").sort((a, b) => a.index - b.index),
      },
      {
        title: "TODO",
        items: notes.filter((note) => note.state === "todo").sort((a, b) => a.index - b.index),
      },
      {
        title: "IN PROGRESS",
        items: notes.filter((note) => note.state === "in_progress").sort((a, b) => a.index - b.index),
      },
      {
        title: "DONE",
        items: notes.filter((note) => note.state === "done").sort((a, b) => a.index - b.index),
      },
    ],
    [notes],
  )

  // Handle when dragging starts
  const handleDragStart = (event: DragEvent<HTMLDivElement>, itemId: string) => {
    console.log(`Dragging item with ID: ${itemId}`)
    draggingItemIdRef.current = itemId
    const initialColumn = columns.find((column) => column.items.some((item) => String(item.id) === itemId))
    lastHoveredColumnRef.current = initialColumn?.title ?? null // Store in ref, no re-render
  }

  // Handle the drop event to move the item to a new column
  const handleDrop = (event: DragEvent<HTMLDivElement>, columnId: string) => {
    event.preventDefault()
    console.log(`Dropped item: ${draggingItemIdRef.current} into column: ${columnId}`)

    if (!draggingItemIdRef.current) return

    // Find the dragged note
    const draggedNote = notes.find((note) => String(note.id) === draggingItemIdRef.current)
    
    if (!draggedNote) return

    // Update the note's state to reflect its new column
    const newState = columnId.toLowerCase().replace(" ", "_")

    console.log(`Updating note state to: ${columnId}`)

    // Send the updated note information via WebSocket
    const message = createUpdateNoteReorder(draggedNote.id.toString(), newState)
    sendMessage(message)

    draggingItemIdRef.current = null // Reset ref value
  }

  // Handle when dragging ends
  const handleDragEnd = () => {
    console.log(`Drag ended for item: ${draggingItemIdRef.current}`)
    draggingItemIdRef.current = null // Clear the ref
  }

  return (
    <>
      <Box py={4}>
        <Stack
          direction="row"
          divider={<Divider orientation="vertical" flexItem />}
          spacing={2}
          minHeight="calc(100vh - 250px)"
          sx={{ overflowX: "auto" }}
        >
          {columns.map(({ title, items }) => (
            <BoardColumn
              key={title}
              title={title}
              items={items}
              isEditable={isEditable}
              onDragStart={handleDragStart}
              onDrop={handleDrop}
              onDragEnd={handleDragEnd}
            />
          ))}
          {isLoading && (
            <Box>
              <BackdropLoading isInDashboard={true} />
            </Box>
          )}
        </Stack>
      </Box>
    </>
  )
}
