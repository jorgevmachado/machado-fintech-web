/** @jest-environment node */
import { parseCategoryPersistBody } from '../validation';
import { RequestValidationError } from '@/src/server/validation/request-validation';

const body = {
  name: 'Food',
  subcategories: [{ id: 'subcategory-1', name: 'Groceries', order: 1 }],
};

describe('category persist validation', () => {
  it('preserves existing subcategory identifiers and order', async () => {
    await expect(parseCategoryPersistBody({ json: async () => body })).resolves.toMatchObject(body);
  });

  it.each([
    { ...body, name: '' },
    { ...body, name: ' ' },
    { ...body, subcategories: [] },
    { ...body, subcategories: [{ name: ' ', order: 1 }] },
  ])('rejects missing required category or subcategory data: %o', async (payload) => {
    await expect(parseCategoryPersistBody({ json: async () => payload }))
      .rejects.toBeInstanceOf(RequestValidationError);
  });

  it.each([0, -1, 1.5])('rejects invalid subcategory order %s', async (order) => {
    await expect(parseCategoryPersistBody({
      json: async () => ({ ...body, subcategories: [{ name: 'Groceries', order }] }),
    })).rejects.toThrow('subcategories[0].order must be a positive integer.');
  });
});
