import React from 'react';
import { render, screen } from '@testing-library/react';

import { UIProvider } from '../../src';

import { mergeLocaleFiles } from '@fintech/i18n';

const mockFilterLocales = {
  'pt-BR': {
    filter: {
      apply: 'Aplicar',
      clear: 'Limpar',
    },
  },
}

const mockFormLocales = {
  'pt-BR': {
    form: {
      action: {
        submit: 'Enviar',
      }
    },
  },
};

jest.mock('@fintech/i18n', () => ({
  I18nProvider: ({
    children,
    locales,
  }: {
    children: React.ReactNode;
    locales?: unknown;
  }) => (
    <div
      data-testid="i18n-provider"
      data-locales={JSON.stringify(locales)}
    >
      {children}
    </div>
  ),
  mergeLocaleFiles: jest.fn((locales) => locales),
}));

jest.mock('../../src/components', () => ({
  BreadcrumbProvider: ({
    children,
  }: {
    children: React.ReactNode;
  }) => (
    <div data-testid="breadcrumb-provider">
      {children}
    </div>
  ),
  AlertProvider: ({
    children,
  }: {
    children: React.ReactNode;
  }) => (
    <div data-testid="alert-provider">
      {children}
    </div>
  ),
  filterLocales: {
    'pt-BR': {
      filter: {
        apply: 'Aplicar',
        clear: 'Limpar',
      },
    },
  },
  formLocales: {
    'pt-BR': {
      form: {
        action: {
          submit: 'Enviar',
        }
      },
    },
  },
}));

jest.mock('../../src/providers/ui-context', () => ({
  UIContextProvider: ({
    children,
  }: {
    children: React.ReactNode;
  }) => (
    <div data-testid="ui-context-provider">
      {children}
    </div>
  ),
}));

describe('UIProvider', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render children inside providers', () => {
    render(
      <UIProvider>
        <span>Content</span>
      </UIProvider>,
    );

    expect(screen.getByText('Content')).toBeInTheDocument();

    expect(
      screen.getByTestId('i18n-provider'),
    ).toBeInTheDocument();

    expect(
      screen.getByTestId('breadcrumb-provider'),
    ).toBeInTheDocument();
  });


  it('should merge default locales with custom locales', () => {
    const customLocales = {
      'pt-BR': {
        user: {
          name: 'Nome',
        },
      },
    };

    render(
      <UIProvider locales={customLocales}>
        <span>Content</span>
      </UIProvider>,
    );


    expect(mergeLocaleFiles)
    .toHaveBeenCalledWith([
      mockFilterLocales,
      mockFormLocales,
      customLocales,
    ]);
  });


  it('should use only default locales when custom locales are not provided', () => {
    render(
      <UIProvider>
        <span>Content</span>
      </UIProvider>,
    );


    expect(mergeLocaleFiles)
    .toHaveBeenCalledWith([
      mockFilterLocales,
      mockFormLocales,
    ]);
  });


  it('should pass merged locales to I18nProvider', () => {
    const customLocales = {
      'pt-BR': {
        user: {
          name: 'Nome',
        },
      },
    };

    render(
      <UIProvider locales={customLocales}>
        <span>Content</span>
      </UIProvider>,
    );


    const provider = screen.getByTestId('i18n-provider');

    expect(provider)
    .toHaveAttribute(
      'data-locales',
      JSON.stringify([
        mockFilterLocales,
        mockFormLocales,
        customLocales,
      ]),
    );
  });
});