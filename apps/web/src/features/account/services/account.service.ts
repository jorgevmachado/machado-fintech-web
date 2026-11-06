import { Result ,TPaginatedListResponse, HttpClient } from '@fintech/shared';

import { Account ,TAccountApiData ,TAccountFilter, TAccountPersist } from '../domain';
import {
  mapAccountJsonResult,
  mapAccountJsonListResult
} from '@/src/features/account/mappers/account.mapper';

export class AccountService {
  public async fetchList(filters?: TAccountFilter): Promise<Result<TPaginatedListResponse<Account> | Array<Account>>> {
    const result = await HttpClient.get<
      TPaginatedListResponse<TAccountApiData> | Array<TAccountApiData>
    >({
      path: '/accounts',
      baseUrl: '/api',
      config: { params: {...filters } },
    });

    return mapAccountJsonListResult(result);
  }

  public async create(data: TAccountPersist): Promise<Result<Account>> {
    const result = await HttpClient.post<TAccountApiData>({
      path: '/accounts',
      baseUrl: '/api',
      config: { body: data },
    });
    return mapAccountJsonResult(result);
  }

  public async update(identifier: string, data: TAccountPersist): Promise<Result<{ message: string }>> {
    return await HttpClient.put<{ message: string }>({
      path: `/accounts/${identifier}`,
      baseUrl: '/api',
      config: { body: data },
    });
  }

  public async delete(identifier: string): Promise<Result<{ message: string }>> {
    return await HttpClient.remove<{ message: string }>({
      path: `/accounts/${identifier}`,
      baseUrl: '/api',
    });
  }
}

export const accountService = new AccountService();