import { DateFormat } from '../../../../src/value-object/date/format';

describe('DateFormat', () => {
  const dateFormat = new DateFormat();

  describe('dateStringToDate', () => {
    test('should convert a valid date string to a Date object', () => {
      const dateString = '2024-06-15';
      const result = dateFormat.dateStringToDate(dateString);
      expect(result).toBeInstanceOf(Date);
      expect(result?.toISOString().split('T')[0]).toBe(dateString);
    });

    test('should return undefined for an invalid date string', () => {
      const invalidDateString = 'invalid-date';
      const result = dateFormat.dateStringToDate(invalidDateString);
      expect(result).toBeUndefined();
    });

    test.each([
      '',
      '2024-6-15',
      '2024-06-5',
      '2024/06/15',
      ' 2024-06-15',
      '2024-06-15 ',
      '2024-00-15',
      '2024-13-15',
      '2024-06-00',
      '2024-06-32',
      '2023-02-29',
      '2024-02-30',
    ])('should reject invalid calendar date %s', (value) => {
      expect(dateFormat.dateStringToDate(value)).toBeUndefined();
    });

    test.each([
      '2024-02-29',
      '1900-02-28',
      '0000-01-01',
      '0099-12-31',
    ])('should parse valid UTC calendar date %s', (value) => {
      const result = dateFormat.dateStringToDate(value);

      expect(result?.toISOString()).toBe(`${value}T00:00:00.000Z`);
    });

    test('should return undefined for a undefined date string', () => {
      const result = dateFormat.dateStringToDate(undefined);
      expect(result).toBeUndefined();
    });
  });

  describe('dateTimeStringToDate', () => {
    test('should convert an ISO date-time string with microseconds to a Date object', () => {
      const dateTimeString = '2026-10-03T23:19:16.993406Z';
      const result = dateFormat.dateTimeStringToDate(dateTimeString);

      expect(result).toBeInstanceOf(Date);
      expect(result?.toISOString()).toBe('2026-10-03T23:19:16.993Z');
    });

    test('should convert an ISO date-time string with a timezone offset', () => {
      const result = dateFormat.dateTimeStringToDate('2026-10-03T23:19:16.993+02:00');

      expect(result?.toISOString()).toBe('2026-10-03T21:19:16.993Z');
    });

    test('should return undefined for an invalid date-time string', () => {
      expect(dateFormat.dateTimeStringToDate('2026-02-30T23:19:16.993406Z')).toBeUndefined();
      expect(dateFormat.dateTimeStringToDate('not-a-date')).toBeUndefined();
    });

    test('should return undefined when the date-time string is absent', () => {
      expect(dateFormat.dateTimeStringToDate(undefined)).toBeUndefined();
    });
  });

  describe('dateToDateString', () => {
    test('should convert a valid Date object to a date string', () => {
      const date = new Date('2024-06-15');
      const result = dateFormat.dateToDateString(date);
      expect(result).toBe('2024-06-15');
    });

    test('should return undefined for an invalid Date object', () => {
      const invalidDate = new Date('invalid-date');
      const result = dateFormat.dateToDateString(invalidDate);
      expect(result).toBeUndefined();
    });

    test('should convert date string object to date string', () => {
      const dateString = '2024-06-15';
      const result = dateFormat.dateToDateString(dateString);
      expect(result).toBe('2024-06-15');
    });
  });

  describe('date', () => {
    test('should return formatted date string for a valid date', () => {
      const date = new Date('2024-06-15');

      expect(dateFormat.date(date)).toBe('6/15/2024');
    });

    test('should return formatted date string for a valid date object string', () => {
      const date = '2024-06-15';

      expect(dateFormat.date(date, 'en-US')).toBe('6/15/2024');
    });

    test('should format date using brazilian locale', () => {
      const date = new Date('2024-06-15');

      expect(dateFormat.date(date, 'pt-BR')).toBe('15/06/2024');
    });

    test('should format date using spanish locale', () => {
      const date = new Date('2024-06-15');

      expect(dateFormat.date(date, 'es-UE')).toBe('15/6/2024');
    });

    test('should return empty string for null date', () => {
      expect(dateFormat.date(null, 'pt-BR')).toBe('');
    });
  });

  describe('toDateOnly', () => {
    test('should return a new Date object with only the date part', () => {
      const date = new Date('2024-06-15T12:34:56Z');
      const result = dateFormat.toDateOnly(date);
      expect(result.toISOString()).toBe('2024-06-15T00:00:00.000Z');
    });

    test('should throw an error when the date is undefined', () => {
      const invalidDate = undefined;
      expect(() => dateFormat.toDateOnly(invalidDate)).toThrow('date.invalid_date');
    });

    test('should throw an error when the date is invalid', () => {
      const invalidDate = new Date('invalid-date');
      expect(() => dateFormat.toDateOnly(invalidDate)).toThrow('date.invalid_date');
    });
  });

  describe('month', () => {
    test('should return formatted month string for a valid date', () => {
      const date = new Date('2024-06-15');

      expect(dateFormat.month(date)).toBe('June');
    });

    test('should return formatted month string for a valid date object string', () => {
      const date = '2024-06-15';

      expect(dateFormat.month(date)).toBe('June');
    });

    test('should return formatted month string for a valid date with brazilian locale', () => {
      const date = new Date('2024-06-15');

      expect(dateFormat.month(date, 'pt-BR')).toBe('junho');
    });

    test('should return empty string for undefined date', () => {
      expect(dateFormat.month(undefined)).toBe('');
    });
  });
})