import { Name } from '../../src';

describe('Name', () => {
  test('should create valid name with tryCreate', () => {
    const result = Name.tryCreate('Valid Name');

    expect(result.isOk).toBeTruthy();
    expect(result.instance.value).toBe('Valid Name');
  });

  test('should trim name before creating', () => {
    const result = Name.tryCreate('   Name With Spaces   ');

    expect(result.isOk).toBeTruthy();
    expect(result.instance.value).toBe('Name With Spaces');
  });

  test('should fail when name is shorter than minLength', () => {
    const result = Name.tryCreate('ab', { minLength: 3 });

    expect(result.isFailure).toBeTruthy();
    expect(result.errors).toContain(`'form.validation.name.invalid.min_length', { min: 3 }`);
  });

  test('should fail when name is longer than maxLength', () => {
    const result = Name.tryCreate('abcd', { maxLength: 3 });

    expect(result.isFailure).toBeTruthy();
    expect(result.errors).toContain(`'form.validation.name.invalid.max_length', { max: 3 }`);
  });

  test('should ignore max validation when maxLength is 0', () => {
    const result = Name.tryCreate('Name Bigger', { maxLength: 0 });

    expect(result.isOk).toBeTruthy();
    expect(result.instance.value).toBe('Name Bigger');
  });

  test('should fail when name is undefined', () => {
    const result = Name.tryCreate(undefined as unknown as string);

    expect(result.isFailure).toBeTruthy();
    expect(result.errors).toContain(`'form.validation.name.invalid.min_length', { min: 2 }`);
  });

  test('should create with create method', () => {
    const name = Name.create('  Content  ');

    expect(name.value).toBe('Content');
  });

  test('should throw when create receives invalid name', () => {
    expect(() => Name.create('')).toThrow();
  });
});