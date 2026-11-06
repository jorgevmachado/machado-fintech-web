import 'server-only';

import { HttpClient } from '@fintech/shared';
import type { Result, TPaginatedListResponse } from '@fintech/shared';

import { FINANCE_API_BASE_URL } from '../config';
import type {
  TCategoryApiData ,
  TCategoryPersist,
} from '@/src/features/category/domain';
import { mapEmptyStringsToNull } from '@/src/shared/result.mapper';

export class CategoryApiService {
  public async fetchList(
    token: string,
    params?: Record<string, string>,
  ): Promise<Result<TPaginatedListResponse<TCategoryApiData> | Array<TCategoryApiData>>> {
    return HttpClient.get<
      TPaginatedListResponse<TCategoryApiData> | Array<TCategoryApiData>
    >({
      path: '/categories',
      baseUrl: FINANCE_API_BASE_URL,
      config: { token, params },
    });
  }

  public async fetchById(token: string, identifier: string): Promise<Result<TCategoryApiData>> {
    return HttpClient.get<TCategoryApiData>({
      path: `/categories/${identifier}`,
      baseUrl: FINANCE_API_BASE_URL,
      config: { token },
    });
  }

  public async create(token: string, data: Omit<TCategoryPersist, 'id'>): Promise<Result<TCategoryApiData>> {
    return HttpClient.post<TCategoryApiData>({
      path: '/categories',
      baseUrl: FINANCE_API_BASE_URL,
      config: { token, body: mapEmptyStringsToNull(data) },
    });
  }

  public async update(
    token: string,
    identifier: string,
    data: Partial<TCategoryPersist>,
  ): Promise<Result<{ message: string }>> {
    return HttpClient.put<{ message: string }>({
      path: `/categories/${identifier}`,
      baseUrl: FINANCE_API_BASE_URL,
      config: { token, body: mapEmptyStringsToNull(data) },
    });
  }

  public async delete(
    token: string,
    identifier: string,
  ): Promise<Result<{ message: string }>> {
    return HttpClient.remove<{ message: string }>({
      path: `/categories/${identifier}`,
      baseUrl: FINANCE_API_BASE_URL,
      config: { token },
    });
  }
}

export const categoryApiService = new CategoryApiService();
