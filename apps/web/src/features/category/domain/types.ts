import { TBaseFilter } from '@fintech/ui';

import {
  TTimestampedApiResource
} from '@/src/contracts/finance-api/resources.contracts';

type TCategoryBase = {
  id: string;
  name: string;
  icon?: string;
  color?: string;
  is_active: boolean;
  created_at: Date;
  updated_at?: Date;
}

export type TSubCategory = TCategoryBase & {
  order: number;
};

export type TCategory = TCategoryBase & {
  subcategories: TSubCategory[];
}

export type TCategoryFilter = TBaseFilter & {
  name?: string;
}

export type TSubcategoryApiData = Omit<TSubCategory, 'created_at' | 'updated_at'> & TTimestampedApiResource;

export type TCategoryApiData = Omit<TCategory, 'created_at' | 'updated_at' | 'subcategories'> & TTimestampedApiResource & {
  subcategories: TSubcategoryApiData[];
};

export type TCategoryPersistBase = {
  id?: string;
  name: string;
  icon?: string;
  color?: string;
  is_active: boolean;
}

export type TSubCategoryPersist = TCategoryPersistBase & {
  order: number;
}

export type TCategoryPersist = TCategoryPersistBase & {
  id?: string;
  subcategories: TSubCategoryPersist[];
}