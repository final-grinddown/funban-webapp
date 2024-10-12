import { DragEvent, useRef } from "react"
import { Box, List, Typography } from "@mui/material"
import { INote } from "@/utils/interfaces"
import { BoardItemCard } from "./BoardItemCard"

interface Props {
  title: string
  items: INote[]
  isEditable: boolean
  onDragStart: (event: DragEvent<HTMLDivElement>, itemId: string) => void
  onDrop: (event: DragEvent<HTMLDivElement>, columnId: string) => void
  onDragEnd: () => void
}

export function BoardColumn({ title, items, isEditable, onDragStart, onDragEnd, onDrop }: Props) {
  const lastHoveredRef = useRef<string | null>(null)

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault() // Allow dropping by preventing default behavior

    // Only log and perform logic if the dragged item moves into a new column
    if (lastHoveredRef.current !== title) {
      lastHoveredRef.current = title
      console.log(`Drag over column: ${title}`)
    }
  }

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault() // Prevent default behavior for the drop
    onDrop(event, title) // Trigger the drop event
    console.log(`Dropped on column: ${title}`)
    lastHoveredRef.current = null // Reset hover state after drop
  }

  const handleDragLeave = (event: DragEvent<HTMLDivElement>) => {
    const relatedTarget = event.relatedTarget as HTMLElement

    // Check if the relatedTarget is still inside the column
    if (relatedTarget && event.currentTarget.contains(relatedTarget)) {
      return // If the relatedTarget is inside the column, do nothing
    }

    // Reset the hover state when truly leaving the column
    console.log(`Leaving column: ${title}`)
    lastHoveredRef.current = null // Reset the hovered column when leaving
  }

  return (
    <Box
      bgcolor="background.paper"
      width="100%"
      minWidth={300}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
    >
      <Box p={2} bgcolor="primary.main" sx={{ borderTopLeftRadius: 4, borderTopRightRadius: 4 }}>
        <Typography variant="h2">{title}</Typography>
      </Box>
      <List>
        {items.map((item) => (
          <BoardItemCard
            key={item.id}
            {...item}
            isEditable={isEditable}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
          />
        ))}
      </List>
    </Box>
  )
}
