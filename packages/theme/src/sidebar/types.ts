import type { TThemeVariant } from '../base';

export type TSidebarVariantsTheme = {
  item: string;
  text: string;
  child: string;
  toggle: string;
  border: string;
  logout: string;
  sidebar: string;
  itemHover: string;
  itemActive: string;
  childActive: string;
};

export type TSidebarThemeVariant = Record<TThemeVariant, TSidebarVariantsTheme>;


export type BuildSidebarThemeResult = {
  text: string;
  aside: string;
  buttonItem: string;
  buttonChild: string;
  buttonLogout: string;
  buttonChildren: string;
  buttonItemActive: string;
  buttonChildActive: string;
  buttonChildContent: string;

};