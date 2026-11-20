import type { ReactNode } from 'react';

import type { TReducedSize, TTabsVariant } from '@fintech/theme';

export const OTabsActivationMode = ['automatic', 'manual'] as const;

export type TTabsActivationMode = typeof OTabsActivationMode[number];

export type TTabsItem<T extends string = string> = {
  value: T;
  label: ReactNode;
  content: ReactNode;
  disabled?: boolean;
};

/**
 * A lista é descrita por dados no próprio root: não há `TabsList`/`TabsTrigger`
 * para compor. A ordem dos painéis segue a ordem de `items`, sem ambiguidade.
 */
export type TabsProps<T extends string = string> = {
  items: Array<TTabsItem<T>>;
  variant?: TTabsVariant;
  size?: TReducedSize;
  /** `automatic` já ativa ao mover o foco; `manual` exige Enter/Espaço. */
  activationMode?: TTabsActivationMode;
  value?: T;
  defaultValue?: T;
  onValueChange?: (value: T) => void;
  /** Classe do root; a lista e os painéis herdam o layout do componente. */
  className?: string;
  /** Nome acessível do tablist. */
  ariaLabel?: string;
  /** Mantém os painéis inativos montados, escondidos pela classe `hidden`. */
  forceMount?: boolean;
};