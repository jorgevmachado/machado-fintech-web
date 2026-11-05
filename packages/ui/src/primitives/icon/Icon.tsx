'use client';

import React, { useMemo } from 'react';

import { TIcon, getIcon } from '@fintech/icons';

import type { IconProps } from './types';

export default function Icon({
  icon,
  size,
  tone,
  group,
  className,
  withDefault,
  iconClassName ,
  'aria-label': explicitAriaLabel,
  ...props
}: IconProps) {

  const ariaLabel = useMemo(() => {
    if(explicitAriaLabel) {
      return explicitAriaLabel;
    }
    if (typeof icon === 'string') {
      return icon;
    }
    return undefined;
  }, [icon, explicitAriaLabel]);

  const currentData = useMemo(() => {
    if (typeof icon === 'string') {
      return getIcon({ name: icon as TIcon, size, tone, group, className: iconClassName, withDefault });
    }
    return {
      icon,
      group,
    }
  }, [icon, size, tone, group, iconClassName, withDefault]);

  const dataTestId = useMemo(() => {
    if (typeof icon === 'string') {
      return `icon-${currentData.group}-${icon}`;
    }

    return 'icon-custom';
  }, [icon, currentData.group]);

  return (
    <span
      {...props}
      className={ `inline-block align-top ${className ?? ''}` }
      aria-label={ ariaLabel }
      data-group={ currentData.group }
      data-testid={ dataTestId }
    >
      { currentData.icon }
    </span>
  );
};
