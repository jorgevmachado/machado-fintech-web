import {
  buildSidebarTheme ,
  SIDEBAR_APPEARANCE_CLASS_MAP ,OThemeTone ,OThemeVariant ,
} from '../../src';

describe('Sidebar Theme', () => {
  describe('SIDEBAR_APPEARANCE_CLASS_MAP', () => {
    it('should have a class mapping for every sidebar appearance option', () => {
      OThemeTone.forEach((tone) => {
        OThemeVariant.forEach((variant) => {
          const result = SIDEBAR_APPEARANCE_CLASS_MAP[tone][variant];
          expect(result).toBeDefined();
          expect(typeof result).toBe('object');
        });
      });
    });
  });

  describe('buildSidebarTheme', () => {
    it('should return a sidebar theme primary light', () => {
      const result = buildSidebarTheme('primary', 'light');
      expect(result).toBeDefined();
      expect(typeof result).toBe('object');
      expect(result.text).toEqual(expect.stringContaining('text-slate-900'));
      expect(result.aside).toEqual(expect.stringContaining('bg-white border-slate-200'));
      expect(result.buttonItem).toEqual(expect.stringContaining('text-slate-700 hover:bg-slate-100'));
      expect(result.buttonChild).toEqual(expect.stringContaining('text-slate-600'));
      expect(result.buttonLogout).toEqual(expect.stringContaining('border-red-300 bg-red-600 text-white'));
      expect(result.buttonChildren).toEqual(expect.stringContaining('bg-slate-100 text-slate-700'));
      expect(result.buttonItemActive).toEqual(expect.stringContaining('bg-blue-100 text-blue-900 border-blue-300'));
      expect(result.buttonChildActive).toEqual(expect.stringContaining('bg-blue-100text-blue-900'));
      expect(result.buttonChildContent).toEqual(expect.stringContaining('ml-[18px] flex flex-col gap-1 border-l border-slate-400/30 pl-3'));
    });

    it('should return a sidebar theme primary dark', () => {
      const result = buildSidebarTheme('primary', 'dark');
      expect(result).toBeDefined();
      expect(typeof result).toBe('object');
      expect(result.text).toEqual(expect.stringContaining('text-white'));
      expect(result.aside).toEqual(expect.stringContaining('bg-gradient-to-b from-[#111d38] to-[#14213d] border-white/15'));
      expect(result.buttonItem).toEqual(expect.stringContaining('text-slate-50/95 hover:border-blue-300/25 hover:bg-blue-500/20'));
      expect(result.buttonChild).toEqual(expect.stringContaining('text-slate-100/95 hover:bg-blue-500/15 hover:text-white focus-visible:outline-yellow-400'));
      expect(result.buttonLogout).toEqual(expect.stringContaining('border-red-300/50 bg-red-700/80 text-white hover:bg-red-600/25 hover:border-red-200/80 hover:bg-red-600/25 focus-visible:outline-red-300'));
      expect(result.buttonChildren).toEqual(expect.stringContaining('bg-slate-900/30 text-slate-50 hover:border-blue-300/25 hover:bg-blue-500/20 focus-visible:outline-yellow-400'));
      expect(result.buttonItemActive).toEqual(expect.stringContaining('border-blue-300/50 bg-gradient-to-br from-blue-500/30 to-blue-900/30 font-bold shadow-[0_8px_18px_rgba(37,99,235,0.22)]'));
      expect(result.buttonChildActive).toEqual(expect.stringContaining('bg-blue-800/70 text-white'));
      expect(result.buttonChildContent).toEqual(expect.stringContaining('ml-[18px] flex flex-col gap-1 border-l border-slate-400/30 pl-3'));
    });


    it('should return a sidebar theme neutral light when received tone and variant undefined', () => {
      const result = buildSidebarTheme(undefined, undefined);
      expect(result).toBeDefined();
      expect(typeof result).toBe('object');
      expect(result.text).toEqual(expect.stringContaining('text-slate-900'));
      expect(result.aside).toEqual(expect.stringContaining('bg-white border-slate-200'));
      expect(result.buttonItem).toEqual(expect.stringContaining('text-slate-700 hover:bg-slate-100'));
      expect(result.buttonChild).toEqual(expect.stringContaining('text-slate-500'));
      expect(result.buttonLogout).toEqual(expect.stringContaining('bg-red-600'));
      expect(result.buttonChildren).toEqual(expect.stringContaining('bg-slate-100'));
      expect(result.buttonItemActive).toEqual(expect.stringContaining('bg-slate-100'));
      expect(result.buttonChildActive).toEqual(expect.stringContaining('bg-slate-100'));
      expect(result.buttonChildContent).toEqual(expect.stringContaining('ml-[18px] flex flex-col gap-1 border-l border-slate-400/30 pl-3'));
    });
  });
});