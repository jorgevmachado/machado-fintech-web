'use client';

import React, { useCallback, useId, useMemo, useRef, useState } from 'react';

import { buildTabsTheme, buildTabsTriggerTheme } from '@fintech/theme';

import { useTranslationResolver } from '../../lang';
import type { TabsProps } from './types';

/**
 * `value` pode ter espaço ou acento, o que quebra `querySelector` e ids
 * duplicados em `getElementById`. O slug mantém o id previsível; a unicidade
 * do `value` continua sendo contrato de quem usa.
 */
const buildSlotId = (baseId: string, kind: 'tab' | 'panel', value: string): string =>
  `${baseId}-${kind}-${value.trim().replace(/\s+/g, '-')}`;

export default function Tabs<T extends string = string>({
  items,
  variant = 'underline',
  size = 'md',
  activationMode = 'automatic',
  value,
  defaultValue,
  onValueChange,
  className,
  ariaLabel,
  forceMount = false,
}: TabsProps<T>) {
  const baseId = useId();
  const { resolveChildren } = useTranslationResolver();
  const listRef = useRef<HTMLDivElement>(null);
  const [internalValue, setInternalValue] = useState<T | undefined>(defaultValue);

  const isControlled = value !== undefined;
  const requestedValue = isControlled ? value : internalValue;
  // Um `value`/`defaultValue` que não casa com nenhum item equivale a "nada
  // selecionado": sem o fallback, todos os triggers ficariam com `tabindex=-1`
  // e a lista seria inalcançável por teclado. A lista é conhecida, então dá
  // para cair na primeira aba habilitada.
  const currentValue = items.some((item) => item.value === requestedValue)
    ? requestedValue
    : items.find((item) => !item.disabled)?.value;

  const theme = useMemo(() => buildTabsTheme({ variant, size, className }), [variant, size, className]);

  const selectValue = useCallback((nextValue: string) => {
    if (!isControlled) {
      setInternalValue(nextValue as T);
    }

    onValueChange?.(nextValue as T);
  }, [isControlled, onValueChange]);

  const moveFocus = useCallback((direction: 1 | -1) => {
    const tabs = Array.from(listRef.current?.querySelectorAll<HTMLButtonElement>('[role="tab"]:not([aria-disabled="true"])') ?? []);

    if (tabs.length === 0) {
      return;
    }

    const focusedIndex = tabs.findIndex((tab) => tab === document.activeElement);
    const selectedIndex = tabs.findIndex((tab) => tab.getAttribute('aria-selected') === 'true');
    const anchorIndex = focusedIndex !== -1 ? focusedIndex : selectedIndex;
    const nextIndex = anchorIndex === -1
      ? (direction === 1 ? 0 : tabs.length - 1)
      : (anchorIndex + direction + tabs.length) % tabs.length;
    const nextTab = tabs[nextIndex];

    nextTab?.focus();

    if (activationMode === 'automatic' && nextTab?.dataset.tabValue !== undefined) {
      selectValue(nextTab.dataset.tabValue);
    }
  }, [activationMode, selectValue]);

  const moveToEdge = useCallback((edge: 'first' | 'last') => {
    const tabs = Array.from(listRef.current?.querySelectorAll<HTMLButtonElement>('[role="tab"]:not([aria-disabled="true"])') ?? []);
    const target = edge === 'first' ? tabs[0] : tabs[tabs.length - 1];

    target?.focus();

    if (activationMode === 'automatic' && target?.dataset.tabValue !== undefined) {
      selectValue(target.dataset.tabValue);
    }
  }, [activationMode, selectValue]);

  const handleKeyDown = useCallback((event: React.KeyboardEvent<HTMLDivElement>) => {
    switch (event.key) {
      case 'ArrowRight':
      case 'ArrowDown':
        event.preventDefault();
        moveFocus(1);
        break;
      case 'ArrowLeft':
      case 'ArrowUp':
        event.preventDefault();
        moveFocus(-1);
        break;
      case 'Home':
        event.preventDefault();
        moveToEdge('first');
        break;
      case 'End':
        event.preventDefault();
        moveToEdge('last');
        break;
      default:
        break;
    }
  }, [moveFocus, moveToEdge]);

  if (items.length === 0) {
    return null;
  }

  return (
    <div className={theme.root}>
      <div ref={listRef} role="tablist" aria-label={ariaLabel} className={theme.list} onKeyDown={handleKeyDown}>
        {items.map((item) => {
          const isActive = item.value === currentValue;

          return (
            <button
              key={item.value}
              type="button"
              role="tab"
              id={buildSlotId(baseId, 'tab', item.value)}
              data-tab-value={item.value}
              aria-selected={isActive}
              // Com `forceMount` o painel inativo existe no DOM, então o IDREF é válido.
              aria-controls={isActive || forceMount ? buildSlotId(baseId, 'panel', item.value) : undefined}
              aria-disabled={item.disabled || undefined}
              // Roving tabindex: só o ativo recebe 0; sem seleção, todos voltam
              // a ser alcançáveis por Tab (tabIndex omitido).
              tabIndex={currentValue === undefined ? undefined : (isActive ? 0 : -1)}
              onClick={() => !item.disabled && selectValue(item.value)}
              className={buildTabsTriggerTheme({ variant, size, isActive, disabled: item.disabled })}
            >
              {resolveChildren(item.label, 3)}
            </button>
          );
        })}
      </div>

      {items.map((item) => {
        const isActive = item.value === currentValue;

        if (!isActive && !forceMount) {
          return null;
        }

        return (
          <div
            key={item.value}
            id={buildSlotId(baseId, 'panel', item.value)}
            role="tabpanel"
            aria-labelledby={buildSlotId(baseId, 'tab', item.value)}
            tabIndex={isActive ? 0 : -1}
            inert={!isActive || undefined}
            className={[theme.panel, isActive ? '' : 'hidden'].filter(Boolean).join(' ')}
          >
            {item.content}
          </div>
        );
      })}
    </div>
  );
}