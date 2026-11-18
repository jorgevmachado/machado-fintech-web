export const TransactionStatusMap = {
  PENDING: "PENDING",
  SETTLED: "SETTLED",
  CANCELED: "CANCELED",
} as const;

export type TransactionStatusEnum = typeof TransactionStatusMap[keyof typeof TransactionStatusMap];

export function isTransactionStatus(value: unknown): value is TransactionStatusEnum {
  return (Object.values(TransactionStatusMap) as unknown[]).includes(value);
}

export const TransactionDirectionMap = {
  IN: "IN",
  OUT: "OUT",
} as const;

export type TransactionDirectionEnum = typeof TransactionDirectionMap[keyof typeof TransactionDirectionMap];


export function isDirection(value: unknown): value is TransactionDirectionEnum {
  return (Object.values(TransactionDirectionMap) as unknown[]).includes(value);
}
