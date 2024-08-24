import { useMemo } from "react"
import { Box, Divider, Stack } from "@mui/material"
import { INote } from "@/utils/interfaces"
import { BoardColumn } from "./BoardColumn"

interface Props {
  notes: INote[]
}

export function Board({ notes }: Props) {
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
          <BoardColumn key={title} title={title} items={items} />
        ))}
      </Stack>
    </Box>
  )
}
