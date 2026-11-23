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
        on: 'bg-[color:var(--app-track-active,#0f172a)]',
        off: 'bg-[color:var(--app-track,#cbd5e1)]',
        ring: 'focus-within:ring-slate-500',
        border: 'border-[color:var(--app-text-subtle,#475569)]',
      });

    });


    it('should keep the on and off track distinguishable in every theme', () => {
      // No dark `--app-track` e `--app-track-active` são tons diferentes
      // (`#334155` vs `#64748b`). Se o `on` voltasse a ser um literal escuro
      // fixo, ligado e desligado ficariam com a mesma cor no escuro.
      (['default', 'muted', 'secondary'] as const).forEach((tone) => {
        expect(SWITCH_TONE_CLASS_MAP[tone].on).toContain('--app-track-active');
        expect(SWITCH_TONE_CLASS_MAP[tone].off).toContain('--app-track,');
        expect(SWITCH_TONE_CLASS_MAP[tone].on).not.toBe(SWITCH_TONE_CLASS_MAP[tone].off);
      });
    });


    it('should define primary tone classes', () => {

      expect(SWITCH_TONE_CLASS_MAP.primary).toEqual({
        on: 'bg-blue-600',
        off: 'bg-[color:var(--app-track,#cbd5e1)]',
        ring: 'focus-within:ring-blue-500',
        border: 'border-blue-500',
      });

    });


    it('should define danger tone classes', () => {

      expect(SWITCH_TONE_CLASS_MAP.danger).toEqual({
        on: 'bg-red-600',
        off: 'bg-[color:var(--app-track,#cbd5e1)]',
        ring: 'focus-within:ring-red-500',
        border: 'border-red-500',
      });

    });


    it('should define inherit tone classes', () => {

      expect(SWITCH_TONE_CLASS_MAP.inherit).toEqual({
        on: 'bg-inherit',
        off: 'bg-[color:var(--app-track,#cbd5e1)]',
        ring: 'focus-within:ring-slate-400',
        border: 'border-inherit',
      });

    });

  });

});