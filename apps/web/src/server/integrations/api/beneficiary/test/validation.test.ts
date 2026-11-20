/** @jest-environment node */
import { parseBeneficiaryPersistBody } from '../validation';
import { RequestValidationError } from '@/src/server/validation/request-validation';

describe('beneficiary persist validation', () => {
  it('keeps only the name field accepted by the API', async () => {
    await expect(parseBeneficiaryPersistBody({
      json: async () => ({ name: 'Maria', id: 'ignored', extra: 'ignored' }),
    })).resolves.toEqual({ name: 'Maria' });
  });

  it('rejects a body without name', async () => {
    await expect(parseBeneficiaryPersistBody({
      json: async () => ({}),
    })).rejects.toBeInstanceOf(RequestValidationError);
  });

  it('rejects a blank name', async () => {
    await expect(parseBeneficiaryPersistBody({
      json: async () => ({ name: '   ' }),
    })).rejects.toBeInstanceOf(RequestValidationError);
  });
});