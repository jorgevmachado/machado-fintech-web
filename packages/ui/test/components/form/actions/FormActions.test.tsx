import React from 'react';

import {
  render,
  screen,
} from '@testing-library/react';

import { JUSTIFY_CLASS_MAP } from '@fintech/theme';

import { FormActions, type FormActionsProps } from '../../../../src/components/form/actions';

jest.mock('../../../../src/components/button', () => ({
  __esModule: true,

  default: ({
    role,
    children,
    type,
    tone,
    onClick,
    disabled,
    'aria-label': ariaLabel,
  }: { children?: React.ReactNode; role?: string; type: string; tone: string; onClick?: () => void; disabled?: boolean; 'aria-label'?: string }) => ((
    <button
      role={role ?? 'button'}
      type={type}
      data-testid={`button-${children}`}
      data-tone={tone}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
    >
      {children && <span data-testid={`button-children-${type}`}>{children}</span>}
    </button>
  )),
}));


describe('FormActions', () => {
  const submit = {
    children: 'Salvar',
  };

  describe('render', () => {
    it('should render the submit button', () => {
      render(
        <FormActions
          submit={submit}
        />
      );

      expect(
        screen.getByRole('button', {
          name: 'Salvar',
        })
      ).toBeInTheDocument();
    });

    it('should render the cancel button when provided', () => {
      render(
        <FormActions
          submit={submit}
          cancel={{
            children: 'Cancelar',
          }}
        />
      );

      expect(
        screen.getByRole('button', {
          name: 'Cancelar',
        })
      ).toBeInTheDocument();

      expect(
        screen.getByRole('button', {
          name: 'Salvar',
        })
      ).toBeInTheDocument();
    });

    it('should not render the cancel button when it is not provided', () => {
      render(
        <FormActions
          submit={submit}
        />
      );

      expect(
        screen.queryByRole('button', {
          name: 'Cancelar',
        })
      ).not.toBeInTheDocument();
    });
  });

  describe('button types', () => {
    it('should render the submit button with type submit', () => {
      render(
        <FormActions
          submit={submit}
        />
      );

      expect(
        screen.getByRole('button', {
          name: 'Salvar',
        })
      ).toHaveAttribute('type', 'submit');
    });

    it('should render the cancel button with type button', () => {
      render(
        <FormActions
          submit={submit}
          cancel={{
            children: 'Cancelar',
          }}
        />
      );

      expect(
        screen.getByRole('button', {
          name: 'Cancelar',
        })
      ).toHaveAttribute('type', 'button');
    });

    it('should override the cancel button type when provided', () => {
      render(
        <FormActions
          submit={submit}
          cancel={{
            children: 'Cancelar',
            type: 'submit',
          }}
        />
      );

      expect(
        screen.getByRole('button', {
          name: 'Cancelar',
        })
      ).toHaveAttribute('type', 'button');
    });

    it('should override the submit button type when provided', () => {
      render(
        <FormActions
          submit={{
            children: 'Salvar',
            type: 'button',
          }}
        />
      );

      expect(
        screen.getByRole('button', {
          name: 'Salvar',
        })
      ).toHaveAttribute('type', 'submit');
    });
  });

  describe('button props', () => {
    it('should forward submit button props', () => {
      render(
        <FormActions
          submit={{
            children: 'Salvar',
            disabled: true,
            'aria-label': 'Salvar formulário',
          }}
        />
      );

      const button = screen.getByRole('button', {
        name: 'Salvar formulário',
      });

      expect(button).toBeDisabled();
    });

    it('should forward submit button props without children', () => {
      render(
        <FormActions
          submit={{
            disabled: true,
            'aria-label': 'Salvar formulário',
          }}
        />
      );

      const button = screen.getByRole('button', {
        name: 'Salvar formulário',
      });

      expect(button).toBeDisabled();
      expect(screen.queryByTestId('button-children-submit')).not.toBeInTheDocument();
    });

    it('should forward cancel button props', () => {
      render(
        <FormActions
          submit={submit}
          cancel={{
            children: 'Cancelar',
            disabled: true,
          }}
        />
      );

      expect(
        screen.getByRole('button', {
          name: 'Cancelar',
        })
      ).toBeDisabled();
    });

    it('should forward cancel button props without children', () => {
      render(
        <FormActions
          submit={submit}
          cancel={{
            disabled: true,
          }}
        />
      );
      expect(screen.queryByTestId('button-children-button')).not.toBeInTheDocument();
    });
  });

  describe('cancel button default tone', () => {
    it('should use danger tone by default', () => {
      render(
        <FormActions
          submit={submit}
          cancel={{
            children: 'Cancelar',
          }}
        />
      );

      const button = screen.getByRole('button', {
        name: 'Cancelar',
      });

      expect(button).toHaveAttribute(
        'data-tone',
        'danger'
      );
    });

    it('should preserve the configured cancel button tone', () => {
      render(
        <FormActions
          submit={submit}
          cancel={{
            children: 'Cancelar',
            tone: 'secondary',
          }}
        />
      );

      const button = screen.getByRole('button', {
        name: 'Cancelar',
      });

      expect(button).toHaveAttribute(
        'data-tone',
        'secondary'
      );
    });
  });

  describe('layout', () => {
    it('should use between justification by default', () => {
      const { container } = render(
        <FormActions
          submit={submit}
        />
      );

      const actions = container.firstElementChild;

      expect(actions).toHaveClass('flex');
      expect(actions).toHaveClass('flex-row');
      expect(actions).toHaveClass('gap-1');
      expect(actions).toHaveClass(
        JUSTIFY_CLASS_MAP.between
      );
    });

    it('should apply the configured justification', () => {
      const { container } = render(
        <FormActions
          submit={submit}
          justify="end"
        />
      );

      const actions = container.firstElementChild;

      expect(actions).toHaveClass(
        JUSTIFY_CLASS_MAP.end
      );

      expect(actions).not.toHaveClass(
        JUSTIFY_CLASS_MAP.between
      );
    });

    it('should apply the custom className', () => {
      const { container } = render(
        <FormActions
          submit={submit}
          className="custom-actions"
        />
      );

      expect(container.firstElementChild).toHaveClass(
        'custom-actions'
      );
    });

    it('should combine custom className with the layout classes', () => {
      const { container } = render(
        <FormActions
          submit={submit}
          justify="end"
          className="custom-actions"
        />
      );

      const actions = container.firstElementChild;

      expect(actions).toHaveClass('flex');
      expect(actions).toHaveClass('flex-row');
      expect(actions).toHaveClass('gap-1');
      expect(actions).toHaveClass(
        JUSTIFY_CLASS_MAP.end
      );
      expect(actions).toHaveClass('custom-actions');
    });
  });

  describe('callbacks', () => {
    it('should call the cancel button onClick handler', () => {
      const onClick = jest.fn();

      render(
        <FormActions
          submit={submit}
          cancel={{
            children: 'Cancelar',
            onClick,
          }}
        />
      );

      screen.getByRole('button', {
        name: 'Cancelar',
      }).click();

      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('should call the submit button onClick handler', () => {
      const onClick = jest.fn();

      render(
        <FormActions
          submit={{
            children: 'Salvar',
            onClick,
          }}
        />
      );

      screen.getByRole('button', {
        name: 'Salvar',
      }).click();

      expect(onClick).toHaveBeenCalledTimes(1);
    });
  });
});