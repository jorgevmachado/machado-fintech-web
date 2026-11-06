import type { Result as TResult, TPaginatedListResponse } from '@fintech/shared';

import {
  TCategory ,TCategoryApiData ,Category ,TSubCategory ,
  TSubcategoryApiData,
} from '../domain';
import {
  mapListResult ,
  mapResult ,
  parseDate,
} from '@/src/shared/result.mapper';

export function subcategoryApiDataToDomain(data: TSubcategoryApiData): TSubCategory {
  return {
    id: data.id,
    icon: data.icon,
    name: data.name,
    order: data.order,
    color: data.color,
    is_active: data.is_active,
    created_at: parseDate(data.created_at, 'created_at', 'subcategory'),
    updated_at: data.updated_at == null
      ? undefined
      : parseDate(data.updated_at, 'updated_at', 'subcategory'),
  }
}

export function categoryApiDataToDomain(data: TCategoryApiData): TCategory {
  return Category.create({
    id: data.id,
    icon: data.icon,
    name: data.name,
    color: data.color,
    is_active: data.is_active,
    subcategories: data.subcategories.map(subcategoryApiDataToDomain),
    created_at: parseDate(data.created_at, 'created_at', 'category'),
    updated_at: data.updated_at == null
      ? undefined
      : parseDate(data.updated_at, 'updated_at', 'category'),
  })
}

export function categoryJsonToDomain(data: TCategoryApiData): TCategory {
  return categoryApiDataToDomain(data);
}

export function subcategoryDomainToJson(data: TSubCategory): TSubcategoryApiData {
  return {
    id: data.id,
    icon: data.icon,
    name: data.name,
    order: data.order,
    color: data.color,
    is_active: data.is_active,
    created_at: data.created_at.toISOString(),
    ...(data.updated_at
      ? { updated_at: data.updated_at.toISOString() }
      : {}),
  }
}

export function categoryDomainToJson(data: TCategory): TCategoryApiData {
  return {
    id: data.id,
    icon: data.icon,
    name: data.name,
    color: data.color,
    is_active: data.is_active,
    subcategories: data.subcategories.map(subcategoryDomainToJson),
    created_at: data.created_at.toISOString(),
    ...(data.updated_at
      ? { updated_at: data.updated_at.toISOString() }
      : {}),
  }
}

export function categoryApiDataToJson(data: TCategoryApiData): TCategoryApiData {
  console.log('# => data => ', data);
  return categoryDomainToJson(categoryApiDataToDomain(data));
}

export function mapCategoryJsonResult(result: TResult<TCategoryApiData>): TResult<Category> {
  return mapResult(result, categoryJsonToDomain);
}

export function mapCategoryJsonListResult(
  result: TResult<TPaginatedListResponse<TCategoryApiData>| Array<TCategoryApiData>>,
): TResult<TPaginatedListResponse<Category> | Array<Category>> {
  return mapListResult(result, categoryJsonToDomain);
}