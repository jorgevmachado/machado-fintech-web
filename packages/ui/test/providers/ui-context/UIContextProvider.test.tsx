import {
  render,
  screen,
} from '@testing-library/react';

import { useAppTranslation } from '@fintech/i18n';

import { UIContextProvider, useUI } from '../../../src/providers/ui-context';

jest.mock('@fintech/i18n', () => ({
  useAppTranslation: jest.fn(),
}));

function Consumer() {
  const { locale } = useUI();

  return <span>{locale}</span>;
}

describe('UIContextProvider', () => {
  const mockedUseAppTranslation =
    jest.mocked(useAppTranslation);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should provide the current locale', () => {
    mockedUseAppTranslation.mockReturnValue({
      locale: 'pt-BR',
    } as ReturnType<typeof useAppTranslation>);

    render(
      <UIContextProvider>
        <Consumer />
      </UIContextProvider>,
    );

    expect(
      screen.getByText('pt-BR'),
    ).toBeInTheDocument();
  });

  it('should provide the updated locale', () => {
    mockedUseAppTranslation.mockReturnValue({
      locale: 'pt-BR',
    } as ReturnType<typeof useAppTranslation>);

    const { rerender } = render(
      <UIContextProvider>
        <Consumer />
      </UIContextProvider>,
    );

    expect(
      screen.getByText('pt-BR'),
    ).toBeInTheDocument();

    mockedUseAppTranslation.mockReturnValue({
      locale: 'en-US',
    } as ReturnType<typeof useAppTranslation>);

    rerender(
      <UIContextProvider>
        <Consumer />
      </UIContextProvider>,
    );

    expect(
      screen.getByText('en-US'),
    ).toBeInTheDocument();
  });
});