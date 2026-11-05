import { jest } from '@jest/globals';
import { Money } from '../../src';

describe('Money', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('should create valid money with typeof string in tryCreate', () => {
    const result = Money.tryCreate('100.00');

    expect(result.isOk).toBeTruthy();
    expect(result.instance.value).toBe('100.00');
    expect(result.instance.formatted).toBe('$100.00');
    expect(result.instance.valueNumber).toBe(100);
  })

  test('should create valid money with typeof number in tryCreate', () => {
    const result = Money.tryCreate(9.99);

    expect(result.isOk).toBeTruthy();
    expect(result.instance.value).toBe(9.99);
    expect(result.instance.formatted).toBe('$9.99');
    expect(result.instance.valueNumber).toBe(9.99);
  })

  test('should create with 0 when creating money with invalid value', () => {
    const result = Money.tryCreate('$');

    expect(result.isOk).toBeTruthy();
    expect(result.instance.value).toBe('$');
    expect(result.instance.formatted).toBe('$0.00');
    expect(result.instance.valueNumber).toBe(0);
  })

  test('should fail when creating money with invalid locale', () => {
    const result = Money.tryCreate('100.20', { locale: 'invalid-locale' as any });

    expect(result.isFailure).toBeTruthy();
    expect(result.errors).toContain('form.validation.money.invalid.locale');
  })

  test('should create with create method', () => {
    const money = Money.create('100.00');

    expect(money.value).toBe('100.00');
    expect(money.formatted).toBe('$100.00');
    expect(money.valueNumber).toBe(100);
  });

  test('should throw when create receives invalid name', () => {
    expect(() => Money.create('100.00', { locale: 'invalid-locale' as any })).toThrow();
  });

  test('should create money with pt-BR locale', () => {
    const result = Money.tryCreate('100.00', { locale: 'pt-BR' });

    expect(result.isOk).toBeTruthy();
    expect(result.instance.value).toBe('100.00');
    expect(result.instance.formatted).toBe('R$ 100,00');
    expect(result.instance.valueNumber).toBe(100);
  })

  test('should create money with es-UE locale', () => {
    const result = Money.tryCreate('100.00', { locale: 'es-UE' });

    expect(result.isOk).toBeTruthy();
    expect(result.instance.value).toBe('100.00');
    expect(result.instance.formatted).toBe('100,00 €');
    expect(result.instance.valueNumber).toBe(100);
  })

  test('should create money with en-US locale', () => {
    const result = Money.tryCreate('100.00', { locale: 'en-US' });

    expect(result.isOk).toBeTruthy();
    expect(result.instance.value).toBe('100.00');
    expect(result.instance.formatted).toBe('$100.00');
    expect(result.instance.valueNumber).toBe(100);
  })

})