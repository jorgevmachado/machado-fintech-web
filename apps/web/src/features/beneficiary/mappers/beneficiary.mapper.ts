import { Mapper } from '@fintech/shared';

import { Beneficiary, TBeneficiaryApiData } from '../domain';

export class BeneficiaryMapper extends Mapper<TBeneficiaryApiData, Beneficiary> {
  public toDomain(data: TBeneficiaryApiData): Beneficiary {
    return Beneficiary.create({
      id: data.id,
      name: data.name,
      created_at: this.parseDate(data.created_at, 'created_at', 'beneficiary'),
      updated_at: data.updated_at == null
        ? undefined
        : this.parseDate(data.updated_at, 'updated_at', 'beneficiary'),
    });
  }

  public toJson(data: Beneficiary): TBeneficiaryApiData {
    return {
      id: data.id,
      name: data.name,
      created_at: data.created_at.toISOString(),
      ...(data.updated_at
        ? { updated_at: data.updated_at.toISOString() }
        : {}),
    };
  }
}

export const beneficiaryMapper = new BeneficiaryMapper();