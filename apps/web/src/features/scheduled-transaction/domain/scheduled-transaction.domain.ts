import {
  TransactionDirectionEnum ,
  TransactionStatusEnum,
} from '@/src/features/transaction/domain/enum';
import { Account } from '@/src/features/account';
import { CreditCard } from '@/src/features/credit-card';
import { Subcategory } from '@/src/features/category';
import { DateVO } from '@fintech/shared';

import {
  TScheduledTransaction
} from './types';
import { TransactionSeries } from '@/src/features/transaction-series/domain';

export class ScheduledTransaction {
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
  public readonly occurrence_on: Date;
  public readonly occurrence_index: number;
  public readonly transaction_serie: TransactionSeries;
  public readonly created_at: Date;
  public readonly updated_at?: Date;

  private constructor(props: TScheduledTransaction) {
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
    this.occurrence_on = props.occurrence_on;
    this.occurrence_index = props.occurrence_index;
    this.transaction_serie = TransactionSeries.create(props.transaction_serie);
    this.created_at = props.created_at;
    this.updated_at = props.updated_at;
  }

  public static create(props: TScheduledTransaction): ScheduledTransaction {
    const createdAtResult = DateVO.tryCreate(props.created_at);
    if (createdAtResult.isFailure) {
      throw new Error(`Invalid Scheduled Transaction created_at: ${createdAtResult.error}`);
    }

    const expectedAtResult = DateVO.tryCreate(props.expected_on);
    if (expectedAtResult.isFailure) {
      throw new Error(`Invalid Scheduled Transaction expected_on: ${expectedAtResult.error}`);
    }

    if (props.updated_at) {
      const updatedAtResult = DateVO.tryCreate(props.updated_at);
      if (updatedAtResult.isFailure) {
        throw new Error(`Invalid Scheduled Transaction updated_at: ${updatedAtResult.error}`);
      }
    }

    if (props.settled_on) {
      const settledOnResult = DateVO.tryCreate(props.settled_on);
      if (settledOnResult.isFailure) {
        throw new Error(`Invalid Scheduled Transaction settled_on: ${settledOnResult.error}`);
      }
    }

    if (props.occurrence_on) {
      const occurrenceOnResult = DateVO.tryCreate(props.occurrence_on);
      if (occurrenceOnResult.isFailure) {
        throw new Error(`Invalid Scheduled Transaction occurrence_on: ${occurrenceOnResult.error}`);
      }
    }
    return new ScheduledTransaction(props);
  }
}