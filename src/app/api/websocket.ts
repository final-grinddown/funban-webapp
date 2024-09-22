import {
  IAddUser,
  ICloneNote,
  IRemoveNote,
  IRemoveUser,
  IUpdateNote,
  IUpdateNoteText,
  IUpdateReorderNote,
  IUpdateUserColor,
  IUpdateUserName,
} from "@/utils/interfaces"

export function createAddUserMessage(name: string, color: string): string {
  const action: IAddUser = {
    type: "AddUser",
    name,
    color,
  }

  return JSON.stringify(action)
}

export function createUpdateUserNameMessage(id: number, name: string): string {
  const action: IUpdateUserName = {
    type: "UpdateUserName",
    id,
    name,
  }

  return JSON.stringify(action)
}

export function createUpdateUserColorMessage(id: number, color: string): string {
  const action: IUpdateUserColor = {
    type: "UpdateUserColor",
    id: id,
    color: color,
  }

  return JSON.stringify(action)
}

export function createDeleteUser(id: number): string {
  const action: IRemoveUser = {
    type: "RemoveUser",
    id: id,
  }

  return JSON.stringify(action)
}

export function createUpdateNote(id: string, text: string, destinationStatus: string): string {
  const action: IUpdateNote = {
    type: "NoteUpdate",
    id: parseInt(id),
    updates: [
      {
        target: "Text",
        text: text,
      },
      {
        target: "Order",
        new_status: destinationStatus,
      },
    ],
  }

  return JSON.stringify(action)
}

export function createUpdateNoteText(id: string, text: string): string {
  const action: IUpdateNoteText = {
    type: "UpdateNoteText",
    id: parseInt(id),
    text,
  }

  return JSON.stringify(action)
}

export function createUpdateNoteReorder(id: string, destinationStatus: string): string {
  const action: IUpdateReorderNote = {
    type: "Reorder",
    moved_item_id: parseInt(id),
    destination_status: destinationStatus,
  }

  return JSON.stringify(action)
}

export function createDeleteNote(id: string): string {
  const action: IRemoveNote = {
    type: "RemoveNote",
    id: parseInt(id),
  }

  return JSON.stringify(action)
}

export function createCloneNote(id: string): string {
  const action: ICloneNote = {
    type: "CloneNote",
    id: parseInt(id),
  }

  return JSON.stringify(action)
}
