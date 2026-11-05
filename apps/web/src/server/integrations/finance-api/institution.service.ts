import 'server-only';

import {
  HttpClient,
  type Result,
  type TPaginatedListResponse,
} from '@fintech/shared';

import {
  InstitutionApiResponse ,
  InstitutionWriteRequest,
} from './contracts/institution.contracts';
import { FINANCE_API_BASE_URL } from './config';

export class InstitutionApiService {
  public async fetchList(
    token: string,
    params?: Record<string, string>,
  ): Promise<Result<TPaginatedListResponse<InstitutionApiResponse> | Array<InstitutionApiResponse>>> {
    return HttpClient.get<
      TPaginatedListResponse<InstitutionApiResponse> | Array<InstitutionApiResponse>
    >({
      path: '/finance/institution',
      baseUrl: FINANCE_API_BASE_URL,
      config: { token, params },
    });
  }

  public async create(token: string, data: InstitutionWriteRequest): Promise<Result<InstitutionApiResponse>> {
    return HttpClient.post<InstitutionApiResponse>({
      path: '/finance/institution',
      baseUrl: FINANCE_API_BASE_URL,
      config: { token, body: data },
    });
  }

  public async update(token: string, identifier: string, data: InstitutionWriteRequest): Promise<Result<InstitutionApiResponse>> {
    return HttpClient.put<InstitutionApiResponse>({
      path: `/finance/institution/${identifier}`,
      baseUrl: FINANCE_API_BASE_URL,
      config: { token, body: data },
    });
  }

  public async fetchById(token: string, identifier: string): Promise<Result<InstitutionApiResponse>> {
    return HttpClient.get<InstitutionApiResponse>({
      path: `/finance/institution/${identifier}`,
      baseUrl: FINANCE_API_BASE_URL,
      config: { token },
    });
  }
}

export const institutionApiService = new InstitutionApiService();
