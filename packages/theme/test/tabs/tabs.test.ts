import {
  buildTabsTheme,
  buildTabsTriggerTheme,
  OTabsVariant,
  TABS_LIST_CLASS_MAP,
  TABS_SIZE_CLASS_MAP,
  TABS_TRIGGER_CLASS_MAP,
} from '../../src';

describe('Tabs Theme', () => {
  describe('class maps', () => {
    it('should have a class mapping for every tabs variant', () => {
      OTabsVariant.forEach((variant) => {
        expect(TABS_LIST_CLASS_MAP[variant]).toBeTruthy();
        expect(TABS_TRIGGER_CLASS_MAP[variant].active).toBeTruthy();
        expect(TABS_TRIGGER_CLASS_MAP[variant].inactive).toBeTruthy();
      });
    });

    it('should have list and trigger classes for every reduced size', () => {
      (['sm', 'md', 'lg'] as const).forEach((size) => {
        expect(TABS_SIZE_CLASS_MAP[size].list).toBeTruthy();
        expect(TABS_SIZE_CLASS_MAP[size].trigger).toBeTruthy();
      });
    });
  });

  describe('buildTabsTheme', () => {
    it('should default to the underline variant at medium size', () => {
      const result = buildTabsTheme();

      expect(result.root).toContain('flex flex-col');
      expect(result.list).toContain('border-b border-[color:var(--app-border,#e2e8f0)]');
      expect(result.list).toContain('gap-1.5');
      expect(result.list).not.toContain('var(--app-surface-muted');
    });

    it('should render the pills list with a soft track instead of a bottom border', () => {
      const result = buildTabsTheme({ variant: 'pills' });

      expect(result.list).toContain('rounded-xl bg-[color:var(--app-surface-muted,#f1f5f9)] p-1');
      expect(result.list).not.toContain('border-b');
    });

    it('should append a custom class to the root', () => {
      expect(buildTabsTheme({ className: 'mt-6' }).root).toContain('mt-6');
    });
  });

  describe('buildTabsTriggerTheme', () => {
    it('should mark the active trigger with the accent underline', () => {
      const result = buildTabsTriggerTheme({ isActive: true });

      expect(result).toContain('border-b-2 border-[color:var(--app-accent-border,#3b82f6)] text-[color:var(--app-accent,#1d4ed8)]');
      expect(result).not.toContain('border-transparent');
    });

    it('should keep the inactive trigger transparent and muted', () => {
      const result = buildTabsTriggerTheme({ isActive: false });

      expect(result).toContain('border-b-2 border-transparent text-[color:var(--app-text-muted,#64748b)]');
      expect(result).not.toContain('var(--app-accent-border');
    });

    it('should never mix the underline indicator into the pills variant', () => {
      const active = buildTabsTriggerTheme({ variant: 'pills', isActive: true });

      expect(active).toContain('bg-[color:var(--app-accent-soft,#eff6ff)] text-[color:var(--app-accent,#1d4ed8)] shadow-sm');
      expect(active).not.toContain('border-b-2');
      expect(active).not.toContain('var(--app-accent-border');
    });

    it('should emit exactly one colour state per render', () => {
      const active = buildTabsTriggerTheme({ isActive: true });
      const inactive = buildTabsTriggerTheme({ isActive: false });

      expect(active).not.toContain('text-[color:var(--app-text-muted,#64748b)]');
      expect(inactive).not.toContain('text-[color:var(--app-accent,#1d4ed8)]');
    });

    it('should swap the pointer cursor for a disabled one', () => {
      expect(buildTabsTriggerTheme()).toContain('cursor-pointer');
      expect(buildTabsTriggerTheme({ disabled: true })).toContain('cursor-not-allowed');
      expect(buildTabsTriggerTheme({ disabled: true })).toContain('opacity-60');
    });

    it('should apply the requested size and extra class', () => {
      const result = buildTabsTriggerTheme({ size: 'lg', className: 'w-full' });

      expect(result).toContain('h-11 px-5 text-base');
      expect(result).toContain('w-full');
    });
  });
});