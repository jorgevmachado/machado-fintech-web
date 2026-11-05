'use client';

import React ,{ useMemo } from 'react';

import type { BuildSidebarThemeResult } from '@fintech/theme';

import type { TIcon } from '@fintech/icons';

import { Icon } from '../../../primitives';

import { useTranslationResolver } from '../../../lang';

type TMenuItemChildren = {
  href: string;
  icon: React.ReactNode | TIcon;
  label: string;
}

export type TMenuItem = TMenuItemChildren & {
  children?: Array<TMenuItemChildren>;
  disabled?: boolean;
}

export type MenuItemClassNames = Omit<BuildSidebarThemeResult, 'text' | 'aside' | 'buttonLogout'>;

type MenuItemProps = TMenuItem & {
  pathname: string;
  onItemClick: (item: TMenuItem) => void;
  isCollapsed: boolean;
  expandedItems: Record<string ,boolean>;
  toggleExpanded: (href: string) => void;
  menuItemClassNames: MenuItemClassNames;
}

export default function MenuItem({
  href ,
  icon ,
  label ,
  children ,
  pathname ,
  disabled,
  onItemClick ,
  isCollapsed,
  expandedItems ,
  toggleExpanded,
  menuItemClassNames,
}: MenuItemProps) {

  const { resolve } = useTranslationResolver()

  const hasChildren = Boolean(children?.length);

  const hasActiveChild = children?.some((child) => pathname === child.href ||
    pathname.startsWith(`${ child.href }/`)) ?? false;

  const isActive = pathname === href || hasActiveChild;

  const isExpanded = hasActiveChild || Boolean(expandedItems[href]);

  const buttonItemClassName = useMemo(() => {
    return `${menuItemClassNames.buttonItem} ${disabled ? '' : 'cursor-pointer'} ${ isActive ? menuItemClassNames.buttonItemActive : '' }`;
  }, [disabled, isActive, menuItemClassNames.buttonItem, menuItemClassNames.buttonItemActive])

  return (
    <div className="flex flex-col gap-1">
      <div className="flex w-full items-stretch gap-1.5">
        <button
          type="button"
          onClick={() => onItemClick({ href, icon, label })}
          disabled={disabled}
          className={buttonItemClassName}
          aria-current={pathname === href ? 'page' : undefined}
          title={isCollapsed ? label : undefined}
        >
          <span className="flex shrink-0 items-center" aria-hidden="true">
            <Icon icon={icon} />
          </span>
          {!isCollapsed && (
            <span className="overflow-hidden text-ellipsis">{label}</span>
          )}
        </button>
        {hasChildren && !isCollapsed && (
          <button
            type="button"
            onClick={() => toggleExpanded(href)}
            className={menuItemClassNames.buttonChildren}
            aria-label={
              isExpanded
                ? `Navigation Collapse Section ${ label }`
                : `Navigation Expand Section ${ label }`
            }
          >
            <Icon icon="chevron-down" className={`transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}/>
          </button>
        )}
      </div>
      {hasChildren && children && !isCollapsed && isExpanded && (
        <div className={menuItemClassNames.buttonChildContent}>
          {children.map(
            ({
              href: childHref,
              label: childLabel,
              icon: childIcon,
            }) => {
              const isChildActive =
                pathname === childHref ||
                pathname.startsWith(`${childHref}/`);

              return (
                <button
                  type="button"
                  key={childHref}
                  onClick={() => onItemClick({ href: childHref, icon: childIcon, label: childLabel })}
                  className={`${menuItemClassNames.buttonChild} ${ isChildActive ? menuItemClassNames.buttonChildActive : '' }`}
                  aria-current={
                    isChildActive ? 'page' : undefined
                  }
                >
                          <span
                            className="flex shrink-0 items-center"
                            aria-hidden="true"
                          >
                            <Icon icon={childIcon}/>
                          </span>

                  <span className="overflow-hidden text-ellipsis">
                            {resolve(childLabel)}
                          </span>
                </button>
              );
            },
          )}
        </div>
      )}
    </div>
  );
}
