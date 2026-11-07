import { Result ,TPaginatedListResponse, HttpClient } from '@fintech/shared';

import { Payer ,TPayerApiData ,TPayerFilter, TPayerPersist } from '../domain';
import {
  mapPayerJsonResult,
  mapPayerJsonListResult
} from '@/src/features/payer/mappers/payer.mapper';

export class PayerService {
  public async fetchList(filters?: TPayerFilter): Promise<Result<TPaginatedListResponse<Payer> | Array<Payer>>> {
    const result = await HttpClient.get<
      TPaginatedListResponse<TPayerApiData> | Array<TPayerApiData>
    >({
      path: '/payers',
      baseUrl: '/api',
      config: { params: {...filters } },
    });

    return mapPayerJsonListResult(result);
  }

  public async create(data: TPayerPersist): Promise<Result<Payer>> {
    const result = await HttpClient.post<TPayerApiData>({
      path: '/payers',
      baseUrl: '/api',
      config: { body: data },
    });
    return mapPayerJsonResult(result);
  }

  public async update(identifier: string, data: TPayerPersist): Promise<Result<{ message: string }>> {
    return await HttpClient.put<{ message: string }>({
      path: `/payers/${identifier}`,
      baseUrl: '/api',
      config: { body: data },
    });
  }

  public async delete(identifier: string): Promise<Result<{ message: string }>> {
    return await HttpClient.remove<{ message: string }>({
      path: `/payers/${identifier}`,
      baseUrl: '/api',
    });
  }
}

export const payerService = new PayerService();