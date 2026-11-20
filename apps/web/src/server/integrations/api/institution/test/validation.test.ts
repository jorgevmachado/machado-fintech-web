/** @jest-environment node */
import { parseInstitutionPersistBody } from '../validation';
import { RequestValidationError } from '@/src/server/validation/request-validation';

describe('institution persist validation', () => {
  it('keeps only the name field accepted by the API', async () => {
    await expect(parseInstitutionPersistBody({
      json: async () => ({ name: 'Nubank', id: 'ignored', extra: 'ignored' }),
    })).resolves.toEqual({ name: 'Nubank' });
  });

  it('rejects a body without name', async () => {
    await expect(parseInstitutionPersistBody({
      json: async () => ({}),
    })).rejects.toBeInstanceOf(RequestValidationError);
  });

  it('rejects a blank name', async () => {
    await expect(parseInstitutionPersistBody({
      json: async () => ({ name: '   ' }),
    })).rejects.toBeInstanceOf(RequestValidationError);
  });
});