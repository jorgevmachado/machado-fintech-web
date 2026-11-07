import 'server-only';

import { HttpClient } from '@fintech/shared';
import type { Result, TPaginatedListResponse } from '@fintech/shared';

import { FINANCE_API_BASE_URL } from '../config';
import type {
  TInstitutionApiData ,
  TInstitutionPersist,
} from '@/src/features/institution/domain';
import { mapEmptyStringsToNull } from '@/src/shared/result.mapper';

export class InstitutionApiService {
  public async fetchList(
    token: string,
    params?: Record<string, string>,
  ): Promise<Result<TPaginatedListResponse<TInstitutionApiData> | Array<TInstitutionApiData>>> {
    return HttpClient.get<
      TPaginatedListResponse<TInstitutionApiData> | Array<TInstitutionApiData>
    >({
      path: '/institutions',
      baseUrl: FINANCE_API_BASE_URL,
      config: { token, params },
    });
  }

  public async fetchById(token: string, identifier: string): Promise<Result<TInstitutionApiData>> {
    return HttpClient.get<TInstitutionApiData>({
      path: `/institutions/${identifier}`,
      baseUrl: FINANCE_API_BASE_URL,
      config: { token },
    });
  }

  public async create(token: string, data: Omit<TInstitutionPersist, 'id'>): Promise<Result<TInstitutionApiData>> {
    return HttpClient.post<TInstitutionApiData>({
      path: '/institutions',
      baseUrl: FINANCE_API_BASE_URL,
      config: { token, body: mapEmptyStringsToNull(data) },
    });
  }

  public async update(
    token: string,
    identifier: string,
    data: Partial<TInstitutionPersist>,
  ): Promise<Result<{ message: string }>> {
    return HttpClient.put<{ message: string }>({
      path: `/institutions/${identifier}`,
      baseUrl: FINANCE_API_BASE_URL,
      config: { token, body: mapEmptyStringsToNull(data) },
    });
  }

  public async delete(
    token: string,
    identifier: string,
  ): Promise<Result<{ message: string }>> {
    return HttpClient.remove<{ message: string }>({
      path: `/institutions/${identifier}`,
      baseUrl: FINANCE_API_BASE_URL,
      config: { token },
    });
  }
}

export const institutionApiService = new InstitutionApiService();
