import 'server-only';

import { HttpClient } from '@fintech/shared';
import type { Result, TPaginatedListResponse } from '@fintech/shared';

import { FINANCE_API_BASE_URL } from '../config';
import type {
  TPayerApiData ,
  TPayerPersist,
} from '@/src/features/payer/domain';
import { mapEmptyStringsToNull } from '@/src/shared/result.mapper';

export class PayerApiService {
  public async fetchList(
    token: string,
    params?: Record<string, string>,
  ): Promise<Result<TPaginatedListResponse<TPayerApiData> | Array<TPayerApiData>>> {
    return HttpClient.get<
      TPaginatedListResponse<TPayerApiData> | Array<TPayerApiData>
    >({
      path: '/payers',
      baseUrl: FINANCE_API_BASE_URL,
      config: { token, params },
    });
  }

  public async fetchById(token: string, identifier: string): Promise<Result<TPayerApiData>> {
    return HttpClient.get<TPayerApiData>({
      path: `/payers/${identifier}`,
      baseUrl: FINANCE_API_BASE_URL,
      config: { token },
    });
  }

  public async create(token: string, data: Omit<TPayerPersist, 'id'>): Promise<Result<TPayerApiData>> {
    return HttpClient.post<TPayerApiData>({
      path: '/payers',
      baseUrl: FINANCE_API_BASE_URL,
      config: { token, body: mapEmptyStringsToNull(data) },
    });
  }

  public async update(
    token: string,
    identifier: string,
    data: Partial<TPayerPersist>,
  ): Promise<Result<{ message: string }>> {
    return HttpClient.put<{ message: string }>({
      path: `/payers/${identifier}`,
      baseUrl: FINANCE_API_BASE_URL,
      config: { token, body: mapEmptyStringsToNull(data) },
    });
  }

  public async delete(
    token: string,
    identifier: string,
  ): Promise<Result<{ message: string }>> {
    return HttpClient.remove<{ message: string }>({
      path: `/payers/${identifier}`,
      baseUrl: FINANCE_API_BASE_URL,
      config: { token },
    });
  }
}

export const payerApiService = new PayerApiService();
