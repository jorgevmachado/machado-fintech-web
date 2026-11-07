import { optionalObject, requiredObject, RequestValidationError } from '../request-validation';

describe('object validation', () => {
  it('returns the original object for required and optional values', () => {
    const value: unknown = { id: 'account-1' };

    expect(requiredObject(value)).toBe(value);
    expect(optionalObject(value)).toBe(value);
    expect(requiredObject({})).toEqual({});
    expect(optionalObject({})).toEqual({});
  });

  it.each([undefined, null, [], 'account', 0, false])(
    'rejects %p when an object is required and returns undefined when optional',
    (value) => {
      expect(() => requiredObject(value)).toThrow(RequestValidationError);
      expect(() => requiredObject(value, 'account')).toThrow('account must be an object.');
      expect(optionalObject(value)).toBeUndefined();
    },
  );
});
