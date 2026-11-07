export const TransactionKindMap = {
  OPEN: "OPEN",
  CLOSED: "CLOSED",
} as const;

export type TransactionKindEnum = typeof TransactionKindMap[keyof typeof TransactionKindMap];

export const TransactionFrequencyUnitMap = {
  WEEK: "WEEK",
  MONTH: "MONTH",
  YEAR: "YEAR",
} as const;

export type TransactionFrequencyUnitEnum = typeof TransactionFrequencyUnitMap[keyof typeof TransactionFrequencyUnitMap];