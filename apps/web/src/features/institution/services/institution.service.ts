import { Result ,TPaginatedListResponse, HttpClient } from '@fintech/shared';

import { Institution ,TInstitutionApiData ,TInstitutionFilter, TInstitutionPersist } from '../domain';
import {
  mapInstitutionJsonResult,
  mapInstitutionJsonListResult
} from '@/src/features/institution/mappers/institution.mapper';

export class InstitutionService {
  public async fetchList(filters?: TInstitutionFilter): Promise<Result<TPaginatedListResponse<Institution> | Array<Institution>>> {
    const result = await HttpClient.get<
      TPaginatedListResponse<TInstitutionApiData> | Array<TInstitutionApiData>
    >({
      path: '/institutions',
      baseUrl: '/api',
      config: { params: {...filters } },
    });

    return mapInstitutionJsonListResult(result);
  }

  public async create(data: TInstitutionPersist): Promise<Result<Institution>> {
    const result = await HttpClient.post<TInstitutionApiData>({
      path: '/institutions',
      baseUrl: '/api',
      config: { body: data },
    });
    return mapInstitutionJsonResult(result);
  }

  public async update(identifier: string, data: TInstitutionPersist): Promise<Result<{ message: string }>> {
    return await HttpClient.put<{ message: string }>({
      path: `/institutions/${identifier}`,
      baseUrl: '/api',
      config: { body: data },
    });
  }

  public async delete(identifier: string): Promise<Result<{ message: string }>> {
    return await HttpClient.remove<{ message: string }>({
      path: `/institutions/${identifier}`,
      baseUrl: '/api',
    });
  }
}

export const institutionService = new InstitutionService();