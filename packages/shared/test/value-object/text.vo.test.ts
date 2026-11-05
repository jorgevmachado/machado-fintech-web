import { Text } from '../../src';

describe('Text', () => {
  test('should create valid text with tryCreate', () => {
    const result = Text.tryCreate('Texto valido');

    expect(result.isOk).toBeTruthy();
    expect(result.instance.value).toBe('Texto valido');
  });

  test('should trim text before creating', () => {
    const result = Text.tryCreate('   Texto com espacos   ');

    expect(result.isOk).toBeTruthy();
    expect(result.instance.value).toBe('Texto com espacos');
  });

  test('should fail when text is shorter than minLength', () => {
    const result = Text.tryCreate('ab', { minLength: 3 });

    expect(result.isFailure).toBeTruthy();
    expect(result.errors).toContain(`'form.validation.text.invalid.min_length', { min: 3 }`);
  });

  test('should fail when text is longer than maxLength', () => {
    const result = Text.tryCreate('abcd', { maxLength: 3 });

    expect(result.isFailure).toBeTruthy();
    expect(result.errors).toContain(`'form.validation.text.invalid.max_length', { max: 3 }`);
  });

  test('should ignore max validation when maxLength is 0', () => {
    const result = Text.tryCreate('texto maior', { maxLength: 0 });

    expect(result.isOk).toBeTruthy();
    expect(result.instance.value).toBe('texto maior');
  });

  test('should fail when text is undefined', () => {
    const result = Text.tryCreate(undefined as unknown as string);

    expect(result.isFailure).toBeTruthy();
    expect(result.errors).toContain(`'form.validation.text.invalid.min_length', { min: 1 }`);
  });

  test('should create with create method', () => {
    const text = Text.create('  Conteudo  ');

    expect(text.value).toBe('Conteudo');
  });

  test('should throw when create receives invalid text', () => {
    expect(() => Text.create('')).toThrow();
  });
});