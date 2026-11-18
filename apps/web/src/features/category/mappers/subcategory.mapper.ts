import { Mapper ,parseDate } from '@fintech/shared';
import { Subcategory ,TSubcategoryApiData } from '@/src/features/category';

export class SubcategoryMapper extends Mapper<TSubcategoryApiData, Subcategory> {
  public toDomain(data: TSubcategoryApiData): Subcategory {
    return Subcategory.create({
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
    });
  }

  public toJson(data: Subcategory): TSubcategoryApiData {
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
}

export const subcategoryMapper = new SubcategoryMapper();