"use client"
import { useMemo, useState } from "react"
import AccountCircleIcon from "@mui/icons-material/AccountCircle"
import {
  Box,
  Button,
  ButtonGroup,
  FormControl,
  InputLabel,
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

  const handleChange = (event: SelectChangeEvent) => {
    setUser(event.target.value)
  }

  const handleOpenModal = () => {
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
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
        flexDirection={{ xs: "column", md: "row" }}
        flexWrap="wrap"
        gap={2}
        justifyContent="space-between"
      >
        <FormControl sx={{ maxWidth: { md: 220 } }} size="small" fullWidth={true}>
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
        <ButtonGroup
          variant="contained"
          aria-label="Board button group"
          sx={{ maxWidth: { md: 580 } }}
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
