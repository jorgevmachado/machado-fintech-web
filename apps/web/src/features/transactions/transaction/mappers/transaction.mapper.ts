import { DateVO ,Mapper ,parseDate ,parseDecimal } from '@fintech/shared';

import { Transaction ,TTransactionApiData } from '../domain';

import { accountMapper } from '@/src/features/account/mappers/account.mapper';
import {
  creditCardMapper ,
} from '@/src/features/credit-card/mappers/credit-card.mapper';
import {
  subcategoryMapper ,
} from '@/src/features/category/mappers/subcategory.mapper';

/** The API sends date-only values (`YYYY-MM-DD`); `DateVO` keeps them at UTC midnight. */
const dateOnlyParser = (value: string): Date | undefined => DateVO.format.dateStringToDate(
  value);

export class TransactionMapper extends Mapper<TTransactionApiData ,Transaction> {
  public toDomain(data: TTransactionApiData): Transaction {
    return Transaction.create({
      id: data.id ,
      name: data.name ,
      note: data.note ,
      value: parseDecimal(data.value ,'value' ,'transaction') ,
      status: data.status ,
      account: accountMapper.toDomain(data.account) ,
      subcategory: data.subcategory ?
        subcategoryMapper.toDomain(data.subcategory) :
        undefined ,
      credit_card: data.credit_card ?
        creditCardMapper.toDomain(data.credit_card) :
        undefined ,
      direction: data.direction ,
      created_at: parseDate(data.created_at ,'created_at' ,'transaction') ,
      expected_on: parseDate(data.expected_on ,'expected_on' ,'transaction' ,
        dateOnlyParser) ,
      updated_at: data.updated_at == null
        ? undefined
        : parseDate(data.updated_at ,'updated_at' ,'transaction') ,
      settled_on: data.settled_on == null
        ?
        undefined
        :
        parseDate(data.settled_on ,'settled_on' ,'transaction' ,
          dateOnlyParser) ,
    });
  }

  public toJson(data: Transaction): TTransactionApiData {
    return {
      id: data.id ,
      name: data.name ,
      note: data.note ,
      value: data.value ,
      status: data.status ,
      account: accountMapper.toJson(data.account) ,
      subcategory: data.subcategory ?
        subcategoryMapper.toJson(data.subcategory) :
        undefined ,
      credit_card: data.credit_card ?
        creditCardMapper.toJson(data.credit_card) :
        undefined ,
      direction: data.direction ,
      created_at: data.created_at.toISOString() ,
      expected_on: DateVO.format.dateToDateString(data.expected_on) ?? '' ,
      ...(data.updated_at
        ? { updated_at: data.updated_at.toISOString() }
        : {}) ,
      ...(data.settled_on
        ? { settled_on: DateVO.format.dateToDateString(data.settled_on) }
        : {}) ,
    };
  }
}

export const transactionMapper = new TransactionMapper();