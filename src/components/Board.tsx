import { DragEvent, useMemo, useRef, useState } from "react"
import { Box, Divider, Stack } from "@mui/material"
import { createUpdateNoteReorder } from "@/app/api/websocket"
import { useWebSocketContext } from "@/context/WebSocketProvider"
import { IColumn, IColumnData, INote } from "@/utils/interfaces"
import { BackdropLoading } from "./BackdropLoading"
import { BoardColumn } from "./BoardColumn"

interface Props {
  notes: INote[]
  isEditable: boolean
  selectedUserId: number
}

export function Board({ notes, isEditable, selectedUserId }: Props) {
  const { sendMessage, isLoading } = useWebSocketContext()
  const draggingItemIdRef = useRef<string | null>(null)
  const [hoveredColumn, setHoveredColumn] = useState<string | null>(null)

  // Prefix for localStorage key
  const STORAGE_KEY = "funban-column-order"

  // Default column order
  const defaultOrder: IColumn[] = [
    { title: "NOTES", orderKey: 0 },
    { title: "TODO", orderKey: 1 },
    { title: "IN PROGRESS", orderKey: 2 },
    { title: "DONE", orderKey: 3 },
  ]

  // State for column order
  const [columnOrder] = useState<IColumn[]>(() => {
    const savedOrder = localStorage.getItem(STORAGE_KEY)

    return savedOrder ? JSON.parse(savedOrder) : defaultOrder
  })

  const columns = useMemo(() => {
    const columnData: IColumnData[] = [
      {
        title: "NOTES",
        state: "notes",
        items: notes.filter((note) => note.state === "notes").sort((a, b) => a.index - b.index),
      },
      {
        title: "TODO",
        state: "todo",
        items: notes.filter((note) => note.state === "todo").sort((a, b) => a.index - b.index),
      },
      {
        title: "IN PROGRESS",
        state: "in_progress",
        items: notes.filter((note) => note.state === "in_progress").sort((a, b) => a.index - b.index),
      },
      {
        title: "DONE",
        state: "done",
        items: notes.filter((note) => note.state === "done").sort((a, b) => a.index - b.index),
      },
    ]

    return columnData.sort((a, b) => {
      const orderA = columnOrder.find((col) => col.title === a.title)?.orderKey ?? 0
      const orderB = columnOrder.find((col) => col.title === b.title)?.orderKey ?? 0

      return orderA - orderB
    })
  }, [notes, columnOrder])

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
        {columns.map(({ title, items, state }) => (
          <BoardColumn
            key={state}
            title={title}
            items={items}
            state={state}
            isEditable={isEditable}
            hoveredColumn={hoveredColumn}
            setHoveredColumn={setHoveredColumn}
            onDragStart={handleDragStart}
            onDrop={handleDrop}
            onDragEnd={handleDragEnd}
            selectedUserId={selectedUserId}
          />
        ))}
      </Stack>
      {isLoading && <BackdropLoading isInDashboard={true} />}
    </Box>
  )
}
