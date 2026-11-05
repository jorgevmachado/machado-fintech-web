'use client';
import React ,{ useState ,useCallback ,useMemo } from 'react';

import { buildNavbarTheme ,TThemeTone } from '@fintech/theme';

import type { TIcon } from '@fintech/icons';

import { Icon, LanguageSwitcher } from '../../primitives';
import ThemeSwitcher, { type ThemeMode } from '../theme-switcher';

type NavbarProps = {
  tone?: TThemeTone;
  icon?: React.ReactNode | TIcon;
  title?: string;
  variant: ThemeMode;
  subtitle?: string;
  onToggleSidebar: () => void;
  isAuthenticated: boolean;
  onVariantChange?: (variant: ThemeMode) => void;
  withThemeSwitcher?: boolean;
  isSidebarCollapsed: boolean;
  withLanguageSwitch?: boolean;
};

export default function Navbar({
  tone = 'primary',
  icon,
  title,
  variant,
  subtitle,
  isAuthenticated,
  onToggleSidebar,
  onVariantChange,
  withThemeSwitcher,
  withLanguageSwitch,
  isSidebarCollapsed,
}: NavbarProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(isSidebarCollapsed);

  const handleToggleSidebar = useCallback(() => {
    onToggleSidebar();
    setSidebarCollapsed(!sidebarCollapsed);
  }, [onToggleSidebar, sidebarCollapsed]);

  const themes = useMemo(() => buildNavbarTheme(tone, variant), [tone, variant]);

  return (
    <header className={themes.header}>
      <div className="flex items-center gap-3.5">

        {isAuthenticated && (
          <button
            type="button"
            className={themes.button}
            onClick={handleToggleSidebar}
            aria-label={
              sidebarCollapsed
                ? 'navbar-expand-sidebar'
                : 'navbar-collapse-sidebar'
            }
          >
            {
              sidebarCollapsed
                ? <Icon icon="menu" size="2xl" />
                : <Icon icon="menu-open" size="2xl" />
            }
          </button>
        )}

        { icon && (
          <div
            className={themes.icon}
            aria-label="Navbar Logo"
          >
            <Icon icon={icon} />
          </div>
        )}

        <div className="flex flex-col gap-0.5">
          <h1 className={themes.title}>
            {title}
          </h1>

          <p className={themes.subtitle}>
            {subtitle}
          </p>

        </div>

      </div>

      {(withLanguageSwitch || withThemeSwitcher) && (
        <div className="flex items-center gap-2">
          {withLanguageSwitch && <LanguageSwitcher variant={variant} />}
          {withThemeSwitcher && (
            <ThemeSwitcher
              tone={tone}
              variant={variant}
              onChange={onVariantChange}
            />
          )}
        </div>
      )}

    </header>
  );
};