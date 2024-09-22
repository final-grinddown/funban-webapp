"use client"
import { SyntheticEvent, useMemo, useState } from "react"
import AccountCircleIcon from "@mui/icons-material/AccountCircle"
import AddIcon from "@mui/icons-material/Add"
import ArrowBackIcon from "@mui/icons-material/ArrowBack"
import ArrowForwardIcon from "@mui/icons-material/ArrowForward"
import CenterFocusWeakIcon from "@mui/icons-material/CenterFocusWeak"
import CheckIcon from "@mui/icons-material/Check"
import SettingsIcon from "@mui/icons-material/Settings"
import {
  Box,
  Button,
  ButtonGroup,
  Fab,
  FormControl,
  InputLabel,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography,
  Zoom,
} from "@mui/material"
import { Board } from "@/components/Board"
import { EndStatusModal } from "@/components/EndStatusModal"
import { INote, IUser } from "@/utils/interfaces"
import { useFocusStateStore } from "@/utils/store"

interface Props {
  users: IUser[]
  notes: INote[]
  accessToken?: string
}

export function BoardScreen({ users, notes, accessToken }: Props) {
  const [user, setUser] = useState(String(users[0].id))
  const { isFocus, currentUser, setIsFocus, setCurrentUser } = useFocusStateStore()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [shouldRenderFocus, setShouldRenderFocus] = useState(false)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const openMenu = Boolean(anchorEl)
  const currentUserIndex = users.findIndex((u) => u.id.toString() === user)
  const getCurrentUserIndex = () => {
    return users.findIndex((user) => user.name === currentUser)
  }

  const handleChange = (event: SelectChangeEvent) => {
    const selectedUserId = event.target.value // This is the ID selected from the dropdown, usually a string
    setUser(selectedUserId)
    const selectedUserObject = users.find((u) => u.id === parseInt(selectedUserId))

    if (selectedUserObject) {
      setCurrentUser(selectedUserObject.name)
    }
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

  const handleStartFocus = () => {
    setIsFocus(true)
    setShouldRenderFocus(true)

    const currentUserObject = users[currentUserIndex]

    if (currentUserObject) {
      setCurrentUser(currentUserObject.name)
    }

    if (openMenu) {
      handleCloseMenu()
    }
  }

  const handleEndFocus = () => {
    setIsFocus(false)
    setTimeout(() => {
      setShouldRenderFocus(false)
    }, 500)
  }

  const handlePrevUser = () => {
    const currentIndex = getCurrentUserIndex()
    const prevIndex = (currentIndex - 1 + users.length) % users.length
    setUser(users[prevIndex].id.toString())
    setCurrentUser(users[prevIndex].name)
  }

  const handleNextUser = () => {
    const currentIndex = getCurrentUserIndex()
    const nextIndex = (currentIndex + 1) % users.length
    setUser(users[nextIndex].id.toString())
    setCurrentUser(users[nextIndex].name)
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
          <MenuItem onClick={handleStartFocus} disabled={isFocus}>
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
          <Button color="success" onClick={handleStartFocus} disabled={isFocus}>
            Start focus
          </Button>
          <Button color="error" onClick={handleOpenModal}>
            End status
          </Button>
        </ButtonGroup>
      </Box>

      <Board notes={notes} isEditable={true} />

      <EndStatusModal isOpen={isModalOpen} notes={snapshot} onClose={handleCloseModal} accessToken={accessToken} />

      {shouldRenderFocus && (
        <Zoom in={isFocus} timeout={{ enter: 350, exit: 500 }} unmountOnExit>
          <Box
            className="mui-fixed"
            sx={{
              bottom: 20,
              left: { xs: "50%", sm: "auto" },
              transform: { xs: "translateX(-50%)", sm: "none" },
              right: { xs: "auto", sm: 20 },
            }}
            display="flex"
            flexWrap="wrap"
            justifyContent={{ xs: "center", sm: "flex-end" }}
            width="100%"
            gap={2}
            px={2}
            position="fixed"
          >
            <Fab variant="extended" onClick={handlePrevUser}>
              <ArrowBackIcon fontSize="small" sx={{ mr: 1 }} />
              Prev user
            </Fab>
            <Fab variant="extended" onClick={handleNextUser}>
              <ArrowForwardIcon fontSize="small" sx={{ mr: 1 }} />
              Next user
            </Fab>
            <Fab variant="extended" color="success" onClick={handleEndFocus}>
              <CheckIcon fontSize="small" sx={{ mr: 1 }} />
              End focus
            </Fab>
          </Box>
        </Zoom>
      )}
    </>
  )
}
