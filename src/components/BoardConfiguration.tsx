import { DragEvent, useState } from "react"
import { Card, Grid, Typography } from "@mui/material"
import { IColumn } from "@/utils/interfaces"

const STORAGE_KEY = "funban-column-order"

export function BoardConfiguration() {
  const initialColumns: IColumn[] = [
    { title: "NOTES", orderKey: 0 },
    { title: "TODO", orderKey: 1 },
    { title: "IN PROGRESS", orderKey: 2 },
    { title: "DONE", orderKey: 3 },
  ]

  const [columns, setColumns] = useState<IColumn[]>(() => {
    const savedOrder = localStorage.getItem(STORAGE_KEY)

    return savedOrder ? JSON.parse(savedOrder) : initialColumns
  })

  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null)

  const handleDragStart = (event: DragEvent<HTMLDivElement>, index: number) => {
    setDraggedIndex(index)
    event.currentTarget.style.cursor = "grabbing"
  }

  const handleDragOver = (event: DragEvent<HTMLDivElement>, index: number) => {
    event.preventDefault()
    setDragOverIndex(index)
    event.currentTarget.style.cursor = "grab"
  }

  const handleDragLeave = () => {
    setDragOverIndex(null)
  }

  const handleDrop = (index: number) => {
    if (draggedIndex === null) return

    // Reorder columns based on the drag-and-drop operation
    const updatedColumns = [...columns]
    const [draggedColumn] = updatedColumns.splice(draggedIndex, 1)
    updatedColumns.splice(index, 0, draggedColumn)

    // After reordering, update the orderKey for each column based on its position
    const reorderedColumns = updatedColumns.map((column, idx) => ({
      ...column,
      orderKey: idx,
    }))

    localStorage.setItem(STORAGE_KEY, JSON.stringify(reorderedColumns))
    setColumns(reorderedColumns)
    setDraggedIndex(null)
    setDragOverIndex(null)
  }

  return (
    <>
      <Typography variant="h2">Column Configuration</Typography>
      <Grid container spacing={2} mt={1}>
        {columns
          .sort((a, b) => a.orderKey - b.orderKey)
          .map((column, index) => (
            <Grid item xs={12} key={column.title}>
              <Card
                draggable
                onDragStart={(event) => handleDragStart(event, index)}
                onDragOver={(event) => handleDragOver(event, index)}
                onDragLeave={handleDragLeave}
                onDrop={() => handleDrop(index)}
                elevation={4}
                sx={{
                  m: 0,
                  transition: "opacity 0.25s ease-out",
                  p: 2,
                  border: dragOverIndex === index ? "2px dashed #1976d2" : "2px solid transparent",
                  cursor: "grab",
                }}
              >
                <Grid container>
                  <Grid item>
                    <Typography variant="body1">{column.title}</Typography>
                  </Grid>
                </Grid>
              </Card>
            </Grid>
          ))}
      </Grid>
    </>
  )
}
