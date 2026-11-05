'use client';

import React, { useMemo, useCallback, useState } from 'react';
import { Money ,Mask } from '@fintech/shared';
import { buildInputTheme } from '@fintech/theme';

import { Text, Icon } from '../../primitives';

import type { InputProps } from './types';
import { useAppTranslation } from '@fintech/i18n';

const Input = React.forwardRef<HTMLInputElement, InputProps>(({
  mask,
  size = 'md',
  type,
  label,
  value,
  hidden = false,
  onBlur,
  variant = 'outline',
  onClear,
  onChange,
  disabled = false,
  readOnly,
  isInvalid = false,
  isLoading = false,
  fullWidth = true,
  className,
  helperText,
  onValueBlur,
  leadingIcon,
  loadingText,
  placeholder,
  trailingIcon,
  errorMessage,
  onValueChange,
  switchLanguage,
  uppercaseLabel = true,
  helperClassName,
  showClearButton = false,
  containerClassName,
  clearButtonAriaLabel = 'Clear input',
  inputWrapperClassName,
  ...inputProps
}, ref) => {
  const { locale } = useAppTranslation();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const hasValue = typeof value === 'string' && value.length > 0;
  const isMoneyInput = type === 'money';
  const isPasswordInput = type === 'password';

  const inputType = useMemo(() => {
    if(type === 'money' || type === 'name') {
      return 'text';
    }

    if(isPasswordInput) {
      return showPassword ? 'text' : 'password';
    }

    return type;
  }, [type, isPasswordInput, showPassword]);

  const resolvedPlaceholder = isLoading && loadingText ? loadingText : placeholder;

  const shouldShowClearButton = showClearButton && hasValue && !isLoading && !disabled && !readOnly;

  const resolvedMask: Mask | undefined = useMemo(() => {
    if(!mask) {
      return undefined;
    }
    if(mask instanceof Mask) {
      return mask;
    }

    return new Mask(mask);
  }, [mask]);

  const formattedValue = useMemo(() => {
    if (typeof value !== 'string') {
      return value;
    }

    if (isMoneyInput) {
      return  value !== '' ? Money.tryCreate(value, { locale: switchLanguage ?? locale }).instance.formatted : '';
    }

    return resolvedMask?.format(value) ?? value;

  }, [isMoneyInput, locale, resolvedMask, value, switchLanguage]);

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

  const handleOnChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    const nextRawValue = value;
    const nextValue = isMoneyInput
      ? nextRawValue !== '' ? Money.tryCreate(nextRawValue, { locale: switchLanguage ?? locale }).instance.formatted : ''
      : resolvedMask?.format(nextRawValue) ?? nextRawValue;

    if (nextValue !== nextRawValue) {
      event.target.value = nextValue;
    }

    onChange?.(event);
    onValueChange?.(nextValue, name, event);
  }, [isMoneyInput, locale, resolvedMask, onChange, onValueChange, switchLanguage]);

  const handleOnBlur = useCallback((event: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    onBlur?.(event);
    onValueBlur?.(value, name, event);
  }, [onBlur, onValueBlur]);

  const handleClear = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    onClear?.(event);
  }, [onClear]);

  const handleTogglePasswordVisibility = useCallback(() => {
    setShowPassword((current) => !current);
  }, []);

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
            {leadingIcon ? (
              <Icon icon={leadingIcon} aria-hidden="true" className="inline-flex shrink-0 text-slate-500"/>
            ) : null}

            <input
              {...inputProps}
              ref={ref}
              type={inputType}
              inputMode={isMoneyInput ? 'decimal' : inputProps.inputMode}
              value={formattedValue}
              disabled={disabled}
              readOnly={readOnly}
              placeholder={resolvedPlaceholder}
              aria-invalid={isInvalid || undefined}
              aria-busy={isLoading || undefined}
              className={
              `w-full
               bg-transparent
               outline-none
               placeholder:text-slate-400 
               disabled:cursor-not-allowed
               ${isInvalid && 'border-red-400 ring-red-100'}
                ${className}`
              }
              onBlur={handleOnBlur}
              onChange={handleOnChange}
            />

            {isLoading ? (
              <span
                aria-hidden='true'
                className='inline-block h-4 w-4 shrink-0 animate-spin rounded-full border-2 border-slate-400 border-t-transparent'
              />
            ) : null}

            {shouldShowClearButton ? (
              <button
                type='button'
                aria-label={clearButtonAriaLabel}
                onClick={handleClear}
                className='inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-slate-700'
              >
                <Icon icon="close" group="md" aria-hidden="true"/>
              </button>
            ) : null}

            {!isLoading && !shouldShowClearButton && isPasswordInput ? (
              <Icon
                icon={showPassword ? 'eye-close': 'eye'}
                role="button"
                tabIndex={0}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                onClick={handleTogglePasswordVisibility}
                className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"/>
            ) : null}

            {!isLoading && !shouldShowClearButton && trailingIcon && !isPasswordInput ? (
                <Icon icon={trailingIcon} aria-hidden="true" className="inline-flex shrink-0 text-slate-500"/>
            ) : null}
          </div>

          {errorMessage ? (
            <p className={ `mt-1 text-xs font-medium text-red-600 ${helperClassName}`} role='alert'>
              {errorMessage}
            </p>
          ) : null}

          {!errorMessage && helperText ? (
            <p className={ `mt-1 text-xs text-slate-500 ${helperClassName}`}>
              {helperText}
            </p>
          ) : null}
        </div>
      </label>
    </div>
  );
});

Input.displayName = 'Input';

export default React.memo(Input);
