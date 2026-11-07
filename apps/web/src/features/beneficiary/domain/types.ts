import { TBaseFilter } from '@fintech/ui';
import {
  TTimestampedApiResource
} from '@/src/contracts/finance-api/resources.contracts';

export type TBeneficiary = {
  id: string;
  name: string;
  created_at: Date;
  updated_at?: Date;
}

export type TBeneficiaryFilter = TBaseFilter & {
  name?: string;
};

export type TBeneficiaryApiData = Omit<TBeneficiary, 'created_at' | 'updated_at'> & TTimestampedApiResource;

export type TBeneficiaryPersist = {
  id?: string;
  name: string;
}