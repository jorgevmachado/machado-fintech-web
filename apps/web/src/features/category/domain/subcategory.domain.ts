import { TSubCategory } from '@/src/features/category/domain/types';
import { DateVO } from '@fintech/shared';

export class Subcategory {
  public readonly id: string;
  public readonly order: number;
  public readonly name: string;
  public readonly icon?: string;
  public readonly color?: string;
  public readonly is_active: boolean;
  public readonly created_at: Date;
  public readonly updated_at?: Date;

  private constructor(props: TSubCategory) {
    this.id = props.id;
    this.order = props.order;
    this.name = props.name;
    this.icon = props.icon;
    this.color = props.color;
    this.is_active = props.is_active;
    this.created_at = props.created_at;
    this.updated_at = props.updated_at;
  }

  public static create(props: TSubCategory): Subcategory {
    const createdAtResult = DateVO.tryCreate(props.created_at);
    if (createdAtResult.isFailure) {
      throw new Error(`Invalid subcategory created_at: ${createdAtResult.error}`);
    }

    if (props.updated_at) {
      const updatedAtResult = DateVO.tryCreate(props.updated_at);
      if (updatedAtResult.isFailure) {
        throw new Error(`Invalid subcategory updated_at: ${updatedAtResult.error}`);
      }
    }

    return new Subcategory(props);
  }
}