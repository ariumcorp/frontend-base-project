export const Slice = {
  Theme: "themeSlice",
  Language: "languageSlice",
  Auth: "authSlice",
  Alert: "alertSlice",
  Loading: "loadingSlice",
} as const;

export type Slice = (typeof Slice)[keyof typeof Slice];

export const ThemeCode = {
  Dark: "dark",
  Light: "light",
} as const;

export type ThemeCode = (typeof ThemeCode)[keyof typeof ThemeCode];

export const PagePath = {
  Root: "/",
  Login: "/login",
  Dashboard: "/dashboard",
} as const;

export type PagePath = (typeof PagePath)[keyof typeof PagePath];

export const Severity = {
  Success: "success",
  Info: "info",
  Warning: "warning",
  Error: "error",
} as const;

export type Severity = (typeof Severity)[keyof typeof Severity];

export const Orientation = {
  Vertical: "vertical",
  Horizontal: "horizontal",
} as const;

export type Orientation = (typeof Orientation)[keyof typeof Orientation];

export const AccessType = {
  Menu: "menu",
  Group: "group",
  Option: "option",
} as const;

export type AccessType = (typeof AccessType)[keyof typeof AccessType];

export const LanguageCode = {
  Default: "en",
} as const;

export type LanguageCode = (typeof LanguageCode)[keyof typeof LanguageCode];
