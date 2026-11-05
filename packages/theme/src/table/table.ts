import {
  buildTableAppearanceTheme ,
  TTableAppearanceTheme,
} from './appearance';

type BuildTableThemeResult = Omit<TTableAppearanceTheme, 'border' | 'background'> & {
  table: string;
  content: string;
}

export const buildTableTheme = (appearance?: Partial<TTableAppearanceTheme>): BuildTableThemeResult => {
  const tableAppearance = buildTableAppearanceTheme(appearance);
  const tableClassNameList: string = [
    'min-w-max',
    'overflow-hidden',
    'rounded-xl',
    'border',
    'shadow-sm',
    tableAppearance.border,
    tableAppearance.background,
  ].join(' ');
  return {
    body: {
      ...tableAppearance.body,
      border: `${tableAppearance.body.border} last:border-b-0`
    },
    table: tableClassNameList,
    header: tableAppearance.header,
    footer: tableAppearance.footer,
    content: 'min-w-full'
  }
}