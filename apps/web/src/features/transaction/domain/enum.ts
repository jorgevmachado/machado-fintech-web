export const TransactionStatusMap = {
  PENDING: "PENDING",
  SETTLED: "SETTLED",
  CANCELED: "CANCELED",
} as const;

export type TransactionStatusEnum = typeof TransactionStatusMap[keyof typeof TransactionStatusMap];

export const TransactionDirectionMap = {
  IN: "IN",
  OUT: "OUT",
} as const;

export type TransactionDirectionEnum = typeof TransactionDirectionMap[keyof typeof TransactionDirectionMap];
