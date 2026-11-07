/** @jest-environment node */
import { parseAccountPersistBody } from '../validation';

const requiredFields = { name: 'Wallet', type: 'CASH', is_active: true };

describe('account persist validation', () => {
  const optionalFields = {
    icon: '',
    color: '',
    agency: '',
    description: '',
    account_number: '',
    financial_institution: '',
  };

  it('preserves explicit empty fields when requested for updates', async () => {
    const body = { ...requiredFields, ...optionalFields };

    await expect(parseAccountPersistBody(
      { json: async () => body },
      { preserveEmpty: true },
    )).resolves.toEqual(body);
  });

  it('keeps omitting empty optional fields by default for creation', async () => {
    await expect(parseAccountPersistBody({
      json: async () => ({ ...requiredFields, ...optionalFields }),
    })).resolves.toEqual(requiredFields);
  });
});
