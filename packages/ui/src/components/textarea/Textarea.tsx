'use client';

import React, {
  useId,
  useMemo,
  useCallback,
  useEffect,
  useState,
} from 'react';

import { Icon ,Text } from '../../primitives';

import type { TextareaProps } from './types';

const normalizeTextareaValue = (currentValue: TextareaProps['value'] | TextareaProps['defaultValue']) => {
  if (typeof currentValue === 'string') {
    return currentValue;
  }

  if (typeof currentValue === 'number') {
    return String(currentValue);
  }

  if (Array.isArray(currentValue)) {
    return currentValue.join('');
  }

  return '';
};

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(({
  size = 'md',
  label,
  value,
  hidden = false,
  onBlur,
  onClear,
  variant = 'outline',
  onChange,
  disabled = false,
  readOnly,
  isInvalid = false,
  isLoading = false,
  fullWidth = true,
  minLength,
  maxLength,
  className,
  helperText,
  onValueBlur,
  placeholder,
  leadingIcon,
  loadingText,
  trailingIcon,
  errorMessage,
  onValueChange,
  uppercaseLabel = true,
  helperClassName,
  showClearButton = false,
  showCharacterCount = false,
  containerClassName,
  clearButtonAriaLabel,
  inputWrapperClassName,
  ...textareaProps
}, ref) => {
  // Reserved props are consumed here so they are not forwarded to the DOM.
  void variant;
  void loadingText;
  const textareaId = useId();

  const errorId = `${textareaId}-error`;
  const helperId = `${textareaId}-helper`;
  const characterCountId = `${textareaId}-character-count`;

  const isControlled = value !== undefined;
  const initialValue = useMemo(() => {
    return normalizeTextareaValue(
      isControlled ? value : textareaProps.defaultValue,
    );
  }, [isControlled, textareaProps.defaultValue, value]);
  const [uncontrolledValue, setUncontrolledValue] = useState(initialValue);

  useEffect(() => {
    if (isControlled) {
      setUncontrolledValue(normalizeTextareaValue(value));
    }
  }, [isControlled, value]);

  const currentValue = isControlled
    ? normalizeTextareaValue(value)
    : uncontrolledValue;

  const characterCount = currentValue.length;

  const hasValue = typeof value === 'string' && value.length > 0;
  const shouldShowClearButton = showClearButton && hasValue && !isLoading && !disabled && !readOnly;

  const wrapperClassName = useMemo(() => {
    return [
      'relative',
      'flex',
      'w-full',
      'rounded-md',
      'border',
      'bg-[color:var(--app-surface,#ffffff)]',
      'transition-colors',
      'min-h-0',
      'items-stretch',
      isInvalid
        ? 'border-[color:var(--app-negative,#dc2626)] ring-1 ring-[color:var(--app-negative-soft,rgba(220,38,38,0.10))]'
        : 'border-[color:var(--app-border,#e2e8f0)]',
      disabled
        ? 'cursor-not-allowed bg-[color:var(--app-surface-muted,#f1f5f9)]'
        : 'bg-[color:var(--app-surface,#ffffff)]',

      inputWrapperClassName,
    ]
    .filter(Boolean)
    .join(' ');
  }, [
    disabled,
    isInvalid,
    inputWrapperClassName,
  ]);

  const textareaSizeClassName = useMemo(() => {
    if (size === 'sm') {
      return 'min-h-20 px-3 py-2 text-sm leading-5';
    }

    if (size === 'lg') {
      return 'min-h-32 px-4 py-3 text-base leading-7';
    }

    return 'min-h-24 px-3 py-2.5 text-sm leading-6';
  }, [size]);

  const describedBy = useMemo(() => {
    const ids: string[] = [];

    if (errorMessage) {
      ids.push(errorId);
    } else if (helperText) {
      ids.push(helperId);
    }

    if (
      showCharacterCount &&
      (minLength !== undefined || maxLength !== undefined)
    ) {
      ids.push(characterCountId);
    }

    return ids.length > 0 ? ids.join(' ') : undefined;
  }, [
    characterCountId,
    errorId,
    errorMessage,
    helperId,
    helperText,
    maxLength,
    minLength,
    showCharacterCount,
  ]);

  const handleOnChange = useCallback((event: React.ChangeEvent<HTMLTextAreaElement>) => {
      const { name, value } = event.target;

      if (!isControlled) {
        setUncontrolledValue(value);
      }

      onChange?.(event);
      onValueChange?.(value, name, event);
    },
    [isControlled, onChange, onValueChange],
  );

  const handleOnBlur = useCallback((event: React.FocusEvent<HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    onBlur?.(event);
    onValueBlur?.(value, name, event);
  }, [onBlur, onValueBlur]);

  const handleClear = useCallback(() => {
    onClear?.();
  }, [onClear]);

  return (
    <div className={hidden ? 'hidden' : undefined}>
      <label className="flex flex-col gap-1.5">
        {label ? (
          <Text
            size="xs"
            color={isInvalid ? 'text-[color:var(--app-negative-strong,#991b1b)]' : 'text-[color:var(--app-text-subtle,#475569)]'}
            weight="semibold"
            tracking="wide"
            className={uppercaseLabel ? 'uppercase' : ''}
          >
            {label}
          </Text>
        ) : null}

        <div className={`${fullWidth ? 'w-full' : ''} ${containerClassName ?? ''}`}>
          <div className={wrapperClassName}>
            {leadingIcon ? (
              <Icon icon={leadingIcon} aria-hidden="true" className="inline-flex shrink-0 text-[color:var(--app-text-muted,#64748b)]"/>
            ) : null}
            <textarea
              {...textareaProps}
              id={textareaProps.id ?? textareaId}
              ref={ref}
              value={value}
              disabled={disabled}
              readOnly={readOnly}
              placeholder={placeholder}
              minLength={minLength}
              maxLength={maxLength}
              aria-invalid={isInvalid || undefined}
              aria-busy={isLoading || undefined}
              aria-describedby={describedBy}
              className={`
                block
                w-full
                flex-1
                resize-y
                border-0
                bg-transparent
                outline-none
                placeholder:text-[color:var(--app-text-muted,#64748b)]
                disabled:cursor-not-allowed
                disabled:opacity-50
                ${textareaSizeClassName}

                ${className ?? ''}
              `}
              onBlur={handleOnBlur}
              onChange={handleOnChange}
            />

            {isLoading ? (
              <span
                aria-hidden="true"
                className="
                  absolute
                  right-3
                  top-3
                  inline-block
                  h-4
                  w-4
                  animate-spin
                  rounded-full
                  border-2
                  border-[color:var(--app-text-muted,#64748b)]
                  border-t-transparent
                "
              />
            ) : null}

            {shouldShowClearButton ? (
              <button
                type='button'
                aria-label={clearButtonAriaLabel}
                onClick={handleClear}
                className='inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[color:var(--app-text-muted,#64748b)] transition hover:bg-[color:var(--app-surface-muted,#f1f5f9)] hover:text-[color:var(--app-text,#0f172a)]'
              >
                <Icon icon="close" group="md" aria-hidden="true"/>
              </button>
            ) : null}

            {!isLoading && !shouldShowClearButton && trailingIcon ? (
              <Icon icon={trailingIcon} aria-hidden="true" className="inline-flex shrink-0 text-[color:var(--app-text-muted,#64748b)]"/>
            ) : null}

          </div>

          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              {errorMessage ? (
                <p
                  id={errorId}
                  className={`mt-1 text-xs font-medium text-[color:var(--app-negative-strong,#991b1b)] ${helperClassName ?? ''}`}
                  role="alert"
                >
                  {errorMessage}
                </p>
              ) : null}

              {!errorMessage && helperText ? (
                <p
                  id={helperId}
                  className={`mt-1 text-xs text-[color:var(--app-text-muted,#64748b)] ${helperClassName ?? ''}`}
                >
                  {helperText}
                </p>
              ) : null}
            </div>

            {showCharacterCount &&
            (minLength !== undefined || maxLength !== undefined) ? (
              <span
                id={characterCountId}
                className={`
                  mt-1
                  shrink-0
                  text-xs
                  ${
                  maxLength !== undefined && characterCount >= maxLength
                    ? 'text-[color:var(--app-negative-strong,#991b1b)]'
                    : 'text-[color:var(--app-text-muted,#64748b)]'
                }
                `}
              >
                {characterCount}
                {maxLength !== undefined ? ` / ${maxLength}` : ''}
              </span>
            ) : null}
          </div>
        </div>
      </label>
    </div>
  );
});

Textarea.displayName = 'Textarea';

export default React.memo(Textarea);
