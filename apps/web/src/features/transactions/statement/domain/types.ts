import { TBaseFilter } from '@fintech/ui';

import {
  TransactionDirectionEnum ,
  TransactionStatusEnum,
} from '@/src/features/transactions/transaction';
import { TAccount } from '@/src/features/account';
import { TCreditCard } from '@/src/features/credit-card';
import { TSubCategory ,TSubcategoryApiData } from '@/src/features/category';
import {
  TransactionKindEnum ,TTransactionSeries ,TTransactionSeriesApiData,
} from '@/src/features/transactions/transaction-series';

import { TAccountApiData } from '@/src/features/account/domain';
import { TCreditCardApiData } from '@/src/features/credit-card/domain';
import { StatementSourceEnum } from '@/src/features/transactions/statement';

export type TStatement = {
  id: string;
  name: string;
  note?: string;
  value: number;
  source: StatementSourceEnum;
  status: TransactionStatusEnum;
  account: TAccount;
  direction: TransactionDirectionEnum;
  settled_on?: Date;
  credit_card?: TCreditCard;
  subcategory?: TSubCategory;
  subcategory_name?: string;
  expected_on: Date;
  series_name?: string;
  series_kind?: TransactionKindEnum;
  installments?: number;
  occurrence_on?: Date;
  category_id?: string;
  category_name?: string;
  occurrence_index?: number;
  transaction_serie?: TTransactionSeries;
}

export type TStatementApiData = Omit<
  TStatement,
  | 'settled_on'
  | 'expected_on'
  | 'occurrence_on'
  | 'account'
  | 'credit_card'
  | 'subcategory'
  | 'transaction_serie'
  | 'id'
  | 'value'
> & {
  /** The API serialises the monetary `Decimal` as a string. */
  value: number | string;
  /** Absent on projected occurrences: they only exist while the series generates them. */
  id?: string | null;
  account: TAccountApiData;
  settled_on?: string;
  subcategory?: TSubcategoryApiData;
  credit_card?: TCreditCardApiData;
  expected_on: string;
  occurrence_on?: string;
  transaction_serie?: TTransactionSeriesApiData;
}

export type TStatementFilter = TBaseFilter & {
  search?: string;
  status?: TransactionStatusEnum;
  end_date: string;
  start_date: string;
  account_id?: string;
  direction?: TransactionDirectionEnum;
  credit_card_id?: string;
  subcategory_id?: string;
  only_credit_card?: boolean;
}