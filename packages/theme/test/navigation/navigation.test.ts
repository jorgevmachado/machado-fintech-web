import {
  buildNavigationTheme ,
  NAVIGATION_SHELL_BACKGROUND_MAP ,
  NAVIGATION_SHELL_VARS_MAP ,
  OThemeVariant ,
} from '../../src';

describe('Navigation Theme', () => {
  describe('NAVIGATION_SHELL_BACKGROUND_MAP', () => {
    it('should define a background for every theme variant', () => {
      OThemeVariant.forEach((variant) => {
        expect(NAVIGATION_SHELL_BACKGROUND_MAP[variant]).toEqual(expect.any(String));
        expect(NAVIGATION_SHELL_BACKGROUND_MAP[variant].length).toBeGreaterThan(0);
      });
    });

    it('should keep the project background token in the light shell', () => {
      expect(NAVIGATION_SHELL_BACKGROUND_MAP.light).toContain('var(--background)');
    });

    it('should paint the dark shell with a solid colour instead of the light token', () => {
      expect(NAVIGATION_SHELL_BACKGROUND_MAP.dark).not.toContain('var(--background)');
      expect(NAVIGATION_SHELL_BACKGROUND_MAP.dark).toContain('#0b1220');
    });

    it('should declare gradients as a background image, never as a background colour', () => {
      // `bg-[radial-gradient(...)]` compiles to `background-color`, which the
      // browser discards — the shell would silently keep the body colour.
      OThemeVariant.forEach((variant) => {
        expect(NAVIGATION_SHELL_BACKGROUND_MAP[variant]).toContain('radial-gradient(');
      });
    });

    it('should use a distinct background per variant', () => {
      expect(NAVIGATION_SHELL_BACKGROUND_MAP.dark).not.toEqual(NAVIGATION_SHELL_BACKGROUND_MAP.light);
    });
  });

  describe('NAVIGATION_SHELL_VARS_MAP', () => {
    it('should publish the same variable names in both variants', () => {
      const lightKeys = Object.keys(NAVIGATION_SHELL_VARS_MAP.light).sort();
      const darkKeys = Object.keys(NAVIGATION_SHELL_VARS_MAP.dark).sort();

      expect(darkKeys).toEqual(lightKeys);
    });

    it('should invert the text colour between variants', () => {
      expect(NAVIGATION_SHELL_VARS_MAP.light['--app-text']).toBe('#0f172a');
      expect(NAVIGATION_SHELL_VARS_MAP.dark['--app-text']).toBe('#e6edf7');
    });

    it('should darken the surface in the dark variant', () => {
      expect(NAVIGATION_SHELL_VARS_MAP.light['--app-surface']).toBe('#ffffff');
      expect(NAVIGATION_SHELL_VARS_MAP.dark['--app-surface']).toBe('#111c33');
    });

    it('should only declare custom properties', () => {
      Object.values(NAVIGATION_SHELL_VARS_MAP).forEach((variantVars) => {
        Object.keys(variantVars).forEach((name) => {
          expect(name.startsWith('--app-')).toBe(true);
        });
      });
    });
  });

  describe('buildNavigationTheme', () => {
    it('should return the background and the vars of the requested variant', () => {
      const result = buildNavigationTheme('dark');

      expect(result.background).toBe(NAVIGATION_SHELL_BACKGROUND_MAP.dark);
      expect(result.vars).toEqual(NAVIGATION_SHELL_VARS_MAP.dark);
    });

    it('should default to the light variant', () => {
      const result = buildNavigationTheme();

      expect(result.background).toBe(NAVIGATION_SHELL_BACKGROUND_MAP.light);
      expect(result.vars).toEqual(NAVIGATION_SHELL_VARS_MAP.light);
    });
  });
});