import { Mask } from '../../../src';

describe('Mask', () => {
  describe('format', () => {
    test('should format value according to pattern', () => {
      const mask = Mask.create('###-###');
      const formatted = mask.format('123456');
      expect(formatted).toBe('123-456');
    });

    test('should apply transform function if provided', () => {
      const mask = Mask.create('###-###', {
        transform: (value) => value.toUpperCase(),
      });
      const formatted = mask.format('abc123');
      expect(formatted).toBe('ABC-123');
    });

    test('should use custom token if provided', () => {
      const mask = Mask.create('***-***', { token: '*' });
      const formatted = mask.format('abcdef');
      expect(formatted).toBe('abc-def');
    });

    test('should filter characters based on characterPattern if provided', () => {
      const mask = Mask.create('###-###', { characterPattern: /[0-9]/ });
      const formatted = mask.format('abc123def456');
      expect(formatted).toBe('123-456');
    });

    test('should return empty string if no characters match the pattern', () => {
      const mask = Mask.create('###-###', { characterPattern: /[0-9]/ });
      const formatted = mask.format('abcdef');
      expect(formatted).toBe('');
    });

    test('should format value mobile number', () => {
      const mask = Mask.create('(##) #####-####');
      const formatted = mask.format('11998745612');
      expect(formatted).toBe('(11) 99874-5612');
    });

    test('should format value phone number', () => {
      const mask = Mask.create('(##) ####-####');
      const formatted = mask.format('11998745612');
      expect(formatted).toBe('(11) 9987-4561');
    });

    test('should format value country phone number', () => {
      const mask = Mask.create('+## (##) #####-####');
      const formatted = mask.format('5511998745612');
      expect(formatted).toBe('+55 (11) 99874-5612');
    });

    test('should format to brazilian zipcode', () => {
      const mask = Mask.create('#####-###');
      const formatted = mask.format(78954158);
      expect(formatted).toBe('78954-158');
    });

    test('should format to credit card number', () => {
      const mask = Mask.create('**&&&& &&&& &&&& &&&&**', { token: '&' });
      const formatted = mask.format(5512136625128667);
      expect(formatted).toBe('**5512 1366 2512 8667');
    });

    test('should format to credit card number with showRemainingLiterals', () => {
      const mask = Mask.create('**&&&& &&&& &&&& &&&&**', { token: '&', showRemainingLiterals: true });
      const formatted = mask.format(5512136625128667);
      expect(formatted).toBe('**5512 1366 2512 8667**');
    });

    test('should format to brazilian rg', () => {
      const mask = Mask.create('#.###.###');
      const formatted = mask.format(7858745);
      expect(formatted).toBe('7.858.745');
    });

    test('should format to brazilian id car', () => {
      const mask = Mask.create('###-####', {
        transform: (value) => value.toUpperCase(),
      });
      const formatted = mask.format('mrl2500');
      expect(formatted).toBe('MRL-2500');
    });

    test('should format with custom function pattern', () => {
      const mask = Mask.create((rawValue) => {
        const numbers = rawValue.replace(/\D/g, '');
        return numbers.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
      });
      const formatted = mask.format('1234567890');
      expect(formatted).toBe('(123) 456-7890');
    });

    test('should stop when there are no characters left for the token', () => {
      const mask = Mask.create('###');

      const formatted = mask.format('12');

      expect(formatted).toBe('12');
    });
  });
});