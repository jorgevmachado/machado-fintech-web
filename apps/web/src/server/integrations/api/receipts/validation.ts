import {
  optionalBoolean ,
  optionalEnum ,
  optionalInteger ,
  optionalNumber ,
  optionalString ,
  readJsonObject ,RequestValidationError ,
  requiredNumber ,
  requiredString ,
  validateDateString ,
} from '@/src/server/validation/request-validation';

import type {
  ReceiptTransactionKindEnum ,
  TReceiptConfirmApiData ,
  TReceiptPersistApiData,
} from '@/src/features/receipts/receipt';
import {
  ReceiptTransactionKindMap,
} from '@/src/features/receipts/receipt/domain/types';
import {
  TransactionDirectionMap,
} from '@/src/features/transactions/transaction/domain/enum';
import {
  TransactionFrequencyUnitMap,
} from '@/src/features/transactions/transaction-series/domain/enum';

const RECEIPT_TRANSACTION_KINDS = Object.values(ReceiptTransactionKindMap);
const TRANSACTION_DIRECTIONS = Object.values(TransactionDirectionMap);
const FREQUENCY_UNITS = Object.values(TransactionFrequencyUnitMap);

export async function parseReceiptPersistBody(
  request: Pick<Request, 'json'>,
  options: { preserveEmpty?: boolean } = {},
): Promise<TReceiptPersistApiData> {
  return parseReceiptPersistFields(await readJsonObject(request), options);
}

/** Campos do recibo em si, já com o JSON lido — reusado pelo parser do confirm. */
export function parseReceiptPersistFields(
  body: Record<string, unknown>,
  options: { preserveEmpty?: boolean } = {},
): TReceiptPersistApiData {
  const id = requiredString(body, 'id');
  const fine = optionalNumber(body, 'fine');
  const payer = requiredString(body, 'payer');
  const barcode = optionalString(body, 'barcode');

  const due_date = optionalString(body, 'due_date', options);
  validateDateString(due_date, 'due_date');

  const subcategory_id = requiredString(body, 'subcategory_id');

  const discount = optionalNumber(body, 'discount');
  const interest = optionalNumber(body, 'interest');

  const beneficiary = requiredString(body, 'beneficiary');
  const description = optionalString(body, 'description');

  const paid_amount = requiredNumber(body, 'paid_amount');

  const payment_date = requiredString(body, 'payment_date');
  validateDateString(payment_date, 'payment_date');

  const total_charges = optionalNumber(body, 'total_charges');
  const authentication = optionalString(body, 'authentication');
  const transaction_id = optionalString(body, 'transaction_id');
  const effective_payer = optionalString(body, 'effective_payer');
  const document_amount = optionalNumber(body, 'document_amount');
  const source_institution = requiredString(body, 'source_institution');
  const destination_institution = optionalString(body, 'destination_institution');

  return {
    id,
    ...(fine === undefined ? {} : { fine }),
    ...(payer === undefined ? {} : { payer }),
    ...(barcode === undefined ? {} : { barcode }),
    ...(due_date === undefined ? {} : { due_date }),
    subcategory_id,
    ...(discount === undefined ? {} : { discount }),
    ...(interest === undefined ? {} : { interest }),
    beneficiary,
    ...(description === undefined ? {} : { description }),
    paid_amount,
    payment_date,
    ...(total_charges === undefined ? {} : { total_charges }),
    ...(authentication === undefined ? {} : { authentication }),
    ...(transaction_id === undefined ? {} : { transaction_id }),
    ...(effective_payer === undefined ? {} : { effective_payer }),
    ...(document_amount === undefined ? {} : { document_amount }),
    source_institution,
    ...(destination_institution === undefined ? {} : { destination_institution }),
  };
}

