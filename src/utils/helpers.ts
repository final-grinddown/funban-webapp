import { TThemeMode } from "@/utils/types"

export const isThemeMode = (value: unknown): value is TThemeMode => {
  return value === "light" || value === "dark"
}
