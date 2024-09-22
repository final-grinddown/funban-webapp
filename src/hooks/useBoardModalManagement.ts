import { SyntheticEvent, useState } from "react"

export function useBoardModalManagement() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const handleOpenModal = () => setIsModalOpen(true)
  const handleCloseModal = () => setIsModalOpen(false)

  const handleOpenMenu = (event: SyntheticEvent<HTMLButtonElement>) => setAnchorEl(event.currentTarget)
  const handleCloseMenu = () => setAnchorEl(null)

  return {
    isModalOpen,
    anchorEl,
    openMenu: Boolean(anchorEl),
    handleOpenModal,
    handleCloseModal,
    handleOpenMenu,
    handleCloseMenu,
  }
}
