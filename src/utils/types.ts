export type TThemeMode = "light" | "dark" | "system"
export type TUser = {
  avatar?: string
  name: string
}

export type TBoardItem = {
  description: string
  user: TUser
}
