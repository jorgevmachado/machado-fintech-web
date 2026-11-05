import { DateVO } from '@fintech/shared';

import type { TCreditCard } from './types';
import type { CreditCardBrandsEnum } from './enum';

export class CreditCard {
  public readonly id: string;
  public readonly icon?: string;
  public readonly brand: CreditCardBrandsEnum;
  public readonly name: string;
  public readonly limit?: number;
  public readonly color?: string;
  public readonly due_day: number;
  public readonly is_active: boolean;
  public readonly closing_day: number;
  public readonly description?: string;
  public readonly last_four_digits?: string;
  public readonly created_at: Date;
  public readonly updated_at?: Date;

  private constructor(props: TCreditCard) {
    this.id = props.id;
    this.icon = props.icon;
    this.brand = props.brand;
    this.name = props.name;
    this.limit = props.limit;
    this.color = props.color;
    this.due_day = props.due_day;
    this.is_active = props.is_active;
    this.closing_day = props.closing_day;
    this.description = props.description;
    this.last_four_digits = props.last_four_digits;
    this.created_at = props.created_at;
    this.updated_at = props.updated_at;
  }

  public static create(props: TCreditCard): CreditCard {
    const createdAtResult = DateVO.tryCreate(props.created_at);
    if (createdAtResult.isFailure) {
      throw new Error(`Invalid payer created_at: ${createdAtResult.error}`);
    }

    if (props.updated_at) {
      const updatedAtResult = DateVO.tryCreate(props.updated_at);
      if (updatedAtResult.isFailure) {
        throw new Error(`Invalid payer updated_at: ${updatedAtResult.error}`);
      }
    }

    return new CreditCard(props);
  }

  public static get brands(): Array<string> {
    return [
      'Visa',
      'Mastercard',
      'Elo',
      'Amex',
      'Hipercard',
      'Diners',
      'Other',
    ];
  }
}