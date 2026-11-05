import { BREAK_CLASS_MAP ,OBreak } from '../../../src';

describe('break configuration', () => {

  it('should contain all break options', () => {
    expect(OBreak).toEqual([
      'normal',
      'words',
      'all',
      'keep',
    ]);
  });


  it('should map break values to tailwind classes', () => {

    expect(BREAK_CLASS_MAP).toEqual({
      normal: 'break-normal',
      words: 'break-words',
      all: 'break-all',
      keep: 'break-keep',
    });

  });


  it('should have a class mapping for every break option', () => {

    OBreak.forEach((breakValue) => {

      expect(
        BREAK_CLASS_MAP[breakValue]
      ).toBeDefined();


      expect(
        typeof BREAK_CLASS_MAP[breakValue]
      ).toBe('string');

    });

  });


  it('should return correct class for each break option', () => {

    expect(
      BREAK_CLASS_MAP.normal
    ).toBe('break-normal');


    expect(
      BREAK_CLASS_MAP.words
    ).toBe('break-words');


    expect(
      BREAK_CLASS_MAP.all
    ).toBe('break-all');


    expect(
      BREAK_CLASS_MAP.keep
    ).toBe('break-keep');

  });

});