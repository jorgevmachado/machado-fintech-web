import {
  fireEvent,
  render,
  screen,
} from '@testing-library/react';
import {
  describe,
  expect,
  it,
  jest,
} from '@jest/globals';

import { ModalFooter } from '../../../../src/components/modal/footer';

describe('ModalFooter', () => {
  it('should render the primary button', () => {
    render(
      <ModalFooter
        onClose={jest.fn()}
        primary={{
          children: 'Salvar',
        }}
      />,
    );

    expect(
      screen.getByRole('button', {
        name: 'Salvar',
      }),
    ).toBeInTheDocument();
  });

  it('should render the secondary button when provided', () => {
    render(
      <ModalFooter
        onClose={jest.fn()}
        primary={{
          children: 'Salvar',
        }}
        secondary={{
          children: 'Cancelar',
        }}
      />,
    );

    expect(
      screen.getByRole('button', {
        name: 'Cancelar',
      }),
    ).toBeInTheDocument();
  });

  it('should not render the secondary button when not provided', () => {
    render(
      <ModalFooter
        onClose={jest.fn()}
        primary={{
          children: 'Salvar',
        }}
      />,
    );

    expect(
      screen.queryByRole('button', {
        name: 'Cancelar',
      }),
    ).not.toBeInTheDocument();
  });

  it('should call primary onClick when provided', () => {
    const onClose = jest.fn();
    const onPrimaryClick = jest.fn();

    render(
      <ModalFooter
        onClose={onClose}
        primary={{
          children: 'Salvar',
          onClick: onPrimaryClick,
        }}
      />,
    );

    fireEvent.click(
      screen.getByRole('button', {
        name: 'Salvar',
      }),
    );

    expect(onPrimaryClick).toHaveBeenCalledTimes(1);
    expect(onClose).not.toHaveBeenCalled();
  });

  it('should call onClose when primary onClick is not provided', () => {
    const onClose = jest.fn();

    render(
      <ModalFooter
        onClose={onClose}
        primary={{
          children: 'Salvar',
        }}
      />,
    );

    fireEvent.click(
      screen.getByRole('button', {
        name: 'Salvar',
      }),
    );

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('should call secondary onClick when provided', () => {
    const onClose = jest.fn();
    const onSecondaryClick = jest.fn();

    render(
      <ModalFooter
        onClose={onClose}
        primary={{
          children: 'Salvar',
        }}
        secondary={{
          children: 'Cancelar',
          onClick: onSecondaryClick,
        }}
      />,
    );

    fireEvent.click(
      screen.getByRole('button', {
        name: 'Cancelar',
      }),
    );

    expect(onSecondaryClick).toHaveBeenCalledTimes(1);
    expect(onClose).not.toHaveBeenCalled();
  });

  it('should call onClose when secondary onClick is not provided', () => {
    const onClose = jest.fn();

    render(
      <ModalFooter
        onClose={onClose}
        primary={{
          children: 'Salvar',
        }}
        secondary={{
          children: 'Cancelar',
        }}
      />,
    );

    fireEvent.click(
      screen.getByRole('button', {
        name: 'Cancelar',
      }),
    );

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('should use danger tone for secondary button by default', () => {
    render(
      <ModalFooter
        onClose={jest.fn()}
        primary={{
          children: 'Salvar',
        }}
        secondary={{
          children: 'Excluir',
        }}
      />,
    );

    expect(
      screen.getByRole('button', {
        name: 'Excluir',
      }),
    ).toHaveClass('bg-red-600');
  });

  it('should preserve the secondary button tone when provided', () => {
    render(
      <ModalFooter
        onClose={jest.fn()}
        primary={{
          children: 'Salvar',
        }}
        secondary={{
          children: 'Cancelar',
          tone: 'neutral',
        }}
      />,
    );

    expect(
      screen.getByRole('button', {
        name: 'Cancelar',
      }),
    ).not.toHaveClass('bg-red-600');
  });

  it('should align the footer to the right by default', () => {
    const { container } = render(
      <ModalFooter
        onClose={jest.fn()}
        primary={{
          children: 'Salvar',
        }}
      />,
    );

    expect(container.firstChild).toHaveClass('justify-end');
  });

  it('should align the footer to the left', () => {
    const { container } = render(
      <ModalFooter
        onClose={jest.fn()}
        primary={{
          children: 'Salvar',
        }}
        layout={{
          align: 'left',
        }}
      />,
    );

    expect(container.firstChild).toHaveClass('justify-start');
  });

  it('should center the footer', () => {
    const { container } = render(
      <ModalFooter
        onClose={jest.fn()}
        primary={{
          children: 'Salvar',
        }}
        layout={{
          align: 'center',
        }}
      />,
    );

    expect(container.firstChild).toHaveClass('justify-center');
  });

  it('should use normal button order by default', () => {
    const { container } = render(
      <ModalFooter
        onClose={jest.fn()}
        primary={{
          children: 'Salvar',
        }}
        secondary={{
          children: 'Cancelar',
        }}
      />,
    );

    expect(container.firstChild).toHaveClass('flex-row');
    expect(container.firstChild).not.toHaveClass('flex-row-reverse');
  });

  it('should reverse button order when invert is enabled', () => {
    const { container } = render(
      <ModalFooter
        onClose={jest.fn()}
        primary={{
          children: 'Salvar',
        }}
        secondary={{
          children: 'Cancelar',
        }}
        layout={{
          invert: true,
        }}
      />,
    );

    expect(container.firstChild).toHaveClass('flex-row-reverse');
  });
});