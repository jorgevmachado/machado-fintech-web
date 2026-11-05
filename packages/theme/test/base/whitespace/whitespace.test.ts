import {
  OWhitespace,
  WHITESPACE_CLASS_MAP,
} from '../../../src';


describe('whitespace configuration', () => {

  it('should contain all whitespace options', () => {
    expect(OWhitespace).toEqual([
      'normal',
      'nowrap',
      'pre',
      'pre-line',
      'pre-wrap',
      'break-spaces',
    ]);
  });


  it('should map whitespace values to tailwind classes', () => {
    expect(WHITESPACE_CLASS_MAP).toEqual({
      normal: 'whitespace-normal',
      nowrap: 'whitespace-nowrap',
      pre: 'whitespace-pre',
      'pre-line': 'whitespace-pre-line',
      'pre-wrap': 'whitespace-pre-wrap',
      'break-spaces': 'whitespace-break-spaces',
    });
  });


  it('should have a class mapping for every whitespace option', () => {

    OWhitespace.forEach((whitespace) => {

      expect(
        WHITESPACE_CLASS_MAP[whitespace]
      ).toBeDefined();


      expect(
        typeof WHITESPACE_CLASS_MAP[whitespace]
      ).toBe('string');

    });

  });


  it('should return correct class for each whitespace option', () => {

    expect(
      WHITESPACE_CLASS_MAP.normal
    ).toBe('whitespace-normal');


    expect(
      WHITESPACE_CLASS_MAP.nowrap
    ).toBe('whitespace-nowrap');


    expect(
      WHITESPACE_CLASS_MAP.pre
    ).toBe('whitespace-pre');


    expect(
      WHITESPACE_CLASS_MAP['pre-line']
    ).toBe('whitespace-pre-line');


    expect(
      WHITESPACE_CLASS_MAP['pre-wrap']
    ).toBe('whitespace-pre-wrap');


    expect(
      WHITESPACE_CLASS_MAP['break-spaces']
    ).toBe('whitespace-break-spaces');

  });

});