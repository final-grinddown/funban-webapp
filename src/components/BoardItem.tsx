import { Box, List, ListItem, Typography, useTheme } from "@mui/material"

interface Props {
  title: string
  listItems: string[]
}

export function BoardItem({ title, listItems }: Props) {
  const theme = useTheme()

  return (
    <Box bgcolor={theme.palette.background.paper} width={"100%"} minWidth={{ xs: 300, md: 200 }}>
      <Box p={2} bgcolor={theme.palette.primary.main}>
        <Typography variant={"h2"}>{title}</Typography>
      </Box>
      <List>
        {listItems.map((item) => (
          <ListItem key={item}>{item}</ListItem>
        ))}
      </List>
    </Box>
  )
}
