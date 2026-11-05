import {
  buildNavbarTheme ,
  NAVBAR_APPEARANCE_CLASS_MAP ,OThemeTone ,OThemeVariant ,
} from '../../src';

describe('Navbar Theme', () => {
  describe('NAVBAR_APPEARANCE_CLASS_MAP', () => {
    it('should have a class mapping for every navbar appearance option', () => {
      OThemeTone.forEach((tone) => {
        OThemeVariant.forEach((variant) => {
          const result = NAVBAR_APPEARANCE_CLASS_MAP[tone][variant];
          expect(result).toBeDefined();
          expect(typeof result).toBe('object');
        });
      });
    });
  });

  describe('buildNavbarTheme', () => {
    it('should return a navbar theme primary light', () => {
      const result = buildNavbarTheme('primary', 'light');
      expect(result).toBeDefined();
      expect(typeof result).toBe('object');
      expect(result.icon).toEqual(expect.stringContaining('border-slate-200 bg-slate-100 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]'));
      expect(result.title).toEqual(expect.stringContaining('text-slate-900'));
      expect(result.header).toEqual(expect.stringContaining('text-slate-900 shadow-[0_8px_24px_rgba(15,23,42,0.08)] bg-white'));
      expect(result.button).toEqual(expect.stringContaining('border-slate-300 bg-white text-slate-700 hover:bg-slate-100 hover:border-slate-400'));
      expect(result.subtitle).toEqual(expect.stringContaining('text-slate-500'));
    });

    it('should return a navbar theme primary dark', () => {
      const result = buildNavbarTheme('primary', 'dark');
      expect(result).toBeDefined();
      expect(typeof result).toBe('object');
      expect(result.icon).toEqual(expect.stringContaining('border-white/30 bg-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.14)]'));
      expect(result.title).toEqual(expect.stringContaining('text-white'));
      expect(result.header).toEqual(expect.stringContaining('text-white border-white/15 shadow-[0_10px_28px_rgba(15,23,42,0.3)] border-b bg-gradient-to-br from-[#14213d] via-[#1e3a8a] to-[#233876]'));
      expect(result.button).toEqual(expect.stringContaining('border-white/20 bg-slate-900/30 text-white hover:bg-white/15 hover:border-white/30'));
      expect(result.subtitle).toEqual(expect.stringContaining('text-white/90'));
    });

    it('should return a navbar theme neutral light when received tone and variant undefined', () => {
      const result = buildNavbarTheme(undefined, undefined);
      expect(result).toBeDefined();
      expect(typeof result).toBe('object');
      expect(result.icon).toEqual(expect.stringContaining('border-slate-200 bg-slate-100 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]'));
      expect(result.title).toEqual(expect.stringContaining('text-slate-900'));
      expect(result.header).toEqual(expect.stringContaining('text-slate-900 border-slate-200 shadow-[0_8px_24px_rgba(15,23,42,0.08)] border-b bg-gradient-to-br from-[#ffffff] via-[#f8fafc] to-[#e2e8f0]'));
      expect(result.button).toEqual(expect.stringContaining('border-slate-300 bg-white text-slate-700 hover:bg-slate-100 hover:border-slate-400'));
      expect(result.subtitle).toEqual(expect.stringContaining('text-slate-500'));
    });

    it('should return a navbar theme neutral dark when received tone undefined and variant dark', () => {
      const result = buildNavbarTheme(undefined, 'dark');
      expect(result).toBeDefined();
      expect(typeof result).toBe('object');
      expect(result.icon).toEqual(expect.stringContaining('border-slate-300/30 bg-slate-800/30 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]'));
      expect(result.title).toEqual(expect.stringContaining('text-slate-100'));
      expect(result.header).toEqual(expect.stringContaining('text-slate-100 border-slate-700 shadow-[0_8px_24px_rgba(15,23,42,0.25)] border-b bg-gradient-to-br from-[#111827] via-[#1f2937] to-[#374151]'));
      expect(result.button).toEqual(expect.stringContaining('border-slate-600 bg-slate-900/40 text-slate-100 hover:bg-slate-700/50 hover:border-slate-500'));
      expect(result.subtitle).toEqual(expect.stringContaining('text-slate-400'));
    });
  });
});