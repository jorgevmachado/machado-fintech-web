import { TBaseFilter } from '@fintech/ui';
import {
  TTimestampedApiResource
} from '@/src/contracts/finance-api/resources.contracts';

export type TInstitution = {
  id: string;
  name: string;
  created_at: Date;
  updated_at?: Date;
}

export type TInstitutionFilter = TBaseFilter & {
  name?: string;
};

export type TInstitutionApiData = Omit<TInstitution, 'created_at' | 'updated_at'> & TTimestampedApiResource;

export type TInstitutionPersist = {
  id?: string;
  name: string;
}