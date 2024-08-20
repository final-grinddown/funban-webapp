"use client"
import { useState } from "react"
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
import { IUser } from "@/utils/interfaces"

interface Props {
  users: IUser[]
}

export function BoardScreen({ users }: Props) {
  const [user, setUser] = useState(String(users[0].id))
  const handleChange = (event: SelectChangeEvent) => {
    setUser(event.target.value)
  }


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
          <Button color="error">End status</Button>
        </ButtonGroup>
      </Box>

      <Board />
    </>
  )
}
