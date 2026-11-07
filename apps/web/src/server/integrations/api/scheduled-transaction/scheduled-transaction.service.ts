import 'server-only';

import { HttpClient } from '@fintech/shared';
import type { Result, TPaginatedListResponse } from '@fintech/shared';

import { FINANCE_API_BASE_URL } from '../config';

import { mapEmptyStringsToNull } from '@/src/shared/result.mapper';
import {
  TScheduledTransactionApiData
} from '@/src/features/scheduled-transaction/domain';
import {
  TScheduledTransactionApiPersist
} from '@/src/server/integrations/api/scheduled-transaction/types';

export class ScheduledTransactionApiService {
  public async fetchList(
    token: string,
    transaction_series_id: string,
    params?: Record<string, string>,
  ): Promise<Result<TPaginatedListResponse<TScheduledTransactionApiData> | Array<TScheduledTransactionApiData>>> {
    return HttpClient.get<
      TPaginatedListResponse<TScheduledTransactionApiData> | Array<TScheduledTransactionApiData>
    >({
      path: `/scheduled-transactions/${transaction_series_id}`,
      baseUrl: FINANCE_API_BASE_URL,
      config: { token, params },
    });
  }

  public async fetchById(token: string, transaction_series_id: string, identifier: string): Promise<Result<TScheduledTransactionApiData>> {
    return HttpClient.get<TScheduledTransactionApiData>({
      path: `/scheduled-transactions/${transaction_series_id}/${identifier}`,
      baseUrl: FINANCE_API_BASE_URL,
      config: { token },
    });
  }

  public async create(token: string, transaction_series_id: string, data: TScheduledTransactionApiPersist): Promise<Result<TScheduledTransactionApiData>> {
    return HttpClient.post<TScheduledTransactionApiData>({
      path: `/scheduled-transactions/${transaction_series_id}`,
      baseUrl: FINANCE_API_BASE_URL,
      config: { token, body: mapEmptyStringsToNull(data) },
    });
  }

  public async update(
    token: string,
    transaction_series_id: string,
    identifier: string,
    data: Partial<TScheduledTransactionApiPersist>,
  ): Promise<Result<{ message: string }>> {
    return HttpClient.put<{ message: string }>({
      path: `/scheduled-transactions/${transaction_series_id}/${identifier}`,
      baseUrl: FINANCE_API_BASE_URL,
      config: { token, body: mapEmptyStringsToNull(data) },
    });
  }

  public async delete(
    token: string,
    transaction_series_id: string,
    identifier: string,
  ): Promise<Result<{ message: string }>> {
    return HttpClient.remove<{ message: string }>({
      path: `/scheduled-transactions/${transaction_series_id}/${identifier}`,
      baseUrl: FINANCE_API_BASE_URL,
      config: { token },
    });
  }
}

export const scheduledTransactionApiService = new ScheduledTransactionApiService();
