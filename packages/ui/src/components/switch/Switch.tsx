'use client';

import React ,{
  ChangeEvent ,
  InputHTMLAttributes ,
  useMemo ,
  useState,
} from 'react';
import {
  SWITCH_SIZE_CLASS_MAP ,SWITCH_TONE_CLASS_MAP ,
  TReducedSize ,
  TSwitchLabelPosition ,
  TSwitchVariation ,
  TTone ,
} from '@fintech/theme';

import { Text } from '../../primitives';

type SwitchProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size' | 'onChange'> & {
  size?: TReducedSize;
  tone?: TTone;
  label?: React.ReactNode | string;
  variant?: TSwitchVariation;
  loading?: boolean;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  fullWidth?: boolean;
  description?: React.ReactNode | string;
  loadingLabel?: string;
  checkedLabel?: React.ReactNode | string;
  labelPosition?: TSwitchLabelPosition;
  uncheckedLabel?: React.ReactNode | string;
  labelClassName?: string;
  thumbClassName?: string;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean, event: ChangeEvent<HTMLInputElement>) => void;
  switchClassName?: string;
  containerClassName?: string;
  descriptionClassName?: string;
}

const buildStatusText = (
  checked?: boolean,
  checkedLabel?: React.ReactNode | string,
  uncheckedLabel?: React.ReactNode | string,
) => {
  if (checked) {
    return checkedLabel ?? null;
  }

  return uncheckedLabel ?? null;
};

const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(({
  id,
  name,
  size = 'md',
  tone = 'primary',
  label,
  value,
  variant = 'solid',
  loading = false,
  checked,
  onChange,
  disabled = false,
  readOnly = false,
  required = false,
  autoFocus = false,
  fullWidth = false,
  description,
  loadingLabel = 'Loading...',
  checkedLabel,
  labelPosition = 'end',
  uncheckedLabel,
  labelClassName,
  thumbClassName,
  defaultChecked = false,
  onCheckedChange,
  switchClassName,
  containerClassName,
  descriptionClassName,
  ...inputProps
}, ref) => {
  const [internalChecked, setInternalChecked] = useState<boolean>(defaultChecked);
  const isControlled = checked !== undefined;
  const resolvedChecked = isControlled ? checked : internalChecked;
  const isDisabled = disabled || loading || readOnly;

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const nextChecked = event.target.checked;

    if (!isControlled) {
      setInternalChecked(nextChecked);
    }

    onChange?.(event);
    onCheckedChange?.(nextChecked, event);
  };

  const sizeClassName = useMemo(() => {
    return SWITCH_SIZE_CLASS_MAP[size];
  }, [size]);

  const toneClassName = useMemo(() => {
    return SWITCH_TONE_CLASS_MAP[tone];
  }, [tone]);

  const statusText = useMemo(() => {
    if (loading) {
      return loadingLabel;
    }
    return buildStatusText(resolvedChecked, checkedLabel, uncheckedLabel);
  }, [checkedLabel, loading, loadingLabel, resolvedChecked, uncheckedLabel]);

  const textContent = (
    <span className={`flex min-w-0 flex-col ${labelClassName}`}>
      {label ? (
        <Text size='sm' weight='semibold' color='text-slate-800'>
          {label}
        </Text>
      ) : null}
      {description ? (
        <Text size='xs' color='text-slate-500' className={descriptionClassName}>
          {description}
        </Text>
      ) : null}
    </span>
  );

  return (
    <div className={
      `flex
       items-center 
       gap-3
       ${ fullWidth && 'w-full' }
       ${labelPosition === 'start' ? 'justify-between' : 'justify-start'}
       ${containerClassName}
      `
    }>
      {labelPosition === 'start' ? textContent : null}
      <label
        className={`
        inline-flex
        items-center
        gap-2
        ${isDisabled ? 'cursor-not-allowed opacity-70' : 'cursor-pointer'}
        `}
      >
        <input
          {...inputProps}
          id={id}
          ref={ref}
          type='checkbox'
          role='switch'
          name={name}
          value={value}
          checked={resolvedChecked}
          required={required}
          disabled={isDisabled}
          onChange={handleChange}
          className='sr-only'
          autoFocus={autoFocus}
          aria-busy={loading || undefined}
          aria-readonly={readOnly || undefined}
        />
        <span
          aria-hidden='true'
          className={ `
          inline-flex
          shrink-0
          items-center
          rounded-full
          transition-colors
          duration-200
          focus-within:ring-2
          focus-within:ring-offset-2 
          ${sizeClassName.track}
          ${toneClassName.ring}
          ${variant === 'outline' ? `border bg-transparent ${toneClassName.border}` : 'border border-transparent'}
          ${resolvedChecked ? toneClassName.on : toneClassName.off}
          ${switchClassName}
          ` }
        >
          <span
            className={`
              inline-block              
              rounded-full
              bg-white
              shadow
              transition-transform
              duration-200
              ${sizeClassName.thumb}
              ${resolvedChecked ? sizeClassName.translate : 'translate-x-0'}
              ${thumbClassName}
            `}
          />
        </span>
        {statusText ? (
          <Text size='xs' color='text-slate-600'>
            {statusText}
          </Text>
        ) : null}
      </label>
      {labelPosition === 'end' ? textContent : null}
    </div>
  );
});

Switch.displayName = 'Switch';

export default React.memo(Switch);
