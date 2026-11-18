import { DateVO ,Mapper ,parseDate ,parseDecimal ,Result as TResult ,TPaginatedListResponse } from '@fintech/shared';

import { Statement ,statementEntryKey ,TStatement ,TStatementApiData } from '../domain';

import { accountMapper } from '@/src/features/account/mappers/account.mapper';
import {
  subcategoryMapper ,
} from '@/src/features/category/mappers/subcategory.mapper';
import {
  creditCardMapper ,
} from '@/src/features/credit-card/mappers/credit-card.mapper';
import {
  transactionSeriesMapper ,
} from '@/src/features/transactions/transaction-series/mappers/transaction-series.mapper';

/** The API sends date-only values (`YYYY-MM-DD`); `DateVO` keeps them at UTC midnight. */
const dateOnlyParser = (value: string): Date | undefined => DateVO.format.dateStringToDate(value);

/**
 * A projected occurrence comes without `id`; the series address fills it in so
 * the entry is stable across renders and usable as a list key.
 */
function resolveEntryId(data: TStatementApiData): string {
  return statementEntryKey({
    id: data.id ?? '' ,
    seriesId: data.transaction_serie?.id ,
    occurrence_index: data.occurrence_index ,
  });
}

export class StatementMapper extends Mapper<TStatementApiData ,Statement> {
  public toDomain(data: TStatementApiData): Statement {
    return Statement.create({
      id: resolveEntryId(data) ,
      name: data.name ,
      note: data.note ,
      value: parseDecimal(data.value ,'value' ,'statement') ,
      source: data.source ,
      status: data.status ,
      account: accountMapper.toDomain(data.account) ,
      subcategory: data.subcategory ?
        subcategoryMapper.toDomain(data.subcategory) :
        undefined ,
      subcategory_name: data.subcategory_name ,
      credit_card: data.credit_card ?
        creditCardMapper.toDomain(data.credit_card) :
        undefined ,
      direction: data.direction ,
      expected_on: parseDate(data.expected_on ,'expected_on' ,'statement' ,dateOnlyParser) ,
      settled_on: data.settled_on == null
        ?
        undefined
        :
        parseDate(data.settled_on ,'settled_on' ,'statement' ,dateOnlyParser) ,
      occurrence_on: data.occurrence_on == null
        ?
        undefined
        :
        parseDate(data.occurrence_on ,'occurrence_on' ,'statement' ,dateOnlyParser) ,
      category_id: data.category_id ,
      category_name: data.category_name ,
      series_name: data.series_name ,
      series_kind: data.series_kind ,
      installments: data.installments ,
      occurrence_index: data.occurrence_index ,
      transaction_serie: data.transaction_serie
        ? transactionSeriesMapper.toDomain(data.transaction_serie)
        : undefined ,
    });
  }

  public toJson(data: Statement): TStatementApiData {
    return {
      id: data.id ,
      name: data.name ,
      note: data.note ,
      value: data.value ,
      source: data.source ,
      status: data.status ,
      account: accountMapper.toJson(data.account) ,
      subcategory: data.subcategory ?
        subcategoryMapper.toJson(data.subcategory) :
        undefined ,
      subcategory_name: data.subcategory_name ,
      credit_card: data.credit_card ?
        creditCardMapper.toJson(data.credit_card) :
        undefined ,
      direction: data.direction ,
      expected_on: DateVO.format.dateToDateString(data.expected_on) ?? '' ,
      ...(data.settled_on
        ? { settled_on: DateVO.format.dateToDateString(data.settled_on) }
        : {}) ,
      ...(data.occurrence_on
        ? { occurrence_on: DateVO.format.dateToDateString(data.occurrence_on) }
        : {}) ,
      category_id: data.category_id ,
      category_name: data.category_name ,
      series_name: data.series_name ,
      series_kind: data.series_kind ,
      installments: data.installments ,
      occurrence_index: data.occurrence_index ,
      transaction_serie: data.transaction_serie
        ? transactionSeriesMapper.toJson(data.transaction_serie)
        : undefined ,
    };
  }
}

export const statementMapper = new StatementMapper();

export function statementApiDataToDomain(data: TStatementApiData): TStatement {
  return statementMapper.toDomain(data);
}

export function statementJsonToDomain(data: TStatementApiData): TStatement {
  return statementMapper.toDomain(data);
}

export function statementDomainToJson(data: Statement): TStatementApiData {
  return statementMapper.toJson(data);
}

export function statementApiDataToJson(data: TStatementApiData): TStatementApiData {
  return statementMapper.apiDataToJson(data);
}

export function mapStatementJsonResult(result: TResult<TStatementApiData>): TResult<Statement> {
  return statementMapper.mapJsonResult(result);
}

export function mapStatementJsonListResult(
  result: TResult<TPaginatedListResponse<TStatementApiData> | Array<TStatementApiData>>,
): TResult<TPaginatedListResponse<Statement> | Array<Statement>> {
  return statementMapper.mapJsonListResult(result);
}
