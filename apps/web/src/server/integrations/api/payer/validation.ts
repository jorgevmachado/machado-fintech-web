
import {
  readJsonObject ,
  requiredString ,
} from '@/src/server/validation/request-validation';
import type { TPayerPersist } from '@/src/features/payer/domain';

export async function parsePayerPersistBody(request: Pick<Request, 'json'>): Promise<Omit<TPayerPersist, 'id'>> {
  const body = await readJsonObject(request);
  const name = requiredString(body, 'name');
  return { name };
}