import { DragEvent, useMemo, useRef, useState } from "react"
import { Box, Divider, Stack } from "@mui/material"
import { createUpdateNoteReorder } from "@/app/api/websocket"
import { useWebSocketContext } from "@/context/WebSocketProvider"
import { IColumnData, INote } from "@/utils/interfaces"
import { getStoredColumnOrder } from "@/utils/storage"
import { BackdropLoading } from "./BackdropLoading"
import { BoardColumn } from "./BoardColumn"

interface Props {
  notes: INote[]
  isEditable: boolean
  isAnyModalOpen: boolean
  setIsAnyModalOpen: (isOpen: boolean) => void
  selectedUserId?: number
}

export function Board({ notes, isEditable, selectedUserId, isAnyModalOpen, setIsAnyModalOpen }: Props) {
  const { sendMessage, isLoading } = useWebSocketContext()
  const draggingItemIdRef = useRef<string | null>(null)
  const [hoveredColumn, setHoveredColumn] = useState<string | null>(null)

  const columnOrder = getStoredColumnOrder()

  const columns = useMemo(() => {
    const columnData: IColumnData[] = [
      {
        title: "NOTES",
        state: "notes",
        items: notes.filter((note) => note.state === "notes").sort((a, b) => a.index - b.index),
        orderKey: 0,
      },
      {
        title: "TODO",
        state: "todo",
        items: notes.filter((note) => note.state === "todo").sort((a, b) => a.index - b.index),
        orderKey: 1,
      },
      {
        title: "IN PROGRESS",
        state: "in_progress",
        items: notes.filter((note) => note.state === "in_progress").sort((a, b) => a.index - b.index),
        orderKey: 2,
      },
      {
        title: "DONE",
        state: "done",
        items: notes.filter((note) => note.state === "done").sort((a, b) => a.index - b.index),
        orderKey: 3,
      },
    ]

    return columnData
      .map((col) => {
        const orderKey = columnOrder?.find((o) => o.title === col.title)?.orderKey ?? col.orderKey
        return { ...col, orderKey }
      })
      .sort((a, b) => a.orderKey - b.orderKey)
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
        {columns.map(({ title, items, state, orderKey }) => (
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
            columnIndex={orderKey}
            isAnyModalOpen={isAnyModalOpen}
            setIsAnyModalOpen={setIsAnyModalOpen}
          />
        ))}
      </Stack>
      {isLoading && <BackdropLoading isInDashboard={true} />}
    </Box>
  )
}
