import { jest } from '@jest/globals';
import { Token } from '../../src';

describe('Token', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('generate', () => {
    test('should generate a valid token with expiration', () => {
      jest.spyOn(Date, 'now').mockReturnValue(1_725_000_000_000);

      const token = Token.generate({ signature: 'test-signature' });
      const [header, payload, signature] = token.split('.');

      expect([header, payload, signature]).toHaveLength(3);
      expect(Token.decodeBase64Url(header)).toBe('{"alg":"none","typ":"JWT"}');
      expect(Token.decodeBase64Url(payload)).toBe('{"exp":1725086400}');
      expect(Token.decodeBase64Url(signature)).toBe('test-signature');
    });
  });

  describe('tryCreate', () => {
    test('should try create token invalid', () => {
      const result = Token.tryCreate('token');
      expect(result.isFailure).toBeTruthy();
    });

    test('should try create invalid payload token', () => {
      const token = Token.generate({ signature: 'test-signature' });

      jest.spyOn(Buffer, 'from').mockImplementation(() => {
        throw new Error('Invalid base64url');
      });

      const result = Token.tryCreate(token);
      expect(result.isFailure).toBeTruthy();
    });

    test('should return failure when payload is not valid JSON', () => {
      const invalidPayload = Buffer.from('invalid-json').toString('base64url');
      const token = `header.${invalidPayload}.signature`;

      const result = Token.tryCreate(token);

      expect(result.isFailure).toBeTruthy();
    });

    test('should return failure when payload does not contain a numeric exp', () => {
      const invalidPayload = Buffer.from(JSON.stringify({ exp: '1725086400' })).toString('base64url');
      const token = `header.${invalidPayload}.signature`;

      const result = Token.tryCreate(token);

      expect(result.isFailure).toBeTruthy();
      expect(result.errors).toContain('form.validation.token.invalid');
    });

    test('should return failure when payload is null', () => {
      const invalidPayload = Buffer.from('null').toString('base64url');
      const token = `header.${invalidPayload}.signature`;

      const result = Token.tryCreate(token);

      expect(result.isFailure).toBeTruthy();
      expect(result.errors).toContain('form.validation.token.invalid');
    });

    test('should return failure when payload is a primitive value', () => {
      const invalidPayload = Buffer.from('123').toString('base64url');
      const token = `header.${invalidPayload}.signature`;

      const result = Token.tryCreate(token);

      expect(result.isFailure).toBeTruthy();
      expect(result.errors).toContain('form.validation.token.invalid');
    });

    test('should try create token valid', () => {
      jest.spyOn(Date, 'now').mockReturnValue(1_725_000_000_000);

      const token = Token.generate({ signature: 'test-signature' });
      const result = Token.tryCreate(token);

      expect(result.isOk).toBeTruthy();
      expect(result.instance.payload).toEqual({ exp: 1725086400 });
      expect(result.instance.expiration).toBe(1_725_086_400_000);
      expect(result.instance.isExpired).toBeFalsy();
    });
  });

  describe('decodeBase64Url', () => {
    test('should return undefined when value is undefined', () => {
      const result = Token.decodeBase64Url(undefined);
      expect(result).toBeUndefined();
    });
  });

  describe('create', () => {
    test('should create token instance from a valid token', () => {
      jest.spyOn(Date, 'now').mockReturnValue(1_725_000_000_000);

      const tokenValue = Token.generate({ signature: 'test-signature' });
      const token = Token.create(tokenValue);

      expect(token.value).toBe(tokenValue);
      expect(token.payload).toEqual({ exp: 1725086400 });
    });

    test('should throw when create receives invalid token', () => {
      expect(() => Token.create('token')).toThrow('form.validation.token.invalid');
    });
  });
});