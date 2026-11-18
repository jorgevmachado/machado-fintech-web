import { DateVO ,Mapper ,parseDate ,parseDecimal } from '@fintech/shared';

import {
  TransactionSeries ,
  TTransactionSeries ,
  TTransactionSeriesApiData,
} from '../domain';

import { accountMapper } from '@/src/features/account/mappers/account.mapper';
import {
  subcategoryMapper,
} from '@/src/features/category/mappers/subcategory.mapper';
import {
  creditCardMapper,
} from '@/src/features/credit-card/mappers/credit-card.mapper';

/** The API sends date-only values (`YYYY-MM-DD`); `DateVO` keeps them at UTC midnight. */
const dateOnlyParser = (value: string): Date | undefined => DateVO.format.dateStringToDate(
  value);

export class TransactionSeriesMapper extends Mapper<TTransactionSeriesApiData ,TransactionSeries> {
  public toDomain(data: TTransactionSeriesApiData): TTransactionSeries {
    return TransactionSeries.create({
      id: data.id ,
      kind: data.kind ,
      name: data.name ,
      note: data.note ,
      month: data.month ,
      value: parseDecimal(data.value ,'value' ,'transaction series') ,
      account: accountMapper.toDomain(data.account) ,
      subcategory: data.subcategory ?
        subcategoryMapper.toDomain(data.subcategory) :
        undefined ,
      credit_card: data.credit_card ?
        creditCardMapper.toDomain(data.credit_card) :
        undefined ,
      direction: data.direction ,
      installments: data.installments ,
      day_of_month: data.day_of_month ,
      created_at: parseDate(data.created_at ,'created_at' ,'transaction') ,
      start_date: parseDate(data.start_date ,'start_date' ,'transaction' ,
        dateOnlyParser) ,
      updated_at: data.updated_at == null
        ? undefined
        : parseDate(data.updated_at ,'updated_at' ,'transaction') ,
      end_date: data.end_date == null
        ? undefined
        : parseDate(data.end_date ,'end_date' ,'transaction' ,dateOnlyParser) ,
      frequency_interval: data.frequency_interval ,
      frequency_unit: data.frequency_unit ,
      week_day: data.week_day ,
    });
  }

  public toJson(data: TransactionSeries): TTransactionSeriesApiData {
    return {
      id: data.id ,
      kind: data.kind ,
      name: data.name ,
      note: data.note ,
      month: data.month ,
      value: data.value ,
      account: accountMapper.toJson(data.account) ,
      subcategory: data.subcategory ?
        subcategoryMapper.toJson(data.subcategory) :
        undefined ,
      credit_card: data.credit_card ?
        creditCardMapper.toJson(data.credit_card) :
        undefined ,
      direction: data.direction ,
      installments: data.installments ,
      day_of_month: data.day_of_month ,
      created_at: data.created_at.toISOString() ,
      start_date: DateVO.format.dateToDateString(data.start_date) ?? '' ,
      ...(data.updated_at
        ? { updated_at: data.updated_at.toISOString() }
        : {}) ,
      ...(data.end_date
        ? { end_date: DateVO.format.dateToDateString(data.end_date) }
        : {}) ,
      frequency_interval: data.frequency_interval ,
      frequency_unit: data.frequency_unit ,
      week_day: data.week_day ,
    };
  }
}

export const transactionSeriesMapper = new TransactionSeriesMapper();