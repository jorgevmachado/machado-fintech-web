import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { StrictMode } from 'react';

import { I18nProvider, LOCALE_STORAGE_KEY, useAppTranslation, useLocale } from '../../src';

import { i18n } from '../../src/instance';


const setNavigatorLanguage = (value: string) => {
  Object.defineProperty(window.navigator, 'language', {
    configurable: true,
    value,
  });
};

const LocaleProbe = () => {
  const { locale, setLocale, t } = useAppTranslation();
  return (
    <div>
      <span data-testid='locale'>{locale}</span>
      <span data-testid='common-save'>{t('common.save')}</span>
      <button type='button' onClick={() => setLocale('es-UE')}>
        switch-es
      </button>
    </div>
  );
};

describe('I18nProvider', () => {
  beforeEach(() => {
    window.localStorage.clear();
    setNavigatorLanguage('en-US');
    document.documentElement.lang = '';
  });

  it('prioritizes persisted locale over browser locale', async () => {
    window.localStorage.setItem(LOCALE_STORAGE_KEY, 'pt-BR');
    setNavigatorLanguage('es-UE');

    const locales = {
      'en-US': {
        'navigation': {
          'home': 'Home'
        }
      }
    }

    render(
      <I18nProvider locales={locales}>
        <LocaleProbe />
      </I18nProvider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId('locale')).toHaveTextContent('pt-BR');
    });
  });

  it('falls back to en when browser locale is unsupported', async () => {
    setNavigatorLanguage('fr-FR');

    render(
      <I18nProvider>
        <LocaleProbe />
      </I18nProvider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId('locale')).toHaveTextContent('en');
      expect(screen.getByTestId('common-save')).toHaveTextContent('Save');
    });
  });

  it('skips undefined locale resources while registering valid translations', async () => {
    const locales = {
      'pt-BR': undefined,
      'en-US': { navigation: { home: 'Home' } },
    };
    const addResourceBundleSpy = jest.spyOn(i18n, 'addResourceBundle');

    try {
      render(
        <I18nProvider locales={locales}>
          <LocaleProbe />
        </I18nProvider>,
      );

      await waitFor(() => {
        expect(screen.getByTestId('locale')).toHaveTextContent('en-US');
      });

      expect(i18n.t('navigation.home', { lng: 'en-US' })).toBe('Home');
      expect(addResourceBundleSpy).toHaveBeenCalledWith(
        'en-US', 'translation', locales['en-US'], true, true,
      );
      expect(addResourceBundleSpy).not.toHaveBeenCalledWith(
        'pt-BR', expect.anything(), undefined, expect.anything(), expect.anything(),
      );
    } finally {
      addResourceBundleSpy.mockRestore();
    }
  });

  it('registers resources once in StrictMode and updates translations when locales change', async () => {
    const TranslationProbe = () => {
      const { t } = useAppTranslation();
      return <span data-testid='custom-message'>{t('lintProbe.title')}</span>;
    };
    const locales = { 'en-US': { lintProbe: { title: 'Initial message' } } };
    const addResourceBundleSpy = jest.spyOn(i18n, 'addResourceBundle');

    try {
      const { rerender } = render(
        <StrictMode>
          <I18nProvider locales={locales}>
            <TranslationProbe />
          </I18nProvider>
        </StrictMode>,
      );

      await waitFor(() => {
        expect(screen.getByTestId('custom-message')).toHaveTextContent('Initial message');
      });
      expect(addResourceBundleSpy.mock.calls.filter(
        ([locale, namespace]) => locale === 'en-US' && namespace === 'translation',
      )).toHaveLength(1);

      rerender(
        <StrictMode>
          <I18nProvider locales={{ 'en-US': { lintProbe: { title: 'Updated message' } } }}>
            <TranslationProbe />
          </I18nProvider>
        </StrictMode>,
      );

      await waitFor(() => {
        expect(screen.getByTestId('custom-message')).toHaveTextContent('Updated message');
      });
    } finally {
      addResourceBundleSpy.mockRestore();
    }
  });

  it('persists manual locale changes to localStorage', async () => {
    const changeLanguageSpy = jest.spyOn(i18n, 'changeLanguage');

    render(
      <I18nProvider>
        <LocaleProbe />
      </I18nProvider>,
    );

    fireEvent.click(screen.getByRole('button', { name: 'switch-es' }));

    await waitFor(() => {
      expect(screen.getByTestId('locale')).toHaveTextContent('es-UE');
      expect(window.localStorage.getItem(LOCALE_STORAGE_KEY)).toBe('es-UE');
      expect(document.documentElement.lang).toBe('es-UE');
    });

    expect(changeLanguageSpy).toHaveBeenCalledWith('en-US');
    expect(changeLanguageSpy).toHaveBeenCalledWith('es-UE');
  });

  it('falls back to the default locale context outside the provider', () => {
    const OutsideProbe = () => {
      const { locale, supportedLocales, setLocale } = useLocale();

      return (
        <div>
          <span data-testid='outside-locale'>{locale}</span>
          <span data-testid='outside-locales'>{supportedLocales.join(',')}</span>
          <button type='button' onClick={() => setLocale('es-UE')}>
            noop
          </button>
        </div>
      );
    };

    render(<OutsideProbe />);

    expect(screen.getByTestId('outside-locale')).toHaveTextContent('en-US');
    expect(screen.getByTestId('outside-locales')).toHaveTextContent('en-US,pt-BR,es-UE');
    fireEvent.click(screen.getByRole('button', { name: 'noop' }));
    expect(screen.getByTestId('outside-locale')).toHaveTextContent('en-US');
  });
});
