import {
  BUTTON_SIZE_CLASS_MAP ,
  BUTTON_APPEARANCE_CLASS_MAP ,
  OButtonSize ,
  OButtonAppearance,
  buildButtonTheme
} from '../../src';

describe('Button Theme', () => {

  describe('buildButtonTheme', () => {
    const defaultParams = {
      size: 'md',
      tone: 'primary',
      appearance: 'solid',
    } as const;

    it('should return default button classes', () => {
      const result = buildButtonTheme(defaultParams);

      expect(result).toEqual(
        expect.arrayContaining([
          'inline-flex',
          'items-center',
          'justify-center',
          'gap-2',
          'rounded-xl',
          'font-semibold',
          'transition-colors',
          'duration-200',
          'focus:outline-none',
          'focus:ring-2',
          'focus:ring-offset-2',
          'disabled:opacity-60',
          'cursor-pointer',
        ]),
      );
    });

    it('should add cursor-not-allowed when button is disabled', () => {
      const result = buildButtonTheme({
        ...defaultParams,
        disabled: true,
      });

      expect(result).toContain('cursor-not-allowed');
      expect(result).not.toContain('cursor-pointer');
    });

    it('should add cursor-pointer when button is enabled', () => {
      const result = buildButtonTheme({
        ...defaultParams,
        disabled: false,
      });

      expect(result).toContain('cursor-pointer');
      expect(result).not.toContain('cursor-not-allowed');
    });

    it('should use default size class when iconOnly is false', () => {
      const result = buildButtonTheme({
        ...defaultParams,
        iconOnly: false,
      });

      expect(result).toContain(
        BUTTON_SIZE_CLASS_MAP[defaultParams.size].default,
      );
    });

    it('should use iconOnly size class when iconOnly is true', () => {
      const result = buildButtonTheme({
        ...defaultParams,
        iconOnly: true,
      });

      expect(result).toContain(
        BUTTON_SIZE_CLASS_MAP[defaultParams.size].iconOnly,
      );
    });

    it('should add appearance and tone classes', () => {
      const result = buildButtonTheme(defaultParams);

      expect(result).toContain(
        BUTTON_APPEARANCE_CLASS_MAP[
          defaultParams.appearance
          ][defaultParams.tone],
      );
    });

    it('should add full width class when fullWidth is true', () => {
      const result = buildButtonTheme({
        ...defaultParams,
        fullWidth: true,
      });

      expect(result).toContain('w-full');
    });

    it('should add custom className when provided', () => {
      const result = buildButtonTheme({
        ...defaultParams,
        className: 'custom-button-class',
      });

      expect(result).toContain('custom-button-class');
    });

    it('should not add optional classes when not provided', () => {
      const result = buildButtonTheme(defaultParams);

      expect(result).not.toContain('w-full');
      expect(result).not.toContain('custom-button-class');
    });
  });

  describe('Button Size Theme', () => {
    it('should have a class mapping for every button size option', () => {
      OButtonSize.forEach((size) => {

        expect(BUTTON_SIZE_CLASS_MAP[size]).toBeDefined();
        expect(typeof BUTTON_SIZE_CLASS_MAP[size]).toBe('object');

      });
    });
  });

  describe('Button Appearance Theme', () => {
    it('should have a class mapping for every button appearance option', () => {
      OButtonAppearance.forEach((variant) => {

        expect(BUTTON_APPEARANCE_CLASS_MAP[variant]).toBeDefined();
        expect(typeof BUTTON_APPEARANCE_CLASS_MAP[variant]).toBe('object');

      });
    });
  });
});