import {
  type TSize ,
  TEXT_SIZE_CLASS_MAP ,
  OSize ,
  OReducedSize,
} from '../../../src';

describe('size', () => {
  it('should map size values to class names', () => {
    (Object.keys(TEXT_SIZE_CLASS_MAP) as TSize[]).forEach((size) => {
      expect(TEXT_SIZE_CLASS_MAP[size]).toBe(`text-${size}`);
    });
  });

  it('should total size values', () => {
    expect(OSize.length).toBe(13);
  });

  it('should total reduced size values', () => {
    expect(OReducedSize.length).toBe(3);
  });
});
