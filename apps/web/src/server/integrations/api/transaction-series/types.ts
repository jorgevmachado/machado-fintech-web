import {
  TTransactionSeriesPersist
} from '@/src/features/transaction-series/domain';

export type TTransactionSeriesApiPersist = Omit<TTransactionSeriesPersist, 'id' | 'account' | 'subcategory' | 'credit_card' | 'end_date' |'start_date'> & {
  account_id: string;
  end_date?: string;
  start_date: string;
  subcategory_id?: string;
  credit_card_id?: string;
};