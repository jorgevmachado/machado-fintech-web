import type { TPaginatedListResponse } from '@fintech/shared';

import type {
  BeneficiaryApiData,
  CategoryApiData,
  InstitutionApiData,
} from './resources.contracts';
import type { ReceiptApiData } from './receipt.contracts';

export type PaymentApiNumber = number | string;

export type PaymentPersistApiRequest = {
  id: string;
  payer?: string;
  amount?: number;
  beneficiary?: string;
  payment_date?: string;
  source_institution?: string;
  destination_institution?: string;
};

export type PaymentSummaryCountApiData = {
  count: PaymentApiNumber;
};

export type PaymentSummaryTotalApiData = {
  total: PaymentApiNumber;
};

export type PaymentApiData = {
  id: string;
  amount: PaymentApiNumber;
  payment_date: string;
  receipt: ReceiptApiData;
  category: CategoryApiData;
  beneficiary: BeneficiaryApiData;
  source_institution: InstitutionApiData;
  destination_institution?: InstitutionApiData | null;
};

export type PaymentApiList =
  | Array<PaymentApiData>
  | TPaginatedListResponse<PaymentApiData>;

export type PaymentSummaryMaxApiData = {
  payment?: PaymentApiData;
};

export type PaymentDashboardApiResponse = {
  payers: Array<{
    name: string;
    payer_id: string;
    total: PaymentApiNumber;
    count: PaymentApiNumber;
  }>;
  period: {
    end_date: string;
    start_date: string;
  };
  summary: {
    total: PaymentApiNumber;
    count: PaymentApiNumber;
    average: PaymentApiNumber;
    highest: PaymentApiNumber;
  };
  monthly: Array<{
    total: PaymentApiNumber;
    count: PaymentApiNumber;
    period: string;
  }>;
  categories: Array<{
    total: PaymentApiNumber;
    count: PaymentApiNumber;
    name: string;
    category_id: string;
  }>;
  institutions: Array<{
    total: PaymentApiNumber;
    count: PaymentApiNumber;
    institution: string;
  }>;
  beneficiaries: Array<{
    name: string;
    total: PaymentApiNumber;
    count: PaymentApiNumber;
    beneficiary_id: string;
  }>;
};

export type PaymentUpdateApiBody = Omit<PaymentPersistApiRequest, 'id'>;
