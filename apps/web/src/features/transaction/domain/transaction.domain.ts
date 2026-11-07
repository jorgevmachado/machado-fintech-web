import {
  TransactionDirectionEnum ,
  TransactionStatusEnum,
} from '@/src/features/transaction/domain/enum';
import type { TTransaction } from '@/src/features/transaction/domain/types';
import { Account } from '@/src/features/account';
import { CreditCard } from '@/src/features/credit-card';
import { Subcategory } from '@/src/features/category';
import { DateVO } from '@fintech/shared';

export class Transaction {
  public readonly id: string;
  public readonly name: string;
  public readonly note?: string;
  public readonly value: number;
  public readonly status: TransactionStatusEnum;
  public readonly account: Account;
  public readonly direction: TransactionDirectionEnum;
  public readonly credit_card?: CreditCard;
  public readonly subcategory?: Subcategory;
  public readonly settled_on?: Date;
  public readonly expected_on: Date;
  public readonly created_at: Date;
  public readonly updated_at?: Date;

  constructor(props: TTransaction) {
    this.id = props.id;
    this.name = props.name;
    this.note = props.note;
    this.value = props.value;
    this.status = props.status;
    this.account = Account.create(props.account);
    this.direction = props.direction;
    this.credit_card = props.credit_card ? CreditCard.create(props.credit_card) : undefined;
    this.subcategory = props.subcategory ? Subcategory.create(props.subcategory) : undefined;
    this.settled_on = props.settled_on;
    this.expected_on = props.expected_on;
    this.created_at = props.created_at;
    this.updated_at = props.updated_at;
  }

  public static create(props: TTransaction): Transaction {
    const createdAtResult = DateVO.tryCreate(props.created_at);
    if (createdAtResult.isFailure) {
      throw new Error(`Invalid Transaction created_at: ${createdAtResult.error}`);
    }

    const expectedAtResult = DateVO.tryCreate(props.expected_on);
    if (expectedAtResult.isFailure) {
      throw new Error(`Invalid Transaction expected_on: ${expectedAtResult.error}`);
    }

    if (props.updated_at) {
      const updatedAtResult = DateVO.tryCreate(props.updated_at);
      if (updatedAtResult.isFailure) {
        throw new Error(`Invalid Transaction updated_at: ${updatedAtResult.error}`);
      }
    }

    if (props.settled_on) {
      const settledOnResult = DateVO.tryCreate(props.settled_on);
      if (settledOnResult.isFailure) {
        throw new Error(`Invalid Transaction settled_on: ${settledOnResult.error}`);
      }
    }
    return new Transaction(props);
  }
}