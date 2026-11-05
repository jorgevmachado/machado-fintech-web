import type { InstitutionApiData } from '@/src/contracts/finance-api/resources.contracts';

export type InstitutionApiResponse = InstitutionApiData;

export type InstitutionWriteRequest = {
  name: string;
}