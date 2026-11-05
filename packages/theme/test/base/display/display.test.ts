import { DISPLAY_CLASS_MAP ,ODisplay } from '../../../src';

describe('display configuration', () => {

  it('should contain all display options', () => {
    expect(ODisplay).toEqual([
      'block',
      'inline',
      'inlineBlock',
    ]);
  });


  it('should map display values to tailwind classes', () => {
    expect(DISPLAY_CLASS_MAP).toEqual({
      block: 'block',
      inline: 'inline',
      inlineBlock: 'inline-block',
    });
  });


  it('should have a class mapping for every display option', () => {

    ODisplay.forEach((display) => {

      expect(
        DISPLAY_CLASS_MAP[display]
      ).toBeDefined();


      expect(
        typeof DISPLAY_CLASS_MAP[display]
      ).toBe('string');

    });

  });


  it('should return correct class for each display option', () => {

    expect(
      DISPLAY_CLASS_MAP.block
    ).toBe('block');


    expect(
      DISPLAY_CLASS_MAP.inline
    ).toBe('inline');


    expect(
      DISPLAY_CLASS_MAP.inlineBlock
    ).toBe('inline-block');

  });

});