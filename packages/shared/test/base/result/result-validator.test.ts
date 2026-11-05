import { Result, ResultError, ResultValidator } from '../../../src';

describe('ResultValidator', () => {
  describe('throwsIfTrue', () => {
    test('should throw in throwsIfTrue when source instance is truthy', () => {
      const validator = new ResultValidator({ instance: true, isFailure: false });

      expect(() => validator.throwsIfTrue('ERR_TRUE')).toThrow('ERR_TRUE');
      expect(validator.result).toEqual({ instance: true, isFailure: false });
    });

    test('should not throw in throwsIfTrue when source instance is falsy', () => {
      const validator = new ResultValidator({ instance: false, isFailure: false });

      expect(() => validator.throwsIfTrue()).not.toThrow();
      expect(validator.result).toEqual({ instance: false, isFailure: false });
    });

    test('should throw the same Error instance when Error is provided', () => {
      const validator = new ResultValidator({ instance: true, isFailure: false });
      const expectedError = new Error('ERR_INSTANCE');

      expect(validator.result).toEqual({ instance: true, isFailure: false });
      try {
        validator.throwsIfTrue(expectedError);
        throw new Error('SHOULD_HAVE_THROWN');
      } catch (error) {
        expect(error).toBe(expectedError);
      }
    });

    test('should use custom exception factory when provided', () => {
      const validator = new ResultValidator({ instance: true, isFailure: false });

      expect(validator.result).toEqual({ instance: true, isFailure: false });
      expect(() => validator.throwsIfTrue('CHAINED', (error) => new TypeError(String(error)))).toThrow(TypeError);
    });
  });

  describe('throwsIfFalse', () => {
    test('should throw in throwsIfFalse when source instance is falsy', () => {
      const validator = new ResultValidator({ instance: false, isFailure: false });

      expect(() => validator.throwsIfFalse('ERR_FALSE')).toThrow('ERR_FALSE');
      expect(validator.result).toEqual({ instance: false, isFailure: false });
    });

    test('should not throw when validation conditions are not matched', () => {
      const validator = new ResultValidator({ instance: true, isFailure: false });

      expect(() => validator.throwsIfFalse().throwsIfNull().throwsIfNotEmpty()).not.toThrow();
      expect(validator.result).toEqual({ instance: true, isFailure: false });
    });

    test('should return source in fluent get result', () => {
      const result = Result.ok(true);

      const validatedResult = result.validator.throwsIfFalse().result;

      expect(validatedResult).toBe(result);
      expect(validatedResult.isOk).toBeTruthy();
    });
  });

  describe('throwsIfNull', () => {
    test('should throw in throwsIfNull when source instance is null', () => {
      const validator = new ResultValidator({
        instance: null,
        isFailure: false,
      });

      expect(() => validator.throwsIfNull('ERR_NULL')).toThrow('ERR_NULL');
      expect(validator.result).toEqual({ instance: null, isFailure: false });
    });
  });

  describe('throwsIfNotNull', () => {
    test('should throw in throwsIfNotNull when source instance exists', () => {
      const validator = new ResultValidator({
        instance: 'value',
        isFailure: false,
      });

      expect(() => validator.throwsIfNotNull('ERR_NOT_NULL')).toThrow('ERR_NOT_NULL');
      expect(validator.result).toEqual({ instance: 'value', isFailure: false });
    });

    test('should not throw in throwsIfNotNull when source instance is null', () => {
      const validator = new ResultValidator({
        instance: null,
        isFailure: false,
      });

      expect(() => validator.throwsIfNotNull()).not.toThrow();
      expect(validator.result).toEqual({ instance: null, isFailure: false });
    });
  });

  describe('throwsIfEmpty', () => {
    test('should throw in throwsIfEmpty for empty arrays', () => {
      const validator = new ResultValidator({ instance: [], isFailure: false });

      expect(() => validator.throwsIfEmpty('ERR_EMPTY')).toThrow('ERR_EMPTY');
      expect(validator.result).toEqual({ instance: [], isFailure: false });
    });

    test('should not throw in throwsIfEmpty for non-empty arrays', () => {
      const validator = new ResultValidator({
        instance: ['x'],
        isFailure: false,
      });

      expect(() => validator.throwsIfEmpty()).not.toThrow();
      expect(validator.result).toEqual({ instance: ['x'], isFailure: false });
    });
  });

  describe('throwsIfNotEmpty', () => {
    test('should throw in throwsIfNotEmpty for non-empty arrays', () => {
      const validator = new ResultValidator({
        instance: ['x'],
        isFailure: false,
      });

      expect(() => validator.throwsIfNotEmpty('ERR_NOT_EMPTY')).toThrow('ERR_NOT_EMPTY');
      expect(validator.result).toEqual({ instance: ['x'], isFailure: false });
    });
  });

  describe('throwsIfFailed', () => {
    test('should throw in throwsIfFailed using source errors by default', () => {
      const validator = new ResultValidator({
        instance: undefined,
        isFailure: true,
        errors: ['E1', 'E2'],
      });

      expect(() => validator.throwsIfFailed()).toThrow('E1, E2');
      expect(validator.result).toEqual({ instance: undefined, isFailure: true, errors: ['E1', 'E2'] });
    });

    test('should throw in throwsIfFailed using default errors', () => {
      const validator = new ResultValidator({
        instance: undefined,
        isFailure: true
      });

      expect(() => validator.throwsIfFailed()).toThrow('RESULT_FAILED');
      expect(validator.result).toEqual({ instance: undefined, isFailure: true, errors: undefined });
    });

    test('should not throw in throwsIfFailed', () => {
      const validator = new ResultValidator({
        instance: undefined,
        isFailure: false,
      });

      expect(() => validator.throwsIfFailed()).not.toThrow();
      expect(validator.result).toEqual({ instance: undefined, isFailure: false, errors: undefined });
    });

    test('should throw ResultError preserving the original codes', () => {
      const validator = new ResultValidator({
        instance: undefined,
        isFailure: true,
        errors: ['E1', 'E2'],
      });
      expect(validator.result).toEqual({ instance: undefined, isFailure: true, errors: ['E1', 'E2'] });
      try {
        validator.throwsIfFailed();
        throw new Error('SHOULD_HAVE_THROWN');
      } catch (error) {
        expect(error).toBeInstanceOf(ResultError);
        expect((error as ResultError).errors).toEqual(['E1', 'E2']);
      }
    });
  });



});