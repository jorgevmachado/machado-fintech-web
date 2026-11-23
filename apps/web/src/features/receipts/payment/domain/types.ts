import { TPayer ,TPayerApiData } from '@/src/features/payer';
import { TReceipt ,TReceiptApiData } from '@/src/features/receipts/receipt';
import { TSubcategoryApiData, TSubCategory } from '@/src/features/category';
import { TBeneficiary ,TBeneficiaryApiData } from '@/src/features/beneficiary';
import { TInstitution ,TInstitutionApiData } from '@/src/features/institution';
import type { TBaseFilter } from '@fintech/ui';

export type TPaymentApiData = {
  id: string;
  /** The API serialises the monetary `Decimal` as a string. */
  amount: number | string;
  payer: TPayerApiData;
  receipt: TReceiptApiData;
  subcategory: TSubcategoryApiData;
  beneficiary: TBeneficiaryApiData;
  payment_date: string;
  source_institution: TInstitutionApiData;
  description?: string;
  destination_institution?: TInstitutionApiData;
  created_at: string;
  updated_at?: string | null;
}

export type TPayment = Omit<
  TPaymentApiData,
  'created_at' |
  'updated_at' |
  'amount' |
  'payer' |
  'receipt' |
  'subcategory' |
  'beneficiary' |
  'payment_date' |
  'source_institution' |
  'destination_institution'> & {
  amount: number;
  created_at: Date;
  payment_date: Date;
  updated_at?: Date;
  payer: TPayer;
  receipt: TReceipt;
  subcategory: TSubCategory;
  beneficiary: TBeneficiary;
  source_institution: TInstitution;
  destination_institution?: TInstitution;
}

export type TPaymentPersistApiData = {
  id?: string;
  payer_id: string;
  receipt_id: string;
  subcategory_id: string;
  beneficiary_id: string;
  amount: number;
  payment_date: string;
  source_institution_id: string;
  destination_institution_id?: string;
  description?: string;
}

export type TPaymentPersist = Omit<TPaymentPersistApiData, 'payment_date'> & {
  payment_date: Date;
}

/**
 * Filtros aceitos pelo endpoint de lista. As datas viajam como `YYYY-MM-DD`
 * (nunca `Date`): o `HttpUrl` serializa o valor direto na query string.
 */
export type TPaymentFilter = TBaseFilter & {
  start_date?: string;
  end_date?: string;
  payer?: string;
  subcategory?: string;
  source_institution?: string;
  order?: 'asc' | 'desc';
  order_by?: 'payment_date' | 'amount' | 'created_at';
}

export type TPaymentOrder = NonNullable<TPaymentFilter['order']>;

export type TPaymentOrderBy = NonNullable<TPaymentFilter['order_by']>;

export type TPaymentDashboardParams = {
  start_date: string;
  end_date: string;
  institution?: string;
  payer_id?: string;
  subcategory_id?: string;
  beneficiary_id?: string;
}

type TPaymentDashboardNumber = number | string;

export type TPaymentDashboardSummaryApiData = {
  total: TPaymentDashboardNumber;
  count: number;
  average: TPaymentDashboardNumber;
  highest: TPaymentDashboardNumber;
}

export type TPaymentDashboardMonthlyApiData = {
  period: string;
  total: TPaymentDashboardNumber;
  count: number;
}

export type TPaymentDashboardInstitutionApiData = {
  institution: string;
  total: TPaymentDashboardNumber;
  count: number;
}

export type TPaymentDashboardSubcategoryApiData = {
  name: string;
  subcategory_id: string;
  total: TPaymentDashboardNumber;
  count: number;
}

export type TPaymentDashboardPayerApiData = {
  name: string;
  payer_id: string;
  total: TPaymentDashboardNumber;
  count: number;
}

export type TPaymentDashboardBeneficiaryApiData = {
  name: string;
  beneficiary_id: string;
  total: TPaymentDashboardNumber;
  count: number;
}

export type TPaymentDashboardApiData = {
  payers: Array<TPaymentDashboardPayerApiData>;
  period: { start_date: string; end_date: string };
  summary: TPaymentDashboardSummaryApiData;
  monthly: Array<TPaymentDashboardMonthlyApiData>;
  subcategories: Array<TPaymentDashboardSubcategoryApiData>;
  institutions: Array<TPaymentDashboardInstitutionApiData>;
  beneficiaries: Array<TPaymentDashboardBeneficiaryApiData>;
}

export type TPaymentDashboardSummary = {
  total: number;
  count: number;
  average: number;
  highest: number;
}

export type TPaymentDashboardMonthly = {
  period: string;
  total: number;
  count: number;
}

export type TPaymentDashboardInstitution = {
  institution: string;
  total: number;
  count: number;
}

export type TPaymentDashboardSubcategory = {
  name: string;
  subcategory_id: string;
  total: number;
  count: number;
}

export type TPaymentDashboardPayer = {
  name: string;
  payer_id: string;
  total: number;
  count: number;
}

export type TPaymentDashboardBeneficiary = {
  name: string;
  beneficiary_id: string;
  total: number;
  count: number;
}

export type TPaymentDashboard = {
  payers: Array<TPaymentDashboardPayer>;
  period: { start_date: Date; end_date: Date };
  summary: TPaymentDashboardSummary;
  monthly: Array<TPaymentDashboardMonthly>;
  subcategories: Array<TPaymentDashboardSubcategory>;
  institutions: Array<TPaymentDashboardInstitution>;
  beneficiaries: Array<TPaymentDashboardBeneficiary>;
}