
import {
  optionalString ,
  readJsonObject ,
  requiredString ,
  RequestValidationError,
} from '@/src/server/validation/request-validation';
import type { TAccountPersist } from '@/src/features/account/domain';
import { AccountTypesMap } from '@/src/features/account/domain/enum';

export async function parseAccountPersistBody(
  request: Pick<Request, 'json'>,
  options: { preserveEmpty?: boolean } = {},
): Promise<Omit<TAccountPersist, 'id'>> {
  const body = await readJsonObject(request);

  const icon = optionalString(body, 'icon', options);
  const typeValue = requiredString(body, 'type');
  const type = Object.values(AccountTypesMap).find((value) => value === typeValue);
  if (!type) {
    throw new RequestValidationError('type must be a supported account type.');
  }
  const name = requiredString(body, 'name');
  const color = optionalString(body, 'color', options);
  const agency = optionalString(body, 'agency', options);
  const is_active = body['is_active'] === undefined ? true : Boolean(body['is_active']);
  const description = optionalString(body, 'description', options);
  const account_number = optionalString(body, 'account_number', options);
  const financial_institution = optionalString(body, 'financial_institution', options);

  return {
    ...(icon === undefined ? {} : { icon }),
    name,
    type,
    ...(agency === undefined ? {} : { agency }),
    ...(color === undefined ? {} : { color }),
    is_active,
    ...(account_number === undefined ? {} : { account_number }),
    ...(financial_institution === undefined ? {} : { financial_institution }),
    ...(description === undefined ? {} : { description }),
  };
}