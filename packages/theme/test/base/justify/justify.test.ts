import {
  ALIGN_JUSTIFY_CLASS_MAP,
  JUSTIFY_CLASS_MAP,
  OAlignJustify,
  OJustify,
  type TAlignJustify,
  type TJustify
} from '../../../src';

describe('justify', () => {
  it('should map justify values to class names', () => {
    (Object.keys(JUSTIFY_CLASS_MAP) as TJustify[]).forEach((justify) => {
      expect(JUSTIFY_CLASS_MAP[justify]).toBe(`justify-${justify}`);
    });
  });

  it('should total justify values', () => {
    expect(OJustify.length).toBe(6);
  });

  it('should map align justify values to class names', () => {
    (Object.keys(ALIGN_JUSTIFY_CLASS_MAP) as TAlignJustify[]).forEach((alignJustify) => {
      const expectedKey = alignJustify === 'left' ? 'start' : alignJustify === 'right' ? 'end' : 'center';
      expect(ALIGN_JUSTIFY_CLASS_MAP[alignJustify]).toBe(`justify-${expectedKey}`);
    });
  });

  it('should total align justify values', () => {
    expect(OAlignJustify.length).toBe(3);
  });
});
