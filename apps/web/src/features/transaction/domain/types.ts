import { TBaseFilter } from '@fintech/ui';

import { TAccount } from '@/src/features/account';
import { TCreditCard } from '@/src/features/credit-card';
import { TSubCategory ,TSubcategoryApiData } from '@/src/features/category';

import {
  TTimestampedApiResource
} from '@/src/contracts/finance-api/resources.contracts';

import { TransactionStatusEnum, TransactionDirectionEnum } from '@/src/features/transaction/domain/enum';
import { TAccountApiData } from '@/src/features/account/domain';
import { TCreditCardApiData } from '@/src/features/credit-card/domain';

export type TTransaction = {
  id: string;
  name: string;
  note?: string;
  value: number;
  status: TransactionStatusEnum;
  account: TAccount;
  direction: TransactionDirectionEnum;
  credit_card?: TCreditCard;
  subcategory?: TSubCategory;
  settled_on?: Date;
  expected_on: Date;
  created_at: Date;
  updated_at?: Date;
}

export type TTransactionPersist = {
  id?: string;
  name: string;
  note?: string;
  value: number;
  status?: TransactionStatusEnum;
  account: TAccount;
  direction: TransactionDirectionEnum;
  credit_card?: TCreditCard;
  subcategory?: TSubCategory;
  settled_on?: Date;
  expected_on: Date;
}

export type TTransactionApiData = Omit<TTransaction, 'created_at' | 'updated_at' | 'settled_on' | 'expected_on' | 'account' | 'subcategory' | 'credit_card'> & TTimestampedApiResource & {
  account: TAccountApiData;
  subcategory?: TSubcategoryApiData;
  credit_card?: TCreditCardApiData;
  settled_on?: string;
  expected_on: string;
};

export type TTransactionFilter = TBaseFilter & {
  name?: string;
  status?: TransactionStatusEnum;
  direction?: TransactionDirectionEnum;
}