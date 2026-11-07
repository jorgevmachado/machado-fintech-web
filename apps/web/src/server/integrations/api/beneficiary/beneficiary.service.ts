import 'server-only';

import { HttpClient } from '@fintech/shared';
import type { Result, TPaginatedListResponse } from '@fintech/shared';

import { FINANCE_API_BASE_URL } from '../config';
import type {
  TBeneficiaryApiData ,
  TBeneficiaryPersist,
} from '@/src/features/beneficiary/domain';
import { mapEmptyStringsToNull } from '@/src/shared/result.mapper';

export class BeneficiaryApiService {
  public async fetchList(
    token: string,
    params?: Record<string, string>,
  ): Promise<Result<TPaginatedListResponse<TBeneficiaryApiData> | Array<TBeneficiaryApiData>>> {
    return HttpClient.get<
      TPaginatedListResponse<TBeneficiaryApiData> | Array<TBeneficiaryApiData>
    >({
      path: '/beneficiaries',
      baseUrl: FINANCE_API_BASE_URL,
      config: { token, params },
    });
  }

  public async fetchById(token: string, identifier: string): Promise<Result<TBeneficiaryApiData>> {
    return HttpClient.get<TBeneficiaryApiData>({
      path: `/beneficiaries/${identifier}`,
      baseUrl: FINANCE_API_BASE_URL,
      config: { token },
    });
  }

  public async create(token: string, data: Omit<TBeneficiaryPersist, 'id'>): Promise<Result<TBeneficiaryApiData>> {
    return HttpClient.post<TBeneficiaryApiData>({
      path: '/beneficiaries',
      baseUrl: FINANCE_API_BASE_URL,
      config: { token, body: mapEmptyStringsToNull(data) },
    });
  }

  public async update(
    token: string,
    identifier: string,
    data: Partial<TBeneficiaryPersist>,
  ): Promise<Result<{ message: string }>> {
    return HttpClient.put<{ message: string }>({
      path: `/beneficiaries/${identifier}`,
      baseUrl: FINANCE_API_BASE_URL,
      config: { token, body: mapEmptyStringsToNull(data) },
    });
  }

  public async delete(
    token: string,
    identifier: string,
  ): Promise<Result<{ message: string }>> {
    return HttpClient.remove<{ message: string }>({
      path: `/beneficiaries/${identifier}`,
      baseUrl: FINANCE_API_BASE_URL,
      config: { token },
    });
  }
}

export const beneficiaryApiService = new BeneficiaryApiService();
