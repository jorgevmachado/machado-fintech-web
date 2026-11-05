import 'server-only';

import {
  HttpClient,
  type Result,
  type TPaginatedListResponse,
} from '@fintech/shared';

import type {
  CategoryApiResponse,
  CategoryApiWriteRequest,
} from './contracts/category.contracts';
import { FINANCE_API_BASE_URL } from './config';

export class CategoryApiService {
  public async fetchList(
    token: string,
    params?: Record<string, string>,
  ): Promise<Result<TPaginatedListResponse<CategoryApiResponse> | Array<CategoryApiResponse>>> {
    return HttpClient.get<
      TPaginatedListResponse<CategoryApiResponse> | Array<CategoryApiResponse>
    >({
      path: '/finance/category',
      baseUrl: FINANCE_API_BASE_URL,
      config: { token, params },
    });
  }

  public async fetchById(
    token: string,
    identifier: string,
  ): Promise<Result<CategoryApiResponse>> {
    return HttpClient.get<CategoryApiResponse>({
      path: `/finance/category/${identifier}`,
      baseUrl: FINANCE_API_BASE_URL,
      config: { token },
    });
  }

  public async create(
    token: string,
    data: CategoryApiWriteRequest,
  ): Promise<Result<CategoryApiResponse>> {
    return HttpClient.post<CategoryApiResponse>({
      path: '/finance/category',
      baseUrl: FINANCE_API_BASE_URL,
      config: { token, body: data },
    });
  }

  public async update(
    token: string,
    identifier: string,
    data: CategoryApiWriteRequest,
  ): Promise<Result<CategoryApiResponse>> {
    return HttpClient.put<CategoryApiResponse>({
      path: `/finance/category/${identifier}`,
      baseUrl: FINANCE_API_BASE_URL,
      config: { token, body: data },
    });
  }
}

export const categoryApiService = new CategoryApiService();
