import { TBaseFilter } from '@fintech/ui';

import {
  TransactionDirectionEnum ,
  TTransaction ,
  TTransactionPersist ,
} from '@/src/features/transaction/domain';

import {
  TTimestampedApiResource
} from '@/src/contracts/finance-api/resources.contracts';
import { TAccountApiData } from '@/src/features/account/domain';
import { TSubcategoryApiData } from '@/src/features/category';
import { TCreditCardApiData } from '@/src/features/credit-card/domain';
import {
  TransactionFrequencyUnitEnum ,
  TransactionKindEnum,
} from '@/src/features/transaction-series/domain/enum';


export type TTransactionSeries = Omit<TTransaction, 'status' | 'settled_on' | 'expected_on'> & {
  kind: TransactionKindEnum;
  month?: number;
  week_day?: number;
  end_date?: Date;
  start_date: Date;
  day_of_month?: number;
  installments?: number;
  frequency_unit: TransactionFrequencyUnitEnum;
  frequency_interval: number;
}

export type TTransactionSeriesPersist = Omit<TTransactionPersist, 'status'| 'settled_on' | 'expected_on'> & {
  kind: TransactionKindEnum;
  month?: number;
  week_day?: number;
  end_date?: Date;
  start_date: Date;
  day_of_month?: number;
  installments?: number;
  frequency_unit: TransactionFrequencyUnitEnum;
  frequency_interval: number;
}

export type TTransactionSeriesApiData = Omit<TTransactionSeries, 'created_at' | 'updated_at' | 'end_date' | 'start_date'| 'account' | 'subcategory' | 'credit_card'> & TTimestampedApiResource & {
  end_date?: string;
  start_date: string;
  account: TAccountApiData;
  subcategory?: TSubcategoryApiData;
  credit_card?: TCreditCardApiData;
};

export type TTransactionSeriesFilter = TBaseFilter & {
  name?: string;
  kind?: TransactionKindEnum;
  direction?: TransactionDirectionEnum;
  frequency_unit?: TransactionFrequencyUnitEnum;
}