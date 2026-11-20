export const OTabsVariant = ['underline', 'pills'] as const;

export type TTabsVariant = typeof OTabsVariant[number];

/**
 * `underline` mantém a lista aberta e marca o trigger ativo com uma linha na
 * borda inferior — o trigger herda a linha do tablist, sem fundo, para não
 * competir com o conteúdo logo abaixo.
 *
 * `pills` agrupa os triggers numa faixa suave, onde o ativo sobe para a
 * superfície de realce. É o mesmo contraste trilho/indicador do `IconSwitch`.
 *
 * As cores vêm das custom properties `--app-*` herdadas do shell, com o valor
 * claro como fallback. É o mesmo contrato do `Navigation`: um ponto só decide
 * a aparência nos dois temas, e o componente continua legível fora do shell.
 */
export const TABS_LIST_CLASS_MAP: Record<TTabsVariant, string> = {
  underline: 'border-b border-[color:var(--app-border,#e2e8f0)]',
  pills: 'rounded-xl bg-[color:var(--app-surface-muted,#f1f5f9)] p-1',
};

/**
 * O estado entra como parâmetro do builder, nunca por seletor: o projeto não
 * usa `data-[state]` em lugar nenhum e não tem `tailwind-merge` para resolver
 * classes de cor concorrentes na mesma string.
 */
export const TABS_TRIGGER_CLASS_MAP: Record<TTabsVariant, Record<'active' | 'inactive', string>> = {
  underline: {
    active: 'border-b-2 border-[color:var(--app-accent-border,#3b82f6)] text-[color:var(--app-accent,#1d4ed8)]',
    inactive: 'border-b-2 border-transparent text-[color:var(--app-text-muted,#64748b)] hover:text-[color:var(--app-text-strong,#020617)]',
  },
  pills: {
    active: 'bg-[color:var(--app-accent-soft,#eff6ff)] text-[color:var(--app-accent,#1d4ed8)] shadow-sm',
    inactive: 'text-[color:var(--app-text-muted,#64748b)] hover:text-[color:var(--app-text-strong,#020617)]',
  },
};