import { TCreditCardPersistApiData } from '@/src/features/credit-card/domain';
import { CreditCardBrandsMap } from '@/src/features/credit-card/domain/enum';
import {
  optionalNumber ,
  optionalString ,
  readJsonObject ,requiredNumber ,
  requiredString ,
  RequestValidationError,
} from '@/src/server/validation/request-validation';

export async function parseCreditCardPersistBody(
  request: Pick<Request, 'json'>,
): Promise<TCreditCardPersistApiData> {
  const body = await readJsonObject(request);

  const icon = optionalString(body, 'icon');
  const name = requiredString(body, 'name');
  const brandValue = requiredString(body, 'brand');
  const brand = Object.values(CreditCardBrandsMap).find((value) => value === brandValue);
  if (!brand) {
    throw new RequestValidationError('brand must be a supported credit card brand.');
  }
  const limit = optionalNumber(body, 'limit');
  const color = optionalString(body, 'color');
  const due_day = requiredNumber(body, 'due_day');
  const is_active = body['is_active'] === undefined ? true : Boolean(body['is_active']);
  const closing_day = requiredNumber(body, 'closing_day');
  const description = optionalString(body, 'description');
  const last_four_digits = optionalString(body, 'last_four_digits');

  return {
    ...(icon === undefined ? {} : { icon }),
    name,
    brand,
    ...(limit === undefined ? {} : { limit }),
    ...(color === undefined ? {} : { color }),
    due_day,
    is_active,
    closing_day,
    ...(last_four_digits === undefined  ? {} : { last_four_digits }),
    ...(description === undefined ? {} : { description }),
  };
}