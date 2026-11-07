import { TBaseFilter } from '@fintech/ui';
import {
  TTimestampedApiResource
} from '@/src/contracts/finance-api/resources.contracts';

export type TPayer = {
  id: string;
  name: string;
  created_at: Date;
  updated_at?: Date;
}

export type TPayerFilter = TBaseFilter & {
  name?: string;
};

export type TPayerApiData = Omit<TPayer, 'created_at' | 'updated_at'> & TTimestampedApiResource;

export type TPayerPersist = {
  id?: string;
  name: string;
}