import { Result ,TPaginatedListResponse, HttpClient } from '@fintech/shared';

import { Beneficiary ,TBeneficiaryApiData ,TBeneficiaryFilter, TBeneficiaryPersist } from '../domain';
import {
  mapBeneficiaryJsonResult,
  mapBeneficiaryJsonListResult
} from '@/src/features/beneficiary/mappers/beneficiary.mapper';

export class BeneficiaryService {
  public async fetchList(filters?: TBeneficiaryFilter): Promise<Result<TPaginatedListResponse<Beneficiary> | Array<Beneficiary>>> {
    const result = await HttpClient.get<
      TPaginatedListResponse<TBeneficiaryApiData> | Array<TBeneficiaryApiData>
    >({
      path: '/beneficiaries',
      baseUrl: '/api',
      config: { params: {...filters } },
    });

    return mapBeneficiaryJsonListResult(result);
  }

  public async create(data: TBeneficiaryPersist): Promise<Result<Beneficiary>> {
    const result = await HttpClient.post<TBeneficiaryApiData>({
      path: '/beneficiaries',
      baseUrl: '/api',
      config: { body: data },
    });
    return mapBeneficiaryJsonResult(result);
  }

  public async update(identifier: string, data: TBeneficiaryPersist): Promise<Result<{ message: string }>> {
    return await HttpClient.put<{ message: string }>({
      path: `/beneficiaries/${identifier}`,
      baseUrl: '/api',
      config: { body: data },
    });
  }

  public async delete(identifier: string): Promise<Result<{ message: string }>> {
    return await HttpClient.remove<{ message: string }>({
      path: `/beneficiaries/${identifier}`,
      baseUrl: '/api',
    });
  }
}

export const beneficiaryService = new BeneficiaryService();