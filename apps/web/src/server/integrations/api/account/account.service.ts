import 'server-only';

import { HttpClient } from '@fintech/shared';
import type { Result, TPaginatedListResponse } from '@fintech/shared';

import { FINANCE_API_BASE_URL } from '../config';
import type {
  TAccountApiData ,
  TAccountPersist,
} from '@/src/features/account/domain';
import { mapEmptyStringsToNull } from '@/src/shared/result.mapper';

export class AccountApiService {
  public async fetchList(
    token: string,
    params?: Record<string, string>,
  ): Promise<Result<TPaginatedListResponse<TAccountApiData> | Array<TAccountApiData>>> {
    return HttpClient.get<
      TPaginatedListResponse<TAccountApiData> | Array<TAccountApiData>
    >({
      path: '/accounts',
      baseUrl: FINANCE_API_BASE_URL,
      config: { token, params },
    });
  }

  public async fetchById(token: string, identifier: string): Promise<Result<TAccountApiData>> {
    return HttpClient.get<TAccountApiData>({
      path: `/accounts/${identifier}`,
      baseUrl: FINANCE_API_BASE_URL,
      config: { token },
    });
  }

  public async create(token: string, data: Omit<TAccountPersist, 'id'>): Promise<Result<TAccountApiData>> {
    return HttpClient.post<TAccountApiData>({
      path: '/accounts',
      baseUrl: FINANCE_API_BASE_URL,
      config: { token, body: mapEmptyStringsToNull(data) },
    });
  }

  public async update(
    token: string,
    identifier: string,
    data: Partial<TAccountPersist>,
  ): Promise<Result<{ message: string }>> {
    return HttpClient.put<{ message: string }>({
      path: `/accounts/${identifier}`,
      baseUrl: FINANCE_API_BASE_URL,
      config: { token, body: mapEmptyStringsToNull(data) },
    });
  }

  public async delete(
    token: string,
    identifier: string,
  ): Promise<Result<{ message: string }>> {
    return HttpClient.remove<{ message: string }>({
      path: `/accounts/${identifier}`,
      baseUrl: FINANCE_API_BASE_URL,
      config: { token },
    });
  }
}

export const accountApiService = new AccountApiService();
