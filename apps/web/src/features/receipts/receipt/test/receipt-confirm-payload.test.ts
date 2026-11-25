import type { TReceiptPersist } from '../domain';
import { toReceiptConfirmPayload } from '../components/confirm/receipt-confirm-payload';

const receipt: TReceiptPersist = {
  id: '7e57c000-0000-4000-8000-000000000006',
  payer: 'Usuario Teste',
  subcategory_id: '56f17ac3-10b3-4c07-a92c-820ce6e63436',
  beneficiary: 'Claro Net',
  paid_amount: 119.99,
  payment_date: new Date('2026-11-02T00:00:00.000Z'),
  due_date: new Date('2026-11-10T00:00:00.000Z'),
  source_institution: 'Nubank',
  description: 'Internet',
};

const formValues = {
  name: 'Claro Net',
  direction: 'OUT',
  expected_on: '2026-11-10',
  account_id: '3b3f1c1e-1111-4222-8333-444455556666',
  credit_card_id: '',
  subcategory_id: '56f17ac3-10b3-4c07-a92c-820ce6e63436',
  note: '',
};

describe('toReceiptConfirmPayload', () => {
  it('keeps the receipt fields the confirm requires but the form does not edit', () => {
    const payload = toReceiptConfirmPayload(receipt, formValues);

    expect(payload).toEqual(expect.objectContaining({
      id: receipt.id,
      payer: 'Usuario Teste',
      beneficiary: 'Claro Net',
      paid_amount: 119.99,
      payment_date: receipt.payment_date,
      source_institution: 'Nubank',
      subcategory_id: receipt.subcategory_id,
    }));
  });

  it('uses the chosen account and the expected date typed in the form', () => {
    const payload = toReceiptConfirmPayload(receipt, formValues);

    expect(payload.account_id).toBe('3b3f1c1e-1111-4222-8333-444455556666');
    expect(payload.expected_on).toEqual(new Date('2026-11-10T00:00:00.000Z'));
    expect(payload.direction).toBe('OUT');
  });

  it('confirms as a simple entry, the only kind the dialog offers', () => {
    expect(toReceiptConfirmPayload(receipt, formValues).transaction_kind).toBe('SIMPLE');
  });

  it('falls back to the logged user when the receipt has no payer', () => {
    const payload = toReceiptConfirmPayload({ ...receipt, payer: undefined }, formValues, 'Maria');

    expect(payload.payer).toBe('Maria');
  });

  it('keeps the receipt subcategory when the form leaves it empty', () => {
    const payload = toReceiptConfirmPayload(receipt, { ...formValues, subcategory_id: '' });

    expect(payload.subcategory_id).toBe(receipt.subcategory_id);
  });

  it('omits empty optional values instead of sending empty strings', () => {
    const payload = toReceiptConfirmPayload(receipt, {
      ...formValues,
      note: '   ',
      credit_card_id: '',
    });

    expect(payload.note).toBeUndefined();
    expect(payload.credit_card_id).toBeUndefined();
  });

  it('sends the note when the user types one', () => {
    const payload = toReceiptConfirmPayload(receipt, { ...formValues, note: 'Pago no débito' });

    expect(payload.note).toBe('Pago no débito');
  });

  it('falls back to the receipt payment date when the form date is invalid', () => {
    const payload = toReceiptConfirmPayload(receipt, { ...formValues, expected_on: '10/11/2026' });

    expect(payload.expected_on).toEqual(receipt.payment_date);
  });
});