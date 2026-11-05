import { DECORATION_CLASS_MAP ,ODecoration } from '../../../src';

describe('decoration configuration', () => {

  it('should contain all decoration options', () => {
    expect(ODecoration).toEqual([
      'none',
      'underline',
      'lineThrough',
      'overline',
    ]);
  });


  it('should map decoration values to tailwind classes', () => {
    expect(DECORATION_CLASS_MAP).toEqual({
      none: 'no-underline',
      underline: 'underline',
      lineThrough: 'line-through',
      overline: 'overline',
    });
  });


  it('should have a class mapping for every decoration option', () => {

    ODecoration.forEach((decoration) => {

      expect(
        DECORATION_CLASS_MAP[decoration]
      ).toBeDefined();


      expect(
        typeof DECORATION_CLASS_MAP[decoration]
      ).toBe('string');

    });

  });


  it('should return correct class for each decoration option', () => {

    expect(
      DECORATION_CLASS_MAP.none
    ).toBe('no-underline');


    expect(
      DECORATION_CLASS_MAP.underline
    ).toBe('underline');


    expect(
      DECORATION_CLASS_MAP.lineThrough
    ).toBe('line-through');


    expect(
      DECORATION_CLASS_MAP.overline
    ).toBe('overline');

  });

});