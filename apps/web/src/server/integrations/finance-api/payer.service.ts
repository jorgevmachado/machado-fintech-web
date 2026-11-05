import 'server-only';

import {
  HttpClient,
  type Result,
  type TPaginatedListResponse,
} from '@fintech/shared';

import type {
  PayerApiResponse,
  PayerApiWriteRequest,
} from './contracts/payer.contracts';
import { FINANCE_API_BASE_URL } from './config';

export class PayerApiService {
  public async fetchList(
    token: string,
    params?: Record<string, string>,
  ): Promise<Result<TPaginatedListResponse<PayerApiResponse> | Array<PayerApiResponse>>> {
    return HttpClient.get<
      TPaginatedListResponse<PayerApiResponse> | Array<PayerApiResponse>
    >({
      path: '/finance/payer',
      baseUrl: FINANCE_API_BASE_URL,
      config: { token, params },
    });
  }

  public async fetchById(token: string, identifier: string): Promise<Result<PayerApiResponse>> {
    return HttpClient.get<PayerApiResponse>({
      path: `/finance/payer/${identifier}`,
      baseUrl: FINANCE_API_BASE_URL,
      config: { token },
    });
  }

  public async create(token: string, data: PayerApiWriteRequest): Promise<Result<PayerApiResponse>> {
    return HttpClient.post<PayerApiResponse>({
      path: '/finance/payer',
      baseUrl: FINANCE_API_BASE_URL,
      config: { token, body: data },
    });
  }

  public async update(
    token: string,
    identifier: string,
    data: PayerApiWriteRequest,
  ): Promise<Result<PayerApiResponse>> {
    return HttpClient.put<PayerApiResponse>({
      path: `/finance/payer/${identifier}`,
      baseUrl: FINANCE_API_BASE_URL,
      config: { token, body: data },
    });
  }
}

export const payerApiService = new PayerApiService();
