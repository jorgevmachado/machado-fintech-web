import 'server-only';

import { CrudService } from '@fintech/shared';

import { FINANCE_API_BASE_URL } from '../../config';

import {
  TTransactionSeriesApiData,
} from '@/src/features/transactions/transaction-series/domain';
import { TTransactionSeriesApiPersist } from './types';

export class TransactionSeriesApiService extends CrudService<
  TTransactionSeriesApiData ,
  TTransactionSeriesApiData ,
  Record<string ,string> ,
  Omit<TTransactionSeriesApiPersist ,'id'>
> {
  protected readonly baseUrl = FINANCE_API_BASE_URL;
  protected readonly pathUrl = '/transactions/series';

  protected toBody(data: Omit<TTransactionSeriesApiPersist ,'id'>): unknown {
    return this.mapEmptyStringsToNull(data);
  }
}

export const transactionSeriesApiService = new TransactionSeriesApiService();