export async function parseReceiptConfirmBody(
  request: Pick<Request, 'json'>,
  options: { preserveEmpty?: boolean } = {},
): Promise<TReceiptConfirmApiData> {
  const body = await readJsonObject(request);
  const receipt = parseReceiptPersistFields(body, options);
  const name = requiredString(body, 'name');
  const account_id = requiredString(body, 'account_id');
  const direction = optionalEnum(body, 'direction', TRANSACTION_DIRECTIONS);
  const credit_card_id = optionalString(body, 'credit_card_id');
  const note = optionalString(body, 'note', options);
  const overwrite = optionalBoolean(body, 'overwrite');

  const expected_on = optionalString(body, 'expected_on', options);
  validateDateString(expected_on, 'expected_on');

  const transaction_kind = optionalEnum(
    body,
    'transaction_kind',
    RECEIPT_TRANSACTION_KINDS,
  );
  const installment_index = optionalInteger(body, 'installment_index');
  const installments_total = optionalInteger(body, 'installments_total');
  const frequency_unit = optionalEnum(body, 'frequency_unit', FREQUENCY_UNITS);
  const frequency_interval = optionalInteger(body, 'frequency_interval');

  validateTransactionKind({
    transaction_kind: transaction_kind ?? ReceiptTransactionKindMap.SIMPLE,
    installment_index,
    installments_total,
    frequency_unit,
    frequency_interval,
  });

  return {
    ...receipt,
    name,
    account_id,
    ...(direction === undefined ? {} : { direction }),
    ...(credit_card_id === undefined ? {} : { credit_card_id }),
    ...(note === undefined ? {} : { note }),
    ...(overwrite === undefined ? {} : { overwrite }),
    ...(expected_on === undefined ? {} : { expected_on }),
    ...(transaction_kind === undefined ? {} : { transaction_kind }),
    ...(installment_index === undefined ? {} : { installment_index }),
    ...(installments_total === undefined ? {} : { installments_total }),
    ...(frequency_unit === undefined ? {} : { frequency_unit }),
    ...(frequency_interval === undefined ? {} : { frequency_interval }),
  };
}

type TTransactionKindFields = {
  transaction_kind: ReceiptTransactionKindEnum;
  installment_index?: number;
  installments_total?: number;
  frequency_unit?: string;
  frequency_interval?: number;
}

/**
 * Espelha o `model_validator` da API: recusar aqui dá ao cliente um 400 com a
 * causa antes de a requisição sair, e mantém o contrato do confirm explícito.
 */
function validateTransactionKind({
  transaction_kind,
  installment_index,
  installments_total,
  frequency_unit,
  frequency_interval,
}: TTransactionKindFields): void {
  const hasInstallment = installment_index !== undefined || installments_total !== undefined;
  const hasFrequency = frequency_unit !== undefined || frequency_interval !== undefined;

  if (transaction_kind === ReceiptTransactionKindMap.INSTALLMENT) {
    if (installment_index === undefined || installments_total === undefined) {
      throw new RequestValidationError(
        'installment_index and installments_total are required for INSTALLMENT.',
      );
    }
    if (hasFrequency) {
      throw new RequestValidationError(
        'frequency_unit and frequency_interval are not allowed for INSTALLMENT.',
      );
    }
    if (installment_index < 1) {
      throw new RequestValidationError('installment_index must be at least 1.');
    }
    if (installments_total < installment_index) {
      throw new RequestValidationError(
        'installments_total must be greater than or equal to installment_index.',
      );
    }
    return;
  }

  if (transaction_kind === ReceiptTransactionKindMap.RECURRING) {
    if (frequency_unit === undefined || frequency_interval === undefined) {
      throw new RequestValidationError(
        'frequency_unit and frequency_interval are required for RECURRING.',
      );
    }
    if (hasInstallment) {
      throw new RequestValidationError(
        'installment_index and installments_total are not allowed for RECURRING.',
      );
    }
    if (frequency_interval < 1) {
      throw new RequestValidationError('frequency_interval must be at least 1.');
    }
    return;
  }

  if (hasInstallment || hasFrequency) {
    throw new RequestValidationError(
      'SIMPLE does not accept installment or frequency fields.',
    );
  }
}

export async function parseReceiptBatchBody(
  request: Pick<Request, 'formData'>,
): Promise<FormData> {
  let body: FormData;
  try {
    body = await request.formData();
  } catch {
    throw new RequestValidationError('Request body must contain valid form data.');
  }

  const fields = Array.from(body.keys());
  if (fields.some((field) => field !== 'files')) {
    throw new RequestValidationError('Only files are accepted for receipt uploads.');
  }

  const files = body.getAll('files');
  if (files.length === 0 || files.some((file) => typeof File === 'undefined' || !(file instanceof File))) {
    throw new RequestValidationError('At least one file must be included in the upload.');
  }

  return body;
}