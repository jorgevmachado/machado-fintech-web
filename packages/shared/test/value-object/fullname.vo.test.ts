import { Fullname } from '../../src';

describe('Fullname', () => {
  test('should create valid full name with tryCreate', () => {
    const result = Fullname.tryCreate('Valid Fullname');

    expect(result.isOk).toBeTruthy();
    expect(result.instance.value).toBe('Valid Fullname');
  });

  test('should trim full name before creating', () => {
    const result = Fullname.tryCreate('   Name With Spaces   ');

    expect(result.isOk).toBeTruthy();
    expect(result.instance.value).toBe('Name With Spaces');
  });

  test('should fail when full name is shorter than minLength', () => {
    const result = Fullname.tryCreate('ab', { minLength: 3 });

    expect(result.isFailure).toBeTruthy();
    expect(result.errors).toContain(`'form.validation.fullname.invalid.min_length', { min: 3 }`);
  });

  test('should fail when full name is longer than maxLength', () => {
    const result = Fullname.tryCreate('abcd', { maxLength: 3 });

    expect(result.isFailure).toBeTruthy();
    expect(result.errors).toContain(`'form.validation.fullname.invalid.max_length', { max: 3 }`);
  });

  test('should ignore max validation when maxLength is 0', () => {
    const result = Fullname.tryCreate('Name Bigger', { maxLength: 0 });

    expect(result.isOk).toBeTruthy();
    expect(result.instance.value).toBe('Name Bigger');
  });

  test('should fail when full name is undefined', () => {
    const result = Fullname.tryCreate(undefined as unknown as string);

    expect(result.isFailure).toBeTruthy();
    expect(result.errors).toContain(`'form.validation.fullname.invalid.min_length', { min: 2 }`);
  });

  test('should create with create method', () => {
    const name = Fullname.create('  Content Name');

    expect(name.value).toBe('Content Name');
  });

  test('should throw when create receives invalid full name', () => {
    expect(() => Fullname.create('')).toThrow();
  });

  test('should fail when full name is not fullname ', () => {
    const result = Fullname.tryCreate('Name');

    expect(result.isFailure).toBeTruthy();
    expect(result.errors).toContain('form.validation.fullname.invalid.first_last_required');
  })

  test('should fail when first name is too short ', () => {
    const result = Fullname.tryCreate('J Doe');

    expect(result.isFailure).toBeTruthy();
    expect(result.errors).toContain(`'form.validation.fullname.invalid.first_last_too_short', { min: 2 }`);
  })

  test('should fail when last name is too short ', () => {
    const result = Fullname.tryCreate('John D');

    expect(result.isFailure).toBeTruthy();
    expect(result.errors).toContain(`'form.validation.fullname.invalid.first_last_too_short', { min: 2 }`);
  })
});