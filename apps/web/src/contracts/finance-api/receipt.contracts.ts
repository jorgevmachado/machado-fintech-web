import type { TPaginatedListResponse } from '@fintech/shared';

export type EReceiptProcessingStatus =
  | 'FAILED'
  | 'RECEIVED'
  | 'PROCESSED'
  | 'PROCESSING';

export type EReceiptFieldStatus = 'FOUND' | 'NOT_FOUND' | 'AMBIGUOUS';

export type TReceiptDataError = {
  field: string;
  status: EReceiptFieldStatus;
};

export type ReceiptApiNumber = number | string | null;
export type ReceiptApiDate = string | null;

export type TReceiptApiDataField<T> = {
  value?: T | null;
  status: EReceiptFieldStatus;
};

export type TReceiptApiData = {
  fine: TReceiptApiDataField<ReceiptApiNumber>;
  payer: TReceiptApiDataField<string>;
  barcode: TReceiptApiDataField<string>;
  due_date: TReceiptApiDataField<ReceiptApiDate>;
  discount: TReceiptApiDataField<ReceiptApiNumber>;
  category: TReceiptApiDataField<string>;
  interest: TReceiptApiDataField<ReceiptApiNumber>;
  description: TReceiptApiDataField<string>;
  paid_amount: TReceiptApiDataField<ReceiptApiNumber>;
  beneficiary: TReceiptApiDataField<string>;
  payment_date: TReceiptApiDataField<ReceiptApiDate>;
  total_charges: TReceiptApiDataField<ReceiptApiNumber>;
  authentication: TReceiptApiDataField<string>;
  transaction_id: TReceiptApiDataField<string>;
  effective_payer: TReceiptApiDataField<string>;
  document_amount: TReceiptApiDataField<ReceiptApiNumber>;
  source_institution: TReceiptApiDataField<string>;
  destination_institution: TReceiptApiDataField<string>;
};

export type ReceiptApiData = {
  id: string;
  file_name: string;
  file_type: string;
  file_size: string;
  created_at: string;
  updated_at?: string | null;
  processing_status: EReceiptProcessingStatus;
  extracted_data: TReceiptApiData;
};

export type ReceiptApiList =
  | Array<ReceiptApiData>
  | TPaginatedListResponse<ReceiptApiData>;

export type ReceiptUploadApiData = {
  id: string;
  file_size: string;
  created_at: string;
  updated_at?: string | null;
  processing_status: EReceiptProcessingStatus;
  errors: Array<TReceiptDataError>;
  file_name?: string;
  file_type?: string;
  error_message?: string;
  data?: TReceiptApiData;
};

export type ReceiptBatchApiData = {
  total: number;
  items: Array<ReceiptUploadApiData>;
  failed: number;
  received: number;
  processed: number;
  processing: number;
};

export type ReceiptConfirmApiRequest = {
  id: string;
  fine?: number;
  payer?: string;
  barcode?: string;
  due_date?: string;
  category: string;
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
};
