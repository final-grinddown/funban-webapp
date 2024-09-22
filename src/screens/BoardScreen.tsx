"use client"
import { SyntheticEvent, useMemo, useState } from "react"
import AccountCircleIcon from "@mui/icons-material/AccountCircle"
import AddIcon from "@mui/icons-material/Add"
import CenterFocusWeakIcon from "@mui/icons-material/CenterFocusWeak"
import CheckIcon from "@mui/icons-material/Check"
import SettingsIcon from "@mui/icons-material/Settings"
import {
  Box,
  Button,
  ButtonGroup,
  FormControl,
  InputLabel,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography,
} from "@mui/material"
import { Board } from "@/components/Board"
import { EndStatusModal } from "@/components/EndStatusModal"
import { INote, IUser } from "@/utils/interfaces"

interface Props {
  users: IUser[]
  notes: INote[]
  accessToken?: string
}

export function BoardScreen({ users, notes, accessToken }: Props) {
  const [user, setUser] = useState(String(users[0].id))
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const openMenu = Boolean(anchorEl)

  const handleChange = (event: SelectChangeEvent) => {
    setUser(event.target.value)
  }

  const handleOpenModal = () => {
    setIsModalOpen(true)

    if (openMenu) {
      handleCloseMenu()
    }
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
  }

  const handleOpenMenu = (event: SyntheticEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleCloseMenu = () => {
    setAnchorEl(null)
  }

  const snapshot = useMemo(() => {
    return notes.map((note) => ({
      id: note.id.toString(),
      text: note.text,
      state: note.state as "notes" | "todo" | "in_progress" | "done",
      index: note.index,
      owner: {
        id: note.owner_id.toString(),
        name: note.name,
        color: note.color,
      },
      updated: note.updated,
      created: note.created,
    }))
  }, [notes])

  return (
    <>
      <Typography variant="h1">Board</Typography>
      <Box
        mt={2}
        display="flex"
        flexDirection={{ xs: "column", sm: "row" }}
        flexWrap="wrap"
        gap={2}
        justifyContent="space-between"
      >
        <FormControl sx={{ maxWidth: { sm: 220 } }} size="small" fullWidth={true}>
          <InputLabel id="select-current-user">Choose current user</InputLabel>
          <Select
            labelId="select-current-user"
            value={user}
            label="Choose current user"
            onChange={handleChange}
            startAdornment={<AccountCircleIcon sx={{ marginRight: 1 }} />}
          >
            {users.map((user) => (
              <MenuItem key={user.id} value={user.id}>
                {user.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button
          variant="contained"
          sx={{ display: { md: "none" } }}
          onClick={handleOpenMenu}
          startIcon={<SettingsIcon />}
        >
          Board actions
        </Button>
        <Menu
          anchorEl={anchorEl}
          open={openMenu}
          onClose={handleCloseMenu}
          MenuListProps={{
            "aria-labelledby": "open board actions menu",
          }}
        >
          <MenuItem
            onClick={() => {
              console.log("create a new note")
              handleCloseMenu()
            }}
          >
            <ListItemIcon>
              <AddIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Create a new note</ListItemText>
          </MenuItem>
          <MenuItem
            onClick={() => {
              console.log("Start focus")
              handleCloseMenu()
            }}
          >
            <ListItemIcon>
              <CenterFocusWeakIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Start focus</ListItemText>
          </MenuItem>
          <MenuItem onClick={handleOpenModal}>
            <ListItemIcon>
              <CheckIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>End status</ListItemText>
          </MenuItem>
        </Menu>
        <ButtonGroup
          variant="contained"
          aria-label="Board button group"
          sx={{ maxWidth: { md: 600 }, display: { xs: "none", md: "flex" } }}
          fullWidth={true}
        >
          <Button>Create a new note</Button>
          <Button color="success">Start focus</Button>
          <Button color="error" onClick={handleOpenModal}>
            End status
          </Button>
        </ButtonGroup>
      </Box>

      <Board notes={notes} isEditable={true} />

      <EndStatusModal isOpen={isModalOpen} notes={snapshot} onClose={handleCloseModal} accessToken={accessToken} />
    </>
  )
}
