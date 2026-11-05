import { DateValidate } from '../../../../src/value-object/date/validate';

describe('DateValidate', () => {
  const validate = new DateValidate();

  describe('isBefore', () => {
    test('should return false when compareDate is undefined', () => {
      const date = new Date('2024-06-15');
      const result = validate.isBefore(date);
      expect(result).toBeFalsy();
    });

    test('should return true when date is before compareDate', () => {
      const date = new Date('2024-06-15');
      const compareDate = new Date('2024-06-16');
      const result = validate.isBefore(date, compareDate);
      expect(result).toBeTruthy();
    });

    test('should return false when date is after compareDate', () => {
      const date = new Date('2024-06-17');
      const compareDate = new Date('2024-06-16');
      const result = validate.isBefore(date, compareDate);
      expect(result).toBeFalsy();
    });
  });

  describe('isAfter', () => {
    test('should return false when compareDate is undefined', () => {
      const date = new Date('2024-06-15');
      const result = validate.isAfter(date);
      expect(result).toBeFalsy();
    });

    test('should return true when date is after compareDate', () => {
      const date = new Date('2024-06-17');
      const compareDate = new Date('2024-06-16');
      const result = validate.isAfter(date, compareDate);
      expect(result).toBeTruthy();
    });

    test('should return false when date is before compareDate', () => {
      const date = new Date('2024-06-15');
      const compareDate = new Date('2024-06-16');
      const result = validate.isAfter(date, compareDate);
      expect(result).toBeFalsy();
    });
  });

  describe('isDateDisabled', () => {
    test('should return true when date is before minDate', () => {
      const date = new Date('2024-06-15');
      const minDate = new Date('2024-06-16');
      const result = validate.isDateDisabled(date, minDate);
      expect(result).toBe(true);
    });

    test('should return true when date is after maxDate', () => {
      const date = new Date('2024-06-17');
      const maxDate = new Date('2024-06-16');
      const result = validate.isDateDisabled(date, undefined, maxDate);
      expect(result).toBe(true);
    });

    test('should return false when date is within minDate and maxDate', () => {
      const date = new Date('2024-06-15');
      const minDate = new Date('2024-06-14');
      const maxDate = new Date('2024-06-16');
        const result = validate.isDateDisabled(date, minDate, maxDate);
      expect(result).toBe(false);
    });
  });
})