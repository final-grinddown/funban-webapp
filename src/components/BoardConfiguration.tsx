import { ChangeEvent, DragEvent, useState } from "react"
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown"
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp"
import {
  Box,
  Card,
  FormControl,
  FormControlLabel,
  Grid,
  IconButton,
  Radio,
  RadioGroup,
  Typography,
} from "@mui/material"
import { IColumn } from "@/utils/interfaces"

const STORAGE_KEY = "funban-column-order"
const HEADER_CONFIG_KEY = "funban-header-config"

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

  const [headerOption, setHeaderOption] = useState<string>(() => {
    const savedHeaderConfig = localStorage.getItem(HEADER_CONFIG_KEY)
    return savedHeaderConfig ? savedHeaderConfig : "updated_only"
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

    const updatedColumns = [...columns]
    const [draggedColumn] = updatedColumns.splice(draggedIndex, 1)
    updatedColumns.splice(index, 0, draggedColumn)

    const reorderedColumns = updatedColumns.map((column, idx) => ({
      ...column,
      orderKey: idx,
    }))

    localStorage.setItem(STORAGE_KEY, JSON.stringify(reorderedColumns))
    setColumns(reorderedColumns)
    setDraggedIndex(null)
    setDragOverIndex(null)
  }

  // Function to move a column up
  const moveColumnUp = (index: number) => {
    if (index === 0) return

    const updatedColumns = [...columns]
    const temp = updatedColumns[index - 1]
    updatedColumns[index - 1] = updatedColumns[index]
    updatedColumns[index] = temp

    const reorderedColumns = updatedColumns.map((column, idx) => ({
      ...column,
      orderKey: idx,
    }))

    localStorage.setItem(STORAGE_KEY, JSON.stringify(reorderedColumns))
    setColumns(reorderedColumns)
  }

  // Function to move a column down
  const moveColumnDown = (index: number) => {
    if (index === columns.length - 1) return

    const updatedColumns = [...columns]
    const temp = updatedColumns[index + 1]
    updatedColumns[index + 1] = updatedColumns[index]
    updatedColumns[index] = temp

    const reorderedColumns = updatedColumns.map((column, idx) => ({
      ...column,
      orderKey: idx,
    }))

    localStorage.setItem(STORAGE_KEY, JSON.stringify(reorderedColumns))
    setColumns(reorderedColumns)
  }

  const handleHeaderOptionChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value
    setHeaderOption(newValue)
    localStorage.setItem(HEADER_CONFIG_KEY, newValue)
  }

  return (
    <>
      <Typography variant="h2">Column Order Configuration</Typography>
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
                  py: { xs: 1, lg: 2 },
                  px: 4,
                  border: dragOverIndex === index ? "2px dashed #1976d2" : "2px solid transparent",
                  cursor: "grab",
                }}
              >
                <Grid container alignItems="center">
                  <Grid item xs={10}>
                    <Typography variant="body1">{column.title}</Typography>
                  </Grid>
                  <Grid item xs={2} display={{ lg: "none" }}>
                    <Box display="flex" flexDirection="column" alignItems="end">
                      <IconButton
                        color="secondary"
                        aria-label="order-up"
                        disabled={column.orderKey === 0}
                        onClick={() => moveColumnUp(index)}
                        disableRipple={true}
                      >
                        <KeyboardArrowUpIcon />
                      </IconButton>
                      <IconButton
                        color="secondary"
                        aria-label="order-down"
                        disabled={column.orderKey === columns.length - 1}
                        onClick={() => moveColumnDown(index)}
                        disableRipple={true}
                      >
                        <KeyboardArrowDownIcon />
                      </IconButton>
                    </Box>
                  </Grid>
                </Grid>
              </Card>
            </Grid>
          ))}
      </Grid>

      <Typography variant="h2" mt={6} mb={2}>
        Card Header Configuration
      </Typography>
      <FormControl component="fieldset">
        <RadioGroup
          aria-label="card-header-options"
          name="card-header-options"
          value={headerOption}
          onChange={handleHeaderOptionChange}
        >
          <FormControlLabel value="no_time" control={<Radio />} label="Show No time" />
          <FormControlLabel value="updated_only" control={<Radio />} label="Show Updated only" />
          <FormControlLabel value="created_updated" control={<Radio />} label="Show Created and Updated" />
        </RadioGroup>
      </FormControl>
    </>
  )
}
