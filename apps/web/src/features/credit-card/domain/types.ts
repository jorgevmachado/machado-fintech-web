import type { TBaseFilter } from '@fintech/ui';

import { CreditCardBrandsEnum } from './enum';
import {
  TTimestampedApiResource
} from '@/src/contracts/finance-api/resources.contracts';


export type TCreditCard = {
  id: string;
  icon?: string;
  name: string;
  brand: CreditCardBrandsEnum;
  limit?: number;
  color?: string;
  due_day: number;
  is_active: boolean;
  closing_day: number;
  description?: string;
  last_four_digits?: string;
  created_at: Date;
  updated_at?: Date;
};

export type TCreditCardFilter = TBaseFilter & {
  name?: string;
  brand?: CreditCardBrandsEnum;
  is_active?: boolean;
}

export type TCreditCardApiData = TTimestampedApiResource & {
  icon?: string;
  brand: CreditCardBrandsEnum;
  limit?: number;
  color?: string;
  due_day: number;
  is_active: boolean;
  closing_day: number;
  description?: string;
  last_four_digits?: number;
}

export type TCreditCardPersist = {
  id?: string;
  icon?: string;
  name: string;
  brand: CreditCardBrandsEnum;
  limit?: number;
  color?: string;
  due_day: number;
  is_active: boolean;
  closing_day: number;
  description?: string;
  last_four_digits?: string;
}