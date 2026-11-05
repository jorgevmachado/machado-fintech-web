import {
  buildInputTheme ,
  INPUT_SIZE_CLASS_MAP ,
  INPUT_VARIANT_CLASS_MAP ,
  OInputSize ,
  OInputVariant ,
} from '../../src';

describe('Input Theme', () => {
  describe('buildInputTheme', () => {
    it('should build input theme with default classes', () => {
      const result = buildInputTheme({
        size: 'md',
        variant: 'outline',
        isInvalid: false,
        disabled: false,
        fullWidth: false,
      });

      expect(result).toContain(
        'flex items-center gap-2 rounded-xl px-3 transition',
      );
    });

    it('should include size and variant classes', () => {
      const result = buildInputTheme({
        size: 'md',
        variant: 'outline',
        isInvalid: false,
        disabled: false,
        fullWidth: false,
      });

      expect(result).toContain(INPUT_SIZE_CLASS_MAP.md);
      expect(result).toContain(INPUT_VARIANT_CLASS_MAP.outline);
    });

    it('should add invalid classes when input is invalid', () => {
      const result = buildInputTheme({
        size: 'md',
        variant: 'outline',
        isInvalid: true,
        disabled: false,
        fullWidth: false,
      });

      expect(result).toContain(
        'border-red-400 focus-within:border-red-400 focus-within:ring-red-100',
      );
    });

    it('should add disabled classes when input is disabled', () => {
      const result = buildInputTheme({
        size: 'md',
        variant: 'outline',
        isInvalid: false,
        disabled: true,
        fullWidth: false,
      });

      expect(result).toContain(
        'cursor-not-allowed bg-slate-100 text-slate-400 opacity-70',
      );
    });

    it('should add full width class when fullWidth is true', () => {
      const result = buildInputTheme({
        size: 'md',
        variant: 'outline',
        isInvalid: false,
        disabled: false,
        fullWidth: true,
      });

      expect(result).toContain('w-full');
    });

    it('should add custom className when provided', () => {
      const result = buildInputTheme({
        size: 'md',
        variant: 'outline',
        isInvalid: false,
        disabled: false,
        fullWidth: false,
        className: 'custom-input-class',
      });

      expect(result).toContain('custom-input-class');
    });

    it('should not add optional classes when conditions are false', () => {
      const result = buildInputTheme({
        size: 'md',
        variant: 'outline',
        isInvalid: false,
        disabled: false,
        fullWidth: false,
      });

      expect(result).not.toContain(
        'border-red-400 focus-within:border-red-400 focus-within:ring-red-100',
      );

      expect(result).not.toContain(
        'cursor-not-allowed bg-slate-100 text-slate-400 opacity-70',
      );

      expect(result).not.toContain('w-full');
    });
  });

  describe('Input Size Theme', () => {
    it('should have a class mapping for every input size option', () => {
      OInputSize.forEach((size) => {

        expect(INPUT_SIZE_CLASS_MAP[size]).toBeDefined();
        expect(typeof INPUT_SIZE_CLASS_MAP[size]).toBe('string');

      });
    });
  });

  describe('Input Variant Theme', () => {
    it('should have a class mapping for every input variant option', () => {
      OInputVariant.forEach((variant) => {

        expect(INPUT_VARIANT_CLASS_MAP[variant]).toBeDefined();
        expect(typeof INPUT_VARIANT_CLASS_MAP[variant]).toBe('string');

      });
    });
  });
});