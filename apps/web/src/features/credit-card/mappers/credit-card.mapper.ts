import { Mapper ,parseDate  } from '@fintech/shared';

import { CreditCard ,TCreditCardApiData  } from '../domain';

export class CreditCardMapper extends Mapper<TCreditCardApiData ,CreditCard> {

  private parseCreditCardLimit(value: TCreditCardApiData['limit']): number | undefined {
    if (value == null) {
      return undefined;
    }

    const limit = Number(value);
    if (!Number.isFinite(limit) ||
      (typeof value === 'string' && !value.trim())) {
      throw new Error(`Invalid creditCard limit: ${ value }`);
    }

    return limit;
  }

  public toDomain(data: TCreditCardApiData): CreditCard {
    return CreditCard.create({
      id: data.id ,
      icon: data.icon ,
      name: data.name ,
      brand: data.brand ,
      limit: this.parseCreditCardLimit(data.limit) ,
      color: data.color ,
      due_day: data.due_day ,
      is_active: data.is_active ,
      closing_day: data.closing_day ,
      description: data.description ,
      last_four_digits: data.last_four_digits ,
      created_at: parseDate(data.created_at ,'created_at' ,'creditCard') ,
      updated_at: data.updated_at == null
        ? undefined
        : parseDate(data.updated_at ,'updated_at' ,'creditCard') ,
    });
  }

  public toJson(data: CreditCard): TCreditCardApiData {
    return {
      id: data.id ,
      icon: data.icon ,
      name: data.name ,
      brand: data.brand ,
      limit: data.limit ,
      color: data.color ,
      due_day: data.due_day ,
      is_active: data.is_active ,
      closing_day: data.closing_day ,
      description: data.description ,
      last_four_digits: data.last_four_digits ,
      created_at: data.created_at.toISOString() ,
      ...(data.updated_at
        ? { updated_at: data.updated_at.toISOString() }
        : {}) ,
    };
  }
}

export const creditCardMapper = new CreditCardMapper();
