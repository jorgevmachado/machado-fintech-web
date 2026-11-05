import { type TFontFamily ,FONT_FAMILY_CLASS_MAP ,OFontFamily } from '../../../src';

describe('font family', () => {
  it('should map font family values to class names', () => {
    (Object.keys(FONT_FAMILY_CLASS_MAP) as TFontFamily[]).forEach((value) => {
      expect(FONT_FAMILY_CLASS_MAP[value]).toBe(`font-${value}`);
    });
  });

  it('should total font family values', () => {
    expect(OFontFamily.length).toBe(3);
  });
});
