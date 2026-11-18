import { Mapper ,parseDate  } from '@fintech/shared';

import { Category ,TCategoryApiData  } from '../domain';
import {
  subcategoryMapper,
} from '@/src/features/category/mappers/subcategory.mapper';

export class CategoryMapper extends Mapper<TCategoryApiData ,Category> {
  public toDomain(data: TCategoryApiData): Category {
    return Category.create({
      id: data.id ,
      icon: data.icon ,
      name: data.name ,
      color: data.color ,
      is_active: data.is_active ,
      subcategories: data.subcategories.map(subcategoryMapper.toDomain) ,
      created_at: parseDate(data.created_at ,'created_at' ,'category') ,
      updated_at: data.updated_at == null
        ? undefined
        : parseDate(data.updated_at ,'updated_at' ,'category') ,
    });
  }

  public toJson(data: Category): TCategoryApiData {
    return {
      id: data.id ,
      icon: data.icon ,
      name: data.name ,
      color: data.color ,
      is_active: data.is_active ,
      subcategories: data.subcategories.map(subcategoryMapper.toJson) ,
      created_at: data.created_at.toISOString() ,
      ...(data.updated_at
        ? { updated_at: data.updated_at.toISOString() }
        : {}) ,
    };
  }
}

export const categoryMapper = new CategoryMapper();