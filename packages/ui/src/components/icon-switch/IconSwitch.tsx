'use client';

import React, { useMemo, useState } from 'react';

import { buildIconSwitchTheme } from '@fintech/theme';

import { useTranslationResolver } from '../../lang';
import { Icon } from '../../primitives';

import type { IconSwitchProps } from './types';

const IconSwitch = React.forwardRef<HTMLInputElement, IconSwitchProps>(({
  id,
  name,
  value,
  onIcon,
  offIcon,
  onLabel,
  offLabel,
  checked,
  defaultChecked = false,
  onChange,
  onCheckedChange,
  size = 'md',
  disabled = false,
  required = false,
  autoFocus = false,
  className,
  thumbClassName,
  containerClassName,
  ...inputProps
}, ref) => {
  const { resolveChildren } = useTranslationResolver();

  const [internalChecked, setInternalChecked] = useState<boolean>(defaultChecked);
  const isControlled = checked !== undefined;
  const resolvedChecked = isControlled ? checked : internalChecked;

  const theme = useMemo(
    () => buildIconSwitchTheme({ size, checked: resolvedChecked, disabled, className, thumbClassName }),
    [size, resolvedChecked, disabled, className, thumbClassName],
  );

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const nextChecked = event.target.checked;

    if (!isControlled) {
      setInternalChecked(nextChecked);
    }

    onChange?.(event);
    onCheckedChange?.(nextChecked, event);
  };

  const activeIcon = resolvedChecked ? onIcon : offIcon;
  const inactiveIcon = resolvedChecked ? offIcon : onIcon;
  const activeLabel = resolvedChecked ? onLabel : offLabel;
  const inactiveLabel = resolvedChecked ? offLabel : onLabel;

  return (
    <label
      className={`inline-flex items-center ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'} ${containerClassName ?? ''}`}
    >
      <input
        {...inputProps}
        id={id}
        ref={ref}
        type="checkbox"
        role="switch"
        name={name}
        value={value}
        checked={resolvedChecked}
        required={required}
        disabled={disabled}
        onChange={handleChange}
        className="sr-only"
        autoFocus={autoFocus}
        aria-checked={resolvedChecked}
        aria-label={activeLabel}
      />

      <span aria-hidden="true" className={theme.track}>
        {/* Ícone inativo: fica no trilho, no lado oposto ao thumb. */}
        <span
          className={`absolute inline-flex items-center justify-center ${theme.iconInactive} ${
            resolvedChecked ? 'left-1' : 'right-1'
          }`}
        >
          <Icon icon={inactiveIcon} aria-hidden="true" />
        </span>

        {/* Thumb deslizante com o ícone do estado ativo. */}
        <span className={theme.thumb}>
          <Icon icon={activeIcon} aria-hidden="true" className={theme.iconActive} />
        </span>
      </span>

      <span className="sr-only">
        {resolvedChecked ? resolveChildren(activeLabel) : resolveChildren(inactiveLabel)}
      </span>
    </label>
  );
});

IconSwitch.displayName = 'IconSwitch';

export default React.memo(IconSwitch);