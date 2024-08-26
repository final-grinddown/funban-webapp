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

export interface IUpdateNoteDetail {
  type: "UpdateNoteDetail"
  id: number
  text: string
  destination_status: string
}

export interface IUpdateNoteText {
  type: "UpdateNoteText"
  id: number
  text: string
}

export interface IHistoryItem {
  id: number
  created_at: string
  label: string
  snapshot: string
}
