import MoreVertIcon from "@mui/icons-material/MoreVert"
import { Avatar, Card, CardContent, CardHeader, IconButton, ListItem, useTheme } from "@mui/material"
import Image from "next/image"
import { TBoardItem } from "@/utils/types"

interface Props {
  user: TBoardItem["user"]
  description: TBoardItem["description"]
}

export function BoardItemCard({ description, user }: Props) {
  const theme = useTheme()
  
  return (
    <ListItem>
      <Card variant="elevation" sx={{ width: "100%" }}>
        <CardHeader
          title={user.name}
          sx={{ bgcolor: theme.palette.success.dark, py: 1 }}
          avatar={
            <Avatar aria-label="issue card" sx={{ width: 32, height: 32 }}>
              {user.avatar ? <Image src={user.avatar} alt={user.name} /> : user.name.charAt(0)}
            </Avatar>
          }
          action={
            <IconButton aria-label="settings">
              <MoreVertIcon />
            </IconButton>
          }
        />
        <CardContent sx={{ p: 2 }}>{description}</CardContent>
      </Card>
    </ListItem>
  )
}
