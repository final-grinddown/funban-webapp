import { Box, Divider, Stack, useTheme } from "@mui/material"
import { BoardItem } from "@/components/BoardItem"

export function Board() {
  const theme = useTheme()
  const columns = [
    {
      title: "NOTE",
      items: ["NOTE 1", "NOTE 2"],
    },
    {
      title: "TODO",
      items: ["TODO 1"],
    },
    {
      title: "IN PROGRESS",
      items: [],
    },
    {
      title: "DONE",
      items: ["DONE 1", "DONE 2", "DONE 3"],
    },
  ]

  return (
    <Box py={4}>
      <Stack
        direction="row"
        divider={<Divider orientation="vertical" flexItem />}
        spacing={2}
        minHeight={`calc(100vh - 250px)`}
        sx={{ overflowX: "auto" }}
      >
        {columns.map(({ title, items }) => (
          <BoardItem key={title} title={title} listItems={items} />
        ))}
      </Stack>
    </Box>
  )
}
