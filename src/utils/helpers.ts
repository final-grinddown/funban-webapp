import { TThemeMode } from "@/utils/types"

/**
 * Checks if a given value is a valid TThemeMode ("light" or "dark").
 *
 * @param value - The value to be checked.
 * @returns True if the value is "light" or "dark", otherwise false.
 */
export function isThemeMode(value: unknown): value is TThemeMode {
  return value === "light" || value === "dark"
}

/**
 * Matches a given color name against a list of available colors and returns the corresponding color value.
 *
 * This function normalizes the input color name and the names of the available colors by converting them
 * to lowercase and replacing spaces with underscores. It then attempts to find a match in the list
 * of available colors.
 *
 * @param color - The color name to match.
 * @param availableColors - An array of objects representing the available colors, where each object
 *                          contains a 'name' and a 'value' property.
 * @returns The color value (e.g., a hex code) if a match is found, otherwise undefined.
 */
export function matchColorName(color: string, availableColors: readonly { name: string; value: string }[]) {
  const normalizedColor = color.toLowerCase().replace(/ /g, "_")

  const matchedColor = availableColors.find((c) => {
    const normalizedAvailableColor = c.name.toLowerCase().replace(/ /g, "_")
    return normalizedAvailableColor === normalizedColor
  })

  return matchedColor?.value
}
