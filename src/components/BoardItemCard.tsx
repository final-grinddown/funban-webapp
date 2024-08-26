import { useState } from "react"
import EditNoteIcon from "@mui/icons-material/EditNote"
import { Avatar, Card, CardContent, CardHeader, IconButton, Typography } from "@mui/material"
import { alpha, useTheme } from "@mui/material/styles"
import { availableColors } from "@/utils/constants"
import { matchColorName } from "@/utils/helpers"
import { INote } from "@/utils/interfaces"
import { EditNoteModal } from "./EditNoteModal"

interface Props extends INote {
  isEditable: boolean
  avatarUrl?: string
}

export function BoardItemCard({
  text,
  name,
  color,
  owner_id,
  state,
  index,
  updated,
  created,
  avatarUrl,
  id,
  isEditable,
}: Props) {
  const theme = useTheme()
  const matchedColor = matchColorName(color, availableColors) || "#000000"
  const avatarInitial = name.charAt(0).toUpperCase()
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleOpenModal = () => {
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
  }

  // Get a contrast color based on the background color
  const contrastColor = theme.palette.getContrastText(matchedColor)

  // Determine which date to show
  const dateToShow = updated
    ? `Updated at ${new Date(updated).toLocaleString()}`
    : `Created at ${new Date(created).toLocaleString()}`

  return (
    <>
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
            </Typography>
          }
          subheader={
            <Typography variant="body2" sx={{ color: alpha(contrastColor, 0.7) }}>
              {dateToShow}
            </Typography>
          }
          action={
            isEditable && (
              <IconButton
                sx={{ color: contrastColor, border: `2px solid ${alpha(contrastColor, 0.75)}` }}
                onClick={handleOpenModal}
              >
                <EditNoteIcon />
              </IconButton>
            )
          }
          sx={{ bgcolor: alpha(matchedColor, 0.75) }}
        />
        <CardContent sx={{ p: 2 }}>
          <Typography variant="body1" sx={{ whiteSpace: "pre-line" }}>
            {text}
          </Typography>
        </CardContent>
      </Card>
      <EditNoteModal
        isOpen={isModalOpen}
        note={{ id, text, name, color, owner_id, state, index, updated, created }}
        onClose={handleCloseModal}
      />
    </>
  )
}
