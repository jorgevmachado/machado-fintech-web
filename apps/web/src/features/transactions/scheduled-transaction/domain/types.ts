import {
  TTransaction ,TTransactionApiData ,TTransactionFilter ,TTransactionPersist ,
} from '../../transaction';
import {
  TTransactionSeries ,
  TTransactionSeriesApiData,
} from '../../transaction-series';

export type TScheduledTransaction = TTransaction & {
  occurrence_on: Date
  occurrence_index: number
  transaction_serie: TTransactionSeries
}

export type TScheduledTransactionPersist = TTransactionPersist & {
  occurrence_on: Date
  occurrence_index: number
};

/**
 * `value` sai do `Omit` e volta como `number | string`: sem isso a interseção
 * com `TTransaction` reestreita o campo para `number` e esconde o formato que a
 * API realmente envia (o `Decimal` serializado como string).
 */
export type TScheduledTransactionApiData = TTransactionApiData & Omit<TScheduledTransaction, 'occurrence_on' | 'account' | 'subcategory' | 'credit_card' | 'created_at' | 'expected_on' | 'updated_at' | 'settled_on' | 'transaction_serie' | 'value'>  & {
  value: number | string;
  occurrence_on: string;
  transaction_serie: TTransactionSeriesApiData
}

export type TScheduledTransactionFilter = TTransactionFilter & {
  transaction_series_id?: string
}