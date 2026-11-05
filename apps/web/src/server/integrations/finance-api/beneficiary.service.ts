import 'server-only';

import {
  HttpClient,
  type Result,
  type TPaginatedListResponse,
} from '@fintech/shared';

import { FINANCE_API_BASE_URL } from './config';

import type {
  BeneficiaryApiResponse ,
  BeneficiaryWriteRequest,
} from './contracts/beneficiary.contracts';

export class BeneficiaryApiService {
  public async fetchList(
    token: string,
    params?: Record<string, string>,
  ): Promise<Result<TPaginatedListResponse<BeneficiaryApiResponse> | Array<BeneficiaryApiResponse>>> {
    return HttpClient.get<
      TPaginatedListResponse<BeneficiaryApiResponse> | Array<BeneficiaryApiResponse>
    >({
      path: '/finance/beneficiary',
      baseUrl: FINANCE_API_BASE_URL,
      config: { token, params },
    });
  }

  public async create(token: string, data: BeneficiaryWriteRequest): Promise<Result<BeneficiaryApiResponse>> {
    return HttpClient.post<BeneficiaryApiResponse>({
      path: '/finance/beneficiary',
      baseUrl: FINANCE_API_BASE_URL,
      config: { token, body: data },
    });
  }

  public async update(token: string, identifier: string, data: BeneficiaryWriteRequest): Promise<Result<BeneficiaryApiResponse>> {
    return HttpClient.put<BeneficiaryApiResponse>({
      path: `/finance/beneficiary/${identifier}`,
      baseUrl: FINANCE_API_BASE_URL,
      config: { token, body: data },
    });
  }

  public async fetchById(token: string, identifier: string): Promise<Result<BeneficiaryApiResponse>> {
    return HttpClient.get<BeneficiaryApiResponse>({
      path: `/finance/beneficiary/${identifier}`,
      baseUrl: FINANCE_API_BASE_URL,
      config: { token },
    });
  }
}

export const beneficiaryApiService = new BeneficiaryApiService();
