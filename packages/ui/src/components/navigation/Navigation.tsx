'use client';
import React ,{ useCallback ,useEffect ,useState, useMemo ,useSyncExternalStore } from 'react';

import { buildNavigationTheme ,TThemeTone } from '@fintech/theme';

import type { TIcon } from '@fintech/icons';

import { useAppTranslation } from '@fintech/i18n';

import {
  DEFAULT_THEME,
  getThemeServerSnapshot,
  getThemeSnapshot,
  persistTheme,
  subscribeTheme,
} from '../theme-switcher/theme-storage';
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

  /**
   * O shell é o dono do tema: o `ThemeSwitcher` que ele renderiza é controlado,
   * então só ele decide o valor e persiste a escolha.
   *
   * A preferência vem de `useSyncExternalStore` e não de um `setState` em
   * efeito: no servidor o snapshot é `undefined` (renderiza o `variant` do
   * SSR) e, na hidratação, o React relê o storage sem mismatch nem render em
   * cascata. Sem isso, um reload perderia a preferência — o switcher controlado
   * gravaria o `variant` da prop por cima da escolha salva.
   */
  const storedTheme = useSyncExternalStore(
    subscribeTheme,
    getThemeSnapshot,
    getThemeServerSnapshot,
  );
  const [selectedTheme, setSelectedTheme] = useState<ThemeMode | undefined>(undefined);
  const themeMode = selectedTheme ?? storedTheme ?? variant ?? DEFAULT_THEME;

  const handleThemeChange = useCallback((nextTheme: ThemeMode) => {
    setSelectedTheme(nextTheme);
    persistTheme(nextTheme);
  }, []);

  /**
   * Publica o tema no `<html>` mesmo quando o switcher não está renderizado.
   * O shell é o dono do tema, então não pode depender de `withThemeSwitcher`
   * para que `Modal`, `Alert` e páginas fora do shell herdem os tokens.
   * Idempotente com a escrita do `ThemeSwitcher` — mesmo valor, mesma chave.
   */
  useEffect(() => {
    document.documentElement.dataset.theme = themeMode;
  }, [themeMode]);

  const navigationTheme = useMemo(() => buildNavigationTheme(themeMode), [themeMode]);

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
      className="grid min-h-screen grid-rows-[auto_1fr] text-[color:var(--app-text,#0f172a)]"
      style={{ ...navigationTheme.vars, background: navigationTheme.background } as React.CSSProperties}
    >
      <Navbar
        tone={tone}
        icon={iconLogo}
        title={translatedTitle}
        variant={themeMode}
        subtitle={translatedSubtitle}
        isAuthenticated={isAuthenticated}
        onVariantChange={handleThemeChange}
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