
import {
  optionalString ,
  readJsonObject ,
  requiredString ,
  RequestValidationError ,requiredNumber ,requiredObjectId ,requiredObject ,
  optionalObject ,optionalObjectId ,validateDateString ,
} from '@/src/server/validation/request-validation';

import {
  TransactionDirectionMap ,
  TransactionStatusMap,
} from '@/src/features/transaction/domain';
import {
  TScheduledTransactionApiPersist
} from '@/src/server/integrations/api/scheduled-transaction/types';

export async function parseScheduledTransactionPersistBody(
  request: Pick<Request, 'json'>,
  options: { preserveEmpty?: boolean } = {},
): Promise<TScheduledTransactionApiPersist> {
  const body = await readJsonObject(request);

  const name = requiredString(body, 'name');
  const note = optionalString(body, 'note', options);
  const value = requiredNumber(body, 'value');
  const statusValue = optionalString(body, 'type', options) ?? TransactionStatusMap.PENDING;
  const status = Object.values(TransactionStatusMap).find((value) => value === statusValue);
  if (!status) {
    throw new RequestValidationError('status must be a supported transaction status.');
  }
  const account = requiredObject(body['account']);
  const account_id = requiredObjectId(account, 'id');

  const directionValue = requiredString(body, 'direction');
  const direction = Object.values(TransactionDirectionMap).find((value) => value === directionValue);
  if (!direction) {
    throw new RequestValidationError('direction must be a supported transaction direction.');
  }

  const credit_card = optionalObject(body['credit_card']);
  const credit_card_id = !credit_card ? undefined : optionalObjectId(credit_card, 'id');

  const subcategory = optionalObject(body['subcategory']);
  const subcategory_id = !subcategory ? undefined : optionalObjectId(subcategory, 'id');

  const settled_on = optionalString(body, 'settled_on', options);
  validateDateString(settled_on, 'settled_on');

  const expected_on = requiredString(body, 'expected_on');
  validateDateString(expected_on, 'expected_on');

  const occurrence_on = requiredString(body, 'occurrence_on');
  validateDateString(occurrence_on, 'occurrence_on');

  const occurrence_index = requiredNumber(body, 'occurrence_index');

  return {
    name,
    ...(note === undefined ? {} : { note }),
    value,
    status,
    account_id,
    direction,
    ...(credit_card_id === undefined ? {} : { credit_card_id }),
    ...(subcategory_id === undefined ? {} : { subcategory_id }),
    ...(settled_on === undefined ? {} : { settled_on }),
    expected_on,
    occurrence_on,
    occurrence_index
  };
}