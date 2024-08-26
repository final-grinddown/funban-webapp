import { TThemeMode } from "@/utils/types"
import { INote, IRawNote } from "./interfaces"

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

/**
 * Normalizes an array of notes by converting them into the INote interface structure.
 *
 * This function takes an array of raw note objects (which may have a different structure)
 * and converts them to match the INote interface. It ensures that the note IDs and owner IDs
 * are numbers, and that the owner details (name and color) are directly accessible in the resulting
 * INote objects.
 *
 * @param notes - An array of raw note objects that may not conform to the INote interface.
 * @returns An array of normalized notes conforming to the INote interface.
 */
export function normalizeNotes(notes: IRawNote[]): INote[] {
  return notes.map((note) => ({
    id: Number(note.id),
    text: note.text,
    name: note.owner.name,
    owner_id: Number(note.owner.id),
    color: note.owner.color,
    state: note.state,
    index: note.index,
    updated: note.updated,
    created: note.created,
  }))
}
