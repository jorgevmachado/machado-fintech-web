import { DateVO } from '@fintech/shared';

import { Account } from '@/src/features/account';
import { CreditCard } from '@/src/features/credit-card';
import { Subcategory } from '@/src/features/category';

import { TransactionDirectionEnum } from '@/src/features/transaction/domain';

import {
  TransactionFrequencyUnitEnum ,
  TransactionKindEnum,
} from '@/src/features/transaction/domain/series/enum';

import {
  TTransactionSeries
} from '@/src/features/transaction/domain/series/types';

export class TransactionSeries {
  public readonly id: string;
  public readonly kind: TransactionKindEnum;
  public readonly name: string;
  public readonly note?: string;
  public readonly value: number;
  public readonly month?: number;
  public readonly account: Account;
  public readonly week_day?: number;
  public readonly end_date?: Date;
  public readonly direction: TransactionDirectionEnum;
  public readonly start_date: Date;
  public readonly credit_card?: CreditCard;
  public readonly subcategory?: Subcategory;
  public readonly day_of_month?: number;
  public readonly installments?: number;
  public readonly frequency_unit: TransactionFrequencyUnitEnum;
  public readonly frequency_interval: number;
  public readonly created_at: Date;
  public readonly updated_at?: Date;

  private constructor(props: TTransactionSeries) {
    this.id = props.id;
    this.kind = props.kind;
    this.name = props.name;
    this.note = props.note;
    this.value = props.value;
    this.month = props.month;
    this.account = Account.create(props.account);
    this.week_day = props.week_day;
    this.end_date = props.end_date;
    this.direction = props.direction;
    this.start_date = props.start_date;
    this.credit_card = props.credit_card ? CreditCard.create(props.credit_card) : undefined;
    this.subcategory = props.subcategory ? Subcategory.create(props.subcategory) : undefined;
    this.day_of_month = props.day_of_month;
    this.installments = props.installments;
    this.frequency_unit = props.frequency_unit;
    this.frequency_interval = props.frequency_interval;
    this.created_at = props.created_at;
    this.updated_at = props.updated_at;
  }

  public static create(props: TTransactionSeries): TransactionSeries {
    const createdAtResult = DateVO.tryCreate(props.created_at);
    if (createdAtResult.isFailure) {
      throw new Error(`Invalid Transaction Series created_at: ${createdAtResult.error}`);
    }

    const startDateResult = DateVO.tryCreate(props.start_date);
    if (startDateResult.isFailure) {
      throw new Error(`Invalid Transaction Series start_date: ${startDateResult.error}`);
    }

    if (props.updated_at) {
      const updatedAtResult = DateVO.tryCreate(props.updated_at);
      if (updatedAtResult.isFailure) {
        throw new Error(`Invalid Transaction Series updated_at: ${updatedAtResult.error}`);
      }
    }

    if (props.end_date) {
      const endDateResult = DateVO.tryCreate(props.end_date);
      if (endDateResult.isFailure) {
        throw new Error(`Invalid Transaction Series end_date: ${endDateResult.error}`);
      }
    }
    return new TransactionSeries(props);
  }
}