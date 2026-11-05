import { type TLeading , LEADING_CLASS_MAP ,OLeading } from '../../../src';

describe('leading', () => {
  it('should map leading values to class names', () => {
    (Object.keys(LEADING_CLASS_MAP) as TLeading[]).forEach((value) => {
      expect(LEADING_CLASS_MAP[value]).toBe(`leading-${value}`);
    });
  });

  it('should total leading values', () => {
    expect(OLeading.length).toBe(14);
  });
});
