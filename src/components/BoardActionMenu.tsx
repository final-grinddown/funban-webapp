import AddIcon from "@mui/icons-material/Add"
import CenterFocusWeakIcon from "@mui/icons-material/CenterFocusWeak"
import CheckIcon from "@mui/icons-material/Check"
import { Divider, ListItemIcon, ListItemText, Menu, MenuItem } from "@mui/material"

interface BoardActionsMenuProps {
  anchorEl: HTMLElement | null
  openMenu: boolean
  onClose: () => void
  onStartFocus: () => void
  onOpenModal: () => void
}

export function BoardActionsMenu({ anchorEl, openMenu, onClose, onStartFocus, onOpenModal }: BoardActionsMenuProps) {
  return (
    <Menu
      anchorEl={anchorEl}
      open={openMenu}
      onClose={onClose}
      MenuListProps={{
        "aria-labelledby": "open board actions menu",
      }}
    >
      <MenuItem onClick={() => console.log("create a new note")}>
        <ListItemIcon>
          <AddIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText>Create a new note</ListItemText>
      </MenuItem>
      <MenuItem onClick={onStartFocus}>
        <ListItemIcon>
          <CenterFocusWeakIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText>Start focus</ListItemText>
      </MenuItem>
      <Divider />
      <MenuItem onClick={onOpenModal}>
        <ListItemIcon>
          <CheckIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText>End status</ListItemText>
      </MenuItem>
    </Menu>
  )
}
