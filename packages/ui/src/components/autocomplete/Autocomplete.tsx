'use client';

import React ,{
  type ChangeEvent ,
  useCallback ,
  useEffect ,
  useMemo ,
  useRef ,
  useState ,
} from 'react';

import Input from '../input';

import type { AutocompleteProps, AutocompleteOption } from './types';
import { useTranslationResolver } from '../../lang';

const resolveDisplayValue = (optionValue: string, options: ReadonlyArray<AutocompleteOption>): string => {
  const selectedOption = options.find((option) => option.value === optionValue);

  return selectedOption?.label ?? optionValue;
};


const Autocomplete = React.forwardRef<HTMLInputElement, AutocompleteProps>(({
  name,
  value = '',
  onBlur,
  options,
  onFocus,
  onChange,
  isLoading = false,
  maxOptions = 8,
  placeholder,
  onValueBlur,
  noResultsText = 'form.no_options',
  filterOptions,
  onValueChange,
  onSelectOption,
  onInputKeyDown,
  optionClassName,
  listboxClassName,
  loadingPlaceholder,
  ...props
}, ref) => {
  const { resolve } = useTranslationResolver();
  const [inputValue, setInputValue] = useState<string>(resolveDisplayValue(value, options));
  const [isOptionsOpen, setIsOptionsOpen] = useState<boolean>(false);
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);

  const blurTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setInputValue(resolveDisplayValue(value, options));
  }, [options, value]);

  const normalizedQuery = useMemo(() => inputValue.trim().toLowerCase(), [inputValue]);

  const getPredicate = useCallback((query: string) => {
      if (filterOptions) {
        return (option: AutocompleteOption) => filterOptions(option, query);
      }

      return (option: AutocompleteOption) => {
        const searchValue = [
          option.label ?? option.value,
          option.description ?? '',
        ]
        .join(' ')
        .toLowerCase();

        return searchValue.includes(query);
      };
    }, [filterOptions]);

  const filteredOptions = useMemo(() => {
    if (!normalizedQuery) {
      return options
      .filter((option) => !option.disabled)
      .slice(0, maxOptions);
    }

    const predicate = getPredicate(normalizedQuery);

    return options
    .filter((option) => !option.disabled)
    .filter(predicate)
    .slice(0, maxOptions);
  }, [maxOptions, normalizedQuery, options, getPredicate]);

  const activeOptionId = highlightedIndex >= 0
    ? `${name}-option-${highlightedIndex}`
    : undefined;

  const resolvedPlaceholder = useMemo(() => {
    if (!isLoading) {
      return placeholder;
    }

    return loadingPlaceholder ?? `Loading ${name}...`;
  }, [isLoading, loadingPlaceholder, name, placeholder]);

  const closeOptions = useCallback(() => {
    setIsOptionsOpen(false);
    setHighlightedIndex(-1);
  }, []);

  const selectOption = useCallback((option: AutocompleteOption, event?: React.MouseEvent<HTMLLIElement>): void => {
    setInputValue(option.label ?? option.value);
    closeOptions();

    onValueChange?.(option.value, name, event as unknown as React.ChangeEvent<HTMLInputElement>);
    onSelectOption?.(option);
  }, [name, onValueChange, onSelectOption, closeOptions]);

  const handleValueChange = useCallback((nextValue: string,fieldName: string,event: React.ChangeEvent<HTMLInputElement>) => {
      setInputValue(nextValue);
      setIsOptionsOpen(true);
      setHighlightedIndex(-1);
      onValueChange?.(
        nextValue,
        fieldName,
        event,
      );
    },[onValueChange]);

  const handleValueBlur = useCallback((nextValue: string, fieldName: string, event: ChangeEvent<HTMLInputElement>) => {
      onValueBlur?.(
        nextValue,
        fieldName,
        event,
      );

      if (blurTimeoutRef.current) {
        clearTimeout(blurTimeoutRef.current);
      }

      blurTimeoutRef.current = setTimeout(() => {
        closeOptions();
      }, 120);
    }, [closeOptions, onValueBlur]);

  const handleClear = useCallback(() => {
    setInputValue('');
    closeOptions();
  }, [closeOptions]);

  const handleKeyDown = useCallback((event: React.KeyboardEvent<HTMLInputElement>) => {
      onInputKeyDown?.(event);

      if (event.defaultPrevented) {
        return;
      }

      if (event.key === 'ArrowDown') {
        event.preventDefault();

        setIsOptionsOpen(true);

        setHighlightedIndex((previousIndex) => {
          if (filteredOptions.length === 0) {
            return -1;
          }

          return previousIndex < filteredOptions.length - 1
            ? previousIndex + 1
            : 0;
        });

        return;
      }

      if (event.key === 'ArrowUp') {
        event.preventDefault();

        setIsOptionsOpen(true);

        setHighlightedIndex((previousIndex) => {
          if (filteredOptions.length === 0) {
            return -1;
          }

          return previousIndex > 0
            ? previousIndex - 1
            : filteredOptions.length - 1;
        });

        return;
      }

      if (event.key === 'Enter' && isOptionsOpen && highlightedIndex >= 0) {
        event.preventDefault();

        const selectedOption = filteredOptions[highlightedIndex];

        if (selectedOption) {
          setInputValue(selectedOption.label ?? selectedOption.value);

          closeOptions();
          onValueChange?.(
            selectedOption.value,
            name,
            event as unknown as React.ChangeEvent<HTMLInputElement>,
          );
          onSelectOption?.(selectedOption);
        }

        return;
      }

      if (event.key === 'Escape') {
        closeOptions();
      }
    },[ closeOptions, filteredOptions, highlightedIndex, isOptionsOpen, name, onInputKeyDown, onSelectOption, onValueChange]);

  return (
    <div className="relative">
      <Input
        {...props}
        ref={ref}
        role="combobox"
        type="text"
        name={name}
        value={inputValue}
        onBlur={onBlur}
        onClear={handleClear}
        onFocus={(event) => {
          setIsOptionsOpen(true);
          onFocus?.(event);
        }}
        onChange={onChange}
        onKeyDown={handleKeyDown}
        isLoading={isLoading}
        onValueBlur={handleValueBlur}
        placeholder={resolvedPlaceholder}
        aria-controls={`${name}-autocomplete-listbox`}
        aria-expanded={isOptionsOpen}
        onValueChange={handleValueChange}
        showClearButton
        aria-autocomplete="list"
        aria-activedescendant={activeOptionId}
      />
      { isOptionsOpen ? (
        <ul
          id={`${name}-autocomplete-listbox`}
          role="listbox"
          className={`
            absolute
            left-0
            right-0
            top-[calc(100%+4px)]
            z-20
            max-h-52
            overflow-y-auto
            rounded-xl
            border
            border-slate-200
            bg-white
            p-1
            shadow-lg
            ${listboxClassName ?? ''}
          `}
        >
          {filteredOptions.length > 0 ? (filteredOptions.map((option, index) => {
            const isHighlighted = highlightedIndex === index;
            return (
              <li
                id={`${name}-option-${index}`}
                key={option.key}
                role="option"
                className={`
                    cursor-pointer
                    rounded-lg
                    px-3
                    py-2
                    text-sm
                    transition
                    ${ isHighlighted ? 'bg-blue-50 text-blue-700' : 'text-slate-700 hover:bg-slate-50' }
                    ${optionClassName ?? ''}
                `}
                onMouseDown={(event) => selectOption(option, event)}
                aria-selected={isHighlighted}
              >
                {resolve(option.label ?? option.value)}
              </li>
            )
          })): (
            <li className="px-3 py-2 text-sm text-slate-400">
              {resolve(noResultsText)}
            </li>
          )}
        </ul>
      ) : null }
    </div>
  )
})

Autocomplete.displayName = 'Autocomplete';

export default Autocomplete;
