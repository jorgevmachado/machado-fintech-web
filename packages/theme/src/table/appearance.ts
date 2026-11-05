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

export const DEFAULT_TABLE_APPEARANCE_THEME: Required<TTableAppearanceTheme> = {
  body: {
    background: 'bg-white',
    cell: 'text-slate-700',
    border: 'border-b border-slate-100',
  },
  border: 'border-slate-200',
  footer: {
    background: 'bg-slate-50',
    cell: 'text-slate-600',
  },
  header: {
    background: 'bg-slate-50',
    cell: 'text-slate-600',
  },
  background: 'bg-white'
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