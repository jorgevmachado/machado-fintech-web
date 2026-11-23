import type { TThemeVariant } from '../base';

/**
 * Fundo da área de conteúdo do shell, atrás dos cards.
 *
 * Vai como `background` inline, não como classe utilitária: `bg-[radial-gradient(...)]`
 * compila para `background-color: radial-gradient(...)`, que é inválido e o
 * browser descarta — o gradiente do shell nunca apareceu por isso. O claro
 * mantém o `--background` do projeto; o escuro usa o slate mais profundo da
 * paleta com os mesmos brilhos radiais (amarelo e azul), só que mais discretos,
 * porque sobre fundo escuro o brilho satura rápido.
 */
export const NAVIGATION_SHELL_BACKGROUND_MAP: Record<TThemeVariant, string> = {
  light:
    'radial-gradient(900px 500px at 100% -5%, rgba(250,204,21,0.18), transparent 55%), radial-gradient(800px 460px at -10% 100%, rgba(37,99,235,0.14), transparent 52%), var(--background)',
  dark:
    'radial-gradient(900px 500px at 100% -5%, rgba(250,204,21,0.08), transparent 55%), radial-gradient(800px 460px at -10% 100%, rgba(59,130,246,0.20), transparent 52%), #0b1220',
};

/**
 * Paleta de conteúdo do shell, publicada como custom properties no elemento
 * raiz do `Navigation` e herdada por tudo que é desenhado sobre o canvas.
 *
 * Componentes consomem via `bg-[color:var(--app-surface,#ffffff)]`,
 * `text-[color:var(--app-text,#0f172a)]` e afins: um único ponto decide a
 * aparência dos dois temas. O fallback de cada uso é o valor claro, para o
 * conteúdo que é renderizado fora do shell — em portal, como o modal — onde a
 * variável não existe.
 *
 * Os nomes seguem o papel (`surface`, `text`, `accent`) e não a cor, porque o
 * escuro não é um espelho literal do claro: texto secundário e realces precisam
 * de mais luz. Ficam fora daqui as superfícies de `@fintech/ui` (inputs, botões,
 * modal): elas são light-only e continuam claras nos dois temas.
 */
export const NAVIGATION_SHELL_VARS_MAP: Record<TThemeVariant, Record<string, string>> = {
  light: {
    '--app-surface': '#ffffff',
    '--app-surface-muted': '#f1f5f9',
    '--app-surface-hover': 'rgba(241, 245, 249, 0.7)',
    '--app-border': '#e2e8f0',
    '--app-text-strong': '#020617',
    '--app-text': '#0f172a',
    '--app-text-subtle': '#475569',
    '--app-text-muted': '#64748b',
    '--app-accent': '#1d4ed8',
    '--app-accent-soft': '#eff6ff',
    '--app-accent-border': '#3b82f6',
    '--app-positive': '#059669',
    '--app-positive-soft': 'rgba(5, 150, 105, 0.10)',
    '--app-positive-strong': '#065f46',
    '--app-negative': '#dc2626',
    '--app-negative-soft': 'rgba(220, 38, 38, 0.10)',
    '--app-negative-strong': '#991b1b',
    '--app-info': '#0369a1',
    '--app-info-soft': 'rgba(2, 132, 199, 0.10)',
    '--app-info-strong': '#075985',
    '--app-warning': '#b45309',
    '--app-warning-soft': 'rgba(217, 119, 6, 0.10)',
    '--app-warning-strong': '#92400e',
    '--app-track': '#cbd5e1',
    '--app-track-active': '#0f172a',
  },
  dark: {
    // Escada de superfícies aberta: sobre o shell `#0b1220`, o card fica a
    // 1.20:1 e a borda a 1.54:1. A escada anterior (`#111c33` / `#17233d` /
    // `#1f2f4a`) dava 1.10:1 de card e 1.26:1 de borda — o card sumia no fundo.
    '--app-surface': '#17233d',
    '--app-surface-muted': '#1e2c48',
    '--app-surface-hover': 'rgba(30, 41, 59, 0.55)',
    '--app-border': '#2f4166',
    '--app-text-strong': '#f8fafc',
    '--app-text': '#e6edf7',
    '--app-text-subtle': '#c3d0e0',
    '--app-text-muted': '#93a4bd',
    '--app-accent': '#93c5fd',
    '--app-accent-soft': 'rgba(59, 130, 246, 0.16)',
    '--app-accent-border': '#3b82f6',
    '--app-positive': '#34d399',
    '--app-positive-soft': 'rgba(52, 211, 153, 0.16)',
    '--app-positive-strong': '#6ee7b7',
    '--app-negative': '#f87171',
    '--app-negative-soft': 'rgba(248, 113, 113, 0.16)',
    '--app-negative-strong': '#fca5a5',
    '--app-info': '#7dd3fc',
    '--app-info-soft': 'rgba(56, 189, 248, 0.16)',
    '--app-info-strong': '#bae6fd',
    '--app-warning': '#fbbf24',
    '--app-warning-soft': 'rgba(251, 191, 36, 0.16)',
    '--app-warning-strong': '#fcd34d',
    '--app-track': '#334155',
    '--app-track-active': '#64748b',
  },
};