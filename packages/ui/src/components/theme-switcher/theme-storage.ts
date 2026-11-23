import type { ThemeMode } from './types';

/** Chave única do tema no storage; lida só no cliente. */
export const THEME_STORAGE_KEY = 'fintech:theme';

/**
 * Tema com que o app abre quando não há preferência salva.
 *
 * Fica aqui, e não no `AppShell`, porque três pontos precisam concordar: o
 * `variant` que o shell passa ao `Navigation`, o script que aplica o tema
 * antes do primeiro paint e o fallback do próprio `Navigation`. Se o script
 * discordasse, a primeira visita piscaria.
 */
export const DEFAULT_THEME: ThemeMode = 'dark';

export const isThemeMode = (value: unknown): value is ThemeMode =>
  value === 'light' || value === 'dark';

/**
 * Tema já aplicado no `<html>`, se houver.
 *
 * É a fonte mais confiável no cliente: reflete o que está de fato pintado na
 * tela, inclusive quando outra instância escreveu antes deste render.
 */
export const readAppliedTheme = (): ThemeMode | undefined => {
  if (typeof document === 'undefined') {
    return undefined;
  }

  const appliedTheme = document.documentElement.dataset.theme;

  return isThemeMode(appliedTheme) ? appliedTheme : undefined;
};

/**
 * Preferência salva de uma visita anterior.
 *
 * Devolve `undefined` quando não há valor válido — inclusive se o storage
 * estiver indisponível (modo privado, cookies bloqueados), caso em que o
 * chamador decide o fallback.
 */
export const readStoredTheme = (): ThemeMode | undefined => {
  if (typeof window === 'undefined') {
    return undefined;
  }

  try {
    const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);

    return isThemeMode(storedTheme) ? storedTheme : undefined;
  } catch {
    return undefined;
  }
};

/** Evento interno para avisar quem observa o tema dentro da mesma aba. */
const THEME_CHANGE_EVENT = 'fintech:theme-change';

/**
 * Persistência é best-effort: falhar no storage não impede o tema em memória.
 * O evento avisa os observadores da mesma aba — o `storage` do browser só
 * dispara em outras abas, então sem ele o shell não reagiria à própria escrita.
 */
export const persistTheme = (theme: ThemeMode): void => {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // Storage indisponível; o tema aplicado continua valendo para esta visita.
  }

  window.dispatchEvent(new Event(THEME_CHANGE_EVENT));
};

/**
 * Preferência salva, com o tema já aplicado como reserva.
 *
 * A ordem é deliberada: quem persiste grava no storage **antes** de o
 * `ThemeSwitcher` escrever `data-theme` (efeito posterior), então ler primeiro
 * o storage evita devolver o valor antigo por um render.
 */
export const getThemeSnapshot = (): ThemeMode | undefined =>
  readStoredTheme() ?? readAppliedTheme();

/** No servidor não há storage: o consumidor cai no `variant` recebido. */
export const getThemeServerSnapshot = (): ThemeMode | undefined => undefined;

/**
 * Observa mudanças do tema: escrita local (evento interno) e alteração feita em
 * outra aba (`storage`). É o que permite ao `Navigation` ler a preferência sem
 * `setState` dentro de efeito.
 */
export const subscribeTheme = (onChange: () => void): (() => void) => {
  if (typeof window === 'undefined') {
    return () => {};
  }

  window.addEventListener(THEME_CHANGE_EVENT, onChange);
  window.addEventListener('storage', onChange);

  return () => {
    window.removeEventListener(THEME_CHANGE_EVENT, onChange);
    window.removeEventListener('storage', onChange);
  };
};