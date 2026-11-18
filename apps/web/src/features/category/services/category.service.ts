import { CrudService ,Result ,TPaginatedListResponse  } from '@fintech/shared';

import {
  Category ,
  TCategoryApiData ,
  TCategoryFilter ,
  TCategoryPersist,
} from '../domain';
import {
  categoryMapper ,
} from '@/src/features/category/mappers/category.mapper';

export class CategoryService extends CrudService<TCategoryApiData ,Category ,TCategoryFilter ,TCategoryPersist> {

  protected readonly baseUrl = '/api';
  protected readonly pathUrl = '/categories';

  protected toMapperEntity(result: Result<TCategoryApiData>): Result<Category> {
    return categoryMapper.mapJsonResult(result);
  }

  protected toMapperEntityList(
    result: Result<TPaginatedListResponse<TCategoryApiData> | Array<TCategoryApiData>> ,
  ): Result<TPaginatedListResponse<Category> | Array<Category>> {
    return categoryMapper.mapJsonListResult(result);
  }
}

export const categoryService = new CategoryService();