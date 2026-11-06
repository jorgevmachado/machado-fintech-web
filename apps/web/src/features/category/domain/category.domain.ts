import { DateVO } from '@fintech/shared';

import { Subcategory } from '@/src/features/category/domain/subcategory.domain';
import { TCategory } from '@/src/features/category/domain/types';

export class Category {
  public readonly id: string;
  public readonly name: string;
  public readonly icon?: string;
  public readonly color?: string;
  public readonly is_active: boolean;
  public readonly subcategories: Subcategory[];
  public readonly created_at: Date;
  public readonly updated_at?: Date;

  constructor(props: TCategory) {
    this.id = props.id;
    this.name = props.name;
    this.icon = props.icon;
    this.color = props.color;
    this.is_active = props.is_active;
    this.subcategories = props.subcategories.map(subcategory => Subcategory.create(subcategory));
    this.created_at = props.created_at;
    this.updated_at = props.updated_at;
  }

  public static create(props: TCategory): Category {
    const createdAtResult = DateVO.tryCreate(props.created_at);
    if (createdAtResult.isFailure) {
      throw new Error(`Invalid Category created_at: ${createdAtResult.error}`);
    }

    if (props.updated_at) {
      const updatedAtResult = DateVO.tryCreate(props.updated_at);
      if (updatedAtResult.isFailure) {
        throw new Error(`Invalid Category updated_at: ${updatedAtResult.error}`);
      }
    }

    return new Category(props);
  }
}