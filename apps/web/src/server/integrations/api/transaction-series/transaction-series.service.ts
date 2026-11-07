import 'server-only';

import { HttpClient } from '@fintech/shared';
import type { Result, TPaginatedListResponse } from '@fintech/shared';

import { FINANCE_API_BASE_URL } from '../config';

import { mapEmptyStringsToNull } from '@/src/shared/result.mapper';
import {
  TTransactionSeriesApiData
} from '@/src/features/transaction-series/domain';
import {
  TTransactionSeriesApiPersist
} from '@/src/server/integrations/api/transaction-series/types';

export class TransactionSeriesApiService {
  public async fetchList(
    token: string,
    params?: Record<string, string>,
  ): Promise<Result<TPaginatedListResponse<TTransactionSeriesApiData> | Array<TTransactionSeriesApiData>>> {
    return HttpClient.get<
      TPaginatedListResponse<TTransactionSeriesApiData> | Array<TTransactionSeriesApiData>
    >({
      path: '/transaction-series',
      baseUrl: FINANCE_API_BASE_URL,
      config: { token, params },
    });
  }

  public async fetchById(token: string, identifier: string): Promise<Result<TTransactionSeriesApiData>> {
    return HttpClient.get<TTransactionSeriesApiData>({
      path: `/transaction-series/${identifier}`,
      baseUrl: FINANCE_API_BASE_URL,
      config: { token },
    });
  }

  public async create(token: string, data: TTransactionSeriesApiPersist): Promise<Result<TTransactionSeriesApiData>> {
    return HttpClient.post<TTransactionSeriesApiData>({
      path: '/transaction-series',
      baseUrl: FINANCE_API_BASE_URL,
      config: { token, body: mapEmptyStringsToNull(data) },
    });
  }

  public async update(
    token: string,
    identifier: string,
    data: Partial<TTransactionSeriesApiPersist>,
  ): Promise<Result<{ message: string }>> {
    return HttpClient.put<{ message: string }>({
      path: `/transaction-series/${identifier}`,
      baseUrl: FINANCE_API_BASE_URL,
      config: { token, body: mapEmptyStringsToNull(data) },
    });
  }

  public async delete(
    token: string,
    identifier: string,
  ): Promise<Result<{ message: string }>> {
    return HttpClient.remove<{ message: string }>({
      path: `/transaction-series/${identifier}`,
      baseUrl: FINANCE_API_BASE_URL,
      config: { token },
    });
  }
}

export const transactionSeriesApiService = new TransactionSeriesApiService();
