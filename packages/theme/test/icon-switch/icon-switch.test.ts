import {
  ICON_SWITCH_SIZE_CLASS_MAP,
  OIconSwitchSize,
  buildIconSwitchTheme,
} from '../../src';

describe('IconSwitch Theme', () => {
  const defaultParams = {
    size: 'md',
    checked: false,
  } as const;

  describe('buildIconSwitchTheme', () => {
    it('should return the base track classes', () => {
      const result = buildIconSwitchTheme(defaultParams);

      expect(result.track).toContain('inline-flex');
      expect(result.track).toContain('rounded-full');
      expect(result.track).toContain('transition-colors');
      expect(result.track).toContain('duration-200');
      expect(result.track).toContain('focus-within:ring-2');
    });

    it('should keep the track colour the same whatever the state is', () => {
      const unchecked = buildIconSwitchTheme(defaultParams);
      const checked = buildIconSwitchTheme({ ...defaultParams, checked: true });

      expect(unchecked.track).toContain('bg-slate-100');
      expect(unchecked.track).not.toContain('bg-blue-600');
      expect(checked.track).toBe(unchecked.track);
    });

    it('should not draw a border around the track', () => {
      const result = buildIconSwitchTheme(defaultParams);

      expect(result.track).not.toContain('border');
    });

    it('should not translate the thumb when unchecked', () => {
      const result = buildIconSwitchTheme(defaultParams);

      expect(result.thumb).toContain('translate-x-0');
      expect(result.thumb).not.toContain('translate-x-7');
    });

    it('should translate the thumb when checked', () => {
      const result = buildIconSwitchTheme({ ...defaultParams, checked: true });

      expect(result.thumb).toContain('translate-x-7');
      expect(result.thumb).not.toContain('translate-x-0');
    });

    it('should apply the transition classes used for the icon animation', () => {
      const result = buildIconSwitchTheme(defaultParams);

      expect(result.thumb).toContain('transition-transform');
      expect(result.thumb).toContain('ease-out');
      expect(result.iconActive).toContain('scale-110');
      expect(result.iconInactive).toContain('scale-90');
    });

    it('should contrast the active and the inactive icon', () => {
      const result = buildIconSwitchTheme(defaultParams);

      expect(result.iconActive).toContain('text-slate-900');
      expect(result.iconInactive).toContain('text-slate-400');
    });

    it('should apply the size class map to the track and thumb', () => {
      const result = buildIconSwitchTheme({ ...defaultParams, size: 'lg' });

      expect(result.track).toContain(ICON_SWITCH_SIZE_CLASS_MAP.lg.track);
      expect(result.thumb).toContain(ICON_SWITCH_SIZE_CLASS_MAP.lg.thumb);
    });

    it('should apply the matching translate offset for each size', () => {
      expect(buildIconSwitchTheme({ ...defaultParams, size: 'sm', checked: true }).thumb)
        .toContain('translate-x-5');
      expect(buildIconSwitchTheme({ ...defaultParams, size: 'lg', checked: true }).thumb)
        .toContain('translate-x-9');
    });

    it('should dim the track when disabled', () => {
      const result = buildIconSwitchTheme({ ...defaultParams, disabled: true });

      expect(result.track).toContain('opacity-70');
    });

    it('should not dim the track when enabled', () => {
      const result = buildIconSwitchTheme(defaultParams);

      expect(result.track).not.toContain('opacity-70');
    });

    it('should append a custom className to the track', () => {
      const result = buildIconSwitchTheme({ ...defaultParams, className: 'custom-track' });

      expect(result.track).toContain('custom-track');
    });

    it('should append a custom thumbClassName to the thumb', () => {
      const result = buildIconSwitchTheme({ ...defaultParams, thumbClassName: 'custom-thumb' });

      expect(result.thumb).toContain('custom-thumb');
    });
  });

  describe('options', () => {
    it('should expose the supported sizes', () => {
      expect(OIconSwitchSize).toEqual(['sm', 'md', 'lg']);
    });
  });
});
