import { NumberVO } from '../../src';

describe('NumberVO', () => {
  describe('tryCreate', () => {
    it.each([
      [12, 12],
      [-12.5, -12.5],
      ['12', 12],
      ['-12.5', -12.5],
      ['1.25e2', 125],
      ['0x10', 16],
    ])('creates a number from %s', (input, expected) => {
      const result = NumberVO.tryCreate(input);

      expect(result.isOk).toBe(true);
      expect(result.instance.value).toBe(expected);
    });

    it.each([
      '',
      ' ',
      '\t',
      'not-a-number',
      'Infinity',
      '-Infinity',
      'NaN',
    ])('rejects invalid numeric string %j', (input) => {
      const result = NumberVO.tryCreate(input);

      expect(result.isFailure).toBe(true);
      expect(result.error).toBe('number.invalid');
    });

    it.each([null, undefined, true, {}, Symbol('number')])(
      'rejects unsupported input %s',
      (input) => {
        const result = NumberVO.tryCreate(input);

        expect(result.isFailure).toBe(true);
        expect(result.error).toBe('number.invalid');
      },
    );

    it.each([Number.NaN, Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY])(
      'rejects non-finite number %s',
      (input) => {
        const result = NumberVO.tryCreate(input);

        expect(result.isFailure).toBe(true);
        expect(result.error).toBe('number.invalid');
      },
    );
  });

  describe('create', () => {
    it('returns the value object for a valid numeric value', () => {
      expect(NumberVO.create('24.75').value).toBe(24.75);
    });

    it('throws for an invalid numeric value', () => {
      expect(() => NumberVO.create('invalid')).toThrow('number.invalid');
    });
  });
});
