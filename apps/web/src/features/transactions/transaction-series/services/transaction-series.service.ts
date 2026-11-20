import { CrudService ,Result ,type TCrudList  } from '@fintech/shared';

import {
  TransactionSeries ,
  TTransactionSeriesApiData ,
  TTransactionSeriesFilter ,
  TTransactionSeriesPersist,
} from '../domain';
import { transactionSeriesMapper } from '../mappers/transaction-series.mapper';

export class TransactionSeriesService extends CrudService<
  TTransactionSeriesApiData ,
  TransactionSeries ,
  TTransactionSeriesFilter ,
  TTransactionSeriesPersist
> {
  protected readonly baseUrl = '/api';
  protected readonly pathUrl = '/transactions/series';

  protected toMapperEntity(result: Result<TTransactionSeriesApiData>): Result<TransactionSeries> {
    return transactionSeriesMapper.mapJsonResult(result);
  }

  protected toMapperEntityList(
    result: Result<TCrudList<TTransactionSeriesApiData>> ,
  ): Result<TCrudList<TransactionSeries>> {
    return transactionSeriesMapper.mapJsonListResult(result);
  }
}

export const transactionSeriesService = new TransactionSeriesService();