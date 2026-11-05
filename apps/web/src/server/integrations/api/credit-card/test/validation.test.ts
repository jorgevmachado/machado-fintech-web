/** @jest-environment node */
import { parseCreditCardCreateBody } from '../validation';
import { RequestValidationError } from '@/src/server/validation/request-validation';

const requiredFields = {
  name: 'Card',
  brand: 'VISA',
  due_day: 15,
  closing_day: 5,
};

describe('credit card create validation', () => {
  it.each([undefined, ''])('accepts an optional icon (%s) and preserves leading zeroes in card digits', async (icon) => {
    const body = { ...requiredFields, icon, last_four_digits: '0123', limit: 10000 };
    await expect(parseCreditCardCreateBody({ json: async () => body })).resolves.toEqual({
      ...body,
      is_active: true,
    });
  });

  it('accepts empty optional form fields', async () => {
    const body = { ...requiredFields, icon: '', last_four_digits: '', description: '', color: '#123456' };
    await expect(parseCreditCardCreateBody({ json: async () => body })).resolves.toEqual({
      ...body,
      is_active: true,
    });
  });

  it.each([
    { last_four_digits: 123 },
    { icon: 123 },
    { due_day: '15' },
    { brand: 'AMERICAN EXPRESS' },
  ])('still rejects incompatible field types or unsupported brands: %o', async (invalidFields) => {
    await expect(parseCreditCardCreateBody({ json: async () => ({ ...requiredFields, ...invalidFields }) }))
      .rejects.toBeInstanceOf(RequestValidationError);
  });
});
