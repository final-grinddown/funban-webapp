import { DragEvent, useRef, useState } from "react"
import { Box, List, Typography } from "@mui/material"
import { INote } from "@/utils/interfaces"
import { BoardItemCard } from "./BoardItemCard"
import { DragAndDropPlaceholder } from "./DragAndDropPlaceholder"

interface Props {
  title: string
  items: INote[]
  isEditable: boolean
  hoveredColumn: string | null // Know which column is hovered
  setHoveredColumn: (columnId: string | null) => void // Function to set the hovered column
  onDragStart: (event: DragEvent<HTMLDivElement>, itemId: string) => void
  onDrop: (event: DragEvent<HTMLDivElement>, columnId: string, index: number) => void // Add index to onDrop to handle position
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
  const [draggedOverIndex, setDraggedOverIndex] = useState<number | null>(null) // Track where to show the placeholder
  const lastHoveredRef = useRef<string | null>(null)

  // Calculate the position based on Y-coordinate
  const handleDragOver = (event: DragEvent<HTMLDivElement>, index: number, element: HTMLElement) => {
    event.preventDefault() // Allow drop

    if (lastHoveredRef.current !== title) {
      lastHoveredRef.current = title
      setHoveredColumn(title) // Update the hovered column
    }

    const boundingRect = element.getBoundingClientRect()
    const midpoint = (boundingRect.top + boundingRect.bottom) / 2

    if (event.clientY < midpoint) {
      // If mouse is above the midpoint of the card, show placeholder before the card
      if (draggedOverIndex !== index) {
        setDraggedOverIndex(index)
        console.log(`Drag over column: ${title}, place before card at index: ${index}`)
      }
    } else {
      // If mouse is below the midpoint, show placeholder after the card
      if (draggedOverIndex !== index + 1) {
        setDraggedOverIndex(index + 1)
        console.log(`Drag over column: ${title}, place after card at index: ${index}`)
      }
    }
  }

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault()

    // If no valid index, return (for edge cases)
    if (draggedOverIndex === null) {
      console.log("No valid drop position detected.")
      return
    }

    console.log(`Dropped on column: ${title}, index: ${draggedOverIndex}`)

    // Trigger onDrop with the draggedOverIndex to indicate the exact position
    onDrop(event, title, draggedOverIndex)

    setDraggedOverIndex(null) // Reset placeholder index after dropping
    lastHoveredRef.current = null
    setHoveredColumn(null) // Reset the hovered column after dropping
  }

  const handleDragLeave = (event: DragEvent<HTMLDivElement>) => {
    const relatedTarget = event.relatedTarget as HTMLElement
    if (relatedTarget && event.currentTarget.contains(relatedTarget)) {
      return
    }
    console.log(`Leaving column: ${title}`)
    setDraggedOverIndex(null) // Reset placeholder when leaving the column
    lastHoveredRef.current = null
    setHoveredColumn(null) // Reset the hovered column when leaving
  }

  return (
    <Box
      bgcolor="background.paper"
      width="100%"
      minWidth={300}
      onDrop={handleDrop}
      onDragLeave={handleDragLeave}
      onDragOver={(event) => event.preventDefault()} // Allow dragging over the column
      sx={{
        border: hoveredColumn === title ? "2px dashed #1976d2" : "2px solid transparent", // Dashed border for hovered column
        transition: "border 0.3s ease",
        borderRadius: 2,
      }}
    >
      <Box p={2} bgcolor="primary.main" sx={{ borderTopLeftRadius: 4, borderTopRightRadius: 4 }}>
        <Typography variant="h2">{title}</Typography>
      </Box>
      <List>
        {items.map((item, index) => (
          <div
            key={item.id}
            onDragOver={(event) => handleDragOver(event, index, event.currentTarget)} // Pass the current card element to calculate position
          >
            {/* Show placeholder at the current index */}
            {draggedOverIndex === index && (
              <DragAndDropPlaceholder
                onDragOver={(event) => event.preventDefault()} // Allow drag over
                onDrop={handleDrop} // Handle the drop
              />
            )}
            <BoardItemCard {...item} isEditable={isEditable} onDragStart={onDragStart} onDragEnd={onDragEnd} />
          </div>
        ))}
        {/* Show placeholder at the end if hovering over the empty space */}
        {draggedOverIndex === items.length && (
          <DragAndDropPlaceholder
            onDragOver={(event) => event.preventDefault()} // Allow drag over for the last position
            onDrop={handleDrop} // Handle the drop at the end
          />
        )}
      </List>
    </Box>
  )
}
