import { IAddUser, IRemoveUser, IUpdateUserColor, IUpdateUserName } from "@/utils/interfaces"

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
