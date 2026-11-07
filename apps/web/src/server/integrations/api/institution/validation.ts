
import {
  readJsonObject ,
  requiredString ,
} from '@/src/server/validation/request-validation';
import type { TInstitutionPersist } from '@/src/features/institution/domain';

export async function parseInstitutionPersistBody(request: Pick<Request, 'json'>): Promise<Omit<TInstitutionPersist, 'id'>> {
  const body = await readJsonObject(request);
  const name = requiredString(body, 'name');
  return { name };
}