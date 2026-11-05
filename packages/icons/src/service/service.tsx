import React from 'react';

import { type TTone, type TSize, TEXT_SIZE_CLASS_MAP, TEXT_TONE_CLASS_MAP } from '@fintech/theme';

import {
  faGroup,
  ICON_GROUPS,
  type TIconGroup
} from '../groups';

import type { TIcon } from '../types';

const DEFAULT_ICON = faGroup.react;

interface GetIconParams {
  name: TIcon;
  size?: TSize;
  tone?: TTone;
  group?: TIconGroup;
  className?: string;
  withDefault?: boolean;
}

interface GetIconResult {
  icon?: React.ReactNode;
  group?: TIconGroup;
}

function getIconInAllGroups(name: TIcon): GetIconResult {
  for (const [group, icons] of Object.entries(ICON_GROUPS)) {
    const icon = icons[name];
    if (icon) {
      return { icon, group: group as TIconGroup };
    }
  }
  return { icon: undefined, group: undefined };
}

function getIconByDefaultGroup(name: TIcon): GetIconResult {
  const iconDefaultGroup = ICON_GROUPS['fa'][name];

  if (!iconDefaultGroup) {
    return getIconInAllGroups(name);
  }
  return {
    icon: iconDefaultGroup,
    group: 'fa',
  };
}

function getIconByGroup(name: TIcon, group: TIconGroup, withDefault: boolean): GetIconResult {
  const iconByGroup = ICON_GROUPS[group][name];
  if (!iconByGroup) {
    return withDefault ? getIconInAllGroups(name) : { icon: undefined, group: undefined};
  }
  return {
    icon: iconByGroup,
    group,
  };
}

function buildWithCustomProps(
  IconComponent: React.ComponentType | React.ReactNode,
  size: TSize = 'base',
  tone?: TTone,
  className?: string,
) {
  const classSize = TEXT_SIZE_CLASS_MAP[size] || '';
  const classTone = !tone ? '' : TEXT_TONE_CLASS_MAP[tone] || '';
  const currentClassName = `${className || ''} ${classSize} ${classTone}`;
  if (React.isValidElement(IconComponent)) {
    return React.cloneElement(IconComponent as React.ReactElement<{ className: string }>, { className: currentClassName });
  }
  if (typeof IconComponent === 'function' || typeof IconComponent === 'object') {
    const Component = IconComponent as React.ComponentType<{ className: string }>;
    return <Component className={currentClassName} />;
  }
  return IconComponent;
}


export function getIcon({ name, size, tone, group, className, withDefault = true }: GetIconParams): GetIconResult {
  const { icon, group: iconGroup } = !group
    ? getIconByDefaultGroup(name)
    : getIconByGroup(name, group, withDefault);

  if (icon) {
    return {
      icon: buildWithCustomProps(icon, size, tone, className),
      group: iconGroup,
    };
  }

  if(!withDefault) {
    return {
      icon: undefined,
      group: undefined,
    };
  }

  return {
    icon: DEFAULT_ICON,
    group: 'fa',
  };
}