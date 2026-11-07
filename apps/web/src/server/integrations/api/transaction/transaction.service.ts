import 'server-only';

import { HttpClient } from '@fintech/shared';
import type { Result, TPaginatedListResponse } from '@fintech/shared';

import { FINANCE_API_BASE_URL } from '../config';
import type {
  TTransactionApiData ,
} from '@/src/features/transaction/domain';
import { mapEmptyStringsToNull } from '@/src/shared/result.mapper';
import {
  TTransactionApiPersist
} from '@/src/server/integrations/api/transaction/types';

export class TransactionApiService {
  public async fetchList(
    token: string,
    params?: Record<string, string>,
  ): Promise<Result<TPaginatedListResponse<TTransactionApiData> | Array<TTransactionApiData>>> {
    return HttpClient.get<
      TPaginatedListResponse<TTransactionApiData> | Array<TTransactionApiData>
    >({
      path: '/transactions',
      baseUrl: FINANCE_API_BASE_URL,
      config: { token, params },
    });
  }

  public async fetchById(token: string, identifier: string): Promise<Result<TTransactionApiData>> {
    return HttpClient.get<TTransactionApiData>({
      path: `/transactions/${identifier}`,
      baseUrl: FINANCE_API_BASE_URL,
      config: { token },
    });
  }

  public async create(token: string, data: TTransactionApiPersist): Promise<Result<TTransactionApiData>> {
    return HttpClient.post<TTransactionApiData>({
      path: '/transactions',
      baseUrl: FINANCE_API_BASE_URL,
      config: { token, body: mapEmptyStringsToNull(data) },
    });
  }

  public async update(
    token: string,
    identifier: string,
    data: Partial<TTransactionApiPersist>,
  ): Promise<Result<{ message: string }>> {
    return HttpClient.put<{ message: string }>({
      path: `/transactions/${identifier}`,
      baseUrl: FINANCE_API_BASE_URL,
      config: { token, body: mapEmptyStringsToNull(data) },
    });
  }

  public async delete(
    token: string,
    identifier: string,
  ): Promise<Result<{ message: string }>> {
    return HttpClient.remove<{ message: string }>({
      path: `/transactions/${identifier}`,
      baseUrl: FINANCE_API_BASE_URL,
      config: { token },
    });
  }
}

export const transactionApiService = new TransactionApiService();
