import { Box, List, Typography, useTheme } from "@mui/material"
import { BoardItemCard } from "@/components/BoardItemCard"
import { TBoardItem } from "@/utils/types"

interface Props {
  title: string
  listItems: TBoardItem[]
}

export function BoardItem({ title, listItems }: Props) {
  const theme = useTheme()

  return (
    <Box bgcolor={theme.palette.background.paper} width="100%" minWidth={300}>
      <Box p={2} bgcolor={theme.palette.primary.main} sx={{ borderTopLeftRadius: 4, borderTopRightRadius: 4 }}>
        <Typography variant="h2">{title}</Typography>
      </Box>
      <List>
        {listItems.map(({ user, description }, index) => (
          <BoardItemCard key={index} description={description} user={user} />
        ))}
      </List>
    </Box>
  )
}
