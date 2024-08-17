"use client"
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
  useTheme,
} from "@mui/material"
import AccountCircleIcon from "@mui/icons-material/AccountCircle"
import { useState } from "react"
import { Board } from "@/components/Board"

// TODO: remove mock with data from API
const users = [
  { id: 0, name: "Pepa" },
  { id: 10, name: "Jarda" },
  { id: 20, name: "Marie" },
  { id: 30, name: "Honza" },
]

export function BoardScreen() {
  const [user, setUser] = useState(String(users[0].id))
  const theme = useTheme()

  const handleChange = (event: SelectChangeEvent) => {
    setUser(event.target.value)
  }

  return (
    <>
      <Typography variant={"h1"}>Board</Typography>
      <Box
        mt={2}
        display={"flex"}
        flexDirection={{ xs: "column", md: "row" }}
        flexWrap={"wrap"}
        gap={2}
        justifyContent={"space-between"}
      >
        <FormControl sx={{ maxWidth: { md: 250 } }} size="small" fullWidth={true}>
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
          sx={{ maxWidth: { md: 600 } }}
          fullWidth={true}
        >
          <Button>Create a new note</Button>
          <Button color={"success"}>Start focus</Button>
          <Button color={"error"}>End status</Button>
        </ButtonGroup>
      </Box>

      <Board />
    </>
  )
}
