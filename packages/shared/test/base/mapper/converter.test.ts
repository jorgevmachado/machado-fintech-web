import { Converter, mapEmptyStringsToNull, Mapper, parseDate, parseDecimal, Result } from '../../../src';

class ExposingConverter extends Converter {
  public parse(value: string, field: string, resource: string): Date {
    return this.parseDate(value, field, resource);
  }

  public normalize<T extends object>(data: T): object {
    return this.mapEmptyStringsToNull(data);
  }
}

class UserMapper extends Mapper<{ id: string; created_at: string }, { id: string; created_at: Date }> {
  public toDomain(data: { id: string; created_at: string }) {
    return { id: data.id, created_at: this.parseDate(data.created_at, 'created_at', 'user') };
  }

  public toJson(data: { id: string; created_at: Date }) {
    return { id: data.id, created_at: data.created_at.toISOString() };
  }
}

describe('parseDate', () => {
  test('parses an ISO timestamp', () => {
    expect(parseDate('2026-10-08T12:00:00.000Z', 'created_at', 'payer'))
      .toEqual(new Date('2026-10-08T12:00:00.000Z'));
  });

  test('reports the resource and the field when the value is invalid', () => {
    expect(() => parseDate('invalid', 'created_at', 'payer'))
      .toThrow('Invalid payer created_at: invalid');
  });

  test('accepts a custom parser', () => {
    expect(parseDate('2026-10-08', 'created_at', 'payer', (value) => new Date(value)))
      .toEqual(new Date('2026-10-08'));
  });

  test('fails when the custom parser returns undefined', () => {
    expect(() => parseDate('2026-10-08', 'created_at', 'payer', () => undefined))
      .toThrow('Invalid payer created_at: 2026-10-08');
  });
});

describe('parseDecimal', () => {
  test('parses the string the API sends for a Decimal', () => {
    expect(parseDecimal('1850.00', 'value', 'transaction')).toBe(1850);
  });

  test('keeps a number as it is', () => {
    expect(parseDecimal(1850, 'value', 'transaction')).toBe(1850);
  });

  test('parses negative and zero values', () => {
    expect(parseDecimal('-42.75', 'value', 'transaction')).toBe(-42.75);
    expect(parseDecimal('0.00', 'value', 'transaction')).toBe(0);
  });

  test('ignores surrounding whitespace', () => {
    expect(parseDecimal(' 12.50 ', 'value', 'transaction')).toBe(12.5);
  });

  test('rejects a non numeric string', () => {
    expect(() => parseDecimal('abc', 'value', 'transaction'))
      .toThrow('Invalid transaction value: abc');
  });

  test('rejects an empty string instead of coercing it to zero', () => {
    expect(() => parseDecimal('', 'value', 'transaction'))
      .toThrow('Invalid transaction value: empty value');
    expect(() => parseDecimal('   ', 'value', 'transaction'))
      .toThrow('Invalid transaction value: empty value');
  });

  test('rejects NaN and Infinity', () => {
    expect(() => parseDecimal(Number.NaN, 'value', 'transaction'))
      .toThrow('Invalid transaction value: NaN');
    expect(() => parseDecimal(Number.POSITIVE_INFINITY, 'value', 'transaction'))
      .toThrow('Invalid transaction value: Infinity');
  });

  test('names the resource and the field in the error', () => {
    expect(() => parseDecimal('abc', 'limit', 'credit card'))
      .toThrow('Invalid credit card limit: abc');
  });
});

describe('mapEmptyStringsToNull', () => {
  test('replaces empty strings with null without mutating the input', () => {
    const data = { agency: '', name: 'joao', description: '' };

    expect(mapEmptyStringsToNull(data)).toEqual({
      agency: null,
      name: 'joao',
      description: null,
    });
    expect(data).toEqual({ agency: '', name: 'joao', description: '' });
  });

  test('preserves other values and only maps direct object fields', () => {
    const data = {
      count: 0,
      active: false,
      missing: undefined,
      nullable: null,
      whitespace: ' ',
      nested: { agency: '' },
      items: [''],
    };

    expect(mapEmptyStringsToNull(data)).toEqual(data);
    expect(mapEmptyStringsToNull({})).toEqual({});
  });
});

describe('Converter', () => {
  test('exposes parseDate to subclasses', () => {
    expect(new ExposingConverter().parse('2026-10-08T12:00:00.000Z', 'created_at', 'user'))
      .toEqual(new Date('2026-10-08T12:00:00.000Z'));
  });

  test('exposes mapEmptyStringsToNull to subclasses', () => {
    expect(new ExposingConverter().normalize({ agency: '', name: 'joao' }))
      .toEqual({ agency: null, name: 'joao' });
  });

  test('lets a Mapper use parseDate without importing it', () => {
    const result = new UserMapper().mapJsonResult(Result.ok({ id: '1', created_at: '2026-10-08T12:00:00.000Z' }));

    expect(result.instance).toEqual({ id: '1', created_at: new Date('2026-10-08T12:00:00.000Z') });
  });

  test('turns an invalid date into a failed result instead of throwing', () => {
    const result = new UserMapper().mapJsonResult(Result.ok({ id: '1', created_at: 'invalid' }));

    expect(result.isFailure).toBeTruthy();
    expect(result.error).toBe('Invalid user created_at: invalid');
  });
});