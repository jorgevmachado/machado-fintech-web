export const OAccordionVariant = ['default', 'separated'] as const;

export type TAccordionVariant = typeof OAccordionVariant[number];

type TAccordionVariantClassNames = {
  root: string;
  item: string;
  content: string;
};

/**
 * `default` é uma lista contínua separada por linhas — o formato de uma seção
 * de formulário longa. `separated` transforma cada item em um cartão, para
 * quando os blocos são independentes e podem ser lidos fora de ordem.
 */
export const ACCORDION_VARIANT_CLASS_MAP: Record<TAccordionVariant, TAccordionVariantClassNames> = {
  default: {
    root: 'divide-y divide-[color:var(--app-border,#e2e8f0)] border-y border-[color:var(--app-border,#e2e8f0)]',
    item: '',
    content: 'pb-4',
  },
  separated: {
    root: 'flex flex-col gap-2',
    item: 'rounded-lg border border-[color:var(--app-border,#e2e8f0)] bg-[color:var(--app-surface,#ffffff)]',
    content: 'pb-4',
  },
};

/**
 * O estado aberto/fechado muda a cor do trigger, não a do item: no `default`
 * o item é só uma linha divisória, e pintá-lo criaria faixas coloridas na
 * lista inteira.
 */
export const ACCORDION_TRIGGER_CLASS_MAP: Record<TAccordionVariant, Record<'open' | 'closed', string>> = {
  default: {
    open: 'text-[color:var(--app-text-strong,#020617)]',
    closed: 'text-[color:var(--app-text,#0f172a)] hover:text-[color:var(--app-text-strong,#020617)]',
  },
  separated: {
    open: 'text-[color:var(--app-text-strong,#020617)]',
    closed: 'text-[color:var(--app-text,#0f172a)] hover:text-[color:var(--app-text-strong,#020617)]',
  },
};