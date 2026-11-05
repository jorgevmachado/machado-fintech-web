import { Password } from '../../src';

describe('Password', () => {
  describe('type weakness', () => {
    test('should create with valid password', () => {
      const result = Password.tryCreate('12345678');

      expect(result.isOk).toBeTruthy();
      expect(result.instance.value).toBe('12345678');
    });

    test('should trim password before creating', () => {
      const result = Password.tryCreate('   12345678   ');

      expect(result.isOk).toBeTruthy();
      expect(result.instance.value).toBe('12345678');
    });

    test('should fail when password is shorter than minLength', () => {
      const result = Password.tryCreate('123', { minLength: 4 });

      expect(result.isFailure).toBeTruthy();
      expect(result.errors).toContain(`'form.validation.password.invalid.min_length', { min: 4 }`);
    });

    test('should fail when password is undefined', () => {
      const result = Password.tryCreate(undefined as unknown as string);

      expect(result.isFailure).toBeTruthy();
      expect(result.errors).toContain(`'form.validation.password.invalid.min_length', { min: 8 }`);
    });

    test('should create with create method', () => {
      const result = Password.create('12345678');

      expect(result.value).toBe('12345678');
    });

    test('should throw when create receives invalid password', () => {
      expect(() => Password.create('')).toThrow();
    });
  });

  describe('type strong', () => {
    test('should fail when password dont have one letter', () => {
      const result = Password.tryCreate('12345678', { type: 'strong' });

      expect(result.isFailure).toBeTruthy();
      expect(result.errors).toContain('form.validation.password.invalid.least_one_letter');
    });

    test('should fail when password dont have one number', () => {
      const result = Password.tryCreate('abcdefgh', { type: 'strong' });

      expect(result.isFailure).toBeTruthy();
      expect(result.errors).toContain('form.validation.password.invalid.least_one_number');
    });

    test('should fail when password dont have one special character', () => {
      const result = Password.tryCreate('abcdefgh1', { type: 'strong' });

      expect(result.isFailure).toBeTruthy();
      expect(result.errors).toContain('form.validation.password.invalid.least_one_special_character');
    });

    test('should fail when password dont have one upper character', () => {
      const result = Password.tryCreate('abcdefgh1!', { type: 'strong' });

      expect(result.isFailure).toBeTruthy();
      expect(result.errors).toContain('form.validation.password.invalid.least_one_upper_character');
    });

    test('should create with valid password', () => {
      const result = Password.tryCreate('Abcdefgh1!', { type: 'strong' });

      expect(result.isOk).toBeTruthy();
      expect(result.instance.value).toBe('Abcdefgh1!');
    });
  });
});