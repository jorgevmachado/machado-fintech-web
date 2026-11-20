'use client';

import React, { useCallback, useId, useMemo, useState } from 'react';

import { buildAccordionTheme, buildAccordionTriggerTheme } from '@fintech/theme';
import type { TReducedSize, TAccordionVariant } from '@fintech/theme';

import { Icon } from '../../primitives';
import { useTranslationResolver } from '../../lang';
import type { AccordionProps, TAccordionHeadingLevel, TAccordionIcon, TAccordionItem } from './types';

const HEADING_CLASS_MAP = {
  1: 'text-lg font-bold',
  2: 'text-base font-semibold',
  3: 'text-sm font-semibold',
  4: 'text-sm font-semibold',
  5: 'text-sm font-semibold',
  6: 'text-sm font-semibold',
} as const;

const toArray = (value: string | null | Array<string> | undefined): Array<string> => {
  if (value === undefined || value === null) {
    return [];
  }

  return Array.isArray(value) ? value : [value];
};

export default function Accordion(props: AccordionProps) {
  const {
    items,
    variant = 'default',
    size = 'md',
    headingLevel = 3,
    icon,
    forceMount = false,
    className,
  } = props;

  const baseId = useId();
  const { resolveChildren } = useTranslationResolver();
  const isMultiple = props.mode === 'multiple';
  const collapsible = isMultiple ? true : (props.collapsible ?? true);
  // `props` muda de identidade a cada render: usá-lo nas deps de `useCallback`
  // recriaria `toggleItem` sempre. Extraímos os campos estáveis que interessam.
  const controlledValue = props.value;
  const onMultipleChange = props.mode === 'multiple' ? props.onValueChange : undefined;
  const onSingleChange = props.mode === 'multiple' ? undefined : props.onValueChange;

  // O estado interno é inicializado uma única vez: `defaultValue` é só o valor
  // de partida, como em qualquer controle não controlado.
  const [internalValue, setInternalValue] = useState<string | null | Array<string>>(
    () => props.defaultValue ?? (isMultiple ? [] : null),
  );

  const isControlled = controlledValue !== undefined;
  const openValues = useMemo(
    () => toArray(isControlled ? controlledValue : internalValue),
    [internalValue, isControlled, controlledValue],
  );

  const theme = useMemo(() => buildAccordionTheme({ variant, size, className }), [variant, size, className]);

  const handleToggle = useCallback((value: string) => {
    const isOpen = openValues.includes(value);

    if (isMultiple) {
      const nextValue = isOpen
        ? openValues.filter((openValue) => openValue !== value)
        : [...openValues, value];

      if (!isControlled) {
        setInternalValue(nextValue);
      }

      onMultipleChange?.(nextValue);
      return;
    }

    // Fechar o último item aberto só é permitido com `collapsible`.
    if (isOpen && !collapsible) {
      return;
    }

    const nextValue = isOpen ? null : value;

    if (!isControlled) {
      setInternalValue(nextValue);
    }

    onSingleChange?.(nextValue);
  }, [collapsible, isControlled, isMultiple, onMultipleChange, onSingleChange, openValues]);

  if (items.length === 0) {
    return null;
  }

  return (
    <div className={theme.root}>
      {items.map((item) => (
        <AccordionRow
          key={item.value}
          item={item}
          itemClassName={theme.item}
          contentClassName={theme.content}
          baseId={baseId}
          variant={variant}
          size={size}
          headingLevel={headingLevel}
          defaultIcon={icon}
          isOpen={openValues.includes(item.value)}
          forceMount={forceMount}
          onToggle={handleToggle}
          resolveChildren={resolveChildren}
        />
      ))}
    </div>
  );
}

type TAccordionRowProps = {
  item: TAccordionItem;
  itemClassName: string;
  contentClassName: string;
  baseId: string;
  variant: TAccordionVariant;
  size: TReducedSize;
  headingLevel: TAccordionHeadingLevel;
  defaultIcon?: TAccordionIcon;
  isOpen: boolean;
  forceMount: boolean;
  onToggle: (value: string) => void;
  resolveChildren: (child?: React.ReactNode, currentDepth?: number) => React.ReactNode;
};

/**
 * Cada linha é um componente próprio para manter o markup do item coeso e os
 * hooks de tema (`useMemo`) por item, em vez de reusar um único bloco inline.
 */
function AccordionRow({
  item,
  itemClassName,
  contentClassName,
  baseId,
  variant,
  size,
  headingLevel,
  defaultIcon,
  isOpen,
  forceMount,
  onToggle,
  resolveChildren,
}: TAccordionRowProps) {
  // `value` pode ter espaço ou acento, o que produz id inválido e quebra o
  // IDREF de `aria-controls`/`aria-labelledby`. Mesmo slug do `Tabs`.
  const itemId = `${baseId}-${item.value.trim().replace(/\s+/g, '-')}`;
  const triggerId = `${itemId}-trigger`;
  const contentId = `${itemId}-content`;
  const disabled = item.disabled ?? false;
  const isMounted = isOpen || forceMount;

  const triggerTheme = useMemo(
    () => buildAccordionTriggerTheme({ variant, size, isOpen, disabled }),
    [variant, size, isOpen, disabled],
  );

  const Heading = `h${headingLevel}` as const;

  return (
    <div className={itemClassName}>
      <Heading className={HEADING_CLASS_MAP[headingLevel]}>
        <button
          type="button"
          id={triggerId}
          aria-expanded={isOpen}
          // O painel só existe quando montado: apontar `aria-controls` para um
          // id ausente é IDREF quebrado. Mesma regra do `Tabs`.
          aria-controls={isMounted ? contentId : undefined}
          disabled={disabled}
          onClick={() => !disabled && onToggle(item.value)}
          className={triggerTheme.trigger}
        >
          <span className="min-w-0">{resolveChildren(item.title, 3)}</span>
          <Icon icon={item.icon ?? defaultIcon ?? 'chevron-down'} aria-hidden="true" className={triggerTheme.icon} />
        </button>
      </Heading>

      {isMounted ? (
        <div
          id={contentId}
          role="region"
          aria-labelledby={triggerId}
          inert={!isOpen || undefined}
          className={[
            'grid',
            'overflow-hidden',
            isOpen ? 'animate-accordion-open motion-reduce:animate-none' : 'grid-rows-[0fr]',
          ].join(' ')}
        >
          {/*
           * O filho direto do grid precisa colapsar em `0fr`. O padding fica
           * num nível interno: aplicado no próprio filho do grid, ele mantém
           * altura intrínseca e `0fr` não fecha o painel.
           */}
          <div className="min-h-0 overflow-hidden">
            <div className={contentClassName}>{item.content}</div>
          </div>
        </div>
      ) : null}
    </div>
  );
}