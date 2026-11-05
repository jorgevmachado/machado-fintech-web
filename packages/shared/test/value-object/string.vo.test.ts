import { jest } from '@jest/globals';
import { StringVO } from '../../src';

describe('StringVO', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });


  describe('tryCreate', () => {
    test('should create a StringVO instance with normalized string', () => {
      const value = `Try Text Here`;
      const result = StringVO.tryCreate(value);
      expect(result.isOk).toBeTruthy();
      expect(result.instance.value).toBe(value);
      expect(result.instance.snakeCase).toBe('try_text_here');
    });

    test('should return a failure result when creating a StringVO with an invalid string', () => {
      const value = '';
      const result = StringVO.tryCreate(value);

      expect(result.isFailure).toBeTruthy();
    });
  });

  describe('create', () => {
    test('should create a StringVO instance with normalized string', () => {
      const value = `Try Text Here`;
      const result = StringVO.create(value);
      expect(result.value).toBe(value);
      expect(result.snakeCase).toBe('try_text_here');
    });

    test('should throw an error when creating a StringVO with an invalid string', () => {
      const value = '';

      expect(() => StringVO.create(value)).toThrow('string.invalid');
    });
  });

  describe('toSnakeCase', () => {
    test('should convert a string to snake_case', () => {
      const value = 'Try Text Here';
      const result = StringVO.toSnakeCase(value);
      expect(result).toBe('try_text_here');
    });

    test('should convert a string with special characters to snake_case', () => {
      const value = 'Try@Text#Here!';
      const result = StringVO.toSnakeCase(value);
      expect(result).toBe('try_text_here');
    });

    test('should convert a string with multiple spaces to snake_case', () => {
      const value = 'Try   Text   Here';
      const result = StringVO.toSnakeCase(value);
      expect(result).toBe('try_text_here');
    });

    test('should return an empty string when converting an empty string to snake_case', () => {
      const value = '';
      const result = StringVO.toSnakeCase(value);
      expect(result).toBe('');
    });

    test('should return value when converting a string with only special characters to snake_case', () => {
      const value = '@#$%';
      const result = StringVO.toSnakeCase(value);
      expect(result).toBe('@#$%');
    });
  });
});