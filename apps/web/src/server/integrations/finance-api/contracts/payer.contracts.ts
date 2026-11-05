import type { PayerApiData } from '@/src/contracts/finance-api/resources.contracts';

export type PayerApiResponse = PayerApiData;

export type PayerApiWriteRequest = {
  name: string;
};
