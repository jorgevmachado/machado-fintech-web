import { fireEvent, render, screen, waitFor } from '@testing-library/react';

let mockLocale = 'en';

jest.mock('@fintech/i18n', () => {
  const React = require('react');

  const LOCALE_OPTIONS = [
    { value: 'pt-BR', flag: '🇧🇷', shortLabel: 'PT', labelKey: 'language.ptBR' },
    { value: 'en', flag: '🇺🇸', shortLabel: 'EN', labelKey: 'language.en' },
    { value: 'es', flag: '🇪🇸', shortLabel: 'ES', labelKey: 'language.es' },
  ];

  const tByLocale: Record<string, Record<string, string>> = {
    en: {
      'language.selector': 'Language selector',
      'language.ptBR': 'Portuguese',
      'language.en': 'English',
      'language.es': 'Spanish',
    },
    es: {
      'language.selector': 'Selector de idioma',
      'language.ptBR': 'Portugués',
      'language.en': 'Inglés',
      'language.es': 'Español',
    },
  };

  return {
    LOCALE_OPTIONS,

    LOCALE_STORAGE_KEY: 'machado.locale',

    I18nProvider: ({ children }: { children: React.ReactNode }) => children,

    useAppTranslation: () => {
      const [locale, setLocaleState] = React.useState(mockLocale);

      const t = (
        key: string,
        options?: { language?: string },
      ) => {
        if (key === 'language.changeTo') {
          return `Change language to ${options?.language}`;
        }

        return tByLocale[locale]?.[key] ?? key;
      };

      return {
        locale,
        setLocale: (nextLocale: string) => {
          window.localStorage.setItem('machado.locale', nextLocale);
          setLocaleState(nextLocale);
        },
        t,
      };
    },
  };
});

import { LOCALE_STORAGE_KEY, I18nProvider } from '@fintech/i18n';

import { LanguageSwitcher } from '../../src';

const setNavigatorLanguage = (value: string) => {
  Object.defineProperty(window.navigator, 'language', {
    configurable: true,
    value,
  });
};

describe('LanguageSwitcher', () => {
  beforeEach(() => {
    mockLocale = 'en';
    window.localStorage.clear();
    setNavigatorLanguage('en-US');
  });

  it('renders supported language options and updates active locale', async () => {
    render(
      <I18nProvider>
        <LanguageSwitcher variant="dark" />
      </I18nProvider>,
    );

    const trigger = screen.getByRole('button', { name: 'Language selector' });
    expect(trigger).toBeInTheDocument();
    expect(screen.queryByTitle('Portuguese')).not.toBeInTheDocument();

    fireEvent.click(trigger);

    expect(screen.getByRole('listbox', { name: 'Language selector' })).toBeInTheDocument();
    expect(screen.getByTitle('Portuguese')).toBeInTheDocument();
    expect(screen.getByTitle('English')).toBeInTheDocument();
    expect(screen.getByTitle('Spanish')).toBeInTheDocument();

    fireEvent.click(screen.getByTitle('Spanish'));

    await waitFor(() => {
      expect(screen.queryByRole('listbox', { name: 'Language selector' })).not.toBeInTheDocument();
      expect(window.localStorage.getItem(LOCALE_STORAGE_KEY)).toBe('es');
    });

    fireEvent.click(screen.getByRole('button', { name: 'Selector de idioma' }));

    await waitFor(() => {
      expect(screen.getByTitle('Español')).toHaveAttribute('aria-selected', 'true');
    });
  });

  it('closes the dropdown on outside click and on Escape', () => {
    render(
      <I18nProvider>
        <div>
          <LanguageSwitcher variant="light" />
          <button type='button'>outside</button>
        </div>
      </I18nProvider>,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Language selector' }));
    expect(screen.getByRole('listbox', { name: 'Language selector' })).toBeInTheDocument();

    fireEvent.mouseDown(screen.getByRole('button', { name: 'outside' }));
    expect(screen.queryByRole('listbox', { name: 'Language selector' })).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Language selector' }));
    expect(screen.getByRole('listbox', { name: 'Language selector' })).toBeInTheDocument();

    fireEvent.keyDown(document, { key: 'Escape' });
    expect(screen.queryByRole('listbox', { name: 'Language selector' })).not.toBeInTheDocument();
  });

  it('keeps the dropdown open on inside click and on non-Escape keys', () => {
    render(
      <I18nProvider>
        <LanguageSwitcher variant="light" />
      </I18nProvider>,
    );

    const trigger = screen.getByRole('button', { name: 'Language selector' });

    fireEvent.click(trigger);
    expect(screen.getByRole('listbox', { name: 'Language selector' })).toBeInTheDocument();

    fireEvent.mouseDown(trigger);
    expect(screen.getByRole('listbox', { name: 'Language selector' })).toBeInTheDocument();

    fireEvent.keyDown(document, { key: 'Enter' });
    expect(screen.getByRole('listbox', { name: 'Language selector' })).toBeInTheDocument();
  });

  it('falls back to first locale option when locale is unsupported', () => {
    mockLocale = 'fr';

    render(
      <I18nProvider>
        <LanguageSwitcher variant="dark" />
      </I18nProvider>,
    );

    expect(screen.getByText('🇧🇷')).toBeInTheDocument();
  });
});
