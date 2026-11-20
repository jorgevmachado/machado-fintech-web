import type { TBaseFilter } from '@fintech/ui';

import { ReceiptProcessingStatusEnum } from './enum';
import { TTimestampedApiResource } from '@/src/contracts/finance-api/resources.contracts';

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