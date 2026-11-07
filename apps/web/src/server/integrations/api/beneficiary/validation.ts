
import {
  readJsonObject ,
  requiredString ,
} from '@/src/server/validation/request-validation';
import type { TBeneficiaryPersist } from '@/src/features/beneficiary/domain';

export async function parseBeneficiaryPersistBody(request: Pick<Request, 'json'>): Promise<Omit<TBeneficiaryPersist, 'id'>> {
  const body = await readJsonObject(request);
  const name = requiredString(body, 'name');
  return { name };
}