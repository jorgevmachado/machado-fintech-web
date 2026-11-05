import { type TWeight ,WEIGHT_CLASS_MAP ,OWeight } from '../../../src';

describe('weight', () => {
  it('should map tone values to class names', () => {
    (Object.keys(WEIGHT_CLASS_MAP) as TWeight[]).forEach((value) => {
      expect(WEIGHT_CLASS_MAP[value]).toBe(`font-${value}`);
    });
  });

  it('should total tone values', () => {
    expect(OWeight.length).toBe(9);
  });
});
