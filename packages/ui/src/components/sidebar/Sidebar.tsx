'use client';
import React ,{ useMemo ,useState } from 'react';

import {
  buildSidebarTheme ,
  type TThemeTone ,
} from '@fintech/theme';

import { Icon } from '../../primitives';

import { ThemeMode } from '../theme-switcher';

import { MenuItem, type TMenuItem } from './menu-item';


type SidebarProps = {
  tone?: TThemeTone;
  items: Array<TMenuItem>;
  logout: {
    label: string;
    onClick: () => void;
  };
  variant: ThemeMode;
  pathname: string;
  onItemClick: (item: TMenuItem) => void;
  isCollapsed: boolean;
}

export default function Sidebar({ tone = 'primary', items, logout, variant, pathname, onItemClick, isCollapsed }: SidebarProps) {
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});

  const themes = useMemo(() => buildSidebarTheme(tone, variant), [tone, variant]);

  const toggleExpanded = (href: string) => {
    setExpandedItems((previousState) => ({
      ...previousState,
      [href]: !previousState[href],
    }));
  };

  return (
    <aside className={themes.aside} aria-label="Sidebar">
      <nav className="flex flex-1 flex-col gap-2" aria-label="Navigation Authentication">
        {items.map((item, index) => (
            <MenuItem
              key={`${item.href}-${index}`}
              {...item}
              pathname={pathname}
              onItemClick={onItemClick}
              isCollapsed={isCollapsed}
              expandedItems={expandedItems}
              toggleExpanded={toggleExpanded}
              menuItemClassNames={{
                buttonItem: themes.buttonItem,
                buttonChild: themes.buttonChild,
                buttonChildren: themes.buttonChildren,
                buttonItemActive: themes.buttonItemActive,
                buttonChildActive: themes.buttonChildActive,
                buttonChildContent: themes.buttonChildContent,
              }}
            />
          ))}
      </nav>

      <button
        type="button"
        className={themes.buttonLogout}
        onClick={logout.onClick}
        aria-label={logout.label}
        title={isCollapsed ? logout.label : undefined}
      >
        <span className="flex shrink-0 items-center" aria-hidden="true">
          <Icon icon="logout" />
        </span>

        {!isCollapsed && (
          <span className="overflow-hidden text-ellipsis">
            { logout.label }
          </span>
        )}

      </button>
    </aside>
  );
};