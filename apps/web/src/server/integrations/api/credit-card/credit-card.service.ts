import 'server-only';

import { HttpClient } from '@fintech/shared';
import type { Result, TPaginatedListResponse } from '@fintech/shared';

import { FINANCE_API_BASE_URL } from '../config';
import { TCreditCardApiData ,TCreditCardPersistApiData } from '@/src/features/credit-card/domain';
import { mapEmptyStringsToNull } from '@/src/shared/result.mapper';

export class CreditCardApiService {
  public async fetchList(
    token: string,
    params?: Record<string, string>,
  ): Promise<Result<TPaginatedListResponse<TCreditCardApiData> | Array<TCreditCardApiData>>> {
    return HttpClient.get<
      TPaginatedListResponse<TCreditCardApiData> | Array<TCreditCardApiData>
    >({
      path: '/credit-cards',
      baseUrl: FINANCE_API_BASE_URL,
      config: { token, params },
    });
  }

  public async fetchById(token: string, identifier: string): Promise<Result<TCreditCardApiData>> {
    return HttpClient.get<TCreditCardApiData>({
      path: `/credit-cards/${identifier}`,
      baseUrl: FINANCE_API_BASE_URL,
      config: { token },
    });
  }

  public async create(token: string, data: TCreditCardPersistApiData): Promise<Result<TCreditCardApiData>> {
    return HttpClient.post<TCreditCardApiData>({
      path: '/credit-cards',
      baseUrl: FINANCE_API_BASE_URL,
      config: { token, body: mapEmptyStringsToNull(data) },
    });
  }

  public async update(
    token: string,
    identifier: string,
    data: TCreditCardPersistApiData,
  ): Promise<Result<{ message: string }>> {
    return HttpClient.put<{ message: string }>({
      path: `/credit-cards/${identifier}`,
      baseUrl: FINANCE_API_BASE_URL,
      config: { token, body: mapEmptyStringsToNull(data) },
    });
  }

  public async delete(
    token: string,
    identifier: string,
  ): Promise<Result<{ message: string }>> {
    return HttpClient.remove<{ message: string }>({
      path: `/credit-cards/${identifier}`,
      baseUrl: FINANCE_API_BASE_URL,
      config: { token },
    });
  }
}

export const creditCardApiService = new CreditCardApiService();
