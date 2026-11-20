'use client';

import React, { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';

import { buildDropdownTheme } from '@fintech/theme';

import { useTranslationResolver } from '../../lang';
import { Icon } from '../../primitives';

import type { DropdownProps, TDropdownActionItem } from './types';
import { isSelectionDropdown, isSeparatorItem } from './types';

type TRenderableEntry =
  | { kind: 'item'; key: string; item: TDropdownActionItem; value?: string }
  | { kind: 'separator'; key: string };

const ITEM_SELECTOR = '[data-dropdown-item]:not([disabled])';

const joinClasses = (classNames: Array<string | false | undefined>): string =>
  classNames.filter(Boolean).join(' ');

const Dropdown = (props: DropdownProps) => {
  const {
    trigger,
    triggerLabel,
    placeholder,
    size = 'md',
    tone = 'default',
    appearance = 'outline',
    placement = 'bottom-end',
    fullWidth = false,
    disabled = false,
    className,
    menuClassName,
    header,
    emptyText,
    onOpenChange,
    'aria-label': ariaLabel,
    'data-testid': testId,
  } = props;

  const { resolveChildren } = useTranslationResolver();

  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const [open, setOpen] = useState(false);

  const triggerId = useId();
  const menuId = useId();

  const theme = useMemo(
    () => buildDropdownTheme({ size, tone, appearance, placement, fullWidth, disabled, className, menuClassName }),
    [size, tone, appearance, placement, fullWidth, disabled, className, menuClassName],
  );

  const selectionMode = isSelectionDropdown(props);

  const selectedOption = selectionMode
    ? props.options.find((option) => option.value === props.value)
    : undefined;

  const entries: Array<TRenderableEntry> = selectionMode
    ? props.options.map((option) => ({
      kind: 'item',
      key: option.value,
      value: option.value,
      item: {
        label: option.label,
        icon: option.icon,
        disabled: option.disabled,
        onClick: () => props.onChange(option.value),
      },
    }))
    : props.items.map((entry, index) => {
      if (isSeparatorItem(entry)) {
        return { kind: 'separator', key: entry.key ?? `separator-${index}` };
      }

      // `label` não é garantidamente único (labels traduzidos se repetem);
      // o índice entra como desempate para evitar keys duplicadas.
      return { kind: 'item', key: entry.key ?? `${entry.label}-${index}`, item: entry };
    });

  const hasEntries = entries.some((entry) => entry.kind === 'item');

  const setDropdownOpen = useCallback(
    (next: boolean) => {
      // `onOpenChange` precisa ficar fora do updater: o React 19 invoca
      // updaters duas vezes em StrictMode, o que duplicaria o efeito colateral.
      if (open === next) {
        return;
      }

      setOpen(next);
      onOpenChange?.(next);
    },
    [open, onOpenChange],
  );

  const handleClose = useCallback(
    (restoreFocus = false) => {
      setDropdownOpen(false);

      if (restoreFocus) {
        triggerRef.current?.focus();
      }
    },
    [setDropdownOpen],
  );

  const focusItem = useCallback((direction: 1 | -1) => {
    const items = Array.from(
      menuRef.current?.querySelectorAll<HTMLButtonElement>(ITEM_SELECTOR) ?? [],
    );

    if (items.length === 0) {
      return;
    }

    const currentIndex = items.findIndex((item) => item === document.activeElement);
    const nextIndex = currentIndex === -1
      ? 0
      : (currentIndex + direction + items.length) % items.length;

    items[nextIndex]?.focus();
  }, []);

  const focusEdge = useCallback((edge: 'first' | 'last') => {
    const items = Array.from(
      menuRef.current?.querySelectorAll<HTMLButtonElement>(ITEM_SELECTOR) ?? [],
    );

    const target = edge === 'first' ? items[0] : items[items.length - 1];
    target?.focus();
  }, []);

  useEffect(() => {
    if (!open) {
      return;
    }

    const handleOutsidePointer = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutsidePointer);
    return () => document.removeEventListener('mousedown', handleOutsidePointer);
  }, [open, setDropdownOpen]);

  useEffect(() => {
    if (!open) {
      return;
    }

    const items = Array.from(
      menuRef.current?.querySelectorAll<HTMLButtonElement>(ITEM_SELECTOR) ?? [],
    );

    const selected = items.find((item) => item.getAttribute('aria-checked') === 'true');
    (selected ?? items[0])?.focus();
  }, [open]);

  const handleTriggerKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLButtonElement>) => {
      if (disabled) {
        return;
      }

      if (event.key === 'ArrowDown' || event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        setDropdownOpen(true);
      }
    },
    [disabled, setDropdownOpen],
  );

  const handleMenuKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      // O menu pode conter um `header` editável (ex.: input de busca). Só
      // tratamos a tecla quando o foco está em um item ou no próprio menu;
      // teclas digitadas no input do header seguem o comportamento nativo.
      const target = event.target as HTMLElement;
      const isOnItem = Boolean(target.closest(ITEM_SELECTOR));
      const isOnMenu = target === event.currentTarget;

      if (!isOnItem && !isOnMenu) {
        return;
      }

      switch (event.key) {
        case 'ArrowDown':
          event.preventDefault();
          focusItem(1);
          break;
        case 'ArrowUp':
          event.preventDefault();
          focusItem(-1);
          break;
        case 'Home':
          event.preventDefault();
          focusEdge('first');
          break;
        case 'End':
          event.preventDefault();
          focusEdge('last');
          break;
        case 'Escape':
          event.preventDefault();
          handleClose(true);
          break;
        case 'Tab':
          handleClose();
          break;
        default:
          break;
      }
    },
    [focusEdge, focusItem, handleClose],
  );

  const handleTriggerClick = useCallback(() => {
    if (disabled) {
      return;
    }

    setDropdownOpen(!open);
  }, [disabled, open, setDropdownOpen]);

  const mergedTriggerRef = useCallback(
    (node: HTMLButtonElement | null) => {
      triggerRef.current = node;
    },
    [],
  );

  const triggerA11yProps: Record<string, unknown> = {
    id: triggerId,
    'aria-haspopup': 'menu',
    'aria-expanded': open,
    'aria-controls': open ? menuId : undefined,
    onClick: handleTriggerClick,
    onKeyDown: handleTriggerKeyDown,
  };

  // Só sobrescreve o nome acessível e o estado desabilitado quando há valor:
  // `cloneElement` com `undefined` apagaria o que o trigger custom já tinha.
  const accessibleName = triggerLabel ?? ariaLabel;

  if (accessibleName !== undefined) {
    triggerA11yProps['aria-label'] = accessibleName;
  }

  if (disabled) {
    triggerA11yProps.disabled = true;
    triggerA11yProps['aria-disabled'] = true;
  }

  const defaultTriggerContent = selectionMode ? (
    <>
      <span className="truncate">
        {selectedOption ? resolveChildren(selectedOption.label) : placeholder}
      </span>
      <Icon icon={'chevron-down' as const} aria-hidden="true" className="shrink-0 opacity-60" />
    </>
  ) : (
    <Icon icon={'dots' as const} aria-hidden="true" />
  );

  const triggerElement = React.isValidElement(trigger) ? (
    React.cloneElement(
      trigger as React.ReactElement<Record<string, unknown>>,
      { ...triggerA11yProps, ref: mergedTriggerRef },
    )
  ) : (
    <button
      {...triggerA11yProps}
      ref={triggerRef}
      type="button"
      disabled={disabled}
      className={theme.trigger}
    >
      {trigger ?? defaultTriggerContent}
    </button>
  );

  const renderItem = (entry: TRenderableEntry) => {
    if (entry.kind === 'separator') {
      return <div key={entry.key} role="separator" className={theme.separator} />;
    }

    const { item } = entry;
    const isSelected = selectionMode && entry.value === props.value;
    const iconPosition = item.icon ? (item.iconPosition ?? 'left') : undefined;

    return (
      <button
        key={entry.key}
        type="button"
        role={selectionMode ? 'menuitemradio' : 'menuitem'}
        aria-checked={selectionMode ? isSelected : undefined}
        data-dropdown-item="true"
        disabled={item.disabled}
        onClick={() => {
          handleClose(true);
          item.onClick();
        }}
        className={joinClasses([
          theme.itemFor(item.tone),
          isSelected && theme.itemSelected,
        ])}
      >
        {iconPosition === 'left' && (
          <span aria-hidden="true" className="inline-flex shrink-0">
            <Icon icon={item.icon} className={theme.check} />
          </span>
        )}
        <span className="truncate">{resolveChildren(item.label)}</span>
        {iconPosition === 'right' && !isSelected && (
          <span aria-hidden="true" className="ml-auto inline-flex shrink-0">
            <Icon icon={item.icon} className={theme.check} />
          </span>
        )}
        {isSelected && (
          <span aria-hidden="true" className="ml-auto inline-flex shrink-0">
            <Icon icon={'check' as const} className={theme.check} />
          </span>
        )}
      </button>
    );
  };

  return (
    <div
      ref={containerRef}
      className={fullWidth ? 'relative block w-full' : 'relative inline-block'}
      data-testid={testId}
    >
      {triggerElement}

      {open && (
        <div
          ref={menuRef}
          id={menuId}
          role="menu"
          aria-labelledby={triggerId}
          aria-label={ariaLabel}
          tabIndex={-1}
          onKeyDown={handleMenuKeyDown}
          className={theme.menu}
        >
          {header && <div className="px-2 pb-1">{header}</div>}

          {hasEntries
            ? entries.map(renderItem)
            : emptyText && (
              <p className="px-4 py-3 text-sm text-slate-500">{resolveChildren(emptyText)}</p>
            )}
        </div>
      )}
    </div>
  );
};

export default React.memo(Dropdown);