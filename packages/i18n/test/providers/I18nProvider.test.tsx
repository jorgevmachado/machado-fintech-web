import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { StrictMode } from 'react';
import { renderToString } from 'react-dom/server';
import { hydrateRoot } from 'react-dom/client';

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
  it('renders application translations on the server and hydrates without mismatches', async () => {
    const TranslationProbe = () => {
      const { t } = useAppTranslation();
      return <p>{t('hydrationProbe.title')}</p>;
    };
    const app = (
      <I18nProvider locales={{
        'en-US': { hydrationProbe: { title: 'Sign in to your account' } },
        'pt-BR': { hydrationProbe: { title: 'Entre na sua conta' } },
      }}>
        <TranslationProbe />
      </I18nProvider>
    );
    const container = document.createElement('div');
    const onRecoverableError = jest.fn();
    const html = renderToString(app);
    expect(html).toContain('Sign in to your account');
    expect(i18n.exists('hydrationProbe.title')).toBe(false);

    const otherHtml = renderToString(
      <I18nProvider locales={{ 'en-US': { hydrationProbe: { title: 'Another application' } } }}>
        <TranslationProbe />
      </I18nProvider>,
    );
    expect(otherHtml).toContain('Another application');
    expect(renderToString(app)).toBe(html);

    window.localStorage.setItem(LOCALE_STORAGE_KEY, 'pt-BR');
    container.innerHTML = html;
    document.body.appendChild(container);
    let root: ReturnType<typeof hydrateRoot> | undefined;

    try {
      await act(async () => {
        root = hydrateRoot(container, app, { onRecoverableError });
      });
      expect(onRecoverableError).not.toHaveBeenCalled();
      expect(container).toHaveTextContent('Entre na sua conta');
    } finally {
      act(() => root?.unmount());
      container.remove();
    }
  });

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
    const TranslationProbe = () => {
      const { t } = useAppTranslation();
      return <span>{t('navigation.home')}</span>;
    };

    render(
      <I18nProvider locales={locales}>
        <LocaleProbe />
        <TranslationProbe />
      </I18nProvider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId('locale')).toHaveTextContent('en-US');
    });

    expect(screen.getByText('Home')).toBeInTheDocument();
  });

  it('renders resources in StrictMode and updates translations when locales change', async () => {
    const TranslationProbe = () => {
      const { t } = useAppTranslation();
      return <span data-testid='custom-message'>{t('lintProbe.title')}</span>;
    };
    const locales = { 'en-US': { lintProbe: { title: 'Initial message' } } };

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
  });

  it('persists manual locale changes to localStorage', async () => {
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
