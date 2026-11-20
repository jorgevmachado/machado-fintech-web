import type { ReactNode } from 'react';

import type { TIcon } from '@fintech/icons';
import type { TReducedSize, TAccordionVariant } from '@fintech/theme';

export const OAccordionHeadingLevel = [1, 2, 3, 4, 5, 6] as const;

export type TAccordionHeadingLevel = typeof OAccordionHeadingLevel[number];

export type TAccordionIcon = ReactNode | TIcon;

export type TAccordionItem = {
  /** Identidade estável do item: sobrevive a reordenação e a controle externo. */
  value: string;
  /** Título exibido no trigger. */
  title: ReactNode;
  /** Corpo exibido quando o item está aberto. */
  content: ReactNode;
  disabled?: boolean;
  /** Indicador do item; sobrescreve o `icon` do root. */
  icon?: TAccordionIcon;
};

type TAccordionBaseProps = {
  items: Array<TAccordionItem>;
  variant?: TAccordionVariant;
  size?: TReducedSize;
  /** Nível do heading que envolve o trigger. APG exige o heading, não só o botão. */
  headingLevel?: TAccordionHeadingLevel;
  /** Indicador padrão de todos os itens; cada item pode sobrescrever. */
  icon?: TAccordionIcon;
  /** Mantém os painéis fechados montados, colapsados por `grid-rows-[0fr]` e `inert`. */
  forceMount?: boolean;
  className?: string;
};

/**
 * `collapsible` só existe no modo `single`: no `multiple` cada item já é
 * independente, e a prop não teria significado.
 */
export type AccordionSingleProps = TAccordionBaseProps & {
  mode?: 'single';
  value?: string | null;
  defaultValue?: string | null;
  onValueChange?: (value: string | null) => void;
  collapsible?: boolean;
};

export type AccordionMultipleProps = TAccordionBaseProps & {
  mode: 'multiple';
  value?: Array<string>;
  defaultValue?: Array<string>;
  onValueChange?: (value: Array<string>) => void;
  collapsible?: never;
};

export type AccordionProps = AccordionSingleProps | AccordionMultipleProps;