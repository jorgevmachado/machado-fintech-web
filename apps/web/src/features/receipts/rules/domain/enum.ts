export const ReceiptFieldNamesMap = {
  fine: 'fine',
  payer: 'payer',
  barcode: 'barcode',
  due_date: 'due_date',
  discount: 'discount',
  interest: 'interest',
  category: 'category',
  description: 'description',
  paid_amount: 'paid_amount',
  beneficiary: 'beneficiary',
  payment_date: 'payment_date',
  total_charges: 'total_charges',
  authentication: 'authentication',
  transaction_id: 'transaction_id',
  effective_payer: 'effective_payer',
  document_amount: 'document_amount',
  source_institution: 'source_institution',
  destination_institution: 'destination_institution',
} as const;

export type TReceiptFieldName =
  (typeof ReceiptFieldNamesMap)[keyof typeof ReceiptFieldNamesMap];

export const ReceiptFieldStrategiesMap = {
  REGEX: 'regex',
  CONSTANT: 'constant',
  NOT_FOUND: 'not_found',
  SOURCE: 'source',
} as const;

export type TReceiptFieldStrategy =
  (typeof ReceiptFieldStrategiesMap)[keyof typeof ReceiptFieldStrategiesMap];

export const ReceiptParsersMap = {
  TEXT: 'text',
  DECIMAL_BR: 'decimal_br',
  DATE_NUMERIC_BR: 'date_numeric_br',
  DATE_MONTH_NAME_PT_BR: 'date_month_name_pt_br',
} as const;

export type TReceiptParser = (typeof ReceiptParsersMap)[keyof typeof ReceiptParsersMap];

export const ReceiptNormalizationsMap = {
  STRIP: 'strip',
  REMOVE_WHITESPACE: 'remove_whitespace',
  OCR_DAY: 'ocr_day',
} as const;

export type TReceiptNormalization =
  (typeof ReceiptNormalizationsMap)[keyof typeof ReceiptNormalizationsMap];

/** Espelha `MONEY_FIELDS` / `DATE_FIELDS` de `app/domain/receipt/rules/enums.py`. */
export const MONEY_FIELDS: ReadonlyArray<TReceiptFieldName> = [
  'fine',
  'discount',
  'interest',
  'paid_amount',
  'total_charges',
  'document_amount',
];

export const DATE_FIELDS: ReadonlyArray<TReceiptFieldName> = [
  'due_date',
  'payment_date',
];

/** Parsers que o backend aceita para cada campo (`ReceiptFieldRuleCreateSchema`). */
export function allowedParsersFor(fieldName: TReceiptFieldName): TReceiptParser[] {
  if (MONEY_FIELDS.includes(fieldName)) return [ReceiptParsersMap.DECIMAL_BR];
  if (DATE_FIELDS.includes(fieldName)) {
    return [ReceiptParsersMap.DATE_NUMERIC_BR, ReceiptParsersMap.DATE_MONTH_NAME_PT_BR];
  }
  return [ReceiptParsersMap.TEXT];
}

/** `fallback_field` só existe para estes dois campos. */
export const FALLBACK_FIELDS: Partial<
  Record<TReceiptFieldName, 'payer' | 'paid_amount'>
> = {
  effective_payer: 'payer',
  document_amount: 'paid_amount',
};

/** `remove_whitespace` só no barcode; `ocr_day` só com parser de mês por nome. */
export function allowedNormalizationsFor(
  fieldName: TReceiptFieldName,
  parser: TReceiptParser,
): TReceiptNormalization[] {
  const normalizations: TReceiptNormalization[] = [ReceiptNormalizationsMap.STRIP];
  if (fieldName === 'barcode') {
    normalizations.push(ReceiptNormalizationsMap.REMOVE_WHITESPACE);
  }
  if (parser === ReceiptParsersMap.DATE_MONTH_NAME_PT_BR) {
    normalizations.push(ReceiptNormalizationsMap.OCR_DAY);
  }
  return normalizations;
}

/** `constant` e `source` só valem para `source_institution`. */
export function allowedStrategiesFor(
  fieldName: TReceiptFieldName,
): TReceiptFieldStrategy[] {
  const strategies: TReceiptFieldStrategy[] = [
    ReceiptFieldStrategiesMap.REGEX,
    ReceiptFieldStrategiesMap.NOT_FOUND,
  ];
  if (fieldName === 'source_institution') {
    strategies.push(
      ReceiptFieldStrategiesMap.SOURCE,
      ReceiptFieldStrategiesMap.CONSTANT,
    );
  }
  return strategies;
}