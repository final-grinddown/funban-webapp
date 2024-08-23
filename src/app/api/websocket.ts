import { IRemoveUser } from "@/utils/interfaces"

export function createDeleteUser(id: number): string {
  const action: IRemoveUser = {
    type: "RemoveUser",
    id: id,
  }
  
  return JSON.stringify(action)
}
