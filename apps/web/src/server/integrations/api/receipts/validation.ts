import {
  optionalNumber ,
  optionalString ,
  readJsonObject ,RequestValidationError ,
  requiredNumber ,
  requiredString ,
  validateDateString ,
} from '@/src/server/validation/request-validation';

import type { TReceiptPersistApiData } from '@/src/features/receipts/domain';

export async function parseReceiptPersistBody(
  request: Pick<Request, 'json'>,
  options: { preserveEmpty?: boolean } = {},
): Promise<TReceiptPersistApiData> {
  const body = await readJsonObject(request);
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