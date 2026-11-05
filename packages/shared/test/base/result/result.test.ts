import { Result } from '../../../src';

describe('Result', () => {
  describe('ok', () => {
    test('should create ok result with instance', () => {
      const result = Result.ok('value');

      expect(result.instance).toBe('value');
      expect(result.errors).toBeUndefined();
      expect(result.isOk).toBeTruthy();
      expect(result.isFailure).toBeFalsy();
    });

    test('should create ok result with null when instance is undefined', () => {
      const result = Result.ok();

      expect(result.instance).toBeNull();
      expect(result.errors).toBeUndefined();
      expect(result.isOk).toBeTruthy();
      expect(result.isFailure).toBeFalsy();
    });

    test('should not throw when throwsIfFailed is called on success', () => {
      const result = Result.ok('ok');

      expect(result.instance).toBe('ok');
      expect(result.errors).toBeUndefined();
      expect(result.isOk).toBeTruthy();
      expect(result.isFailure).toBeFalsy();
      expect(() => result.validator.throwsIfFailed()).not.toThrow();
    });

    test('should throw when validator.throwsIfTrue for truthy boolean instance', () => {
      const result = Result.ok(true);

      expect(result.instance).toBeTruthy();
      expect(result.errors).toBeUndefined();
      expect(result.isOk).toBeTruthy();
      expect(result.isFailure).toBeFalsy();
      expect(() => result.validator.throwsIfTrue('ERR_TRUE')).toThrow('ERR_TRUE');
    });

    test('should throw when validator.throwsIfFalse for falsy boolean instance', () => {
      const result = Result.ok(false);

      expect(result.instance).toBeFalsy();
      expect(result.errors).toBeUndefined();
      expect(result.isOk).toBeTruthy();
      expect(result.isFailure).toBeFalsy();
      expect(() => result.validator.throwsIfFalse('ERR_FALSE')).toThrow('ERR_FALSE');
    });

    test('should throw when validator.throwsIfNull for null instance', () => {
      const result = Result.ok<string>();

      expect(result.instance).toBeNull();
      expect(result.errors).toBeUndefined();
      expect(result.isOk).toBeTruthy();
      expect(result.isFailure).toBeFalsy();
      expect(() => result.validator.throwsIfNull('ERR_NULL')).toThrow('ERR_NULL');
    });

    test('should throw when validator.throwsIfNotNull for existing instance', () => {
      const result = Result.ok('ok');

      expect(result.instance).toBe('ok');
      expect(result.errors).toBeUndefined();
      expect(result.isOk).toBeTruthy();
      expect(result.isFailure).toBeFalsy();
      expect(() => result.validator.throwsIfNotNull('ERR_NOT_NULL')).toThrow('ERR_NOT_NULL');
    });

    test('should allow chaining validations and custom exception factory', () => {
      const result = Result.ok(true);

      expect(result.instance).toBeTruthy();
      expect(result.errors).toBeUndefined();
      expect(result.isOk).toBeTruthy();
      expect(result.isFailure).toBeFalsy();

      expect(() =>
        result.validator
        .throwsIfFalse()
        .throwsIfNull()
        .throwsIfTrue('CHAINED', (error) => new TypeError(String(error))),
      ).toThrow(TypeError);
    });

    test('should not throw when validations are satisfied', () => {
      const result = Result.ok(true);

      expect(result.instance).toBeTruthy();
      expect(result.errors).toBeUndefined();
      expect(result.isOk).toBeTruthy();
      expect(result.isFailure).toBeFalsy();

      expect(() => result.validator.throwsIfFalse().throwsIfNull()).not.toThrow();
    });

    test('should return original result at the end of fluent validation', () => {
      const result = Result.ok(true);

      const validatedResult = result.validator.throwsIfFalse().result;

      expect(validatedResult).toBe(result);
      expect(validatedResult.errors).toBeUndefined();
      expect(validatedResult.isOk).toBeTruthy();
      expect(validatedResult.instance).toBeTruthy();
      expect(validatedResult.isFailure).toBeFalsy();
    });
  });

  describe('fail', () => {
    test('should create failed result from string', () => {
      const result = Result.fail('ERR');

      expect(result.instance).toBeUndefined();
      expect(result.errors).toEqual(['ERR']);
      expect(result.isOk).toBeFalsy();
      expect(result.isFailure).toBeTruthy();
    });

    test('should create failed result from string array', () => {
      const result = Result.fail(['E1', 'E2']);

      expect(result.instance).toBeUndefined();
      expect(result.errors).toEqual(['E1', 'E2']);
      expect(result.isOk).toBeFalsy();
      expect(result.isFailure).toBeTruthy();
    });

    test('should use fallback error wrapper when fail receives non-array value', () => {
      const result = Result.fail(123 as unknown as string);

      expect(result.instance).toBeUndefined();
      expect(result.errors).toEqual([123]);
      expect(result.isOk).toBeFalsy();
      expect(result.isFailure).toBeTruthy();
    });

    test('should throw errors when throwsIfFailed is called on failure', () => {
      const result = Result.fail('ERR');

      expect(result.instance).toBeUndefined();
      expect(result.errors).toEqual(['ERR']);
      expect(result.isOk).toBeFalsy();
      expect(result.isFailure).toBeTruthy();
      expect(() => result.validator.throwsIfFailed()).toThrow();
    });
  });

  describe('empty', () => {
    test('should create empty result with null instance', () => {
      const result = Result.empty<string>();

      expect(result.instance).toBeNull();
      expect(result.errors).toBeUndefined();
      expect(result.isOk).toBeTruthy();
      expect(result.isFailure).toBeFalsy();
    });
  });

  describe('try', () => {
    test('should execute try with success', () => {
      const result = Result.try(() => 'done');

      expect(result.isOk).toBeTruthy();
      expect(result.instance).toBe('done');
    });

    test('should execute try with failure', () => {
      const result = Result.try(() => {
        throw 'SYNC_ERR';
      });

      expect(result.isFailure).toBeTruthy();
      expect(result.errors).toEqual(['SYNC_ERR']);
    });

    test('should execute try with Error failure and map to message', () => {
      const result = Result.try(() => {
        throw new Error('SYNC_ERR_OBJECT');
      });

      expect(result.isFailure).toBeTruthy();
      expect(result.errors).toEqual(['SYNC_ERR_OBJECT']);
    });

    test('should execute try with Result return and avoid nested Result', () => {
      const result = Result.try(() => Result.ok('sync-done'));

      expect(result.isOk).toBeTruthy();
      expect(result.instance).toBe('sync-done');
    });
  });

  describe('tryAsync', () => {
    test('should execute tryAsync with success', async () => {
      const result = await Result.tryAsync(async () => Result.ok('done'));

      expect(result.isOk).toBeTruthy();
      expect(result.instance).toBe('done');
    });

    test('should execute tryAsync with plain value and wrap in ok', async () => {
      const result = await Result.tryAsync(async () => 'done');

      expect(result.isOk).toBeTruthy();
      expect(result.instance).toBe('done');
    });

    test('should execute tryAsync with void callback and return ok', async () => {
      const result = await Result.tryAsync(async () => {});

      expect(result.isOk).toBeTruthy();
      expect(result.errors).toBeUndefined();
    });

    test('should execute tryAsync with failure', async () => {
      const result = await Result.tryAsync(async () => {
        throw 'ASYNC_ERR';
      });

      expect(result.isFailure).toBeTruthy();
      expect(result.errors).toEqual(['ASYNC_ERR']);
    });

    test('should execute tryAsync with Error failure and map to message', async () => {
      const result = await Result.tryAsync(async () => {
        throw new Error('ASYNC_ERR_OBJECT');
      });

      expect(result.isFailure).toBeTruthy();
      expect(result.errors).toEqual(['ASYNC_ERR_OBJECT']);
    });
  });

  describe('error', () => {
    test('should return the first error', () => {
      const result = Result.fail<string>(['first.error', 'second.error']);

      expect(result.error).toBe('first.error');
    });

    test('should return an empty string when there are no errors', () => {
      const result = Result.ok<string>('value');

      expect(result.error).toBe('');
    });
  });

  test('should convert to string for ok and fail', () => {
    const ok = Result.ok({ a: 1 });
    expect(ok.instance).toBeTruthy();
    expect(ok.errors).toBeUndefined();
    expect(ok.isOk).toBeTruthy();
    expect(ok.isFailure).toBeFalsy();
    expect(ok.toString()).toBe('Result.ok({"a":1})');

    const fail = Result.fail('ERR');

    expect(fail.instance).toBeUndefined();
    expect(fail.errors).toEqual(['ERR']);
    expect(fail.isOk).toBeFalsy();
    expect(fail.isFailure).toBeTruthy();
    expect(fail.toString()).toBe('Result.fail(["ERR"])');
  });

  test('should get string array RESULT_UNDEFINED when get errors with no errors', () => {
    const result = new Result<string>();
    expect(result.errors).toEqual(['RESULT_UNDEFINED']);
  });

});