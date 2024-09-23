import { Session } from "next-auth"
import { JWT } from "next-auth/jwt"

export interface IExtendedSession extends Session {
  accessToken?: string
}

export interface IExtendedJWT extends JWT {
  accessToken?: string
}

export interface IUser {
  id: number
  name: string
  color: string
}

export interface IUserAddedOperation {
  type: "UserAdded"
  user: IUser
}

export interface IPatchOperation {
  ops: IUserAddedOperation[]
}

export interface IWebSocketMessage {
  type: "Users" | "Notes" | "Patch"
  items?: IUser[]
  ops?: IPatchOperation[]
}

export interface IServerMessage {
  type: "Users" | "Notes" | "Patch"
}

export interface IAddUser {
  type: "AddUser"
  name: string
  color: string
}

export interface IUpdateUserName {
  type: "UpdateUserName"
  id: number
  name: string
}

export interface IUpdateUserColor {
  type: "UpdateUserColor"
  id: number
  color: string
}

export interface IRemoveUser {
  type: "RemoveUser"
  id: number
}

export interface INote {
  id: number
  text: string
  name: string
  owner_id: number
  color: string
  state: string
  index: number
  updated: string
  created: string
}

export interface IRawNote {
  id: string
  text: string
  state: "notes" | "todo" | "in_progress" | "done"
  index: number
  owner: {
    id: string
    name: string
    color: string
  }
  updated: string
  created: string
}

export interface IAddNote {
  type: "AddNote"
  owner: number
  state: string
  text: string
}

export interface IUpdateNote {
  type: "NoteUpdate"
  id: number
  updates: NoteUpdate[]
}

export interface NoteUpdate {
  target: "Text" | "Order"
  text?: string
  new_status?: string
}

export interface IUpdateNoteText {
  type: "UpdateNoteText"
  id: number
  text: string
}

export interface IRemoveNote {
  type: "RemoveNote"
  id: number
}

export interface ICloneNote {
  type: "CloneNote"
  id: number
}

export interface IUpdateReorderNote {
  type: "Reorder"
  moved_item_id: number
  destination_status: string
}

export interface IHistoryItem {
  id: number
  created_at: string
  label: string
  snapshot: string
  previous: {
    id: number
    label: string
  }
  next: {
    id: number
    label: string
  }
}

export interface ISnapshotData {
  label: string
  notes: IRawNote[]
}
