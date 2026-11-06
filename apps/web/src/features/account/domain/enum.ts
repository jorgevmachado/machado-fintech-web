export const AccountTypesMap = {
  CHECKING : "CHECKING",
  SAVINGS : "SAVINGS",
  CASH : "CASH",
  INVESTMENT : "INVESTMENT",
  OTHER : "OTHER",
} as const;

export type AccountTypesEnum = typeof AccountTypesMap[keyof typeof AccountTypesMap];