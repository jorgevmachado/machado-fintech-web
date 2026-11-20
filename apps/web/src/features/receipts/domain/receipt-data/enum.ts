export const ReceiptFieldStatusMap = {
  FOUND: 'FOUND',
  NOT_FOUND: 'NOT_FOUND',
  AMBIGUOUS: 'AMBIGUOUS',
} as const;

export type ReceiptFieldStatusEnum = typeof ReceiptFieldStatusMap[keyof typeof ReceiptFieldStatusMap];