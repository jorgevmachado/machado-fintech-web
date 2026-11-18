import { Mapper ,parseDate  } from '@fintech/shared';

import { Account ,TAccountApiData } from '../domain';

export class AccountMapper extends Mapper<TAccountApiData ,Account> {
  public toDomain(data: TAccountApiData): Account {
    return Account.create({
      id: data.id ,
      icon: data.icon ,
      type: data.type ,
      name: data.name ,
      color: data.color ,
      agency: data.agency ,
      is_active: data.is_active ,
      description: data.description ,
      account_number: data.account_number ,
      financial_institution: data.financial_institution ,
      created_at: parseDate(data.created_at ,'created_at' ,'account') ,
      updated_at: data.updated_at == null
        ? undefined
        : parseDate(data.updated_at ,'updated_at' ,'account') ,
    });
  }

  public toJson(data: Account): TAccountApiData {
    return {
      id: data.id ,
      icon: data.icon ,
      type: data.type ,
      name: data.name ,
      color: data.color ,
      agency: data.agency ,
      is_active: data.is_active ,
      description: data.description ,
      account_number: data.account_number ,
      financial_institution: data.financial_institution ,
      created_at: data.created_at.toISOString() ,
      ...(data.updated_at
        ? { updated_at: data.updated_at.toISOString() }
        : {}) ,
    };
  }
}

export const accountMapper = new AccountMapper();