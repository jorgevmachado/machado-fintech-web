'use client';
import React ,{ useCallback ,useState, useMemo } from 'react';

import { TThemeTone } from '@fintech/theme';

import type { TIcon } from '@fintech/icons';

import { useAppTranslation } from '@fintech/i18n';

import type { ThemeMode } from '../theme-switcher';

import { Navbar } from '../navbar';
import { Sidebar, type TMenuItem } from '../sidebar';

type NavigationProps = {
  tone?: TThemeTone;
  menu: Array<TMenuItem>;
  title?: string;
  logout: {
    label: string;
    onClick: () => void;
  };
  variant: ThemeMode;
  iconLogo?: React.ReactNode | TIcon;
  subtitle?: string;
  children: React.ReactNode;
  pathname: string;
  onItemClick: (item: TMenuItem) => void;
  isAuthenticated: boolean;
  withThemeSwitcher?: boolean;
  withLanguageSwitch?: boolean;
}

export default function Navigation({
  tone = 'primary',
  menu,
  title,
  logout,
  subtitle,
  iconLogo,
  variant,
  children,
  pathname,
  onItemClick,
  isAuthenticated,
  withThemeSwitcher,
  withLanguageSwitch,
}: NavigationProps) {
  const { t } = useAppTranslation();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);

  const [themeMode, setThemeMode] = useState<ThemeMode>(variant);

  const isSidebarVisible = isAuthenticated && !isSidebarCollapsed;

  const handleToggleSidebar = useCallback(() => {
    setIsSidebarCollapsed((prev) => !prev);
  }, []);

  const translatedMenu = useMemo(() => {
    if(!withLanguageSwitch) {
      return menu;
    }
    return menu.map((item) => ({...item, label: t(item.label)}))
  }, [t, menu, withLanguageSwitch]);

  const translatedTitle = useMemo(() => {
    if(!title) {
      return;
    }
    if(!withLanguageSwitch) {
      return title;
    }
    return t(title);
  }, [t, title, withLanguageSwitch]);

  const translatedSubtitle = useMemo(() => {
    if(!subtitle) {
      return;
    }
    if(!withLanguageSwitch) {
      return subtitle;
    }
    return t(subtitle);
  }, [t, subtitle, withLanguageSwitch]);

  const translatedLogout = useMemo(() => {
    if (!withLanguageSwitch) {
      return logout;
    }
    return {
      ...logout,
      label: t(logout.label),
    }
  }, [t, logout, withLanguageSwitch]);

  return (
    <div
      className="
        grid
        min-h-screen
        grid-rows-[auto_1fr]
        bg-[radial-gradient(900px_500px_at_100%_-5%,rgba(250,204,21,0.18),transparent_55%),radial-gradient(800px_460px_at_-10%_100%,rgba(37,99,235,0.14),transparent_52%),var(--background)]
      "
    >
      <Navbar
        tone={tone}
        icon={iconLogo}
        title={translatedTitle}
        variant={themeMode}
        subtitle={translatedSubtitle}
        isAuthenticated={isAuthenticated}
        onVariantChange={(value) => setThemeMode(value)}
        onToggleSidebar={handleToggleSidebar}
        withThemeSwitcher={withThemeSwitcher}
        withLanguageSwitch={withLanguageSwitch}
        isSidebarCollapsed={isSidebarCollapsed}
      />

      <div
        className={`
          relative
          min-h-[calc(100vh-72px)]
          ${
          isAuthenticated
            ? 'flex'
            : 'block'
        }
        `}
      >
        {isAuthenticated && (
          <Sidebar
            tone={tone}
            items={translatedMenu}
            variant={themeMode}
            isCollapsed={isSidebarCollapsed}
            pathname={pathname}
            logout={translatedLogout}
            onItemClick={onItemClick}
          />
        )}

        {isSidebarVisible && (
          <button
            type="button"
            className="
              fixed
              inset-x-0
              top-[72px]
              bottom-0
              z-[95]
              cursor-pointer
              border-0
              bg-[rgba(15,23,42,0.42)]
              backdrop-blur-[1px]
              min-[901px]:hidden
            "
            aria-label="Navigation Close Sidebar"
            onClick={handleToggleSidebar}
          />
        )}
        <main
          className="
            min-w-0
            flex-1
            p-[clamp(20px,2.2vw,36px)]
            max-[900px]:p-4
          "
        >
          {children}
        </main>
      </div>
    </div>
  );
};