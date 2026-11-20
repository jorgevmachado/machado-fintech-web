/** @jest-environment node */
import { parseReceiptPersistBody } from '../validation';

const requiredFields = {
  id: '7e57c000-0000-4000-8000-000000000006',
  payer: 'Usuario Teste',
  subcategory_id: '56f17ac3-10b3-4c07-a92c-820ce6e63436',
  beneficiary: 'Claro Net',
  paid_amount: 119.99,
  payment_date: '2026-11-02',
  source_institution: 'Nubank',
};

describe('receipt persist validation', () => {
  it('keeps payment_date in the body because the API requires it on confirm', async () => {
    await expect(parseReceiptPersistBody({
      json: async () => requiredFields,
    })).resolves.toEqual(requiredFields);
  });

  it('accepts the ISO date-time the form sends for payment_date', async () => {
    const body = { ...requiredFields, payment_date: '2026-11-02T00:00:00.000Z' };

    await expect(parseReceiptPersistBody({
      json: async () => body,
    })).resolves.toEqual(body);
  });

  it('drops empty optional fields instead of forwarding empty strings', async () => {
    await expect(parseReceiptPersistBody({
      json: async () => ({
        ...requiredFields,
        destination_institution: '',
        description: '',
        authentication: '',
      }),
    })).resolves.toEqual(requiredFields);
  });

  it('rejects a payment_date that is not a valid date', async () => {
    await expect(parseReceiptPersistBody({
      json: async () => ({ ...requiredFields, payment_date: '02/11/2026' }),
    })).rejects.toThrow('payment_date must be a valid date or ISO date-time.');
  });

  it('rejects a paid_amount that is not a number', async () => {
    await expect(parseReceiptPersistBody({
      json: async () => ({ ...requiredFields, paid_amount: '119,99' }),
    })).rejects.toThrow('paid_amount must be a finite number.');
  });
});