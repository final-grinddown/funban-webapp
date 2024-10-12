import { DragEvent, useMemo, useRef, useState } from "react"
import { Box, Divider, Stack } from "@mui/material"
import { createUpdateNoteReorder } from "@/app/api/websocket"
import { useWebSocketContext } from "@/context/WebSocketProvider"
import { INote } from "@/utils/interfaces"
import { BoardColumn } from "./BoardColumn"

interface Props {
  notes: INote[]
  isEditable: boolean
}

export function Board({ notes, isEditable }: Props) {
  const { sendMessage } = useWebSocketContext()
  const draggingItemIdRef = useRef<string | null>(null)
  const lastHoveredColumnRef = useRef<string | null>(null)
  const [hoveredColumn, setHoveredColumn] = useState<string | null>(null) // Track which column is being hovered

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

  const handleDragStart = (event: DragEvent<HTMLDivElement>, itemId: string) => {
    console.log(`Dragging item with ID: ${itemId}`)
    draggingItemIdRef.current = itemId
  }

  const handleDrop = (event: DragEvent<HTMLDivElement>, columnId: string, index: number) => {
    event.preventDefault()
    console.log(`Dropped item: ${draggingItemIdRef.current} into column: ${columnId} at index: ${index}`)

    if (!draggingItemIdRef.current) return

    const draggedNote = notes.find((note) => String(note.id) === draggingItemIdRef.current)
    if (!draggedNote) return

    const newState = columnId.toLowerCase().replace(" ", "_")

    console.log(`Updating note state to: ${columnId} at index: ${index}`)

    // Construct the update message with the new state and index.
    const message = createUpdateNoteReorder(draggedNote.id.toString(), newState, index)
    sendMessage(message)

    draggingItemIdRef.current = null
    setHoveredColumn(null) // Reset hovered column on drop
  }

  const handleDragEnd = () => {
    console.log(`Drag ended for item: ${draggingItemIdRef.current}`)
    draggingItemIdRef.current = null
    setHoveredColumn(null) // Reset hovered column on drag end
  }

  return (
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
            hoveredColumn={hoveredColumn} // Pass hovered column info
            setHoveredColumn={setHoveredColumn} // Pass the setter to update the hovered column
            onDragStart={handleDragStart}
            onDrop={handleDrop}
            onDragEnd={handleDragEnd}
          />
        ))}
      </Stack>
    </Box>
  )
}
