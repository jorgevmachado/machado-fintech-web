export const StatementSourceMap = {
  /** Stored transaction, with its own identifier. */
  TRANSACTION: "TRANSACTION",
  /** Occurrence of a series that was already stored, usually because it was changed. */
  SCHEDULED: "SCHEDULED",
  /** Occurrence the series still generates: it has no identifier until it is stored. */
  PROJECTED: "PROJECTED"
} as const;

export type StatementSourceEnum = typeof StatementSourceMap[keyof typeof StatementSourceMap];
