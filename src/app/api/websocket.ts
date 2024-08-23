import { IRemoveUser, IUpdateUserColor } from "@/utils/interfaces"

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
