import { Box, List, Typography } from "@mui/material"
import { INote } from "@/utils/interfaces"
import { BoardItemCard } from "./BoardItemCard"

interface Props {
  title: string
  items: INote[]
  isEditable: boolean
}

export function BoardColumn({ title, items, isEditable }: Props) {
  return (
    <Box bgcolor="background.paper" width="100%" minWidth={300}>
      <Box p={2} bgcolor="primary.main" sx={{ borderTopLeftRadius: 4, borderTopRightRadius: 4 }}>
        <Typography variant="h2">{title}</Typography>
      </Box>
      <List>
        {items.map((item) => (
          <BoardItemCard key={item.id} {...item} isEditable={isEditable} />
        ))}
      </List>
    </Box>
  )
}
