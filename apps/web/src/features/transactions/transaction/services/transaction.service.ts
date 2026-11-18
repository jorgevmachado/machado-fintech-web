import { CrudService ,Result ,TPaginatedListResponse  } from '@fintech/shared';

import {
  Transaction ,
  TTransactionApiData ,
  TTransactionFilter ,
  TTransactionPersist,
} from '../domain';
import { transactionMapper } from '../mappers/transaction.mapper';

export class TransactionService extends CrudService<TTransactionApiData ,Transaction ,TTransactionFilter ,TTransactionPersist> {

  protected readonly baseUrl = '/api';
  protected readonly pathUrl = '/transactions';

  protected toMapperEntity(result: Result<TTransactionApiData>): Result<Transaction> {
    return transactionMapper.mapJsonResult(result);
  }

  protected toMapperEntityList(
    result: Result<TPaginatedListResponse<TTransactionApiData> | Array<TTransactionApiData>> ,
  ): Result<TPaginatedListResponse<Transaction> | Array<Transaction>> {
    return transactionMapper.mapJsonListResult(result);
  }
}

export const transactionService = new TransactionService();