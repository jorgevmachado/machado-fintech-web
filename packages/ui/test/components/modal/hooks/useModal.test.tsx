import {
  act,
  fireEvent,
  render,
  renderHook,
  screen,
} from '@testing-library/react';
import {
  describe,
  expect,
  it,
  jest,
} from '@jest/globals';

import { useModal } from '../../../../src/components/modal';

describe('useModal', () => {
  it('should start closed', () => {
    const { result } = renderHook(() => useModal());

    expect(result.current.open).toBe(false);
    expect(result.current.modal).toBeNull();
  });

  it('should open the modal', () => {
    const { result } = renderHook(() => useModal());

    act(() => {
      result.current.openModal({
        title: 'Teste Modal',
        children: 'Conteúdo do modal',
      });
    });

    expect(result.current.open).toBe(true);
    expect(result.current.modal).not.toBeNull();
  });

  it('should render the modal title', () => {
    const { result } = renderHook(() => useModal());

    act(() => {
      result.current.openModal({
        title: 'Título do Modal',
        children: 'Conteúdo',
      });
    });

    render(result.current.modal);

    expect(
      screen.getByRole('heading', {
        name: 'Título do Modal',
      }),
    ).toBeInTheDocument();
  });

  it('should render the modal children', () => {
    const { result } = renderHook(() => useModal());

    act(() => {
      result.current.openModal({
        title: 'Teste Modal',
        children: 'Conteúdo do modal',
      });
    });

    render(result.current.modal);

    expect(
      screen.getByText('Conteúdo do modal'),
    ).toBeInTheDocument();
  });

  it('should render the modal footer', () => {
    const onPrimaryClick = jest.fn();
    const onSecondaryClick = jest.fn();

    const { result } = renderHook(() => useModal());

    act(() => {
      result.current.openModal({
        title: 'Teste Modal',
        children: 'Conteúdo',
        footer: {
          primary: {
            children: 'Salvar',
            onClick: onPrimaryClick,
          },
          secondary: {
            children: 'Cancelar',
            onClick: onSecondaryClick,
          },
        },
      });
    });

    render(result.current.modal);

    expect(
      screen.getByRole('button', {
        name: 'Salvar',
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole('button', {
        name: 'Cancelar',
      }),
    ).toBeInTheDocument();
  });

  it('should close the modal', () => {
    const { result } = renderHook(() => useModal());

    act(() => {
      result.current.openModal({
        title: 'Teste Modal',
        children: 'Conteúdo',
      });
    });

    expect(result.current.open).toBe(true);

    act(() => {
      result.current.closeModal();
    });

    expect(result.current.open).toBe(false);
    expect(result.current.modal).toBeNull();
  });

  it('should replace the current modal when opening another one', () => {
    const { result } = renderHook(() => useModal());

    act(() => {
      result.current.openModal({
        title: 'Primeiro Modal',
        children: 'Primeiro conteúdo',
      });
    });

    act(() => {
      result.current.openModal({
        title: 'Segundo Modal',
        children: 'Segundo conteúdo',
      });
    });

    expect(result.current.open).toBe(true);

    render(result.current.modal);

    expect(
      screen.getByRole('heading', {
        name: 'Segundo Modal',
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByText('Segundo conteúdo'),
    ).toBeInTheDocument();

    expect(
      screen.queryByRole('heading', {
        name: 'Primeiro Modal',
      }),
    ).not.toBeInTheDocument();
  });

  it('should close the modal when the close button is clicked', () => {
    const { result } = renderHook(() => useModal());

    act(() => {
      result.current.openModal({
        title: 'Teste Modal',
        children: 'Conteúdo',
      });
    });

    const { rerender } = render(
      result.current.modal,
    );

    fireEvent.click(
      screen.getByRole('button', {
        name: 'Close modal',
      }),
    );

    rerender(result.current.modal);

    expect(result.current.open).toBe(false);
  });
});