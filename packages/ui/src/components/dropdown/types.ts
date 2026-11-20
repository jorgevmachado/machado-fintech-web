import type { ReactNode } from 'react';

import type { TIcon } from '@fintech/icons';
import type { TDropdownAppearance, TDropdownPlacement, TDropdownSize, TTone } from '@fintech/theme';


export type TDropdownActionItem = {
  type?: 'item';
  label: string;
  onClick: () => void;
  icon?: ReactNode | TIcon;
  iconPosition?: 'left' | 'right';
  tone?: TTone;
  disabled?: boolean;
  /** Chave estável para a lista. Cai para `label` quando ausente. */
  key?: string;
};

export type TDropdownSeparatorItem = {
  type: 'separator';
  key?: string;
};

export type TDropdownAction = TDropdownActionItem | TDropdownSeparatorItem;

export type TDropdownOption = {
  value: string;
  label: string;
  icon?: ReactNode | TIcon;
  disabled?: boolean;
};

type TDropdownSharedProps = {
  trigger?: ReactNode;
  triggerLabel?: string;
  size?: TDropdownSize;
  tone?: TTone;
  appearance?: TDropdownAppearance;
  placement?: TDropdownPlacement;
  fullWidth?: boolean;
  disabled?: boolean;
  className?: string;
  menuClassName?: string;
  /** Conteúdo renderizado acima dos itens, ex.: um input de busca. */
  header?: ReactNode;
  /** Texto do trigger no modo seleção quando não há valor. */
  placeholder?: ReactNode;
  /** Texto exibido quando a lista está vazia. */
  emptyText?: ReactNode;
  onOpenChange?: (open: boolean) => void;
  'aria-label'?: string;
  'data-testid'?: string;
};

export type TDropdownActionProps = TDropdownSharedProps & {
  items: Array<TDropdownAction>;
  options?: never;
  value?: never;
  onChange?: never;
};

export type TDropdownSelectionProps = TDropdownSharedProps & {
  options: Array<TDropdownOption>;
  value: string;
  onChange: (value: string) => void;
  items?: never;
};

export type DropdownProps = TDropdownActionProps | TDropdownSelectionProps;

export const isSelectionDropdown = (props: DropdownProps): props is TDropdownSelectionProps =>
  Array.isArray(props.options);

export const isSeparatorItem = (item: TDropdownAction): item is TDropdownSeparatorItem =>
  item.type === 'separator';