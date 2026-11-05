'use client';

import React, { useEffect, useId, useRef, useState } from 'react';
import { OIcon, type TIcon } from '@fintech/icons';

import Input from '../input';
import { Icon } from '../../primitives';
import { useTranslationResolver } from '../../lang';

import type { IconComboboxProps } from './types';

const IconCombobox = React.forwardRef<HTMLInputElement, IconComboboxProps>(({
  name,
  value,
  defaultValue = '',
  pageSize = 24,
  onValueChange,
  onFocus,
  onClick,
  onKeyDown,
  onClear,
  disabled = false,
  readOnly = false,
  isLoading = false,
  hidden = false,
  fullWidth = true,
  placeholder = 'Search icons',
  noResultsText = 'No icons found',
  showMoreText = 'Show more',
  clearButtonAriaLabel = 'Clear icon',
  ...props
}, ref) => {
  if (!Number.isSafeInteger(pageSize) || pageSize < 1) {
    throw new RangeError('IconCombobox pageSize must be a positive safe integer');
  }

  const { resolve } = useTranslationResolver();
  const id = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [internalValue, setInternalValue] = useState(defaultValue);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [visibleCount, setVisibleCount] = useState(pageSize);
  const [activeIndex, setActiveIndex] = useState(-1);
  const selectedValue = value ?? internalValue;
  const interactive = !disabled && !readOnly && !isLoading && !hidden;
  const isOpen = open && interactive;
  const normalizedQuery = query.trim().toLowerCase();
  const filteredIcons = OIcon.filter((icon) => icon.includes(normalizedQuery));
  const visibleIcons = filteredIcons.slice(0, visibleCount);
  const activeIcon = isOpen ? visibleIcons[activeIndex] : undefined;
  const listboxId = `${id}-icons`;
  const activeOptionId = activeIcon ? `${id}-icon-${activeIcon}` : undefined;

  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (event.target instanceof Node && !rootRef.current?.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('pointerdown', handlePointerDown);
    return () => document.removeEventListener('pointerdown', handlePointerDown);
  }, [isOpen]);

  useEffect(() => {
    if (activeOptionId) {
      document.getElementById(activeOptionId)?.scrollIntoView?.({ block: 'nearest' });
    }
  }, [activeOptionId]);

  const openOptions = () => {
    if (!interactive || isOpen) return;
    setQuery('');
    setVisibleCount(pageSize);
    setActiveIndex(-1);
    setOpen(true);
  };

  const selectIcon = (icon: TIcon | '', event: React.SyntheticEvent) => {
    if (!interactive) return;
    const input = inputRef.current;
    if (!input) throw new Error('IconCombobox input is not mounted');
    if (value === undefined) setInternalValue(icon);
    const changeEvent: React.ChangeEvent<HTMLInputElement> = {
      ...event,
      type: 'change',
      target: input,
      currentTarget: input,
      preventDefault: () => event.preventDefault(),
      stopPropagation: () => event.stopPropagation(),
      isDefaultPrevented: () => event.isDefaultPrevented(),
      isPropagationStopped: () => event.isPropagationStopped(),
      persist: () => event.persist(),
    };
    // The input displays the search query while open, not the committed value.
    const displayValue = input.value;
    input.value = icon;
    try {
      onValueChange?.(icon, name, changeEvent);
    } finally {
      input.value = displayValue;
    }
    inputRef.current?.focus();
    setOpen(false);
    setActiveIndex(-1);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    onKeyDown?.(event);
    if (event.defaultPrevented || event.nativeEvent.isComposing || !interactive) return;

    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      openOptions();
      const count = isOpen ? visibleIcons.length : Math.min(pageSize, OIcon.length);
      setActiveIndex((current) => {
        if (!count) return -1;
        if (!isOpen) return event.key === 'ArrowDown' ? 0 : count - 1;
        return event.key === 'ArrowDown'
          ? (current + 1) % count
          : (current <= 0 ? count - 1 : current - 1);
      });
    } else if (isOpen && (event.key === 'Home' || event.key === 'End')) {
      event.preventDefault();
      setActiveIndex(visibleIcons.length ? (event.key === 'Home' ? 0 : visibleIcons.length - 1) : -1);
    } else if (isOpen && event.key === 'Enter') {
      event.preventDefault();
      if (activeIcon) selectIcon(activeIcon, event);
    } else if (isOpen && event.key === 'Escape') {
      event.preventDefault();
      event.stopPropagation();
      setOpen(false);
    }
  };

  return (
    <div
      ref={rootRef}
      className={`${hidden ? 'hidden' : 'relative'} ${fullWidth ? 'w-full min-w-0' : ''}`}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false);
      }}
      onKeyDown={(event) => {
        if (isOpen && event.key === 'Escape') {
          event.preventDefault();
          event.stopPropagation();
          inputRef.current?.focus();
          setOpen(false);
        }
      }}
    >
      <Input
        {...props}
        ref={(element) => {
          inputRef.current = element;
          if (typeof ref === 'function') ref(element);
          else if (ref) ref.current = element;
        }}
        name={name}
        type="text"
        role="combobox"
        value={isOpen ? query : selectedValue}
        disabled={disabled}
        readOnly={readOnly || isLoading}
        isLoading={isLoading}
        fullWidth={fullWidth}
        placeholder={resolve(placeholder)}
        label={resolve(props.label)}
        helperText={resolve(props.helperText)}
        errorMessage={resolve(props.errorMessage)}
        leadingIcon={OIcon.find((icon) => icon === selectedValue) ?? 'search'}
        trailingIcon="chevron-down"
        clearButtonAriaLabel={resolve(clearButtonAriaLabel)}
        onClear={(event) => {
          selectIcon('', event);
          onClear?.(event);
        }}
        onFocus={(event) => {
          openOptions();
          onFocus?.(event);
        }}
        onClick={(event) => {
          openOptions();
          onClick?.(event);
        }}
        onValueChange={(nextQuery) => {
          if (!interactive) return;
          setQuery(nextQuery);
          setVisibleCount(pageSize);
          setActiveIndex(-1);
          setOpen(true);
        }}
        onKeyDown={handleKeyDown}
        autoComplete="off"
        spellCheck={false}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={isOpen ? listboxId : undefined}
        aria-autocomplete="list"
        aria-activedescendant={activeOptionId}
        aria-label={props['aria-label'] ?? (props.label ? undefined : resolve(placeholder))}
      />
      {isOpen ? (
        <div className="absolute left-0 right-0 top-full z-30 mt-1 max-h-72 overflow-y-auto rounded-xl border border-slate-200 bg-white p-2 shadow-lg">
          <ul
            id={listboxId}
            role="listbox"
            aria-label={resolve(props.label ?? props['aria-label'] ?? placeholder)}
            className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,5rem),1fr))] gap-1"
          >
            {visibleIcons.map((icon, index) => (
              <li
                key={icon}
                id={`${id}-icon-${icon}`}
                role="option"
                aria-label={icon}
                aria-selected={selectedValue === icon}
                onMouseDown={(event) => event.preventDefault()}
                onClick={(event) => selectIcon(icon, event)}
                onMouseMove={() => setActiveIndex(index)}
                className={`flex min-h-16 min-w-0 cursor-pointer flex-col items-center justify-center gap-1 rounded-lg p-2 text-slate-700 ${
                  activeIndex === index ? 'bg-blue-50 ring-2 ring-inset ring-blue-500' : 'hover:bg-slate-50'
                } ${selectedValue === icon ? 'bg-blue-50 text-blue-700' : ''}`}
              >
                <Icon icon={icon} aria-hidden="true" className="text-xl" />
                <span className="w-full break-words text-center text-xs">{icon}</span>
              </li>
            ))}
          </ul>
          {visibleIcons.length === 0 ? (
            <p role="status" className="p-3 text-sm text-slate-500">{resolve(noResultsText)}</p>
          ) : null}
          {visibleIcons.length < filteredIcons.length ? (
            <button
              type="button"
              className="mt-2 min-h-11 w-full rounded-lg px-3 text-sm font-semibold text-blue-700 hover:bg-blue-50 focus-visible:outline-2 focus-visible:outline-blue-500"
              onClick={() => setVisibleCount((count) => count + pageSize)}
            >
              {resolve(showMoreText)}
            </button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
});

IconCombobox.displayName = 'IconCombobox';

export default IconCombobox;
