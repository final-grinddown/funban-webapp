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

export interface IRemoveUser {
  type: "RemoveUser"
  id: number
}
