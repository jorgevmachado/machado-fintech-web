/** @jest-environment node */
import {
  parseReceiptConfirmBody,
  parseReceiptPersistBody,
} from '../validation';

const receiptFields = {
  id: '7e57c000-0000-4000-8000-000000000006',
  payer: 'Usuario Teste',
  subcategory_id: '56f17ac3-10b3-4c07-a92c-820ce6e63436',
  beneficiary: 'Claro Net',
  paid_amount: 119.99,
  payment_date: '2026-11-02',
  source_institution: 'Nubank',
};

const simpleFields = {
  ...receiptFields,
  name: 'Claro Net',
  account_id: '3b3f1c1e-1111-4222-8333-444455556666',
};

function request(payload: unknown) {
  return { json: async () => payload };
}

describe('parseReceiptConfirmBody', () => {
  it('defaults to the simple kind when the client sends only the receipt and the account', async () => {
    await expect(parseReceiptConfirmBody(request(simpleFields))).resolves.toEqual(simpleFields);
  });

  it('requires the transaction name', async () => {
    const withoutName = { ...simpleFields, name: '' };

    await expect(parseReceiptConfirmBody(request(withoutName)))
      .rejects.toThrow('name must be a non-empty string.');
  });

  it('requires the account for every kind', async () => {
    const withoutAccount = { ...simpleFields, account_id: '' };

    await expect(parseReceiptConfirmBody(request(withoutAccount)))
      .rejects.toThrow('account_id must be a non-empty string.');
  });

  it('forwards the installment position and total', async () => {
    const payload = {
      ...simpleFields,
      transaction_kind: 'INSTALLMENT',
      installment_index: 3,
      installments_total: 10,
    };

    await expect(parseReceiptConfirmBody(request(payload))).resolves.toEqual(payload);
  });

  it('forwards the recurrence frequency', async () => {
    const payload = {
      ...simpleFields,
      transaction_kind: 'RECURRING',
      frequency_unit: 'MONTH',
      frequency_interval: 1,
    };

    await expect(parseReceiptConfirmBody(request(payload))).resolves.toEqual(payload);
  });

  it('forwards the overwrite consent and the expected date', async () => {
    const payload = {
      ...simpleFields,
      overwrite: true,
      expected_on: '2026-11-02',
    };

    await expect(parseReceiptConfirmBody(request(payload))).resolves.toEqual(payload);
  });

  describe('rejects an inconsistent kind', () => {
    it('installment without the position', async () => {
      await expect(parseReceiptConfirmBody(request({
        ...simpleFields,
        transaction_kind: 'INSTALLMENT',
        installments_total: 10,
      }))).rejects.toThrow('installment_index and installments_total are required for INSTALLMENT.');
    });

    it('installment carrying recurrence fields', async () => {
      await expect(parseReceiptConfirmBody(request({
        ...simpleFields,
        transaction_kind: 'INSTALLMENT',
        installment_index: 1,
        installments_total: 10,
        frequency_unit: 'MONTH',
      }))).rejects.toThrow('frequency_unit and frequency_interval are not allowed for INSTALLMENT.');
    });

    it('installment with a position below one', async () => {
      await expect(parseReceiptConfirmBody(request({
        ...simpleFields,
        transaction_kind: 'INSTALLMENT',
        installment_index: 0,
        installments_total: 10,
      }))).rejects.toThrow('installment_index must be at least 1.');
    });

    it('installment with a total below the position', async () => {
      await expect(parseReceiptConfirmBody(request({
        ...simpleFields,
        transaction_kind: 'INSTALLMENT',
        installment_index: 5,
        installments_total: 4,
      }))).rejects.toThrow('installments_total must be greater than or equal to installment_index.');
    });

    it('recurrence without the frequency', async () => {
      await expect(parseReceiptConfirmBody(request({
        ...simpleFields,
        transaction_kind: 'RECURRING',
        frequency_unit: 'MONTH',
      }))).rejects.toThrow('frequency_unit and frequency_interval are required for RECURRING.');
    });

    it('recurrence carrying installment fields', async () => {
      await expect(parseReceiptConfirmBody(request({
        ...simpleFields,
        transaction_kind: 'RECURRING',
        frequency_unit: 'MONTH',
        frequency_interval: 1,
        installment_index: 1,
      }))).rejects.toThrow('installment_index and installments_total are not allowed for RECURRING.');
    });

    it('recurrence with a non-positive interval', async () => {
      await expect(parseReceiptConfirmBody(request({
        ...simpleFields,
        transaction_kind: 'RECURRING',
        frequency_unit: 'MONTH',
        frequency_interval: 0,
      }))).rejects.toThrow('frequency_interval must be at least 1.');
    });

    it('simple carrying installment fields', async () => {
      await expect(parseReceiptConfirmBody(request({
        ...simpleFields,
        installment_index: 1,
      }))).rejects.toThrow('SIMPLE does not accept installment or frequency fields.');
    });

    it('an unknown kind', async () => {
      await expect(parseReceiptConfirmBody(request({
        ...simpleFields,
        transaction_kind: 'TRANSFER',
      }))).rejects.toThrow('transaction_kind must be one of: SIMPLE, INSTALLMENT, RECURRING.');
    });

    it('an unknown direction', async () => {
      await expect(parseReceiptConfirmBody(request({
        ...simpleFields,
        direction: 'SIDEWAYS',
      }))).rejects.toThrow('direction must be one of: IN, OUT.');
    });

    it('a non-boolean overwrite', async () => {
      await expect(parseReceiptConfirmBody(request({
        ...simpleFields,
        overwrite: 'yes',
      }))).rejects.toThrow('overwrite must be a boolean.');
    });

    it('a fractional installment position', async () => {
      await expect(parseReceiptConfirmBody(request({
        ...simpleFields,
        transaction_kind: 'INSTALLMENT',
        installment_index: 1.5,
        installments_total: 10,
      }))).rejects.toThrow('installment_index must be an integer.');
    });
  });

  it('keeps rejecting an invalid payment_date, as the update parser already did', async () => {
    await expect(parseReceiptConfirmBody(request({
      ...simpleFields,
      payment_date: '02/11/2026',
    }))).rejects.toThrow('payment_date must be a valid date or ISO date-time.');
  });
});

describe('parseReceiptPersistBody', () => {
  it('stays free of confirmation fields so the PUT keeps its old contract', async () => {
    const parsed = await parseReceiptPersistBody(request({
      ...simpleFields,
      transaction_kind: 'INSTALLMENT',
      installment_index: 3,
      installments_total: 10,
    }));

    expect(parsed).toEqual(receiptFields);
    expect(parsed).not.toHaveProperty('name');
    expect(parsed).not.toHaveProperty('account_id');
    expect(parsed).not.toHaveProperty('transaction_kind');
  });
});