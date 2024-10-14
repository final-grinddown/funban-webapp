import { DragEvent, useMemo, useRef, useState } from "react"
import { Box, Divider, Stack } from "@mui/material"
import { createUpdateNoteReorder } from "@/app/api/websocket"
import { useWebSocketContext } from "@/context/WebSocketProvider"
import { INote } from "@/utils/interfaces"
import { BackdropLoading } from "./BackdropLoading"
import { BoardColumn } from "./BoardColumn"

interface Props {
  notes: INote[]
  isEditable: boolean
}

export function Board({ notes, isEditable }: Props) {
  const { sendMessage, isLoading } = useWebSocketContext()
  const draggingItemIdRef = useRef<string | null>(null)
  const [hoveredColumn, setHoveredColumn] = useState<string | null>(null)

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
    draggingItemIdRef.current = itemId
    event.stopPropagation()
  }

  const handleDrop = (event: DragEvent<HTMLDivElement>, columnId: string, index: number) => {
    event.preventDefault()

    if (!draggingItemIdRef.current) return

    const draggedNote = notes.find((note) => String(note.id) === draggingItemIdRef.current)

    if (!draggedNote) return

    const newState = columnId.toLowerCase().replace(" ", "_")

    // Ensure that the index is handled correctly for empty columns
    const newIndex = index !== null && index !== undefined ? index : 0

    const message = createUpdateNoteReorder(draggedNote.id.toString(), newState, newIndex)
    sendMessage(message)

    draggingItemIdRef.current = null
    setHoveredColumn(null)
  }

  const handleDragEnd = () => {
    draggingItemIdRef.current = null
    setHoveredColumn(null)
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
            hoveredColumn={hoveredColumn}
            setHoveredColumn={setHoveredColumn}
            onDragStart={handleDragStart}
            onDrop={handleDrop}
            onDragEnd={handleDragEnd}
          />
        ))}
      </Stack>
      {isLoading && <BackdropLoading isInDashboard={true} />}
    </Box>
  )
}
