import { Result ,TPaginatedListResponse, HttpClient } from '@fintech/shared';

import { Category ,TCategoryApiData ,TCategoryFilter, TCategoryPersist } from '../domain';
import {
  mapCategoryJsonResult,
  mapCategoryJsonListResult
} from '@/src/features/category/mappers/category.mapper';

export class CategoryService {
  public async fetchList(filters?: TCategoryFilter): Promise<Result<TPaginatedListResponse<Category> | Array<Category>>> {
    const result = await HttpClient.get<
      TPaginatedListResponse<TCategoryApiData> | Array<TCategoryApiData>
    >({
      path: '/categories',
      baseUrl: '/api',
      config: { params: {...filters } },
    });
    return mapCategoryJsonListResult(result);
  }

  public async create(data: TCategoryPersist): Promise<Result<Category>> {
    const result = await HttpClient.post<TCategoryApiData>({
      path: '/categories',
      baseUrl: '/api',
      config: { body: data },
    });
    return mapCategoryJsonResult(result);
  }

  public async update(identifier: string, data: TCategoryPersist): Promise<Result<{ message: string }>> {
    return await HttpClient.put<{ message: string }>({
      path: `/categories/${identifier}`,
      baseUrl: '/api',
      config: { body: data },
    });
  }

  public async delete(identifier: string): Promise<Result<{ message: string }>> {
    return await HttpClient.remove<{ message: string }>({
      path: `/categories/${identifier}`,
      baseUrl: '/api',
    });
  }
}

export const categoryService = new CategoryService();