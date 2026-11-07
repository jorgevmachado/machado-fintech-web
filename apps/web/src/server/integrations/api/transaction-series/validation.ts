
import {
  optionalString ,
  readJsonObject ,
  requiredString ,
  RequestValidationError ,requiredNumber ,requiredObjectId ,requiredObject ,
  optionalObject ,optionalObjectId ,validateDateString ,optionalNumber ,
} from '@/src/server/validation/request-validation';

import { TransactionDirectionMap } from '@/src/features/transaction/domain';
import { TTransactionSeriesApiPersist } from '@/src/server/integrations/api/transaction-series/types';
import {
  TransactionFrequencyUnitMap ,
  TransactionKindMap,
} from '@/src/features/transaction-series/domain';

export async function parseTransactionSeriesPersistBody(
  request: Pick<Request, 'json'>,
  options: { preserveEmpty?: boolean } = {},
): Promise<TTransactionSeriesApiPersist> {
  const body = await readJsonObject(request);

  const name = requiredString(body, 'name');
  const note = optionalString(body, 'note', options);
  const value = requiredNumber(body, 'value');

  const kindValue = requiredString(body, 'kind');
  const kind = Object.values(TransactionKindMap).find((value) => value === kindValue);
  if (!kind) {
    throw new RequestValidationError('kind must be a supported transaction kind.');
  }

  const month = optionalNumber(body, 'month');
  const week_day = optionalNumber(body, 'week_day');
  const installments = optionalNumber(body, 'installments');

  const account = requiredObject(body['account']);
  const account_id = requiredObjectId(account, 'id');

  const directionValue = requiredString(body, 'direction');
  const direction = Object.values(TransactionDirectionMap).find((value) => value === directionValue);
  if (!direction) {
    throw new RequestValidationError('direction must be a supported transaction direction.');
  }

  const frequencyUnitValue = requiredString(body, 'frequency_unit');
  const frequency_unit = Object.values(TransactionFrequencyUnitMap).find((value) => value === frequencyUnitValue);
  if (!frequency_unit) {
    throw new RequestValidationError('frequency_unit must be a supported transaction frequency_unit.');
  }

  const frequency_interval = requiredNumber(body, 'frequency_interval');

  const credit_card = optionalObject(body['credit_card']);
  const credit_card_id = !credit_card ? undefined : optionalObjectId(credit_card, 'id');

  const subcategory = optionalObject(body['subcategory']);
  const subcategory_id = !subcategory ? undefined : optionalObjectId(subcategory, 'id');

  const end_date = optionalString(body, 'end_date', options);
  validateDateString(end_date, 'end_date');

  const start_date = requiredString(body, 'start_date');
  validateDateString(start_date, 'start_date');

  return {
    kind,
    name,
    ...(note === undefined ? {} : { note }),
    value,
    month,
    account_id,
    direction,
    week_day,
    ...(credit_card_id === undefined ? {} : { credit_card_id }),
    ...(subcategory_id === undefined ? {} : { subcategory_id }),
    ...(end_date === undefined ? {} : { end_date }),
    start_date,
    installments,
    frequency_unit,
    frequency_interval,
  };
}