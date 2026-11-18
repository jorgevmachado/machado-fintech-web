import { Mapper ,parseDate  } from '@fintech/shared';

import { Institution ,TInstitutionApiData } from '../domain';

export class InstitutionMapper extends Mapper<TInstitutionApiData ,Institution> {
  public toDomain(data: TInstitutionApiData): Institution {
    return Institution.create({
      id: data.id ,
      name: data.name ,
      created_at: parseDate(data.created_at ,'created_at' ,'institution') ,
      updated_at: data.updated_at == null
        ? undefined
        : parseDate(data.updated_at ,'updated_at' ,'institution') ,
    });
  }

  public toJson(data: Institution): TInstitutionApiData {
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

export const institutionMapper = new InstitutionMapper();