import {
  OTransform,
  TRANSFORM_CLASS_MAP,
} from '../../../src';


describe('transform configuration', () => {

  it('should contain all transform options', () => {
    expect(OTransform).toEqual([
      'none',
      'uppercase',
      'lowercase',
      'capitalize',
    ]);
  });


  it('should map transform values to tailwind classes', () => {
    expect(TRANSFORM_CLASS_MAP).toEqual({
      none: 'normal-case',
      uppercase: 'uppercase',
      lowercase: 'lowercase',
      capitalize: 'capitalize',
    });
  });


  it('should have a class mapping for every transform option', () => {

    OTransform.forEach((transform) => {

      expect(
        TRANSFORM_CLASS_MAP[transform]
      ).toBeDefined();


      expect(
        typeof TRANSFORM_CLASS_MAP[transform]
      ).toBe('string');

    });

  });


  it('should return correct class for each transform option', () => {

    expect(
      TRANSFORM_CLASS_MAP.none
    ).toBe('normal-case');


    expect(
      TRANSFORM_CLASS_MAP.uppercase
    ).toBe('uppercase');


    expect(
      TRANSFORM_CLASS_MAP.lowercase
    ).toBe('lowercase');


    expect(
      TRANSFORM_CLASS_MAP.capitalize
    ).toBe('capitalize');

  });

});