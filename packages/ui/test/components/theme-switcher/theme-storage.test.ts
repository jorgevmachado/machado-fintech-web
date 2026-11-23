import {
  DEFAULT_THEME,
  getThemeServerSnapshot,
  getThemeSnapshot,
  isThemeMode,
  persistTheme,
  readAppliedTheme,
  readStoredTheme,
  subscribeTheme,
  THEME_STORAGE_KEY,
} from '../../../src/components/theme-switcher/theme-storage';

describe('theme-storage', () => {
  beforeEach(() => {
    delete document.documentElement.dataset.theme;
    window.localStorage.clear();
  });

  describe('DEFAULT_THEME', () => {
    it('should be a supported theme, because the pre-paint script writes it unguarded', () => {
      // O script inline do root layout aplica `DEFAULT_THEME` quando não há
      // preferência salva. Se não for um `ThemeMode` válido, ele escreveria um
      // `data-theme` que nenhum bloco de CSS reconhece.
      expect(isThemeMode(DEFAULT_THEME)).toBe(true);
    });

    it('should match the shell default, so the first paint and the hydrated app agree', () => {
      // O `AppShell` passa `variant={DEFAULT_THEME}`. Se este valor divergisse,
      // a primeira visita pintaria um tema e hidrataria em outro.
      expect(DEFAULT_THEME).toBe('dark');
    });
  });

  describe('isThemeMode', () => {
    it('should accept only the two supported themes', () => {
      expect(isThemeMode('light')).toBe(true);
      expect(isThemeMode('dark')).toBe(true);
    });

    it.each([undefined, null, '', 'DARK', 'system', 0])(
      'should reject %p',
      value => {
        expect(isThemeMode(value)).toBe(false);
      },
    );
  });

  describe('readAppliedTheme', () => {
    it('should return undefined when the document has no theme applied', () => {
      expect(readAppliedTheme()).toBeUndefined();
    });

    it('should return the theme already painted on the document', () => {
      document.documentElement.dataset.theme = 'dark';

      expect(readAppliedTheme()).toBe('dark');
    });

    it('should ignore an invalid value on the document', () => {
      document.documentElement.dataset.theme = 'sepia';

      expect(readAppliedTheme()).toBeUndefined();
    });
  });

  describe('readStoredTheme', () => {
    it('should return undefined when nothing was stored', () => {
      expect(readStoredTheme()).toBeUndefined();
    });

    it('should return the stored preference', () => {
      window.localStorage.setItem(THEME_STORAGE_KEY, 'dark');

      expect(readStoredTheme()).toBe('dark');
    });

    it('should ignore an invalid stored value', () => {
      window.localStorage.setItem(THEME_STORAGE_KEY, 'system');

      expect(readStoredTheme()).toBeUndefined();
    });

    it('should return undefined instead of throwing when storage is unavailable', () => {
      // Modo privado e cookies bloqueados fazem o acesso ao storage lançar.
      const getItem = jest
        .spyOn(Storage.prototype, 'getItem')
        .mockImplementation(() => { throw new Error('storage unavailable'); });

      expect(() => readStoredTheme()).not.toThrow();
      expect(readStoredTheme()).toBeUndefined();

      getItem.mockRestore();
    });
  });

  describe('persistTheme', () => {
    it('should write the theme to storage', () => {
      persistTheme('dark');

      expect(window.localStorage.getItem(THEME_STORAGE_KEY)).toBe('dark');
    });

    it('should notify same-tab observers', () => {
      const onChange = jest.fn();
      const unsubscribe = subscribeTheme(onChange);

      persistTheme('dark');

      expect(onChange).toHaveBeenCalled();
      unsubscribe();
    });

    it('should not throw when storage rejects the write', () => {
      const setItem = jest
        .spyOn(Storage.prototype, 'setItem')
        .mockImplementation(() => { throw new Error('quota exceeded'); });

      expect(() => persistTheme('dark')).not.toThrow();

      setItem.mockRestore();
    });
  });

  describe('getThemeSnapshot', () => {
    it('should prefer the stored preference over the applied theme', () => {
      // Quem persiste grava no storage antes do `data-theme` ser escrito; ler o
      // storage primeiro evita devolver o valor antigo por um render.
      document.documentElement.dataset.theme = 'light';
      window.localStorage.setItem(THEME_STORAGE_KEY, 'dark');

      expect(getThemeSnapshot()).toBe('dark');
    });

    it('should fall back to the applied theme when nothing is stored', () => {
      document.documentElement.dataset.theme = 'dark';

      expect(getThemeSnapshot()).toBe('dark');
    });

    it('should return undefined when there is neither preference nor applied theme', () => {
      expect(getThemeSnapshot()).toBeUndefined();
    });

    it('should expose an undefined server snapshot so hydration matches', () => {
      window.localStorage.setItem(THEME_STORAGE_KEY, 'dark');

      expect(getThemeServerSnapshot()).toBeUndefined();
    });
  });

  describe('subscribeTheme', () => {
    it('should react to changes made in another tab', () => {
      const onChange = jest.fn();
      const unsubscribe = subscribeTheme(onChange);

      window.dispatchEvent(new Event('storage'));

      expect(onChange).toHaveBeenCalledTimes(1);
      unsubscribe();
    });

    it('should stop notifying after unsubscribe', () => {
      const onChange = jest.fn();
      const unsubscribe = subscribeTheme(onChange);

      unsubscribe();
      persistTheme('dark');

      expect(onChange).not.toHaveBeenCalled();
    });
  });
});