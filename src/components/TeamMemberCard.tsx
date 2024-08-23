import ChangeCircleIcon from "@mui/icons-material/ChangeCircle"
import DeleteIcon from "@mui/icons-material/Delete"
import EditIcon from "@mui/icons-material/Edit"
import { Box, Button, Card, Grid, IconButton, Typography, useTheme } from "@mui/material"

interface Props {
  id: number
  name: string
  color: string
  onEditName: (id: number) => void
  onEditColor: (id: number) => void
  onDelete: (id: number) => void
  availableColors: { name: string; value: string }[]
}

export function TeamMemberCard({ id, name, color, onEditName, onEditColor, onDelete, availableColors }: Props) {
  const theme = useTheme()

  return (
    <Grid item xs={12} sm={6} md={4} xl={3}>
      <Card variant="elevation" sx={{ padding: 2 }}>
        <Box>
          <Typography variant="h6" component="p" color={theme.palette.text.primary} gutterBottom={false}>
            Name:
          </Typography>
          <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
            <Typography variant="body1" component="p" color={theme.palette.text.primary} sx={{ flexGrow: 1 }}>
              {name}
            </Typography>
            <IconButton onClick={() => onEditName(id)} color="default">
              <EditIcon />
            </IconButton>
          </Box>

          <Typography variant="h6" component="p" color={theme.palette.text.primary} gutterBottom={false}>
            Color:
          </Typography>
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Typography variant="body1" component="p" textTransform="capitalize" color={theme.palette.text.primary}>
              {color}
            </Typography>
            <Box display="flex" alignItems="center" flexGrow={1}>
              <Box
                width={24}
                height={24}
                bgcolor={availableColors.find((c) => c.name.toLowerCase() === color)?.value ?? color}
                borderRadius="50%"
                ml={1}
              />
            </Box>
            <IconButton onClick={() => onEditColor(id)} color="default">
              <ChangeCircleIcon />
            </IconButton>
          </Box>
        </Box>
        <Box display="flex" justifyContent="flex-end" mt={2}>
          <Button variant="outlined" color="error" startIcon={<DeleteIcon />} onClick={() => onDelete(id)}>
            Delete team member
          </Button>
        </Box>
      </Card>
    </Grid>
  )
}
