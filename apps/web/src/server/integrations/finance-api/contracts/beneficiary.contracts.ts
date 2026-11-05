import type { BeneficiaryApiData } from '@/src/contracts/finance-api/resources.contracts';

export type BeneficiaryApiResponse = BeneficiaryApiData;

export type BeneficiaryWriteRequest = {
  name: string;
}