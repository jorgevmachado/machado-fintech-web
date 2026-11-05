import {
  type TAlign,
  type TBasicAlign ,
  TEXT_ALIGN_CLASS_MAP,
  TEXT_ALIGN_BASIC_CLASS_MAP,
  OAlign,
  OBasicAlign
} from '../../../src';

describe('align', () => {
  it('should map align values to class names', () => {
    (Object.keys(TEXT_ALIGN_CLASS_MAP) as TAlign[]).forEach((align) => {
      expect(TEXT_ALIGN_CLASS_MAP[align]).toBe(`text-${align}`);
    });
  });

  it('should total align values', () => {
    expect(OAlign.length).toBe(6);
  });

  it('should map basic align values to class names', () => {
    (Object.keys(TEXT_ALIGN_BASIC_CLASS_MAP) as TBasicAlign[]).forEach((align) => {
      expect(TEXT_ALIGN_BASIC_CLASS_MAP[align]).toBe(`text-${align}`);
    });
  });

  it('should total basic align values', () => {
    expect(OBasicAlign.length).toBe(3);
  });
});
