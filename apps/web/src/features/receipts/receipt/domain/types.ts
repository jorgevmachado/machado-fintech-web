import type { TBaseFilter } from '@fintech/ui';

import { ReceiptProcessingStatusEnum } from './enum';
import { TTimestampedApiResource } from '@/src/contracts/finance-api/resources.contracts';
import type { TPaymentApiData } from '@/src/features/receipts/payment/domain/types';
import type {
  TTransactionApiData ,
  TransactionDirectionEnum,
} from '@/src/features/transactions/transaction/domain';
import type {
  TTransactionSeriesApiData ,
  TransactionFrequencyUnitEnum,
} from '@/src/features/transactions/transaction-series/domain';
import type { TScheduledTransactionApiData } from '@/src/features/transactions/scheduled-transaction/domain';

import {
  TReceiptData ,
  TReceiptDataApiData ,
  TReceiptDataError,
} from './receipt-data';

export type TReceipt = {
  id: string;
  data?: TReceiptData;
  status: ReceiptProcessingStatusEnum
  file_name: string;
  file_type: string;
  file_size: string;
  created_at: Date;
  updated_at?: Date;
}

export type TReceiptApiData = Omit<TReceipt, 'created_at' | 'updated_at' | 'data'> & Omit<TTimestampedApiResource, 'name'> & {
  data?: TReceiptDataApiData;
};

export type TReceiptFilter = TBaseFilter;

export type TReceiptPersistApiData = {
  id: string;
  fine?: number;
  payer?: string;
  barcode?: string;
  due_date?: string;
  subcategory_id: string;
  discount?: number;
  interest?: number;
  beneficiary: string;
  description?: string;
  paid_amount: number;
  payment_date?: string;
  total_charges?: number;
  authentication?: string;
  transaction_id?: string;
  effective_payer?: string;
  document_amount?: number;
  source_institution: string;
  destination_institution?: string;
}

export type TReceiptPersist = Omit<TReceiptPersistApiData, 'due_date' | 'payment_date'> & {
  due_date?: Date;
  payment_date?: Date;
}

/**
 * Tipo de lançamento escolhido na confirmação. Espelha o `transaction_kind` da
 * API: avulso, parcelamento (série fechada) ou recorrência (série aberta).
 */
export const ReceiptTransactionKindMap = {
  SIMPLE: 'SIMPLE',
  INSTALLMENT: 'INSTALLMENT',
  RECURRING: 'RECURRING',
} as const;

export type ReceiptTransactionKindEnum =
  typeof ReceiptTransactionKindMap[keyof typeof ReceiptTransactionKindMap];

/** Confirmação não sobrescreve o lançamento existente sem consentimento explícito. */
export type TReceiptConfirmOverwrite = {
  overwrite?: boolean;
}

/**
 * Payload do confirm: os campos do recibo mais o lançamento a criar. Os campos
 * de parcelamento e de recorrência são mutuamente exclusivos na API, por isso
 * ficam opcionais aqui — o parser do BFF e o schema da API validam a combinação.
 */
export type TReceiptConfirmApiData = TReceiptPersistApiData & TReceiptConfirmOverwrite & {
  name: string;
  account_id: string;
  direction?: TransactionDirectionEnum;
  expected_on?: string;
  credit_card_id?: string;
  note?: string;
  transaction_kind?: ReceiptTransactionKindEnum;
  installment_index?: number;
  installments_total?: number;
  frequency_unit?: TransactionFrequencyUnitEnum;
  frequency_interval?: number;
}

export type TReceiptConfirm = Omit<TReceiptConfirmApiData, 'due_date' | 'payment_date' | 'expected_on'> & {
  due_date?: Date;
  payment_date?: Date;
  expected_on?: Date;
}

/** Envelope devolvido pelo confirm: pagamento mais o lançamento criado. */
export type TReceiptConfirmResultApiData = {
  payment: TPaymentApiData;
  transaction?: TTransactionApiData | null;
  series?: TTransactionSeriesApiData | null;
  occurrence?: TScheduledTransactionApiData | null;
}

/** Conflito discriminado do confirm: só `OCCURRENCE_EXISTS` aceita sobrescrita. */
export type TReceiptConfirmConflictType =
  | 'SERIES_EXISTS'
  | 'OCCURRENCE_EXISTS'
  | 'RECEIPT_ALREADY_PROCESSED';

export type TReceiptConfirmConflictApiData = {
  type: TReceiptConfirmConflictType;
  existing?: Record<string, unknown> | null;
  occurrence?: Record<string, unknown> | null;
}

export type TReceiptUpload = Omit<TReceipt, 'file_name' | 'file_type' | 'extracted_data'> & {
  data?: TReceiptData;
  errors: Array<TReceiptDataError>;
  file_name?: string;
  file_type?: string;
  error_message?: string;
};

export type TReceiptBatch = {
  total: number;
  items: Array<TReceiptUpload>;
  failed: number;
  received: number;
  processed: number;
  processing: number;
};