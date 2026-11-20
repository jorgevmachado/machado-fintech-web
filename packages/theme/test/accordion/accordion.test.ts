import {
  ACCORDION_SIZE_CLASS_MAP,
  ACCORDION_VARIANT_CLASS_MAP,
  buildAccordionTheme,
  buildAccordionTriggerTheme,
  OAccordionVariant,
} from '../../src';

describe('Accordion Theme', () => {
  describe('class maps', () => {
    it('should have a class mapping for every accordion variant', () => {
      OAccordionVariant.forEach((variant) => {
        expect(ACCORDION_VARIANT_CLASS_MAP[variant].root).toBeTruthy();
        expect(ACCORDION_VARIANT_CLASS_MAP[variant].content).toBeTruthy();
      });
    });

    it('should have trigger, content and icon classes for every reduced size', () => {
      (['sm', 'md', 'lg'] as const).forEach((size) => {
        expect(ACCORDION_SIZE_CLASS_MAP[size].trigger).toBeTruthy();
        expect(ACCORDION_SIZE_CLASS_MAP[size].content).toBeTruthy();
        expect(ACCORDION_SIZE_CLASS_MAP[size].icon).toBeTruthy();
      });
    });
  });

  describe('buildAccordionTheme', () => {
    it('should default to the continuous list separated by dividers', () => {
      const result = buildAccordionTheme();

      expect(result.root).toContain('divide-y divide-[color:var(--app-border,#e2e8f0)] border-y border-[color:var(--app-border,#e2e8f0)]');
      expect(result.item).toBe('');
    });

    it('should turn each item into a card in the separated variant', () => {
      const result = buildAccordionTheme({ variant: 'separated' });

      expect(result.item).toContain('rounded-lg border border-[color:var(--app-border,#e2e8f0)] bg-[color:var(--app-surface,#ffffff)]');
      expect(result.root).not.toContain('divide-y');
    });

    it('should compose the content padding from size and variant', () => {
      expect(buildAccordionTheme({ size: 'lg' }).content).toContain('px-1 text-base');
      expect(buildAccordionTheme({ size: 'lg' }).content).toContain('pb-4');
    });

    it('should append a custom class to the root', () => {
      expect(buildAccordionTheme({ className: 'mt-2' }).root).toContain('mt-2');
    });
  });

  describe('buildAccordionTriggerTheme', () => {
    it('should rotate only the icon when open', () => {
      const open = buildAccordionTriggerTheme({ isOpen: true });

      expect(open.icon).toContain('rotate-180');
      expect(open.trigger).not.toContain('rotate-');
    });

    it('should not rotate the icon when closed', () => {
      expect(buildAccordionTriggerTheme({ isOpen: false }).icon).not.toContain('rotate-180');
    });

    it('should expose a full-width button with a focus ring', () => {
      const result = buildAccordionTriggerTheme();

      expect(result.trigger).toContain('flex w-full items-center justify-between');
      expect(result.trigger).toContain('focus-visible:outline-2');
    });

    it('should swap the pointer cursor for a disabled one', () => {
      expect(buildAccordionTriggerTheme().trigger).toContain('cursor-pointer');
      expect(buildAccordionTriggerTheme({ disabled: true }).trigger).toContain('cursor-not-allowed');
    });

    it('should apply the requested size to the trigger and the icon', () => {
      const result = buildAccordionTriggerTheme({ size: 'sm' });

      expect(result.trigger).toContain('min-h-9 px-1 text-sm');
      expect(result.icon).toContain('h-4 w-4');
    });
  });
});