'use client';

import React ,{ useCallback ,useMemo } from 'react';

import { buildInputTheme } from '@fintech/theme';

import { Text } from '../../primitives';

import type { SelectProps } from './types';
import { useTranslationResolver } from '../../lang';

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(({
  size = 'md',
  label,
  value,
  onBlur,
  hidden = false,
  variant = 'outline',
  options,
  onChange,
  disabled = false,
  fullWidth = true,
  className,
  isInvalid = false,
  isLoading = false,
  helperText,
  placeholder,
  loadingText,
  onValueBlur,
  errorMessage,
  onValueChange,
  uppercaseLabel = true,
  helperClassName,
  containerClassName,
  inputWrapperClassName,
  ...props
}, ref) => {
  const { resolve } = useTranslationResolver();

  const wrapperClassName = useMemo(() => {
    const classNamesList = buildInputTheme({
      size,
      variant,
      isInvalid,
      disabled,
      fullWidth,
      className: inputWrapperClassName,
    })
    return classNamesList.filter(Boolean).join(' ');
  }, [disabled, fullWidth, inputWrapperClassName, isInvalid, size, variant]);

  const handleOnChange = useCallback((event: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = event.target;
    onChange?.(event);
    onValueChange?.(value, name, event);
  }, [onChange, onValueChange]);

  const handleOnBlur = useCallback((event: React.FocusEvent<HTMLSelectElement>) => {
    const { name, value } = event.target;
    onBlur?.(event);
    onValueBlur?.(value, name, event);
  }, [onBlur, onValueBlur]);

  const resolvedPlaceholder = isLoading && loadingText ? loadingText : placeholder;

  return (
    <div className={`${hidden ? 'hidden' : ''}`}>
      <label className="flex flex-col gap-1.5">
        { label && (
          <Text
            size="xs"
            color={isInvalid ? 'text-red-600' : 'text-slate-600'}
            weight="semibold"
            tracking="wide"
            className={uppercaseLabel ? 'uppercase' : ''}>
            { label }
          </Text>
        )}
        <div className={`${fullWidth && 'w-full'} ${containerClassName}`}>
          <div className={wrapperClassName}>
            <select
              {...props}
              ref={ref}
              value={value}
              disabled={disabled || isLoading}
              aria-invalid={isInvalid || undefined}
              aria-busy={isLoading || undefined}
              className={`
                w-full
                bg-transparent
                outline-none
                disabled:cursor-not-allowed
                ${className ?? ''}
              `}
              onBlur={handleOnBlur}
              onChange={handleOnChange}
            >
              {resolvedPlaceholder ? (
                <option value="" disabled>
                  {resolvedPlaceholder}
                </option>
              ) : null}

              {options.map((option) => (
                <option
                  key={option.value}
                  value={option.value}
                  disabled={option.disabled}
                >
                  {resolve(option.label)}
                </option>
              ))}
            </select>
          </div>
          {errorMessage ? (
            <p className={ `mt-1 text-xs font-medium text-red-600 ${helperClassName}`} role='alert'>
              {resolve(errorMessage)}
            </p>
          ) : null}

          {!errorMessage && helperText ? (
            <p className={ `mt-1 text-xs text-slate-500 ${helperClassName}`}>
              {resolve(helperText)}
            </p>
          ) : null}
        </div>
      </label>
    </div>
  )
});

Select.displayName = 'Select';

export default React.memo(Select);
