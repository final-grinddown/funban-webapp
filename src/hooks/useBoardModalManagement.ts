import { SyntheticEvent, useState } from "react"

export function useBoardModalManagement() {
  const [isAddNewNoteModalOpen, setIsAddNewNoteModalOpen] = useState(false)
  const [isEndStatusModalOpen, setIsEndStatusModalOpen] = useState(false)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const handleOpenAddNewNoteModal = () => setIsAddNewNoteModalOpen(true)
  const handleCloseAddNewNoteModal = () => setIsAddNewNoteModalOpen(false)
  const handleOpenEndStatusModal = () => setIsEndStatusModalOpen(true)
  const handleCloseEndStatusModal = () => setIsEndStatusModalOpen(false)

  const handleOpenMenu = (event: SyntheticEvent<HTMLButtonElement>) => setAnchorEl(event.currentTarget)
  const handleCloseMenu = () => setAnchorEl(null)

  return {
    isEndStatusModalOpen,
    isAddNewNoteModalOpen,
    anchorEl,
    openMenu: Boolean(anchorEl),
    handleOpenAddNewNoteModal,
    handleCloseAddNewNoteModal,
    handleOpenEndStatusModal,
    handleCloseEndStatusModal,
    handleOpenMenu,
    handleCloseMenu,
  }
}
