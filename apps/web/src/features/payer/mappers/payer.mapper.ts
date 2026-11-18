import { Mapper ,parseDate  } from '@fintech/shared';

import { Payer ,TPayerApiData } from '../domain';

export class PayerMapper extends Mapper<TPayerApiData ,Payer> {
  public toDomain(data: TPayerApiData): Payer {
    return Payer.create({
      id: data.id ,
      name: data.name ,
      created_at: parseDate(data.created_at ,'created_at' ,'payer') ,
      updated_at: data.updated_at == null
        ? undefined
        : parseDate(data.updated_at ,'updated_at' ,'payer') ,
    });
  }

  public toJson(data: Payer): TPayerApiData {
    return {
      id: data.id ,
      name: data.name ,
      created_at: data.created_at.toISOString() ,
      ...(data.updated_at
        ? { updated_at: data.updated_at.toISOString() }
        : {}) ,
    };
  }
}

export const payerMapper = new PayerMapper();