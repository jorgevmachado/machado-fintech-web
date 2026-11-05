import {
  OSwitchLabelPosition,
  OSwitchVariations,
  SWITCH_SIZE_CLASS_MAP,
  SWITCH_TONE_CLASS_MAP,
} from '../../src';


describe('switch options', () => {

  describe('OSwitchVariations', () => {

    it('should contain all switch variations', () => {
      expect(OSwitchVariations).toEqual([
        'solid',
        'outline',
      ]);
    });

  });


  describe('OSwitchLabelPosition', () => {

    it('should contain all label positions', () => {
      expect(OSwitchLabelPosition).toEqual([
        'start',
        'end',
      ]);
    });

  });


  describe('SWITCH_SIZE_CLASS_MAP', () => {

    it('should contain all reduced sizes', () => {
      expect(Object.keys(SWITCH_SIZE_CLASS_MAP)).toEqual([
        'sm',
        'md',
        'lg',
      ]);
    });


    it('should define small size classes correctly', () => {
      expect(SWITCH_SIZE_CLASS_MAP.sm).toEqual({
        track: 'h-5 w-9 p-0.5',
        thumb: 'h-4 w-4',
        translate: 'translate-x-4',
      });
    });


    it('should define medium size classes correctly', () => {
      expect(SWITCH_SIZE_CLASS_MAP.md).toEqual({
        track: 'h-6 w-11 p-0.5',
        thumb: 'h-5 w-5',
        translate: 'translate-x-5',
      });
    });


    it('should define large size classes correctly', () => {
      expect(SWITCH_SIZE_CLASS_MAP.lg).toEqual({
        track: 'h-8 w-14 p-1',
        thumb: 'h-6 w-6',
        translate: 'translate-x-6',
      });
    });

  });


  describe('SWITCH_TONE_CLASS_MAP', () => {

    it('should contain all switch tones', () => {

      expect(Object.keys(SWITCH_TONE_CLASS_MAP)).toEqual([
        'default',
        'muted',
        'white',
        'subtle',
        'primary',
        'secondary',
        'success',
        'warning',
        'danger',
        'info',
        'neutral',
        'inherit',
      ]);

    });


    it('should define default tone classes', () => {

      expect(SWITCH_TONE_CLASS_MAP.default).toEqual({
        on: 'bg-slate-900',
        off: 'bg-slate-300',
        ring: 'focus-within:ring-slate-500',
        border: 'border-slate-500',
      });

    });


    it('should define primary tone classes', () => {

      expect(SWITCH_TONE_CLASS_MAP.primary).toEqual({
        on: 'bg-blue-600',
        off: 'bg-slate-300',
        ring: 'focus-within:ring-blue-500',
        border: 'border-blue-500',
      });

    });


    it('should define danger tone classes', () => {

      expect(SWITCH_TONE_CLASS_MAP.danger).toEqual({
        on: 'bg-red-600',
        off: 'bg-slate-300',
        ring: 'focus-within:ring-red-500',
        border: 'border-red-500',
      });

    });


    it('should define inherit tone classes', () => {

      expect(SWITCH_TONE_CLASS_MAP.inherit).toEqual({
        on: 'bg-inherit',
        off: 'bg-slate-300',
        ring: 'focus-within:ring-slate-400',
        border: 'border-inherit',
      });

    });

  });

});