import {
  OLineClamp,
  LINE_CLAMP_CLASS_MAP,
} from '../../../src';


describe('line clamp configuration', () => {

  it('should contain all line clamp options', () => {
    expect(OLineClamp).toEqual([
      1,
      2,
      3,
      4,
      5,
      6,
      'none',
    ]);
  });


  it('should map line clamp values to tailwind classes', () => {
    expect(LINE_CLAMP_CLASS_MAP).toEqual({
      1: 'line-clamp-1',
      2: 'line-clamp-2',
      3: 'line-clamp-3',
      4: 'line-clamp-4',
      5: 'line-clamp-5',
      6: 'line-clamp-6',
      none: 'line-clamp-none',
    });
  });


  it('should have a class mapping for every line clamp option', () => {

    OLineClamp.forEach((lineClamp) => {

      expect(
        LINE_CLAMP_CLASS_MAP[lineClamp]
      ).toBeDefined();


      expect(
        typeof LINE_CLAMP_CLASS_MAP[lineClamp]
      ).toBe('string');

    });

  });


  it('should return correct class for each line clamp option', () => {

    expect(
      LINE_CLAMP_CLASS_MAP[1]
    ).toBe('line-clamp-1');


    expect(
      LINE_CLAMP_CLASS_MAP[2]
    ).toBe('line-clamp-2');


    expect(
      LINE_CLAMP_CLASS_MAP[3]
    ).toBe('line-clamp-3');


    expect(
      LINE_CLAMP_CLASS_MAP[4]
    ).toBe('line-clamp-4');


    expect(
      LINE_CLAMP_CLASS_MAP[5]
    ).toBe('line-clamp-5');


    expect(
      LINE_CLAMP_CLASS_MAP[6]
    ).toBe('line-clamp-6');


    expect(
      LINE_CLAMP_CLASS_MAP.none
    ).toBe('line-clamp-none');

  });

});