import { TBaseFilter } from '@fintech/ui';

import { AccountTypesEnum } from './enum';

import {
  TTimestampedApiResource
} from '@/src/contracts/finance-api/resources.contracts';

export type TAccount = {
  id: string;
  icon?: string;
  type: AccountTypesEnum;
  name: string;
  color?: string;
  agency?: string;
  is_active: boolean;
  description?: string;
  account_number?: string;
  financial_institution?: string;
  created_at: Date;
  updated_at?: Date;
}

export type TAccountFilter = TBaseFilter & {
  name?: string;
  agency?: string;
  is_active?: boolean;
  account_number?: string;
  financial_institution?: string;
}

export type TAccountApiData = Omit<TAccount, 'created_at' | 'updated_at'> & TTimestampedApiResource;

export type TAccountPersist = {
  id?: string;
  icon?: string;
  type: AccountTypesEnum;
  name: string;
  color?: string;
  agency?: string;
  is_active: boolean;
  description?: string;
  account_number?: string;
  financial_institution?: string;
}