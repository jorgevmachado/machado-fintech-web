import {
  TTransaction ,TTransactionApiData ,TTransactionFilter ,TTransactionPersist ,
} from '@/src/features/transaction/domain';
import {
  TTransactionSeries ,
  TTransactionSeriesApiData,
} from '@/src/features/transaction-series/domain';

export type TScheduledTransaction = TTransaction & {
  occurrence_on: Date
  occurrence_index: number
  transaction_serie: TTransactionSeries
}

export type TScheduledTransactionPersist = TTransactionPersist & {
  occurrence_on: Date
  occurrence_index: number
};

export type TScheduledTransactionApiData = TTransactionApiData & Omit<TScheduledTransaction, 'occurrence_on' | 'account' | 'subcategory' | 'credit_card' | 'created_at' | 'expected_on' | 'updated_at' | 'settled_on' | 'transaction_serie'>  & {
  occurrence_on: string;
  transaction_serie: TTransactionSeriesApiData
}

export type TScheduledTransactionFilter = TTransactionFilter & {
  transaction_series_id?: string
}