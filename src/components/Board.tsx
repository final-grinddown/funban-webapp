import { Box, Divider, Stack } from "@mui/material"
import { BoardItem } from "@/components/BoardItem"

export function Board() {
  const columns = [
    {
      title: "NOTE",
      items: [
        {
          description: "NOTE 1",
          user: {
            name: "John Doe",
          },
        },
        {
          description: "NOTE 2",
          user: {
            name: "Jane Smith",
          },
        },
      ],
    },
    {
      title: "TODO",
      items: [
        {
          description: "TODO 1",
          user: {
            name: "Emily Johnson",
          },
        },
      ],
    },
    {
      title: "IN PROGRESS",
      items: [],
    },
    {
      title: "DONE",
      items: [
        {
          description: "DONE 1",
          user: {
            name: "Michael Brown",
          },
        },
        {
          description: "DONE 2",
          user: {
            name: "Sophia Williams",
          },
        },
        {
          description: "DONE 3",
          user: {
            name: "Liam Davis",
          },
        },
      ],
    },
  ]

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
          <BoardItem key={title} title={title} listItems={items} />
        ))}
      </Stack>
    </Box>
  )
}
