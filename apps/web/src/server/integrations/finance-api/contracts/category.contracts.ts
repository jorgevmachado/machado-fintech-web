import type { CategoryApiData } from '@/src/contracts/finance-api/resources.contracts';

export type CategoryApiResponse = CategoryApiData;

export type CategoryApiWriteRequest = {
  name: string;
  description?: string;
};
