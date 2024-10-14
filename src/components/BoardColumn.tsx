import { DragEvent, useRef, useState } from "react"
import { Box, List, Typography } from "@mui/material"
import { INote } from "@/utils/interfaces"
import { BoardItemCard } from "./BoardItemCard"
import { DragAndDropPlaceholder } from "./DragAndDropPlaceholder"

interface Props {
  title: string
  items: INote[]
  isEditable: boolean
  hoveredColumn: string | null
  setHoveredColumn: (columnId: string | null) => void
  onDragStart: (event: DragEvent<HTMLDivElement>, itemId: string) => void
  onDrop: (event: DragEvent<HTMLDivElement>, columnId: string, index: number) => void
  onDragEnd: () => void
}

export function BoardColumn({
  title,
  items,
  isEditable,
  hoveredColumn,
  setHoveredColumn,
  onDragStart,
  onDragEnd,
  onDrop,
}: Props) {
  const [draggedOverIndex, setDraggedOverIndex] = useState<number | null>(null)
  const lastHoveredRef = useRef<string | null>(null)
  const [isDraggingOver, setIsDraggingOver] = useState(false)

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
      <Box p={2} bgcolor="primary.main" sx={{ borderTopLeftRadius: 4, borderTopRightRadius: 4 }}>
        <Typography variant="h2">{title}</Typography>
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
    </Box>
  )
}
