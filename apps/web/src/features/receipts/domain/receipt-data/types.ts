import {
  ReceiptFieldStatusEnum ,
} from './enum';

export type TReceiptDataField<T> = {
  value?: T;
  status: ReceiptFieldStatusEnum;
};

export type TReceiptData = {
  fine: TReceiptDataField<number>;
  payer: TReceiptDataField<string>;
  barcode: TReceiptDataField<string>;
  due_date: TReceiptDataField<Date>;
  discount: TReceiptDataField<number>;
  category: TReceiptDataField<string>;
  interest: TReceiptDataField<number>;
  description: TReceiptDataField<string>;
  paid_amount: TReceiptDataField<number>;
  beneficiary: TReceiptDataField<string>;
  payment_date: TReceiptDataField<Date>;
  total_charges: TReceiptDataField<number>;
  authentication: TReceiptDataField<string>;
  transaction_id: TReceiptDataField<string>;
  effective_payer: TReceiptDataField<string>;
  document_amount: TReceiptDataField<number>;
  source_institution: TReceiptDataField<string>;
  destination_institution: TReceiptDataField<string>;
};

export type TReceiptDataError = {
  field: string;
  status: ReceiptFieldStatusEnum;
}

export type TReceiptDataApiData = Omit<TReceiptData, 'due_date' | 'payment_date'> & {
  due_date: TReceiptDataField<string>;
  payment_date: TReceiptDataField<string>;
}