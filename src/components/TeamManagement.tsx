import { useState } from "react"
import { Grid } from "@mui/material"
import { createDeleteUser } from "@/app/api/websocket"
import { useWebSocketContext } from "@/context/WebSocketProvider"
import { availableColors } from "@/utils/constants"
import { IUser } from "@/utils/interfaces"
import { ColorEditModal } from "./ColorEditModal"
import { DeleteConfirmationModal } from "./DeleteConfirmationModal"
import { NameEditModal } from "./NameEditModal"
import { TeamMemberCard } from "./TeamMemberCard"

interface Props {
  users: IUser[]
}

export function TeamManagement({ users }: Props) {
  const { sendMessage } = useWebSocketContext()
  const [editingNameId, setEditingNameId] = useState<number | null>(null)
  const [editingColorId, setEditingColorId] = useState<number | null>(null)
  const [deletingUserId, setDeletingUserId] = useState<number | null>(null)
  const [deletingUserName, setDeletingUserName] = useState<string | null>(null)
  const [currentName, setCurrentName] = useState<string>("")
  const [currentColor, setCurrentColor] = useState<string>("")
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

  const handleEditNameClick = (id: number, name: string) => {
    setEditingNameId(id)
    setCurrentName(name)
  }

  const handleEditColorClick = (id: number, color: string) => {
    const matchedColor = availableColors.find((c) => c.name.toLowerCase() === color.toLowerCase())?.name || color
    setEditingColorId(id)
    setCurrentColor(matchedColor)
  }

  const handleDeleteClick = (id: number, name: string) => {
    setDeletingUserId(id)
    setDeletingUserName(name)
    setIsDeleteModalOpen(true)
  }

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false)
    setDeletingUserId(null) // Reset only the userId, keep the userName
  }

  const handleSaveName = (newName: string) => {
    console.log(`Saving new name for user ID ${editingNameId}: ${newName}`)
    setEditingNameId(null)
  }

  const handleSaveColor = (newColor: string) => {
    console.log(`Saving new color for user ID ${editingColorId}: ${newColor}`)
    setEditingColorId(null)
  }

  const confirmDelete = () => {
    if (deletingUserId !== null) {
      const deleteMessage = createDeleteUser(deletingUserId)
      sendMessage(deleteMessage)
      handleCloseDeleteModal()
    }
  }

  return (
    <Grid container spacing={2}>
      {users.map(({ id, name, color }) => (
        <TeamMemberCard
          key={id}
          id={id}
          name={name}
          color={color}
          availableColors={availableColors}
          onEditName={() => handleEditNameClick(id, name)}
          onEditColor={() => handleEditColorClick(id, color)}
          onDelete={() => handleDeleteClick(id, name)}
        />
      ))}

      <NameEditModal
        isOpen={editingNameId !== null}
        initialName={currentName}
        onClose={() => setEditingNameId(null)}
        onSave={handleSaveName}
      />

      <ColorEditModal
        isOpen={editingColorId !== null}
        currentColor={currentColor}
        availableColors={availableColors}
        onClose={() => setEditingColorId(null)}
        onSave={handleSaveColor}
      />

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        userName={deletingUserName || ""}
        onClose={handleCloseDeleteModal}
        onConfirm={confirmDelete}
      />
    </Grid>
  )
}
