import React ,{ useCallback ,useMemo  } from 'react';

import { buildInputTheme } from '@fintech/theme';

import type { ColorInputProps } from './types';

import { Text } from '../../primitives';

function normalizeToPickerValue(value?: string): string {
  const normalized = value?.trim() ?? '';
  if (!normalized) {
    return '#000000';
  }

  const withPrefix = normalized.startsWith('#') ? normalized : `#${normalized}`;
  const plain = withPrefix.slice(1);

  if (/^[0-9A-Fa-f]{3}$/.test(plain)) {
    const expanded = plain
    .split('')
    .map((char) => `${char}${char}`)
    .join('');
    return `#${expanded.toUpperCase()}`;
  }

  if (/^[0-9A-Fa-f]{6}$/.test(plain)) {
    return `#${plain.toUpperCase()}`;
  }

  if (/^[0-9A-Fa-f]{8}$/.test(plain)) {
    return `#${plain.slice(0, 6).toUpperCase()}`;
  }

  return '#000000';
}

const ColorInput = React.forwardRef<HTMLInputElement, ColorInputProps>(({
  size = 'md',
  label,
  value,
  hidden = false,
  onBlur,
  variant = 'outline',
  onChange,
  disabled = false,
  readOnly,
  isInvalid = false,
  isLoading = false,
  fullWidth = true,
  className,
  helperText,
  onValueBlur,
  loadingText,
  placeholder = '#22C55E',
  errorMessage,
  onValueChange,
  uppercaseLabel = true,
  helperClassName,
  containerClassName,
  inputWrapperClassName,
 ...inputProps
}, ref) => {
  const pickerValue = normalizeToPickerValue(value);

  const resolvedPlaceholder = isLoading && loadingText ? loadingText : placeholder;

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
    onChange?.(event);
    onValueChange?.(value, name, event);
  }, [onChange, onValueChange]);

  const handleOnBlur = useCallback((event: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    onBlur?.(event);
    onValueBlur?.(value, name, event);
  }, [onBlur, onValueBlur]);

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
          <div className="flex items-center gap-2">
            <div className="relative h-10 w-12 shrink-0 overflow-hidden rounded-md border border-input bg-background">
              <div aria-hidden="true" className="absolute inset-0" style={{ backgroundColor: pickerValue }} />
              <input
                type="color"
                name={inputProps.name}
                value={pickerValue}
                disabled={disabled || readOnly}
                className="absolute inset-0 h-full w-full cursor-pointer opacity-0 disabled:cursor-not-allowed"
                onChange={handleOnChange}
                aria-label="Select Color"
              />
            </div>
            <div className={wrapperClassName}>
              <input
                {...inputProps}
                ref={ref}
                type="text"
                value={value}
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
                spellCheck={false}
                autoComplete="off"
              />

              {isLoading ? (
                <span
                  aria-hidden='true'
                  className='inline-block h-4 w-4 shrink-0 animate-spin rounded-full border-2 border-slate-400 border-t-transparent'
                />
              ) : null}
            </div>
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
  )
})

ColorInput.displayName = 'ColorInput';

export default ColorInput;