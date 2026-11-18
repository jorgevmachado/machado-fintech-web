import {
  TransactionDirectionEnum ,
  TransactionStatusEnum,
} from '@/src/features/transactions/transaction';
import { Account ,TAccount } from '@/src/features/account';
import { CreditCard ,TCreditCard } from '@/src/features/credit-card';
import { Subcategory ,TSubCategory } from '@/src/features/category';
import {
  TransactionKindEnum ,TransactionSeries,
} from '@/src/features/transactions/transaction-series';
import { TStatement } from '@/src/features/transactions/statement/domain/types';
import { DateVO } from '@fintech/shared';
import { StatementSourceEnum ,StatementSourceMap } from '@/src/features/transactions/statement';

/**
 * Identity of an entry in the statement list.
 *
 * A projected occurrence has no stored `id` — it only exists while the series
 * generates it — so it is addressed by its series and index instead. The
 * `:` separator never appears in a uuid, which keeps the two shapes apart.
 */
export function statementEntryKey(entry: {
  id?: string;
  seriesId?: string;
  occurrence_index?: number;
}): string {
  if (entry.id) {
    return entry.id;
  }

  if (entry.seriesId !== undefined && entry.occurrence_index !== undefined) {
    return `${entry.seriesId}:${entry.occurrence_index}`;
  }

  return '';
}

/**
 * Whether the entry belongs to a series instead of standing on its own. Both a
 * stored occurrence (`SCHEDULED`) and the one the series still generates
 * (`PROJECTED`) are edited, settled and reverted through their series.
 */
export function isSeriesOccurrence(entry: Pick<Statement, 'source'>): boolean {
  return entry.source === StatementSourceMap.SCHEDULED || entry.source === StatementSourceMap.PROJECTED;
}

export class Statement {
  public readonly id: string;
  public readonly name: string;
  public readonly note?: string;
  public readonly value: number;
  public readonly source: StatementSourceEnum;
  public readonly status: TransactionStatusEnum;
  public readonly account: TAccount;
  public readonly direction: TransactionDirectionEnum;
  public readonly settled_on?: Date;
  public readonly credit_card?: TCreditCard;
  public readonly subcategory?: TSubCategory;
  public readonly subcategory_name?: string;
  public readonly expected_on: Date;
  public readonly series_name?: string;
  public readonly series_kind?: TransactionKindEnum;
  public readonly installments?: number;
  public readonly occurrence_on?: Date;
  public readonly category_id?: string;
  public readonly category_name?: string;
  public readonly occurrence_index?: number;
  public readonly transaction_serie?: TransactionSeries;

  private constructor(props: TStatement) {
    this.id = props.id;
    this.name = props.name;
    this.note = props.note;
    this.value = props.value;
    this.source = props.source;
    this.status = props.status;
    this.account = Account.create(props.account);
    this.direction = props.direction;
    this.settled_on = props.settled_on;
    this.credit_card = props.credit_card ? CreditCard.create(props.credit_card) : undefined;
    this.subcategory = props.subcategory ? Subcategory.create(props.subcategory) : undefined;
    this.subcategory_name = props.subcategory_name;
    this.expected_on = props.expected_on;
    this.series_name = props.series_name;
    this.series_kind = props.series_kind;
    this.installments = props.installments;
    this.occurrence_on = props.occurrence_on;
    this.category_id = props.category_id;
    this.category_name = props.category_name;
    this.occurrence_index = props.occurrence_index;
    this.transaction_serie = props.transaction_serie ? TransactionSeries.create(props.transaction_serie) : undefined;
  }

  public static create(props: TStatement): Statement {
    const expectedAtResult = DateVO.tryCreate(props.expected_on);
    if (expectedAtResult.isFailure) {
      throw new Error(`Invalid Statement Transaction expected_on: ${expectedAtResult.error}`);
    }

    if (props.settled_on) {
      const settledOnResult = DateVO.tryCreate(props.settled_on);
      if (settledOnResult.isFailure) {
        throw new Error(`Invalid Statement Transaction settled_on: ${settledOnResult.error}`);
      }
    }

    if (props.occurrence_on) {
      const occurrenceOnResult = DateVO.tryCreate(props.occurrence_on);
      if (occurrenceOnResult.isFailure) {
        throw new Error(`Invalid Statement Transaction occurrence_on: ${occurrenceOnResult.error}`);
      }
    }

    return new Statement(props);
  }
}