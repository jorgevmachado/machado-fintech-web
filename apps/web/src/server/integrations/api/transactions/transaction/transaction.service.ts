import 'server-only';

import { CrudService  } from '@fintech/shared';

import { FINANCE_API_BASE_URL } from '../../config';
import type {
  TTransactionApiData ,
} from '@/src/features/transactions/transaction/domain';

import { TTransactionApiPersist } from './types';

export class TransactionApiService extends CrudService<
  TTransactionApiData ,
  TTransactionApiData ,
  Record<string ,string> ,
  Omit<TTransactionApiPersist ,'id'>
> {
  protected readonly baseUrl = FINANCE_API_BASE_URL;
  protected readonly pathUrl = '/transactions';

  protected toBody(data: Omit<TTransactionApiPersist ,'id'>): unknown {
    return this.mapEmptyStringsToNull(data);
  }
}

export const transactionApiService = new TransactionApiService();
