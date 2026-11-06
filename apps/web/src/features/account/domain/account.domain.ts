import { AccountTypesEnum } from './enum';
import { TAccount } from './types';
import { DateVO } from '@fintech/shared';

export class Account {
  public readonly id: string;
  public readonly icon?: string;
  public readonly type: AccountTypesEnum;
  public readonly name: string;
  public readonly color?: string;
  public readonly agency?: string;
  public readonly is_active: boolean;
  public readonly description?: string;
  public readonly account_number?: string;
  public readonly financial_institution?: string;
  public readonly created_at: Date;
  public readonly updated_at?: Date;

  private constructor(props: TAccount) {
    this.id = props.id;
    this.icon = props.icon;
    this.type = props.type;
    this.name = props.name;
    this.color = props.color;
    this.agency = props.agency;
    this.is_active = props.is_active;
    this.description = props.description;
    this.account_number = props.account_number;
    this.financial_institution = props.financial_institution;
    this.created_at = props.created_at;
    this.updated_at = props.updated_at;
  }

  public static create(props: TAccount): Account {
    const createdAtResult = DateVO.tryCreate(props.created_at);
    if (createdAtResult.isFailure) {
      throw new Error(`Invalid account created_at: ${createdAtResult.error}`);
    }

    if (props.updated_at) {
      const updatedAtResult = DateVO.tryCreate(props.updated_at);
      if (updatedAtResult.isFailure) {
        throw new Error(`Invalid account updated_at: ${updatedAtResult.error}`);
      }
    }

    return new Account(props);
  }

  public static get types(): Array<string> {
    return [
      'CHECKING',
      'SAVINGS',
      'CASH',
      'INVESTMENT',
      'OTHER',
    ];
  }
}