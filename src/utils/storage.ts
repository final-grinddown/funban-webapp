import { TThemeMode } from "@/utils/types"
import { isThemeMode } from "./helpers"
import { IColumn } from "./interfaces"

const THEME_KEY = "funban-theme"
const USER_EMAIL_KEY = "funban-user-email"
const HEADER_CONFIG_KEY = "funban-header-config";
const ORDER_KEY = "funban-column-order";

export const getStoredTheme = (): TThemeMode | null => {
  const storedTheme = window.localStorage.getItem(THEME_KEY)

  return isThemeMode(storedTheme) ? storedTheme : null
}

export const setStoredTheme = (mode: TThemeMode): void => {
  window.localStorage.setItem(THEME_KEY, mode)
  document.documentElement.style.setProperty("color-scheme", mode)
}

export const removeStoredTheme = (): void => {
  window.localStorage.removeItem(THEME_KEY)
  const prefersDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches
  const systemMode = prefersDarkMode ? "dark" : "light"
  document.documentElement.style.setProperty("color-scheme", systemMode)
}

export const getStoredUserEmail = (): string | null => {
  return window.localStorage.getItem(USER_EMAIL_KEY)
}

export const setStoredUserEmail = (email: string): void => {
  window.localStorage.setItem(USER_EMAIL_KEY, email)
}

export const removeStoredUserEmail = (): void => {
  window.localStorage.removeItem(USER_EMAIL_KEY)
}

export const getStoredHeaderOption = (): string => {
  const savedOption = localStorage.getItem(HEADER_CONFIG_KEY);
  return savedOption ? savedOption : "updated_only";
};

export const setStoredHeaderOption = (option: string): void => {
  localStorage.setItem(HEADER_CONFIG_KEY, option);
};

export const getStoredColumnOrder = (): IColumn[] | null => {
  const savedOrder = window.localStorage.getItem(ORDER_KEY);
  return savedOrder ? JSON.parse(savedOrder) : null;
};

export const setStoredColumnOrder = (order: IColumn[]): void => {
  window.localStorage.setItem(ORDER_KEY, JSON.stringify(order));
};
