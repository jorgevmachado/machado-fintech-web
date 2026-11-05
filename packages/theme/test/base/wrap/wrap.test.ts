import {
  OWrap,
  WRAP_CLASS_MAP,
} from '../../../src';


describe('wrap configuration', () => {

  it('should contain all wrap options', () => {
    expect(OWrap).toEqual([
      'wrap',
      'nowrap',
      'balance',
      'pretty',
    ]);
  });


  it('should map wrap values to tailwind classes', () => {
    expect(WRAP_CLASS_MAP).toEqual({
      wrap: 'text-wrap',
      nowrap: 'text-nowrap',
      balance: 'text-balance',
      pretty: 'text-pretty',
    });
  });


  it('should have a class mapping for every wrap option', () => {

    OWrap.forEach((wrap) => {

      expect(
        WRAP_CLASS_MAP[wrap]
      ).toBeDefined();


      expect(
        typeof WRAP_CLASS_MAP[wrap]
      ).toBe('string');

    });

  });


  it('should return correct class for each wrap option', () => {

    expect(
      WRAP_CLASS_MAP.wrap
    ).toBe('text-wrap');


    expect(
      WRAP_CLASS_MAP.nowrap
    ).toBe('text-nowrap');


    expect(
      WRAP_CLASS_MAP.balance
    ).toBe('text-balance');


    expect(
      WRAP_CLASS_MAP.pretty
    ).toBe('text-pretty');

  });

});