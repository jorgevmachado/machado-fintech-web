export const ReceiptProcessingStatusMap = {
  FAILED: 'FAILED',
  RECEIVED: 'RECEIVED',
  PROCESSED: 'PROCESSED',
  PROCESSING: 'PROCESSING',
} as const;

export type ReceiptProcessingStatusEnum = typeof ReceiptProcessingStatusMap[keyof typeof ReceiptProcessingStatusMap];