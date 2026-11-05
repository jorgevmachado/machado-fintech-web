import { buildColorTone ,TEXT_TONE_CLASS_MAP, colorClassName, updateColorClassName } from '../../src';

describe('Color', () => {
  describe('buildColorTone', () => {
    it('returns explicit color first when provided', () => {
      expect(
        buildColorTone({
          color: 'text-custom-500',
          tone: 'danger',
          optTone: 'info',
          optColor: 'text-fallback',
          classMap: TEXT_TONE_CLASS_MAP,
        }),
      ).toBe('text-custom-500');
    });

    it('returns tone class when no explicit color exists', () => {
      expect(
        buildColorTone({
          tone: 'danger',
          classMap: TEXT_TONE_CLASS_MAP,
        }),
      ).toBe('text-red-600');
    });

    it('returns optional tone class when primary tone is absent', () => {
      expect(
        buildColorTone({
          optTone: 'info',
          classMap: TEXT_TONE_CLASS_MAP,
        }),
      ).toBe('text-sky-600');
    });

    it('returns optional color when no tone mapping can be resolved', () => {
      expect(
        buildColorTone({
          optColor: 'text-muted-fallback',
        }),
      ).toBe('text-muted-fallback');
    });

    it('returns undefined when no input can resolve a class', () => {
      expect(buildColorTone({})).toBeUndefined();
      expect(
        buildColorTone({
          tone: 'danger',
        }),
      ).toBeUndefined();
    });
  });

  describe('colorClassName', () => {
    it('should return undefined when not provide className and newClassName', () => {
      expect(colorClassName()).toBeUndefined();
    });

    it('should return className when not provide newClassName', () => {
      expect(colorClassName('className')).toEqual('className');
    });

    it('should return updated className', () => {
      expect(colorClassName('cursor-pointer transition-colors text-sky-700 hover:bg-sky-50', 'text-red-700 hover:bg-red-50')).toEqual('cursor-pointer transition-colors text-red-700 hover:bg-red-50');
    });
  });

  describe('updateColorClassName', () => {
    it('should update the color class', () => {
      expect(updateColorClassName('px-4 py-3 flex text-white bg-slate-700', 'text-red bg-green-800')).toEqual('px-4 py-3 flex text-white bg-slate-700 text-red bg-green-800');
    })
  });
});
