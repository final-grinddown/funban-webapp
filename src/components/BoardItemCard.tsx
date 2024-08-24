import EditNoteIcon from "@mui/icons-material/EditNote"
import { Avatar, Card, CardContent, CardHeader, IconButton, Typography } from "@mui/material"
import { alpha, useTheme } from "@mui/material/styles"
import { availableColors } from "@/utils/constants"
import { matchColorName } from "@/utils/helpers"

interface Props {
  text: string
  name: string
  color: string
  owner_id: number
  state: string
  index: number
  updated: Date
  created: Date
  avatarUrl?: string
}

export function BoardItemCard({ text, name, color, owner_id, state, index, updated, created, avatarUrl }: Props) {
  const theme = useTheme()
  const matchedColor = matchColorName(color, availableColors) || "#000000"
  const avatarInitial = name.charAt(0).toUpperCase()

  // Get a contrast color based on the background color
  const contrastColor = theme.palette.getContrastText(matchedColor)

  return (
    <Card elevation={4} sx={{ m: 2 }}>
      <CardHeader
        avatar={<Avatar src={avatarUrl}>{!avatarUrl && avatarInitial}</Avatar>}
        title={
          <Typography
            variant="h6"
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              color: alpha(contrastColor, 0.85),
            }}
          >
            {name}
            <IconButton sx={{ color: contrastColor, border: `2px solid ${alpha(contrastColor, 0.75)}` }}>
              <EditNoteIcon />
            </IconButton>
          </Typography>
        }
        sx={{ bgcolor: alpha(matchedColor, 0.75) }}
      />
      <CardContent sx={{ p: 2 }}>
        <Typography variant="body1" sx={{ whiteSpace: "pre-line" }}>
          {text}
        </Typography>
      </CardContent>
    </Card>
  )
}
