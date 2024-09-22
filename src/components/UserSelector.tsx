import AccountCircleIcon from "@mui/icons-material/AccountCircle"
import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from "@mui/material"
import { IUser } from "@/utils/interfaces"

interface UserSelectorProps {
  users: IUser[]
  selectedUser: string
  onChange: (event: SelectChangeEvent) => void
  isDisabled: boolean
}

export function UserSelector({ users, selectedUser, onChange, isDisabled }: UserSelectorProps) {
  return (
    <FormControl sx={{ maxWidth: { sm: 220 } }} size="small" fullWidth>
      <InputLabel id="select-current-user">Choose current user</InputLabel>
      <Select
        labelId="select-current-user"
        value={selectedUser}
        label="Choose current user"
        onChange={onChange}
        startAdornment={<AccountCircleIcon sx={{ marginRight: 1 }} />}
        disabled={isDisabled}
      >
        {users.map((user) => (
          <MenuItem key={user.id} value={user.id}>
            {user.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )
}
