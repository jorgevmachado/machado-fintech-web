export type TTableHeaderAppearanceTheme = {
  cell: string;
  background: string;
}

export type TTableBodyAppearanceTheme = {
  cell: string;
  border: string;
  background: string;
};

export type TTableFooterAppearanceTheme = TTableHeaderAppearanceTheme;

export type TTableAppearanceTheme = {
  body: TTableBodyAppearanceTheme;
  border: string;
  header: TTableHeaderAppearanceTheme;
  footer: TTableFooterAppearanceTheme;
  background: string;
}

/**
 * As cores vêm das custom properties `--app-*` herdadas do shell, com o valor
 * claro como fallback — mesmo contrato de `Navigation` e dos demais
 * componentes. Assim a tabela acompanha a troca de tema sem `dark:` nem
 * duplicar a paleta; fora do shell, cai no claro.
 */
export const DEFAULT_TABLE_APPEARANCE_THEME: Required<TTableAppearanceTheme> = {
  body: {
    background: 'bg-[color:var(--app-surface,#ffffff)]',
    cell: 'text-[color:var(--app-text,#0f172a)]',
    border: 'border-b border-[color:var(--app-border,#e2e8f0)]',
  },
  border: 'border-[color:var(--app-border,#e2e8f0)]',
  footer: {
    background: 'bg-[color:var(--app-surface-muted,#f1f5f9)]',
    cell: 'text-[color:var(--app-text-muted,#64748b)]',
  },
  header: {
    background: 'bg-[color:var(--app-surface-muted,#f1f5f9)]',
    cell: 'text-[color:var(--app-text-muted,#64748b)]',
  },
  background: 'bg-[color:var(--app-surface,#ffffff)]'
}

export const buildTableAppearanceTheme = (appearance?: Partial<TTableAppearanceTheme>): TTableAppearanceTheme => {
  return {
    ...DEFAULT_TABLE_APPEARANCE_THEME,
    ...appearance,
    body: {
      ...DEFAULT_TABLE_APPEARANCE_THEME.body,
      ...appearance?.body
    },
    footer: {
      ...DEFAULT_TABLE_APPEARANCE_THEME.footer,
      ...appearance?.footer
    },
    header: {
      ...DEFAULT_TABLE_APPEARANCE_THEME.header,
      ...appearance?.header
    }
  }
}