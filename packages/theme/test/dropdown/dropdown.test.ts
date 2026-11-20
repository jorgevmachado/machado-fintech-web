import {
  DROPDOWN_ITEM_TONE_CLASS_MAP,
  DROPDOWN_SIZE_CLASS_MAP,
  ODropdownAppearance,
  ODropdownPlacement,
  ODropdownSize,
  buildDropdownTheme,
} from '../../src';

describe('Dropdown Theme', () => {
  const defaultParams = {
    size: 'md',
    tone: 'default',
    appearance: 'outline',
    placement: 'bottom-end',
  } as const;

  describe('buildDropdownTheme', () => {
    it('should return the base trigger classes', () => {
      const result = buildDropdownTheme(defaultParams);

      expect(result.trigger).toContain('inline-flex');
      expect(result.trigger).toContain('rounded-xl');
      expect(result.trigger).toContain('transition-colors');
      expect(result.trigger).toContain('cursor-pointer');
    });

    it('should swap cursor-pointer for cursor-not-allowed when disabled', () => {
      const result = buildDropdownTheme({ ...defaultParams, disabled: true });

      expect(result.trigger).toContain('cursor-not-allowed');
      expect(result.trigger).toContain('opacity-60');
      expect(result.trigger).not.toContain('cursor-pointer');
    });

    it('should apply the size class to the trigger and items', () => {
      const result = buildDropdownTheme({ ...defaultParams, size: 'lg' });

      expect(result.trigger).toContain(DROPDOWN_SIZE_CLASS_MAP.lg.trigger);
      expect(result.item).toContain(DROPDOWN_SIZE_CLASS_MAP.lg.item);
    });

    it('should add w-full when fullWidth is true', () => {
      const result = buildDropdownTheme({ ...defaultParams, fullWidth: true });

      expect(result.trigger).toContain('w-full');
      expect(result.menu).toContain('w-full');
    });

    it('should not add w-full by default', () => {
      const result = buildDropdownTheme(defaultParams);

      expect(result.trigger).not.toContain('w-full');
    });

    it.each(ODropdownPlacement)('should position the menu at %s', (placement) => {
      const result = buildDropdownTheme({ ...defaultParams, placement });

      expect(result.menu).toContain('absolute');
      expect(result.menu).toContain(placement.startsWith('top') ? 'bottom-full' : 'top-full');
      expect(result.menu).toContain(placement.endsWith('start') ? 'left-0' : 'right-0');
    });

    it('should append the custom className to the trigger', () => {
      const result = buildDropdownTheme({ ...defaultParams, className: 'custom-trigger' });

      expect(result.trigger).toContain('custom-trigger');
    });

    it('should append the custom menuClassName to the menu', () => {
      const result = buildDropdownTheme({ ...defaultParams, menuClassName: 'custom-menu' });

      expect(result.menu).toContain('custom-menu');
    });

    it('should use the default tone for the base item', () => {
      const result = buildDropdownTheme(defaultParams);

      expect(result.item).toContain(DROPDOWN_ITEM_TONE_CLASS_MAP.default);
    });
  });

  describe('itemFor', () => {
    it('should resolve the item classes for the given tone', () => {
      const result = buildDropdownTheme(defaultParams);

      expect(result.itemFor('danger')).toContain(DROPDOWN_ITEM_TONE_CLASS_MAP.danger);
    });

    it('should not mix the base tone with the requested tone', () => {
      const result = buildDropdownTheme(defaultParams);
      const dangerItem = result.itemFor('danger');

      // Sem tailwind-merge, duas cores de texto no mesmo elemento se anulariam
      // pela ordem do CSS: o tom resolvido precisa ser exclusivo.
      expect(dangerItem).toContain('text-red-700');
      expect(dangerItem).not.toContain('text-slate-700');
    });

    it('should fall back to the default tone when none is given', () => {
      const result = buildDropdownTheme(defaultParams);

      expect(result.itemFor()).toContain(DROPDOWN_ITEM_TONE_CLASS_MAP.default);
    });

    it('should keep the size and layout classes of the item', () => {
      const result = buildDropdownTheme({ ...defaultParams, size: 'sm' });

      expect(result.itemFor('danger')).toContain(DROPDOWN_SIZE_CLASS_MAP.sm.item);
      expect(result.itemFor('danger')).toContain('w-full');
    });
  });

  describe('options', () => {
    it('should expose the supported sizes', () => {
      expect(ODropdownSize).toEqual(['sm', 'md', 'lg']);
    });

    it('should expose the supported appearances', () => {
      expect(ODropdownAppearance).toEqual(['solid', 'outline', 'ghost', 'icon']);
    });

    it('should expose the supported placements', () => {
      expect(ODropdownPlacement).toEqual(['bottom-start', 'bottom-end', 'top-start', 'top-end']);
    });
  });
});